// The DANES World reader, run against pages saved from the site (no network).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseResults, exactMatches, searchDanesWorld } from '../../server/danesworld.mjs';
const page = (f) => readFileSync(new URL('../../server/test/' + f, import.meta.url), 'utf8');

test('a name search page is read into dogs, and only the dog whose own name matches is kept', () => {
  const rows = parseResults(page('danesworld-search.html'));
  assert.equal(rows.length, 2);
  const hit = exactMatches(rows, 'Batemanor Amanda at Tiparone');
  assert.equal(hit.length, 1);
  assert.equal(hit[0].name, 'Batemanor Amanda at Tiparone');
  assert.equal(hit[0].sex, 'female');
  assert.equal(hit[0].born, '1994-10-02');
  assert.equal(hit[0].registry, 'KC');
  assert.equal(hit[0].color, 'harlequin');
  assert.match(hit[0].sire, /BATEMANOR APACHE WAR PAINT/i);
  assert.match(hit[0].dam, /Fatal Attraction/i);
});
test('a registration-number search page gives the dog, its number and its birth date', () => {
  const rows = exactMatches(parseResults(page('danesworld-search-reg.html')), 'WS69691106');
  assert.equal(rows.length, 1);
  assert.equal(rows[0].number, 'WS69691106');
  assert.equal(rows[0].born, '2020-09-26');
  assert.equal(rows[0].sex, 'female');
  assert.equal(rows[0].color, 'fawn or brindle');
});
test('one request per new search, then the day\'s cache answers, and the request names us', async () => {
  let calls = 0, agent = '';
  const f = async (url, o) => { calls++; agent = o.headers['user-agent']; return { ok: true, status: 200, text: async () => page('danesworld-search.html') }; };
  const a = await searchDanesWorld('Batemanor Amanda at Tiparone', f);
  const b = await searchDanesWorld('batemanor amanda at tiparone', f);
  assert.equal(calls, 1); assert.deepEqual(a, b); assert.match(agent, /7SistersGDGalaxy/);
});
test('a site error is reported, not guessed around', async () => {
  await assert.rejects(searchDanesWorld('Zzz Not Cached', async () => ({ ok: false, status: 503 })), { code: 'unavailable' });
});
