import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function load(file, imports = {}) {
  const exports = {};
  const code = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(code, { exports, require: id => {
    if (!(id in imports)) throw new Error(`Unexpected import: ${id}`);
    return imports[id];
  } }, { filename: file });
  return exports;
}

const official = load('src/data/official-destinations.ts');
const display = load('src/lib/destination-display.ts', { '@/data/official-destinations': official });
const adapter = load('src/data/destinations.ts', { '@/lib/destination-display': display });

test('35 unique identities retain the supplied names and codes', () => {
  const entries = official.OFFICIAL_DESTINATIONS;
  assert.equal(entries.length, 35);
  assert.equal(new Set(entries.map(x => x.id)).size, 35);
  assert.equal(new Set(entries.map(x => x.code)).size, 35);
  assert.equal(entries[2].title, 'Điểm du lịch cộng đồng Bản Lao Chải');
  assert.equal(entries[12].code, 'DLNT13');
  assert.equal(entries[18].title, 'Du lịch nông thôn Làng Tân Hóa');
  assert.equal(entries[34].title, 'Hành trình trải nghiệm Sen Quê Bác');
});

test('all cards and details use the same identity without changing voting or routing', () => {
  for (const entry of official.OFFICIAL_DESTINATIONS) {
    const original = {
      id: entry.id, slug: `existing-route-${entry.number}`, contestCode: `DLNT${entry.number}`,
      title: 'Tên cũ (ghi chú nộp lại)', shortTitle: 'Tên card cũ', province: 'Cũ',
      brief: 'Nội dung gốc', detail: `**Mã hồ sơ:** DLNT2026-${String(entry.number).padStart(3, '0')}`,
      thumbnailUrl: null, displayOrder: 40 - entry.number, voteCount: 123, rank: 2,
      media: [{ id: 'video', mediaType: 'VIDEO', mediaUrl: '/video', caption: `Video bài dự thi DLNT2026-${String(entry.number).padStart(3, '0')}`, displayOrder: 1 }],
    };
    const detail = display.withOfficialDestinationDetail(original);
    const card = adapter.toVotingDestination(original);
    assert.equal(card.name, detail.title);
    assert.equal(card.shortTitle, detail.title);
    assert.equal(card.code, detail.contestCode);
    assert.equal(card.province, detail.province);
    assert.equal(detail.detail, `**Mã hồ sơ:** ${entry.code}`);
    assert.equal(detail.media[0].caption, `Video bài dự thi ${entry.code}`);
    assert.equal(card.id, original.id);
    assert.equal(card.slug, original.slug);
    assert.equal(card.votes, original.voteCount);
    assert.equal(card.rank, original.rank);
    assert.equal(card.displayOrder, original.displayOrder);
    assert.equal(detail.brief, original.brief);
    assert.equal(original.title, 'Tên cũ (ghi chú nộp lại)');
  }
});

test('only the matching legacy code is replaced and null captions stay null', () => {
  const entry = official.OFFICIAL_DESTINATIONS[1];
  const result = display.withOfficialDestinationDetail({
    id: entry.id, detail: 'DLNT2026-002, DLNT02; hồ sơ khác DLNT2026-003.',
    media: [{ caption: null }],
  });
  assert.equal(result.detail, 'DLNT02, DLNT02; hồ sơ khác DLNT2026-003.');
  assert.equal(result.media[0].caption, null);
});

test('unknown destinations are preserved', () => {
  const unknown = { id: 'new-entry', title: 'Hồ sơ mới', contestCode: 'NEW01' };
  assert.equal(display.withOfficialDestination(unknown), unknown);
  assert.equal(display.withOfficialDestinationDetail(unknown), unknown);
});
