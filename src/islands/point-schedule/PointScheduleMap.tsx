import { useEffect, useMemo, useRef, useState } from 'react'
import { geoPath } from 'd3'
import { feature } from 'topojson-client'
import type { Topology, GeometryCollection } from 'topojson-specification'
import {
  STATE_ABBREVIATIONS,
  MAJOR_POINT_KEYS,
  BREED_STORAGE_KEY,
  ALL_OTHER_BREEDS,
  breedLabel,
  divisionById,
  pointsForBreed,
  slugifyBreed,
  stateToDivision,
  POINT_SCHEDULE_DATA_URL,
  BREED_FACTS_DATA_URL,
  type Sex,
  type PointLevels,
  type PointScheduleData,
  type Division,
  type BreedFactsData,
  type BreedFact,
  type BreedPoints,
} from '../../lib/pointSchedule2026'
import { sequentialRed } from '../../lib/sequentialColor'
import BreedPicker from './BreedPicker'

interface InitialDivision {
  id: number
  states: string[]
  points: BreedPoints | undefined
}

interface PointScheduleMapProps {
  /** Default breed for this page (e.g. a per-breed SEO landing page). Falls back to the dataset default (Great Danes) on the hub page. Overridden by a `breed` URL query param or a remembered choice in localStorage. */
  initialBreed?: string
  /** Link to the full breed index — an in-page "#breed-index" anchor on the hub, or "/AKCPointSchedule#breed-index" elsewhere. */
  breedIndexHref?: string
  /** Render the full all-divisions table below the map, following the selected breed. */
  renderFullTable?: boolean
  /** Which breed `initialDivisions`/`initialBreedFact` were computed for. Deliberately separate from `initialBreed` — the hub page leaves `initialBreed` unset (so it can fall back to a remembered localStorage breed) but its SSR-seeded table data is always for Great Danes. */
  initialFactsBreed?: string
  /** Server-computed table rows for `initialFactsBreed`, used for the first (SSR'd) paint before the client-side dataset fetch resolves — keeps the table's real content in the page's initial HTML for crawlers. Ignored once a different breed is selected. */
  initialDivisions?: InitialDivision[]
  /** Server-computed breed fact for `initialFactsBreed`, same SSR purpose as `initialDivisions`. */
  initialBreedFact?: BreedFact
}

const DEFAULT_BREED_INDEX_HREF = '/AKCPointSchedule#breed-index'

interface RawStateShape {
  name: string
  path: string
}

interface StateShape extends RawStateShape {
  divisionId: number | null
}

interface TooltipState {
  x: number
  y: number
  stateName: string
  divisionId: number
  placement: 'above' | 'below'
}

const TOOLTIP_WIDTH = 200
const TOOLTIP_HEIGHT = 84
const TOOLTIP_GAP = 12
const FALLBACK_BREED = 'Great Danes'
const DEFAULT_DIVISION_ID = 15
const VALID_SEXES: Sex[] = ['dogs', 'bitches']

const POINT_ROWS: { key: keyof PointLevels; label: string }[] = [
  { key: 'onePoint', label: '1 pt' },
  { key: 'twoPoint', label: '2 pt' },
  { key: 'threePoint', label: '3 pt' },
  { key: 'fourPoint', label: '4 pt' },
  { key: 'fivePoint', label: '5 pt' },
]

function syncUrl(breed: string, divisionId: number, sex: Sex) {
  const url = new URL(window.location.href)
  url.searchParams.set('breed', breed)
  url.searchParams.set('division', String(divisionId))
  url.searchParams.set('sex', sex)
  window.history.replaceState(null, '', url)
}

