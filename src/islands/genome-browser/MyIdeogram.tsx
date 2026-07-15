import ReactIdeogram from './Ideogram'

interface MyIdeogramProps {
  selectedGene?: string
  setGene: (gene: string) => void
  geneCategories: Record<string, string>[]
}

export default function MyIdeogram({
  selectedGene,
  setGene,
  geneCategories,
}: MyIdeogramProps) {
  const annotations = geneCategories
    .map(entry => {
      const { type, location, name } = entry
      if (location) {
        const [chr, rest] = location.split(':')
        const [start, stop] = rest.split('-')
        return {
          name,
          type,
          color: name === selectedGene ? 'blue' : '#bf141c',
          chr: chr.replace('chr', ''),
          start: +start.replaceAll(',', ''),
          stop: +stop.replaceAll(',', ''),
        }
      } else {
        return undefined
      }
    })
    .filter(annotation => !!annotation)

  return (
    <ReactIdeogram
      columns={2}
      organism="canis-lupus-familiaris"
      rotatable={false}
      chrWidth={10}
      chrHeight={Math.min(window.innerWidth - 120, 500)}
      showNonNuclearChromosomes={true}
      orientation="horizontal"
      annotations={annotations}
      onClickAnnot={(arg: { name: string }) => {
        const type = geneCategories.find(entry => entry.name === arg.name)?.type
        if (type) {
          setGene(arg.name)
        }
      }}
    />
  )
}
