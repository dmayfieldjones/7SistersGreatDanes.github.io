import { useState } from 'react'

import GenomeIdeogram, { type ChromosomeInfo } from './GenomeIdeogram'

export interface Dog10kGeneSummary {
  variantCount: number
  passVariantCount: number
  commonVariantCount: number
  maxAlleleFrequency: number
  cohortAlleleNumberMax: number
}

export interface Dog10kMeta {
  source: string
  sourceUrl: string
  doi: string
  citation: string
  license: string
  caveat: string
}

interface DescriptionComponentProps {
  geneEntry: Record<string, string>
  dog10kVariants: Record<string, Dog10kGeneSummary>
  dog10kMeta: Dog10kMeta
}

function DescriptionComponent({
  geneEntry,
  dog10kVariants,
  dog10kMeta,
}: DescriptionComponentProps) {
  const dog10k = dog10kVariants[geneEntry.name2]

  return (
    <div className="genome-description">
      <strong>{geneEntry.name}</strong> - {geneEntry.summary}{' '}
      {geneEntry.citations
        ?.split(';')
        .map((citation, idx) => (
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
      {dog10k ? (
        <div className="genome-population-data">
          <div className="genome-population-title">
            Population variant data (Dog10K Genomes Project)
          </div>
          <div className="genome-population-stats">
            <span>{dog10k.variantCount.toLocaleString()} variant sites observed</span>
            <span>{dog10k.commonVariantCount.toLocaleString()} common (&ge;1% frequency)</span>
            <span>
              highest allele frequency:{' '}
              {(dog10k.maxAlleleFrequency * 100).toLocaleString(undefined, {
                maximumFractionDigits: 1,
              })}
              %
            </span>
          </div>
          <div className="genome-population-caveat">
            {dog10kMeta.caveat} Source:{' '}
            <a href={dog10kMeta.sourceUrl} target="_blank">
              {dog10kMeta.source}
            </a>
            , licensed {dog10kMeta.license}.
          </div>
        </div>
      ) : null}
    </div>
  )
}

interface BrowserProps {
  geneCategories: Record<string, string>[]
  chromosomes: ChromosomeInfo[]
  dog10kVariants: Record<string, Dog10kGeneSummary>
  dog10kMeta: Dog10kMeta
}

export default function Browser({
  geneCategories,
  chromosomes,
  dog10kVariants,
  dog10kMeta,
}: BrowserProps) {
  const [type, setType] = useState('all')
  const [gene, setGene] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  // Treat 'all' and empty string the same - show all genes
  const effectiveType = type === '' ? 'all' : type

  const categories = [
    ...new Set<string>(geneCategories.map(entry => entry.type)),
  ].toSorted()

  const placedGenes = geneCategories.filter(entry => !!entry.location)
  const unplacedGenes = geneCategories.filter(entry => !entry.location)
  const geneEntry = geneCategories.find(entry => entry.name === gene)

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
          <p />
          <span className="accent-color">7</span>Sisters Genome Browser
          (CanFam4)
          <br />
          <br />
          Search for a gene, or filter by category, then explore its position
          on the genome below.
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
                        onClick={() => selectGene(entry.name)}
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
                onClick={() => setType('all')}
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
                  onClick={() => setType(category)}
                >
                  {category} (
                  {geneCategories.filter(e => e.type === category).length})
                </button>
              ))}
            </div>
          </div>
          {geneEntry ? (
            <DescriptionComponent
              geneEntry={geneEntry}
              dog10kVariants={dog10kVariants}
              dog10kMeta={dog10kMeta}
            />
          ) : null}
        </main>
      </div>
      <GenomeIdeogram
        chromosomes={chromosomes}
        annotations={annotations}
        selectedGene={gene}
        activeCategory={effectiveType}
        onSelectGene={selectGene}
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
                    onClick={() => selectGene(entry.name)}
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
