// Automatic lookup on another database: the hourly limit, the visitor refusal, and confirming only what the server itself found.
import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, createSign } from 'node:crypto';
import { makeHandler } from '../../server/handler.mjs';
import { makeVerifier } from '../../server/auth.mjs';
import { memoryStore } from '../../server/store.mjs';
import { readFileSync } from 'node:fs';
import { parsePedigree } from '../../server/danesworld.mjs';
import { makeNetwork } from '../../server/network.mjs';
const PED = parsePedigree(readFileSync(new URL('../../server/test/danesworld-pedigree.html', import.meta.url), 'utf8'));
let pedCalls = 0;
const externalPedigree = async () => { pedCalls++; return PED; };

const REGION = 'us-east-2', POOL = 'us-east-2_TESTPOOL', CLIENT = 'test-client', ISS = `https://cognito-idp.${REGION}.amazonaws.com/${POOL}`;
const pair = generateKeyPairSync('rsa', { modulusLength: 2048 });
const other = generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwk = { ...pair.publicKey.export({ format: 'jwk' }), kid: 'k1', alg: 'RS256', use: 'sig' };
const enc = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
function token(claims = {}, { key = pair.privateKey, header = {} } = {}) {
  const h = enc({ alg: 'RS256', kid: 'k1', ...header });
  const p = enc({ iss: ISS, aud: CLIENT, token_use: 'id', exp: Math.floor(Date.now() / 1000) + 600, ...claims });
  const sig = createSign('RSA-SHA256').update(h + '.' + p).sign(key).toString('base64url');
  return `${h}.${p}.${sig}`;
}
const verify = makeVerifier({ region: REGION, poolId: POOL, clientId: CLIENT, getKeys: async () => ({ keys: [jwk] }) });
const fresh = (store = memoryStore(), opts = {}) => makeHandler({ store, verify, adminUsers: ['dmj'], ...opts });
const call = async (h, method, args = [], tok) => {
  const r = await h({ requestContext: { http: { method: 'POST' } }, rawPath: '/api/call', headers: tok ? { authorization: 'Bearer ' + tok } : {}, body: JSON.stringify({ method, args }) });
  return { status: r.statusCode, ...JSON.parse(r.body) };
};
const member = (u, name) => token({ 'cognito:username': u, name });


const DOG = { name: 'Batemanor Amanda at Tiparone', sex: 'female', color: 'harlequin', born: '1994-10-02', registry: 'KC', number: '', sire: 'Batemanor Apache War Paint', dam: 'Batemanor Fatal Attraction at Tiparone', siteId: '399612' };
const seen = [];
const external = async (q) => { seen.push(q); return [DOG]; };
const alice = () => member('alice', 'Alice Example');

