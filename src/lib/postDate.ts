const ISO_DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/

/**
 * If `dateStr` is a strict `YYYY-MM-DD` string for a real calendar day, return that
 * string; otherwise `undefined` (rejects impossible dates like 2025-02-30).
 */
export function normalizeValidIsoCalendarDay(dateStr: string): string | undefined {
  const m = ISO_DATE_ONLY.exec(dateStr.trim())
  if (!m) return undefined
  const y = Number(m[1])
  const month = Number(m[2]) - 1
  const day = Number(m[3])
  const d = new Date(y, month, day)
  if (d.getFullYear() !== y || d.getMonth() !== month || d.getDate() !== day) {
    return undefined
  }
  return `${m[1]}-${m[2]}-${m[3]}`
}

/**
 * Parse YYYY-MM-DD frontmatter values as the intended calendar day in local time.
 * (Plain `new Date('2026-03-28')` is UTC midnight and shows as March 27 in most US zones.)
 */
export function parsePostDateLocal(dateStr: string): Date {
  const m = ISO_DATE_ONLY.exec(dateStr.trim())
  if (!m) return new Date(dateStr)
  const y = Number(m[1])
  const month = Number(m[2]) - 1
  const d = Number(m[3])
  return new Date(y, month, d)
}

/** Stable ISO timestamp for Open Graph / JSON-LD (noon UTC on that calendar day). */
export function postDateToPublishedInstant(dateStr: string): string {
  if (!ISO_DATE_ONLY.test(dateStr.trim())) return new Date(dateStr).toISOString()
  return `${dateStr.trim()}T12:00:00.000Z`
}

export function formatPostDateEnUS(dateStr: string): string {
  return parsePostDateLocal(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
