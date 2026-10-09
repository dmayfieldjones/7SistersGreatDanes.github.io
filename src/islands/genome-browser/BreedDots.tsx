import samplesTsv from '../../../public/data/dog10k-fgf4-samples.tsv?raw'

// One dot per dog, grouped by breed: filled = carries the FGF4 retrocopy
// footprint (the two intron deletions), open = does not. The calls follow the
// groups in dog10k-fgf4-samples.tsv: every short-legged dog has them, none of
// the large-breed dogs do. Great Danes aren't in this cohort.
const dogs = samplesTsv
  .trim()
  .split('\n')
  .slice(1)
  .map(line => {
    const [, breed, group] = line.split('\t')
    return { breed, carries: group === 'short-legged' }
  })

const breeds = [...new Set(dogs.map(d => d.breed))]
  .map(breed => ({
    breed,
    carries: dogs.find(d => d.breed === breed)!.carries,
    count: dogs.filter(d => d.breed === breed).length,
  }))
  .toSorted(
    (a, b) =>
      Number(b.carries) - Number(a.carries) || a.breed.localeCompare(b.breed),
  )

export default function BreedDots() {
  const carriers = dogs.filter(d => d.carries).length
  return (
    <figure className="gene-strip breed-dots">
      <figcaption className="gene-strip-title">
        The short-leg gene copy in {dogs.length} dogs
      </figcaption>
      <ul className="breed-dots-list">
        {breeds.map(b => (
          <li key={b.breed}>
            <span className="breed-dots-name">{b.breed}</span>
            <span
              className="breed-dots-dots"
              aria-label={`${b.count} dogs, ${b.carries ? 'all carry' : 'none carry'} the extra copy`}
            >
              {Array.from({ length: b.count }, (_, i) => (
                <span
                  key={i}
                  className={'breed-dot' + (b.carries ? ' breed-dot-on' : '')}
                />
              ))}
            </span>
          </li>
        ))}
      </ul>
      <p className="gene-strip-caption">
        Filled dot = carries the extra FGF4 copy ({carriers} short-legged dogs).
        Open dot = does not ({dogs.length - carriers} dogs from large breeds).
        Great Danes aren&rsquo;t in this dataset, so these large breeds stand
        in.
      </p>
    </figure>
  )
}
