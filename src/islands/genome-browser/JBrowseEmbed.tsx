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
// Schall & Kidd 2025, Zenodo record 14968874.
//
// Re-hosted rather than read live from Zenodo: the original 45-column,
// 388 MB VCF names samples by opaque code ("Zoey_PA") with no way to relabel
// a canvas-rendered row from config alone, and duplicates the full ref/alt
// sequence per sample on top of the record-level REF/ALT (FORMAT/RAL,
// FORMAT/AAL). This derived copy keeps one genotyped column per dog (the
// Paragraph call, or long-read for Basenji "China", which Paragraph wasn't
// run for), renamed to "Breed (code)" so the row label reads as a breed
// without needing a hover, drops the redundant per-sample sequence fields,
// and swaps sequence >40bp for standard symbolic <DEL>/<INS> notation
// (SVTYPE/SVLEN/computed END already carry the size) — 388 MB down to 44 MB.
// Built with pysam from the original file; original sample/genotype/INFO
// data otherwise untouched. See public/data/dog10k-svs-samples.tsv for the
// breed lookup used for row coloring/grouping below.
// `.bgz` rather than `.vcf.gz`: several static file servers (including
// Astro's own dev/preview server) auto-add `Content-Encoding: gzip` for a
// `.gz` extension, transparently decompressing the response — which breaks
// range requests entirely, since JBrowse needs the raw bgzip bytes to
// decompress its own blocks on demand. `.bgz` isn't recognized, so it's
// served as opaque binary instead.
const DOG10K_SV_VCF_URL = '/data/dog10k-svs-12breeds.vcf.bgz'
const DOG10K_SV_TBI_URL = '/data/dog10k-svs-12breeds.vcf.bgz.tbi'

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
              vcfGzLocation: {
                uri: new URL(DOG10K_SV_VCF_URL, window.location.origin).href,
              },
              index: {
                location: {
                  uri: new URL(DOG10K_SV_TBI_URL, window.location.origin).href,
                },
              },
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
                // Rows are already labeled "Breed (code)" in the VCF itself;
                // this also bands and colors them by breed so, e.g., both
                // Bernese Mountain Dog rows group together visually.
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
