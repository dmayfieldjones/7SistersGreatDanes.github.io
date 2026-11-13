// Where sources disagree: flags, the three-member agreement, the administrator's override, and the work queue.
import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, createSign } from 'node:crypto';
import { makeHandler } from '../../server/handler.mjs';
import { makeVerifier } from '../../server/auth.mjs';
import { memoryStore } from '../../server/store.mjs';

const REGION = 'us-east-2', POOL = 'us-east-2_DIFFS', CLIENT = 'c', ISS = `https://cognito-idp.${REGION}.amazonaws.com/${POOL}`;
const pair = generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwk = { ...pair.publicKey.export({ format: 'jwk' }), kid: 'k1', alg: 'RS256', use: 'sig' };
const enc = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const tok = (u, name) => { const h = enc({ alg: 'RS256', kid: 'k1' }), p = enc({ iss: ISS, aud: CLIENT, token_use: 'id', exp: Math.floor(Date.now() / 1000) + 600, 'cognito:username': u, name }); return `${h}.${p}.${createSign('RSA-SHA256').update(h + '.' + p).sign(pair.privateKey).toString('base64url')}`; };
const verify = makeVerifier({ region: REGION, poolId: POOL, clientId: CLIENT, getKeys: async () => ({ keys: [jwk] }) });
const fresh = () => makeHandler({ store: memoryStore(), verify, adminUsers: ['dmj'], network: null });
const call = async (h, method, args = [], t) => { const r = await h({ requestContext: { http: { method: 'POST' } }, rawPath: '/api/call', headers: t ? { authorization: 'Bearer ' + t } : {}, body: JSON.stringify({ method, args }) }); return { status: r.statusCode, ...JSON.parse(r.body) }; };
const [ann, ben, cat, dmj] = [tok('ann', 'Ann Example'), tok('ben', 'Ben Example'), tok('cat', 'Cat Example'), tok('dmj', 'Admin Person')];
const FLAG = { field: 'Sire', options: [{ value: 'Apache War Dance', source: 'Quintessa' }, { value: 'Apache War Paint', source: 'DANES World' }], mine: 1, evidence: 'Kennel Club certificate, seen at the breeder' };

test('raising a flag needs a member, two versions, a version you back, and how you know', async () => {
  const h = fresh();
  assert.equal((await call(h, 'raiseDiff', [412, FLAG])).status, 401);
  assert.equal((await call(h, 'raiseDiff', [412, { ...FLAG, evidence: '' }], ann)).status, 400);
  assert.equal((await call(h, 'raiseDiff', [412, { ...FLAG, options: [FLAG.options[0]] }], ann)).status, 400);
  assert.equal((await call(h, 'raiseDiff', [412, { ...FLAG, mine: 5 }], ann)).status, 400);
  assert.equal((await call(h, 'raiseDiff', [412, { ...FLAG, field: 'Colour' }], ann)).status, 400);
  const ok = await call(h, 'raiseDiff', [412, FLAG], ann);
  assert.equal(ok.ok, true); assert.equal(ok.result.status, 'open'); assert.deepEqual(ok.result.counts, [0, 1]);
  assert.equal((await call(h, 'raiseDiff', [412, FLAG], ben)).status, 400);   // the same difference is flagged once; others add their agreement
});
test('three different members backing one version resolves it; one member cannot vote three times', async () => {
  const h = fresh();
  const id = (await call(h, 'raiseDiff', [412, FLAG], ann)).result.id;
  await call(h, 'agreeDiff', [id, 1], ann); await call(h, 'agreeDiff', [id, 1], ann);   // the same member again: still one vote
  let d = (await call(h, 'getDog', [412], ann)).result.diffs[0];
  assert.equal(d.status, 'open'); assert.equal(d.counts[1], 1);
  await call(h, 'agreeDiff', [id, 1], ben);
  d = (await call(h, 'getDog', [412], ann)).result.diffs[0]; assert.equal(d.status, 'open'); assert.equal(d.counts[1], 2);
  const r = await call(h, 'agreeDiff', [id, 1, 'River Rock shows the same'], cat);
  assert.equal(r.result.status, 'resolved'); assert.equal(r.result.chosen, 1); assert.equal(r.result.by, 'members');
  assert.equal((await call(h, 'agreeDiff', [id, 0], ann)).status, 400);   // resolved flags take no more votes
});
test('a member who changes their mind moves their vote, and split votes do not resolve', async () => {
  const h = fresh();
  const id = (await call(h, 'raiseDiff', [412, FLAG], ann)).result.id;
  await call(h, 'agreeDiff', [id, 0], ben); await call(h, 'agreeDiff', [id, 0], cat);
  let d = (await call(h, 'getDog', [412], ann)).result.diffs[0]; assert.deepEqual(d.counts, [2, 1]); assert.equal(d.status, 'open');
  await call(h, 'agreeDiff', [id, 1], ben);
  d = (await call(h, 'getDog', [412], ann)).result.diffs[0]; assert.deepEqual(d.counts, [1, 2]); assert.equal(d.my, 1);
});
test('only the administrator can resolve or reopen, and the history keeps every step', async () => {
  const h = fresh();
  const id = (await call(h, 'raiseDiff', [412, FLAG], ann)).result.id;
  assert.equal((await call(h, 'resolveDiff', [id, 0], ben)).status, 403);
  const r = await call(h, 'resolveDiff', [id, 0, 'Breeder confirmed by phone'], dmj);
  assert.equal(r.result.status, 'resolved'); assert.equal(r.result.by, 'admin'); assert.equal(r.result.chosen, 0);
  assert.equal((await call(h, 'reopenDiff', [id], ben)).status, 403);
  const re = await call(h, 'reopenDiff', [id], dmj);
  assert.equal(re.result.status, 'open'); assert.equal(re.result.chosen, null);
  assert.ok(re.result.log.length >= 3);
});
test('the work queue is for signed-in members and lists the least-backed flags first', async () => {
  const h = fresh();
  const a = (await call(h, 'raiseDiff', [412, FLAG], ann)).result.id;
  await call(h, 'agreeDiff', [a, 1], ben);
  await call(h, 'raiseDiff', [413, { ...FLAG, field: 'Dam' }], cat);
  assert.equal((await call(h, 'openDiffs', [])).status, 401);
  const q = (await call(h, 'openDiffs', [], ben)).result;
  assert.equal(q.length, 2); assert.equal(q[0].field, 'Dam'); assert.ok(q[0].dogName);
});
