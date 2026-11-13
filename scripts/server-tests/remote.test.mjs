// The page's server client, wired straight to the server handler (no network): proves the two halves agree on the contract.
import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, createSign } from 'node:crypto';
import { makeHandler } from '../../server/handler.mjs';
import { makeVerifier } from '../../server/auth.mjs';
import { memoryStore } from '../../server/store.mjs';

const REGION = 'us-east-2', POOL = 'us-east-2_T', CLIENT = 'c1', ISS = `https://cognito-idp.${REGION}.amazonaws.com/${POOL}`;
const pair = generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwk = { ...pair.publicKey.export({ format: 'jwk' }), kid: 'k1' };
const enc = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const tok = (u, name) => { const h = enc({ alg: 'RS256', kid: 'k1' }), p = enc({ iss: ISS, aud: CLIENT, token_use: 'id', exp: Math.floor(Date.now() / 1000) + 600, 'cognito:username': u, name }); return `${h}.${p}.${createSign('RSA-SHA256').update(h + '.' + p).sign(pair.privateKey).toString('base64url')}`; };
const handler = makeHandler({ store: memoryStore(), verify: makeVerifier({ region: REGION, poolId: POOL, clientId: CLIENT, getKeys: async () => ({ keys: [jwk] }) }), adminUsers: ['dmj'] });

let serverUp = true;
globalThis.window = globalThis;
globalThis.fetch = async (url, init = {}) => {
  if (String(url).endsWith('/data/dog-server.json')) return { ok: true, json: async () => ({ api: 'https://api.example/' }) };
  if (String(url).startsWith('https://api.example/api/call')) {
    if (!serverUp) throw new TypeError('network down');
    const r = await handler({ requestContext: { http: { method: 'POST' } }, rawPath: '/api/call', headers: init.headers, body: init.body });
    return { ok: r.statusCode < 400, json: async () => JSON.parse(r.body) };
  }
  return { ok: false };
};
await import('../../public/dog-api.js');
// the server keeps hold of the rules before the page client replaces window.DogAPI (in real life they are different processes)
await handler({ requestContext: { http: { method: 'POST' } }, rawPath: '/api/call', headers: {}, body: JSON.stringify({ method: 'ourDogs', args: [] }) });
await import('../../public/dog-api-remote.js');
const api = globalThis.DogAPI;

test('the client talks to the server and carries the sign-in token', async () => {
  const s = await api.init();
  assert.equal(api.remote(), true); assert.equal(s.role, 'visitor');
  assert.equal((await api.getDog(412)).dog.call, 'Piper');
  await assert.rejects(api.lookup('WS11111111'), { code: 'login_required' });
  const me = await api.useLogin({ username: 'sam', name: 'Sam Quinn', token: tok('sam', 'Sam Quinn') });
  assert.equal(me.role, 'member'); assert.equal(me.name, 'Sam Quinn');
  const rec = await api.addRecord(412, { type: 'win', name: 'Best of Breed', value: '1st', url: 'https://example.org/w' });
  assert.equal(rec.author, me.actor);
  await assert.rejects(api.addRecord(412, { type: 'test', name: 'Hips', value: 'Good', url: 'https://e' }), { code: 'forbidden' });
  assert.equal((await api.getPedigree(412, 5)).nodes[2][0].length > 3, true);
});

test('signing out returns to visitor, a forged token is refused, and an expired session says so', async () => {
  assert.equal((await api.signOut()).role, 'visitor');
  await assert.rejects(api.useLogin({ username: 'dmj', token: 'a.b.c' }), { code: 'login_required' });
  assert.equal((await api.session()).role, 'visitor', 'a refused token leaves you a visitor');
  const admin = await api.useLogin({ username: 'dmj', name: 'Dustin', token: tok('dmj', 'Dustin') });
  assert.equal(admin.role, 'admin');
  assert.ok(Array.isArray(await api.actionLog()));
});

test('the demo-only calls do nothing against a real server, and a down server gives a clear error', async () => {
  await api.signOut();
  const s = await api.setActor(0);
  assert.equal(s.role, 'visitor', 'setActor cannot make anyone an administrator');
  serverUp = false;
  await assert.rejects(api.getDog(412), { code: 'unavailable' });
  serverUp = true;
});
