import { lazy, Suspense, useMemo, useRef, useState } from 'react'

import AgingStory from './AgingStory'
import { prefetchDog10kSvVcf } from './dog10kSvSource'
import BreedDots from './BreedDots'
import GeneStrip, { type StripRow } from './GeneStrip'
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
  // A static picture of the locus (no live browser needed to follow the story).
  strip?: 'coat' | 'fgf4' | 'amy2b'
  // Specific published variants to mark on the browser.
  markers?: StoryMarker[]
  // Several places to look at for one story, switched between with buttons
  // above the browser — for a story that spans more than one gene.
  // 'optional': the written story and pictures carry it, and the live browser
  // opens only when the reader asks for it.
  // 'none': the story is told entirely by its pictures; no live browser.
  browser?: 'optional' | 'none'
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
    strip: 'coat',
    browser: 'optional',
    tracks: ['coat'],
    markers: [
      {
        // Exact site from the SINE junction unitigs in the Danes: the last
        // base of a 13-bp target-site duplication (chr10:644,501-644,513).
        refName: 'chr10',
        start: 644512,
        end: 644513,
        name: 'Merle insertion',
        description:
          'Merle: a SINE inserted at the boundary of PMEL intron 10 and exon 11 (Clark et al. 2006), chr10:644,513 in canFam4.',
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
    strip: 'fgf4',
    browser: 'optional',
    tracks: ['fgf4'],
    hook: "Why are Great Danes so tall? It's what they DON'T carry.",
  },
  {
    label: 'Health',
    gene: 'PRKCZ',
    browser: 'optional',
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
    strip: 'amy2b',
    browser: 'optional',
    hook: 'Why are dogs better than wolves at digesting starch?',
    location: 'chr6:47,370,000-47,398,000',
    tracks: ['sv'],
    intro:
      "Somewhere in this window, most dogs carry a duplication wolves don't have — one of the clearest fingerprints of domestication in the entire genome. Extra copies of this gene meant more of the enzyme that digests starch, letting early dogs thrive on grain and food scraps around human settlements in a way wolves never could. Below, the duplication is called in 8 of the 12 long-read genomes in our structural-variant data, including Zoey, our Great Dane. The other four, the Greenland Wolf and the dingo among them, simply have no duplication call; that is not the same as proof it is absent.",
  },
  {
    theme: 'Aging',
    label: 'Aging and size',
    gene: 'IGF1',
    diagram: 'aging',
    browser: 'none',
    hook: "Big dogs don't just live shorter lives. A new study shows their DNA ages faster.",
    intro:
      "Small breeds can live up to twice as long as giant ones. The Dog Aging Project (Mariner, McCoy et al., Science, October 2026) asked whether big dogs simply die earlier or really age faster. They measured methylation, chemical tags on DNA that change predictably with age, in 1,640 blood samples from 894 pet dogs, and found that larger dogs, and males, age faster by this molecular clock. The biggest differences were not in genes but in transposons, the 'jumping genes' that make up a large share of the genome: they lose tags with age, which can wake them up, and they lose them faster in larger dogs, most of all in the youngest LINE-1 families. The authors caution that this is a pattern in tags, not proof of cause: they did not measure transposon activity. The pictures above use the study's public data.",
  },
]

const AMY2B_ROWS: StripRow[] = [
  { label: 'Great Dane (Zoey)', state: 'yes', group: 'Dogs' },
  { label: 'Bernese (BD)', state: 'yes' },
  { label: 'Bernese (OD)', state: 'yes' },
  { label: 'German Shepherd (Mischka)', state: 'yes' },
  { label: 'Basenji (China)', state: 'yes' },
  { label: 'Boxer (Tasha)', state: 'yes' },
  { label: 'Labrador (Yella)', state: 'yes' },
  { label: 'Cairn Terrier (CA611)', state: 'yes' },
  { label: 'German Shepherd (Nala)', state: 'none' },
  { label: 'Basenji (Wags)', state: 'none' },
  { label: 'Dingo (Sandy)', state: 'none', group: 'Wild canids' },
  { label: 'Greenland Wolf', state: 'none' },
]

