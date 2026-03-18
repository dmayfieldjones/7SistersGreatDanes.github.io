import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Ezra × Piper — 10-Generation Pedigree | 7Sisters Farm',
  description:
    '10-generation pedigree analysis for Ezra × Piper. Wright\'s COI 4.04%, common ancestors, structural findings.',
}

export default function PedigreePage() {
  return (
    <div className="content">
      <div className="pedigree-top-bar">
        <Link href="/EzraxPiper">← Back to Litter</Link>
      </div>
      <section className="pedigree-viz-section">
        <iframe
          src="/ezra-piper-pedigree.html"
          title="Ezra × Piper 10-Generation Pedigree"
          className="pedigree-iframe"
        />
      </section>
      <style dangerouslySetInnerHTML={{ __html: `
        :root { --primary-color: #bf141c; --spacing-unit: 1rem; }
        .pedigree-top-bar { padding: calc(var(--spacing-unit) * 1) calc(var(--spacing-unit) * 2); }
        .pedigree-top-bar a { color: var(--primary-color); font-weight: 600; text-decoration: none; font-size: 0.95rem; }
        .pedigree-top-bar a:hover { text-decoration: underline; }
        .pedigree-viz-section { width: 100vw; position: relative; left: 50%; right: 50%; margin-left: -50vw; margin-right: -50vw; overflow: hidden; padding: 0 calc(var(--spacing-unit) * 2); box-sizing: border-box; }
        .pedigree-iframe { width: 100%; min-height: 1400px; border: 1px solid #e0e0e0; border-radius: 8px; display: block; background: #fff; }
      ` }} />
    </div>
  )
}
