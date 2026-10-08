#!/usr/bin/env python3
"""Founder representation and sequencing designs, from pedigree_kinship.py output.

Two questions about the reference population:

  1. How much of the breed's founding diversity does it still carry?
     Founders, effective founders (fe), effective ancestors (fa, Boichard
     et al. 1997) and founder genome equivalents (fge, Lacy 1989), for the
     reference population and for earlier birth cohorts.
  2. Which dogs should be sequenced? Three ways of choosing the same number
     of dogs are compared on the same measures:
       coverage   each pick most raises every dog's relationship to its
                  closest sequenced relative (greedy_select);
       diversity  each pick least raises the mean kinship among the picks,
                  so the set holds as many founder genomes as possible;
       combined   the first few picks by coverage, the rest by diversity.

Needs the --out directory of a pedigree_kinship.py run (matrix.npz,
reference_dogs.csv) and the same pedigree file(s). Writes sampling.json:
aggregates only, no dog names or ids. Keep inputs and outputs out of the repo.
"""
import argparse
import collections
import csv
import json
import os

import numpy as np

from pedigree_kinship import ancestors_order, drop_impossible_links, greedy_select, load, log

FAMILIES = ('fawn', 'harl', 'blue', 'other')
COHORTS = ((1900, 1919), (1920, 1939), (1950, 1959), (1970, 1979), (1990, 1999),
           (2000, 2009), (2012, 2020))
ERAS = ((1900, 1919), (1920, 1939), (1940, 1959), (1960, 1979), (1980, 1999))


class Flow:
    """Expected gene contributions through the whole pedigree."""

    def __init__(self, dogs):
        self.dogs = dogs
        self.ids = ancestors_order(dogs, list(dogs), [])
        self.idx = {d: i for i, d in enumerate(self.ids)}
        n = len(self.ids)
        self.sire = np.array([self.idx.get(dogs[d]['sire'], -1) for d in self.ids])
        self.dam = np.array([self.idx.get(dogs[d]['dam'], -1) for d in self.ids])
        self.year = np.array([dogs[d]['year'] or 0 for d in self.ids])
        gen = np.zeros(n, dtype=int)
        for i in range(n):
            ps = [gen[p] for p in (self.sire[i], self.dam[i]) if p >= 0]
            gen[i] = max(ps) + 1 if ps else 0
        self.levels = [np.where(gen == g)[0] for g in range(gen.max() + 1)]
        # every unknown parent slot counts as its own founder
        self.full = (self.sire < 0) & (self.dam < 0)
        self.half = (self.sire >= 0) ^ (self.dam >= 0)

    def contributions(self, members, sire=None, dam=None):
        """Share of the members' genes expected to come from each dog."""
        sire = self.sire if sire is None else sire
        dam = self.dam if dam is None else dam
        q = np.bincount(members, minlength=len(self.ids)) / len(members)
        for level in self.levels[:0:-1]:
            for par in (sire, dam):
                ok = par[level] >= 0
                np.add.at(q, par[level][ok], 0.5 * q[level][ok])
        return q

    def founder_shares(self, q):
        return np.concatenate([q[self.full], 0.5 * q[self.half]])

    def major_ancestors(self, members, share=0.995, limit=1500):
        """Boichard's marginal contributions: each ancestor's share of the
        gene pool not already explained by the ancestors chosen before it."""
        sire, dam = self.sire.copy(), self.dam.copy()
        chosen = np.zeros(len(self.ids), dtype=bool)
        picked, marginal = [], []
        while len(picked) < limit and sum(marginal) < share:
            q = self.contributions(members, sire, dam)
            explained = chosen.astype(float)
            for level in self.levels[1:]:
                m = level[~chosen[level]]
                acc = np.zeros(len(m))
                for par in (sire, dam):
                    ok = par[m] >= 0
                    acc[ok] += 0.5 * explained[par[m][ok]]
                explained[m] = acc
            p = q * (1.0 - explained)
            p[chosen] = 0
            k = int(np.argmax(p))
            if p[k] <= 0:
                break
            picked.append(k)
            marginal.append(float(p[k]))
            chosen[k] = True
            sire[k] = dam[k] = -1
        return np.array(picked), np.array(marginal)

    def cohort(self, members, limit=600):
        q = self.contributions(members)
        shares = self.founder_shares(q)
        _, marginal = self.major_ancestors(members, limit=limit)
        cum = np.cumsum(marginal)
        return dict(n=int(len(members)), founders=int((q[self.full] > 0).sum()),
                    fe=round(float(1 / np.sum(shares ** 2)), 1),
                    fa=round(float(1 / np.sum(marginal ** 2)), 1),
                    n50=int(np.searchsorted(cum, 0.5) + 1),
                    top1=round(100 * float(marginal[0]), 1),
                    top10=round(100 * float(cum[9]), 1))


