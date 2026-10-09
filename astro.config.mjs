import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build
export default defineConfig({
  site: 'https://7sistersgreatdanes.com',
  outDir: './out',
  redirects: {
    '/posts/2026-10-08-darwins-reversal': '/posts/2026-10-09-selecting-for-beauty-breed-standards-and-the-galapagos',
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
})
