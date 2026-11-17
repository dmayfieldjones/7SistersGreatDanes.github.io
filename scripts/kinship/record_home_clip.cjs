// Records the GDGalaxy home animation (public/dog-page-demo.html) into a short mp4 and a poster image.
//   node scripts/kinship/record_home_clip.cjs [baseUrl]      (default http://localhost:4321; needs playwright and ffmpeg)
// The page's animation runs on the timestamp it is handed, so this swaps in a fake clock and steps it
// one frame at a time: the clip is exact and does not depend on how fast the machine renders.
const { chromium } = require('playwright'), { execFileSync } = require('child_process'), fs = require('fs'), path = require('path')
const BASE = process.argv[2] || 'http://localhost:4321', FPS = 24
const OUT = path.resolve(__dirname, '../../public'), TMP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'homeclip-'))
;(async () => {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 900, height: 900 }, deviceScaleFactor: 2 })
  await p.addInitScript(() => {
    sessionStorage.setItem('pv-ok-all', '1'); window.__q = []; window.__id = 0
    window.requestAnimationFrame = f => { window.__q.push(f); return ++window.__id }
    window.cancelAnimationFrame = () => {}
    window.__step = ts => { const q = window.__q; window.__q = []; q.forEach(f => f(ts)) }
  })
  await p.goto(BASE + '/dog-page-demo.html?live', { waitUntil: 'load' })
  const cap = () => p.evaluate(() => (document.getElementById('homecap') || {}).textContent)
  let ts = 0
  for (let i = 0; i < 400 && /Loading/.test(await cap() || 'Loading'); i++) { await p.evaluate(t => window.__step(t), ts); await p.waitForTimeout(100) }
  const box = p.locator('.galwrap'); await box.scrollIntoViewIfNeeded()
  await p.evaluate(() => document.querySelector('.galwrap').scrollIntoView())
  const cycle = await p.evaluate(() => window.__cycle || 0)
  const total = Math.round(65.8 * FPS)   // one full cycle: build, the constellation tour, Piper's finale
  for (let f = 0; f < total; f++) {
    await p.evaluate(t => window.__step(t), 1000 + (f / FPS) * 1000)
    await box.screenshot({ path: path.join(TMP, String(f).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 95 })
  }
  await b.close()
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(TMP, '%05d.jpg'), '-vf', 'crop=trunc(iw/2)*2:trunc(ih/2)*2:0:0', '-c:v', 'libx264', '-crf', '31', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', path.join(OUT, 'video/galaxy-home.mp4')])
  const frame = s => path.join(TMP, String(Math.round(s * FPS)).padStart(5, '0') + '.jpg')
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', frame(18), '-q:v', '3', path.join(OUT, 'img/galaxy-home-poster.jpg')])
  // 1200x630 link-preview image: the whole galaxy with its labels, just as the tour begins
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', frame(11.5), '-vf', 'scale=1200:-1:flags=lanczos,crop=1200:630:0:12', '-q:v', '3', path.join(OUT, 'img/galaxy-og.jpg')])
  console.log('wrote the clip, poster and share image (public/video/galaxy-home.mp4, public/img/galaxy-home-poster.jpg, public/img/galaxy-og.jpg) from', TMP)
})()
