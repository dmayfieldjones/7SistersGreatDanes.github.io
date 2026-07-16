import { useState } from 'react'

import GenomeIdeogram, { type ChromosomeInfo } from './GenomeIdeogram'

interface DescriptionComponentProps {
  geneEntry: Record<string, string>
}

function DescriptionComponent({ geneEntry }: DescriptionComponentProps) {
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

  function selectType(newType: string) {
    setType(newType)
    setGene('')
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
                    onClick={() => selectGene(entry.name)}
                  >
                    {entry.name}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          {geneEntry ? <DescriptionComponent geneEntry={geneEntry} /> : null}
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
