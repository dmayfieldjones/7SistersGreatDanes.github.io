//@ts-nocheck
import readline from 'readline'
const rl = readline.createInterface({
  input: process.stdin,
})

;(async () => {
  const ret = {} as { chr: string; start: number; end: number }[]
  for await (const line of rl) {
    if (line.startsWith('#')) {
      return
    }
    const [chr, type, type2, start, end, x, y, z, col9] = line.split('\t')
    const col9attrs = Object.fromEntries(
      col9!
        .split(';')
        .map(f => f.trim())
        .filter(f => !!f)
        .map(f => f.split('='))
        .map(([key, val]) => [
          key!.trim(),
          val ? decodeURIComponent(val).trim().split(',').join(' ') : undefined,
        ]),
    )
    ret[col9attrs.ID!] = {
      chr,
      start,
      end,
    }
  }
  console.log(JSON.stringify(ret, null, 2))
})()
