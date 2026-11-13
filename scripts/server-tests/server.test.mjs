// Tests for the dog-page server: sign-in checks, who may do what, saving and reloading, and refusing what should be refused.
// Run: node --test scripts/server-tests/
import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, createSign } from 'node:crypto';
import { makeHandler } from '../../server/handler.mjs';
import { makeVerifier } from '../../server/auth.mjs';
import { memoryStore } from '../../server/store.mjs';

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

test('health check answers and unknown addresses do not', async () => {
  const h = fresh();
  assert.equal((await h({ requestContext: { http: { method: 'GET' } }, rawPath: '/api/health' })).statusCode, 200);
  assert.equal((await h({ requestContext: { http: { method: 'GET' } }, rawPath: '/api/other' })).statusCode, 404);
});

test('a visitor sees our public dogs but cannot look up other dogs or change anything', async () => {
  const h = fresh();
  assert.equal((await call(h, 'getDog', [412])).ok, true);
  assert.equal((await call(h, 'lookup', ['WS11111111'])).status, 401);
  assert.equal((await call(h, 'claimDog', [414])).status, 401);
  assert.equal((await call(h, 'addRecord', [412, { type: 'win', name: 'x', url: 'https://e' }])).status, 401);
  assert.equal((await call(h, 'actionLog')).status, 401);
});

test('tokens that do not verify are refused, not treated as a visitor', async () => {
  const h = fresh();
  const cases = {
    'signed with another key': token({ 'cognito:username': 'sam' }, { key: other.privateKey }),
    'expired': token({ 'cognito:username': 'sam', exp: Math.floor(Date.now() / 1000) - 5 }),
    'wrong pool': token({ 'cognito:username': 'sam', iss: 'https://cognito-idp.us-east-2.amazonaws.com/other' }),
    'wrong app': token({ 'cognito:username': 'sam', aud: 'someone-else' }),
    'an access token, not an id token': token({ 'cognito:username': 'sam', token_use: 'access' }),
    'no username': token({}),
    'unknown key id': token({ 'cognito:username': 'sam' }, { header: { kid: 'nope' } }),
    'algorithm none': enc({ alg: 'none', kid: 'k1' }) + '.' + enc({ iss: ISS, aud: CLIENT, token_use: 'id', exp: 9999999999, 'cognito:username': 'dmj' }) + '.',
    'garbage': 'not.a.token',
  };
  for (const [why, t] of Object.entries(cases)) assert.equal((await call(h, 'session', [], t)).status, 401, why);
  const tampered = member('sam', 'Sam Q');
  const [a, b, c] = tampered.split('.');
  const forged = [a, enc({ ...JSON.parse(Buffer.from(b, 'base64url')), 'cognito:username': 'dmj' }), c].join('.');
  assert.equal((await call(h, 'session', [], forged)).status, 401, 'a token edited to say dmj');
});

test('a signed-in account becomes a member under its own name and is remembered', async () => {
  const store = memoryStore();
  const s1 = await call(fresh(store), 'session', [], member('sam', 'Sam Quinn'));
  assert.equal(s1.result.role, 'member'); assert.equal(s1.result.name, 'Sam Quinn');
  const h2 = fresh(store);   // a new server process reading the saved state
  const a = (await call(h2, 'authors', [], member('sam', 'Sam Quinn'))).result;
  assert.ok(Object.values(a).some((x) => x.name === 'Sam Quinn' && x.role === 'Member'));
  const n = Object.keys(a).filter((k) => Number(k) >= 100).length;
  await call(h2, 'session', [], member('sam', 'Sam Quinn'));
  assert.equal(Object.keys((await call(h2, 'authors', [], member('sam', 'Sam Quinn'))).result).filter((k) => Number(k) >= 100).length, n, 'same account, same member number');
});

test('only the configured administrators are administrators, whatever the page says', async () => {
  const h = fresh();
  assert.equal((await call(h, 'session', [], member('dmj', 'Dustin'))).result.role, 'admin');
  assert.equal((await call(h, 'session', [], member('DMJ', 'Dustin'))).result.role, 'admin', 'case does not matter');
  assert.equal((await call(h, 'session', [], member('sam', 'Sam'))).result.role, 'member');
  assert.equal((await call(h, 'actionLog', [], member('sam', 'Sam'))).status, 403);
  assert.equal((await call(h, 'wanted', [], member('sam', 'Sam'))).status, 403);
  assert.equal((await call(h, 'hideClaim', [3, 'x'], member('sam', 'Sam'))).status, 403);
  assert.equal((await call(h, 'actionLog', [], member('dmj', 'Dustin'))).ok, true);
});

