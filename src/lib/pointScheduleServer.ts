import fs from 'node:fs'
import path from 'node:path'
import type { PointScheduleData } from './pointSchedule2026'

/** Build-time-only loader (Astro frontmatter runs in Node) — do not import from client code. */
export function loadPointScheduleData(): PointScheduleData {
  return JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), 'public/data/point-schedule-2026.json'),
      'utf8',
    ),
  ) as PointScheduleData
}
