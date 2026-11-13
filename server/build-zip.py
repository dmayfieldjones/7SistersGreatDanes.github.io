#!/usr/bin/env python3
"""Builds the Lambda package: the server files, the rules file and the two small data files, laid out the way the server expects."""
import hashlib, json, sys, zipfile, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
out = pathlib.Path(sys.argv[1])
files = {'package.json': json.dumps({'type': 'module'})}
for f in ['handler.mjs', 'auth.mjs', 'store.mjs', 'store-dynamo.mjs', 'lambda.mjs', 'danesworld.mjs']:
    files['server/' + f] = (root / 'server' / f).read_text()
files['public/dog-api.js'] = (root / 'public' / 'dog-api.js').read_text()
for f in ['demo-authors.json', 'our-pedigrees.json']:
    files['public/data/' + f] = (root / 'public' / 'data' / f).read_text()
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for name in sorted(files):
        z.writestr(zipfile.ZipInfo(name, (2026, 1, 1, 0, 0, 0)), files[name])   # fixed dates so the same files give the same package
print(hashlib.sha256(out.read_bytes()).hexdigest()[:16])
