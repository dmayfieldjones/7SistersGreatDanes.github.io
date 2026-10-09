import '../../styles/aging-story.css'

import lineMethylation from './lineMethylation.json'
import promoterGroups from './promoterGroups.json'

// Colors match the live browser's track colors: blue = smaller dogs, red =
// larger dogs. Both pass the dataviz palette validator (light surface,
// CVD ΔE ≥ 21). Everything else is neutral ink.
const SMALL = '#1d6fa5'
const LARGE = '#bf141c'
const INK = '#1a1a1a'
const MUTED = '#666'
const GRID = 'rgba(0, 0, 0, 0.12)'
const OTHER = '#d8d3cc'

// Step 1 figures are from the paper itself (Mariner, McCoy et al., Science
// 2026): hazard ratio 1.15 per year of residual epigenetic age; the clock
// predicts age with a median error of 0.82 years.
const RISK_PER_YEAR = 15

function Step({
  number,
  headline,
  hero,
  heroLabel,
  children,
  note,
}: {
  number: number
  headline: string
  hero: string
  heroLabel: string
  children: React.ReactNode
  note: string
}) {
  return (
    <section className="aging-step">
      <h3 className="aging-step-headline">
        <span className="aging-step-number">{number}</span>
        {headline}
      </h3>
      <div className="aging-step-body">
        <div className="aging-hero">
          <div className="aging-hero-number">{hero}</div>
          <div className="aging-hero-label">{heroLabel}</div>
        </div>
        <div className="aging-visual">{children}</div>
      </div>
      <p className="aging-step-note">{note}</p>
    </section>
  )
}

// A schematic, not data: shows what "ahead of its age" means.
function ClockSchematic() {
  return (
    <svg
      viewBox="0 0 200 130"
      role="img"
      aria-label="Schematic: a dog whose DNA clock reads older than its real age sits above the diagonal line"
    >
      <line x1="30" y1="110" x2="190" y2="110" stroke={GRID} />
      <line x1="30" y1="110" x2="30" y2="10" stroke={GRID} />
      <line
        x1="30"
        y1="110"
        x2="180"
        y2="20"
        stroke={MUTED}
        strokeWidth="2"
        strokeDasharray="5 4"
      />
      <text x="188" y="92" fontSize="9" fill={MUTED} textAnchor="end">
        clock matches real age
      </text>
      <line x1="100" y1="49" x2="100" y2="76" stroke={INK} strokeWidth="2" />
      <circle cx="100" cy="49" r="5" fill={LARGE} stroke="#fff" strokeWidth="2">
        <title>Clock ahead of real age</title>
      </circle>
      <circle cx="100" cy="76" r="3.5" fill={MUTED} />
      <text x="108" y="46" fontSize="10" fill={INK} fontWeight="600">
        clock runs ahead
      </text>
      <text x="108" y="58" fontSize="9" fill={MUTED}>
        higher risk of death
      </text>
      <text x="110" y="124" fontSize="9" fill={MUTED} textAnchor="middle">
        real age
      </text>
      <text
        x="12"
        y="60"
        fontSize="9"
        fill={MUTED}
        transform="rotate(-90 12 60)"
        textAnchor="middle"
      >
        age the DNA reads
      </text>
    </svg>
  )
}

// 100 squares: the share of jumping-gene sites that lose tags faster in
// larger dogs, filled in the accent color, the rest neutral (emphasis form).
function SiteGrid({ percent }: { percent: number }) {
  return (
    <svg
      viewBox="0 0 122 122"
      className="aging-grid"
      role="img"
      aria-label={`${percent} of every 100 jumping-gene sites lose methylation faster in larger dogs`}
    >
      {Array.from({ length: 100 }, (_, index) => {
        const faster = index < percent
        return (
          <rect
            key={index}
            x={(index % 10) * 12 + 1}
            y={Math.floor(index / 10) * 12 + 1}
            width="10"
            height="10"
            rx="2"
            fill={faster ? LARGE : OTHER}
          >
            <title>
              {faster
                ? 'Loses tags faster in larger dogs'
                : 'Same or slower in larger dogs'}
            </title>
          </rect>
        )
      })}
    </svg>
  )
}

