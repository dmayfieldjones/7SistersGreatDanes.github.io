// Looks a dog up on DANES World (danesworld.info), by its owner's agreement, on a member's click only.
// One request per search, results kept for a day, and a plain name that says who we are. Nothing here crawls or follows links.
// parseResults() works on the page text so it can be tested against saved pages without the network.

const SITE = 'https://www.danesworld.info/';
export const AGENT = '7SistersGDGalaxy (+https://7sistersgreatdanes.com)';

const decode = (s) => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0*39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const text = (html) => decode(html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')).replace(/[ \t]+/g, ' ').trim();
export const key = (n) => String(n).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '');

// the site's own colour words for the breed's recognised varieties, in English; anything else is left blank rather than guessed
const COLOR = { 'gelb/gestromt': 'fawn or brindle', gelb: 'fawn', gestromt: 'brindle', schwarz: 'black', blau: 'blue', 'schwarz/gefleckt': 'harlequin', harlekin: 'harlequin', mantel: 'mantle' };

function cell(row, name) {
  const m = new RegExp('<td[^>]*data-name="' + name + '"[^>]*>([\\s\\S]*?)</td>').exec(row);
  return m ? m[1] : '';
}

// "26.09.2020" -> "2020-09-26"; anything else is dropped
function isoDate(s) {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(s).trim());
  return m ? `${m[3]}-${m[2]}-${m[1]}` : '';
}

export function parseResults(html) {
  const out = [];
  for (const row of html.match(/<tr data-rowindex[\s\S]*?<\/tr>/g) || []) {
    const nameCell = cell(row, 'namekpl');
    const name = text(nameCell).replace(/\s+/g, ' ');
    if (!name) continue;
    const sex = /hn-geschlecht-huendin/.test(nameCell) ? 'female' : /hn-geschlecht-ruede/.test(nameCell) ? 'male' : '';
    const [registry = '', number = ''] = text(cell(row, 'verband')).split('\n').map((x) => x.trim());
    const [sire = '', dam = ''] = text(cell(row, 'vater')).split('\n').map((x) => x.trim());
    const idm = /pedigree\.php\?id=(\d+)/.exec(cell(row, 'pedigree'));
    out.push({
      name, sex,
      color: COLOR[text(cell(row, 'typus')).toLowerCase()] || '',
      born: isoDate(text(cell(row, 'wurftag'))),
      registry: registry.slice(0, 12), number: number.slice(0, 24),
      sire: sire.slice(0, 120), dam: dam.slice(0, 120),
      siteId: idm ? idm[1] : '',
    });
  }
  return out;
}

// only dogs whose own name matches what was asked for: the site also lists dogs that merely have the name as a parent
export function exactMatches(rows, q) {
  const k = key(q.replace(/^((AM|CAN|INT|CH|GCH\w*|BISS?|BIS|ROM|HOF|AOM)\s+)+/i, ''));
  return rows.filter((r) => key(r.name) === k || (r.number && key(r.number) === key(q)));
}

const cache = new Map();   // query -> {at, rows}; kept for a day so the same dog is never asked for twice
const DAY = 86400000;

export async function searchDanesWorld(q, fetchImpl = fetch) {
  const k = key(q);
  const hit = cache.get(k);
  if (hit && Date.now() - hit.at < DAY) return hit.rows;
  const res = await fetchImpl(`${SITE}hundelist.php?psearch=${encodeURIComponent(q)}&language=en`, { headers: { 'user-agent': AGENT }, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw Object.assign(new Error('DANES World answered ' + res.status), { code: 'unavailable' });
  const rows = exactMatches(parseResults(await res.text()), q).slice(0, 8);
  cache.set(k, { at: Date.now(), rows });
  return rows;
}

// ---- the pedigree page: the dog's ancestors, read by position ----
// The table has 16 rows. The sire's cell spans 8 rows, his parents 4, and so on down to single rows; the dam's side starts halfway down.
// A cell that spans s rows, starting at row r, is ancestor number 2^g + r/s with g = log2(16/s) (2 = sire, 3 = dam, 4 and 5 = his parents ...).
const COLOUR_WORDS = /\s+(gelb\/gestromt|schwarz\/gefleckt|blau mit Abzeichen|gefleckt|gestromt|gelb|schwarz|blau|weiss|wei\u00df|harlekin|mantel)$/i;

export function parsePedigree(html) {
  const table = /<table[^>]*id="pedigree"[\s\S]*?<\/table>/.exec(html);
  if (!table) return {};
  const out = {}, rows = table[0].match(/<tr[\s\S]*?<\/tr>/g) || [];
  if (rows.length !== 16) return {};
  rows.forEach((row, r) => {
    for (const m of row.matchAll(/<td([^>]*)>([\s\S]*?)<\/td>/g)) {
      const span = Number((/rowspan="(\d+)"/.exec(m[1]) || [])[1] || 1);
      if (![1, 2, 4, 8].includes(span) || r % span) continue;
      const g = Math.log2(16 / span), n = 2 ** g + r / span;
      const lines = text(m[2]).split('\n').map((x) => x.trim()).filter(Boolean);
      if (!lines.length) continue;
      const colour = (COLOUR_WORDS.exec(lines[0]) || [])[1] || '';
      const name = lines[0].replace(COLOUR_WORDS, '').trim();
      const [registry = '', ...rest] = (lines[1] || '').split(' ');
      if (name) out[n] = { name: name.slice(0, 120), color: COLOR[colour.toLowerCase()] || '', registry: registry.slice(0, 12), number: rest.join(' ').slice(0, 24) };
    }
  });
  return out;
}

const pedCache = new Map();
export async function fetchPedigree(siteId, fetchImpl = fetch) {
  if (!/^\d{1,9}$/.test(String(siteId))) return {};
  const hit = pedCache.get(siteId);
  if (hit && Date.now() - hit.at < DAY) return hit.ped;
  const res = await fetchImpl(`${SITE}pedigree.php?id=${siteId}&language=en`, { headers: { 'user-agent': AGENT }, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw Object.assign(new Error('DANES World answered ' + res.status), { code: 'unavailable' });
  const ped = parsePedigree(await res.text());
  pedCache.set(siteId, { at: Date.now(), ped });
  return ped;
}