test('a visitor cannot ask another database for anything', async () => {
  const h = fresh(memoryStore(), { external, externalPedigree });
  assert.equal((await call(h, 'findExternal', [{ q: 'Batemanor Amanda at Tiparone' }])).status, 401);
  assert.equal(seen.length, 0);
});
test('a member finds a dog, confirms it, and its page is made from what the server found', async () => {
  const h = fresh(memoryStore(), { external, externalPedigree }), t = alice();
  const f = await call(h, 'findExternal', [{ q: 'Batemanor Amanda at Tiparone' }], t);
  assert.equal(f.ok, true); assert.equal(f.result.choices.length, 1);
  const tokenId = f.result.choices[0].token;
  const made = await call(h, 'importExternal', [tokenId], t);
  assert.equal(made.ok, true); assert.equal(made.result.created, true);
  const d = await call(h, 'getDog', [made.result.dogId], t);
  assert.equal(d.ok, true);
  assert.match(JSON.stringify(d.result), /Batemanor Amanda at Tiparone/);
  assert.match(JSON.stringify(d.result), /1994-10-02/);
  assert.match(JSON.stringify(d.result), /Checked on DANES World/);
  // the same confirmation a second time finds the dog already there; nothing is added twice
  const again = await call(h, 'findExternal', [{ q: 'Batemanor Amanda at Tiparone' }], t);
  const dup = await call(h, 'importExternal', [again.result.choices[0].token], t);
  assert.equal(dup.result.dogId, made.result.dogId); assert.equal(dup.result.created, false);
});
test('a confirmation the server did not issue, or another member\'s, is refused', async () => {
  const h = fresh(memoryStore(), { external, externalPedigree });
  const f = await call(h, 'findExternal', [{ q: 'Batemanor Amanda at Tiparone' }], alice());
  assert.equal((await call(h, 'importExternal', ['made-up-token'], alice())).status, 404);
  assert.equal((await call(h, 'importExternal', [f.result.choices[0].token], member('bob', 'Bob Example'))).status, 404);
});
test('five automatic lookups an hour per member, then the page is told to use the links; another member is unaffected', async () => {
  const h = fresh(memoryStore(), { external, externalPedigree }), t = alice();
  for (let i = 0; i < 5; i++) assert.equal((await call(h, 'findExternal', [{ q: 'Dog ' + i }], t)).ok, true);
  const sixth = await call(h, 'findExternal', [{ q: 'Dog 6' }], t);
  assert.equal(sixth.status, 429); assert.match(sixth.error.message, /5 automatic lookups/);
  assert.equal((await call(h, 'findExternal', [{ q: 'Dog 7' }], member('bob', 'Bob Example'))).ok, true);
});
test('when the other site is down the member is told, and nothing is made up', async () => {
  const h = fresh(memoryStore(), { external: async () => { throw new Error('down'); } });
  const r = await call(h, 'findExternal', [{ q: 'Batemanor Amanda at Tiparone' }], alice());
  assert.equal(r.status, 503); assert.equal(r.error.code, 'unavailable');
});

test('confirming a dog brings its ancestors with it, from one extra request, and the same dog twice is one page', async () => {
  pedCalls = 0;
  const h = fresh(memoryStore(), { external, externalPedigree }), t = alice();
  const f = await call(h, 'findExternal', [{ q: 'Batemanor Amanda at Tiparone' }], t);
  const made = await call(h, 'importExternal', [f.result.choices[0].token, { 2: { name: 'FORGED' } }], t);   // anything extra from the browser is ignored
  assert.equal(pedCalls, 1);
  const id = made.result.dogId;
  const ped = await call(h, 'getPedigree', [id, 8], t);
  assert.equal(Object.keys(ped.result.nodes).length, 31);
  assert.equal(ped.result.nodes[2][0], 'Batemanor APACHE WAR PAINT');
  assert.equal(ped.result.nodes[3][0], 'Batemanor FATAL ATTRACTION at Tiparone');
  assert.ok(!JSON.stringify(ped.result.nodes).includes('FORGED'));
  const d = await call(h, 'getDog', [id], t);
  assert.equal(d.result.perm.hasPedigree, true);
  // the parents are credited to the member who added the dog and to the database they came from, not to an unknown member
  const par = d.result.parents.filter((x) => x.role === 'Sire' || x.role === 'Dam');
  assert.equal(par.length, 2);
  assert.ok(par.every((x) => x.src === 'DANES World pedigree' && x.author >= 100));
  // open the sire, then a Beccas Blucher at two different places in the pedigree: one page, not two
  const keys = Object.keys(ped.result.nodes).filter((k) => /BECCAS BLUCHER/.test(ped.result.nodes[k][0]));
  assert.ok(keys.length >= 2);
  const a = await call(h, 'openAncestor', [id, keys[0]], t), b = await call(h, 'openAncestor', [id, keys[1]], t);
  assert.equal(a.ok, true); assert.equal(a.result.dogId, b.result.dogId);
  const sire = await call(h, 'openAncestor', [id, 2], t);
  assert.equal(sire.ok, true);
  const sp = await call(h, 'getPedigree', [sire.result.dogId, 8], t);
  assert.equal(sp.result.nodes[2][0], 'BECCAS BLUCHER');   // his own pedigree starts from where he sits in this one
});
test('a pedigree that cannot be fetched still adds the dog, just without ancestors', async () => {
  const h = fresh(memoryStore(), { external, externalPedigree: async () => { throw new Error('down'); } }), t = alice();
  const f = await call(h, 'findExternal', [{ q: 'Batemanor Amanda at Tiparone' }], t);
  const made = await call(h, 'importExternal', [f.result.choices[0].token], t);
  assert.equal(made.ok, true);
  assert.equal((await call(h, 'getDog', [made.result.dogId], t)).result.perm.hasPedigree, false);
});
test('a dog added earlier with no ancestors gets them when it is confirmed again', async () => {
  const store = memoryStore(), t = alice();
  const h0 = fresh(store, { external, externalPedigree: async () => { throw new Error('down'); } });
  const f0 = await call(h0, 'findExternal', [{ q: 'Batemanor Amanda at Tiparone' }], t);
  const id = (await call(h0, 'importExternal', [f0.result.choices[0].token], t)).result.dogId;
  const h = fresh(store, { external, externalPedigree });
  const f = await call(h, 'findExternal', [{ q: 'Batemanor Amanda at Tiparone' }], t);
  const again = await call(h, 'importExternal', [f.result.choices[0].token], t);
  assert.equal(again.result.dogId, id); assert.equal(again.result.created, false);
  assert.equal((await call(h, 'getDog', [id], t)).result.perm.hasPedigree, true);
});

