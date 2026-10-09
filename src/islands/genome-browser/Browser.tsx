import { lazy, Suspense, useMemo, useRef, useState } from 'react'

import { prefetchDog10kSvVcf } from './dog10kSvSource'
import lineMethylation from './lineMethylation.json'
import promoterMethylation from './promoterMethylation.json'
import GenomeIdeogram, { type ChromosomeInfo } from './GenomeIdeogram'
import type {
  CuratedGeneFeature,
  StoryMarker,
  StoryTrackId,
} from './JBrowseEmbed'

const JBrowseEmbed = lazy(() => import('./JBrowseEmbed'))

const DEFAULT_LOCATION = 'chr18:48,769,443-48,973,311'

interface TourStop {
  label: string
  gene: string
  hook: string
  // A second locus this stop's story genuinely depends on — shown alongside
  // `gene`, not just linked to, since the story doesn't make sense with only
  // one half of it.
  companionGene?: string
  intro?: string
  // Overrides the gene's own catalog coordinates for the live browser's
  // default view — for a story about a variant near, not inside, the gene
  // body (e.g. a duplication whose breakpoints sit outside it).
  location?: string
  // Evidence tracks for the live browser beyond the gene tracks. Only set
  // where that data is actually the story — at other loci it is unrelated
  // noise that suggests a finding that isn't there.
  tracks?: StoryTrackId[]
  // A small explainer drawn above the live browser for stories whose idea is
  // easier to see as a picture than as a genome track.
  diagram?: 'coat' | 'aging'
  // Specific published variants to mark on the browser.
  markers?: StoryMarker[]
  // Several places to look at for one story, switched between with buttons
  // above the browser — for a story that spans more than one gene.
  views?: {
    label: string
    location: string
    note: string
    // Overrides the story's `tracks` while this view is showing.
    tracks?: StoryTrackId[]
  }[]
}

// Three loci with a real, tellable story — each an exact-match `name` from
// categories2.tsv, so a click reuses the same lookup as the search box.
const TOUR_STOPS: TourStop[] = [
  {
    label: 'Coat pattern',
    gene: 'M Locus Merle premelanosome protein (PMEL17/SILV)',
    companionGene: 'H Locus Harlequin proteasome 20S subunit beta 7 (PSMB7)',
    diagram: 'coat',
    tracks: ['coat'],
    markers: [
      {
        // PMEL is on the minus strand; its last exon (exon 11) starts at
        // 644,259 and ends at 644,511, so the intron 10 / exon 11 boundary
        // where the merle SINE sits is at its upper edge. Approximate: placed
        // from the RefSeq gene structure, not a surveyed insertion coordinate.
        refName: 'chr10',
        start: 644500,
        end: 644524,
        name: 'Merle insertion (approx.)',
        description:
          'Merle: a SINE inserted at the boundary of PMEL intron 10 and exon 11 (Clark et al. 2006). Position approximate.',
      },
      {
        // OMIA lists this at canFam3 chr9:58,530,295 (T>G, c.146T>G, p.V49G);
        // lifted to canFam4 with UCSC's canFam3ToCanFam4 chain, where the
        // Dog10K SNP callset also has exactly this T>G.
        refName: 'chr9',
        start: 58614852,
        end: 58614853,
        name: 'Harlequin variant (PSMB7 T>G)',
        description:
          'Harlequin: PSMB7 c.146T>G, p.V49G (Clark et al. 2011), chr9:58,614,853 in canFam4.',
      },
    ],
    hook: 'Why do some Great Danes look like a black-and-white patchwork? It takes two genes stacked on top of each other.',
    intro:
      "This pattern is two genes, not one: merle (below) lays down random patches of diluted pigment on its own — that alone is a recognized Great Dane pattern. Harlequin is what geneticists call a dominant modifier. A modifier does nothing on its own; it only changes how another gene's effect looks, and this one acts only on merle. Dominant means a single copy is enough. With one copy of harlequin stacked on merle, the dilution is stripped back out, leaving solid black patches on white instead of the softer merle mottling. (No dog with two copies has ever been found, which suggests those puppies are lost early in pregnancy.) Breeders ran harlequin programs for a century before anyone knew this: a 1988 study first argued harlequin was a modified merle, and DNA work later found both genes. Merle itself was a disqualifying fault until the AKC accepted it in 2019. Even the size of the merle mutation matters — the longer a repetitive stretch inside it, the stronger the pattern, from 'cryptic' merles that look solid to the longest versions, found in harlequins.",
  },
  {
    label: 'Height',
    gene: 'FGF4',
    tracks: ['fgf4'],
    hook: "Why are Great Danes so tall? It's what they DON'T carry.",
  },
  {
    label: 'Health',
    gene: 'PRKCZ',
    hook: 'The health scare every Great Dane owner knows, found in the genome.',
  },
]

interface MoreStory extends TourStop {
  theme: string
}