function SpeedBars({ small, large }: { small: number; large: number }) {
  const max = 0.45
  const rows = [
    { label: 'Smaller dogs', value: small, color: SMALL },
    { label: 'Larger dogs', value: large, color: LARGE },
  ]
  return (
    <svg
      viewBox="0 0 260 70"
      className="aging-bars"
      role="img"
      aria-label={`The typical site loses ${small.toFixed(2)} points of methylation a year in smaller dogs and ${large.toFixed(2)} in larger dogs`}
    >
      {rows.map(({ label, value, color }, index) => {
        const y = 8 + index * 30
        const width = (value / max) * 150
        return (
          <g key={label}>
            <text x="0" y={y + 14} fontSize="11" fill={INK}>
              {label}
            </text>
            <path
              d={`M84 ${y} h${width - 4} a4 4 0 0 1 4 4 v14 a4 4 0 0 1 -4 4 h${-(width - 4)} z`}
              fill={color}
            >
              <title>
                {label}: {value.toFixed(2)} points lost per year
              </title>
            </path>
            <text
              x={84 + width + 6}
              y={y + 15}
              fontSize="12"
              fontWeight="600"
              fill={INK}
            >
              {value.toFixed(2)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

const DUMBBELL_MAX = 20
const dumbbellX = (value: number) => 70 + (value / DUMBBELL_MAX) * 200

// Before -> after per gene: share of DNA copies carrying the tag at the
// gene's on/off switch, in dogs under 3 vs dogs 8 and older.
function PartnerDumbbell() {
  return (
    <svg
      viewBox="0 0 380 170"
      className="aging-dumbbell"
      role="img"
      aria-label="Methylation at the FOXE1, GATA4 and IGF1 promoters in young and older dogs: FOXE1 and GATA4 rise, IGF1 barely moves"
    >
      {[0, 5, 10, 15, 20].map(tick => (
        <g key={tick}>
          <line
            x1={dumbbellX(tick)}
            x2={dumbbellX(tick)}
            y1="14"
            y2="124"
            stroke={GRID}
          />
          <text
            x={dumbbellX(tick)}
            y="138"
            fontSize="9"
            fill={MUTED}
            textAnchor="middle"
          >
            {tick}%
          </text>
        </g>
      ))}
      <text x="170" y="154" fontSize="9" fill={MUTED} textAnchor="middle">
        share of DNA copies carrying the tag
      </text>
      {promoterGroups.map((row, index) => {
        const y = 36 + index * 38
        const change = row.old - row.young
        const flat = Math.abs(change) < 0.6
        return (
          <g key={row.gene}>
            <text
              x="62"
              y={y + 4}
              fontSize="12"
              fontWeight="600"
              fill={INK}
              textAnchor="end"
            >
              {row.gene}
            </text>
            <line
              x1={dumbbellX(row.young)}
              x2={dumbbellX(row.old)}
              y1={y}
              y2={y}
              stroke={MUTED}
              strokeWidth="2"
            />
            <circle
              cx={dumbbellX(row.young)}
              cy={y}
              r="5"
              fill="#9a9a9a"
              stroke="#fff"
              strokeWidth="2"
            >
              <title>
                {row.gene}, dogs under 3: {row.young}% methylated
              </title>
            </circle>
            <circle
              cx={dumbbellX(row.old)}
              cy={y}
              r="5"
              fill={INK}
              stroke="#fff"
              strokeWidth="2"
            >
              <title>
                {row.gene}, dogs 8 and older: {row.old}% methylated
              </title>
            </circle>
            <text
              x={dumbbellX(Math.max(row.old, row.young)) + 12}
              y={y + 4}
              fontSize="11"
              fill={INK}
              fontWeight={flat ? 400 : 600}
            >
              {flat ? 'barely moves' : `+${change.toFixed(1)} points`}
            </text>
          </g>
        )
      })}
      <g transform="translate(70 4)" fontSize="9" fill={MUTED}>
        <circle cx="4" cy="0" r="4" fill="#9a9a9a" />
        <text x="12" y="3">
          dogs under 3
        </text>
        <circle cx="86" cy="0" r="4" fill={INK} />
        <text x="94" y="3">
          dogs 8 and older
        </text>
      </g>
    </svg>
  )
}

export default function AgingStory() {
  const { all } = lineMethylation
  const faster = Math.round((all.large / all.small - 1) * 100)
  return (
    <div className="aging-story">
      <Step
        number={1}
        headline="A dog's DNA carries a clock."
        hero={`+${RISK_PER_YEAR}%`}
        heroLabel="higher risk of death for every year a dog's clock runs ahead of its real age"
        note="The Dog Aging Project read chemical tags (methylation) on DNA from 894 pet dogs. The clock predicts a dog's age to within about a year. Picture is a schematic."
      >
        <ClockSchematic />
      </Step>
      <Step
        number={2}
        headline="In big dogs, the clock runs faster at the jumping genes."
        hero={`${all.steeperPct} of 100`}
        heroLabel={`jumping-gene sites lose tags faster in larger dogs (of ${all.sites.toLocaleString()} sites checked)`}
        note={`Jumping genes (transposons) lose tags as dogs age, which can wake them up. The typical site loses ${all.large.toFixed(2)} points a year in larger dogs against ${all.small.toFixed(2)} in smaller dogs, about ${faster}% faster; the paper reports 31%. Our re-analysis of the study's public data.`}
      >
        <div className="aging-pair">
          <SiteGrid percent={all.steeperPct} />
          <div>
            <div className="aging-mini-title">
              Typical methylation lost per year (points)
            </div>
            <SpeedBars small={all.small} large={all.large} />
          </div>
        </div>
      </Step>
      <Step
        number={3}
        headline="The size gene's partners age with the dog. The size gene itself doesn't."
        hero="2 of 3"
        heroLabel="genes in the IGF1 pathway gain tags with age; IGF1 itself stays put"
        note="IGF1 is the main body-size gene. FOXE1 and GATA4 work with it, and the paper links them to size and age. We measured methylation at each gene's on/off switch (promoter) in dogs under 3 and dogs 8 and older. Our re-analysis of the study's public data."
      >
        <PartnerDumbbell />
      </Step>
      <details className="aging-numbers">
        <summary>Show the numbers</summary>
        <table>
          <tbody>
            <tr>
              <th scope="row">Sites checked (jumping genes, autosomes)</th>
              <td>{all.sites.toLocaleString()}</td>
            </tr>
            <tr>
              <th scope="row">Share steeper in larger dogs</th>
              <td>{all.steeperPct}%</td>
            </tr>
            <tr>
              <th scope="row">Typical loss per year, smaller / larger dogs</th>
              <td>
                {all.small.toFixed(3)} / {all.large.toFixed(3)} points
              </td>
            </tr>
            {promoterGroups.map(row => (
              <tr key={row.gene}>
                <th scope="row">{row.gene} promoter, under 3 / 8 and older</th>
                <td>
                  {row.young}% / {row.old}% methylated
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  )
}
