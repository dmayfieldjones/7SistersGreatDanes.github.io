# AGENTS.md

## Cursor Cloud specific instructions

This is a **Next.js 15** static-export website (a Great Dane breeding site with a
client-side genome browser). It builds to static HTML via `output: 'export'` and
is deployed to GitHub Pages. There is no backend service.

### Package manager: use Yarn (classic), not npm

- The authoritative lockfile is `yarn.lock`. The committed `package-lock.json` is
  **stale/inconsistent** (`npm ci` fails with "Missing ... from lock file", and
  `npm install` rewrites both lockfiles), so prefer Yarn.
- The update script runs `yarn install --frozen-lockfile`, which installs cleanly
  without mutating any lockfile.
- Native CSS toolchain binaries (`lightningcss-linux-x64-gnu`,
  `@tailwindcss/oxide-linux-x64-gnu`, required by Tailwind v4) are resolved
  correctly by Yarn from `yarn.lock`. With npm they are silently skipped, which
  causes a runtime `Cannot find module '../lightningcss.linux-x64-gnu.node'`
  500 error on every page. If you ever switch to npm, you must add the Linux
  native packages manually.

### Run / lint / build (see `package.json` scripts)

- Dev server: `yarn dev` (Next.js + Turbopack on http://localhost:3000).
  Note: routes use a trailing slash; `/about` 308-redirects to `/about/`.
- Lint: `yarn lint`.
- Production static build: `yarn build` (output written to `out/`).
- `yarn start` is **not** a production server — it is aliased to `next dev`.
