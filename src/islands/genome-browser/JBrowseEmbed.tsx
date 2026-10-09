import { useEffect, useMemo, useRef } from 'react'
import { isFeature } from '@jbrowse/core/util/simpleFeature'
import {
  EmbedProvider,
  LocationBox,
  RegionSeams,
  Scalebar,
  TrackStack,
  TrackToggle,
} from '@jbrowse/display-ui/embed'
import { createViewState } from '@jbrowse/react-linear-genome-view2'
import { observer } from 'mobx-react'

import {
  COAT_PANEL_CSI_URL,
  COAT_PANEL_VCF_URL,
  DOG10K_FGF4_CSI_URL,
  DOG10K_FGF4_VCF_URL,
  DOG10K_SV_TBI_URL,
  DOG10K_SV_VCF_URL,
} from './dog10kSvSource'

// UCSC's canFam4 (UU_Cfam_GSD_1.0) reference sequence, straight off hgdownload.
const CANFAM4_TWOBIT_URL =
  'https://hgdownload.soe.ucsc.edu/goldenPath/canFam4/bigZips/canFam4.2bit'
// Chromosome names and lengths, so the browser doesn't have to read them out of
// the 2bit file (the slow "Downloading chromosome sizes" step on first load).
const CANFAM4_CHROM_SIZES_URL =
  'https://hgdownload.soe.ucsc.edu/goldenPath/canFam4/bigZips/canFam4.chrom.sizes'

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

export type StoryTrackId = 'sv' | 'fgf4' | 'coat' | 'methylation' | 'lineLoss'

const STORY_TRACK_IDS: Record<StoryTrackId, string> = {
  sv: 'dog10k-longread-svs',
  fgf4: 'dog10k-fgf4-breeds',
  coat: 'dog10k-coat-panel',
  methylation: 'dog-aging-methylation',
  lineLoss: 'dog-aging-line-loss',
}

// A single hand-placed point of interest for a story (e.g. a published
// causal variant), drawn as its own small track above the gene tracks.
export interface StoryMarker {
  refName: string
  start: number
  end: number
  name: string
  description: string
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
  // duplication, breed genotypes for FGF4); elsewhere it is unrelated
  // noise, so the caller opts in per story.
  storyTracks: StoryTrackId[]
  markers: StoryMarker[]
  // The location box, zoom and track toggles; a story whose tracks are fixed
  // by the narrative can hide them.
  hideControls?: boolean
  // The full RefSeq annotation track; a story the curated genes already cover
  // can drop it.
  hideRefSeq?: boolean
}

const HIDDEN_FEATURE_KEYS = new Set([
  'refName',
  'start',
  'end',
  'strand',
  'type',
  'name',
  'uniqueId',
  'subfeatures',
])

type ViewState = ReturnType<typeof createViewState>

