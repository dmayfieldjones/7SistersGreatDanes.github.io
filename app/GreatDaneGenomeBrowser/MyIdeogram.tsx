import ReactIdeogram from './Ideogram'

export default function MyIdeogram({
  selectedGene,
  setGene,
  geneCategories,
}: {
  selectedGene?: string
  setGene: (arg: string) => void
  geneCategories: any[]
}) {
  const annotations = geneCategories
    .map(r => {
      const { type, location, name } = r
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
    .filter(f => !!f)
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
        const f = geneCategories?.find(f => f.name === arg.name)?.type
        if (f) {
          setGene(arg.name)
        }
      }}
    />
  )
}
