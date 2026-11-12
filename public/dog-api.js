/*
 * DEMO BACKEND for the dog page.
 *
 * The page (dog-page-demo.html) never touches data directly: it only calls the methods below. This file keeps everything in memory and
 * enforces the same rules a real server would (who may add, flag, correct, hide). In the real system this file is replaced by a client with
 * the same methods that calls the server with the member's login token; the page does not change.
 *
 * Every method returns a Promise. A refused call rejects with {code, message}, where code is one of:
 *   login_required   the caller is a visitor and the call needs a member
 *   forbidden        the caller is signed in but not allowed (not the author, not an admin, ...)
 *   not_found        no such dog or record
 *   invalid          the data sent is not acceptable
 *
 * The contract (what the real server must provide), by method:
 *   init()                          load shared reference data; returns the session
 *   session() / setActor(id)        who is signed in (setActor is demo only: the real server reads the login token)
 *   useLogin({username,name,groups})  demo only: turn a verified sign-in into a role. The real server verifies the signed token itself
 *   signOut()                       back to visitor
 *   authors()                       {authorId: {name, role, status}}
 *   lookup(number)                  find a dog by any registration number, or create a stub and log it as wanted
 *   noteGalaxy(dogId, inGalaxy)     the page reports whether the galaxy file has the dog; the server updates the stub and the wanted list
 *   getDog(dogId)                   everything the page needs about one dog, with per-record permissions already worked out
 *   getPedigree(dogId, gens)        names and numbers for the pedigree (members only)
 *   openAncestor(dogId, key)        open (or create) the page for an ancestor in this dog's pedigree (members only)
 *   saveFact(dogId, name, value, src)   add or correct a single-valued fact (born, died, cause of death)
 *   addRecord(dogId, record)        add a test result, win, litter or link
 *   flagClaim(claimId, {reason, evidence})   dispute a record (any member except its author)
 *   correctClaim(claimId, value)    new version of a record (its author, or an admin)
 *   hideClaim(claimId, reason)      hide a record, kept in the data (admin only)
 *   suggestCategory(text)           suggest a new cause-of-death category (members)
 *   wanted(), markAdded(number), accountRequests(), decideRequest(id, approve), actionLog()   administrator only
 */