const open = async (h, t, id, name) => {   // open the ancestor of dog `id` whose name matches, by its place in the pedigree
  const nodes = (await call(h, 'getPedigree', [id, 8], t)).result.nodes;
  const k = Object.keys(nodes).find((x) => nodes[x][0] === name);
  return call(h, 'openAncestor', [id, k], t);
};
const importWith = async (rows, name, t, store) => {
  const h = fresh(store, { external: async () => rows, externalPedigree });
  const f = await call(h, 'findExternal', [{ q: name }], t);
  return { h, made: await call(h, 'importExternal', [f.result.choices[0].token], t) };
};
test('an ancestor with a Kennel Club number keeps that registry, so it can be matched later', async () => {
  const h = fresh(memoryStore(), { external, externalPedigree }), t = alice();
  const f = await call(h, 'findExternal', [{ q: 'Batemanor Amanda at Tiparone' }], t);
  const id = (await call(h, 'importExternal', [f.result.choices[0].token], t)).result.dogId;
  const anc = await open(h, t, id, 'Chapala SQUEEZY MOP at Yacanto');
  const d = await call(h, 'getDog', [anc.result.dogId], t);
  assert.deepEqual(d.result.identifiers.map((i) => [i.registry, i.number]), [['KC', 'KC3019BS']]);
});
test('a dog we only knew by name takes the number found later; it does not become two dogs', async () => {
  const store = memoryStore(), t = alice();
  const { h, made } = await importWith([DOG], 'Batemanor Amanda at Tiparone', t, store);
  const first = await open(h, t, made.result.dogId, 'BECCAS BLUCHER');          // opened from a pedigree: name only
  const row = { name: 'BECCAS BLUCHER', sex: 'male', color: '', born: '', registry: 'KC', number: '12345', sire: '', dam: '', siteId: '' };
  const { made: again } = await importWith([row], 'BECCAS BLUCHER', t, store);
  assert.equal(again.result.dogId, first.result.dogId); assert.equal(again.result.created, false);
  const d = await call(h, 'getDog', [first.result.dogId], t);
  assert.deepEqual(d.result.identifiers.map((i) => i.number), ['KC12345']);
});
test('the same digits from two registries are two different dogs', async () => {
  const store = memoryStore(), t = alice();
  const a = await importWith([{ name: 'Dog One', sex: 'male', color: '', born: '', registry: 'KC', number: '777', sire: '', dam: '', siteId: '' }], 'Dog One', t, store);
  const b = await importWith([{ name: 'Dog Two', sex: 'male', color: '', born: '', registry: 'NHSB', number: '777', sire: '', dam: '', siteId: '' }], 'Dog Two', t, store);
  assert.notEqual(a.made.result.dogId, b.made.result.dogId);
});

