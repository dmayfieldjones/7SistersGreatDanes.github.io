#!/usr/bin/env python3
"""Builds public/breed-galaxy.html: every dog in a pedigree export as one picture.

usage: build_family_galaxy.py <pedigree.dbw> <template.html> <out.html> [--cache DIR]
         [--extra supplement.dbw ...] [--ours-regs REG,REG] [--export-end 2020]
Supplements: supplement_from_explorers.py <export> supp.dbw <explorer pages...>, plus ours-litters.dbw.
Set KENNEL_EXCLUDE=name,name in the shell for affixes that must never be listed.
Needs `pip install igraph` (force layout only; not needed by the other scripts).

Dogs are placed by a force layout of the whole pedigree graph (both parents), so
lineages form their own filaments. Birth year (imputed from relatives for the
~40% of dogs without a date), coat family and 10-generation inbreeding are the
only per-dog fields. The page carries NO ids, names, registrations or kennels;
dog order is shuffled; parent links are anonymous row numbers into that
shuffled order. Dogs outside the one big connected pedigree are left out.
"""
import argparse
import base64
import json
import multiprocessing as mp
import os
import random

import numpy as np

import history
from history import coi10, color_family
import kennels as K
from pedigree_kinship import ancestors_order, drop_impossible_links, load, log

COATS = [None, 'fawn', 'blue', 'harlequin', 'black', 'other']