// A second, deliberately separate tier: the flagship tour above stays fixed
// at three stops so it never dilutes into a browsable catalog, and this is
// where additional stories go instead as the collection grows — grouped by
// theme rather than appended to one flat, ever-longer list.
const MORE_STORIES: MoreStory[] = [
  {
    theme: 'Origins',
    label: 'The starch gene',
    gene: 'AMY2B',
    hook: 'Why can dogs eat kibble but wolves can barely digest a potato?',
    location: 'chr6:47,370,000-47,398,000',
    tracks: ['sv'],
    intro:
      "Somewhere in this window, most dogs carry a duplication wolves don't have — one of the clearest fingerprints of domestication in the entire genome. Extra copies of this gene meant more of the enzyme that digests starch, letting early dogs thrive on grain and food scraps around human settlements in a way wolves never could. Below, watch the duplication show up in most of the 12 dogs in our structural-variant track, including the Great Dane — but not in the Greenland Wolf sample sitting right next to them.",
  },
  {
    theme: 'Aging',
    label: 'Aging and size',
    gene: 'IGF1',
    diagram: 'aging',
    tracks: ['methylation'],
    views: [
      {
        label: 'Jumping genes (chromosome 1)',
        location: 'chr1',
        tracks: ['lineLoss'],
        note: 'Each bar is one jumping-gene (LINE) site on chromosome 1 that loses methylation with age. Top row: how much it loses per year in smaller dogs. Middle: in larger dogs. Bottom: larger minus smaller, so a bar above zero means larger dogs lose more. Zoom in to read individual sites. Across all autosomes, 72% of sites sit above zero. X chromosome left out: its methylation depends on sex.',
      },
      {
        label: 'FOXE1 promoter',
        location: 'chr11:55,440,000-55,520,000',
        note: 'FOXE1 switches on IGF1-related genes. Its promoter (the 2 kb in front of the gene) is 7.7% methylated in dogs under 3 and 11.2% in dogs 8 and older.',
      },
      {
        label: 'GATA4 promoter',
        location: 'chr25:26,300,000-26,400,000',
        note: 'GATA4 responds to IGF1 signals. Its promoter goes from 14.0% methylated in dogs under 3 to 18.5% in dogs 8 and older.',
      },
      {
        label: 'IGF1 itself',
        location: 'chr15:41,480,000-41,590,000',
        note: 'The size gene itself barely moves: its promoter is 3.4% methylated in young dogs and 3.7% in older dogs. The aging signal is in its neighbors.',
      },
    ],
    hook: 'Giants age on a faster clock. A new study shows how scientists can now measure it, and where to look for why.',
    intro:
      "Size comes with a trade-off: small breeds can live up to twice as long as giant ones. The Dog Aging Project (Mariner, McCoy et al., Science, October 2026) asked whether big dogs simply die earlier or really age faster. They read the chemical tags on DNA, called methylation, in 1,640 blood samples from 894 pet dogs, and built an 'epigenetic clock' that predicts a dog's age to within about a year. Dogs whose clocks ran ahead of their real age were more likely to die: each extra year of epigenetic age came with about a 15% higher risk of death. Larger dogs, and males, aged faster by this clock. The tags that changed most with size were not in genes themselves but in transposons, the 'jumping genes' that make up a large share of the genome. As dogs age these lose their methylation, which can wake them up, and the loss was about 31% steeper in larger dogs, most of all in the youngest, most recently active families of one kind, called LINE-1. Where IGF1 comes in: this gene carries the small-dog variant that is a main driver of body size (Sutter et al., 2007), and the study found that many gene control regions gaining methylation with both age and size sit beside genes tied to IGF1 signaling, such as FOXE1 and GATA4. We checked the public data and plotted it in the browser track below: the FOXE1 and GATA4 promoters do gain methylation with age, while IGF1's own promoter stays almost entirely unmethylated and barely changes. So IGF1 is a signpost to the pathway, not the place the aging shows up, and the study did not test IGF1 variants. Use the buttons above the browser to switch between the three genes; only the sites this kind of sequencing happened to cover have bars, so the track is sparse. The authors say their transposon model is still speculative: they measured methylation, not transposon activity.",
  },
]

// The 12 long-read dog genomes in the Dog10K structural-variant track, and
// which breed each one is — mirrors public/data/dog10k-svs-samples.tsv,
// which the live browser uses to group and label the same 12 rows by breed.
const DOG10K_SV_SAMPLES = [
  { sample: 'Zoey', breed: 'Great Dane' },
  { sample: 'BD', breed: 'Bernese Mountain Dog' },
  { sample: 'OD', breed: 'Bernese Mountain Dog' },
  { sample: 'Mischka', breed: 'German Shepherd' },
  { sample: 'Nala', breed: 'German Shepherd' },
  { sample: 'China', breed: 'Basenji' },
  { sample: 'Wags', breed: 'Basenji' },
  { sample: 'Tasha', breed: 'Boxer' },
  { sample: 'Yella', breed: 'Labrador Retriever' },
  { sample: 'CA611', breed: 'Cairn Terrier' },
  { sample: 'Sandy', breed: 'Dingo' },
  { sample: 'mCanLor', breed: 'Greenland Wolf' },
]

