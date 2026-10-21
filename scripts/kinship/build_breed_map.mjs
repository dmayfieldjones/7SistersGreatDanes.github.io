#!/usr/bin/env node
// Builds the anonymous breed relatedness map page from pedigree_kinship.py output.
//
//   node build_breed_map.mjs <kinship-out-dir> <ours.txt> <template.html> <d3force.js> <out.html>
//
// Reads reference_dogs.csv + relatedness.gexf, settles a force layout offline,
// and writes ONE page whose data holds only anonymous per-dog fields: position,
// birth year, inbreeding, coat family, and a flag for the farm's own dogs.
// No ids, names, registrations, kennels or pedigree links go into the output;
// dog order is shuffled so row order carries nothing either.
import fs from 'node:fs'
import path from 'node:path'
import { forceSimulation, forceLink, forceManyBody, forceX, forceY, forceCollide } from 'd3'

const [dir, oursFile, templateFile, d3File, outFile] = process.argv.slice(2)

function parseCsv(text) {
  const rows = []
  let row = [], cell = '', q = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++ }
      else if (c === '"') q = false
      else cell += c
    } else if (c === '"') q = true
    else if (c === ',') { row.push(cell); cell = '' }
    else if (c === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = '' }
    else cell += c
  }
  if (cell || row.length) { row.push(cell); rows.push(row) }
  return rows
}

function family(c) {
  c = (c || '').toLowerCase()
  if (!c) return 0
  if (/harl|mantle|mantel|merle|white|pied|mis/.test(c)) return 3
  if (c.includes('blue')) return 2
  if (c.includes('black') || c.includes('blk')) return 4
  if (c.includes('brindle') || c.includes('fawn')) return 1
  return 0
}

const [head, ...body] = parseCsv(fs.readFileSync(path.join(dir, 'reference_dogs.csv'), 'utf8'))
const col = Object.fromEntries(head.map((h, i) => [h, i]))
// ours.txt lines: id|display name. Only these dogs ever carry a name in the page.
const oursNames = new Map(fs.readFileSync(oursFile, 'utf8').split('\n').map(s => s.trim()).filter(Boolean)
  .map(l => { const [id, name, note, kind] = l.split('|'); return [id, { name: name || '', note: note || '', friend: kind === 'friend' ? 1 : 0 }] }))
const ours = new Set(oursNames.keys())
const dogs = body.filter(r => r.length > 5).map(r => ({
  id: r[col.id], year: +r[col.year] || 0, F: +r[col.F] || 0,
  cl: +r[col.cluster] || 0, fam: family(r[col.color]), ours: ours.has(r[col.id]) ? 1 : 0,
}))
const index = new Map(dogs.map((d, i) => [d.id, i]))

