// The private pedigree network: every dog in the big export, searchable by a signed-in member through the server only.
// The files are packed into the server package from the private data folder when it is built. They are never in git and never in the public site;
// a visitor cannot reach this, and a member gets one dog's page (with its ancestry) at a time, not the file.
//
// File format, one dog per line, fields separated by |:  id | name | birth date | sire id | dam id | - | titles | registration | color | sex
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const AKCNO = /^[A-Z]{2}\d{6,}$/;
const strip = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const TITLES = /^((AM|CAN|INT|MEX|NORD|EST|SWD|FIN|JPN|UKC|AKC|CH|GCH\w*|BISS?|BIS|ROM|HOF|AOM)\s+)+/i;
export const nameKey = (n) => strip(String(n).replace(/^"[^"]*"\s*/, '').replace(TITLES, ''));

// one registration field may hold several numbers separated by " / ": prefer one that looks like an AKC number
function pickReg(raw) {
  const toks = String(raw || '').split(/\s+\/\s+/).map((t) => t.trim()).filter((t) => /\d/.test(t) && !/unreg/i.test(t));
  const akc = toks.find((t) => AKCNO.test(t.toUpperCase().replace(/[^A-Z0-9]/g, '')));
  if (akc) return { registry: 'AKC', number: akc.toUpperCase().replace(/[^A-Z0-9]/g, '') };
  return toks[0] ? { registry: '', number: toks[0].slice(0, 24) } : { registry: '', number: '' };
}

export function makeNetwork(texts) {
  const dogs = new Map(), byName = new Map(), byReg = new Map();
  for (const text of texts) {
    for (const line of text.split('\n')) {
      const f = line.replace(/\r$/, '').split('|');
      if (f.length < 10 || !f[0]) continue;   // later files override earlier ones
      dogs.set(f[0], { id: f[0], name: f[1].replace(/^"[^"]*"\s*/, '').replace(/\s+/g, ' ').trim(), dob: f[2], sire: f[3], dam: f[4], reg: f[7], color: f[8].toLowerCase().trim(), sex: /^[MF]/i.test(f[9]) ? (f[9][0].toUpperCase() === 'F' ? 'female' : 'male') : '' });
    }
  }
  for (const d of dogs.values()) {
    if (!dogs.has(d.sire) || d.sire === d.id) d.sire = '';
    if (!dogs.has(d.dam) || d.dam === d.id) d.dam = '';
    const k = nameKey(d.name);
    if (k) { if (!byName.has(k)) byName.set(k, []); byName.get(k).push(d.id); }
    const r = pickReg(d.reg).number;
    if (r) byReg.set(r.toUpperCase().replace(/[^A-Z0-9]/g, ''), d.id);
  }
  const born = (d) => (/^\d{4}-\d{2}-\d{2}$/.test(d.dob) ? d.dob : '');
  const row = (d) => {
    const r = pickReg(d.reg), s = dogs.get(d.sire), m = dogs.get(d.dam);
    return { netId: d.id, source: 'network', name: d.name, sex: d.sex, color: d.color, born: born(d), registry: r.registry, number: r.number, sire: s ? s.name : '', dam: m ? m.name : '' };
  };
  // every dog's cleaned name, once, so a kennel or part of a name can be found by scanning (about 120,000 names take a few milliseconds)
  const keyed = [...dogs.values()].map((d) => ({ id: d.id, key: nameKey(d.name), name: d.name })).filter((x) => x.key);
  return {
    size: dogs.size,
    // a kennel name or part of a name: dogs whose name contains it, names that start with it first, then alphabetical; only the first `limit` come back
    // with the total, so a member sees there is more and refines the search instead of paging through the database
    searchPartial(q, limit = 25) {
      const k = nameKey(String(q).trim().slice(0, 140));
      if (k.length < 4) return { total: 0, rows: [] };
      const hits = keyed.filter((x) => x.key.includes(k)).sort((a, b) => (b.key.startsWith(k) - a.key.startsWith(k)) || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
      return { total: hits.length, rows: hits.slice(0, limit).map((x) => row(dogs.get(x.id))) };
    },
    // a registration number, or a name (titles and a quoted call name are ignored); at most 8 dogs come back
    search(q) {
      q = String(q).trim().slice(0, 140);
      const compact = q.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (/\d{5,}/.test(compact) && compact.length <= 24 && byReg.has(compact)) return [row(dogs.get(byReg.get(compact)))];
      return (byName.get(nameKey(q)) || []).slice(0, 8).map((id) => row(dogs.get(id)));
    },
    // the dog's ancestors by position (2 = sire, 3 = dam, 4 = sire's sire ...), five generations, in the shape the page's pedigree uses
    pedigree(id, gens = 5) {
      const out = {}, walk = (did, k, depth) => {
        const d = dogs.get(did);
        if (!d || depth > gens) return;
        if (k > 1) { const r = pickReg(d.reg); out[k] = { name: d.name, color: d.color, registry: r.registry, number: r.number }; }
        walk(d.sire, k * 2, depth + 1); walk(d.dam, k * 2 + 1, depth + 1);
      };
      walk(id, 1, 1);
      return out;
    },
  };
}

// loads every .dbw in a folder, in name order (a file named later overrides an earlier one); null when there is no folder
export function loadNetwork(dir) {
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir).filter((f) => f.endsWith('.dbw')).sort();
  return files.length ? makeNetwork(files.map((f) => readFileSync(join(dir, f), 'utf8'))) : null;
}
