/**
 * AKC 2026 point schedule, effective May 12, 2026, covering all divisions
 * and all AKC breeds/varieties.
 * Source: AKC-published divisional point schedule. Verify at akc.org before
 * entering — AKC can revise these numbers between publication cycles.
 */

export interface PointLevels {
  /** Dogs/bitches needed for a 1/2/3/4/5-point major, in order. */
  onePoint: number
  twoPoint: number
  threePoint: number
  fourPoint: number
  fivePoint: number
}

export interface BreedPoints {
  dogs: PointLevels
  bitches: PointLevels
}

/**
 * Points needed for a breed in a division, packed as
 * [1dogs, 1bitches, 2dogs, 2bitches, 3dogs, 3bitches, 4dogs, 4bitches, 5dogs, 5bitches].
 * Packed rather than keyed by point level to keep the ~218-breed x 15-division
 * dataset a reasonable download size.
 */
export type PackedPoints = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
]

export interface Division {
  id: number
  /** States/territories in this division, as full names (matches Census/topojson naming). */
  states: string[]
  /** Breed name -> packed points for this division. */
  points: Record<string, PackedPoints>
}

export interface PointScheduleData {
  effectiveDate: string
  /** Date this dataset was last pulled from the AKC's published point schedule PDF. */
  sourceCheckedDate: string
  sourceUrl: string
  defaultBreed: string
  /** All breed/variety names, sorted for display (catch-all entry last). */
  breeds: string[]
  divisions: Division[]
}

export type Sex = 'dogs' | 'bitches'

/** The AKC "major" threshold: a 3, 4, or 5-point win. */
export const MAJOR_POINT_KEYS = ['threePoint', 'fourPoint', 'fivePoint'] as const

export const POINT_SCHEDULE_DATA_URL = '/data/point-schedule-2026.json'

export const BREED_FACTS_DATA_URL = '/data/breed-facts-2026.json'

export interface BreedFact {
  recognitionYear: number | null
  description: string
}

export type BreedFactsData = Record<string, BreedFact>

export const ALL_OTHER_BREEDS = 'ALL OTHER BREEDS AND VARIETIES'

/** Friendlier, non-shouting display label for a breed name (only differs for the catch-all entry). */
export function breedLabel(breed: string): string {
  return breed === ALL_OTHER_BREEDS ? 'All Other Breeds and Varieties' : breed
}

/** URL-safe slug for a breed name, used for the per-breed SEO landing pages. */
export function slugifyBreed(breed: string): string {
  return breed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function levelsFromPacked(
  packed: PackedPoints,
  sex: Sex,
): PointLevels {
  const offset = sex === 'dogs' ? 0 : 1
  return {
    onePoint: packed[offset],
    twoPoint: packed[offset + 2],
    threePoint: packed[offset + 4],
    fourPoint: packed[offset + 6],
    fivePoint: packed[offset + 8],
  }
}

/** Points needed for a breed in a division, or undefined if the breed isn't in the dataset. */
export function pointsForBreed(
  division: Division,
  breed: string,
): BreedPoints | undefined {
  const packed = division.points[breed]
  if (!packed) return undefined
  return {
    dogs: levelsFromPacked(packed, 'dogs'),
    bitches: levelsFromPacked(packed, 'bitches'),
  }
}

export function divisionById(
  data: PointScheduleData,
  id: number,
): Division | undefined {
  return data.divisions.find(division => division.id === id)
}

/** Full Census state/territory name -> the division that contains it. Only covers
 * the 50 states + DC (the mappable subset); Division 12 (Puerto Rico, Mexico) is
 * shown separately since neither is part of the US states topology. */
export function stateToDivision(data: PointScheduleData): Map<string, Division> {
  return new Map(
    data.divisions.flatMap(division =>
      division.states
        .filter(state => state !== 'Puerto Rico' && state !== 'Mexico')
        .map(state => [state, division] as const),
    ),
  )
}

export const STATE_ABBREVIATIONS: Record<string, string> = {
  Alabama: 'AL',
  Alaska: 'AK',
  Arizona: 'AZ',
  Arkansas: 'AR',
  California: 'CA',
  Colorado: 'CO',
  Connecticut: 'CT',
  Delaware: 'DE',
  'District of Columbia': 'DC',
  Florida: 'FL',
  Georgia: 'GA',
  Hawaii: 'HI',
  Idaho: 'ID',
  Illinois: 'IL',
  Indiana: 'IN',
  Iowa: 'IA',
  Kansas: 'KS',
  Kentucky: 'KY',
  Louisiana: 'LA',
  Maine: 'ME',
  Maryland: 'MD',
  Massachusetts: 'MA',
  Michigan: 'MI',
  Minnesota: 'MN',
  Mississippi: 'MS',
  Missouri: 'MO',
  Montana: 'MT',
  Nebraska: 'NE',
  Nevada: 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  Ohio: 'OH',
  Oklahoma: 'OK',
  Oregon: 'OR',
  Pennsylvania: 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  Tennessee: 'TN',
  Texas: 'TX',
  Utah: 'UT',
  Vermont: 'VT',
  Virginia: 'VA',
  Washington: 'WA',
  'West Virginia': 'WV',
  Wisconsin: 'WI',
  Wyoming: 'WY',
}