test('an OFA number can be added to a dog with no AKC number, and the pedigree then shows that screens exist', async () => {
  const store = memoryStore(), t = alice();
  const { h, made } = await importWith([DOG], 'Batemanor Amanda at Tiparone', t, store);
  const id = made.result.dogId;
  assert.equal((await call(h, 'addIdentifier', [id, 'OFA', 'gd-hd12345g24m-vpi'], t)).ok, true);
  const d = await call(h, 'getDog', [id], t);
  assert.ok(d.result.identifiers.some((i) => i.registry === 'OFA' && i.number === 'GD-HD12345G24M-VPI'));
  const root = (await call(h, 'getPedigree', [id, 8], t)).result.nodes[1];
  assert.equal(root[4].health, 1);
  // an ancestor known only by name picks up the same marker once its own page has the number
  const sire = await open(h, t, id, 'Batemanor APACHE WAR PAINT');
  assert.equal((await call(h, 'addIdentifier', [sire.result.dogId, 'OFA', 'GD-HD777G24M-NOPI'], t)).ok, true);
  const sirenode = (await call(h, 'getPedigree', [id, 8], t)).result.nodes[2];
  assert.equal(sirenode[4].health, 1);
});
test('OFA numbers: members only, only OFA or CHIC, a sensible format, and one number for one dog', async () => {
  const store = memoryStore(), t = alice();
  const { h, made } = await importWith([DOG], 'Batemanor Amanda at Tiparone', t, store);
  const id = made.result.dogId;
  assert.equal((await call(h, 'addIdentifier', [id, 'OFA', 'GD-HD1234G24M'])).status, 401);
  assert.equal((await call(h, 'addIdentifier', [id, 'AKC', 'WS12345678'], t)).status, 400);
  assert.equal((await call(h, 'addIdentifier', [id, 'OFA', 'no'], t)).status, 400);
  assert.equal((await call(h, 'addIdentifier', [id, 'OFA', 'GD-HD1234G24M'], t)).ok, true);
  const other = (await importWith([{ ...DOG, name: 'Another Dog Entirely', born: '2001-01-01' }], 'Another Dog Entirely', t, store)).made.result.dogId;
  assert.equal((await call(h, 'addIdentifier', [other, 'OFA', 'GD-HD1234G24M'], t)).status, 400);
});

// a made-up network (not real dogs): Zorro's Test Pup (1) out of Test Sire (2) and Test Dam (3); the sire's parents are 4 and 5
const NET = makeNetwork([[
  '1|"Pup" Zorros Test Pup |2015-03-04|2|3|||WS12345601|Fawn|M',
  '2|Test Sire |2010-01-01|4|5|||WS12345602|Fawn|M',
  '3|Test Dam |2011-02-02|||||KC 98765|Black|F',
  '4|Grand Sire One |2005-05-05|||||WS12345604|Fawn|M',
  '5|Grand Dam One |2006-06-06|||||UNREG|Fawn|F',
  '6|Lonely Dog With No Parents |1999-09-09|||||||F',
].join('\r\n')]);
let outside = 0;
const asked = async () => { outside++; return []; };

