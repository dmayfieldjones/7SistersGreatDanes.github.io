import fs from 'node:fs'
import path from 'node:path'
import type { BreedFactsData } from './pointSchedule2026'

/** Build-time-only loader (Astro frontmatter runs in Node) — do not import from client code. */
export function loadBreedFacts(): BreedFactsData {
  return JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), 'public/data/breed-facts-2026.json'),
      'utf8',
    ),
  ) as BreedFactsData
}