function StoryStrip({ kind }: { kind: NonNullable<TourStop['strip']> }) {
  switch (kind) {
    case 'coat':
      return (
        <>
          <GeneStrip
            title="Merle: PMEL on chromosome 10"
            chr="chr10"
            start={640000}
            stop={656000}
            genes={[{ name: 'PMEL', start: 644259, stop: 651766 }]}
            markers={[
              {
                pos: 644513,
                label: 'Merle SINE insertion',
                note: 'Found in the sequencing reads of 3 of the 8 Great Danes.',
              },
            ]}
          />
          <GeneStrip
            title="Harlequin: PSMB7 on chromosome 9"
            chr="chr9"
            start={58600000}
            stop={58690000}
            genes={[{ name: 'PSMB7', start: 58614281, stop: 58677679 }]}
            markers={[{ pos: 58614853, label: 'T>G (p.V49G)' }]}
            caption="Two genes on two different chromosomes. Harlequin only shows its effect on top of merle."
          />
        </>
      )
    case 'fgf4':
      return <BreedDots />
    case 'amy2b':
      return (
        <GeneStrip
          title="AMY2B on chromosome 6"
          chr="chr6"
          start={47365000}
          stop={47400000}
          genes={[{ name: 'AMY2B', start: 47381288, stop: 47388483 }]}
          span={{
            start: 47375677,
            stop: 47390529,
            label: '~15 kb duplication',
          }}
          rows={AMY2B_ROWS}
          rowsNote="8 of the 10 dogs have a duplication call. Neither the dingo nor the wolf does."
          caption="Red bar = duplication called in that sample. Dashed line = no call, which is not the same as absent."
        />
      )
  }
}

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
    if (stop.browser !== 'optional') {
      prefetchDog10kSvVcf()
      setLiveBrowserOpen(true)
    }
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
  const storyGenes = useMemo(
    () =>
      [activeTourStop?.gene, activeTourStop?.companionGene].filter(
        (name): name is string => !!name,
      ),
    [activeTourStop],
  )
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
        </main>
      </div>
      <div className="content">
        <main className="content-wrapper">
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
                {activeTourStop?.diagram === 'aging' ? <AgingStory /> : null}
                {activeTourStop?.strip ? (
                  <StoryStrip kind={activeTourStop.strip} />
                ) : null}
                {activeTourStop?.views &&
                activeTourStop.browser !== 'none' &&
                (activeTourStop.browser !== 'optional' || liveBrowserOpen) ? (
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
                {companionEntry && liveBrowserOpen ? (
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
                {companionEntry && liveBrowserOpen && showCompanion ? (
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
                {activeTourStop?.browser === 'none' ? null : liveBrowserOpen ? (
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
                      hideControls={activeTourStop?.diagram === 'aging'}
                      hideRefSeq={activeTourStop?.diagram === 'aging'}
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
                    {activeTourStop?.browser === 'optional'
                      ? 'Explore the data in the genome browser (optional)'
                      : `Open live genome browser${geneEntry ? ` — ${geneEntry.name}` : ''}`}
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
              {activeTourStop?.browser === 'none' ? null : (
                <details className="genome-accordion">
                  <summary>What the live browser shows</summary>
                  <div className="genome-accordion-body">
                    <p>
                      A real, in-page JBrowse view of the CanFam4 assembly: our
                      curated gene catalog (red) and the full NCBI RefSeq gene
                      annotation.
                      {storyTracks.includes('coat')
                        ? ' Below them, SNP genotypes, one row per dog, at common variant sites in each gene\u2019s region: 8 Great Danes (top, genotyped from Logan\u2019s assembled public sequencing data) against 34 other dogs (32 from 12 breeds, plus 2 wolves). The merle insertion itself is one row at the PMEL site, found by searching each dog\u2019s assembled sequence for the insertion\u2019s junctions. Switch between the two genes above.'
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
                        ? ' Below them, a structural-variant track genotyped across 12 real, named samples (10 dogs, a dingo and a wolf) — one row per sample, grouped by breed, including a Great Dane.'
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
              )}
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
        </main>
      </div>
      <div className="content">
        <main className="content-wrapper">
          <p className="genome-explore-intro">
            Each bar is one dog chromosome from the CanFam4 reference, drawn to
            scale; the small tick is the centromere, dividing the p (short) and
            q (long) arms. Colored dots mark genes we&rsquo;ve placed &mdash;
            hover for details, or click one to read its story above. Pick a
            story and its genes light up here.
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
                    (effectiveType === category ? ' genome-pill-active' : '')
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
                {effectiveType} genes ({categoryGenes.length}) - select one to
                learn more
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
        highlightGenes={storyGenes}
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
    </div>
  )
}