test('calls the browser must never make do not exist', async () => {
  const h = fresh();
  for (const m of ['setActor', 'useLogin', 'importState', 'exportState', 'setLoader', 'init', 'signOut', '__proto__', 'constructor'])
    assert.equal((await call(h, m, [0], member('sam', 'Sam'))).status, 404, m);
  assert.equal((await call(h, 'session', [], member('sam', 'Sam'))).result.role, 'member');
});

test('claiming a dog, choosing who sees it, and who else may change that', async () => {
  const h = fresh();
  const sam = member('sam', 'Sam Quinn'), kit = member('kit', 'Kit Lee');
  const mia = (await call(h, 'getDog', [413], sam)).result;
  assert.equal(mia.perm.canClaim, false, 'Mia is already claimed by us');
  assert.equal((await call(h, 'claimDog', [413], sam)).status, 403, 'and cannot be claimed over');
  // a stub dog: look up a number we do not have, then claim it
  const found = (await call(h, 'lookup', ['WS12345678'], sam)).result;
  assert.equal((await call(h, 'claimDog', [found.dogId], sam)).ok, true);
  assert.equal((await call(h, 'claimDog', [found.dogId], kit)).status, 403, 'someone else cannot claim a claimed dog');
  assert.equal((await call(h, 'setVisibility', [found.dogId, 'public'], kit)).status, 403);
  assert.equal((await call(h, 'getDog', [found.dogId])).status, 401, 'members-only until the owner shares it');
  assert.equal((await call(h, 'setVisibility', [found.dogId, 'public'], sam)).ok, true);
  assert.equal((await call(h, 'getDog', [found.dogId])).ok, true, 'a visitor can now see it');
  assert.equal((await call(h, 'setVisibility', [found.dogId, 'bogus'], sam)).status, 400);
});

test('health results (grades) are entered only by the owner; anyone may mark which screens exist', async () => {
  const h = fresh();
  const sam = member('sam', 'Sam Quinn');
  const rec = { type: 'test', name: 'Hips', value: 'Good', url: 'https://example.org/cert' };
  assert.equal((await call(h, 'addRecord', [412, rec], sam)).status, 403);
  assert.equal((await call(h, 'addRecord', [412, rec], member('dmj', 'Dustin'))).ok, true, 'the administrator may');
  const s = await call(h, 'addRecord', [412, { type: 'screens', cats: ['Hips', 'Cardiac', 'Bogus'] }], sam);
  assert.equal(s.ok, true); assert.equal(s.result.value, 'Hips, Cardiac');
  assert.equal((await call(h, 'addRecord', [412, { type: 'screens', cats: [] }], sam)).status, 400);
  assert.equal((await call(h, 'addRecord', [412, { type: 'win', name: 'x' }], sam)).status, 400, 'a win needs its evidence link');
});

test('disputes: not your own record, and a reason with evidence is required', async () => {
  const h = fresh();
  const sam = member('sam', 'Sam Quinn');
  const win = (await call(h, 'addRecord', [412, { type: 'win', name: 'Best of Breed', value: '1st', url: 'https://example.org/w' }], sam)).result;
  assert.equal((await call(h, 'flagClaim', [win.id, { reason: 'x', evidence: 'https://e' }], sam)).status, 403, 'not your own');
  const kit = member('kit', 'Kit Lee');
  assert.equal((await call(h, 'flagClaim', [win.id, { reason: 'wrong date' }], kit)).status, 400, 'evidence required');
  assert.equal((await call(h, 'flagClaim', [win.id, { reason: 'wrong date', evidence: 'https://e' }], kit)).ok, true);
  const dog = (await call(h, 'getDog', [412], kit)).result;
  assert.equal(dog.claims.find((c) => c.id === win.id).flags.length, 1);
});

test('visitors follow our pedigree only as far as the limit, and members all the way', async () => {
  const h = fresh();
  const ped = (await call(h, 'getPedigree', [412, 8])).result.nodes;
  assert.ok(ped[2] && !ped[2].locked);
  assert.equal((await call(h, 'openAncestor', [412, 2])).ok, true);
  assert.equal((await call(h, 'getPedigree', [413, 8], member('sam', 'Sam'))).ok, true);
});

