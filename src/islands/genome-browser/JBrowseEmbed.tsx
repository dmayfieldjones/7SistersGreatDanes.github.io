import { useEffect, useMemo, useRef } from 'react'
import {
  createViewState,
  JBrowseLinearGenomeView,
} from '@jbrowse/react-linear-genome-view2'

import {
  DOG10K_FGF4_CSI_URL,
  DOG10K_FGF4_VCF_URL,
  DOG10K_SV_TBI_URL,
  DOG10K_SV_VCF_URL,
} from './dog10kSvSource'

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

// See dog10kSvSource.ts for what this VCF is, how it was built, and why.
const DOG10K_SAMPLES_TSV_URL = '/data/dog10k-svs-samples.tsv'

export type StoryTrackId = 'sv' | 'repeats' | 'fgf4'

const STORY_TRACK_IDS: Record<StoryTrackId, string> = {
  sv: 'dog10k-longread-svs',
  repeats: 'canfam4-rmsk',
  fgf4: 'dog10k-fgf4-breeds',
}

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
  // Story-specific evidence tracks to show on top of the gene tracks. Each is
  // only the right evidence for some stories (the SV track for the AMY2B
  // duplication, repeats for the merle insertion); elsewhere it is unrelated
  // noise, so the caller opts in per story.
  storyTracks: StoryTrackId[]
}

export default function JBrowseEmbed({
  curatedGenes,
  location,
  storyTracks,
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
            // Same hosted UCSC mirror (and CORS behavior) as the RefSeq track.
            type: 'FeatureTrack',
            trackId: STORY_TRACK_IDS.repeats,
            name: 'RepeatMasker (SINEs, LINEs and other repeats)',
            assemblyNames: ['canFam4'],
            adapter: {
              type: 'BedTabixAdapter',
              bedGzLocation: {
                uri: 'https://jbrowse.org/ucsc/canFam4/rmsk.bed.gz',
              },
              index: {
                indexType: 'CSI',
                location: {
                  uri: 'https://jbrowse.org/ucsc/canFam4/rmsk.bed.gz.csi',
                },
              },
            },
          },
          {
            type: 'VariantTrack',
            trackId: STORY_TRACK_IDS.fgf4,
            name: 'FGF4 retrocopy footprint: short-legged vs large breeds (Dog10K)',
            assemblyNames: ['canFam4'],
            adapter: {
              type: 'VcfTabixAdapter',
              vcfGzLocation: { uri: DOG10K_FGF4_VCF_URL },
              index: {
                indexType: 'CSI',
                location: { uri: DOG10K_FGF4_CSI_URL },
              },
              samplesTsvLocation: {
                uri: new URL(
                  '/data/dog10k-fgf4-samples.tsv',
                  window.location.origin,
                ).href,
              },
            },
            displays: [
              {
                type: 'LinearMultiSampleVariantDisplay',
                displayId: 'dog10k-fgf4-breeds-LinearMultiSampleVariantDisplay',
                rowColor: 'group',
                facet: 'group',
              },
            ],
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
            ...storyTracks.map(id => STORY_TRACK_IDS[id]),
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

  useEffect(() => {
    const view = viewState.session.view
    for (const [id, trackId] of Object.entries(STORY_TRACK_IDS)) {
      if (storyTracks.includes(id as StoryTrackId)) view.showTrack(trackId)
      else view.hideTrack(trackId)
    }
  }, [storyTracks, viewState])

  return (
    <div className="genome-jbrowse-embed">
      <JBrowseLinearGenomeView viewState={viewState} />
    </div>
  )
}
