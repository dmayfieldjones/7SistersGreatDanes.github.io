import { SITE_TIKTOK_EMBED_URL } from '@/lib/site'

export default function TikTokSection() {
  return (
    <section className="site-tiktok-section" aria-label="7Sisters Great Danes on TikTok">
      <div className="site-tiktok-embed-wrap">
        <iframe
          src={SITE_TIKTOK_EMBED_URL}
          className="site-tiktok-embed"
          title="7Sisters Great Danes on TikTok"
          loading="lazy"
          allow="encrypted-media; fullscreen"
        />
      </div>
    </section>
  )
}
