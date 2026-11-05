import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';

const moduleRequire = createRequire(import.meta.url);
function load(file, mocks = {}, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(code, { exports, require: id => mocks[id] ?? moduleRequire(id), ...globals }, { filename: file });
  return exports;
}
const snapshot = (votes = 4) => ({
  items: [{ id: 'a', slug: 'a', shortTitle: 'A', title: 'A', brief: '', displayOrder: 1, rank: 1, voteCount: votes }],
  totalVotes: votes, totalDestinations: 1,
});
function harness(refresh = async () => {}) {
  const timers = new Map();
  const sources = [];
  let next = 0;
  class Source {
    constructor(url) { this.url = url; this.listeners = {}; sources.push(this); }
    addEventListener(name, handler) { this.listeners[name] = handler; }
    removeEventListener(name) { delete this.listeners[name]; }
    close() { this.closed = true; }
    emit(value) { this.listeners.rankings({ data: typeof value === 'string' ? value : JSON.stringify(value) }); }
  }
  const lib = load('src/lib/ranking-stream.ts', {}, {
    EventSource: Source, AbortController,
    setTimeout: fn => { timers.set(++next, fn); return next; },
    clearTimeout: id => timers.delete(id),
  });
  const snapshots = [], connections = [];
  const stop = lib.startRankingStream({ url: 'https://backend/rankings/stream', refresh,
    applySnapshot: s => snapshots.push(s), setConnected: s => connections.push(s),
  });
  return { ...lib, timers, sources, snapshots, connections, stop,
    tick: () => { const [id, fn] = timers.entries().next().value; timers.delete(id); return fn(); },
  };
}
test('named snapshots replace ranking; heartbeat silence does not start polling', () => {
  const h = harness();
  assert.equal(h.sources.length, 1);
  assert.ok(h.sources[0].listeners.rankings);
  h.sources[0].emit(snapshot());
  assert.equal(h.snapshots[0].totalVotes, 4);
  assert.equal(h.timers.size, 0);
  h.sources[0].emit(snapshot(5));
  assert.equal(h.snapshots[1].totalVotes, 5);
  assert.equal(h.sources.length, 1);
  h.stop();
});
test('malformed payload and disconnect preserve data and use one fallback timer', () => {
  const h = harness();
  h.sources[0].emit(snapshot());
  for (const bad of ['{', '{}', '{"items":[null],"totalVotes":0,"totalDestinations":1}']) h.sources[0].emit(bad);
  h.sources[0].onerror(); h.sources[0].onerror();
  assert.equal(h.snapshots.length, 1);
  assert.equal(h.connections.at(-1), false);
  assert.equal(h.timers.size, 1);
  assert.equal(h.sources.length, 1);
  h.stop();
});
test('fallback does not overlap; a valid SSE snapshot aborts HTTP and stops polling', async () => {
  let finish, signal;
  const h = harness(s => { signal = s; return new Promise(resolve => { finish = resolve; }); });
  const pending = h.tick();
  h.sources[0].onerror();
  assert.equal(h.timers.size, 0);
  h.sources[0].emit(snapshot());
  assert.equal(signal.aborted, true);
  finish(); await pending;
  assert.equal(h.timers.size, 0);
  h.stop();
});
test('cleanup closes stream, clears timers, aborts requests and prevents rescheduling', async () => {
  let finish, signal;
  const h = harness(s => { signal = s; return new Promise(resolve => { finish = resolve; }); });
  const pending = h.tick();
  h.stop();
  assert.equal(signal.aborted, true);
  assert.equal(h.sources[0].closed, true);
  assert.equal(h.sources[0].listeners.rankings, undefined);
  finish(); await pending;
  assert.equal(h.timers.size, 0);
});
test('fallback retries serially when the backend is unavailable', async () => {
  let calls = 0;
  const h = harness(async () => { calls++; throw Error('offline'); });
  await h.tick(); await h.tick();
  assert.equal(calls, 2);
  assert.equal(h.timers.size, 1);
  h.stop();
  assert.equal(h.timers.size, 0);
});
test('store uses one snapshot for totals/top3 and ignores stale HTTP after SSE', async () => {
  let resolve;
  const { isRankingSnapshot } = load('src/lib/ranking-stream.ts');
  const { useVotingStore: store } = load('src/stores/use-voting-store.ts', {
    '@/api/rankings': { getRankings: () => new Promise(r => { resolve = r; }) },
    '@/api/errors': { apiErrorMessage: e => e.message },
    '@/data/destinations': { toVotingDestination: d => ({ ...d, votes: d.voteCount }) },
    '@/lib/ranking-stream': { isRankingSnapshot },
  });
  const pending = store.getState().refreshRankings();
  store.getState().applyRankings(snapshot(8));
  resolve(snapshot(4)); await pending;
  assert.equal(store.getState().totalVotes, 8);
  assert.equal(store.getState().topRankings[0].votes, 8);
  assert.equal(store.getState().rankingLoading, false);
});
test('failed initial fetch keeps loading and never fabricates an empty ranking', async () => {
  const { isRankingSnapshot } = load('src/lib/ranking-stream.ts');
  const { useVotingStore: store } = load('src/stores/use-voting-store.ts', {
    '@/api/rankings': { getRankings: async () => { throw Error('offline'); } },
    '@/api/errors': { apiErrorMessage: e => e.message },
    '@/data/destinations': { toVotingDestination: d => d },
    '@/lib/ranking-stream': { isRankingSnapshot },
  });
  await store.getState().refreshRankings();
  assert.equal(store.getState().rankingLoading, true);
  assert.equal(store.getState().rankingError, 'offline');
});
