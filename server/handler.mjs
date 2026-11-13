// The dog-page server. One entry point for API Gateway (HTTP API, payload v2). It checks the sign-in token, runs the same rules the demo
// follows (public/dog-api.js, the single copy of the rules), and saves what changed.
//
// POST /api/call   {"method": "...", "args": [...]}   with an optional  Authorization: Bearer <Cognito id token>
// GET  /api/health
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

// The calls a browser may make. Anything else (setActor, useLogin, importState, ...) does not exist as far as the outside world goes.
export const METHODS = new Set([
  'session', 'authors', 'lookup', 'ourDogs', 'confirmDog', 'claimDog', 'setVisibility', 'noteGalaxy', 'getDog', 'getPedigree',
  'openAncestor', 'saveFact', 'addRecord', 'flagClaim', 'correctClaim', 'hideClaim', 'suggestCategory',
  'wanted', 'markAdded', 'accountRequests', 'decideRequest', 'actionLog',
]);
const STATUS = { login_required: 401, forbidden: 403, not_found: 404, invalid: 400 };
const MAX_BODY = 20000, MAX_STRING = 2000;

// The rules module keeps its state in one place, so calls are handled one at a time.
let chain = Promise.resolve();
const exclusive = (fn) => { const run = chain.then(fn, fn); chain = run.catch(() => {}); return run; };

let apiPromise = null;
function loadApi(dataDir) {
  if (!apiPromise) {
    apiPromise = (async () => {
      await import('../public/dog-api.js');
      const api = globalThis.DogAPI;
      api.setLoader(async (path) => JSON.parse(await readFile(join(dataDir, path.replace(/^\/data\//, '')), 'utf8')));
      await api.init();
      return api;
    })();
  }
  return apiPromise;
}

// arguments are plain data of a sane size: no functions, no huge strings, no deep nesting
function sane(v, depth = 0) {
  if (v === null || typeof v === 'number' || typeof v === 'boolean') return true;
  if (typeof v === 'string') return v.length <= MAX_STRING;
  if (depth > 3) return false;
  if (Array.isArray(v)) return v.length <= 30 && v.every((x) => sane(x, depth + 1));
  if (typeof v === 'object') { const k = Object.keys(v); return k.length <= 30 && k.every((x) => x.length <= 60 && sane(v[x], depth + 1)); }
  return false;
}

export function makeHandler({ store, verify, dataDir = join(HERE, '..', 'public', 'data'), adminUsers = ['dmj'], allowOrigin = '*' }) {
  const admins = new Set(adminUsers.map((u) => u.toLowerCase()));
  const headers = {
    'content-type': 'application/json',
    'access-control-allow-origin': allowOrigin,
    'access-control-allow-headers': 'authorization,content-type',
    'access-control-allow-methods': 'POST,GET,OPTIONS',
    'cache-control': 'no-store',
  };
  const reply = (statusCode, body) => ({ statusCode, headers, body: JSON.stringify(body) });
  const error = (code, message, status) => reply(status || STATUS[code] || 500, { ok: false, error: { code, message } });

  return async function handler(event) {
    const http = (event.requestContext && event.requestContext.http) || {};
    const method = (http.method || '').toUpperCase(), path = event.rawPath || '';
    if (method === 'OPTIONS') return { statusCode: 204, headers, body: '' };
    if (method === 'GET' && path.endsWith('/health')) return reply(200, { ok: true });
    if (method !== 'POST' || !path.endsWith('/call')) return error('not_found', 'No such address.', 404);

    let raw = event.body || '';
    if (event.isBase64Encoded) raw = Buffer.from(raw, 'base64').toString();
    if (raw.length > MAX_BODY) return error('invalid', 'That request is too large.', 413);
    let req;
    try { req = JSON.parse(raw); } catch { return error('invalid', 'The request was not understood.', 400); }
    if (!req || typeof req.method !== 'string' || !METHODS.has(req.method)) return error('not_found', 'No such call.', 404);
    const args = req.args === undefined ? [] : req.args;
    if (!Array.isArray(args) || args.length > 4 || !sane(args)) return error('invalid', 'The request was not acceptable.', 400);

    // who is calling: only a token that verifies counts; a bad one is refused rather than treated as a visitor
    let who = null;
    const auth = (event.headers && (event.headers.authorization || event.headers.Authorization)) || '';
    if (auth) {
      const m = /^Bearer (.+)$/.exec(auth);
      try { if (!m) throw new Error('x'); who = await verify(m[1]); }
      catch { return error('login_required', 'Your sign-in could not be verified. Sign in again.', 401); }
    }
    // a visitor's page reports galaxy matches too; only a signed-in member's report may change the wanted list
    if (!who && req.method === 'noteGalaxy') return reply(200, { ok: true, result: { ok: true } });

    const api = await loadApi(dataDir);
    return exclusive(async () => {
      for (let attempt = 0; attempt < 5; attempt++) {
        const { version, state } = await store.get();
        api.importState(state);
        const before = JSON.stringify(api.exportState());
        try {
          if (who) await api.useLogin({ username: who.username, name: who.name, admin: admins.has(who.username) });
          const result = await api[req.method].apply(api, args);
          const next = api.exportState();
          if (JSON.stringify(next) === before) return reply(200, { ok: true, result });
          if (await store.put(version, next)) return reply(200, { ok: true, result });
          // someone else saved first: read again and redo the call
        } catch (e) {
          if (e && e.code) return error(e.code, e.message);
          return error('internal', 'Something went wrong.', 500);
        }
      }
      return error('internal', 'The server was busy. Try again.', 503);
    });
  };
}
