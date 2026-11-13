/*
 * Connects the dog page to the real server. It replaces window.DogAPI with the same set of methods: if /data/dog-server.json names a server,
 * each call goes there with the member's sign-in token; if not, every call goes to the in-browser demo in dog-api.js, as before.
 * The page does not know which one it is talking to. The server decides who the caller is by checking the token itself.
 */
(function (root) {
  'use strict';
  var local = root.DogAPI, server = null, token = null;
  var REMOTE = ['session', 'authors', 'lookup', 'ourDogs', 'confirmDog', 'claimDog', 'setVisibility', 'noteGalaxy', 'getDog', 'getPedigree',
    'openAncestor', 'saveFact', 'addRecord', 'flagClaim', 'correctClaim', 'hideClaim', 'suggestCategory',
    'wanted', 'markAdded', 'accountRequests', 'decideRequest', 'actionLog'];
  var down = { code: 'unavailable', message: 'The server could not be reached. Check your connection and try again.' };

  function call(method, args) {
    var h = { 'content-type': 'application/json' };
    if (token) h.authorization = 'Bearer ' + token;
    return fetch(server + '/api/call', { method: 'POST', headers: h, body: JSON.stringify({ method: method, args: args }) })
      .then(function (r) { return r.json().catch(function () { return { ok: false, error: down }; }); }, function () { return { ok: false, error: down }; })
      .then(function (j) {
        if (j && j.ok) return j.result;
        var e = (j && j.error) || down;
        if (e.code === 'login_required' && token) { token = null; e = { code: 'login_required', message: 'Your sign-in expired. Sign in again.' }; }
        return Promise.reject(e);
      });
  }

  var api = {};
  Object.keys(local).forEach(function (k) { if (typeof local[k] === 'function') api[k] = function () { return local[k].apply(local, arguments); }; });
  REMOTE.forEach(function (m) { api[m] = function () { var a = [].slice.call(arguments); return server ? call(m, a) : local[m].apply(local, a); }; });
  Object.defineProperty(api, 'visitorGens', { get: function () { return local.visitorGens; }, set: function (v) { local.visitorGens = v; } });
  api.remote = function () { return !!server; };
  api.init = function () {
    return fetch('/data/dog-server.json').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
      .then(function (cfg) { server = (cfg && typeof cfg.api === 'string') ? cfg.api.replace(/\/$/, '') : null; return server ? call('session', []) : local.init(); });
  };
  api.useLogin = function (id) {
    if (!server) return local.useLogin(id);
    token = id && id.token || null;
    return call('session', []).catch(function (e) { token = null; throw e; });
  };
  api.signOut = function () { if (!server) return local.signOut(); token = null; return call('session', []); };
  api.setActor = function (id) { return server ? call('session', []) : local.setActor(id); };   // choosing who you are is only for the demo
  root.DogAPI = api;
})(window);
