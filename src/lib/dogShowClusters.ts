import type { DogShowEvent } from './dogShowsServer'

export interface ShowCluster {
  /** Stable key for React/Astro list rendering — site id when known, else the sole event's id. */
  key: string
  siteId: number | null
  venue: string | null
  city: string
  state: string
  postalCode: string | null
  coordinates: { lat: number; lon: number } | null
  divisionId: number | null
  startDate: string
  endDate: string
  events: (DogShowEvent & { divisionId: number | null })[]
}

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

/**
 * Groups shows into clusters — consecutive-or-overlapping-day runs at the
 * same physical venue (AKC's `site.id`), the pattern behind multi-day show
 * weekends where different clubs (or even different sessions of the same
 * day) run back to back. A single free day in between breaks the cluster;
 * same-site events more than a day apart are unrelated show weekends and
 * stay separate.
 */
export function clusterEvents(
  events: (DogShowEvent & { divisionId: number | null })[],
): ShowCluster[] {
  const bySite = new Map<
    string,
    (DogShowEvent & { divisionId: number | null })[]
  >()
  for (const event of events) {
    const key =
      event.siteId !== null ? `site-${event.siteId}` : `event-${event.id}`
    const list = bySite.get(key)
    if (list) list.push(event)
    else bySite.set(key, [event])
  }

  const clusters: ShowCluster[] = []
  for (const siteEvents of bySite.values()) {
    const sorted = [...siteEvents].sort(
      (a, b) =>
        a.startDate.localeCompare(b.startDate) ||
        a.endDate.localeCompare(b.endDate),
    )

    let current: (DogShowEvent & { divisionId: number | null })[] = []
    let currentMaxEnd = ''

    const flush = () => {
      if (current.length === 0) return
      const first = current[0]
      clusters.push({
        key: `${first.siteId !== null ? `site-${first.siteId}` : `event-${first.id}`}-${first.startDate}`,
        siteId: first.siteId,
        venue: first.venue,
        city: first.city,
        state: first.state,
        postalCode: first.postalCode,
        coordinates: first.coordinates,
        divisionId: first.divisionId,
        startDate: current.reduce(
          (min, e) => (e.startDate < min ? e.startDate : min),
          first.startDate,
        ),
        endDate: current.reduce(
          (max, e) => (e.endDate > max ? e.endDate : max),
          first.endDate,
        ),
        events: [...current].sort(
          (a, b) =>
            a.startDate.localeCompare(b.startDate) ||
            a.clubName.localeCompare(b.clubName),
        ),
      })
      current = []
    }

    for (const event of sorted) {
      if (current.length === 0) {
        current.push(event)
        currentMaxEnd = event.endDate
        continue
      }
      if (event.startDate <= addDays(currentMaxEnd, 1)) {
        current.push(event)
        if (event.endDate > currentMaxEnd) currentMaxEnd = event.endDate
      } else {
        flush()
        current.push(event)
        currentMaxEnd = event.endDate
      }
    }
    flush()
  }

  return clusters.sort(
    (a, b) =>
      a.startDate.localeCompare(b.startDate) || a.state.localeCompare(b.state),
  )
}