// A gene's own coordinates fill the whole view, which leaves nothing around
// it to make sense of — pad each side by a few gene-lengths (at least 15 kb)
// so neighboring genes and repeats are visible for context.
function padLocation(location?: string) {
  const match = location?.replaceAll(',', '').match(/^(.+):(\d+)-(\d+)$/)
  if (!match) return location
  const [, chr, start, end] = match
  const flank = Math.max((Number(end) - Number(start)) * 3, 15000)
  return `${chr}:${Math.max(1, Number(start) - flank)}-${Number(end) + flank}`
}

const COAT_PATCHES = [
  [18, 20, 11, 7],
  [44, 12, 9, 8],
  [62, 28, 13, 8],
  [30, 38, 10, 6],
  [78, 14, 7, 6],
  [86, 40, 8, 7],
  [52, 46, 9, 5],
]

function CoatSwatch({ base, patch }: { base: string; patch?: string }) {
  return (
    <svg viewBox="0 0 100 56" className="genome-coat-swatch" aria-hidden="true">
      <clipPath id={`coat-${base.slice(1)}`}>
        <rect width="100" height="56" rx="10" />
      </clipPath>
      <g clipPath={`url(#coat-${base.slice(1)})`}>
        <rect width="100" height="56" fill={base} stroke="#bbb" />
        {patch
          ? COAT_PATCHES.map(([cx, cy, rx, ry]) => (
              <ellipse
                key={`${cx}-${cy}`}
                cx={cx}
                cy={cy}
                rx={rx}
                ry={ry}
                fill={patch}
              />
            ))
          : null}
      </g>
    </svg>
  )
}

function CoatDiagram() {
  return (
    <div className="genome-coat-diagram">
      <div className="genome-coat-step">
        <CoatSwatch base="#1a1a1a" />
        <strong>Neither gene</strong>
        <span>Solid coat</span>
      </div>
      <span className="genome-coat-plus">+ merle &rarr;</span>
      <div className="genome-coat-step">
        <CoatSwatch base="#8a8a90" patch="#1a1a1a" />
        <strong>Merle gene</strong>
        <span>Random patches of diluted pigment</span>
      </div>
      <span className="genome-coat-plus">+ harlequin &rarr;</span>
      <div className="genome-coat-step">
        <CoatSwatch base="#ffffff" patch="#1a1a1a" />
        <strong>Merle + harlequin</strong>
        <span>
          The harlequin gene is a dominant modifier of merle: one copy removes
          the dilution, leaving solid black patches on white
        </span>
      </div>
    </div>
  )
}

const SMALL_COLOR = '#1d6fa5'
const GIANT_COLOR = '#bf141c'

// A schematic of the Dog Aging Project's findings (Mariner, McCoy et al.,
// Science 2026) — the lines are drawn to show direction and rough size of
// the effects, not plotted from the study's data.
function AgingDiagram() {
  return (
    <div className="genome-aging-diagram">
      <figure className="genome-aging-panel">
        <svg
          viewBox="0 0 160 120"
          role="img"
          aria-label="Epigenetic age against real age, with a dog above the diagonal"
        >
          <line x1="22" y1="100" x2="150" y2="100" stroke="#999" />
          <line x1="22" y1="100" x2="22" y2="10" stroke="#999" />
          <line
            x1="22"
            y1="100"
            x2="140"
            y2="16"
            stroke="#999"
            strokeDasharray="4 3"
          />
          <circle cx="82" cy="50" r="5" fill={GIANT_COLOR} />
          <circle cx="110" cy="52" r="5" fill={SMALL_COLOR} />
          <line
            x1="82"
            y1="50"
            x2="82"
            y2="66"
            stroke={GIANT_COLOR}
            strokeDasharray="2 2"
          />
          <text x="90" y="44" fontSize="9" fill={GIANT_COLOR}>
            ahead
          </text>
          <text x="116" y="64" fontSize="9" fill={SMALL_COLOR}>
            behind
          </text>
          <text x="86" y="114" fontSize="9" fill="#666" textAnchor="middle">
            real age
          </text>
          <text
            x="9"
            y="56"
            fontSize="9"
            fill="#666"
            transform="rotate(-90 9 56)"
            textAnchor="middle"
          >
            clock age
          </text>
        </svg>
        <figcaption>
          <strong>1. A clock for aging.</strong> DNA methylation predicts a
          dog&rsquo;s age to within a year. Dogs whose clock runs ahead face
          about 15% higher risk of death for each extra year.
        </figcaption>
      </figure>
      <LineMethylationPanel />
      <PromoterPanel />
      <p className="genome-aging-note">
        Panel 1 is a schematic of the study&rsquo;s clock. Panels 2 and 3 are
        plotted from the study&rsquo;s public data. Blue: smaller dogs. Red:
        giant dogs.
      </p>
    </div>
  )
}

const LOSS_MAX = 0.65
const lossX = (loss: number) => 78 + (loss / LOSS_MAX) * 112

