#!/usr/bin/env python3
"""Split the oversized clusters from pedigree_kinship.py so a map can show
distinct families. Re-clusters any group above --max-size on its own
relationship sub-matrix, and rewrites reference_dogs.csv's `cluster` column.

usage: refine_clusters.py <kinship-out-dir> [--max-size 700] [--parts 8]
"""
import argparse
import csv
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pedigree_kinship import cluster  # noqa: E402

ap = argparse.ArgumentParser()
ap.add_argument('dir')
ap.add_argument('--max-size', type=int, default=700)
ap.add_argument('--parts', type=int, default=8)
ap.add_argument('--min-size', type=int, default=30)
args = ap.parse_args()

z = np.load(os.path.join(args.dir, 'matrix.npz'))
ids, A = list(z['ids']), z['A'].astype(np.float64)
path = os.path.join(args.dir, 'reference_dogs.csv')
rows = list(csv.DictReader(open(path, encoding='utf-8')))
assert [r['id'] for r in rows] == [str(i) for i in ids]
cl = np.array([int(r['cluster']) for r in rows])
nxt = cl.max() + 1
for c in sorted(set(cl)):
    members = np.where(cl == c)[0]
    if len(members) <= args.max_size:
        continue
    sub = cluster(A[np.ix_(members, members)], args.parts, min_size=args.min_size)
    for s in sorted(set(sub)):
        sel = members[sub == s]
        if s == 0:
            cl[sel] = 0 if c == 0 else c           # leftovers stay with the parent
        else:
            cl[sel] = nxt
            nxt += 1
    print(f'cluster {c}: {len(members)} dogs -> {len(set(sub))} parts', file=sys.stderr)
# parent keeps its id for its leftovers; renumber everything densely, 1 = largest
sizes = {c: int((cl == c).sum()) for c in set(cl) if c != 0}
remap = {c: r + 1 for r, c in enumerate(sorted(sizes, key=lambda c: -sizes[c]))}
for r, c in zip(rows, cl):
    r['cluster'] = remap.get(int(c), 0)
with open(path, 'w', newline='', encoding='utf-8') as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0]))
    w.writeheader()
    w.writerows(rows)
print(f'{len(remap)} clusters; {int((cl == 0).sum())} dogs in small groups', file=sys.stderr)
