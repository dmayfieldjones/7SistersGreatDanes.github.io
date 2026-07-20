// Pulls upcoming Great Dane conformation shows nationwide from AKC's
// official Event Search (webapps.akc.org/event-search), covering every
// state that AKC's point-schedule divisions cover (see
// src/lib/pointSchedule2026.ts / public/data/point-schedule-2026.json) so
// the /DogShows page can group and filter shows by division exactly like
// the AKC Point Schedule page does. AKC's own search is the authoritative
// source — every AKC-licensed show, regardless of which superintendent
// runs it, has to be registered there. This intentionally does not scrape
// infodog.com or onofrio.com/execpgm: their robots.txt disallow crawling
// those (infodog disallows everything; onofrio disallows /execpgm/
// specifically).
import fs from 'node:fs'
import path from 'node:path'

const API_URL = 'https://webapps.akc.org/event-search/api/search/events'
const GREAT_DANE_BREED_CODE = '614 '
// All 50 states + DC — every state covered by an AKC point-schedule
// division (division 12, Puerto Rico/Mexico, isn't part of the states
// topology map and is excluded, matching stateToDivision()).
const STATES = [
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'DC',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
]
const LOOKAHEAD_DAYS = 240
// AKC's endpoint 500s (414 upstream) past ~38 states in one request —
// found by bisection, not documented. Batch well under that.
const STATES_PER_REQUEST = 20

function formatDate(date) {
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${mm}/${dd}/${date.getFullYear()}`
}

function chunk(array, size) {
  const chunks = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

function buildRequestBody(states, from, to) {
  return {
    address: {
      states: states.join(' '),
      eventSetting: { indoor: true, outdoor: true, outsideCovered: true },
      searchByState: true,
      searchByCity: false,
      searchText: 'All States',
    },
    breedCode: GREAT_DANE_BREED_CODE,
    breedName: 'Great Dane',
    breedId: 'SPECIFIC',
    dateRange: { from, to, type: 'event' },
    competition: {
      items: [
        {
          selected: true,
          value: { compType: 'AB/LB' },
          label: 'All- Breed and Group (AB/LB)',
        },
        {
          selected: true,
          value: { compType: 'S/PS/DS' },
          label: 'Specialties (S/PS/DS)',
        },
      ],
      filters: [],
    },
  }
}

async function fetchEventsForStates(states, from, to) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-csrf-token': 'token',
    },
    body: JSON.stringify(buildRequestBody(states, from, to)),
  })
  if (!res.ok) {
    throw new Error(
      `AKC event search request failed for [${states.join(' ')}]: ${res.status} ${await res.text()}`,
    )
  }
  const data = await res.json()
  return data.events ?? []
}

function epochToDateString(ms) {
  if (!ms) return null
  return new Date(ms).toISOString().slice(0, 10)
}

function normalizeEvent(raw) {
  const items = raw.items ?? []
  const competitionGroups = [
    ...new Set(items.map(i => i.competitionGroup).filter(Boolean)),
  ]
  const closingDates = items.map(i => i.closingDate).filter(Boolean)
  const openingDates = items.map(i => i.openingDate).filter(Boolean)

  return {
    id: raw.id,
    eventNumber: raw.eventNumber ?? null,
    clubName: raw.eventName,
    eventStatus: raw.eventStatus,
    startDate: raw.startDate,
    endDate: raw.endDate,
    city: raw.city,
    state: raw.state,
    siteId: raw.site?.id ?? null,
    venue: raw.site?.name ?? null,
    address: [raw.site?.location1, raw.site?.location2, raw.site?.location3]
      .filter(Boolean)
      .join(', '),
    postalCode: raw.site?.postalCode ?? null,
    coordinates: raw.site?.coordinates ?? null,
    competitionGroups,
    isNationalOwner: Boolean(raw.isNationalOwner),
    isJuniorShowmanship: Boolean(raw.isJuniorShowmanship),
    isAcceptingOnlineEntries: Boolean(raw.isAcceptingOnlineEntries),
    openingDate: openingDates.length
      ? epochToDateString(Math.min(...openingDates))
      : null,
    closingDate: closingDates.length
      ? epochToDateString(Math.max(...closingDates))
      : null,
    superintendent: raw.superintendentSecretary
      ? {
          name: raw.superintendentSecretary.name ?? null,
          phone: raw.superintendentSecretary.phone ?? null,
          email: raw.superintendentSecretary.email ?? null,
        }
      : null,
  }
}

async function main() {
  const today = new Date()
  const end = new Date(today.getTime() + LOOKAHEAD_DAYS * 24 * 60 * 60 * 1000)
  const from = formatDate(today)
  const to = formatDate(end)

  const batches = chunk(STATES, STATES_PER_REQUEST)
  const rawEventsByBatch = await Promise.all(
    batches.map(batch => fetchEventsForStates(batch, from, to)),
  )

  const byId = new Map()
  for (const raw of rawEventsByBatch.flat()) {
    byId.set(raw.id, raw)
  }

  const events = [...byId.values()]
    .filter(e => e.eventStatus !== 'Cancelled')
    .map(normalizeEvent)
    .sort(
      (a, b) =>
        a.startDate.localeCompare(b.startDate) ||
        a.state.localeCompare(b.state),
    )

  const output = {
    generatedAt: new Date().toISOString(),
    breed: 'Great Dane',
    dateRange: { from, to },
    states: STATES.slice().sort(),
    source: 'AKC Event Search (webapps.akc.org/event-search)',
    events,
  }

  const outPath = path.join(process.cwd(), 'public/data/dog-shows.json')
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n')
  console.log(`Wrote ${events.length} events to ${outPath}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