const FeaturePanel = observer(function FeaturePanel({
  session,
}: {
  session: ViewState['session']
}) {
  const { selection } = session
  if (!isFeature(selection)) return null
  const data = selection.toJSON()
  const rows = Object.entries(data).filter(
    ([key, value]) =>
      !HIDDEN_FEATURE_KEYS.has(key) &&
      value !== null &&
      typeof value !== 'object',
  )
  return (
    <div className="genome-feature-panel">
      <div className="genome-feature-title">
        <strong>{data.name ?? data.type ?? 'Feature'}</strong>
        <button type="button" onClick={() => session.clearSelection()}>
          Clear
        </button>
      </div>
      <div className="genome-feature-locus">
        {data.refName}:{data.start.toLocaleString()}-{data.end.toLocaleString()}
      </div>
      <dl>
        {rows.map(([key, value]) => (
          <div key={key}>
            <dt>{key}</dt>
            <dd>{String(value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
})

// Faint vertical lines under the scale bar's tick labels, running through
// every track.
const Gridlines = observer(function Gridlines({
  view,
}: {
  view: ViewState['session']['view']
}) {
  return (
    <div
      aria-hidden
      className="genome-gridlines"
      style={{ transform: `translateX(${view.staticBlocksTranslateX}px)` }}
    >
      {view.scalebarLabels.map(({ x }) => (
        <div key={x} style={{ left: x }} />
      ))}
    </div>
  )
})

const Controls = observer(function Controls({
  view,
  trackIds,
}: {
  view: ViewState['session']['view']
  trackIds: { id: string; label: string }[]
}) {
  return (
    <div className="genome-jbrowse-toolbar">
      <LocationBox view={view} />
      <button
        type="button"
        aria-label="Zoom out"
        onClick={() => view.zoom(view.bpPerPx * 2)}
      >
        −
      </button>
      <button
        type="button"
        aria-label="Zoom in"
        onClick={() => view.zoom(view.bpPerPx / 2)}
      >
        +
      </button>
      {trackIds.map(({ id, label }) => (
        <TrackToggle key={id} view={view} trackId={id}>
          {label}
        </TrackToggle>
      ))}
    </div>
  )
})

const STORY_TRACK_LABELS: Record<StoryTrackId, string> = {
  sv: 'Structural variants',
  fgf4: 'FGF4 breeds',
  coat: 'Coat SNPs',
  methylation: 'Methylation',
  lineLoss: 'Jumping genes',
}

export default function JBrowseEmbed({
  curatedGenes,
  location,
  storyTracks,
  markers,
  hideControls,
  hideRefSeq,
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
          height: 70,
        },
      ],
    }),
    [curatedGenes],
  )

  const markersTrack = useMemo(
    () => ({
      type: 'FeatureTrack',
      trackId: 'sevensisters-story-markers',
      name: 'Variants this story is about',
      assemblyNames: ['canFam4'],
      adapter: {
        type: 'FromConfigAdapter',
        features: markers.map(marker => ({
          ...marker,
          uniqueId: `marker-${marker.name}`,
        })),
      },
      displays: [
        {
          type: 'LinearBasicDisplay',
          displayId: 'sevensisters-story-markers-LinearBasicDisplay',
          color: '#1d6fa5',
          height: 70,
        },
      ],
    }),
    [markers],
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
              chromSizesLocation: { uri: CANFAM4_CHROM_SIZES_URL },
            },
          },
        },
        tracks: [
          markersTrack,
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
            displays: [
              {
                type: 'LinearBasicDisplay',
                displayId: 'canfam4-ncbi-refseq-LinearBasicDisplay',
                height: 190,
              },
            ],
          },
          {
            type: 'VariantTrack',
            trackId: STORY_TRACK_IDS.coat,
            name: 'SNP genotypes: other breeds and wolves (Dog10K)',
            assemblyNames: ['canFam4'],
            adapter: {
              type: 'VcfTabixAdapter',
              vcfGzLocation: { uri: COAT_PANEL_VCF_URL },
              index: {
                indexType: 'CSI',
                location: { uri: COAT_PANEL_CSI_URL },
              },
              samplesTsvLocation: {
                uri: new URL(
                  '/data/dog10k-coat-samples.tsv',
                  window.location.origin,
                ).href,
              },
            },
            displays: [
              {
                type: 'LinearMultiSampleVariantDisplay',
                displayId: 'dog10k-coat-panel-LinearMultiSampleVariantDisplay',
                rowColor: 'group',
                facet: 'group',
              },
            ],
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
            // Pooled methylation at the CpG sites the Dog Aging Project's
            // sequencing covered (Mariner, McCoy et al., Science 2026): one
            // row per age group, only near the genes the Aging story uses.
            type: 'MultiQuantitativeTrack',
            trackId: STORY_TRACK_IDS.methylation,
            name: 'Methylation (%): dogs under 3 vs dogs 8 and older',
            assemblyNames: ['canFam4'],
            adapter: {
              type: 'MultiWiggleAdapter',
              subadapters: [
                {
                  type: 'BedGraphAdapter',
                  name: 'Under 3 years (268 dogs)',
                  color: '#1d6fa5',
                  bedGraphLocation: {
                    uri: new URL(
                      '/data/dog-methylation-young.bedgraph',
                      window.location.origin,
                    ).href,
                  },
                },
                {
                  type: 'BedGraphAdapter',
                  name: '8 years and older (377 dogs)',
                  color: '#bf141c',
                  bedGraphLocation: {
                    uri: new URL(
                      '/data/dog-methylation-old.bedgraph',
                      window.location.origin,
                    ).href,
                  },
                },
              ],
            },
          },
          {
            // Per-site methylation lost per year at LINE (jumping-gene) sites
            // that lose methylation with age, from the Dog Aging Project's data
            // (Mariner, McCoy et al., Science 2026): smaller dogs, larger dogs,
            // and the difference. Computed by us; autosomes only.
            type: 'MultiQuantitativeTrack',
            trackId: STORY_TRACK_IDS.lineLoss,
            name: 'Jumping genes: methylation lost per year, by dog size',
            assemblyNames: ['canFam4'],
            adapter: {
              type: 'MultiWiggleAdapter',
              subadapters: [
                {
                  type: 'BedGraphAdapter',
                  name: 'Smaller dogs',
                  color: '#1d6fa5',
                  bedGraphLocation: {
                    uri: new URL(
                      '/data/dog-line-loss-small.bedgraph',
                      window.location.origin,
                    ).href,
                  },
                },
                {
                  type: 'BedGraphAdapter',
                  name: 'Larger dogs',
                  color: '#bf141c',
                  bedGraphLocation: {
                    uri: new URL(
                      '/data/dog-line-loss-large.bedgraph',
                      window.location.origin,
                    ).href,
                  },
                },
                {
                  type: 'BedGraphAdapter',
                  name: 'Larger minus smaller',
                  color: '#444444',
                  bedGraphLocation: {
                    uri: new URL(
                      '/data/dog-line-loss-diff.bedgraph',
                      window.location.origin,
                    ).href,
                  },
                },
              ],
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
            ...(markers.length ? ['sevensisters-story-markers'] : []),
            'sevensisters-curated-genes',
            ...(hideRefSeq ? [] : ['canfam4-ncbi-refseq']),
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
    // A switch made while the browser is still loading its tracks is rejected,
    // so retry for a while rather than dropping it. Stop if the location has
    // moved on or the component is gone.
    let cancelled = false
    const tryNavigate = (attemptsLeft: number) => {
      viewState.session.view.navToLocString(location).catch(() => {
        if (cancelled || attemptsLeft <= 0) return
        setTimeout(() => tryNavigate(attemptsLeft - 1), 1000)
      })
    }
    tryNavigate(15)
    return () => {
      cancelled = true
    }
  }, [location, viewState])

  useEffect(() => {
    const view = viewState.session.view
    for (const [id, trackId] of Object.entries(STORY_TRACK_IDS)) {
      if (storyTracks.includes(id as StoryTrackId)) view.showTrack(trackId)
      else view.hideTrack(trackId)
    }
  }, [storyTracks, viewState])

  useEffect(() => {
    const view = viewState.session.view
    if (markers.length) view.showTrack('sevensisters-story-markers')
    else view.hideTrack('sevensisters-story-markers')
  }, [markers, viewState])

  const { session } = viewState
  const toggles = [
    ...(markers.length
      ? [{ id: 'sevensisters-story-markers', label: 'Variants' }]
      : []),
    { id: 'sevensisters-curated-genes', label: 'Curated genes' },
    ...(hideRefSeq
      ? []
      : [{ id: 'canfam4-ncbi-refseq', label: 'RefSeq genes' }]),
    ...storyTracks.map(id => ({
      id: STORY_TRACK_IDS[id],
      label: STORY_TRACK_LABELS[id],
    })),
  ]

  return (
    <div className="genome-jbrowse-embed">
      <EmbedProvider session={session}>
        {hideControls ? null : (
          <Controls view={session.view} trackIds={toggles} />
        )}
        <div className="genome-jbrowse-body">
          <TrackStack view={session.view} style={{ flex: 1, minWidth: 0 }}>
            <Scalebar view={session.view} />
            <Gridlines view={session.view} />
            <RegionSeams view={session.view} />
          </TrackStack>
          <FeaturePanel session={session} />
        </div>
      </EmbedProvider>
    </div>
  )
}