test('a member\'s search is answered from the private network, without asking any other website', async () => {
  outside = 0;
  const h = fresh(memoryStore(), { network: NET, external: asked, externalPedigree }), t = alice();
  const f = await call(h, 'findExternal', [{ q: 'CH Zorros Test Pup' }], t);   // a title in front is ignored, so is the quoted call name in the data
  assert.equal(f.ok, true); assert.equal(f.result.choices.length, 1);
  const c = f.result.choices[0];
  assert.equal(c.source, 'network'); assert.equal(c.name, 'Zorros Test Pup'); assert.equal(c.number, 'WS12345601'); assert.equal(c.sire, 'Test Sire');
  assert.equal(outside, 0);
});
test('confirming a network dog adds it with its ancestors from the network, credited to the network, with no other website involved', async () => {
  outside = 0; pedCalls = 0;
  const h = fresh(memoryStore(), { network: NET, external: asked, externalPedigree }), t = alice();
  const f = await call(h, 'findExternal', [{ q: 'Zorros Test Pup' }], t);
  const made = await call(h, 'importExternal', [f.result.choices[0].token], t);
  assert.equal(made.ok, true); assert.equal(pedCalls, 0); assert.equal(outside, 0);
  const id = made.result.dogId, d = await call(h, 'getDog', [id], t);
  assert.ok(d.result.identifiers.some((i) => i.number === 'WS12345601'));
  assert.ok(!JSON.stringify(d.result.claims).includes('DANES World'));
  assert.ok(d.result.parents.filter((x) => x.role === 'Sire' || x.role === 'Dam').every((x) => x.src === 'network pedigree'));
  const nodes = (await call(h, 'getPedigree', [id, 8], t)).result.nodes;
  assert.deepEqual([2, 3, 4, 5].map((k) => nodes[k][0]), ['Test Sire', 'Test Dam', 'Grand Sire One', 'Grand Dam One']);
  assert.equal(Object.keys(nodes).length, 5);   // the dog and four ancestors: nothing is invented past what the network has
  assert.match(nodes[3][1], /^KC 98765/);        // a non-AKC number keeps its place
  assert.ok(!/UNREG/.test(JSON.stringify(nodes)));   // a placeholder is not a registration number
});
test('a dog the network does not have falls through to the other website, within its smaller share', async () => {
  outside = 0;
  const h = fresh(memoryStore(), { network: NET, external, externalPedigree }), t = alice();
  const f = await call(h, 'findExternal', [{ q: 'Batemanor Amanda at Tiparone' }], t);
  assert.equal(f.ok, true); assert.equal(f.result.choices[0].source, undefined);
  assert.equal(seen[seen.length - 1], 'Batemanor Amanda at Tiparone');
});
test('network searches are limited to 30 an hour, and a visitor gets nothing', async () => {
  const h = fresh(memoryStore(), { network: NET, external: asked, externalPedigree }), t = alice();
  for (let i = 0; i < 30; i++) assert.equal((await call(h, 'findExternal', [{ q: 'Test Sire' }], t)).ok, true);
  const r = await call(h, 'findExternal', [{ q: 'Test Sire' }], t);
  assert.equal(r.status, 429); assert.match(r.error.message, /network 30 times/);
  assert.equal((await call(h, 'findExternal', [{ q: 'Test Sire' }])).status, 401);
});

test('network searches also have a daily cap, and another member is not affected', async () => {
  const h = fresh(memoryStore(), { network: NET, external: asked, externalPedigree });
  // the hourly limit is 30, so spread the calls over simulated hours by moving the clock
  const realNow = Date.now; let offset = 0; Date.now = () => realNow() + offset;
  try {
    for (let i = 0; i < 150; i++) { offset = Math.floor(i / 25) * 3700000; const r = await call(h, 'findExternal', [{ q: 'Test Sire' }], alice()); assert.equal(r.ok, true, 'search ' + i); }
    offset = 5 * 3700000;   // still inside the same day, in a fresh hour
    const over = await call(h, 'findExternal', [{ q: 'Test Sire' }], alice());
    assert.equal(over.status, 429); assert.match(over.error.message, /today's limit of 150/);
    assert.equal((await call(h, 'findExternal', [{ q: 'Test Sire' }], member('bob', 'Bob Example'))).ok, true);
    offset = 25 * 3600000;   // a day later it works again
    assert.equal((await call(h, 'findExternal', [{ q: 'Test Sire' }], alice())).ok, true);
  } finally { Date.now = realNow; }
});
