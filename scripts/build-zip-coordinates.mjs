// One-off generator for public/data/zip-coordinates.json — not part of the
// recurring dog-shows fetch, since ZCTA boundaries barely change year to
// year. Re-run manually only if the data ever needs refreshing.
//
// Source: US Census Bureau Gazetteer ZCTA file (public domain). ZCTAs
// approximate ZIP codes closely enough for a "shows near this zip" radius
// search — exact ZIP-to-ZCTA mismatches are rare and immaterial at
// radius-search granularity.
import fs from 'node:fs'
import path from 'node:path'
import { Buffer } from 'node:buffer'

const GAZETTEER_URL =
  'https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2024_Gazetteer/2024_Gaz_zcta_national.zip'

async function main() {
  const res = await fetch(GAZETTEER_URL)
  if (!res.ok) throw new Error(`Download failed: ${res.status}`)
  const zipBuffer = Buffer.from(await res.arrayBuffer())

  // Minimal local zip-file reader (single-entry, stored-or-deflated) so we
  // don't need an extra dependency just to unzip one small government file.
  // ZIP's deflate entries are raw DEFLATE streams (no zlib/gzip header),
  // hence inflateRawSync rather than unzipSync/inflateSync.
  const { inflateRawSync } = await import('node:zlib')
  const entries = readZipEntries(zipBuffer)
  const txtEntry = entries.find(e => e.name.endsWith('.txt'))
  if (!txtEntry) throw new Error('No .txt entry found in gazetteer zip')
  const text =
    txtEntry.method === 0
      ? txtEntry.data.toString('utf8')
      : inflateRawSync(txtEntry.data).toString('utf8')

  const lines = text.split('\n')
  const coords = {}
  for (const line of lines.slice(1)) {
    const parts = line.replace(/\r$/, '').split('\t')
    if (parts.length < 7) continue
    const geoid = parts[0].trim()
    const lat = Number.parseFloat(parts[5])
    const lon = Number.parseFloat(parts[6])
    if (!geoid || Number.isNaN(lat) || Number.isNaN(lon)) continue
    coords[geoid] = [
      Math.round(lat * 10000) / 10000,
      Math.round(lon * 10000) / 10000,
    ]
  }

  const outPath = path.join(process.cwd(), 'public/data/zip-coordinates.json')
  fs.writeFileSync(outPath, JSON.stringify(coords))
  console.log(`Wrote ${Object.keys(coords).length} ZCTAs to ${outPath}`)
}

/** Reads a standard (non-Zip64) zip's central directory to list entries with raw compressed bytes. */
function readZipEntries(buf) {
  const eocdSig = 0x06054b50
  let eocdOffset = -1
  for (let i = buf.length - 22; i >= 0; i--) {
    if (buf.readUInt32LE(i) === eocdSig) {
      eocdOffset = i
      break
    }
  }
  if (eocdOffset === -1) throw new Error('Not a valid zip file')
  const entryCount = buf.readUInt16LE(eocdOffset + 10)
  let cdOffset = buf.readUInt32LE(eocdOffset + 16)

  const entries = []
  for (let i = 0; i < entryCount; i++) {
    const sig = buf.readUInt32LE(cdOffset)
    if (sig !== 0x02014b50) throw new Error('Bad central directory entry')
    const method = buf.readUInt16LE(cdOffset + 10)
    const compSize = buf.readUInt32LE(cdOffset + 20)
    const nameLen = buf.readUInt16LE(cdOffset + 28)
    const extraLen = buf.readUInt16LE(cdOffset + 30)
    const commentLen = buf.readUInt16LE(cdOffset + 32)
    const localHeaderOffset = buf.readUInt32LE(cdOffset + 42)
    const name = buf
      .subarray(cdOffset + 46, cdOffset + 46 + nameLen)
      .toString('utf8')

    const lfNameLen = buf.readUInt16LE(localHeaderOffset + 26)
    const lfExtraLen = buf.readUInt16LE(localHeaderOffset + 28)
    const dataStart = localHeaderOffset + 30 + lfNameLen + lfExtraLen
    const data = buf.subarray(dataStart, dataStart + compSize)

    entries.push({ name, method, data })
    cdOffset += 46 + nameLen + extraLen + commentLen
  }
  return entries
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
