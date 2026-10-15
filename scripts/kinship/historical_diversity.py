#!/usr/bin/env python3
"""How much of the breed's historical ancestry is still around, and which living
dogs carry the most of it.

Takes the full pedigree (every dog and its ancestors, not only the reference
window) and a living-dog proxy cohort (born --cohort-from..--cohort-to, both
parents recorded). Ancestors born before --cut-year are the "historical
ancestors". For each cohort dog, the share of its genome expected to come from
each historical ancestor is the sum of 0.5^(path length) over all pedigree paths.

Reports
  concentration   ancestors reached, effective number of ancestors (1 / sum q^2),
                  how many supply 50% and 90% of the cohort genome, the tail of
                  ancestors that survive only as a trace
  at each cut year, the same for ancestors born before that year
  retention       for n sequenced dogs, the expected number of ancestor genome
                  equivalents retained, 1 - prod(1 - c_ik) summed over ancestors:
                  greedy diversity picks vs random cohort dogs (and, optionally,
                  an earlier list of coverage picks)

Pedigree-based expectations only; sequencing is what measures the realized values.

usage: historical_diversity.py PEDIGREE [PEDIGREE ...] --out DIR
         [--cohort-from 2016] [--cohort-to 2020] [--cut-year 1980] [--picks 300]
         [--coverage-picks target_2016.json --reference reference_dogs.csv]
"""
import argparse
import csv
import json
import os
import sys

import numpy as np
import scipy.sparse as sp

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pedigree_kinship import ancestors_order, drop_impossible_links, load, log  # noqa: E402

ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument('pedigree', nargs='+')
ap.add_argument('--out', required=True)
ap.add_argument('--cohort-from', type=int, default=2016)
ap.add_argument('--cohort-to', type=int, default=2020)
ap.add_argument('--cut-year', type=int, default=1980)
ap.add_argument('--picks', type=int, default=300)
ap.add_argument('--min-known', type=float, default=0.9, help='candidates need this share of known ancestry')
ap.add_argument('--coverage-picks')
ap.add_argument('--reference')
args = ap.parse_args()
os.makedirs(args.out, exist_ok=True)

D = load(args.pedigree)
dropped = drop_impossible_links(D)
order = ancestors_order(D, list(D), dropped)  # parents before children
idx = {d: i for i, d in enumerate(order)}
N = len(order)
log(f'{N} dogs, {len(dropped)} links dropped')

# birth year; an undated parent is placed three years before its earliest dated child
year = {d: D[d]['year'] for d in D}
for d in reversed(order):
    for k in ('sire', 'dam'):
        p = D[d][k]
        if p and not year[p] and year[d]:
            year[p] = year[d] - 3
yr = np.array([year[d] or 0 for d in order])
sire = np.array([idx.get(D[d]['sire'], -1) for d in order])
dam = np.array([idx.get(D[d]['dam'], -1) for d in order])
cohort = np.where((yr >= args.cohort_from) & (yr <= args.cohort_to) & (sire >= 0) & (dam >= 0))[0]
M = len(cohort)
log(f'cohort {args.cohort_from}-{args.cohort_to}: {M} dogs')


def flow(cut):
    """genome share of the cohort passing through each node, stopping at dogs born before `cut`"""
    y = np.zeros(N)
    y[cohort] = 1 / M
    unknown = 0.0
    for i in range(N - 1, -1, -1):
        v = y[i]
        if v == 0 or 0 < yr[i] < cut:
            continue
        for p in (sire[i], dam[i]):
            if p >= 0:
                y[p] += 0.5 * v
            else:
                unknown += 0.5 * v
    return y, unknown


by_cut = []
for cut in (1965, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010):
    y, unk = flow(cut)
    term = np.where((yr > 0) & (yr < cut) & (y > 0))[0]
    q = np.sort(y[term])[::-1]
    cs = np.cumsum(q)
    tot = q.sum()
    by_cut.append(dict(cut=cut, ancestors=int(len(q)), effective=round(float(1 / np.sum(q ** 2)), 1),
                       n50=int(np.searchsorted(cs, 0.5 * tot)) + 1, n90=int(np.searchsorted(cs, 0.9 * tot)) + 1,
                       unknown_share=round(float(1 - tot), 3)))
    log(by_cut[-1])

# cohort dog x historical ancestor genome shares
Y = args.cut_year
rows, cols = [], []
for i in range(N):
    if 0 < yr[i] < Y:
        continue
    for p in (sire[i], dam[i]):
        if p >= 0:
            rows.append(i)
            cols.append(p)
P = sp.csr_matrix((np.full(len(rows), 0.5), (rows, cols)), shape=(N, N))
# optional extra dogs, traced the same way: the best-connected and a typical dog from an earlier coverage run
extra = []
if args.coverage_picks and args.reference:
    _t = json.load(open(args.coverage_picks))
    _ref = list(csv.DictReader(open(args.reference, encoding='utf-8')))
    _pos = {d: i for i, d in enumerate(order)}
    _best = _ref[int(np.where(np.array(_t['g']['rank']) == 1)[0][0])]['id']
    extra = [_pos[_best]]
    if _t.get('typical'):
        extra.append(_pos[_ref[_t['typical']['dog']]['id']])
