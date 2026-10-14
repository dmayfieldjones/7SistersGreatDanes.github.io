#!/usr/bin/env python3
"""Sequencing coverage for a chosen target population, for the breed map.

The target is every reference dog born in or after --from-year. A target dog
is "covered" once a sequenced dog is at half-sibling level or closer
(relationship >= --close). Three ways of choosing whom to sequence:

  g  greedy: each step adds whichever dog (born any year in the window) newly
     covers the most uncovered target dogs
  f  one stand-in per family, biggest target family first; the stand-in is the
     family member close kin to the most of the family
  p  nested groups: start with the target as one group and repeatedly split the
     group whose division raises mean relatedness to its representative the
     most. A split is a 2-medoids partition in which each family moves whole
     while the group holds more than one. Representatives come from the target.

usage: coverage_target.py <kinship-out-dir> --from-year 2016 [--steps 200]
Writes <dir>/target_<year>.json; dog order matches reference_dogs.csv.
"""
import argparse
import csv
import json
import os

import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument('dir')
ap.add_argument('--from-year', type=int, required=True)
ap.add_argument('--steps', type=int, default=200)
ap.add_argument('--close', type=float, default=0.25)
args = ap.parse_args()

A = np.load(os.path.join(args.dir, 'matrix.npz'))['A'].astype(np.float32)
rows = list(csv.DictReader(open(os.path.join(args.dir, 'reference_dogs.csv'), encoding='utf-8')))
n = len(rows)
year = np.array([int(r['year'] or 0) for r in rows])
cl = np.array([int(r['cluster']) for r in rows])
target = (year >= args.from_year) & (year > 0)
T = np.where(target)[0]
close = args.close
C = A[T] >= close  # target dogs x all candidates


def curves(order):
    """first step each target dog is covered, pick rank, and per-step curves."""
    best = np.zeros(len(T), dtype=np.float32)
    first = np.zeros(n, dtype=int)
    rank = np.zeros(n, dtype=int)
    frac, mean, new = [], [], []
    seen = np.zeros(len(T), dtype=bool)
    for step, j in enumerate(order, 1):
        best = np.maximum(best, A[T, j])
        cov = best >= close
        newly = cov & ~seen
        first[T[newly]] = step
        seen |= cov
        rank[j] = step
        frac.append(round(float(cov.mean()), 4))
        mean.append(round(float(best.mean()), 4))
        new.append(int(newly.sum()))
    return dict(first=first.tolist(), rank=rank.tolist(), frac=frac, mean=mean, new=new)


# g: greedy by newly covered count
unc = np.ones(len(T), dtype=bool)
order = []
for _ in range(args.steps):
    gain = C[unc].sum(axis=0)
    gain[order] = -1
    j = int(gain.argmax())
    if gain[j] <= 0:
        break
    order.append(j)
    unc &= ~C[:, j]
    if not unc.any():
        break
res_g = curves(order)

# a typical dog: the candidate whose reach is the median of all candidates, for the "what one dog speaks for" comparison
deg = C.sum(axis=0)
jt = int(np.argsort(deg)[len(deg) // 2])
typical = dict(dog=jt, n=int(deg[jt]), best=int(deg.max()), median=int(np.median(deg)),
               covered=[int(T[i]) for i in np.where(C[:, jt])[0] if T[i] != jt])

# f: one stand-in per target family
fam_ids = sorted({c for c in cl[T] if c > 0}, key=lambda c: -int((cl[T] == c).sum()))
reps = []
for c in fam_ids[:args.steps]:
    m = np.where(target & (cl == c))[0]
    S = A[np.ix_(m, m)]
    reps.append(int(m[np.argmax((S >= close).sum(axis=1) + 0.5 * S.mean(axis=1))]))
res_f = curves(reps)

# p: nested groups over the target
unit = np.where(cl > 0, cl, -1 - np.arange(n))


def center(idx):
    S = A[np.ix_(idx, idx)]
    return int(idx[np.argmax((S >= close).sum(axis=1) + 0.5 * S.mean(axis=1))])


def best_split(idx):
    if len(idx) < 4:
        return None
    S = A[np.ix_(idx, idx)]
    u = unit[idx]
    whole = len(np.unique(u)) > 1
    _, inv = np.unique(u, return_inverse=True)
    c1 = int(np.argmax(S.sum(axis=1)))
    c2 = int(np.argmax(np.maximum(S, S[:, c1:c1 + 1]).sum(axis=0)))
    if c2 == c1:
        return None
    base = S[:, c1].sum()

    def assign(c1, c2):
        d = S[:, c2] - S[:, c1]
        if not whole:
            return d > 0
        return (np.bincount(inv, weights=d) > 0)[inv]

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
    gain = float(S[~side, c1].sum() + S[side, c2].sum() - base)
    return gain, idx[~side], idx[side]


groups = [T]
parent = [-1]
cand = [best_split(T)]
grep = [center(T)]  # representative of each group
frac, mean, steps = [], [], []


def snapshot():
    best = np.zeros(n, dtype=np.float32)
    for g, r in zip(groups, grep):
        best[g] = A[g, r]
    frac.append(round(float((best[T] >= close).mean()), 4))
    mean.append(round(float(best[T].mean()), 4))


snapshot()
while len(groups) < args.steps:
    k = max((i for i, c in enumerate(cand) if c), key=lambda i: cand[i][0], default=None)
    if k is None:
        break
    _, left, right = cand[k]
    if len(left) < len(right):
        left, right = right, left
    groups[k] = left
    groups.append(right)
    parent.append(k)
    grep[k] = center(left)
    grep.append(center(right))
    steps.append([grep[k], grep[-1]])
    cand[k] = best_split(left)
    cand.append(best_split(right))
    snapshot()

final = np.full(n, 255, dtype=np.uint8)
for gi, g in enumerate(groups):
    final[g] = gi
res_p = dict(final=final.tolist(), parent=parent,
             rep0=int(center(T)) if False else None, frac=frac, mean=mean, steps=steps)
# level-1 representative = the first group's representative before any split
res_p['rep0'] = int(center(T))
json.dump(dict(frm=args.from_year, close=close, n=int(len(T)), g=res_g, f=res_f, p=res_p, typical=typical),
          open(os.path.join(args.dir, f'target_{args.from_year}.json'), 'w'))
print(args.from_year, len(T), 'g95', next((i + 1 for i, v in enumerate(res_g['frac']) if v >= .95), None),
      'f', res_f['frac'][-1], 'p@60', res_p['frac'][min(59, len(frac) - 1)])