def diverse_select(A, candidates, k, start=()):
    """Add the dog that least raises the mean kinship among the picks."""
    chosen = list(start)
    total = A[:, chosen].sum(axis=1) if chosen else np.zeros(A.shape[0])
    cand = np.array([c for c in candidates if c not in set(chosen)])
    self_rel = np.diag(A)
    while len(chosen) < k:
        j = cand[np.argmin(2 * total[cand] + self_rel[cand])]
        chosen.append(int(j))
        total += A[:, j]
        cand = cand[cand != j]
    return chosen


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('pedigree', nargs='+', help='.dbw file(s), as given to pedigree_kinship.py')
    ap.add_argument('--out', required=True, help='pedigree_kinship.py output directory (keep outside the repo)')
    ap.add_argument('--families', required=True,
                    help='JSON with clusters: [{cluster, family}] (the study summary)')
    ap.add_argument('--candidates-from', type=int, default=2016)
    ap.add_argument('--pick', type=int, default=40)
    ap.add_argument('--min-depth', type=float, default=24,
                    help='diversity picks need this many equivalent complete generations; '
                         'a dog with missing ancestry only looks unrelated')
    ap.add_argument('--combined-first', type=int, default=10,
                    help='coverage picks that open the combined design')
    ap.add_argument('--random-draws', type=int, default=300)
    args = ap.parse_args()

    dogs = load(args.pedigree)
    drop_impossible_links(dogs)
    flow = Flow(dogs)
    log(f'{len(flow.ids)} dogs, {len(flow.levels)} generations')

    z = np.load(os.path.join(args.out, 'matrix.npz'))
    A = z['A'].astype(np.float64)
    ref_ids = [str(x) for x in z['ids']]
    rows = list(csv.DictReader(open(os.path.join(args.out, 'reference_dogs.csv'), encoding='utf-8')))
    assert [r['id'] for r in rows] == ref_ids
    ref = np.array([flow.idx[d] for d in ref_ids])
    year = np.array([int(r['year']) for r in rows])
    depth = np.array([float(r['ecg']) for r in rows])
    cluster = np.array([int(r['cluster']) for r in rows])
    family_of = {c['cluster']: c['family'] for c in json.load(open(args.families))['clusters']}
    family = np.array([family_of[c] for c in cluster])
    N = len(ref_ids)

    # --- 1. founder representation ---
    q_ref = flow.contributions(ref)
    ref_shares = flow.founder_shares(q_ref)
    major, marginal = flow.major_ancestors(ref)
    cum = np.cumsum(marginal)
    n80 = int(np.searchsorted(cum, 0.8) + 1)
    by_size = np.sort(q_ref[flow.full & (q_ref > 0)])[::-1]
    founders = dict(
        ancestors=int((q_ref > 0).sum()) - N,
        founders=int((q_ref[flow.full] > 0).sum()),
        founders_in_database=int(flow.full.sum()),
        founders_under_0_01pct=int((by_size < 1e-4).sum()),
        fe=round(float(1 / np.sum(ref_shares ** 2)), 1),
        fa=round(float(1 / np.sum(marginal ** 2)), 1),
        fge=round(float(1 / A.mean()), 1),
        n50=int(np.searchsorted(cum, 0.5) + 1), n80=n80,
        top1=round(100 * float(marginal[0]), 1), top1_year=int(flow.year[major[0]]),
        top10=round(100 * float(cum[9]), 1),
        undated_founder_share=round(100 * float(
            q_ref[flow.full & (flow.year == 0)].sum() + 0.5 * q_ref[flow.half & (flow.year == 0)].sum()), 1))
    log('reference', founders)

    both = (flow.sire >= 0) & (flow.dam >= 0)
    founders['cohorts'] = []
    for a, b in COHORTS:
        r = flow.cohort(np.where((flow.year >= a) & (flow.year <= b) & both)[0])
        founders['cohorts'].append(dict(years=f'{a}–{b}', **r))
        log(a, b, r)

    founders['eras'] = []
    for a, b in ERAS:
        m = (flow.year >= a) & (flow.year <= b)
        s = np.sort(q_ref[m & (q_ref > 0)])[::-1]
        founders['eras'].append(dict(years=f'{a}–{b}', recorded=int(m.sum()), surviving=int(len(s)),
                                     half=int(np.searchsorted(np.cumsum(s), s.sum() / 2) + 1)))
    early = np.where((flow.year >= 1900) & (flow.year <= 1939))[0]
    n_col, w_col = collections.Counter(), collections.Counter()
    for i in early:
        c = (dogs[flow.ids[i]]['color'] or 'unrecorded').split()[0].lower()
        c = {'fawn': 'fawn/brindle', 'brindle': 'fawn/brindle', 'black': 'black/blue',
             'blue': 'black/blue', 'harlequin': 'harlequin'}.get(c, 'other or unrecorded')
        n_col[c] += 1
        w_col[c] += q_ref[i]
    founders['early_colours'] = [dict(colour=c, dogs=round(100 * n_col[c] / len(early)),
                                      contribution=round(100 * w_col[c] / sum(w_col.values())))
                                 for c, _ in n_col.most_common()]

    # --- 2. sequencing designs ---
    cand = [i for i in range(N) if year[i] >= args.candidates_from]
    deep = [i for i in cand if depth[i] >= args.min_depth]
    log(f'{len(cand)} candidates, {len(deep)} with pedigree depth >= {args.min_depth}')

    def measure(picks, lineage=True):
        picks = [int(p) for p in picks]
        best = A[:, picks].max(axis=1)
        sub = A[np.ix_(picks, picks)]
        r = dict(k=len(picks), all=round(100 * float((best >= 0.25).mean()), 1),
                 fge=round(float(1 / sub.mean()), 2),
                 F=round(float(np.diag(sub).mean() - 1), 3),
                 lines=len(set(cluster[picks]) - {0}))
        for f in FAMILIES[:3]:
            r[f] = round(100 * float((best[family == f] >= 0.25).mean()), 1)
        if lineage:
            q = flow.contributions(ref[picks])
            reached = flow.founder_shares(q) > 0
            r.update(founders=int((q[flow.full] > 0).sum()),
                     pool=round(100 * float(ref_shares[reached].sum()), 1),
                     major=int((q[major[:n80]] > 0).sum()))
        return r

    coverage, _ = greedy_select(A, cand, args.pick)
    diversity = diverse_select(A, deep, args.pick)
    combined = diverse_select(A, deep, args.pick, start=coverage[:args.combined_first])
    designs = dict(candidates=len(cand), deep_candidates=len(deep), min_depth=args.min_depth,
                   combined_first=args.combined_first, major_n=n80, reference_fge=founders['fge'])
    for name, picks in (('coverage', coverage), ('diversity', diversity), ('combined', combined)):
        designs[name] = dict(
            curve=[measure(picks[:k], lineage=False) for k in range(1, args.pick + 1)],
            final=measure(picks),
            families={f: int((family[picks] == f).sum()) for f in FAMILIES},
            depth=round(float(depth[picks].mean()), 1))
        log(name, designs[name]['final'], designs[name]['families'])

    designs['splits'] = []
    for first in sorted({0, 5, 10, 15, 20, 30, args.pick}):
        picks = diverse_select(A, deep, args.pick, start=coverage[:first])
        designs['splits'].append(dict(first=first, **measure(picks, lineage=False)))

    rng = np.random.default_rng(1)
    draws = [measure(rng.choice(cand, args.pick, replace=False)) for _ in range(args.random_draws)]
    designs['random'] = {k: round(float(np.mean([d[k] for d in draws])), 1) for k in draws[0]}
    log('random', designs['random'])

    with open(os.path.join(args.out, 'sampling.json'), 'w') as f:
        json.dump(dict(founders=founders, designs=designs), f, indent=1)
    log('done')


if __name__ == '__main__':
    main()
