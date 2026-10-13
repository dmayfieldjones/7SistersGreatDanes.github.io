#!/usr/bin/env python3
"""Sequencing coverage curves for the breed map.

For two strategies, adds one sequenced dog at a time and records, for every
dog in the reference population, the first step at which it has a sequenced
close relative (relationship >= --close), plus the population-level curve:

  greedy  each step adds the dog that lifts mean best-relationship the most
  family  one representative (the most central dog) per family, biggest
          family first - "sequence any dog as a stand-in for the whole group"

usage: coverage_steps.py <kinship-out-dir> [--steps 60] [--close 0.25]
Writes <dir>/coverage.json; dog order matches reference_dogs.csv.
"""
import argparse
import csv
import json
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pedigree_kinship import greedy_select  # noqa: E402

ap = argparse.ArgumentParser()
ap.add_argument('dir')
ap.add_argument('--steps', type=int, default=60)
ap.add_argument('--close', type=float, default=0.25)
args = ap.parse_args()

z = np.load(os.path.join(args.dir, 'matrix.npz'))
A = z['A'].astype(np.float64)
rows = list(csv.DictReader(open(os.path.join(args.dir, 'reference_dogs.csv'), encoding='utf-8')))
cl = np.array([int(r['cluster']) for r in rows])
n = len(rows)


def run(order):
    """First step each dog is covered, plus curves, for a given pick order."""
    best = np.zeros(n)
    first = np.zeros(n, dtype=int)
    frac, mean, new = [], [], []
    for step, j in enumerate(order, 1):
        best = np.maximum(best, A[:, j])
        covered = best >= args.close
        newly = covered & (first == 0)
        first[newly] = step
        frac.append(round(float(covered.mean()), 4))
        mean.append(round(float(best.mean()), 4))
        new.append(int(newly.sum()))
    rank = np.zeros(n, dtype=int)
    for step, j in enumerate(order, 1):
        rank[j] = step
    return dict(first=first.tolist(), rank=rank.tolist(), frac=frac, mean=mean, new=new)


greedy_idx, _ = greedy_select(A, list(range(n)), args.steps, close=args.close)
greedy = run([int(j) for j in greedy_idx])

# family strategy: biggest family first, representative = most central member
fams = [c for c in sorted(set(cl), key=lambda c: -(cl == c).sum()) if c != 0]
reps = []
for c in fams[:args.steps]:
    members = np.where(cl == c)[0]
    reps.append(int(members[np.argmax(A[np.ix_(members, members)].sum(axis=1))]))
family = run(reps)
family['families'] = [int((cl == c).sum()) for c in fams[:args.steps]]

with open(os.path.join(args.dir, 'coverage.json'), 'w') as f:
    json.dump(dict(close=args.close, n=n, greedy=greedy, family=family), f)
for name, r in (('greedy', greedy), ('family', family)):
    print(name, {k: r['frac'][k - 1] for k in (1, 2, 5, 10, 20, 40) if k <= len(r['frac'])}, file=sys.stderr)
