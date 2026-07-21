import { useEffect, useMemo, useRef, useState } from 'react'
import { geoPath } from 'd3'
import { feature } from 'topojson-client'
import type { Topology, GeometryCollection } from 'topojson-specification'
import { STATE_ABBREVIATIONS } from '../../lib/pointSchedule2026'
import { sequentialRed } from '../../lib/sequentialColor'

export interface DivisionSummary {
  id: number
  /** Full state names within this division that this tool actually tracks shows for. */
  trackedStates: string[]
  /** Full state names in the AKC's division (may include states this tool doesn't track). */
  allStates: string[]
  /** Shows still open for entry — this is what drives the map color, since that's what's actionable. */
  openCount: number
  /** Shows whose entries have already closed — shown for context, hidden from the list by default. */
  closedCount: number
}

interface RawEventForCounting {
  divisionId: number | null
  closingDate: string | null
}

interface DogShowsMapProps {
  /** Build-time counts — used only for the very first paint, before the mount effect recomputes against the visitor's actual current date. */
  divisions: DivisionSummary[]
  /** Per-event division + closing date, for recomputing open/closed counts against "now" rather than whenever the data was last fetched. */
  rawEvents: RawEventForCounting[]
  initialSelectedDivisionId?: number | null
}

interface RawStateShape {
  name: string
  path: string
}

interface TooltipState {
  x: number
  y: number
  stateName: string
  divisionId: number
  placement: 'above' | 'below'
}

const TOOLTIP_WIDTH = 220
const TOOLTIP_HEIGHT = 90
const TOOLTIP_GAP = 12
const DIVISION_CHANGE_EVENT = 'ds:division-change'