src = np.concatenate([cohort, np.array(extra, dtype=int)]) if extra else cohort
cur = sp.csr_matrix((np.ones(len(src)), (np.arange(len(src)), src)), shape=(len(src), N))
tot = cur.copy()
for _ in range(100):
    cur = cur @ P
    if cur.nnz == 0:
        break
    tot = tot + cur
term = np.where((yr > 0) & (yr < Y))[0]
Call = tot[:, term].tocsr()
C = Call[:M]
q = C.sum(axis=0).A1 / M
reached = q > 0
K = int(reached.sum())
known = C.sum(axis=1).A1
eq = 1 / K
trace = reached & (q < 0.1 * eq)
sq = np.sort(q[reached])[::-1]
cs = np.cumsum(sq)
conc = dict(cut=Y, cohort=M, ancestors=K, effective=round(float(1 / np.sum(q ** 2)), 1),
            n50=int(np.searchsorted(cs, 0.5 * cs[-1])) + 1, n90=int(np.searchsorted(cs, 0.9 * cs[-1])) + 1,
            trace_ancestors=int(trace.sum()), trace_share_of_ancestors=round(float(trace.sum() / K), 3),
            trace_genome_share=round(float(q[trace].sum()), 4), median_known_share=round(float(np.median(known)), 3))
log(conc)

# rarity-weighted lineage score (1 = average), counting only known ancestry
wk = np.zeros(len(term))
wk[reached] = 1 / q[reached]
R = (C @ wk) / np.maximum(known, 1e-9) / K
good = known >= args.min_known
pct = np.percentile(R[good], [10, 50, 90, 99])

# retention of ancestor genome equivalents by a sequenced set
Cd = C[np.where(good)[0]].toarray().astype(np.float32)
np.minimum(Cd, 1 - 1e-6, out=Cd)
cand = np.where(good)[0]
n_pick = min(args.picks, len(cand))
miss = np.ones(len(term), dtype=np.float32)
curve, picked = [], []
Cg = Cd.copy()
for _ in range(n_pick):
    gain = (Cg * miss).sum(axis=1)
    j = int(gain.argmax())
    picked.append(j)
    miss *= 1 - Cg[j]
    Cg[j] = 0
    curve.append(float((1 - miss)[reached].sum()))
# every candidate dog sequenced: the most this cohort could hold
full = float((1 - np.exp(np.log1p(-Cd).sum(axis=0)))[reached].sum())
rng = np.random.default_rng(1)
ns = [n for n in (1, 5, 10, 25, 50, 100, 150, 200, 300, 500, 750, 900) if n <= n_pick]
rand = {}
for n in ns:
    v = []
    for _ in range(40):
        s = rng.choice(len(cand), n, replace=False)
        v.append(float((1 - np.exp(np.log1p(-Cd[s]).sum(axis=0)))[reached].sum()))
    rand[n] = round(float(np.mean(v)), 1)


def dogs_for(frac):
    return next((i + 1 for i, v in enumerate(curve) if v >= frac * full), None)


out = dict(args=dict(cohort=[args.cohort_from, args.cohort_to], cut_year=Y), concentration=conc, by_cut=by_cut,
           rare_score_percentiles=dict(zip(('p10', 'p50', 'p90', 'p99'), [round(float(x), 2) for x in pct])),
           candidates=int(good.sum()), total_retained_by_all_candidates=round(full, 1),
           diversity_picks={n: round(curve[n - 1], 1) for n in ns}, random_picks=rand,
           dogs_for_share_of_total={str(f): dogs_for(f) for f in (0.5, 0.75, 0.9, 0.95)})

if args.coverage_picks and args.reference:
    t = json.load(open(args.coverage_picks))
    ref = list(csv.DictReader(open(args.reference, encoding='utf-8')))
    rank = np.array(t['g']['rank'])
    seq = [int(i) for i in np.argsort(np.where(rank > 0, rank, 10 ** 9))[:len(t['g']['frac'])]]
    pos = {d: i for i, d in enumerate(order)}
    crow = {int(c): n for n, c in enumerate(cohort)}
    sel = [crow[pos[ref[j]['id']]] for j in seq if pos.get(ref[j]['id']) in crow]
    m2 = np.ones(len(term), dtype=np.float32)
    cc = []
    for r in sel:
        m2 *= 1 - np.minimum(C[r].toarray().ravel(), 1 - 1e-6)
        cc.append(float((1 - m2)[reached].sum()))
    out['coverage_picks_in_cohort'] = dict(count=len(sel), retained={n: round(cc[n - 1], 1) for n in (1, 5, 10, 25, 50, 100) if n <= len(cc)})

if extra:
    # what the best-connected dog is made of: its share of genome from the ancestors who supply half of the cohort's
    top = np.argsort(q)[::-1][:conc['n50']]
    share = C[:, top].sum(axis=1).A1
    names = ['best_connected', 'typical'][:len(extra)]
    out['key_ancestors'] = dict(count=int(conc['n50']), cohort_median_share=round(float(np.median(share)), 3),
                                **{f'{n}_share': round(float(Call[M + i][:, top].sum()), 3) for i, n in enumerate(names)},
                                best_connected_percentile=round(float((share < Call[M][:, top].sum()).mean() * 100), 1))
json.dump(out, open(os.path.join(args.out, 'historical_diversity.json'), 'w'), indent=1)
print(json.dumps(out, indent=1))
