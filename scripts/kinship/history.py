#!/usr/bin/env python3
"""Breeding choices through history, from a Quintessa .dbw export.

For every dog with a birth year: 10-generation inbreeding (COI10) and how
complete those 10 generations are; for every litter (sire, dam, year) with
both parents' colours recorded: the colour pairing. Writes per-dog and
per-litter CSVs plus a yearly summary JSON. Uses the same loading and
link-cleaning as pedigree_kinship.py.

COI10 treats ancestors more than 10 generations back (by their shortest
path) as unrelated founders, so dogs from different eras are compared on
the same depth. Early dogs still can't have 10 known generations; use the
completeness column to filter or weight.
"""
import argparse
import collections
import csv
import json
import multiprocessing as mp
import os

import numpy as np

from pedigree_kinship import ancestors_order, drop_impossible_links, load, log

DEPTH = 10
DOGS = {}
POS = {}


def colour_family(c):
    c = (c or '').lower()
    if not c:
        return None
    if any(w in c for w in ('harl', 'mantle', 'mantel', 'merle', 'white', 'pied', 'mis')):
        return 'harlequin'
    if 'blue' in c:
        return 'blue'
    if 'black' in c or 'blk' in c:
        return 'black'
    if 'brindle' in c or 'fawn' in c:
        return 'fawn'
    return 'other'


def coi10(dog):
    """10-generation COI and completeness (equivalent generations, max 10)."""
    depth = {dog: 0}
    frontier = [dog]
    slots = collections.Counter({dog: 1})  # paths reaching each ancestor at this depth
    ecg = 0.0
    for g in range(1, DEPTH + 1):
        nxt, nslots = [], collections.Counter()
        for x in frontier:
            for k in ('sire', 'dam'):
                p = DOGS[x][k]
                if p:
                    nslots[p] += slots[x]
                    if p not in depth:
                        depth[p] = g
                        nxt.append(p)
        ecg += sum(nslots.values()) / 2 ** g
        frontier, slots = list(nslots), nslots
    S = sorted(depth, key=POS.__getitem__)
    li = {x: i for i, x in enumerate(S)}
    n = len(S)
    A = np.zeros((n, n))
    for i, x in enumerate(S):
        ps = [li[DOGS[x][k]] for k in ('sire', 'dam')
              if DOGS[x][k] and depth[x] < DEPTH and DOGS[x][k] in li]
        if len(ps) == 2:
            A[i, :i] = 0.5 * (A[ps[0], :i] + A[ps[1], :i])
            A[i, i] = 1 + 0.5 * A[ps[0], ps[1]]
        elif len(ps) == 1:
            A[i, :i] = 0.5 * A[ps[0], :i]
            A[i, i] = 1
        else:
            A[i, i] = 1
        A[:i, i] = A[i, :i]
    return dog, float(A[li[dog], li[dog]] - 1), ecg, n


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('pedigree', nargs='+')
    ap.add_argument('--out', required=True)
    ap.add_argument('--workers', type=int, default=max(1, os.cpu_count() - 2))
    args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)

    global DOGS, POS
    DOGS = load(args.pedigree)
    dropped = drop_impossible_links(DOGS)
    order = ancestors_order(DOGS, list(DOGS), dropped)
    POS = {d: i for i, d in enumerate(order)}
    log(f'{len(DOGS)} dogs, {len(dropped)} links dropped')

    dated = [d for d, x in DOGS.items() if x['year']]
    log(f'COI10 for {len(dated)} dated dogs on {args.workers} workers')
    res = {}
    with mp.Pool(args.workers) as pool:
        for i, (d, f, ecg, n) in enumerate(pool.imap_unordered(coi10, dated, chunksize=200)):
            res[d] = (f, ecg, n)
            if i % 10000 == 0:
                log(f'  {i}')

    with open(os.path.join(args.out, 'dogs_history.csv'), 'w', newline='', encoding='utf-8') as fh:
        w = csv.writer(fh)
        w.writerow(['id', 'year', 'sex', 'colour', 'family', 'coi10', 'ecg10', 'ancestors10'])
        for d in dated:
            x = DOGS[d]
            f, ecg, n = res[d]
            w.writerow([d, x['year'], x['sex'], x['color'], colour_family(x['color']) or '',
                        round(f, 5), round(ecg, 3), n])

    litters = {}
    for d in dated:
        x = DOGS[d]
        if x['sire'] and x['dam']:
            litters.setdefault((x['sire'], x['dam'], x['year']), []).append(d)
    with open(os.path.join(args.out, 'litters.csv'), 'w', newline='', encoding='utf-8') as fh:
        w = csv.writer(fh)
        w.writerow(['year', 'sire_family', 'dam_family', 'pairing', 'puppies', 'coi10'])
        for (s, m, y), pups in litters.items():
            fs, fm = colour_family(DOGS[s]['color']), colour_family(DOGS[m]['color'])
            pairing = ' x '.join(sorted([fs, fm])) if fs and fm else ''
            w.writerow([y, fs or '', fm or '', pairing, len(pups), round(res[pups[0]][0], 5)])
    log(f'{len(litters)} litters written')


if __name__ == '__main__':
    main()
