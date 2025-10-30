import fs from 'fs'
import path from 'path'
import { Metadata } from 'next'
import Browser from './Browser'

export const metadata: Metadata = {
  title: '7Sisters - Genome Browsers',
  description:
    'Our mission and approach to breeding exceptional Great Danes at 7Sisters Farm',
}

export default function Page() {
  const lines = fs
    .readFileSync(path.join(process.cwd(), 'categories2.tsv'), 'utf8')
    .split('\n')
    .map(f => f.trim())
    .filter(f => !!f)
  const header = lines[0].split('\t')
  return (
    <Browser
      // @ts-expect-error
      geneCategories={lines
        .slice(1)
        .map(line =>
          Object.fromEntries(
            line.split('\t').map((line, idx) => [header[idx], line] as const),
          ),
        )}
    />
  )
}
