// Automatic lookup on another database: the hourly limit, the visitor refusal, and confirming only what the server itself found.
import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, createSign } from 'node:crypto';
import { makeHandler } from '../../server/handler.mjs';
import { makeVerifier } from '../../server/auth.mjs';
import { memoryStore } from '../../server/store.mjs';
import { readFileSync } from 'node:fs';
import { parsePedigree } from '../../server/danesworld.mjs';
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
