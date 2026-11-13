/*
 * DEMO BACKEND for the dog page.
 *
 * The page (dog-page-demo.html) never touches data directly: it only calls the methods below. This file keeps everything in memory and
 * enforces the same rules a real server would (who may add, flag, correct, hide). In the real system this file is replaced by a client with
 * the same methods that calls the server with the member's login token; the page does not change.
 *
 * Names: a dog has up to three separate things. `title` (CH, GCH ...; earned, can change), `registered` (the registered name, never including the title) and
 * `call` (the name used at home: Piper). `short` is only a label for lists: the call name if there is one, otherwise the registered name without the kennel prefix.
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
 *   lookup(number)                  find a dog by any registration number (members: or create a stub and log it as wanted; visitors: only public dogs)
 *   ourDogs()                       the public dogs grouped for the "Our dogs" list: the foundation bitch, then each litter
 *   confirmDog(dogId)               a member confirms the name, number and birth date on a page that was filled in automatically; says nothing about owning or breeding the dog
 *   claimDog(dogId)                 a member says "this dog is mine" (only while it is unclaimed); the dog starts members-only and its owner can then make it public
 *   setVisibility(dogId, v)         'public' (everyone with the code) or 'members' (signed in only): the member who claimed the dog, or an administrator
 *   noteGalaxy(dogId, inGalaxy)     the page reports whether the galaxy file has the dog; the server updates the stub and the wanted list
 *   getDog(dogId)                   everything the page needs about one dog, with per-record permissions already worked out
 *   getPedigree(dogId, gens)        names and numbers for the pedigree: anyone for a public dog, otherwise members only
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
  var SCREENS = ['Hips', 'Elbows', 'Cardiac', 'Thyroid', 'Eyes', 'Patellas', 'Shoulders', 'Other'];
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
  var priv = { peds: {}, photoRegs: [], cosmic: {} };      // pedigree names and the list of dogs with a photo elsewhere: loaded from a private file
  var actorId = null;                           // demo only. null = visitor (not signed in), 0 = administrator
  var loginName = null;
  var nextId = 100;

  var pupIds = [], pupFacts = [];
  var dogs = {
    412: { id: 412, title: 'CH', registered: 'Legado N Danekraaft’s How Can I Tell You?', call: 'Piper', short: 'Piper', sex: 'female', color: 'fawn', photo: '/img/piper.jpg', photoAuthor: 1, photos: [{ title: 'Piper as a puppy', url: '/img/piper.jpg', author: 1 }, { title: 'First litter puppies, July 2023', url: '/img/piper-first-litter-5-fawn-puppies-4-boys-1-girl-breeding-female-mia.jpg', author: 1 }, { title: 'Piper with her son, Sept 2023', url: '/img/piper-captain-mother-son-tiktok-star-sweetest-dog.jpg', author: 2 }, { title: 'Second litter puppies, Aug 2024', url: '/img/piper-second-litter-3-fawn-1-brindle-puppies-with-breeding-female-cora.jpg', author: 1 }], ext: true, litter: 'L412', visibility: 'public' },
    413: { id: 413, title: 'CH', registered: '7sisters N Legado’s I Wanna Dance, I Wanna Win', call: 'Mia', short: 'Mia', sex: 'female', color: 'fawn', photo: '', ext: false, litter: 'L2023', visibility: 'public' },
    414: { id: 414, title: '', registered: '7sisters N Legado’s Heart Of Gold', call: 'Cora', short: 'Cora', sex: 'female', color: 'fawn', photo: '', ext: false, litter: 'L2024', visibility: 'public' }
  };
  // A litter is stored once: its sire, dam, whelp date and breeders. Each dog points to its litter.
  var litters = {
    L412: { label: 'Piper\u2019s own litter', whelp: '2020-09-26', src: 'AKC', author: 1, breeders: ['p1', 'p2', 'p3', 'p4'],
      sire: { reg: 'WS54036904', name: 'PRF Fendane Have I Gone Mad', title: 'Am CH' }, dam: { reg: 'WS59632103', name: 'Danekraafts It\'s a Jungle Out Here', title: 'UKC & Int Ch' } },
    L2023: { label: 'Rolex \u00d7 Piper', sireAncestry: 'rolex', whelp: '2023-07-09', src: 'AKC', author: 1, breeders: ['u2', 'u1', 'p2', 'p1'],
      sire: { reg: 'WS66273805', name: 'Fendanesylcrest N Diriso\'s This Is The Right Time', title: 'GCHS CH' }, dam: { reg: 'WS69691106', name: 'Legado N Danekraaft\'s How Can I Tell You?', title: 'CH' } },
    L2024: { label: 'Sean \u00d7 Piper', sireAncestry: 'sean', whelp: '2024-08-19', src: 'AKC', author: 1, breeders: ['u2', 'u1', 'p2', 'p1'],
      sire: { reg: 'WS80095602', name: 'Legado N Izya\'s Oops! I Did It Again', title: '' }, dam: { reg: 'WS69691106', name: 'Legado N Danekraaft\'s How Can I Tell You?', title: 'CH' } },
    // Breeders for the two 2026 litters are not recorded yet, so none are shown.
    L2026: { label: 'Ezra \u00d7 Piper', sireAncestry: 'ezra', whelp: '2026-03-23', src: 'AKC', author: 1, breeders: [],
      sire: { reg: 'WS81479201', name: 'Sonya Danes N Krisda"Our Peace And Harmony"Fontana', title: 'GCH CH' }, dam: { reg: 'WS69691106', name: 'Legado N Danekraaft\'s How Can I Tell You?', title: 'CH' } },
    L2026M: { label: 'Ezra \u00d7 Mia', sireAncestry: 'ezra', whelp: '2026-10-17', src: 'litter page', author: 1, breeders: [],
      sire: { reg: 'WS81479201', name: 'Sonya Danes N Krisda"Our Peace And Harmony"Fontana', title: 'GCH CH' }, dam: { reg: 'WS81418801', name: '7sisters N Legado\'s I Wanna Dance, I Wanna Win', title: 'CH' } }
  };
  // Piper's offspring, from the litter pages and the AKC dog report: id, registered name (as AKC lists it), sex, litter, number, short label, registration type.
  [
    [415, '7sisters N Legado\u2019s Final Act V Echoln', 'male', 'L2023', 'WS81418802', 'Final Act V Echoln'],
    [416, '7sisters N Legado\u2019s I Know A Guy At Cherryhill', 'male', 'L2023', 'WS81418803', 'I Know A Guy At Cherryhill'],
    [417, '7sisters N Legado\u2019s Gonna Get Medieval', 'male', 'L2023', 'WS81418804', 'Gonna Get Medieval'],
    [418, 'Legado N 7sisters\u2019 I Got Somethin\u2019 For You', 'male', 'L2023', 'WS81418805', 'I Got Somethin\u2019 For You'],
    [419, '7sisters N Legado\u2019s Interstellar', 'female', 'L2024', 'WS84850301', 'Interstellar', 'limited registration'],
    [420, '7sisters\u2019 Tilly In The Sky With Diamonds', 'female', 'L2024', 'WS84850302', 'Tilly In The Sky With Diamonds', 'limited registration'],
    [421, '7sisters N Legado\u2019s Cruising To The Oldies', 'male', 'L2024', 'WS84850304', 'Cruising To The Oldies'],
    [422, '7sisters N Legado\u2019s With This Ring', 'male', 'L2026', 'WS88963901', 'With This Ring'],
    [423, '7sisters Come Fly With Bea', 'female', 'L2026', 'WS88963902', 'Come Fly With Bea', 'limited registration'],
    [424, '7sisters N Legado\u2019s The Judge\u2019s Choice V Echolane', 'male', 'L2026', 'WS88963903', 'The Judge\u2019s Choice V Echolane'],
    [425, '7sisters N Legado\u2019s Odie Just Wants To Have Fun', 'male', 'L2026', 'WS88963904', 'Odie Just Wants To Have Fun'],
    [426, '7sisters N Legado\u2019s Stop Sign What Stop Sign', 'male', 'L2026', 'WS88963905', 'Stop Sign What Stop Sign'],
    [427, '7sisters She\u2019s All That @ Sonya Danes N Andalyn', 'female', 'L2026', 'WS88963906', 'She\u2019s All That @ Sonya Danes N Andalyn']
  ].forEach(function (r) {
    dogs[r[0]] = { id: r[0], title: '', titleSuffix: '', registered: r[1], call: '', short: r[5], sex: r[2], color: 'fawn', photo: '', ext: false, litter: r[3], visibility: 'public' };
    pupIds.push({ dog: r[0], registry: 'AKC', number: r[4], author: 1, date: '2026-11-12', note: r[6] || '' });
    pupFacts.push(r[0]);
  });
  // Call names, as on the litter pages (RolexXPiper, SeanXPiper, EzraxPiper)
  var callNames = { 415: 'Zee', 416: 'Pumpkin', 417: 'Wallace', 418: 'Captain', 419: 'Stella', 420: 'Tilly', 421: 'Cruz', 422: 'Glenn', 423: 'Beatrice', 424: 'Elliot', 425: 'Odie', 426: 'Buford', 427: 'Vogue' };
  Object.keys(callNames).forEach(function (id) { dogs[id].call = callNames[id]; dogs[id].short = callNames[id]; });
  dogs[416].title = 'CH'; dogs[422].titleSuffix = 'CGC';   // as AKC lists them: CH ... Cherryhill, and ... With This Ring CGC
  // Mia's offspring (Ezra x Mia, born 2026-10-17): five puppies known only by collar color and sex; names and numbers are still to come.
  [[430, 'Black', 'male'], [431, 'Red', 'male'], [432, 'Blue', 'male'], [433, 'Pink', 'female'], [434, 'Purple', 'female']].forEach(function (r) {
    dogs[r[0]] = { id: r[0], title: '', titleSuffix: '', registered: '', call: '', short: r[1] + ' collar ' + (r[2] === 'male' ? 'boy' : 'girl'), sex: r[2], color: '', photo: '', ext: false, litter: 'L2026M', visibility: 'public' };
    pupFacts.push(r[0]);
  });
  var identifiers = [
    { dog: 412, registry: 'AKC', number: 'WS69691106', author: 1, date: '2026-11-12' },
    { dog: 412, registry: 'OFA', number: 'OFA25G', author: 1, date: '2026-11-12' },
    { dog: 412, registry: 'CHIC', number: 'CHIC181340', author: 1, date: '2026-11-12' },
    { dog: 413, registry: 'AKC', number: 'WS81418801', author: 1, date: '2026-11-12' },
    { dog: 413, registry: 'OFA', number: 'OFA30F', author: 1, date: '2026-11-12' },
    { dog: 413, registry: 'CHIC', number: 'CHIC215182', author: 1, date: '2026-11-12' },
    { dog: 414, registry: 'AKC', number: 'WS84850303', author: 1, date: '2026-11-12' }
  ].concat(pupIds);
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
    C(2, 412, 'link', 'DNA test', 'pending'), C(28, 413, 'link', 'DNA test', 'pending'), C(38, 414, 'link', 'DNA test', 'pending'),
    // Piper's coat color panel was run at UC Davis VGL; we link the lab's panel page and record no results (none entered yet)
    C(80, 412, 'link', 'UC Davis VGL', 'Great Dane coat color panel', { url: 'https://vgl.ucdavis.edu/panel/dog-coat-color-great-dane', src: 'Owner' }),
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
  pupFacts.forEach(function (id, n) {
    var L = litters[dogs[id].litter];
    claims.push(C(200 + n, id, 'fact', 'Whelp date', L.whelp, { src: L.src === 'AKC' ? 'AKC' : 'Litter page' }));
  });
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
  function canSee(d) { return isMember() || (d && d.visibility === 'public'); }
  // The person record for a member: our own people keep their existing records; a new member gets one made from their name.
  function authorOf(id) { return id === 0 ? 1 : id; }
  function personFor(aid) {
    var k = Object.keys(people).filter(function (x) { return people[x].member === aid; })[0];
    if (k) return k;
    k = 'm' + aid; people[k] = { label: (authors[aid] || {}).name || ('Member #' + aid), member: aid, consent: true }; return k;
  }
  function claimOf(dogId) { return claims.filter(function (x) { return x.dog === dogId && x.type === 'claim' && x.status === 'visible'; })[0]; }
  function canSetVisibility(dogId) {
    if (!isMember()) return false;
    if (isAdmin()) return true;
    var c = claims.filter(function (x) { return x.dog === dogId && x.type === 'claim' && x.status === 'visible'; })[0];
    return !!(c && people[c.value] && people[c.value].member === actorId);
  }
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
  function titled(d) { return (d.title ? d.title + ' ' : '') + d.registered + (d.titleSuffix ? ' ' + d.titleSuffix : ''); }
  function place(dst, src, rootKey) {
    Object.keys(src || {}).forEach(function (ks) { ks = Number(ks); var d = Math.floor(Math.log(ks) / Math.LN2), off = ks - (1 << d); dst[rootKey * (1 << d) + off] = src[ks]; });
  }
  // A dog's pedigree is its own entry, its sire's ancestry at key 2, and its dam's at key 3 (all from the data file; nothing is stored per dog).
  function buildPed(dogId) {
    var j = priv.j, d = dogs[dogId], L = d && litters[d.litter];
    if (!j || !L || d.litter === 'L412') return null;
    var reg = primaryReg(dogId) || '', born = L.whelp;
    var ped = { 1: [titled(d) || d.short, (reg || 'registration to come') + ' \u00b7 ' + (d.color ? d.color.charAt(0).toUpperCase() + d.color.slice(1) : '') + ' \u00b7 ' + (d.sex === 'female' ? 'F' : (d.sex === 'male' ? 'M' : '')) + ' \u00b7 ' + born] };
    var sire = L.sireAncestry === 'ezra' ? j.ezra : (L.sireAncestry === 'rolex' ? reroot(j.mia, 2) : { 1: [L.sire.name, L.sire.reg + ' \u00b7  \u00b7 M \u00b7 '] });
    var dam = L.dam.reg === 'WS69691106' ? j.piper : (L.dam.reg === 'WS81418801' ? j.mia : null);
    place(ped, sire, 2); place(ped, dam, 3);
    return ped;
  }
  function pedOf(dogId) {
    if (!priv.peds[dogId]) { var b = buildPed(dogId); if (b) priv.peds[dogId] = b; }
    return priv.peds[dogId] || {};
  }
  function parentsOf(dogId) {
    var d = dogs[dogId], L = d && litters[d.litter], out = [];
    function row(role, p, key, author, src) {
      var pid = dogByNumber(p.reg);
      out.push({ role: role, name: p.name, title: p.title, reg: p.reg, key: key, author: author, src: src, dogId: (pid !== null && canSee(dogs[pid])) ? pid : null, photoReg: photoRegOf(p.reg) });
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
      if (!L || String(id) === String(dogId) || !canSee(d)) return;
      var role = L.dam.reg === reg ? 'her' : (L.sire.reg === reg ? 'his' : null);
      if (!role) return;
      var w = claims.filter(function (c) { return String(c.dog) === String(id) && c.type === 'fact' && c.name === 'Whelp date'; })[0];
      kids.push({ dogId: d.id, call: d.call, label: d.short || d.call || d.registered || 'Unnamed dog', role: role, whelp: w ? w.value : '', litter: (litters[d.litter] || {}).label || '' });
    });
    kids.sort(function (a, b) { return a.whelp < b.whelp ? -1 : (a.whelp > b.whelp ? 1 : (Number(a.dogId) - Number(b.dogId))); });
    return kids;
  }

  // ---- the API ----------------------------------------------------------------------------------------------------------------
  var API = {
    visitorGens: 10,     // how far back a visitor may follow a pedigree from one of our dogs
    init: function () {
      return Promise.all([
        fetch('/data/demo-authors.json').then(function (r) { return r.json(); }).then(function (j) { authors = j; }).catch(function () { }),
        // The ancestry of our own dogs, and the list of dogs with a photo elsewhere, come from a data file, not from the code. The file
        // holds only what the public explorer pages for our litters already show. In the real system the server provides it.
        fetch('/data/our-pedigrees.json').then(function (r) { if (!r.ok) throw new Error('none'); return r.json(); }).then(function (j) {
          priv.j = j; priv.peds[412] = j.piper; priv.photoRegs = j.hasphoto || []; priv.cosmic = j.cosmic || {};
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
      if (!u) { actorId = null; return fail('forbidden', 'That account is not set up for the dog pages yet.'); }
      // Demo only: the user pool is closed to self-sign-up (the administrator creates every account), so any account that signs in is a vetted
      // member. A named account keeps its own identity; any other gets a member number of its own, so its records carry its name.
      if (!(u in LOGINS)) { var nid = 100 + Object.keys(authors).filter(function (k) { return Number(k) >= 100; }).length; authors[nid] = { name: id.name || u, role: 'Member', status: 'active' }; LOGINS[u] = nid; }
      actorId = LOGINS[u]; loginName = id.name || u;
      return API.session();
    },
    signOut: function () { actorId = null; loginName = null; return API.session(); },
    authors: function () { return Promise.resolve(copy(authors)); },

    lookup: function (number) {
      var reg = norm(number), ex = dogByNumber(reg);
      if (!isMember() && !(ex !== null && canSee(dogs[ex]))) return fail('login_required', 'Sign in to look up other dogs.');
      if (ex !== null) {
        var d = dogs[ex];
        if (d.stub) wantedLog(reg, d.pending ? 'dog' : 'names');
        return Promise.resolve({ dogId: ex, created: false });
      }
      var id = 'r:' + reg;
      dogs[id] = { id: id, title: '', titleSuffix: '', registered: '', call: '', sex: '', color: '', photo: '', ext: false, litter: null, stub: true, pending: true, visibility: 'members' };
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
      if (!canSee(d)) return fail('login_required', 'Sign in to see this dog.');
      var L = litters[d.litter], par = parentsOf(dogId);
      var reg = primaryReg(dogId);
      var snap = {
        dog: { id: d.id, title: d.title || '', titleSuffix: d.titleSuffix || '', registered: d.registered || '', call: d.call, short: d.short || d.call || '', sex: d.sex, color: d.color, photo: d.photo, ext: !!d.ext, pending: !!d.pending, generated: !!d.generated, inGalaxy: !!d.inGalaxy, hasLitter: !!L, photoReg: photoRegOf(reg), visibility: d.visibility || 'members' },
        identifiers: copy(idsOf(dogId)),
        // links to other pedigree databases that list this dog (we only link; nothing is copied)
        cosmic: (reg && priv.cosmic[regOf(reg)]) ? copy(priv.cosmic[regOf(reg)]) : null,
        // pages filled in automatically start unconfirmed; members who checked them against a source are listed here
        confirm: { auto: !!d.generated, by: (d.confirmedBy || []).map(function (x) { return { author: x.author, date: x.date }; }), canConfirm: isMember() && !!d.generated && !(d.confirmedBy || []).some(function (x) { return x.author === authorOf(actorId); }) },
        claims: claims.filter(function (c) { return c.dog === dogId; }).map(annotate),
        litter: L ? copy(L) : null,
        parents: par.rows, parentsRestricted: par.restricted,
        offspring: offspringOf(dogId),
        // Option 2: a visitor sees other people (breeders, co-owners who are not members) only in short form; members see full names.
        people: peopleFor(),
        perm: { loggedIn: isMember(), canAdd: isMember(), isAdmin: isAdmin(), canSetVisibility: canSetVisibility(dogId), canClaim: isMember() && !claimOf(dogId) }
      };
      return Promise.resolve(snap);
    },
    getPedigree: function (dogId, gens) {
      if (!dogs[dogId]) return fail('not_found', 'No such dog.');
      if (!canSee(dogs[dogId])) return fail('login_required', 'Sign in to see names in the pedigree.');
      var P = pedOf(dogId), out = {};
      // Every photo for a dog, as {title, author, url}: members' photos first (by whoever submitted them), then photos we only link to.
      // Members' photos are links or small files on our own site; we do not copy other sites' images.
      var mine = {};
      Object.keys(dogs).forEach(function (id) { var d = dogs[id], r = d.photos && d.photos.length && primaryReg(d.id); if (r) mine[regOf(r)] = d.photos.map(function (x) { return { title: x.title, author: (authors[x.author] || {}).name || 'Member', url: x.url }; }); });
      Object.keys(P).forEach(function (k) {
        var e = P[k], rg = regOf(e[1].split(' · ')[0]), rr = photoRegOf(rg), list = (mine[rg] || []).slice();
        if (rr) list.push({ title: rr + '.jpg', author: 'River Rock Pedigree', url: 'https://breedpedigrees.com/pedpoint/images/' + encodeURIComponent(rr) + '.jpg', linked: true });
        // Cosmic Great Danes: a map from registration number to their photo (hotlinked, never copied)
        var cz = priv.cosmic[rg]; if (cz && cz.photo) list.push({ title: 'Photo at Cosmic Great Danes', author: 'Cosmic Great Danes', url: cz.photo, linked: true });
        // Past the visitor limit the data is held but not shown: the slot says so, and a sign-in reveals it.
        if (!isMember() && (dogs[dogId].gen || 0) + Math.floor(Math.log(Number(k)) / Math.LN2) > API.visitorGens) { out[k] = { locked: true }; return; }
        // What we know exists for this dog (never a guess): health screens (OFA or CHIC numbers, test records) and DNA or sequence data.
        var did = dogByNumber(rg), hn = 0, dn = 0;
        if (did !== null) {
          hn = idsOf(did).filter(function (i) { return i.registry === 'OFA' || i.registry === 'CHIC'; }).length;
          claims.forEach(function (c) {
            if (c.dog !== did || c.status !== 'visible') return;
            if (c.type === 'test') hn++;
            if (c.type === 'screens') hn += String(c.value).split(', ').length;
            if (c.type === 'link' && (/VGL|AKC DNA|Embark|Wisdom|sequence/i.test(c.name) || (c.name === 'DNA test' && c.value !== 'pending'))) dn++;
          });
        }
        out[k] = [e[0], e[1], rr, list, { health: hn, dna: dn }];
      });
      if (out[1] && dogs[dogId].registered) out[1][0] = titled(dogs[dogId]);   // the root is the dog itself: its own title and registered name
      return Promise.resolve({ nodes: out });
    },
    // Anyone can follow a public dog's pedigree back: an ancestor's page is generated from the pedigree data, and the people who see it
    // are the people who may see the dog it was reached from. (A dog that is not public still needs a sign-in.)
    openAncestor: function (dogId, key) {
      if (!dogs[dogId]) return fail('not_found', 'No such dog.');
      if (!canSee(dogs[dogId])) return fail('login_required', 'Sign in to open an ancestor\'s page.');
      key = Number(key);
      var P = pedOf(dogId), e = P[key];
      if (!e || key === 1) return fail('not_found', 'No such ancestor.');
      // A visitor may follow the pedigree back this many generations from one of our dogs (counted along the whole trail); further back needs a sign-in.
      var gen = (dogs[dogId].gen || 0) + Math.floor(Math.log(key) / Math.LN2);
      if (!isMember() && gen > API.visitorGens) return fail('login_required', 'Sign in to go further back than ' + API.visitorGens + ' generations.');
      var parts = e[1].split(' · '), reg = regOf(parts[0]), ex = dogByNumber(reg);
      if (ex !== null) return Promise.resolve({ dogId: ex });
      var id = 'r:' + reg, sp = splitTitle(e[0]), sx = (parts[2] || '').trim();
      dogs[id] = { id: id, title: sp.title, titleSuffix: '', registered: sp.name, call: '', sex: sx === 'F' ? 'female' : (sx === 'M' ? 'male' : ''), color: (parts[1] || '').trim().toLowerCase(), photo: '', ext: true, litter: null, generated: true, gen: gen, visibility: 'public' };
      identifiers.push({ dog: id, registry: AKCNO.test(reg) ? 'AKC' : 'Reg.', number: reg, author: 1, auto: true, date: NOW() });
      var born = (parts[3] || '').trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(born)) claims.push(C(nextId++, id, 'fact', 'Whelp date', born, { src: 'Pedigree data', author: 1, auto: true, date: NOW() }));
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
      if (['test', 'win', 'litter', 'link', 'screens'].indexOf(rec.type) < 0) return fail('invalid', 'Unknown record type.');
      // Health screens on file: only which screens exist (checked from the OFA record), never the grade or result. The evidence is the OFA record itself.
      if (rec.type === 'screens') {
        var cats = (rec.cats || []).filter(function (x, i, a) { return SCREENS.indexOf(x) > -1 && a.indexOf(x) === i; });
        if (!cats.length) return fail('invalid', 'Choose at least one screen.');
        var sc = C(nextId++, dogId, 'screens', 'Screens on file at OFA', cats.join(', '), { url: '', date: NOW(), ev: 'link', author: actorId === 0 ? 1 : actorId });
        claims.push(sc); return Promise.resolve(annotate(sc));
      }
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
    confirmDog: function (dogId) {
      var g = needMember(); if (g) return g;
      var d = dogs[dogId]; if (!d) return fail('not_found', 'No such dog.');
      d.confirmedBy = d.confirmedBy || [];
      if (d.confirmedBy.some(function (x) { return x.author === authorOf(actorId); })) return Promise.resolve({ ok: true });
      d.confirmedBy.push({ author: authorOf(actorId), date: NOW() });
      logAction((((authors[actorId] || {}).name) || actorId) + ' confirmed the details on ' + (d.registered || primaryReg(dogId) || 'a dog'));
      return Promise.resolve({ ok: true });
    },
    claimDog: function (dogId) {
      var g = needMember(); if (g) return g;
      var d = dogs[dogId]; if (!d) return fail('not_found', 'No such dog.');
      var ex = claimOf(dogId);
      if (ex) return (people[ex.value] && people[ex.value].member === authorOf(actorId)) ? Promise.resolve({ ok: true }) : fail('forbidden', 'This dog has already been claimed. If that is a mistake, tell the administrator.');
      claims.push(C(nextId++, dogId, 'claim', 'Claimed by', personFor(authorOf(actorId)), { start: NOW(), author: authorOf(actorId) }));
      if (!d.visibility) d.visibility = 'members';
      logAction((((authors[actorId] || {}).name) || actorId) + ' claimed ' + (d.call || d.registered || primaryReg(dogId) || 'a dog'));
      return Promise.resolve({ ok: true });
    },
    ourDogs: function () {
      var card = function (d, note) { return { id: d.id, label: d.short || d.call || d.registered || primaryReg(d.id) || 'Unnamed dog', call: d.call || '', reg: primaryReg(d.id) || '', registered: d.registered ? titled(d) : '', sex: d.sex || '', note: note || '' }; };
      var groups = [{ title: 'Foundation', dogs: [card(dogs[412], 'the foundation bitch')] }], by = {};
      Object.keys(dogs).forEach(function (id) {
        var d = dogs[id]; if (!d.litter || d.litter === 'L412' || d.visibility !== 'public') return;
        (by[d.litter] = by[d.litter] || []).push(d);
      });
      Object.keys(by).sort(function (a, b) { return litters[a].whelp < litters[b].whelp ? -1 : 1; }).forEach(function (lid) {
        var L = litters[lid];
        groups.push({ title: L.label + ', born ' + L.whelp, dogs: by[lid].sort(function (a, b) { return Number(a.id) - Number(b.id); }).map(function (d) { return card(d, d.registered ? '' : 'not yet registered'); }) });
      });
      var shared = Object.keys(dogs).filter(function (id) { var d = dogs[id]; return !d.litter && !d.generated && d.visibility === 'public'; }).map(function (id) {
        var d = dogs[id], c = claimOf(d.id), who = c && people[c.value] ? people[c.value].label : '';
        return card(d, who ? 'shared by ' + who : '');
      });
      if (shared.length) groups.push({ title: 'Shared by members', dogs: shared });
      return Promise.resolve(groups);
    },
    setVisibility: function (dogId, v) {
      var g = needMember(); if (g) return g;
      var d = dogs[dogId]; if (!d) return fail('not_found', 'No such dog.');
      if (v !== 'public' && v !== 'members') return fail('invalid', 'Choose who can see this dog.');
      if (!canSetVisibility(dogId)) return fail('forbidden', 'Only the member who claimed this dog, or an administrator, can change who sees it.');
      d.visibility = v; logAction('Visibility of ' + (d.call || d.registered) + ' set to ' + v + ' by ' + ((authors[actorId] || {}).name || actorId));
      return Promise.resolve({ ok: true });
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
