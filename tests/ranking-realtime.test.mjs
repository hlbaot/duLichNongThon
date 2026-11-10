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
  vm.runInNewContext(code, { exports, require: id => mocks[id] ??
    (['./ranking-counts', '@/lib/ranking-counts'].includes(id) ? load('src/lib/ranking-counts.ts') : moduleRequire(id)), ...globals }, { filename: file });
  return exports;
}
const snapshot = (votes = 4) => ({
  items: [{ id: 'a', slug: 'a', shortTitle: 'A', title: 'A', brief: '', displayOrder: 1, rank: 1, voteCount: votes }],
  totalVotes: votes, totalDestinations: 1,
});
function harness(refresh = async () => {}) {
  const timers = new Map();
  const sources = [];
  const delays = [];
  const visibilityListeners = new Set();
  const visibility = {
    visibilityState: 'visible',
    addEventListener: (_name, handler) => visibilityListeners.add(handler),
    removeEventListener: (_name, handler) => visibilityListeners.delete(handler),
  };
  let next = 0;
  class Source {
    constructor(url) { this.url = url; this.listeners = {}; sources.push(this); }
    addEventListener(name, handler) { this.listeners[name] = handler; }
    removeEventListener(name) { delete this.listeners[name]; }
    close() { this.closed = true; }
    emit(value) { this.listeners.rankings({ data: typeof value === 'string' ? value : JSON.stringify(value) }); }
    counts(value) { this.listeners['ranking-counts']({ data: JSON.stringify(value) }); }
  }
  const lib = load('src/lib/ranking-stream.ts', {}, {
    EventSource: Source, AbortController,
    setTimeout: (fn, delay) => { delays.push(delay); timers.set(++next, fn); return next; },
    clearTimeout: id => timers.delete(id),
  });
  const snapshots = [], connections = [], counts = [];
  const stop = lib.startRankingStream({ url: 'https://backend/rankings/stream', refresh,
    applySnapshot: s => snapshots.push(s), setConnected: s => connections.push(s),
    applyCounts: s => { counts.push(s); return snapshots.length > 0; }, visibility,
  });
  return { ...lib, timers, sources, snapshots, connections, counts, delays, stop,
    changeVisibility: state => { visibility.visibilityState = state; for (const listener of visibilityListeners) listener(); },
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

test('compact absolute counts remain live without restarting fallback polling', () => {
  const h = harness();
  h.sources[0].emit(snapshot(4));
  h.sources[0].counts({ totalVotes: 9, totalDestinations: 1, items: [{ id: 'a', rank: 1, voteCount: 9 }] });
  assert.equal(h.counts[0].totalVotes, 9);
  assert.equal(h.connections.at(-1), true);
  assert.equal(h.timers.size, 0);
  h.stop();
});

test('hidden tabs close SSE, abort fallback, and reopen with an immediate catch-up', async () => {
  let calls = 0;
  const h = harness(async () => { calls++; });
  const old = h.sources[0];
  h.changeVisibility('hidden');
  assert.equal(old.closed, true);
  assert.equal(h.timers.size, 0);
  assert.equal(h.connections.at(-1), false);
  h.changeVisibility('visible');
  await Promise.resolve();
  assert.equal(h.sources.length, 2);
  assert.equal(calls, 1);
  h.sources[1].emit(snapshot(15));
  assert.equal(h.snapshots.at(-1).totalVotes, 15);
  assert.equal(h.timers.size, 0);
  h.stop();
  h.changeVisibility('hidden'); h.changeVisibility('visible');
  assert.equal(h.sources.length, 2);
});

test('pausing an in-flight fallback cannot reschedule an old generation or apply queued events', async () => {
  let finish, signal;
  const h = harness(s => { signal = s; return new Promise(resolve => { finish = resolve; }); });
  const oldListener = h.sources[0].listeners.rankings;
  const pending = h.tick();
  h.changeVisibility('hidden');
  assert.equal(signal.aborted, true);
  oldListener({ data: JSON.stringify(snapshot(90)) });
  finish(); await pending;
  assert.equal(h.snapshots.length, 0);
  assert.equal(h.timers.size, 0);
  h.stop();
});

test('fallback backs off from 30 seconds to 60 seconds with bounded jitter', async () => {
  const h = harness(async () => { throw Error('offline'); });
  assert.ok(h.delays[0] >= 30_000 && h.delays[0] < 35_000);
  await h.tick();
  assert.ok(h.delays.at(-1) >= 60_000 && h.delays.at(-1) < 65_000);
  await h.tick();
  assert.ok(h.delays.at(-1) >= 60_000 && h.delays.at(-1) < 65_000);
  h.stop();
});

test('merging counts preserves metadata, reorders ranks, and rejects missing or duplicate IDs', () => {
  const { mergeRankingCounts } = load('src/lib/ranking-counts.ts');
  const old = { items: [
    { ...snapshot(4).items[0], brief: 'Do not discard', thumbnailUrl: 'photo.jpg' },
    { ...snapshot(0).items[0], id: 'b', slug: 'b', title: 'B', shortTitle: 'B', rank: 2 },
  ], totalVotes: 4, totalDestinations: 2 };
  const counts = { totalVotes: 13, totalDestinations: 2, items: [
    { id: 'a', voteCount: 4, rank: 2 }, { id: 'b', voteCount: 9, rank: 1 },
  ] };
  const merged = mergeRankingCounts(old, counts);
  assert.equal(merged.items[0].id, 'b');
  assert.equal(merged.items[1].brief, 'Do not discard');
  assert.equal(merged.items[1].thumbnailUrl, 'photo.jpg');
  assert.equal(old.items[0].rank, 1);
  assert.equal(mergeRankingCounts(old, { ...counts, items: counts.items.slice(0, 1) }), null);
  assert.equal(mergeRankingCounts(old, { ...counts, items: [counts.items[0], { ...counts.items[1], id: 'a' }] }), null);
  assert.equal(mergeRankingCounts(old, { ...counts, items: [counts.items[0], { ...counts.items[1], id: 'unknown' }] }), null);
});

test('fallback uses counts after metadata exists and cannot overwrite newer SSE counts', async () => {
  let resolveCounts;
  let fullCalls = 0;
  const { isRankingSnapshot } = load('src/lib/ranking-stream.ts');
  const { useVotingStore: store } = load('src/stores/use-voting-store.ts', {
    '@/api/rankings': {
      getRankings: async () => { fullCalls++; return snapshot(4); },
      getRankingCounts: () => new Promise(resolve => { resolveCounts = resolve; }),
    },
    '@/api/errors': { apiErrorMessage: e => e.message },
    '@/data/destinations': { toVotingDestination: d => ({ ...d, votes: d.voteCount }) },
    '@/lib/ranking-stream': { isRankingSnapshot },
  });
  await store.getState().refreshRankings();
  const pending = store.getState().refreshRankings();
  assert.equal(store.getState().applyRankingCounts({ totalVotes: 10, totalDestinations: 1, items: [{ id: 'a', voteCount: 10, rank: 1 }] }), true);
  resolveCounts({ totalVotes: 6, totalDestinations: 1, items: [{ id: 'a', voteCount: 6, rank: 1 }] });
  await pending;
  assert.equal(fullCalls, 1);
  assert.equal(store.getState().totalVotes, 10);
  assert.equal(store.getState().ranking[0].title, 'A');
});

test('unknown active destination triggers a full refresh without clearing valid data', async () => {
  let fullCalls = 0;
  const { isRankingSnapshot } = load('src/lib/ranking-stream.ts');
  const { useVotingStore: store } = load('src/stores/use-voting-store.ts', {
    '@/api/rankings': {
      getRankings: async () => { fullCalls++; return snapshot(fullCalls === 1 ? 4 : 8); },
      getRankingCounts: async () => ({ totalVotes: 8, totalDestinations: 1, items: [{ id: 'new', voteCount: 8, rank: 1 }] }),
    },
    '@/api/errors': { apiErrorMessage: e => e.message },
    '@/data/destinations': { toVotingDestination: d => ({ ...d, votes: d.voteCount }) },
    '@/lib/ranking-stream': { isRankingSnapshot },
  });
  await store.getState().refreshRankings();
  assert.equal(store.getState().totalVotes, 4);
  await store.getState().refreshRankings();
  assert.equal(fullCalls, 2);
  assert.equal(store.getState().totalVotes, 8);
  assert.equal(store.getState().rankingLoading, false);
});
