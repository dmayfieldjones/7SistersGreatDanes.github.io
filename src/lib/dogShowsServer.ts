import fs from 'node:fs'
import path from 'node:path'

export interface DogShowEvent {
  id: number
  eventNumber: string | null
  clubName: string
  eventStatus: string
  startDate: string
  endDate: string
  city: string
  state: string
  venue: string | null
  address: string
  postalCode: string | null
  coordinates: { lat: number; lon: number } | null
  competitionGroups: string[]
  isNationalOwner: boolean
  isJuniorShowmanship: boolean
  isAcceptingOnlineEntries: boolean
  openingDate: string | null
  closingDate: string | null
  superintendent: {
    name: string | null
    phone: string | null
    email: string | null
  } | null
}

export interface DogShowsData {
  generatedAt: string
  breed: string
  dateRange: { from: string; to: string }
  states: string[]
  source: string
  events: DogShowEvent[]
}

/** Build-time-only loader (Astro frontmatter runs in Node) — do not import from client code. */
export function loadDogShowsData(): DogShowsData {
  return JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), 'public/data/dog-shows.json'),
      'utf8',
    ),
  ) as DogShowsData
}
