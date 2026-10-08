import { lazy, Suspense, useMemo, useRef, useState } from 'react'

import { prefetchDog10kSvVcf } from './dog10kSvSource'
import GenomeIdeogram, { type ChromosomeInfo } from './GenomeIdeogram'
import type { CuratedGeneFeature, StoryTrackId } from './JBrowseEmbed'

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
}

// Three loci with a real, tellable story — each an exact-match `name` from
// categories2.tsv, so a click reuses the same lookup as the search box.
const TOUR_STOPS: TourStop[] = [
  {
    label: 'Coat pattern',
    gene: 'M Locus Merle premelanosome protein (PMEL17/SILV)',
    companionGene: 'H Locus Harlequin proteasome 20S subunit beta 7 (PSMB7)',
    tracks: ['repeats'],
    hook: 'Why do some Great Danes look like a black-and-white patchwork? It takes two genes stacked on top of each other.',
    intro:
      "This pattern is two genes, not one: merle (below) lays down random patches of diluted pigment on its own — that alone is a recognized Great Dane pattern. Stack one copy of the Harlequin gene on top of it and it strips the dilution back out, leaving solid black patches on white instead of the softer merle mottling. Breeders ran harlequin programs for a century before anyone knew this: a 1988 study first argued harlequin was a modified merle, and DNA work later found both genes. Merle itself was a disqualifying fault until the AKC accepted it in 2019. Even the size of the merle mutation matters — the longer a repetitive stretch inside it, the stronger the pattern, from 'cryptic' merles that look solid to the longest versions, found in harlequins.",
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
    activeTourStop?.location ??
    padLocation(geneEntry?.location) ??
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
    () => activeTourStop?.tracks ?? [],
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
                {liveBrowserOpen ? (
                  <Suspense
                    fallback={
                      <div className="genome-live-loading">
                        Loading genome browser&hellip;
                      </div>
                    }
                  >
                    <JBrowseEmbed
                      curatedGenes={curatedGenes}
                      location={liveLocation}
                      storyTracks={storyTracks}
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
                    {storyTracks.includes('repeats')
                      ? ' Below them, RepeatMasker shows the repeated DNA elements (SINEs, LINEs) scattered through the region — merle is one of these, a SINE inserted into the pigment gene.'
                      : null}
                    {storyTracks.includes('fgf4')
                      ? ' Below them, the footprint of the FGF4 retrocopy in 38 dogs from 10 breeds. All 19 short-legged dogs (Dachshund, Basset Hound, Cardigan Corgi, Cocker Spaniel, Lhasa Apso) carry two deletions marking the FGF4 gene\u2019s introns, a sign of an extra, intron-free copy elsewhere in the genome. None of the 19 dogs from five large breeds (Mastiff, Saint Bernard, Newfoundland, Scottish Deerhound, Bullmastiff) do. Great Danes are not in this cohort, so these large breeds, which we picked, stand in.'
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
