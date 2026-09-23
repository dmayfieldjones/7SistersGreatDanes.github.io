import { useEffect, useMemo, useRef } from 'react'
import {
  createViewState,
  JBrowseLinearGenomeView,
} from '@jbrowse/react-linear-genome-view2'

// UCSC's canFam4 (UU_Cfam_GSD_1.0) reference sequence, straight off hgdownload.
const CANFAM4_TWOBIT_URL =
  'https://hgdownload.soe.ucsc.edu/goldenPath/canFam4/bigZips/canFam4.2bit'

// The full NCBI RefSeq gene annotation for canFam4, as jbrowse.org's hosted
// UCSC mirror serves it (genomes.jbrowse.org's "UCSC" hub listing links here
// for canFam4). It only sends CORS headers when the request carries an
// `Origin` — a plain `curl -I` won't show them, but a browser's cross-origin
// fetch always sends one, and range requests work fine (verified directly
// against this URL with an Origin header set).
const NCBI_REFSEQ_GFF_URL = 'https://jbrowse.org/ucsc/canFam4/ncbiRefSeq.gff.gz'
const NCBI_REFSEQ_CSI_URL =
  'https://jbrowse.org/ucsc/canFam4/ncbiRefSeq.gff.gz.csi'

// Structural variants genotyped (long-read + short-read + assembly + Paragraph)
// across 12 long-read dog genomes, including the Great Dane "Zoey" assembly.
// Schall & Kidd 2025, Zenodo record 14968874. Confirmed CORS + byte-range
// support directly from Zenodo's file store.
const DOG10K_SV_VCF_URL =
  'https://zenodo.org/api/records/14968874/files/SV_12_samples.all_modalities.vcf.gz/content'
const DOG10K_SV_TBI_URL =
  'https://zenodo.org/api/records/14968874/files/SV_12_samples.all_modalities.vcf.gz.tbi/content'

// Which VCF sample column is which breed (12 dogs, one column each — the
// Paragraph-regenotyped call, except Basenji "China", which that modality
// wasn't run for, so it falls back to its long-read call). Also acts as an
// allow-list: the multi-sample display only draws rows for VCF samples that
// appear here, so this hides the other three genotyping-modality columns
// per dog (_LR/_AS/_SR/_PA) that would otherwise clutter the matrix.
const DOG10K_SAMPLES_TSV_URL = '/data/dog10k-svs-samples.tsv'

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
      displays: [
        {
          type: 'LinearBasicDisplay',
          displayId: 'sevensisters-curated-genes-LinearBasicDisplay',
          color: '#bf141c',
        },
      ],
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
            type: 'FeatureTrack',
            trackId: 'canfam4-ncbi-refseq',
            name: 'NCBI RefSeq genes',
            assemblyNames: ['canFam4'],
            adapter: {
              type: 'Gff3TabixAdapter',
              gffGzLocation: { uri: NCBI_REFSEQ_GFF_URL },
              index: {
                indexType: 'CSI',
                location: { uri: NCBI_REFSEQ_CSI_URL },
              },
            },
          },
          {
            type: 'VariantTrack',
            trackId: 'dog10k-longread-svs',
            name: 'Dog10K long-read structural variants (12 breeds incl. Great Dane)',
            assemblyNames: ['canFam4'],
            adapter: {
              type: 'VcfTabixAdapter',
              vcfGzLocation: { uri: DOG10K_SV_VCF_URL },
              index: { location: { uri: DOG10K_SV_TBI_URL } },
              samplesTsvLocation: {
                uri: new URL(DOG10K_SAMPLES_TSV_URL, window.location.origin)
                  .href,
              },
            },
            displays: [
              {
                type: 'LinearMultiSampleVariantDisplay',
                displayId:
                  'dog10k-longread-svs-LinearMultiSampleVariantDisplay',
                // Groups and colors the 12 rows by breed instead of by raw
                // VCF sample code (e.g. "Zoey_PA"), from the breed column in
                // the samplesTsv above.
                rowColor: 'breed',
                facet: 'breed',
              },
            ],
          },
        ],
        location,
        view: {
          tracks: [
            'sevensisters-curated-genes',
            'canfam4-ncbi-refseq',
            'dog10k-longread-svs',
          ],
        },
        configuration: {
          theme: {
            palette: {
              primary: { main: '#bf141c' },
              secondary: { main: '#1d6fa5' },
            },
          },
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
