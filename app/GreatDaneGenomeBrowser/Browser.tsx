'use client'
import { useState } from 'react'

import dynamic from 'next/dynamic'

const MyIdeogram = dynamic(() => import('./MyIdeogram'), {
  ssr: false,
})

function DescriptionComponent({ geneEntry }: { geneEntry: any }) {
  return (
    <div style={{ margin: 20 }}>
      {geneEntry.name} - {geneEntry?.summary}{' '}
      {geneEntry.citations?.split(';').map((c: any, idx: number) => (
        <a key={c} target="_blank" href={geneEntry[`doi${idx + 1}`]}>
          {c}
        </a>
      ))}
    </div>
  )
}

export default function Browser({
  geneCategories,
}: {
  geneCategories: {
    type: string
    name2: string
    name: string
    location: string
  }[]
}) {
  const [type, setType] = useState('')
  const [gene, setGene] = useState('')

  const categories = [
    'all',
    ...new Set<string>(geneCategories.map(f => f.type)),
  ]
  const currentCategory = (
    type === 'all'
      ? geneCategories
      : geneCategories.filter(f => f.type === type)
  ).filter(f => !!f.location)
  const geneEntry = currentCategory?.find(f => f.name === gene)
  return (
    <div>
      <div>
        <div className="content">
          <main className="content-wrapper">
            {/* Hero Section */}
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
            Select a category of genes, then an individual gene/locus to learn
            more about it
            <br />
            <div id="geneSelector">
              <select
                value={type}
                onChange={event => setType(event.target.value)}
                id="categorySelect"
              >
                <option value="">Select a category</option>
                {categories.toSorted().map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                value={gene}
                id="geneSelect"
                onChange={event => {
                  setGene(event.target.value)
                }}
              >
                <option value="">
                  Select a gene {type ? `(${type} related)` : ''}
                </option>
                {currentCategory
                  .toSorted((a, b) => a.name.localeCompare(b.name))
                  .map(entry => (
                    <option key={entry.name} value={entry.name}>
                      {entry.name}
                    </option>
                  ))}
              </select>{' '}
              {currentCategory.length
                ? `(${currentCategory.length} genes)`
                : ''}
              {geneEntry ? (
                <div>
                  <DescriptionComponent geneEntry={geneEntry} />

                  {geneEntry.location ? (
                    <ul>
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
              ) : null}
            </div>
            <div id="buttonarea" /> <div id="summary" />
          </main>
        </div>
      </div>
      <div>
        {type ? (
          <MyIdeogram
            selectedGene={gene}
            setGene={setGene}
            geneCategories={currentCategory}
          />
        ) : null}
      </div>
    </div>
  )
}