// Real data: our re-analysis of the study's public methylation data (Zenodo
// 10.5281/zenodo.20709041), done the way the paper does it — site by site.
// Each bar is the typical (median) methylation lost per year at LINE sites
// that lose methylation with age, in dogs below vs above the median
// genotype-predicted adult size.
function LineMethylationPanel() {
  const { all, families } = lineMethylation
  const rows = [all, ...families]
  return (
    <figure className="genome-aging-panel genome-aging-panel-wide">
      <svg
        viewBox="0 0 200 140"
        role="img"
        aria-label="Methylation lost per year at jumping-gene sites, for smaller and larger dogs, overall and by LINE-1 family"
      >
        <line x1="78" y1="12" x2="78" y2="112" stroke="#999" />
        {rows.map((row, index) => {
          const y = 14 + index * 19
          return (
            <g key={row.label}>
              <text
                x="74"
                y={y + 8}
                fontSize="7.5"
                fill="#333"
                textAnchor="end"
              >
                {row.label.length > 16
                  ? row.label
                      .replace(' LINE-1', ' L1')
                      .replace('dog-specific ', '')
                  : row.label}
              </text>
              <rect
                x="78"
                y={y}
                width={lossX(row.small) - 78}
                height="7"
                fill={SMALL_COLOR}
              />
              <rect
                x="78"
                y={y + 8}
                width={lossX(row.large) - 78}
                height="7"
                fill={GIANT_COLOR}
              />
              <text
                x={lossX(row.large) + 3}
                y={y + 14}
                fontSize="7"
                fill={GIANT_COLOR}
              >
                {row.steeperPct}% steeper
              </text>
            </g>
          )
        })}
        <text x="134" y="124" fontSize="8" fill="#666" textAnchor="middle">
          points lost per year
        </text>
        <text x="134" y="135" fontSize="8" textAnchor="middle">
          <tspan fill={SMALL_COLOR}>smaller dogs</tspan>
          <tspan fill="#666"> · </tspan>
          <tspan fill={GIANT_COLOR}>larger dogs</tspan>
        </text>
      </svg>
      <figcaption>
        <strong>2. Jumping genes lose their tags faster in big dogs.</strong>{' '}
        Real data, our re-analysis: at {all.sites.toLocaleString()} LINE sites
        that lose methylation with age, the typical site loses{' '}
        {all.large.toFixed(2)} points a year in larger dogs against{' '}
        {all.small.toFixed(2)} in smaller dogs, about{' '}
        {Math.round((all.large / all.small - 1) * 100)}% faster, and{' '}
        {all.steeperPct}% of sites are steeper in larger dogs. The paper reports
        31%, and finds the youngest LINE-1 families most affected; here too the
        youngest dog-specific family has the biggest gap (
        {families[0].steeperPct}% of its sites).
      </figcaption>
    </figure>
  )
}

const PROMOTER_X_MAX = 6
const promoterX = (perDecade: number) => 62 + (perDecade / PROMOTER_X_MAX) * 128

// Real data: methylation at each gene's promoter (2 kb before the start of
// the gene) against age, from the same public dataset, modeled with sex,
// genotype, batch and a random effect per dog, at the cohort's average size.
function PromoterPanel() {
  const rows = promoterMethylation
  return (
    <figure className="genome-aging-panel genome-aging-panel-wide">
      <svg
        viewBox="0 0 200 140"
        role="img"
        aria-label="Change in promoter methylation per decade of age for FOXE1, GATA4, IGF2, IGF1R and IGF1"
      >
        <line x1="62" y1="104" x2="192" y2="104" stroke="#999" />
        <line
          x1="62"
          y1="12"
          x2="62"
          y2="104"
          stroke="#999"
          strokeDasharray="2 3"
        />
        {[0, 2, 4, 6].map(tick => (
          <text
            key={tick}
            x={promoterX(tick)}
            y="114"
            fontSize="8"
            fill="#666"
            textAnchor="middle"
          >
            {tick}
          </text>
        ))}
        <text x="127" y="128" fontSize="9" fill="#666" textAnchor="middle">
          points gained per decade
        </text>
        {rows.map((row, index) => {
          const y = 24 + index * 18
          const perDecade = row.perYear * 10
          const half = row.se * 1.96 * 10
          const significant = row.p < 0.001
          return (
            <g key={row.gene}>
              <text x="58" y={y + 3} fontSize="9" fill="#333" textAnchor="end">
                {row.gene}
              </text>
              <line
                x1={promoterX(Math.max(0, perDecade - half))}
                x2={promoterX(perDecade + half)}
                y1={y}
                y2={y}
                stroke="#444"
              />
              <circle
                cx={promoterX(perDecade)}
                cy={y}
                r="3.5"
                fill={significant ? '#444' : '#fff'}
                stroke="#444"
                strokeWidth="1.5"
              />
            </g>
          )
        })}
      </svg>
      <figcaption>
        <strong>3. Gene switches gain tags.</strong> Real data, our re-analysis:
        the promoters of FOXE1 and GATA4, two genes the paper links to IGF1,
        gain methylation steadily with age. IGF1&rsquo;s own promoter is almost
        untouched (hollow dot, about 4% methylated, no clear change), so the
        study&rsquo;s IGF1 link runs through its neighbors, not the gene itself.
        Bars show 95% ranges.
      </figcaption>
    </figure>
  )
}

