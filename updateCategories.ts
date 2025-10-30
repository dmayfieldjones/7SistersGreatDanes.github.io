import readline from 'readline'
import fs from 'fs'
const rl = readline.createInterface({
  input: process.stdin,
})
const geneMap = JSON.parse(fs.readFileSync('out.json', 'utf8'))

function makeLoc(arg?: { chr: string; start: number; end: number }) {
  return arg ? `${arg.chr}:${arg.start}-${arg.end}` : undefined
}
;(async () => {
  const ret = {} as { chr: string; start: number; end: number }[]
  console.log(
    [
      'type',
      'name',
      'name2',
      'summary',
      'location',
      'citations',
      'doi1',
      'doi2',
    ].join('\t'),
  )
  for await (const line of rl) {
    if (line.startsWith('#')) {
      continue
    }
    const [type, name, name2, summary, location, citations, doi1, doi2] =
      line.split('\t')

    console.log(
      [
        type,
        name,
        name2,
        summary,
        makeLoc(geneMap[name2]),
        citations,
        doi1,
        doi2,
      ].join('\t'),
    )
  }
})()
