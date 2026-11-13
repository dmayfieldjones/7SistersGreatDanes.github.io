#!/usr/bin/env python3
"""Builds the Lambda package: the server files, the rules file and the small data files, laid out the way the server expects.
The private pedigree files (the folder named by PEDIGREE_DIR, default ~/pedigree-data) go in too, under private/. They are read from your own
machine at build time and travel only to your private package bucket and the server: they are never written into this repository."""
import hashlib, json, os, sys, zipfile, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
out = pathlib.Path(sys.argv[1])
files = {'package.json': json.dumps({'type': 'module'})}
for f in sorted(p.name for p in (root / 'server').glob('*.mjs')):   # every server module, so a new file can never be left out of the package
    files['server/' + f] = (root / 'server' / f).read_text()
files['public/dog-api.js'] = (root / 'public' / 'dog-api.js').read_text()
for f in ['demo-authors.json', 'our-pedigrees.json']:
    files['public/data/' + f] = (root / 'public' / 'data' / f).read_text()
pd = pathlib.Path(os.environ.get('PEDIGREE_DIR', pathlib.Path.home() / 'pedigree-data'))
env = {}
if (pd / 'build.env').exists():
    for line in (pd / 'build.env').read_text().splitlines():
        if '=' in line and not line.lstrip().startswith('#'):
            k, v = line.split('=', 1); env[k.strip()] = v.strip().strip('"')
names = [env.get('PEDIGREE_MAIN', '')] + env.get('EXTRA_DBW', '').split()
found = [n for n in names if n and (pd / n).exists()]
for i, n in enumerate(found):
    files['private/%d-%s' % (i + 1, n)] = (pd / n).read_text(encoding='utf-8', errors='replace')   # later files override earlier ones, as in the galaxy build
print('private pedigree files packed: %s' % (', '.join(found) or 'none'), file=sys.stderr)
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for name in sorted(files):
        z.writestr(zipfile.ZipInfo(name, (2026, 1, 1, 0, 0, 0)), files[name], compress_type=zipfile.ZIP_DEFLATED)   # fixed dates so the same files give the same package
print(hashlib.sha256(out.read_bytes()).hexdigest()[:16])