interface DescriptionComponentProps {
  geneEntry: Record<string, string>
}

function DescriptionComponent({ geneEntry }: DescriptionComponentProps) {
  return (
    <div className="genome-description">
      <strong>{geneEntry.name}</strong> - {geneEntry.summary}{' '}
      {geneEntry.citations?.split(';').map((citation, idx) => (
        <a key={citation} target="_blank" href={geneEntry[`doi${idx + 1}`]}>
          {citation}
        </a>
      ))}
      {geneEntry.location ? (
        <ul className="genome-description-links">
          <li>
            <a
              href={`https://jbrowse.org/code/jb2/main/?config=/ucsc/canFam4/config.json&assembly=canFam4&loc=${geneEntry.location}&tracks=canFam4-ncbiRefSeq`}
              target="_blank"
            >
              Link to JBrowse (canFam4)
            </a>
          </li>
        </ul>
      ) : null}
    </div>
  )
}

interface BrowserProps {
  geneCategories: Record<string, string>[]
  chromosomes: ChromosomeInfo[]
}

export default function Browser({ geneCategories, chromosomes }: BrowserProps) {
  const [type, setType] = useState('all')
  const [gene, setGene] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [exploreOpen, setExploreOpen] = useState(false)
  const [showCompanion, setShowCompanion] = useState(false)
  const [viewIndex, setViewIndex] = useState(0)
  const [liveBrowserOpen, setLiveBrowserOpen] = useState(false)
  const storyRef = useRef<HTMLDivElement>(null)

  // Treat 'all' and empty string the same - show all genes
  const effectiveType = type === '' ? 'all' : type

  const categories = [
    ...new Set<string>(geneCategories.map(entry => entry.type)),
  ].toSorted()

  const placedGenes = geneCategories.filter(entry => !!entry.location)
  const unplacedGenes = geneCategories.filter(entry => !entry.location)
  const moreStoryThemes = [...new Set(MORE_STORIES.map(story => story.theme))]

  const geneEntry = geneCategories.find(entry => entry.name === gene)
  const activeTourStop = [...TOUR_STOPS, ...MORE_STORIES].find(
    stop => stop.gene === gene,
  )
  const companionEntry = geneCategories.find(
    entry => entry.name === activeTourStop?.companionGene,
  )

  const annotations = placedGenes.flatMap(entry => {
    const { location, name, type: category } = entry
    const [chrRaw, rest] = location.split(':')
    const range = rest?.split('-')
    if (!range || range.length !== 2) return []
    return [
      {
        chr: chrRaw.replace('chr', ''),
        start: Number(range[0].replaceAll(',', '')),
        stop: Number(range[1].replaceAll(',', '')),
        name,
        category,
      },
    ]
  })

  const curatedGenes: CuratedGeneFeature[] = useMemo(
    () =>
      annotations.map(({ chr, start, stop, name, category }) => ({
        refName: chr.startsWith('chr') ? chr : `chr${chr}`,
        start: start - 1,
        end: stop,
        name,
        category,
      })),
    [annotations],
  )

  const liveLocation = (
    activeTourStop?.views?.[viewIndex]?.location ??
    activeTourStop?.location ??
    padLocation(
      (showCompanion ? companionEntry?.location : undefined) ??
        geneEntry?.location,
    ) ??
    DEFAULT_LOCATION
  ).replaceAll(',', '')

  const categoryGenes =
    effectiveType !== 'all'
      ? placedGenes
          .filter(entry => entry.type === effectiveType)
          .toSorted((a, b) => a.name.localeCompare(b.name))
      : []

  const searchMatches = searchQuery.trim()
    ? geneCategories
        .filter(entry =>
          entry.name.toLowerCase().includes(searchQuery.trim().toLowerCase()),
        )
        .slice(0, 8)
    : []

  function selectGene(name: string) {
    setGene(name)
    setShowCompanion(false)
    setViewIndex(0)
    setSearchQuery('')
    setSearchOpen(false)
  }

  // Picking a gene from the whole-genome explorer changes what the stage above
  // shows, which is off-screen by then — bring it back into view.
  function selectGeneFromExplorer(name: string) {
    selectGene(name)
    requestAnimationFrame(() => {
      storyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  function selectType(newType: string) {
    setType(newType)
    setGene('')
  }

  function openTourStop(stop: TourStop) {
    selectGene(stop.gene)
    // Start the live browser loading now, in the background, but scroll to
    // the written story first — by the time someone reads it and scrolls
    // past the karyotype themselves, the browser below is more likely to
    // have already finished loading its tracks.
    prefetchDog10kSvVcf()
    setLiveBrowserOpen(true)
    requestAnimationFrame(() => {
      storyRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }

  const storyTracks = useMemo(
    () =>
      activeTourStop?.views?.[viewIndex]?.tracks ??
      activeTourStop?.tracks ??
      [],
    [activeTourStop, viewIndex],
  )
  const markers = useMemo(() => activeTourStop?.markers ?? [], [activeTourStop])
  const showSvTrack = storyTracks.includes('sv')
  const showStage = !!gene || liveBrowserOpen
  const stageTitle = activeTourStop?.label ?? geneEntry?.name

  return (
    <div>
      <div className="content">
        <main className="content-wrapper">
          <section className="hero-section">
            <img
              src="/img/Colorlogo_nobackground.png"
              alt="7Sisters Farm Logo"
              width={300}
              height="auto"
              className="hero-logo"
              loading="lazy"
              style={{ margin: '0 auto' }}
            />
          </section>
          <h1 className="genome-page-title">
            <span className="accent-color">7</span>Sisters Genome Browser
            <span className="genome-page-subtitle"> (CanFam4)</span>
          </h1>
          <section className="genome-tour">
            <img
              src="/img/close-up-puppy-faces-cart-illinois-corn-field-sunset.jpg"
              alt="Great Dane puppies in a wagon at 7Sisters Farm"
              className="genome-tour-photo"
              loading="lazy"
            />
            <div className="genome-tour-body">
              <h2 className="genome-tour-title">Take the tour</h2>
              <p className="genome-tour-intro">
                Three real places in a Great Dane&rsquo;s genome, each with a
                story worth telling.
              </p>
              <div className="genome-tour-cards">
                {TOUR_STOPS.map(stop => (
                  <button
                    key={stop.gene}
                    type="button"
                    className={
                      'genome-tour-card' +
                      (stop.gene === gene ? ' genome-tour-card-active' : '')
                    }
                    onClick={() => openTourStop(stop)}
                  >
                    <span className="genome-tour-card-label">{stop.label}</span>
                    <span className="genome-tour-card-hook">{stop.hook}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
          {MORE_STORIES.length ? (
            <section className="genome-more-stories">
              <h3 className="genome-more-stories-title">More stories</h3>
              {moreStoryThemes.map(theme => (
                <div key={theme} className="genome-more-stories-theme">
                  <div className="genome-more-stories-theme-label">{theme}</div>
                  <div className="genome-more-stories-list">
                    {MORE_STORIES.filter(story => story.theme === theme).map(
                      story => (
                        <button
                          key={story.gene}
                          type="button"
                          className="genome-more-stories-item"
                          onClick={() => openTourStop(story)}
                        >
                          <span className="genome-more-stories-item-label">
                            {story.label}
                          </span>
                          <span className="genome-more-stories-item-hook">
                            {story.hook}
                          </span>
                        </button>
                      ),
                    )}
                  </div>
                </div>
              ))}
            </section>
          ) : null}

          <div className="genome-stage" ref={storyRef}>
            {showStage ? (
              <>
                <div className="genome-stage-header">
                  {stageTitle ? (
                    <h2 className="genome-stage-title">{stageTitle}</h2>
                  ) : null}
                  {activeTourStop ? (
                    <p className="genome-stage-hook">{activeTourStop.hook}</p>
                  ) : null}
                </div>
                {activeTourStop?.diagram === 'coat' ? <CoatDiagram /> : null}
                {activeTourStop?.diagram === 'aging' ? <AgingDiagram /> : null}
                {activeTourStop?.views ? (
                  <>
                    <div className="genome-locus-switch" role="group">
                      <span>Show in the browser:</span>
                      {activeTourStop.views.map((view, index) => (
                        <button
                          key={view.label}
                          type="button"
                          className={
                            'genome-pill' +
                            (viewIndex === index ? ' genome-pill-active' : '')
                          }
                          onClick={() => setViewIndex(index)}
                        >
                          {view.label}
                        </button>
                      ))}
                    </div>
                    <p className="genome-locus-note">
                      {activeTourStop.views[viewIndex]?.note}
                    </p>
                  </>
                ) : null}
                {companionEntry ? (
                  <div className="genome-locus-switch" role="group">
                    <span>Show in the browser:</span>
                    {[
                      { label: 'Merle gene (PMEL)', companion: false },
                      { label: 'Harlequin gene (PSMB7)', companion: true },
                    ].map(({ label, companion }) => (
                      <button
                        key={label}
                        type="button"
                        className={
                          'genome-pill' +
                          (showCompanion === companion
                            ? ' genome-pill-active'
                            : '')
                        }
                        onClick={() => setShowCompanion(companion)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                ) : null}
                {companionEntry && showCompanion ? (
                  <p className="genome-locus-note">
                    The blue marker is the published harlequin change (a T
                    swapped for a G in exon 2). Of the 8 Great Danes in the top
                    rows, whose coat colors were not recorded, 2 carry one copy
                    of the G &mdash; as expected for harlequin dogs, which carry
                    exactly one. Among the 1,987 dogs in the Dog10K callset
                    (which has no Great Danes), only a single village dog from
                    Peru has it.
                  </p>
                ) : null}
                {liveBrowserOpen ? (
                  <Suspense
                    fallback={
                      <div className="genome-live-loading">
                        Loading genome browser&hellip;
                      </div>
                    }
                  >
                    <JBrowseEmbed
                      // The view state is built once from its props, so a story
                      // with different markers needs a fresh one.
                      key={markers.map(marker => marker.name).join('|')}
                      curatedGenes={curatedGenes}
                      location={liveLocation}
                      storyTracks={storyTracks}
                      markers={markers}
                    />
                  </Suspense>
                ) : (
                  <button
                    type="button"
                    className="genome-live-toggle"
                    onClick={() => {
                      prefetchDog10kSvVcf()
                      setLiveBrowserOpen(true)
                    }}
                  >
                    Open live genome browser
                    {geneEntry ? ` — ${geneEntry.name}` : ''}
                  </button>
                )}
                <div className="genome-accordions" key={gene}>
                  {activeTourStop?.intro ? (
                    <details className="genome-accordion">
                      <summary>The story</summary>
                      <p className="genome-accordion-body">
                        {activeTourStop.intro}
                      </p>
                    </details>
                  ) : null}
                  {geneEntry ? (
                    <details className="genome-accordion">
                      <summary>About this gene</summary>
                      <div className="genome-accordion-body">
                        <DescriptionComponent geneEntry={geneEntry} />
                      </div>
                    </details>
                  ) : null}
                  {companionEntry ? (
                    <details className="genome-accordion">
                      <summary>The companion gene</summary>
                      <div className="genome-accordion-body">
                        <DescriptionComponent geneEntry={companionEntry} />
                      </div>
                    </details>
                  ) : null}
                </div>
              </>
            ) : null}
            <div className="genome-accordions">
              <details className="genome-accordion">
                <summary>What the live browser shows</summary>
                <div className="genome-accordion-body">
                  <p>
                    A real, in-page JBrowse view of the CanFam4 assembly: our
                    curated gene catalog (red) and the full NCBI RefSeq gene
                    annotation.
                    {storyTracks.includes('coat')
                      ? ' Below them, SNP genotypes, one row per dog, at common variant sites in each gene\u2019s region: 8 Great Danes (top, genotyped from Logan\u2019s assembled public sequencing data) against 35 dogs from 12 other breeds and 4 wolves (Dog10K). Switch between the two genes above.'
                      : null}
                    {storyTracks.includes('fgf4')
                      ? ' Below them, the footprint of the FGF4 retrocopy in 38 dogs from 10 breeds. All 19 short-legged dogs (Dachshund, Basset Hound, Cardigan Corgi, Cocker Spaniel, Lhasa Apso) carry two deletions marking the FGF4 gene\u2019s introns, a sign of an extra, intron-free copy elsewhere in the genome. None of the 19 dogs from five large breeds (Mastiff, Saint Bernard, Newfoundland, Scottish Deerhound, Bullmastiff) do. Great Danes are not in this cohort, so these large breeds, which we picked, stand in.'
                      : null}
                    {storyTracks.includes('methylation')
                      ? ' Below them, methylation (the share of DNA copies carrying the chemical tag) at the sites the Dog Aging Project sequenced, pooled across 268 dogs under 3 and 377 dogs aged 8 and older.'
                      : null}
                    {storyTracks.includes('lineLoss')
                      ? ' Below them, how much methylation each jumping-gene site loses per year of age, in smaller dogs, in larger dogs, and the difference (our analysis of the Dog Aging Project data, split at the median predicted adult size).'
                      : null}
                    {showSvTrack
                      ? ' Below them, a structural-variant track genotyped across 12 real, named dogs — one row per breed, including a Great Dane.'
                      : storyTracks.length
                        ? null
                        : ' Stories add extra evidence tracks where they help tell the story.'}
                  </p>
                  {showSvTrack ? (
                    <table className="genome-sv-samples-table">
                      <tbody>
                        {DOG10K_SV_SAMPLES.map(({ sample, breed }) => (
                          <tr key={sample}>
                            <td>{sample}</td>
                            <td>{breed}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : null}
                </div>
              </details>
              <details className="genome-accordion">
                <summary>How this browser is built</summary>
                <ul className="genome-accordion-body">
                  <li>
                    Reference sequence: UCSC canFam4 / UU_Cfam_GSD_1.0, read
                    directly from{' '}
                    <a
                      href="https://hgdownload.soe.ucsc.edu/goldenPath/canFam4/"
                      target="_blank"
                    >
                      hgdownload.soe.ucsc.edu
                    </a>
                    .
                  </li>
                  <li>
                    Gene annotation: the full NCBI RefSeq set for canFam4, from
                    JBrowse&rsquo;s own hosted UCSC mirror.
                  </li>
                  <li>
                    Structural variants: 12 long-read dog genomes, including the
                    Great Dane reference assembly &ldquo;Zoey&rdquo; (
                    <a
                      href="https://doi.org/10.1073/pnas.2016274118"
                      target="_blank"
                    >
                      Halo et al., 2021, PNAS
                    </a>
                    ), genotyped by{' '}
                    <a
                      href="https://doi.org/10.5281/zenodo.14968874"
                      target="_blank"
                    >
                      Schall &amp; Kidd, 2025
                    </a>
                    .
                  </li>
                  <li>
                    Methylation (Aging story): the Dog Aging Project&rsquo;s
                    public data from{' '}
                    <a
                      href="https://doi.org/10.1126/science.aeb2986"
                      target="_blank"
                    >
                      Mariner, McCoy et al., 2026, Science
                    </a>{' '}
                    (
                    <a
                      href="https://doi.org/10.5281/zenodo.20709041"
                      target="_blank"
                    >
                      Zenodo, CC BY 4.0
                    </a>
                    ), re-analyzed by us at LINE repeats from UCSC RepeatMasker.
                    Our simplified analysis is not the authors&rsquo;.
                  </li>
                  <li>
                    Curated gene catalog: our own, {geneCategories.length}{' '}
                    genes, each cited to primary literature.
                  </li>
                  <li>
                    Built with{' '}
                    <a href="https://jbrowse.org" target="_blank">
                      JBrowse 2
                    </a>
                    , the open-source genome browser platform.
                  </li>
                </ul>
              </details>
            </div>
          </div>

          <details
            className="genome-accordion genome-explore"
            open={exploreOpen}
            onToggle={event => setExploreOpen(event.currentTarget.open)}
          >
            <summary>Explore the whole genome</summary>
          </details>
        </main>
      </div>
      {exploreOpen ? (
        <>
          <div className="content">
            <main className="content-wrapper">
              <p className="genome-explore-intro">
                Each bar is one dog chromosome from the CanFam4 reference, drawn
                to scale; the small tick is the centromere, dividing the p
                (short) and q (long) arms. Colored dots mark genes we&rsquo;ve
                placed &mdash; hover for details, or click one to load it above.
              </p>
              <div className="genome-controls">
                <div className="genome-search">
                  <input
                    type="text"
                    className="genome-search-input"
                    placeholder="Search genes by name..."
                    value={searchQuery}
                    onChange={event => {
                      setSearchQuery(event.target.value)
                      setSearchOpen(true)
                    }}
                    onFocus={() => setSearchOpen(true)}
                    onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
                  />
                  {searchOpen && searchMatches.length ? (
                    <ul className="genome-search-results">
                      {searchMatches.map(entry => (
                        <li key={entry.name}>
                          <button
                            type="button"
                            onMouseDown={event => event.preventDefault()}
                            onClick={() => selectGeneFromExplorer(entry.name)}
                          >
                            {entry.name}
                            <span className="genome-search-category">
                              {entry.type}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <div
                  className="genome-pills"
                  role="group"
                  aria-label="Filter by category"
                >
                  <button
                    type="button"
                    className={
                      'genome-pill' +
                      (effectiveType === 'all' ? ' genome-pill-active' : '')
                    }
                    onClick={() => selectType('all')}
                  >
                    All ({geneCategories.length})
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      type="button"
                      className={
                        'genome-pill' +
                        (effectiveType === category
                          ? ' genome-pill-active'
                          : '')
                      }
                      onClick={() => selectType(category)}
                    >
                      {category} (
                      {geneCategories.filter(e => e.type === category).length})
                    </button>
                  ))}
                </div>
              </div>
              {categoryGenes.length ? (
                <div className="genome-category-genes">
                  <div className="genome-category-genes-title">
                    {effectiveType} genes ({categoryGenes.length}) - select one
                    to learn more
                  </div>
                  <div className="genome-category-genes-chips">
                    {categoryGenes.map(entry => (
                      <button
                        key={entry.name}
                        type="button"
                        className={
                          'genome-chip' +
                          (entry.name === gene ? ' genome-chip-active' : '')
                        }
                        onClick={() => selectGeneFromExplorer(entry.name)}
                      >
                        {entry.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </main>
          </div>
          <GenomeIdeogram
            chromosomes={chromosomes}
            annotations={annotations}
            selectedGene={gene}
            activeCategory={effectiveType}
            onSelectGene={selectGeneFromExplorer}
          />
          {unplacedGenes.length ? (
            <div className="genome-unplaced">
              <div className="genome-unplaced-title">
                Genes without genome coordinates yet ({unplacedGenes.length})
              </div>
              <div className="genome-unplaced-chips">
                {unplacedGenes
                  .toSorted((a, b) => a.name.localeCompare(b.name))
                  .map(entry => {
                    const isDimmed =
                      effectiveType !== 'all' && entry.type !== effectiveType
                    return (
                      <button
                        key={entry.name}
                        type="button"
                        className={
                          'genome-chip' +
                          (entry.name === gene ? ' genome-chip-active' : '') +
                          (isDimmed ? ' genome-chip-dimmed' : '')
                        }
                        onClick={() => selectGeneFromExplorer(entry.name)}
                      >
                        {entry.name}
                      </button>
                    )
                  })}
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
