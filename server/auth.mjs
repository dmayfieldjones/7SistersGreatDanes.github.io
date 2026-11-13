// Checks a Cognito sign-in token. The server never trusts who the page says someone is: it verifies the token's signature against the
// user pool's published keys, then reads the identity from the token itself.
import { createPublicKey, createVerify } from 'node:crypto';

const b64 = (s) => Buffer.from(s, 'base64url');

// getKeys(): resolves to a JWKS ({keys:[...]}). In production it fetches the pool's keys and caches them; tests pass their own.
export function makeVerifier({ region, poolId, clientId, getKeys, now = () => Date.now() }) {
  const issuer = `https://cognito-idp.${region}.amazonaws.com/${poolId}`;
  const keyCache = new Map();
  async function keyFor(kid) {
    if (keyCache.has(kid)) return keyCache.get(kid);
    const jwks = await getKeys(issuer);
    const jwk = (jwks.keys || []).find((k) => k.kid === kid && k.kty === 'RSA');
    if (!jwk) return null;
    const key = createPublicKey({ key: jwk, format: 'jwk' });
    keyCache.set(kid, key);
    return key;
  }
  // returns {username, name} or throws Error('invalid token')
  return async function verify(token) {
    const bad = () => { throw new Error('invalid token'); };
    if (typeof token !== 'string' || token.length > 4096) bad();
    const parts = token.split('.');
    if (parts.length !== 3) bad();
    let header, claims;
    try { header = JSON.parse(b64(parts[0]).toString()); claims = JSON.parse(b64(parts[1]).toString()); } catch { bad(); }
    if (header.alg !== 'RS256' || !header.kid) bad();           // never accept 'none' or a symmetric algorithm
    const key = await keyFor(header.kid);
    if (!key) bad();
    const ok = createVerify('RSA-SHA256').update(parts[0] + '.' + parts[1]).verify(key, b64(parts[2]));
    if (!ok) bad();
    if (claims.iss !== issuer) bad();
    if (claims.token_use !== 'id') bad();
    if (claims.aud !== clientId) bad();
    if (typeof claims.exp !== 'number' || claims.exp * 1000 <= now()) bad();
    const username = String(claims['cognito:username'] || '').toLowerCase();
    if (!username) bad();
    return { username, name: typeof claims.name === 'string' ? claims.name.slice(0, 80) : '' };
  };
}

// production key fetch: the pool's public keys, cached for an hour
export function fetchingKeys(fetchImpl = fetch) {
  let cached = null, at = 0;
  return async (issuer) => {
    if (cached && Date.now() - at < 3600e3) return cached;
    const r = await fetchImpl(issuer + '/.well-known/jwks.json');
    if (!r.ok) throw new Error('keys unavailable');
    cached = await r.json(); at = Date.now();
    return cached;
  };
}
