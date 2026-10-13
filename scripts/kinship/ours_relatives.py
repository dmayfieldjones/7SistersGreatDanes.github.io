#!/usr/bin/env python3
"""Closest relatives of the farm's own dogs, for the map's hover trace.

usage: ours_relatives.py <kinship-out-dir> <ours.txt> [--top 30]
ours.txt lines: id|display name. Writes <dir>/ours_relatives.json:
{id: [[row index in reference_dogs.csv, relationship], ...]}  (self excluded)
"""
import argparse
import json
import os

import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument('dir')
ap.add_argument('ours')
ap.add_argument('--top', type=int, default=30)
args = ap.parse_args()
z = np.load(os.path.join(args.dir, 'matrix.npz'))
ids, A = [str(i) for i in z['ids']], z['A']
out = {}
for line in open(args.ours):
    oid = line.split('|')[0].strip()
    if oid not in ids:
        continue
    i = ids.index(oid)
    a = A[i].astype(float).copy()
    a[i] = 0
    top = np.argsort(-a)[:args.top]
    out[oid] = [[int(j), round(float(a[j]), 3)] for j in top]
json.dump(out, open(os.path.join(args.dir, 'ours_relatives.json'), 'w'))
print({k: len(v) for k, v in out.items()})
