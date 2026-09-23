import { useEffect, useMemo, useRef } from 'react'
import {
  createViewState,
  JBrowseLinearGenomeView,
} from '@jbrowse/react-linear-genome-view2'

// jbrowse.org's hosted canFam4 config (https://jbrowse.org/ucsc/canFam4/config.json)
// isn't served with CORS headers, so its gene track can't be fetched client-side
// from our origin. The UCSC-hosted 2bit sequence *does* send
// `Access-Control-Allow-Origin: *`, so we use that directly for the reference
// sequence and supply our own CORS-friendly tracks instead.
const CANFAM4_TWOBIT_URL =
  'https://hgdownload.soe.ucsc.edu/goldenPath/canFam4/bigZips/canFam4.2bit'

// Structural variants genotyped (long-read + short-read + assembly + Paragraph)
// across 12 long-read dog genomes, including the Great Dane "Zoey" assembly.
// Schall & Kidd 2025, Zenodo record 14968874. Confirmed CORS + byte-range
// support directly from Zenodo's file store.
const DOG10K_SV_VCF_URL =
  'https://zenodo.org/api/records/14968874/files/SV_12_samples.all_modalities.vcf.gz/content'
const DOG10K_SV_TBI_URL =
  'https://zenodo.org/api/records/14968874/files/SV_12_samples.all_modalities.vcf.gz.tbi/content'

export interface CuratedGeneFeature {
  refName: string
  start: number
  end: number
  name: string
  category: string
}

interface JBrowseEmbedProps {
  curatedGenes: CuratedGeneFeature[]
  location: string
}

export default function JBrowseEmbed({
  curatedGenes,
  location,
}: JBrowseEmbedProps) {
  const curatedGenesTrack = useMemo(
    () => ({
      type: 'FeatureTrack',
      trackId: 'sevensisters-curated-genes',
      name: "7Sisters' curated Great Dane gene catalog",
      assemblyNames: ['canFam4'],
      adapter: {
        type: 'FromConfigAdapter',
        features: curatedGenes.map(gene => ({
          refName: gene.refName,
          start: gene.start,
          end: gene.end,
          name: gene.name,
          category: gene.category,
          uniqueId: `curated-${gene.name}`,
        })),
      },
    }),
    [curatedGenes],
  )

  const viewState = useMemo(
    () =>
      createViewState({
        assembly: {
          name: 'canFam4',
          sequence: {
            type: 'ReferenceSequenceTrack',
            trackId: 'canFam4-refseq',
            adapter: {
              type: 'TwoBitAdapter',
              uri: CANFAM4_TWOBIT_URL,
            },
          },
        },
        tracks: [
          curatedGenesTrack,
          {
            type: 'VariantTrack',
            trackId: 'dog10k-longread-svs',
            name: 'Dog10K long-read structural variants (12 breeds incl. Great Dane)',
            assemblyNames: ['canFam4'],
            adapter: {
              type: 'VcfTabixAdapter',
              vcfGzLocation: { uri: DOG10K_SV_VCF_URL },
              index: { location: { uri: DOG10K_SV_TBI_URL } },
            },
          },
        ],
        location,
        view: {
          tracks: ['sevensisters-curated-genes', 'dog10k-longread-svs'],
        },
      }),
    // Only build the view state once; navigation after that goes through
    // viewState.session.view.navToLocString in the effect below.
    [],
  )

  const lastLocation = useRef(location)
  useEffect(() => {
    if (location === lastLocation.current) return
    lastLocation.current = location
    viewState.session.view.navToLocString(location).catch(() => {
      /* invalid/out-of-range location string; ignore */
    })
  }, [location, viewState])

  return (
    <div className="genome-jbrowse-embed">
      <JBrowseLinearGenomeView viewState={viewState} />
    </div>
  )
}
