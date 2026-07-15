import { useEffect, useMemo, useRef, useState } from 'react'

export interface ChromosomeInfo {
  chr: string
  lengthBp: number
}

export interface GeneAnnotation {
  chr: string
  start: number
  stop: number
  name: string
  category: string
}

interface GenomeIdeogramProps {
  chromosomes: ChromosomeInfo[]
  annotations: GeneAnnotation[]
  selectedGene?: string
  activeCategory?: string
  onSelectGene: (gene: string) => void
}

const BAR_HEIGHT = 10
const LABEL_WIDTH = 34
const COUNT_WIDTH = 26
const COLUMN_GAP = 28
const LANE_GAP = 7
const MIN_MARKER_GAP = 6

function assignLanes(sorted: GeneAnnotation[], pxPerBp: number) {
  const lastPxByLane: number[] = []
  return sorted.map(annotation => {
    const pos = ((annotation.start + annotation.stop) / 2) * pxPerBp
    let lane = 0
    while (
      lastPxByLane[lane] !== undefined &&
      pos - lastPxByLane[lane] < MIN_MARKER_GAP
    ) {
      lane++
    }
    lastPxByLane[lane] = pos
    return lane
  })
}

function laneOffset(lane: number) {
  if (lane === 0) return 0
  const level = Math.ceil(lane / 2)
  const sign = lane % 2 === 1 ? -1 : 1
  return sign * level * LANE_GAP
}

interface TooltipState {
  annotation: GeneAnnotation
  x: number
  y: number
}

interface ChromosomeRowProps {
  chromInfo: ChromosomeInfo
  annotations: GeneAnnotation[]
  pxPerBp: number
  trackWidth: number
  selectedGene?: string
  activeCategory?: string
  onSelectGene: (gene: string) => void
  onHover: (state: TooltipState | null) => void
}

function ChromosomeRow({
  chromInfo,
  annotations,
  pxPerBp,
  trackWidth,
  selectedGene,
  activeCategory,
  onSelectGene,
  onHover,
}: ChromosomeRowProps) {
  const lanes = useMemo(
    () => assignLanes(annotations, pxPerBp),
    [annotations, pxPerBp],
  )
  const maxLane = lanes.length ? Math.max(...lanes) : 0
  const topPad = Math.ceil(maxLane / 2) * LANE_GAP + 5
  const bottomPad = Math.floor(maxLane / 2) * LANE_GAP + 5
  const svgHeight = BAR_HEIGHT + topPad + bottomPad
  const barWidth = Math.max(chromInfo.lengthBp * pxPerBp, 2)

  return (
    <div className="genome-chr-row">
      <span className="genome-chr-label">{chromInfo.chr}</span>
      <svg
        className="genome-chr-track"
        width={trackWidth}
        height={svgHeight}
        viewBox={`0 0 ${trackWidth} ${svgHeight}`}
      >
        <rect
          x={0}
          y={topPad}
          width={barWidth}
          height={BAR_HEIGHT}
          rx={BAR_HEIGHT / 2}
          className="genome-chr-bar"
        />
        {annotations.map((annotation, idx) => {
          const pos = ((annotation.start + annotation.stop) / 2) * pxPerBp
          const offset = laneOffset(lanes[idx])
          const barCenterY = topPad + BAR_HEIGHT / 2
          const cy = barCenterY + offset
          const isSelected = annotation.name === selectedGene
          const isDimmed =
            !!activeCategory &&
            activeCategory !== 'all' &&
            annotation.category !== activeCategory

          return (
            <g
              key={annotation.name}
              className={
                'genome-marker' +
                (isSelected ? ' genome-marker-selected' : '') +
                (isDimmed ? ' genome-marker-dimmed' : '')
              }
              onClick={() => onSelectGene(annotation.name)}
              onMouseEnter={evt =>
                onHover({ annotation, x: evt.clientX, y: evt.clientY })
              }
              onMouseLeave={() => onHover(null)}
            >
              <title>{annotation.name}</title>
              {offset !== 0 ? (
                <line
                  x1={pos}
                  x2={pos}
                  y1={barCenterY}
                  y2={cy}
                  className="genome-marker-leader"
                />
              ) : null}
              <circle
                cx={pos}
                cy={cy}
                r={isSelected ? 5 : 3.5}
                className="genome-marker-dot"
              />
            </g>
          )
        })}
      </svg>
      <span className="genome-chr-count">
        {annotations.length || ''}
      </span>
    </div>
  )
}

export default function GenomeIdeogram({
  chromosomes,
  annotations,
  selectedGene,
  activeCategory,
  onSelectGene,
}: GenomeIdeogramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(900)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    if (el.clientWidth) setContainerWidth(el.clientWidth)
    const observer = new ResizeObserver(entries => {
      const width = entries[0]?.contentRect.width
      if (width) setContainerWidth(width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const columnCount = containerWidth < 640 ? 1 : 2
  const columnWidth =
    (containerWidth - COLUMN_GAP * (columnCount - 1)) / columnCount
  const trackWidth = Math.max(columnWidth - LABEL_WIDTH - COUNT_WIDTH, 60)

  const maxLengthBp = useMemo(
    () => Math.max(...chromosomes.map(c => c.lengthBp), 1),
    [chromosomes],
  )
  const pxPerBp = trackWidth / maxLengthBp

  const annotationsByChr = useMemo(() => {
    const map = new Map<string, GeneAnnotation[]>()
    for (const annotation of annotations) {
      const list = map.get(annotation.chr) ?? []
      list.push(annotation)
      map.set(annotation.chr, list)
    }
    for (const list of map.values()) list.sort((a, b) => a.start - b.start)
    return map
  }, [annotations])

  const columnSize = Math.ceil(chromosomes.length / columnCount)
  const columnsOfChromosomes = Array.from({ length: columnCount }, (_, i) =>
    chromosomes.slice(i * columnSize, (i + 1) * columnSize),
  )

  return (
    <div className="genome-ideogram" ref={containerRef}>
      <div className="genome-ideogram-columns">
        {columnsOfChromosomes.map((column, columnIdx) => (
          <div className="genome-ideogram-column" key={columnIdx}>
            {column.map(chromInfo => (
              <ChromosomeRow
                key={chromInfo.chr}
                chromInfo={chromInfo}
                annotations={annotationsByChr.get(chromInfo.chr) ?? []}
                pxPerBp={pxPerBp}
                trackWidth={trackWidth}
                selectedGene={selectedGene}
                activeCategory={activeCategory}
                onSelectGene={onSelectGene}
                onHover={setTooltip}
              />
            ))}
          </div>
        ))}
      </div>
      {tooltip ? (
        <div
          className="genome-tooltip"
          style={{ left: tooltip.x + 14, top: tooltip.y + 14 }}
        >
          <strong>{tooltip.annotation.name}</strong>
          <div className="genome-tooltip-category">
            {tooltip.annotation.category}
          </div>
          <div className="genome-tooltip-location">
            chr{tooltip.annotation.chr}:
            {tooltip.annotation.start.toLocaleString()}-
            {tooltip.annotation.stop.toLocaleString()}
          </div>
        </div>
      ) : null}
    </div>
  )
}
