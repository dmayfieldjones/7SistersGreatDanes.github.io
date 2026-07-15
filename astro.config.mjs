import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build
export default defineConfig({
  site: 'https://7sistersgreatdanes.com',
  outDir: './out',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
})
