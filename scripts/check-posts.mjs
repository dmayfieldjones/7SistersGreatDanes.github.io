// CI guard: a published post (anything without `draft: true`) must not contain
// placeholder markers or an invalid date. Run before the build.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = 'src/_posts'
const markers = [
  [/\[\s*TODO/i, 'a [TODO] marker'],
  [/VIDEO_ID_HERE/, 'a VIDEO_ID_HERE placeholder'],
  [/\[\s*verify/i, 'a [verify] marker'],
  [/\[\s*(Edit|Optional|CAPTION|PHOTO)\b/, 'a bracketed drafting note'],
  [/\b(XX|YYYY)\b/, 'an XX/YYYY placeholder'],
]

let failed = false
for (const file of readdirSync(dir).filter(f => f.endsWith('.md')).sort()) {
  const text = readFileSync(join(dir, file), 'utf8')
  const front = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)?.[1] ?? ''
  if (/^draft:\s*true\s*$/m.test(front)) {
    console.log(`skip  ${file} (draft)`)
    continue
  }
  const date = /^date:\s*(\S+)/m.exec(front)?.[1]?.replace(/['"]/g, '')
  const problems = []
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) problems.push(`invalid date "${date}"`)
  // Ignore HTML comments, which are not rendered.
  const body = text.replace(/<!--[\s\S]*?-->/g, '')
  for (const [re, label] of markers) if (re.test(body)) problems.push(`contains ${label}`)
  if (problems.length) {
    failed = true
    console.error(`FAIL  ${file}: ${problems.join('; ')}`)
    console.error('      Finish the post, or add `draft: true` to its front matter.')
  } else {
    console.log(`ok    ${file}`)
  }
}
process.exit(failed ? 1 : 0)