test('saved state survives a restart and two writers at once both keep their changes', async () => {
  const store = memoryStore();
  const a = fresh(store), b = fresh(store);
  const sam = member('sam', 'Sam Quinn'), kit = member('kit', 'Kit Lee');
  await Promise.all([
    call(a, 'addRecord', [412, { type: 'win', name: 'Sam win', value: '1', url: 'https://e/1' }], sam),
    call(b, 'addRecord', [412, { type: 'win', name: 'Kit win', value: '2', url: 'https://e/2' }], kit),
  ]);
  const names = (await call(fresh(store), 'getDog', [412], sam)).result.claims.map((c) => c.name);
  assert.ok(names.includes('Sam win') && names.includes('Kit win'));
  const { version } = await store.get();
  assert.equal(await store.put(version - 1, {}), false, 'a stale save is refused');
});

test('an ancestor page opened once is still there after a restart, with its pedigree', async () => {
  const store = memoryStore();
  const sam = member('sam', 'Sam Quinn');
  const opened = (await call(fresh(store), 'openAncestor', [412, 2], sam)).result;
  const h2 = fresh(store);
  assert.equal((await call(h2, 'getDog', [opened.dogId], sam)).ok, true);
  const ped = await call(h2, 'getPedigree', [opened.dogId, 4], sam);
  assert.equal(ped.ok, true); assert.ok(ped.result.nodes[2], 'its own parents are still there');
  assert.equal((await call(h2, 'confirmDog', [opened.dogId], sam)).ok, true);
  assert.equal((await call(h2, 'confirmDog', [opened.dogId], sam)).ok, true, 'confirming twice is harmless');
  const c = (await call(h2, 'getDog', [opened.dogId], sam)).result.confirm;
  assert.equal(c.by.length, 1);
});

test('oversized, malformed and strange requests are refused', async () => {
  const h = fresh();
  const raw = (body) => h({ requestContext: { http: { method: 'POST' } }, rawPath: '/api/call', headers: {}, body }).then((r) => r.statusCode);
  assert.equal(await raw('{not json'), 400);
  assert.equal(await raw(JSON.stringify({ method: 'session', args: 'x' })), 400);
  assert.equal(await raw(JSON.stringify({ method: 'session', args: [1, 2, 3, 4, 5] })), 400);
  assert.equal(await raw(JSON.stringify({ method: 'session', args: ['x'.repeat(3000)] })), 400);
  assert.equal(await raw(JSON.stringify({ method: 'session', args: [], pad: 'x'.repeat(21000) })), 413);
  assert.equal(await raw(JSON.stringify({ method: 'session', args: [{ a: { b: { c: { d: { e: 1 } } } } }] })), 400);
});

test('a visitor cannot move the wanted list; a member can', async () => {
  const store = memoryStore();
  const h = fresh(store);
  await call(h, 'noteGalaxy', [412, false]);
  assert.equal((await call(h, 'wanted', [], member('dmj', 'Dustin'))).result.length, 0, 'visitor report ignored');
  await call(h, 'noteGalaxy', [412, false], member('sam', 'Sam'));
  assert.equal((await call(h, 'wanted', [], member('dmj', 'Dustin'))).result.length, 1);
});

import { dynamoStore } from '../../server/store-dynamo.mjs';
// a fake of the two DynamoDB calls, enough to check the conditional write and the compression round trip
function fakeDynamo() {
  let item = null;
  class Get { constructor(p) { this.p = p; } }
  class Put { constructor(p) { this.p = p; } }
  return {
    commands: { GetItemCommand: Get, PutItemCommand: Put },
    async send(cmd) {
      if (cmd instanceof Get) return item ? { Item: item } : {};
      const p = cmd.p, expected = Number(p.Item.version.N) - 1;
      const ok = p.ConditionExpression === 'attribute_not_exists(pk)' ? item === null : (item && Number(item.version.N) === expected);
      if (!ok) { const e = new Error('no'); e.name = 'ConditionalCheckFailedException'; throw e; }
      item = p.Item; return {};
    },
  };
}
test('the DynamoDB store round-trips compressed state and refuses a stale save', async () => {
  const s = dynamoStore({ client: fakeDynamo(), table: 't' });
  assert.deepEqual(await s.get(), { version: 0, state: null });
  assert.equal(await s.put(0, { a: 1, big: 'x'.repeat(50000) }), true);
  assert.equal(await s.put(0, { a: 2 }), false, 'second first-save refused');
  const r = await s.get(); assert.equal(r.version, 1); assert.equal(r.state.a, 1);
  assert.equal(await s.put(1, { a: 3 }), true);
  assert.equal(await s.put(1, { a: 4 }), false, 'stale version refused');
  assert.equal((await s.get()).state.a, 3);
});
