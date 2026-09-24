// Structural variants genotyped (long-read + short-read + assembly +
// Paragraph) across 12 long-read dog genomes, including the Great Dane
// "Zoey" assembly. Schall & Kidd 2025, Zenodo record 14968874.
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
// breed lookup used for row coloring/grouping in JBrowseEmbed.
//
// `.bgz` rather than `.vcf.gz`: several static file servers (including
// Astro's own dev/preview server) auto-add `Content-Encoding: gzip` for a
// `.gz` extension, transparently decompressing the response — which breaks
// range requests entirely, since JBrowse needs the raw bgzip bytes to
// decompress its own blocks on demand. `.bgz` isn't recognized, so it's
// served as opaque binary instead.
//
// Hosted on S3 (bucket `7sistersgreatdanes-genome-data`, us-east-2), not in
// this repo's own public/ — GitHub Pages' CDN turned out to unreliably
// ignore Range headers on a freshly-deployed large file until its edge
// cache warmed up (a real, reproduced bug, not a one-off), which JBrowse
// treats as a hard error since range support is required for tabix access.
// S3 serves Range requests directly and consistently, with no such
// cache-warmup dependency. Public read is scoped to the bucket's `data/*`
// prefix only (not full public access), with CORS configured for browser
// fetches.
//
// Lives in its own tiny module, not inside JBrowseEmbed.tsx: that whole file
// is the lazy-loaded JBrowse chunk, and Browser.tsx needs these URLs (for
// the prefetch below) *before* triggering that load, not as part of it.
const S3_BASE =
  'https://7sistersgreatdanes-genome-data.s3.us-east-2.amazonaws.com/data'
export const DOG10K_SV_VCF_URL = `${S3_BASE}/dog10k-svs-12breeds.vcf.bgz`
export const DOG10K_SV_TBI_URL = `${S3_BASE}/dog10k-svs-12breeds.vcf.bgz.tbi`

/**
 * A plain fetch of the same URLs JBrowse itself will request, fired the
 * moment `liveBrowserOpen` is set rather than waiting for JBrowse's own lazy
 * chunk and view state to finish setting up moments later — mainly to get
 * the TLS handshake to this S3 bucket (a different origin than the rest of
 * the site) out of the way early, rather than paying for it right when the
 * first range request needs to go out. Best-effort only: a failed prefetch
 * here isn't itself a problem, so errors are swallowed.
 */
export function prefetchDog10kSvVcf() {
  for (const url of [DOG10K_SV_VCF_URL, DOG10K_SV_TBI_URL]) {
    fetch(url, { cache: 'force-cache' }).catch(() => {
      /* best-effort warmup; JBrowse's own fetch will surface any real problem */
    })
  }
}
