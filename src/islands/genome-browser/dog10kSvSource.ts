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
// Lives in its own tiny module, not inside JBrowseEmbed.tsx: that whole file
// is the lazy-loaded JBrowse chunk, and Browser.tsx needs these URLs (for
// the prefetch below) *before* triggering that load, not as part of it.
export const DOG10K_SV_VCF_URL = '/data/dog10k-svs-12breeds.vcf.bgz'
export const DOG10K_SV_TBI_URL = '/data/dog10k-svs-12breeds.vcf.bgz.tbi'

/**
 * GitHub Pages' CDN can serve a plain 200 that ignores the Range header on
 * the very first request to a freshly-deployed large file, before the edge
 * has it cached — which JBrowse treats as a hard, user-facing error, since
 * range support is required for tabix access. A plain, unranged fetch here
 * warms that same cache entry before JBrowse's own range-fetching logic
 * (triggered moments later, once its lazy chunk and view state finish
 * setting up) ever touches the file, so by the time it does, the object is
 * already cached and serving 206s. Call this as early as possible — right
 * when `liveBrowserOpen` is set, not after. Best-effort only: a failed
 * prefetch here isn't itself a problem, so errors are swallowed.
 */
export function prefetchDog10kSvVcf() {
  for (const path of [DOG10K_SV_VCF_URL, DOG10K_SV_TBI_URL]) {
    fetch(new URL(path, window.location.origin).href, {
      cache: 'force-cache',
    }).catch(() => {
      /* best-effort warmup; JBrowse's own fetch will surface any real problem */
    })
  }
}