def impute_years(sire, dam, year):
    """Undated dogs take their parents' year + 4 or their offspring's year - 4."""
    year = year.copy()
    for _ in range(60):
        acc = np.zeros(len(year)); cnt = np.zeros(len(year))
        for p in (sire, dam):
            has = p >= 0
            pp = np.where(has, p, 0)
            m = has & (year > 0) & (year[pp] == 0)      # dated child -> undated parent
            np.add.at(acc, p[m], year[m] - 4); np.add.at(cnt, p[m], 1)
            m = has & (year == 0) & (year[pp] > 0)      # undated child, dated parent
            idx = np.where(m)[0]
            np.add.at(acc, idx, year[p[m]] + 4); np.add.at(cnt, idx, 1)
        new = (year == 0) & (cnt > 0)
        if not new.any():
            break
        year[new] = np.round(acc[new] / cnt[new])
    return year


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('pedigree'); ap.add_argument('template'); ap.add_argument('out')
    ap.add_argument('--cache', default='/tmp/galaxy-cache')
    ap.add_argument('--export-end', type=int, default=2020, help='last year the export covers well; later dogs are supplement-only')
    ap.add_argument('--extra', action='append', default=[], help='supplement .dbw files, loaded after the export')
    ap.add_argument('--ours-regs', default='', help='comma-separated registrations of the farm\'s own dogs (besides names containing 7Sisters)')
    a = ap.parse_args()
    os.makedirs(a.cache, exist_ok=True)

    D = load([a.pedigree] + a.extra); drop_impossible_links(D)
    ids = list(D); ix = {d: i for i, d in enumerate(ids)}; N = len(ids)
    sire = np.array([ix[D[d]['sire']] if D[d]['sire'] else -1 for d in ids])
    dam = np.array([ix[D[d]['dam']] if D[d]['dam'] else -1 for d in ids])
    dated = np.array([bool(D[d]['year']) for d in ids])
    year0 = np.array([D[d]['year'] or 0 for d in ids], float)
    year = impute_years(sire, dam, year0)
    ok = year > 0
    log(f'{N} dogs, {dated.sum()} dated, {ok.sum()} with a (possibly imputed) year')

    import igraph as ig
    E = []
    for p in (sire, dam):
        m = (p >= 0) & ok & ok[np.where(p >= 0, p, 0)]
        E.append(np.stack([np.where(m)[0], p[m]], 1))
    E = np.concatenate(E)
    g = ig.Graph(n=N, edges=E.tolist())
    comp = g.connected_components()
    mem = np.array(comp.membership); sz = np.array(comp.sizes())
    keep = np.where((mem == sz.argmax()) & ok)[0]
    log(f'big component: {len(keep)} dogs')
    cache = os.path.join(a.cache, 'xy.npy')
    if os.path.exists(cache) and len(np.load(cache)) == len(keep):
        xy = np.load(cache)
    else:
        log('force layout (about 2 minutes)')
        random.seed(3); np.random.seed(3)
        xy = np.array(g.subgraph(keep).layout_drl().coords); np.save(cache, xy)

    # inbreeding to 10 generations (same as the history script)
    dated_ids = [ids[i] for i in keep]
    history.DOGS = D
    order = ancestors_order(D, list(D), [])
    history.POS = {d: i for i, d in enumerate(order)}
    log('inbreeding')
    with mp.Pool(max(1, os.cpu_count() - 2)) as pool:
        F = dict((d, f) for d, f, _, _ in pool.imap_unordered(coi10, dated_ids, chunksize=200))

    # shuffle, quantize, pack
    perm = np.random.RandomState(11).permutation(len(keep))
    keep = keep[perm]; xy = xy[perm]
    row = {int(k): i for i, k in enumerate(keep)}
    lo, hi = xy.min(axis=0), xy.max(axis=0)   # full range: nothing clipped at the edges
    span = (hi - lo).max()
    q = np.clip((xy - lo) / span * 65535, 0, 65535).astype('<u2')
    yr = np.clip(year[keep] - 1870, 0, 255).astype('u1')
    coat = np.array([COATS.index(color_family(D[ids[k]]['color'])) if color_family(D[ids[k]]['color']) else 0 for k in keep], 'u1')
    imputed = (~dated[keep]).astype('u1')
    meta = (coat | (imputed << 3)).astype('u1')
    f8 = np.clip(np.array([F[ids[k]] for k in keep]) * 255 / 0.5, 0, 255).astype('u1')   # 0..50% in 8 bits
    par = lambda arr: np.array([row.get(int(arr[k]), -1) if arr[k] >= 0 else -1 for k in keep], '<i4')
    s, d = par(sire), par(dam)
    # kennels: affix membership (by name only), mapped to rows of the galaxy
    mem = K.membership(D, ids)
    rowof = np.full(N, -1); rowof[keep] = np.arange(len(keep))
    def rows_of(arr): r = rowof[arr]; return r[r >= 0]
    yrk = year[keep]
    kn = []; used = set()
    def add(label, rows, curated):
        if len(rows) < 1: return
        kn.append([label, int(np.median(yrk[rows])), 1 if curated else 0, rows.astype('<i4')])
    for pick in K.PICKS:
        if isinstance(pick, tuple):
            label, rx = pick; rx = __import__('re').compile(rx)
            regs = set(filter(None, a.ours_regs.split(',')))
            arr = np.array([i for i, d in enumerate(ids) if rx.search(K.clean(D[d]['name'])) or (label == '7Sisters' and regs & set(t.strip() for t in D[d]['reg'].split('/')))], int)
        else:
            label, arr = pick.title(), mem.get(pick, np.array([], int))
        rows = rows_of(arr)
        if len(rows) == 0: log(f'  kennel {label}: no dogs in the file'); continue
        add(label, rows, True); used.add(label.lower())
    # every kennel-like name (its dogs are related to each other, and the word is mostly used as
    # an affix) gets a button from MIN_CHIP_DOGS dogs and is searchable from
    # MIN_SEARCH_DOGS. Names whose dogs are mostly already in a picked kennel are skipped
    # (a one-word 'Divine' next to the picked 'Divine Acres').
    wc = K.word_counts(D, ids)
    picked_sets = [set(x[3].tolist()) for x in kn]
    cands = sorted(((len(arr), k, arr) for k, arr in mem.items()
                    if k not in K.EXCLUDE and len(arr) >= K.MIN_SEARCH_DOGS and k.title().lower() not in used),
                   key=lambda t: -t[0])
    for n, k, arr in cands:
        coh = K.cohesion(arr, sire, dam)
        if coh < K.MIN_COHESION or (n / max(1, wc[k]) < 0.6 and coh < 0.8): continue
        rows = rows_of(arr)
        if len(rows) < K.MIN_SEARCH_DOGS: continue
        rs = set(rows.tolist())
        if any(len(rs & ps) >= 0.8 * len(rs) for ps in picked_sets): continue
        add(k.title(), rows, n >= K.MIN_CHIP_DOGS)
    log(f'{sum(1 for x in kn if x[2])} picked kennels, {len(kn)} searchable')
    b64 = lambda x: base64.b64encode(x.tobytes()).decode()
    data = dict(n=len(keep), all=N, left=round(100 * (1 - len(keep) / N)), aspect=float((hi - lo)[1] / span), x=b64(q[:, 0]), y=b64(q[:, 1]), yr=b64(yr),
                meta=b64(meta), f=b64(f8), sire=b64(s), dam=b64(d), y0=1870, ex=a.export_end,
                kn=[[k[0], k[1], k[2], len(k[3]), b64(k[3])] for k in kn])
    html = open(a.template, encoding='utf-8').read().replace('/*DATA*/null', json.dumps(data, separators=(',', ':')))
    open(a.out, 'w', encoding='utf-8').write(html)
    log(f'wrote {a.out} {len(html)//1024} KB')


if __name__ == '__main__':
    main()