export default function DogShowsMap({
  divisions: initialDivisions,
  rawEvents,
  initialSelectedDivisionId = null,
}: DogShowsMapProps) {
  const [divisions, setDivisions] =
    useState<DivisionSummary[]>(initialDivisions)
  const [rawStates, setRawStates] = useState<RawStateShape[] | null>(null)
  const [viewBox, setViewBox] = useState('0 0 975 610')
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const [hoveredDivisionId, setHoveredDivisionId] = useState<number | null>(
    null,
  )
  const [selectedDivisionId, setSelectedDivisionId] = useState<number | null>(
    initialSelectedDivisionId,
  )
  const mapWrapRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)

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

  // The fetched data can be days or weeks old (refreshed manually now, not
  // on a schedule) — recompute open/closed against the visitor's actual
  // current date every time the page loads, rather than trusting whatever
  // was true when the data was last pulled. Runs once against the rawEvents
  // snapshot passed in as props; nothing here needs to react to updates.
  useEffect(() => {
    const todayStr = new Date().toISOString().slice(0, 10)
    const counts = new Map<number, { open: number; closed: number }>()
    for (const event of rawEvents) {
      if (event.divisionId === null) continue
      const entry = counts.get(event.divisionId) ?? { open: 0, closed: 0 }
      const isClosed =
        event.closingDate !== null && event.closingDate < todayStr
      if (isClosed) entry.closed += 1
      else entry.open += 1
      counts.set(event.divisionId, entry)
    }
    setDivisions(prev =>
      prev.map(division => {
        const counted = counts.get(division.id)
        return counted
          ? {
              ...division,
              openCount: counted.open,
              closedCount: counted.closed,
            }
          : division
      }),
    )
  }, [])

  const stateDivisionId = useMemo(() => {
    const map = new Map<string, number>()
    divisions.forEach(division => {
      division.trackedStates.forEach(state => map.set(state, division.id))
    })
    return map
  }, [divisions])

  const divisionById = useMemo(
    () => new Map(divisions.map(d => [d.id, d])),
    [divisions],
  )

  const maxCount = useMemo(
    () => Math.max(1, ...divisions.map(d => d.openCount)),
    [divisions],
  )

  const colorForDivision = (divisionId: number | null) => {
    if (divisionId === null) return 'var(--ps-water)'
    const division = divisionById.get(divisionId)
    if (!division) return 'var(--ps-water)'
    const t = division.openCount / maxCount
    return sequentialRed(t, 'light')
  }

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

  const selectDivision = (id: number | null) => {
    setSelectedDivisionId(prev => (prev === id ? null : id))
  }

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent(DIVISION_CHANGE_EVENT, {
        detail: { id: selectedDivisionId },
      }),
    )
    // Don't scroll on the initial paint — only when the visitor actively
    // changes the selection (the default division shouldn't yank the page).
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (selectedDivisionId !== null) {
      document
        .getElementById('ds-results')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [selectedDivisionId])

  const states = rawStates?.map(s => ({
    ...s,
    divisionId: stateDivisionId.get(s.name) ?? null,
  }))

  return (
    <div className="ps-root">
      <div className="ps-map-wrap" ref={mapWrapRef}>
        {!rawStates && <p className="ps-map-loading">Loading map…</p>}
        <svg
          viewBox={viewBox}
          className="ps-map"
          role="img"
          aria-label="Map of tracked states, colored by how many Great Dane shows are still open for entry in each AKC division. Hover, focus, or tap a state to see its division's open and closed entry counts; click or tap to filter the list below to that division."
          onClick={e => {
            if (e.target === e.currentTarget) setTooltip(null)
          }}
        >
          {states?.map(s => {
            const isSelected = s.divisionId === selectedDivisionId
            const isHovered = s.divisionId === hoveredDivisionId
            const division = s.divisionId
              ? divisionById.get(s.divisionId)
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
                  s.divisionId && division
                    ? `${s.name}: Division ${s.divisionId}, ${division.openCount} show${division.openCount === 1 ? '' : 's'} open for entry, ${division.closedCount} closed`
                    : undefined
                }
                onMouseEnter={e => {
                  setHoveredDivisionId(s.divisionId)
                  if (s.divisionId)
                    showTooltipAt(e.clientX, e.clientY, s.name, s.divisionId)
                }}
                onMouseMove={e => {
                  if (s.divisionId)
                    showTooltipAt(e.clientX, e.clientY, s.name, s.divisionId)
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
                  selectDivision(s.divisionId)
                  showTooltipAt(e.clientX, e.clientY, s.name, s.divisionId)
                }}
                onKeyDown={e => {
                  if ((e.key === 'Enter' || e.key === ' ') && s.divisionId) {
                    e.preventDefault()
                    selectDivision(s.divisionId)
                  }
                }}
              />
            )
          })}
        </svg>

        {tooltip &&
          (() => {
            const division = divisionById.get(tooltip.divisionId)
            if (!division) return null
            const isPartial =
              division.allStates.length > division.trackedStates.length
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
                  Entries open: <strong>{division.openCount}</strong>
                </div>
                <div className="ps-tooltip-row">
                  Entries closed: <strong>{division.closedCount}</strong>
                  {isPartial ? ' (tracked states only)' : ''}
                </div>
                <div className="ps-tooltip-row">
                  Click to filter the list below
                </div>
              </div>
            )
          })()}

        <div className="ps-legend">
          <span className="ps-legend-label">0 open</span>
          <span
            className="ps-legend-bar"
            style={{
              background: `linear-gradient(to right, ${sequentialRed(0, 'light')}, ${sequentialRed(1, 'light')})`,
            }}
            aria-hidden="true"
          />
          <span className="ps-legend-label">{maxCount} open</span>
        </div>
        <p className="ps-legend-caption">
          Color shows how many shows in each division are still open for entry.
          Darker means more shows you can still enter.
        </p>
      </div>

      <div
        className="ps-controls"
        role="group"
        aria-label="Filter by division"
        style={{ marginTop: '1rem' }}
      >
        <button
          type="button"
          className="ps-toggle"
          aria-pressed={selectedDivisionId === null}
          onClick={() => setSelectedDivisionId(null)}
        >
          All divisions
        </button>
        {divisions.map(division => (
          <button
            key={division.id}
            type="button"
            className="ps-toggle"
            aria-pressed={selectedDivisionId === division.id}
            onClick={() => selectDivision(division.id)}
          >
            Division {division.id} ({division.openCount})
          </button>
        ))}
      </div>

      {selectedDivisionId !== null &&
        (() => {
          const division = divisionById.get(selectedDivisionId)
          if (!division) return null
          return (
            <p className="ds-division-note" aria-live="polite">
              Showing Division {division.id} —{' '}
              {division.trackedStates
                .map(s => STATE_ABBREVIATIONS[s] ?? s)
                .join(', ')}
              {division.allStates.length > division.trackedStates.length && (
                <>
                  {' '}
                  (this division also covers{' '}
                  {division.allStates
                    .filter(s => !division.trackedStates.includes(s))
                    .map(s => STATE_ABBREVIATIONS[s] ?? s)
                    .join(', ')}
                  , not tracked here)
                </>
              )}
              .
            </p>
          )
        })()}
    </div>
  )
}