const gexf = fs.readFileSync(path.join(dir, 'relatedness.gexf'), 'utf8')
const edges = []
for (const m of gexf.matchAll(/<edge [^>]*?source=(["'])(.*?)\1 target=(["'])(.*?)\3 weight="([\d.]+)"/g)) {
  const s = index.get(m[2].replace(/&amp;/g, '&')), t = index.get(m[4].replace(/&amp;/g, '&'))
  if (s != null && t != null) edges.push({ source: s, target: t, w: +m[5] })
}
// each dog keeps only its closest few relatives, so the picture reads as structure
const MAXN = 4
const keep = new Set()
{
  const byDog = dogs.map(() => [])
  edges.forEach((e, i) => { byDog[e.source].push(i); byDog[e.target].push(i) })
  byDog.forEach(list => list.sort((a, b) => edges[b].w - edges[a].w).slice(0, MAXN).forEach(i => keep.add(i)))
}
edges.forEach((e, i) => { if (dogs[e.source].ours && dogs[e.target].ours) keep.add(i) })
for (let i = edges.length - 1; i >= 0; i--) if (!keep.has(i)) edges.splice(i, 1)
console.error(`${dogs.length} dogs, ${edges.length} edges`)

// Layout in two levels so families read as islands:
//  1. families as big discs (area ~ size), pulled together by the number of
//     links between them and kept apart by collision;
//  2. dogs drawn toward their own family's disc, with their links as springs.
let seed = 7
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32)
const nc = Math.max(...dogs.map(d => d.cl)) + 1
const fams = Array.from({ length: nc }, (_, c) => ({ c, n: 0, F: 0, years: [], coat: [0, 0, 0, 0, 0], ours: 0 }))
dogs.forEach(d => { const f = fams[d.cl]; f.n++; f.F += d.F; f.years.push(d.year); f.coat[d.fam]++; f.ours += d.ours })
fams.forEach(f => { f.r = 5.2 * Math.sqrt(f.n) + 14; f.x = (rnd() - 0.5) * 600; f.y = (rnd() - 0.5) * 600 })
const between = new Map()
edges.forEach(e => {
  const a = dogs[e.source].cl, b = dogs[e.target].cl
  if (a === b) return
  const k = a < b ? a * 1000 + b : b * 1000 + a
  between.set(k, (between.get(k) || 0) + e.w)
})
const flinks = [...between].map(([k, w]) => ({ source: Math.floor(k / 1000), target: k % 1000, w }))
const maxw = Math.max(...flinks.map(l => l.w))
const fsim = forceSimulation(fams)
  .force('link', forceLink(flinks).distance(l => fams[l.source.index ?? l.source].r + fams[l.target.index ?? l.target].r + 30)
    .strength(l => 0.02 + 0.25 * Math.min(1, l.w / maxw)))
  .force('charge', forceManyBody().strength(-120))
  .force('collide', forceCollide(f => f.r + 38).iterations(4))
  .force('x', forceX(0).strength(0.015)).force('y', forceY(0).strength(0.015)).stop()
for (let i = 0; i < 500; i++) fsim.tick()
dogs.forEach(d => { const f = fams[d.cl], a = rnd() * 6.283, r = f.r * Math.sqrt(rnd()); d.x = f.x + r * Math.cos(a); d.y = f.y + r * Math.sin(a) })
const cen = fams
const sim = forceSimulation(dogs)
  .force('link', forceLink(edges).distance(e => 6 + 40 * (0.5 - Math.min(e.w, 0.5))).strength(e => dogs[e.source.index ?? e.source].cl === dogs[e.target.index ?? e.target].cl ? 0.3 : 0.015).iterations(1))
  .force('charge', forceManyBody().strength(-6).distanceMax(70).theta(0.9))
  .force('collide', forceCollide(1.6))
  .force('x', forceX(d => cen[d.cl].x).strength(0.22)).force('y', forceY(d => cen[d.cl].y).strength(0.22)).stop()
for (let i = 0; i < 300; i++) sim.tick()

// pack: shuffled order, quantized
const order = dogs.map((_, i) => i)
for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [order[i], order[j]] = [order[j], order[i]] }
const remap = new Int32Array(dogs.length); order.forEach((old, nu) => { remap[old] = nu })
const ext = Math.max(...dogs.map(d => Math.max(Math.abs(d.x), Math.abs(d.y))),
  ...fams.map(f => Math.max(Math.abs(f.x), Math.abs(f.y)) + f.r))
const n = dogs.length
const CL = new Uint8Array(n), X = new Int16Array(n), Y = new Int16Array(n), yr = new Uint8Array(n), F = new Uint8Array(n), fam = new Uint8Array(n), our = new Uint8Array(n)
order.forEach((old, nu) => {
  const d = dogs[old]
  X[nu] = Math.round(d.x / ext * 30000); Y[nu] = Math.round(d.y / ext * 30000)
  yr[nu] = Math.max(0, d.year - 1990); F[nu] = Math.min(255, Math.round(d.F * 400)); fam[nu] = d.fam; our[nu] = d.ours; CL[nu] = d.cl
})
const E = new Uint16Array(edges.length * 2), EW = new Uint8Array(edges.length)
edges.forEach((e, i) => { E[2 * i] = remap[e.source.index ?? e.source]; E[2 * i + 1] = remap[e.target.index ?? e.target]; EW[i] = Math.round(Math.min(e.w, 1) * 200) })
// sequencing targets (optional): one block per target_<year>.json, default target first
const b64 = a => Buffer.from(a.buffer, a.byteOffset, a.byteLength).toString('base64')
const pack = (arr) => { const u = new Uint8Array(n); order.forEach((old, nu) => { u[nu] = arr[old] }); return u }
const tgFiles = fs.readdirSync(dir).filter(f => /^target_\d{4}\.json$/.test(f))
  .sort()
const tg = tgFiles.map(f => {
  const t = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))
  const st = r => ({ first: b64(pack(r.first)), rank: b64(pack(r.rank)), frac: r.frac, mean: r.mean, new: r.new })
  return { frm: t.frm, n: t.n, close: t.close, g: st(t.g), f: st(t.f),
    typical: t.typical && { dog: remap[t.typical.dog], covered: t.typical.covered.map(j => remap[j]), n: t.typical.n, best: t.typical.best, median: t.typical.median },
    p: { final: b64(pack(t.p.final)), parent: t.p.parent, rep0: remap[t.p.rep0], steps: t.p.steps.map(s => s.map(j => remap[j])), frac: t.p.frac, mean: t.p.mean } }
})
// our dogs: display name and closest relatives (anonymous indices into the shuffled list)
const relFile = path.join(dir, 'ours_relatives.json')
const relRaw = fs.existsSync(relFile) ? JSON.parse(fs.readFileSync(relFile, 'utf8')) : {}
const oursOut = []
dogs.forEach((d, old) => {
  if (!d.ours) return
  const rel = (relRaw[d.id] || []).map(([j, w]) => [remap[j], w])
  const o = oursNames.get(d.id) || {}
  oursOut.push({ i: remap[old], name: o.name || '', note: o.note || '', ...(o.friend ? { friend: 1 } : {}), rel })
})
const data = { ours: oursOut, tg, n, m: edges.length, ext, x: b64(X), y: b64(Y), yr: b64(yr), F: b64(F), fam: b64(fam), our: b64(our), cl: b64(CL), fams: fams.map(f => {
    const ys = f.years.filter(Boolean).sort((a, b) => a - b)
    const k = f.coat.indexOf(Math.max(...f.coat.slice(1)))
    return [+(f.x / ext * 30000).toFixed(0), +(f.y / ext * 30000).toFixed(0), +(f.r / ext * 30000).toFixed(0),
      f.n, +(100 * f.F / (f.n || 1)).toFixed(1), ys.length ? ys[Math.floor(ys.length / 2)] : 0, f.coat[1] + f.coat[2] + f.coat[3] + f.coat[4] ? k : 0, f.ours]
  }), e: b64(E), ew: b64(EW) }

const page = fs.readFileSync(templateFile, 'utf8')
  .replace('/*D3FORCE*/', () => fs.readFileSync(d3File, 'utf8'))
  .replace('/*DATA*/', () => 'const DATA=' + JSON.stringify(data) + ';')
fs.writeFileSync(outFile, page)
console.error(`wrote ${outFile} (${(page.length / 1024).toFixed(0)} KB)`)