export default function PointScheduleMap({
  initialBreed,
  breedIndexHref = DEFAULT_BREED_INDEX_HREF,
  renderFullTable = false,
  initialFactsBreed,
  initialDivisions,
  initialBreedFact,
}: PointScheduleMapProps) {
  const [sex, setSex] = useState<Sex>('bitches')
  const [scheduleData, setScheduleData] = useState<PointScheduleData | null>(
    null,
  )
  const [breedFacts, setBreedFacts] = useState<BreedFactsData | null>(null)
  const [breed, setBreed] = useState<string>(initialBreed ?? FALLBACK_BREED)
  const [selectedDivisionId, setSelectedDivisionId] = useState<number>(
    DEFAULT_DIVISION_ID,
  )
  const [hoveredDivisionId, setHoveredDivisionId] = useState<number | null>(
    null,
  )
  const [rawStates, setRawStates] = useState<RawStateShape[] | null>(null)
  const [viewBox, setViewBox] = useState('0 0 975 610')
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const mapWrapRef = useRef<HTMLDivElement>(null)

  const showTooltipAt = (
    clientX: number,
    clientY: number,
    stateName: string,
    divisionId: number,
  ) => {
    const wrapRect = mapWrapRef.current?.getBoundingClientRect()
    if (!wrapRect) return
    const rawX = clientX - wrapRect.left
    const rawY = clientY - wrapRect.top
    const halfWidth = TOOLTIP_WIDTH / 2
    const x = Math.min(
      Math.max(rawX, halfWidth + 4),
      Math.max(wrapRect.width - halfWidth - 4, halfWidth + 4),
    )
    const placement: 'above' | 'below' =
      rawY - TOOLTIP_HEIGHT - TOOLTIP_GAP < 0 ? 'below' : 'above'
    setTooltip({ x, y: rawY, stateName, divisionId, placement })
  }

  useEffect(() => {
    let cancelled = false
    fetch(POINT_SCHEDULE_DATA_URL)
      .then(res => res.json())
      .then((data: PointScheduleData) => {
        if (cancelled) return
        setScheduleData(data)

        let resolvedBreed =
          initialBreed && data.breeds.includes(initialBreed)
            ? initialBreed
            : (data.defaultBreed ?? FALLBACK_BREED)

        if (!initialBreed) {
          try {
            const stored = window.localStorage.getItem(BREED_STORAGE_KEY)
            if (stored && data.breeds.includes(stored)) {
              resolvedBreed = stored
            }
          } catch {
            // localStorage unavailable (private browsing, etc.) — ignore.
          }
        }

        const params = new URLSearchParams(window.location.search)
        const queryBreed = params.get('breed')
        if (queryBreed && data.breeds.includes(queryBreed)) {
          resolvedBreed = queryBreed
        }
        setBreed(resolvedBreed)

        const querySex = params.get('sex')
        if (querySex === 'dogs' || querySex === 'bitches') {
          setSex(querySex)
        }

        const queryDivision = params.get('division')
        if (queryDivision) {
          const id = Number.parseInt(queryDivision, 10)
          if (data.divisions.some(d => d.id === id)) {
            setSelectedDivisionId(id)
          }
        }
      })
      .catch(() => setScheduleData(null))
    return () => {
      cancelled = true
    }
    // Only ever run once on mount — initialBreed is a static page prop, not
    // something that changes during the component's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!renderFullTable) return
    let cancelled = false
    fetch(BREED_FACTS_DATA_URL)
      .then(res => res.json())
      .then((data: BreedFactsData) => {
        if (!cancelled) setBreedFacts(data)
      })
      .catch(() => setBreedFacts(null))
    return () => {
      cancelled = true
    }
  }, [renderFullTable])

  useEffect(() => {
    let cancelled = false
    fetch('/data/us-states-albers-10m.json')
      .then(res => res.json())
      .then((topology: Topology) => {
        if (cancelled) return
        const geometries = topology.objects
          .states as unknown as GeometryCollection
        const collection = feature(topology, geometries) as unknown as {
          features: { properties: { name: string }; geometry: unknown }[]
        }
        const path = geoPath()
        const shapes: RawStateShape[] = collection.features.map(f => ({
          name: f.properties.name,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          path: path(f.geometry as any) ?? '',
        }))
        setRawStates(shapes)
        const bbox = topology.bbox
        if (bbox) {
          const [x0, y0, x1, y1] = bbox
          setViewBox(`${x0} ${y0} ${x1 - x0} ${y1 - y0}`)
        }
      })
      .catch(() => setRawStates([]))
    return () => {
      cancelled = true
    }
  }, [])

  const isLoading = !scheduleData

  const handleBreedChange = (newBreed: string) => {
    // Already on this breed (e.g. re-confirming the current selection) — nothing to navigate to.
    if (newBreed === breed) return

    try {
      window.localStorage.setItem(BREED_STORAGE_KEY, newBreed)
    } catch {
      // localStorage unavailable — the picker still works, it just won't be remembered.
    }

    // Every breed has its own dedicated page (title, H1, and reference table
    // all matching it) — navigate there instead of swapping the breed in
    // place, so nothing on the page can ever end up describing a breed
    // other than the one actually shown.
    const params = new URLSearchParams()
    params.set('sex', sex)
    params.set('division', String(selectedDivisionId))
    window.location.href = `/AKCPointSchedule/breed/${slugifyBreed(newBreed)}?${params}`
  }

  const handleSexChange = (newSex: Sex) => {
    setSex(newSex)
    syncUrl(breed, selectedDivisionId, newSex)
  }

  const handleDivisionSelect = (id: number) => {
    setSelectedDivisionId(id)
    syncUrl(breed, id, sex)
  }

  const stateDivisionMap = useMemo(
    () =>
      scheduleData ? stateToDivision(scheduleData) : new Map<string, Division>(),
    [scheduleData],
  )

  const states: StateShape[] | null = useMemo(() => {
    if (!rawStates) return null
    return rawStates.map(s => ({
      ...s,
      divisionId: stateDivisionMap.get(s.name)?.id ?? null,
    }))
  }, [rawStates, stateDivisionMap])

  const breedPointsByDivision = useMemo(() => {
    if (!scheduleData) return new Map<number, PointLevels | undefined>()
    return new Map(
      scheduleData.divisions.map(division => [
        division.id,
        pointsForBreed(division, breed)?.[sex],
      ]),
    )
  }, [scheduleData, breed, sex])

  const { min, max } = useMemo(() => {
    const values = [...breedPointsByDivision.values()]
      .filter((v): v is PointLevels => Boolean(v))
      .map(v => v.threePoint)
    if (values.length === 0) return { min: 0, max: 0 }
    return { min: Math.min(...values), max: Math.max(...values) }
  }, [breedPointsByDivision])

  const colorForDivision = (divisionId: number | null) => {
    if (divisionId === null) return 'var(--ps-water)'
    const levels = breedPointsByDivision.get(divisionId)
    if (!levels) return 'var(--ps-water)'
    const t = max === min ? 0.5 : (levels.threePoint - min) / (max - min)
    return sequentialRed(t, 'light')
  }

  const selectedDivision = scheduleData
    ? divisionById(scheduleData, selectedDivisionId)
    : undefined
  const selectedDivisionPoints = selectedDivision
    ? pointsForBreed(selectedDivision, breed)
    : undefined
  const displayBreed = breedLabel(breed)

  // Before the client-side dataset fetch resolves (including during SSR),
  // fall back to the server-computed initial props so the page's own breed
  // still has real table content in the first paint / crawlable HTML. Once
  // the dataset loads, or the visitor picks a different breed, this always
  // switches to computing fresh from `scheduleData`.
  const fullTableDivisions: InitialDivision[] | undefined = scheduleData
    ? scheduleData.divisions.map(division => ({
        id: division.id,
        states: division.states,
        points: pointsForBreed(division, breed),
      }))
    : breed === initialFactsBreed
      ? initialDivisions
      : undefined

  const fullTableFact: BreedFact | undefined = breedFacts
    ? breedFacts[breed]
    : breed === initialFactsBreed
      ? initialBreedFact
      : undefined

  return (
    <div className="ps-root">
      <div className="ps-top-controls">
        {scheduleData ? (
          <BreedPicker
            breeds={scheduleData.breeds}
            value={breed}
            onChange={handleBreedChange}
            breedIndexHref={breedIndexHref}
          />
        ) : (
          <div className="ps-breed-picker" aria-hidden="true">
            <span className="ps-breed-label">Breed</span>
            <div className="ps-breed-input ps-breed-skeleton">
              Loading breeds…
            </div>
          </div>
        )}

        <div className="ps-controls" role="group" aria-label="Show sex">
          {VALID_SEXES.map(option => (
            <button
              key={option}
              type="button"
              className="ps-toggle"
              aria-pressed={sex === option}
              onClick={() => handleSexChange(option)}
            >
              {option === 'dogs' ? 'Dogs' : 'Bitches'}
            </button>
          ))}
        </div>
      </div>

      {breed === ALL_OTHER_BREEDS && (
        <p className="ps-breed-note">
          "All other breeds and varieties" is the AKC's catch-all
          division-points bucket for breeds and varieties not individually
          listed in the point schedule.
        </p>
      )}

      <div className="ps-map-wrap" ref={mapWrapRef}>
        {isLoading && <p className="ps-map-loading">Loading schedule…</p>}
        <svg
          viewBox={viewBox}
          className="ps-map"
          role="img"
          aria-label={`Map of AKC point-schedule divisions for ${displayBreed}. Hover, focus, or tap a state to see the dogs and bitches needed for a 3-point major in its division.`}
          onClick={e => {
            if (e.target === e.currentTarget) setTooltip(null)
          }}
        >
          {states?.map(s => {
            const isSelected = s.divisionId === selectedDivisionId
            const isHovered = s.divisionId === hoveredDivisionId
            const divisionLevels = s.divisionId
              ? breedPointsByDivision.get(s.divisionId)
              : undefined
            return (
              <path
                key={s.name}
                d={s.path}
                fill={colorForDivision(s.divisionId)}
                className={
                  'ps-state' +
                  (isSelected ? ' ps-state-selected' : '') +
                  (isHovered ? ' ps-state-hovered' : '')
                }
                tabIndex={s.divisionId ? 0 : -1}
                role={s.divisionId ? 'button' : undefined}
                aria-label={
                  s.divisionId && divisionLevels
                    ? `${s.name}: Division ${s.divisionId}, ${divisionLevels.threePoint} ${sex} needed for a 3-point major`
                    : undefined
                }
                onMouseEnter={e => {
                  setHoveredDivisionId(s.divisionId)
                  if (s.divisionId) {
                    showTooltipAt(e.clientX, e.clientY, s.name, s.divisionId)
                  }
                }}
                onMouseMove={e => {
                  if (s.divisionId) {
                    showTooltipAt(e.clientX, e.clientY, s.name, s.divisionId)
                  }
                }}
                onMouseLeave={() => {
                  setHoveredDivisionId(null)
                  setTooltip(null)
                }}
                onFocus={e => {
                  setHoveredDivisionId(s.divisionId)
                  if (s.divisionId) {
                    const rect = e.currentTarget.getBoundingClientRect()
                    showTooltipAt(
                      rect.left + rect.width / 2,
                      rect.top + rect.height / 2,
                      s.name,
                      s.divisionId,
                    )
                  }
                }}
                onBlur={() => {
                  setHoveredDivisionId(null)
                  setTooltip(null)
                }}
                onClick={e => {
                  if (!s.divisionId) return
                  handleDivisionSelect(s.divisionId)
                  showTooltipAt(e.clientX, e.clientY, s.name, s.divisionId)
                }}
                onKeyDown={e => {
                  if ((e.key === 'Enter' || e.key === ' ') && s.divisionId) {
                    e.preventDefault()
                    handleDivisionSelect(s.divisionId)
                  }
                }}
              />
            )
          })}
        </svg>

        {tooltip &&
          (() => {
            const division = scheduleData
              ? divisionById(scheduleData, tooltip.divisionId)
              : undefined
            const points = division
              ? pointsForBreed(division, breed)
              : undefined
            if (!points) return null
            return (
              <div
                className="ps-tooltip"
                style={{
                  left: tooltip.x,
                  top: tooltip.y,
                  transform:
                    tooltip.placement === 'below'
                      ? `translate(-50%, ${TOOLTIP_GAP}px)`
                      : `translate(-50%, calc(-100% - ${TOOLTIP_GAP}px))`,
                }}
                role="status"
              >
                <div className="ps-tooltip-title">
                  {tooltip.stateName} · Division {tooltip.divisionId}
                </div>
                <div className="ps-tooltip-row">
                  <span>3-point major needs</span>
                </div>
                <div className="ps-tooltip-values">
                  <span className={sex === 'dogs' ? 'ps-tooltip-active' : ''}>
                    Dogs: <strong>{points.dogs.threePoint}</strong>
                  </span>
                  <span
                    className={sex === 'bitches' ? 'ps-tooltip-active' : ''}
                  >
                    Bitches: <strong>{points.bitches.threePoint}</strong>
                  </span>
                </div>
              </div>
            )
          })()}

        <div className="ps-legend">
          <span className="ps-legend-label">{min} needed</span>
          <span
            className="ps-legend-bar"
            style={{
              background: `linear-gradient(to right, ${sequentialRed(
                0,
                'light',
              )}, ${sequentialRed(1, 'light')})`,
            }}
            aria-hidden="true"
          />
          <span className="ps-legend-label">{max} needed</span>
        </div>
        <p className="ps-legend-caption">
          Color shows {sex} needed for a 3-point major, by division, for{' '}
          {displayBreed}. Darker means more dogs to beat.
        </p>
      </div>

      <button
        type="button"
        className={
          'ps-division-12-chip' +
          (selectedDivisionId === 12 ? ' ps-state-selected' : '')
        }
        onClick={() => handleDivisionSelect(12)}
      >
        Division 12 — Puerto Rico &amp; Mexico (not on map above)
      </button>

      {selectedDivision && selectedDivisionPoints && (
        <div className="ps-detail" aria-live="polite">
          <h3>
            Division {selectedDivision.id}
            <span className="ps-detail-states">
              {' '}
              — {selectedDivision.states
                .map(s => STATE_ABBREVIATIONS[s] ?? s)
                .join(', ')}
            </span>
          </h3>
          <p className="ps-detail-breed">{displayBreed}</p>
          <table className="ps-detail-table">
            <caption className="ps-visually-hidden">
              Points needed for majors in Division {selectedDivision.id} for{' '}
              {displayBreed}
            </caption>
            <thead>
              <tr>
                <th scope="col">Points</th>
                <th scope="col">Dogs</th>
                <th scope="col">Bitches</th>
              </tr>
            </thead>
            <tbody>
              {POINT_ROWS.map(row => {
                const isMajor = (MAJOR_POINT_KEYS as readonly string[]).includes(
                  row.key,
                )
                return (
                  <tr key={row.key} className={isMajor ? 'ps-major-row' : ''}>
                    <th scope="row">
                      {row.label}
                      {isMajor && <span className="ps-major-tag">Major</span>}
                    </th>
                    <td>{selectedDivisionPoints.dogs[row.key]}</td>
                    <td>{selectedDivisionPoints.bitches[row.key]}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {renderFullTable && fullTableDivisions && (
        <section style={{ marginTop: '2.5rem' }}>
          <h2 className="section-title">
            Full {displayBreed} schedule, all divisions
          </h2>
          {fullTableFact && (
            <p className="ps-breed-byline">
              {fullTableFact.recognitionYear && (
                <>AKC recognized in {fullTableFact.recognitionYear}. </>
              )}
              {fullTableFact.description}
            </p>
          )}
          <div style={{ overflowX: 'auto' }}>
            <table className="ps-full-table">
              <caption className="ps-visually-hidden">
                2026 AKC {displayBreed} point schedule, points needed for a
                major by division, dogs and bitches
              </caption>
              <thead>
                <tr>
                  <th scope="col" rowSpan={2}>
                    Division
                  </th>
                  <th scope="col" rowSpan={2}>
                    States
                  </th>
                  <th scope="col" colSpan={5}>
                    Dogs
                  </th>
                  <th scope="col" colSpan={5}>
                    Bitches
                  </th>
                </tr>
                <tr>
                  {POINT_ROWS.map(row => (
                    <th scope="col" key={`dogs-${row.key}`}>
                      {row.label}
                    </th>
                  ))}
                  {POINT_ROWS.map(row => (
                    <th scope="col" key={`bitches-${row.key}`}>
                      {row.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fullTableDivisions.map(division => {
                  const points = division.points
                  if (!points) return null
                  return (
                    <tr key={division.id}>
                      <th scope="row">{division.id}</th>
                      <td>
                        {division.states
                          .map(s => STATE_ABBREVIATIONS[s] ?? s)
                          .join(', ')}
                      </td>
                      {POINT_ROWS.map(row => (
                        <td
                          key={`dogs-${row.key}`}
                          className={
                            (MAJOR_POINT_KEYS as readonly string[]).includes(
                              row.key,
                            )
                              ? 'ps-major-cell'
                              : ''
                          }
                        >
                          {points.dogs[row.key]}
                        </td>
                      ))}
                      {POINT_ROWS.map(row => (
                        <td
                          key={`bitches-${row.key}`}
                          className={
                            (MAJOR_POINT_KEYS as readonly string[]).includes(
                              row.key,
                            )
                              ? 'ps-major-cell'
                              : ''
                          }
                        >
                          {points.bitches[row.key]}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="ps-legend-caption">
            Bold columns (3, 4, 5 pt) are majors.
          </p>
        </section>
      )}
    </div>
  )
}
