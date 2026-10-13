#!/usr/bin/env python3
"""Nested kinship groups for the breed map's "split into groups" view.

Starts with the whole population as one group and repeatedly splits the group
whose division raises the population's mean relationship to its group
representative the most. A group's representative is the dog that is
half-sibling level or closer to the most members. So at k groups, the k
representatives are the k dogs to sequence, and each other dog is "served" by
the representative of its group.

A split is a 2-medoids partition of one group (seeded with its central dog and
the member that adds most as a second representative) in which each family
moves as a unit while the group holds more than one, so groups sit where the
family islands do.

usage: coverage_groups.py <kinship-out-dir> [--groups 60] [--close 0.25]
Writes <dir>/groups.json; dog order matches reference_dogs.csv.
  final[i]   group id of dog i after the last split
  parent[g]  group id g was split from (parent[0] = -1); group g exists at
             level k when g < k, and a dog sits in group g' = final[i],
             walked up through parent while g' >= k
  reps[k-1]  representative dog index for each group id 0..k-1 at level k
"""
import argparse
import json
import os
import sys

import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument('dir')
ap.add_argument('--groups', type=int, default=60)
ap.add_argument('--close', type=float, default=0.25)
args = ap.parse_args()

A = np.load(os.path.join(args.dir, 'matrix.npz'))['A'].astype(np.float32)
n = A.shape[0]


def center(idx):
    """Representative: the member who is half-sibling level or closer to the
    most of the group, ties broken by mean relatedness."""
    S = A[np.ix_(idx, idx)]
    return int(np.argmax((S >= args.close).sum(axis=1) + 0.5 * S.mean(axis=1)))


import csv  # noqa: E402

# Families (the island clusters) move as units, so a group is a union of whole
# families and sits where the islands do. Dogs outside any family are their own
# units. Once a group is a single family, it splits dog by dog.
cl = np.array([int(r['cluster']) for r in
               csv.DictReader(open(os.path.join(args.dir, 'reference_dogs.csv'), encoding='utf-8'))])
unit = np.where(cl > 0, cl, -1 - np.arange(n))


def medoid(idx):
    return int(idx[center(idx)])


def best_split(idx):
    """2-medoids split of one group, keeping families whole where possible.
    Returns (gain, left, right) or None."""
    if len(idx) < 4:
        return None
    S = A[np.ix_(idx, idx)]
    u = unit[idx]
    whole = len(np.unique(u)) > 1
    c1 = int(np.argmax(S.sum(axis=1)))
    c2 = int(np.argmax(np.maximum(S, S[:, c1:c1 + 1]).sum(axis=0)))
    if c2 == c1:
        return None
    base = S[:, c1].sum()

    def assign(c1, c2):
        d = S[:, c2] - S[:, c1]
        if not whole:
            return d > 0
        _, inv = np.unique(u, return_inverse=True)
        tot = np.bincount(inv, weights=d)
        return (tot > 0)[inv]

    side = assign(c1, c2)
    for _ in range(20):
        if side.all() or not side.any():
            return None
        n1 = np.where(~side)[0][int(np.argmax(S[np.ix_(~side, ~side)].sum(axis=1)))]
        n2 = np.where(side)[0][int(np.argmax(S[np.ix_(side, side)].sum(axis=1)))]
        if n1 == c1 and n2 == c2:
            break
        c1, c2 = int(n1), int(n2)
        side = assign(c1, c2)
    if side.all() or not side.any():
        return None
    gain = float(S[np.ix_(~side, [c1])].sum() + S[np.ix_(side, [c2])].sum() - base)
    return gain, idx[~side], idx[side]


groups = [np.arange(n)]
parent = [-1]
cand = [best_split(groups[0])]
frac, mean = [], []
reps_log = []


def snapshot():
    reps = [medoid(g) for g in groups]
    best = np.zeros(n, dtype=np.float32)
    for g, r in zip(groups, reps):
        best[g] = A[g, r]
    reps_log.append(reps)
    frac.append(round(float((best >= args.close).mean()), 4))
    mean.append(round(float(best.mean()), 4))


snapshot()
while len(groups) < args.groups:
    k = max((i for i, c in enumerate(cand) if c), key=lambda i: cand[i][0], default=None)
    if k is None:
        break
    _, left, right = cand[k]
    if len(left) < len(right):
        left, right = right, left  # the larger half keeps the id
    groups[k] = left
    groups.append(right)
    parent.append(k)
    cand[k] = best_split(left)
    cand.append(best_split(right))
    snapshot()
    print(len(groups), frac[-1], mean[-1], file=sys.stderr)

final = np.zeros(n, dtype=np.uint8)
for gi, g in enumerate(groups):
    final[g] = gi
json.dump(dict(close=args.close, n=n, final=final.tolist(), parent=parent,
               reps=reps_log, frac=frac, mean=mean),
          open(os.path.join(args.dir, 'groups.json'), 'w'))
