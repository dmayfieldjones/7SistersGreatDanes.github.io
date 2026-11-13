// The administrator's activity report: who did what, who is a member, and the cap on the trail.
import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, createSign } from 'node:crypto';
import { makeHandler } from '../../server/handler.mjs';
import { makeVerifier } from '../../server/auth.mjs';
import { memoryStore } from '../../server/store.mjs';

const REGION = 'us-east-2', POOL = 'us-east-2_ACTV', CLIENT = 'c', ISS = `https://cognito-idp.${REGION}.amazonaws.com/${POOL}`;
const pair = generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwk = { ...pair.publicKey.export({ format: 'jwk' }), kid: 'k1', alg: 'RS256', use: 'sig' };
const enc = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const tok = (u, name) => { const h = enc({ alg: 'RS256', kid: 'k1' }), p = enc({ iss: ISS, aud: CLIENT, token_use: 'id', exp: Math.floor(Date.now() / 1000) + 600, 'cognito:username': u, name }); return `${h}.${p}.${createSign('RSA-SHA256').update(h + '.' + p).sign(pair.privateKey).toString('base64url')}`; };
const verify = makeVerifier({ region: REGION, poolId: POOL, clientId: CLIENT, getKeys: async () => ({ keys: [jwk] }) });
const fresh = () => makeHandler({ store: memoryStore(), verify, adminUsers: ['dmj'], network: null });
const call = async (h, method, args = [], t) => { const r = await h({ requestContext: { http: { method: 'POST' } }, rawPath: '/api/call', headers: t ? { authorization: 'Bearer ' + t } : {}, body: JSON.stringify({ method, args }) }); return { status: r.statusCode, ...JSON.parse(r.body) }; };
const [ann, ben, cat, dmj] = [tok('ann', 'Ann Example'), tok('ben', 'Ben Example'), tok('cat', 'Cat Example'), tok('dmj', 'Admin Person')];
const FLAG = { field: 'Sire', options: [{ value: 'Apache War Dance', source: 'Quintessa' }, { value: 'Apache War Paint', source: 'DANES World' }], mine: 1, evidence: 'Kennel Club certificate' };

test('the activity report is for the administrator only', async () => {
  const h = fresh();
  assert.equal((await call(h, 'activityReport', [])).status, 401);
  assert.equal((await call(h, 'activityReport', [], ann)).status, 403);
  assert.equal((await call(h, 'activityReport', [], dmj)).ok, true);
});
test('each kind of change is logged with who did it and which dog, and members are counted', async () => {
  const h = fresh();
  const mine = (await call(h, 'lookup', ['WS99999901'], ann)).result.dogId;      // a new page, which Ann then claims
  await call(h, 'claimDog', [mine], ann);
  await call(h, 'addIdentifier', [mine, 'OFA', 'GD-HD1234G24M-VPI'], ann);
  const id = (await call(h, 'raiseDiff', [412, FLAG], ben)).result.id;
  await call(h, 'agreeDiff', [id, 1], cat);
  await call(h, 'saveFact', [mine, 'Death date', '2030-01-01'], ann);
  const r = (await call(h, 'activityReport', [], dmj)).result;
  const kinds = r.feed.map((x) => x.kind + ':' + x.whoName);
  assert.deepEqual(kinds.reverse(), ['dog:Ann Example', 'claim:Ann Example', 'record:Ann Example', 'flag:Ben Example', 'flag:Cat Example', 'record:Ann Example']);
  assert.equal(r.feed[0].whoName, 'Ann Example');           // newest first
  assert.ok(r.feed.every((x) => x.t && x.text));
  assert.ok(r.feed.some((x) => x.dogName && x.dog === 412));
  const m = Object.fromEntries(r.members.map((x) => [x.name, x]));
  assert.deepEqual([m['Ann Example'].counts.dog, m['Ann Example'].counts.claim, m['Ann Example'].counts.record], [1, 1, 2]);
  assert.equal(m['Ben Example'].counts.flag, 1); assert.equal(m['Cat Example'].counts.flag, 1);
  assert.ok(m['Ann Example'].seen, 'last seen is recorded');
  assert.equal(m['Ann Example'].username, 'ann');
});
test('a refused change leaves nothing in the trail', async () => {
  const h = fresh();
  await call(h, 'addIdentifier', [412, 'AKC', 'WS12345678'], ann);                 // refused: only OFA or CHIC
  await call(h, 'raiseDiff', [412, { ...FLAG, evidence: '' }], ann);               // refused: no evidence
  assert.equal((await call(h, 'activityReport', [], dmj)).result.feed.length, 0);
});
test('the trail keeps only its newest 1500 lines', async () => {
  const h = fresh();
  const id = (await call(h, 'raiseDiff', [412, FLAG], ann)).result.id;
  for (let i = 0; i < 1510; i++) await call(h, 'agreeDiff', [id, i % 2], ann);   // one member changing a vote over and over never resolves it
  const r = (await call(h, 'activityReport', [], dmj)).result;
  assert.equal(r.kept, 1500); assert.equal(r.max, 1500);
  assert.equal(r.feed.length, 300);
});

test('the people in the data file keep their names on the server, so the administrator and the importer are not "Unknown"', async () => {
  const h = fresh();
  const a = (await call(h, 'authors', [], ann)).result;
  assert.equal(a[1].name, 'Dustin Mayfield-Jones');
  assert.ok(a[3] && a[3].name);
  await call(h, 'addIdentifier', [412, 'OFA', 'GD-HD7777G24M-VPI'], dmj);          // the administrator acts as author 1
  const r = (await call(h, 'activityReport', [], dmj)).result;
  assert.ok(r.members.some((m) => m.name === 'Dustin Mayfield-Jones' && m.username === 'dmj'));
  assert.ok(!r.members.some((m) => /^Member \d+$/.test(m.name)));
});
