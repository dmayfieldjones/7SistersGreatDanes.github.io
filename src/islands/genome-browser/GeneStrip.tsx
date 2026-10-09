// A static, readable alternative to the live browser for stories that are
// about one or two places in the genome: a ruler, the gene(s) drawn to scale,
// optional marked variants or spans, and optional one-row-per-dog calls.
// No tracks, no fetching: everything is passed in.

export interface StripGene {
  name: string
  start: number
  stop: number
}

export interface StripMarker {
  pos: number
  label: string
  note?: string
}

export interface StripSpan {
  start: number
  stop: number
  label: string
}

export interface StripRow {
  label: string
  // 'yes' = the feature was called; 'none' = no call (not the same as
  // "absent"; long-read callers leave a dog uncalled when they can't tell).
  state: 'yes' | 'none'
  // A heading drawn above this row (set it on the first row of each group).
  group?: string
}

export interface GeneStripProps {
  title?: string
  chr: string
  start: number
  stop: number
  genes: StripGene[]
  markers?: StripMarker[]
  span?: StripSpan
  rows?: StripRow[]
  rowsNote?: string
  caption?: string
}

const WIDTH = 720
const LABEL_W = 170
const PAD_R = 16
const TRACK_W = WIDTH - LABEL_W - PAD_R

function formatBp(bp: number) {
  return bp >= 1e6
    ? `${(bp / 1e6).toFixed(2)} Mb`
    : `${(bp / 1e3).toFixed(0)} kb`
}

export default function GeneStrip({
  title,
  chr,
  start,
  stop,
  genes,
  markers = [],
  span,
  rows = [],
  rowsNote,
  caption,
}: GeneStripProps) {
  const x = (bp: number) =>
    LABEL_W +
    ((Math.min(Math.max(bp, start), stop) - start) / (stop - start)) * TRACK_W

  const rulerY = 24
  const geneY = 58
  const markerY = geneY + 30
  const rowsTop = markers.length ? markerY + 24 : span ? geneY + 30 : geneY + 36
  const rowH = 18
  const groupH = 20
  // Each row's top edge, with extra room above rows that start a group.
  const rowYs: number[] = []
  let cursor = rowsTop
  for (const row of rows) {
    if (row.group) cursor += groupH
    rowYs.push(cursor)
    cursor += rowH
  }
  const height = rows.length
    ? cursor + 12
    : markers.length
      ? markerY + 20
      : geneY + 34

  return (
    <figure className="gene-strip">
      {title ? (
        <figcaption className="gene-strip-title">{title}</figcaption>
      ) : null}
      <svg
        viewBox={`0 0 ${WIDTH} ${height}`}
        role="img"
        aria-label={`${title ?? 'Gene'} on ${chr}: ${genes.map(g => g.name).join(', ')}`}
      >
        <text x={LABEL_W} y={12} className="gene-strip-axis-label">
          {chr} · {formatBp(stop - start)} window
        </text>
        <line
          x1={LABEL_W}
          x2={LABEL_W + TRACK_W}
          y1={rulerY}
          y2={rulerY}
          className="gene-strip-ruler"
        />
        {[0, 0.25, 0.5, 0.75, 1].map(t => (
          <g key={t}>
            <line
              x1={LABEL_W + t * TRACK_W}
              x2={LABEL_W + t * TRACK_W}
              y1={rulerY - 3}
              y2={rulerY + 3}
              className="gene-strip-ruler"
            />
          </g>
        ))}

        {span ? (
          <g>
            <title>{span.label}</title>
            <rect
              x={x(span.start)}
              y={geneY - 16}
              width={x(span.stop) - x(span.start)}
              height={4}
              rx={2}
              className="gene-strip-span"
            />
            <text
              x={(x(span.start) + x(span.stop)) / 2}
              y={geneY - 20}
              textAnchor="middle"
              className="gene-strip-span-label"
            >
              {span.label}
            </text>
          </g>
        ) : null}

        {genes.map(gene => (
          <g key={gene.name}>
            <title>
              {gene.name}: {gene.start.toLocaleString()}–
              {gene.stop.toLocaleString()}
            </title>
            <rect
              x={x(gene.start)}
              y={geneY - 7}
              width={Math.max(x(gene.stop) - x(gene.start), 2)}
              height={14}
              rx={3}
              className="gene-strip-gene"
            />
            <text
              x={x(gene.start)}
              y={geneY + 22}
              className="gene-strip-gene-label"
            >
              {gene.name}
            </text>
          </g>
        ))}

        {markers.map(marker => (
          <g key={marker.label}>
            <title>{marker.note ?? marker.label}</title>
            <line
              x1={x(marker.pos)}
              x2={x(marker.pos)}
              y1={geneY - 12}
              y2={markerY + 4}
              className="gene-strip-marker-line"
            />
            <circle
              cx={x(marker.pos)}
              cy={geneY - 12}
              r={4}
              className="gene-strip-marker"
            />
            <text
              x={Math.min(x(marker.pos) + 6, WIDTH - PAD_R)}
              y={markerY + 12}
              className="gene-strip-marker-label"
            >
              {marker.label}
            </text>
          </g>
        ))}

        {rows.map((row, i) => {
          const y = rowYs[i]
          return (
            <g key={row.label}>
              {row.group ? (
                <text
                  x={8}
                  y={y - 6}
                  className="gene-strip-group-label"
                >
                  {row.group}
                </text>
              ) : null}
              <text
                x={LABEL_W - 8}
                y={y + 12}
                textAnchor="end"
                className="gene-strip-row-label"
              >
                {row.label}
              </text>
              <line
                x1={LABEL_W}
                x2={LABEL_W + TRACK_W}
                y1={y + 8}
                y2={y + 8}
                className={
                  row.state === 'none'
                    ? 'gene-strip-row-base gene-strip-row-uncalled'
                    : 'gene-strip-row-base'
                }
              />
              {row.state === 'yes' && span ? (
                <rect
                  x={x(span.start)}
                  y={y + 3}
                  width={x(span.stop) - x(span.start)}
                  height={10}
                  rx={2}
                  className="gene-strip-row-hit"
                >
                  <title>
                    {row.label}: {span.label}
                  </title>
                </rect>
              ) : null}
            </g>
          )
        })}
      </svg>
      {rowsNote ? <p className="gene-strip-note">{rowsNote}</p> : null}
      {caption ? <p className="gene-strip-caption">{caption}</p> : null}
    </figure>
  )
}