(function (root) {
  'use strict';

  var TITLE = /^(AM|CAN|INT|MEX|NORD|EST|SWD|FIN|JPN|UKC|AKC|CH|GCH\w*|BISS?|BIS|ROM|HOF|AOM|&)$/i;
  var AKCNO = /^[A-Z]{2}\d{6,}$/;
  // Demo only: which sign-in names map to which demo identity. The real server maps a verified token to a member; nothing here is a security control.
  var LOGINS = { 'dmj': 0, 'trial-member': 9 };
  var shortName = function (label) { var p = String(label).trim().split(/\s+/); return p.length < 2 ? label : p[0] + ' ' + p[p.length - 1].charAt(0) + '.'; };
  var NOW = function () { return new Date().toISOString().slice(0, 10); };
  var fail = function (code, message) { return Promise.reject({ code: code, message: message }); };

  function splitTitle(n) {
    var t = String(n).split(' '), ti = [];
    while (t.length && TITLE.test(t[0].replace(/,$/, ''))) ti.push(t.shift());
    return { title: ti.join(' '), name: t.join(' ') };
  }
  function regOf(r) {
    var parts = String(r).split(' / ');
    for (var i = 0; i < parts.length; i++) { var t = parts[i].trim(); if (AKCNO.test(t)) return t; }
    return parts[0].trim();
  }
  function norm(q) { return String(q).toUpperCase().replace(/\s+/g, ''); }

  // ---- the stores -------------------------------------------------------------------------------------------------------------
  var authors = {};
  var priv = { peds: {}, photoRegs: [] };      // pedigree names and the list of dogs with a photo elsewhere: loaded from a private file
  var actorId = null;                           // demo only. null = visitor (not signed in), 0 = administrator
  var loginName = null;
  var nextId = 100;

  var dogs = {
    412: { id: 412, registered: 'CH Legado N Danekraaft’s How Can I Tell You?', call: 'Piper', sex: 'female', color: 'fawn', photo: '/img/piper.jpg', ext: true, litter: 'L412' },
    413: { id: 413, registered: 'CH 7sisters N Legado’s I Wanna Dance, I Wanna Win', call: 'Mia', sex: 'female', color: 'fawn', photo: '', ext: false, litter: 'L2023' },
    414: { id: 414, registered: '7sisters N Legado’s Heart Of Gold', call: 'Cora', sex: 'female', color: 'fawn', photo: '', ext: false, litter: 'L2024' }
  };
  // A litter is stored once: its sire, dam, whelp date and breeders. Each dog points to its litter.
  var litters = {
    L412: { whelp: '2020-09-26', src: 'AKC', author: 1, breeders: ['p1', 'p2', 'p3', 'p4'],
      sire: { reg: 'WS54036904', name: 'PRF Fendane Have I Gone Mad', title: 'Am CH' }, dam: { reg: 'WS59632103', name: 'Danekraafts It\'s a Jungle Out Here', title: 'UKC & Int Ch' } },
    L2023: { whelp: '2023-07-09', src: 'AKC', author: 1, breeders: ['u2', 'u1', 'p2', 'p1'],
      sire: { reg: 'WS66273805', name: 'Fendanesylcrest N Diriso\'s This Is The Right Time', title: 'GCHS CH' }, dam: { reg: 'WS69691106', name: 'Legado N Danekraaft\'s How Can I Tell You?', title: 'CH' } },
    L2024: { whelp: '2024-08-19', src: 'AKC', author: 1, breeders: ['u2', 'u1', 'p2', 'p1'],
      sire: { reg: 'WS80095602', name: 'Legado N Izya\'s Oops! I Did It Again', title: '' }, dam: { reg: 'WS69691106', name: 'Legado N Danekraaft\'s How Can I Tell You?', title: 'CH' } }
  };
  var identifiers = [
    { dog: 412, registry: 'AKC', number: 'WS69691106', author: 1, date: '2026-11-12' },
    { dog: 412, registry: 'OFA', number: 'OFA25G', author: 1, date: '2026-11-12' },
    { dog: 412, registry: 'CHIC', number: 'CHIC181340', author: 1, date: '2026-11-12' },
    { dog: 413, registry: 'AKC', number: 'WS81418801', author: 1, date: '2026-11-12' },
    { dog: 413, registry: 'OFA', number: 'OFA30F', author: 1, date: '2026-11-12' },
    { dog: 413, registry: 'CHIC', number: 'CHIC215182', author: 1, date: '2026-11-12' },
    { dog: 414, registry: 'AKC', number: 'WS84850303', author: 1, date: '2026-11-12' }
  ];
  // People who can be credited as breeders or owners. Names are as AKC lists them; consent:false shows only a short form.
  var people = {
    u1: { label: 'Dustin Mayfield-Jones', member: 1, consent: true },
    u2: { label: 'Karen Mayfield-Jones', member: 2, consent: true },
    p1: { label: 'Jason L Dubman', member: null, consent: true },
    p2: { label: 'Francisco Camacho', member: null, consent: true },
    p3: { label: 'Priyanka Deshmuhk', member: null, consent: true },
    p4: { label: 'Phoebe Dubman', member: null, consent: true },
    p5: { label: 'Karen Martin', member: null, consent: true }
  };
  function C(id, dog, type, name, value, extra) {
    var c = { id: id, dog: dog, type: type, name: name, value: value, url: '', src: '', ver: 1, author: 1, date: '2026-11-12', ev: 'link', status: 'visible', flags: [] };
    for (var k in (extra || {})) c[k] = extra[k];
    return c;
  }
  var claims = [
    C(6, 412, 'fact', 'Whelp date', '2020-09-26', { src: 'AKC' }),
    C(25, 413, 'fact', 'Whelp date', '2023-07-09', { src: 'AKC' }),
    C(35, 414, 'fact', 'Whelp date', '2024-08-19', { src: 'AKC' }),
    C(2, 412, 'link', 'Embark', 'pending'), C(28, 413, 'link', 'Embark', 'pending'), C(38, 414, 'link', 'Embark', 'pending'),
    C(70, 412, 'claim', 'Claimed by', 'u2', { start: '2026-11-12' }),
    C(71, 413, 'claim', 'Claimed by', 'u2', { start: '2026-11-12' }),
    C(72, 414, 'claim', 'Claimed by', 'u2', { start: '2026-11-12' }),
    // ownership history from AKC: our own dogs only, not part of the shared model
    C(17, 412, 'ownership', 'Ownership', 'u2', { co: ['u1', 'p2', 'p1'], start: '2020-12-02', end: '', src: 'AKC' }),
    C(51, 413, 'ownership', 'Ownership', 'u2', { co: ['u1', 'p2', 'p5'], start: '2026-08-01', end: '', src: 'AKC' }),
    C(52, 413, 'ownership', 'Ownership', 'u2', { co: ['u1', 'p5'], start: '2026-02-26', end: '2026-08-01', src: 'AKC' }),
    C(53, 413, 'ownership', 'Ownership', 'u2', { co: ['u1'], start: '2023-08-29', end: '2026-02-26', src: 'AKC' }),
    C(54, 413, 'ownership', 'Ownership', 'u2', { co: ['u1', 'p2', 'p1'], start: '2023-07-09', end: '2023-08-29', src: 'AKC' }),
    C(55, 414, 'ownership', 'Ownership', 'u2', { co: ['u1', 'p2', 'p5'], start: '2026-08-01', end: '', src: 'AKC' }),
    C(56, 414, 'ownership', 'Ownership', 'u2', { co: ['u1', 'p5'], start: '2026-02-26', end: '2026-08-01', src: 'AKC' }),
    C(57, 414, 'ownership', 'Ownership', 'u2', { co: ['u1'], start: '2025-01-17', end: '2026-02-26', src: 'AKC' }),
    C(58, 414, 'ownership', 'Ownership', 'u2', { co: ['u1', 'p2', 'p1'], start: '2024-08-19', end: '2025-01-17', src: 'AKC' }),
    C(7, 412, 'litter', 'Rolex', 'Litter page', { url: '/RolexXPiper', whelp: '2023-07-09' }),
    C(8, 412, 'litter', 'Sean', 'Litter page', { url: '/SeanXPiper', whelp: '2024-08-19' }),
    C(9, 412, 'litter', 'Ezra', 'Litter page', { url: '/EzraxPiper', whelp: '2026-03-23' }),
    C(3, 412, 'test', 'Echocardiogram (sample)', 'Normal', { url: 'https://example.org/sample-cert', ev: 'doc', date: '2026-09-14',
      flags: [{ author: 2, reason: 'Wrong date', evidence: 'https://example.org/sample-report', date: '2026-09-16' }] }),
    C(4, 412, 'test', 'Temperament test (sample)', 'Pass', { url: 'https://example.org/sample-cert-2', ev: 'doc', date: '2026-10-02', author: 2 }),
    C(5, 412, 'win', 'Sample specialty show', 'Best of Winners', { url: 'https://example.org/sample-results', date: '2026-10-20' })
  ];
  var requests = [
    { id: 'r1', name: 'Taylor Brooks', role: 'Breeder', verify: 'Kennel website and AKC breeder listing' },
    { id: 'r2', name: 'xX_dane_lover_Xx', role: 'Owner', verify: 'None provided' }
  ];
  var wantedList = {};      // registration number -> {count, first, last, how}
  var log = [];             // administrator action log

  // ---- helpers ----------------------------------------------------------------------------------------------------------------
  function isMember() { return actorId !== null; }
  function isAdmin() { return actorId === 0; }
  function needMember() { return isMember() ? null : fail('login_required', 'Sign in to do that.'); }
  function needAdmin() { return !isMember() ? fail('login_required', 'Sign in to do that.') : (isAdmin() ? null : fail('forbidden', 'Administrator only.')); }
  function logAction(text) { log.unshift({ date: NOW(), text: text }); }
  function copy(x) { return JSON.parse(JSON.stringify(x)); }
  function idsOf(dogId) { return identifiers.filter(function (i) { return i.dog === dogId; }); }
  function primaryReg(dogId) { var l = idsOf(dogId); return (l.filter(function (x) { return x.registry === 'AKC'; })[0] || l[0] || {}).number; }
  function dogByNumber(n) { var i = identifiers.filter(function (x) { return x.number === n; })[0]; return i ? i.dog : null; }
  function photoRegOf(r) {
    var parts = String(r || '').split(' / ');
    for (var i = 0; i < parts.length; i++) { var t = parts[i].trim(); if (AKCNO.test(t) && priv.photoRegs.indexOf(t) > -1) return t; }
    return null;
  }
  function claimById(id) { return claims.filter(function (c) { return String(c.id) === String(id); })[0]; }
  function annotate(c) {
    var mine = isMember() && c.author === actorId;
    var o = copy(c);
    o.can = { correct: isMember() && (mine || isAdmin()), flag: isMember() && !mine, hide: isAdmin() };
    return o;
  }
  function wantedLog(reg, how) {
    var w = wantedList[reg] || (wantedList[reg] = { count: 0, first: NOW(), how: how });
    w.count++; w.last = NOW(); w.how = how;
  }
  function reroot(src, k) {
    var out = {};
    for (var d = 0; d <= 8; d++) for (var off = 0; off < (1 << d); off++) { var from = k * (1 << d) + off; if (src[from]) out[(1 << d) + off] = src[from]; }
    return out;
  }
  function pedOf(dogId) { return priv.peds[dogId] || {}; }
  function parentsOf(dogId) {
    var d = dogs[dogId], L = d && litters[d.litter], out = [];
    function row(role, p, key, author, src) {
      out.push({ role: role, name: p.name, title: p.title, reg: p.reg, key: key, author: author, src: src, dogId: dogByNumber(p.reg), photoReg: photoRegOf(p.reg) });
    }
    if (L) { row('Sire', L.sire, 2, L.author, 'litter record'); row('Dam', L.dam, 3, L.author, 'litter record'); return { rows: out, restricted: false }; }
    if (!isMember()) return { rows: [], restricted: Object.keys(pedOf(dogId)).length > 0 };
    var P = pedOf(dogId);
    [[2, 'Sire'], [3, 'Dam']].forEach(function (x) {
      if (!P[x[0]]) return;
      var e = P[x[0]], sp = splitTitle(e[0]);
      row(x[1], { name: sp.name, title: sp.title, reg: regOf(e[1].split(' · ')[0]) }, x[0], 3, 'pedigree data');
    });
    return { rows: out, restricted: false };
  }
  function peopleFor() {
    var o = copy(people);
    if (!isMember()) Object.keys(o).forEach(function (k) { if (o[k].member === null) { o[k].label = shortName(o[k].label); o[k].consent = false; } });
    return o;
  }
  function offspringOf(dogId) {
    var reg = primaryReg(dogId), kids = [];
    Object.keys(dogs).forEach(function (id) {
      var d = dogs[id], L = litters[d.litter];
      if (!L || String(id) === String(dogId)) return;
      var role = L.dam.reg === reg ? 'her' : (L.sire.reg === reg ? 'his' : null);
      if (!role) return;
      var w = claims.filter(function (c) { return String(c.dog) === String(id) && c.type === 'fact' && c.name === 'Whelp date'; })[0];
      kids.push({ dogId: d.id, call: d.call, role: role, whelp: w ? w.value : '' });
    });
    return kids;
  }

  // ---- the API ----------------------------------------------------------------------------------------------------------------
  var API = {
    init: function () {
      return Promise.all([
        fetch('/data/demo-authors.json').then(function (r) { return r.json(); }).then(function (j) { authors = j; }).catch(function () { }),
        // Pedigree names and the list of dogs with a photo elsewhere are not part of the code: they come from a private file that is not
        // committed. In the real system they live behind the members-only service.
        fetch('/data/private/ped-sample.json').then(function (r) { if (!r.ok) throw new Error('none'); return r.json(); }).then(function (j) {
          priv.peds[412] = j.piper; priv.peds[413] = j.mia; priv.photoRegs = j.hasphoto || [];
          // Cora: her dam side is Piper's ancestry shifted one generation. Her sire side is not in the sample data.
          var c = { 1: ['7Sisters N Legado\'s Heart Of Gold', 'WS84850303 · Fawn · F · 2024-08-19'], 2: ['Legado N Izya\'s Oops! I Did It Again', 'WS80095602 ·  · M · '] };
          Object.keys(j.piper).forEach(function (kp) { kp = Number(kp); var d = Math.floor(Math.log(kp) / Math.LN2), off = kp - (1 << d); c[3 * (1 << d) + off] = j.piper[kp]; });
          priv.peds[414] = c;
        }).catch(function () { })
      ]).then(function () { return API.session(); });
    },
    setActor: function (id) { actorId = (id === null || id === undefined || id === 'v') ? null : Number(id); return API.session(); },
    session: function () {
      var role = actorId === null ? 'visitor' : (actorId === 0 ? 'admin' : 'member');
      return Promise.resolve({ actor: actorId, role: role, name: actorId === null ? 'Visitor' : (loginName || (authors[actorId] || {}).name) });
    },
    useLogin: function (id) {
      var u = String(id && id.username || '').toLowerCase();
      if (!(u in LOGINS)) { actorId = null; return fail('forbidden', 'That account is not set up for the dog pages yet.'); }
      actorId = LOGINS[u]; loginName = id.name || u;
      return API.session();
    },
    signOut: function () { actorId = null; loginName = null; return API.session(); },
    authors: function () { return Promise.resolve(copy(authors)); },

    lookup: function (number) {
      var reg = norm(number), ex = dogByNumber(reg);
      if (ex !== null) {
        var d = dogs[ex];
        if (d.stub) wantedLog(reg, d.pending ? 'dog' : 'names');
        return Promise.resolve({ dogId: ex, created: false });
      }
      var id = 'r:' + reg;
      dogs[id] = { id: id, registered: 'Registration ' + reg, call: '', sex: '', color: '', photo: '', ext: false, litter: null, stub: true, pending: true };
      identifiers.push({ dog: id, registry: AKCNO.test(reg) ? 'AKC' : 'Reg.', number: reg, author: 0, date: NOW() });
      wantedLog(reg, 'dog');
      return Promise.resolve({ dogId: id, created: true });
    },
    noteGalaxy: function (dogId, inGalaxy) {
      var d = dogs[dogId]; if (!d) return fail('not_found', 'No such dog.');
      var reg = primaryReg(dogId);
      if (d.stub) { d.pending = !inGalaxy; d.inGalaxy = !!inGalaxy; if (wantedList[reg]) wantedList[reg].how = inGalaxy ? 'names' : 'dog'; }   // a stub already counted when it was looked up
      else if (!inGalaxy && reg) wantedLog(reg, 'dog');
      return Promise.resolve({ ok: true });
    },

    getDog: function (dogId) {
      var d = dogs[dogId]; if (!d) return fail('not_found', 'No such dog.');
      var L = litters[d.litter], par = parentsOf(dogId);
      var reg = primaryReg(dogId);
      var snap = {
        dog: { id: d.id, registered: d.registered, call: d.call, sex: d.sex, color: d.color, photo: d.photo, ext: !!d.ext, pending: !!d.pending, inGalaxy: !!d.inGalaxy, hasLitter: !!L, photoReg: photoRegOf(reg) },
        identifiers: copy(idsOf(dogId)),
        claims: claims.filter(function (c) { return c.dog === dogId; }).map(annotate),
        litter: L ? copy(L) : null,
        parents: par.rows, parentsRestricted: par.restricted,
        offspring: offspringOf(dogId),
        // Option 2: a visitor sees other people (breeders, co-owners who are not members) only in short form; members see full names.
        people: peopleFor(),
        perm: { loggedIn: isMember(), canAdd: isMember(), isAdmin: isAdmin() }
      };
      return Promise.resolve(snap);
    },
    getPedigree: function (dogId, gens) {
      if (!isMember()) return fail('login_required', 'Sign in to see names in the pedigree.');
      if (!dogs[dogId]) return fail('not_found', 'No such dog.');
      var P = pedOf(dogId), out = {};
      Object.keys(P).forEach(function (k) { var e = P[k]; out[k] = [e[0], e[1], photoRegOf(regOf(e[1].split(' · ')[0]))]; });
      return Promise.resolve({ nodes: out });
    },
    openAncestor: function (dogId, key) {
      var g = needMember(); if (g) return g;
      key = Number(key);
      var P = pedOf(dogId), e = P[key];
      if (!e || key === 1) return fail('not_found', 'No such ancestor.');
      var parts = e[1].split(' · '), reg = regOf(parts[0]), ex = dogByNumber(reg);
      if (ex !== null) return Promise.resolve({ dogId: ex });
      var id = 'r:' + reg, sp = splitTitle(e[0]), sx = (parts[2] || '').trim();
      dogs[id] = { id: id, registered: e[0], call: '', sex: sx === 'F' ? 'female' : (sx === 'M' ? 'male' : ''), color: (parts[1] || '').trim().toLowerCase(), photo: '', ext: true, litter: null };
      identifiers.push({ dog: id, registry: AKCNO.test(reg) ? 'AKC' : 'Reg.', number: reg, author: 3, date: NOW() });
      var born = (parts[3] || '').trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(born)) claims.push(C(nextId++, id, 'fact', 'Whelp date', born, { src: 'Pedigree data', author: 3, date: NOW() }));
      priv.peds[id] = reroot(P, key);
      return Promise.resolve({ dogId: id });
    },

    saveFact: function (dogId, name, value, src) {
      var g = needMember(); if (g) return g;
      if (!dogs[dogId]) return fail('not_found', 'No such dog.');
      if (!value) return fail('invalid', 'A value is required.');
      var old = claims.filter(function (c) { return c.dog === dogId && c.type === 'fact' && c.name === name && c.status === 'visible'; })[0];
      if (old && !(old.author === actorId || isAdmin())) return fail('forbidden', 'Only the author or an administrator can correct this. You can dispute it instead.');
      if (old) old.status = 'superseded';
      var c = C(nextId++, dogId, 'fact', name, value, { src: src || '', ver: old ? old.ver + 1 : 1, author: actorId === 0 ? 1 : actorId, date: NOW() });
      claims.push(c); return Promise.resolve(annotate(c));
    },
    addRecord: function (dogId, rec) {
      var g = needMember(); if (g) return g;
      if (!dogs[dogId]) return fail('not_found', 'No such dog.');
      if (['test', 'win', 'litter', 'link'].indexOf(rec.type) < 0) return fail('invalid', 'Unknown record type.');
      if (!rec.name || !String(rec.name).trim()) return fail('invalid', 'A name is required.');
      if (rec.type !== 'link' && !rec.url) return fail('invalid', 'Test results, wins and litters need an evidence link.');
      var c = C(nextId++, dogId, rec.type, String(rec.name).slice(0, 60), String(rec.value || '').slice(0, 40), {
        url: rec.url || '', whelp: rec.whelp || '', date: rec.date || NOW(), ev: rec.type === 'test' ? 'doc' : 'link', author: actorId === 0 ? 1 : actorId });
      claims.push(c); return Promise.resolve(annotate(c));
    },
    flagClaim: function (claimId, f) {
      var g = needMember(); if (g) return g;
      var c = claimById(claimId); if (!c) return fail('not_found', 'No such record.');
      if (c.author === actorId) return fail('forbidden', 'You cannot dispute your own record. Post a correction instead.');
      if (!f || !f.evidence) return fail('invalid', 'Link to your evidence.');
      c.flags.push({ author: actorId === 0 ? 1 : actorId, reason: f.reason || 'Disputed', evidence: f.evidence, date: NOW() });
      return Promise.resolve(annotate(c));
    },
    correctClaim: function (claimId, value) {
      var g = needMember(); if (g) return g;
      var c = claimById(claimId); if (!c) return fail('not_found', 'No such record.');
      if (!(c.author === actorId || isAdmin())) return fail('forbidden', 'Only the author or an administrator can post a correction.');
      c.status = 'superseded';
      var n = C(nextId++, c.dog, c.type, c.name, value, { url: c.url, ev: c.ev, ver: c.ver + 1, author: c.author, date: NOW() });
      claims.push(n); return Promise.resolve(annotate(n));
    },
    hideClaim: function (claimId, reason) {
      var g = needAdmin(); if (g) return g;
      var c = claimById(claimId); if (!c) return fail('not_found', 'No such record.');
      if (!reason) return fail('invalid', 'A reason is required.');
      c.status = 'hidden'; c.reason = reason; logAction('Administrator hid record "' + c.name + '". Reason: ' + reason);
      return Promise.resolve(annotate(c));
    },
    suggestCategory: function (text) {
      var g = needMember(); if (g) return g;
      if (!text) return fail('invalid', 'Enter a category.');
      logAction('Category suggestion from ' + ((authors[actorId] || {}).name || actorId) + ': "' + text + '"');
      return Promise.resolve({ ok: true });
    },

    wanted: function () {
      var g = needAdmin(); if (g) return g;
      return Promise.resolve(Object.keys(wantedList).map(function (r) { var w = wantedList[r]; return { reg: r, count: w.count, last: w.last, how: w.how }; }));
    },
    markAdded: function (reg) { var g = needAdmin(); if (g) return g; delete wantedList[reg]; return Promise.resolve({ ok: true }); },
    accountRequests: function () { var g = needAdmin(); if (g) return g; return Promise.resolve(copy(requests)); },
    decideRequest: function (id, approve) {
      var g = needAdmin(); if (g) return g;
      var r = requests.filter(function (x) { return x.id === id; })[0]; if (!r) return fail('not_found', 'No such request.');
      requests = requests.filter(function (x) { return x !== r; });
      logAction(approve ? 'Approved account for ' + r.name + ' (' + r.role + '). Real name confirmed via: ' + r.verify + '.' : 'Rejected account request from ' + r.name + '. No verifiable real identity.');
      return Promise.resolve({ ok: true });
    },
    actionLog: function () { var g = needAdmin(); if (g) return g; return Promise.resolve(copy(log)); }
  };

  root.DogAPI = API;
})(window);
