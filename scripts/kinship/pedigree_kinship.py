#!/usr/bin/env python3
"""Pedigree kinship analysis for picking Great Danes to sequence.

Reads a pipe-delimited pedigree export (Quintess .dbw format:
id|name|dob|sire|dam|?|titles|reg|color|sex, parent -1 = unknown), plus
optional supplement files in the same format, then:

  1. computes inbreeding (F) for every dog and the additive relationship
     matrix A among a reference population (dogs born in a year range),
  2. greedily selects dogs to sequence so that as many reference dogs as
     possible have a close relative in the sequenced set,
  3. clusters the reference population by relatedness,
  4. writes a GEXF graph (for Gephi / Gephi Lite) and CSV/JSON summaries.

A = T D T' with T = (I - P)^-1 (P holds 1/2 at each parent), so any
column block of A comes from sparse triangular solves; nothing ever needs
the full 100k x 100k matrix.

The pedigree data is private: keep inputs and outputs out of the repo.
"""
import argparse
import collections
import csv
import json
import os
import sys
import time
from xml.sax.saxutils import quoteattr

import numpy as np
import scipy.sparse as sp
from scipy.cluster.hierarchy import fcluster, linkage
from scipy.sparse.linalg import splu
from scipy.spatial.distance import squareform


def log(*a):
    print(f"[{time.strftime('%H:%M:%S')}]", *a, file=sys.stderr, flush=True)


def read_dbw(path):
    """Yield 10-field records; rejoins the few records broken by stray newlines."""
    buf = ''
    with open(path, encoding='latin-1') as f:
        for line in f:
            buf += line.rstrip('\r\n')
            if buf.count('|') >= 9:
                yield [x.strip() for x in buf.split('|')]
                buf = ''


def birth_year(dob):
    if len(dob) >= 4 and dob[:4].isdigit():
        y = int(dob[:4])
        # a handful of records carry 2026-2029 dates; they are 1920s typos
        return y - 100 if y > 2025 else y
    return None


def load(paths):
    dogs = {}
    for p in paths:  # later files override earlier ones
        for r in read_dbw(p):
            if not r[0]:
                continue
            dogs[r[0]] = dict(id=r[0], name=r[1].replace('"', "'"),
                              year=birth_year(r[2]), sire=r[3], dam=r[4],
                              titles=r[6], reg=r[7], color=r[8],
                              sex=r[9].upper() if r[9].upper() in 'MF' else '')
    for d in dogs.values():
        for k in ('sire', 'dam'):
            if d[k] not in dogs or d[k] == d['id']:
                d[k] = None
    return dogs


def drop_impossible_links(dogs, max_bridge=10):
    """Remove parent links that make a dog older than its ancestor.

    Direct case: parent born after the child. Bridged case: the only dated
    dog reached by climbing through undated ancestors is younger than the
    dated descendant; the link into that too-young dog is the one dropped
    (in this export these are typically off-by-one ids from data entry).
    Returns the dropped links for reporting.
    """
    dropped = []

    def drop(child, key, reason):
        dropped.append(dict(child=child, child_name=dogs[child]['name'],
                            child_year=dogs[child]['year'], link=key,
                            parent=dogs[child][key], parent_name=dogs[dogs[child][key]]['name'],
                            parent_year=dogs[dogs[child][key]]['year'], reason=reason))
        dogs[child][key] = None

    for x in dogs.values():
        for k in ('sire', 'dam'):
            p = x[k]
            if p and x['year'] and dogs[p]['year'] and dogs[p]['year'] > x['year']:
                drop(x['id'], k, 'parent born after child')
    for x in list(dogs.values()):
        if not x['year']:
            continue
        stack = [(x[k], 1) for k in ('sire', 'dam') if x[k]]
        seen = set()
        while stack:
            c, depth = stack.pop()
            if c in seen or dogs[c]['year'] or depth > max_bridge:
                continue
            seen.add(c)
            for k in ('sire', 'dam'):
                p = dogs[c][k]
                if not p:
                    continue
                if dogs[p]['year'] and dogs[p]['year'] > x['year']:
                    drop(c, k, f"ancestor of {x['id']} ({x['year']}) via undated dogs")
                else:
                    stack.append((p, depth + 1))
    return dropped


def ancestors_order(dogs, roots, dropped=None):
    """Ancestors of roots (inclusive), parents before children; breaks loops."""
    order, state = [], {}
    for root in roots:
        stack = [(root, False)]
        while stack:
            i, done = stack.pop()
            if done:
                state[i] = 2
                order.append(i)
                continue
            if state.get(i):
                continue
            state[i] = 1
            stack.append((i, True))
            for k in ('sire', 'dam'):
                p = dogs[i][k]
                if p is None:
                    continue
                if state.get(p) == 1:  # p is its own descendant: data error
                    if dropped is not None:
                        dropped.append(dict(child=i, child_name=dogs[i]['name'],
                                            child_year=dogs[i]['year'], link=k, parent=p,
                                            parent_name=dogs[p]['name'],
                                            parent_year=dogs[p]['year'],
                                            reason='pedigree loop'))
                    dogs[i][k] = None
                elif not state.get(p):
                    stack.append((p, False))
    return order


class Pedigree:
    def __init__(self, dogs, order):
        self.ids = order
        self.idx = {d: i for i, d in enumerate(order)}
        n = len(order)
        self.sire = np.array([self.idx.get(dogs[d]['sire'], -1) for d in order])
        self.dam = np.array([self.idx.get(dogs[d]['dam'], -1) for d in order])
        rows, cols = [], []
        for i in range(n):
            for p in (self.sire[i], self.dam[i]):
                if p >= 0:
                    rows.append(i)
                    cols.append(p)
        P = sp.csc_matrix((np.full(len(rows), 0.5), (rows, cols)), shape=(n, n))
        # (I-P)' is upper triangular in this order; natural ordering = no fill-in
        self.lu = splu(sp.csc_matrix(sp.eye(n) - P).T.tocsc(), permc_spec='NATURAL',
                       options=dict(SymmetricMode=True))
        self.gen = self._generations()
        self.F = np.zeros(n)
        self.D = np.ones(n)

    def _generations(self):
        g = np.zeros(len(self.ids), dtype=int)
        for i in range(len(self.ids)):
            ps = [g[p] for p in (self.sire[i], self.dam[i]) if p >= 0]
            g[i] = max(ps) + 1 if ps else 0
        return g

    def paths(self, cols):
        """Columns of T' for the given dogs: ancestor gene contributions."""
        E = np.zeros((len(self.ids), len(cols)))
        E[cols, np.arange(len(cols))] = 1.0
        return self.lu.solve(E)

    def compute_inbreeding(self, batch=1500):
        """F_i = a(sire, dam)/2, solved generation by generation so D is ready."""
        n = len(self.ids)
        both = (self.sire >= 0) & (self.dam >= 0)
        for g in range(self.gen.max() + 1):
            members = np.where(self.gen == g)[0]
            todo = members[both[members]]
            for b in range(0, len(todo), batch):
                c = todo[b:b + batch]
                X, Y = self.paths(self.sire[c]), self.paths(self.dam[c])
                self.F[c] = 0.5 * np.einsum('ij,i,ij->j', X, self.D, Y)
            for i in members:
                s, d = self.sire[i], self.dam[i]
                if s >= 0 and d >= 0:
                    self.D[i] = 0.5 - 0.25 * (self.F[s] + self.F[d])
                elif s >= 0 or d >= 0:
                    self.D[i] = 0.75 - 0.25 * self.F[max(s, d)]
            log(f'  generation {g}: {len(members)} dogs')
        assert n == len(self.F)

    def relationship_block(self, cols, batch=1500):
        """A[cols, cols], plus pedigree completeness (equivalent generations)."""
        R = np.empty((len(self.ids), len(cols)), dtype=np.float32)
        ecg = np.empty(len(cols))
        sd = np.sqrt(self.D)
        for b in range(0, len(cols), batch):
            X = self.paths(cols[b:b + batch])
            ecg[b:b + batch] = X.sum(axis=0) - 1.0
            R[:, b:b + batch] = X * sd[:, None]
        return (R.T @ R).astype(np.float64), ecg


def greedy_select(A, candidates, k, close=0.25):
    """Pick dogs one at a time, each maximizing the mean over the reference
    population of (relationship to its closest sequenced dog)."""
    best = np.zeros(A.shape[0])
    chosen, steps = [], []
    cand = np.array(candidates)
    for _ in range(k):
        gain = np.maximum(A[:, cand], best[:, None]).mean(axis=0)
        j = cand[np.argmax(gain)]
        chosen.append(j)
        best = np.maximum(best, A[:, j])
        steps.append(dict(mean_best=float(best.mean()),
                          frac_close=float((best >= close).mean()),
                          frac_halfsib=float((best >= 0.25).mean()),
                          frac_fullsib=float((best >= 0.5).mean())))
        cand = cand[cand != j]
    return chosen, steps


def cluster(A, k, min_size=30):
    """Average-linkage clusters on 1 - normalized relationship.

    Dogs with no recorded common ancestry sit at distance exactly 1, so the
    top of the tree is a pile of tied merges and 'maxclust' collapses to one
    cluster. Instead, pick the cut height that yields closest to k clusters
    of at least min_size dogs; smaller groups are labelled 0.
    """
    dist = np.clip(1.0 - A / np.sqrt(np.outer(np.diag(A), np.diag(A))), 0, 1)
    dist = (dist + dist.T) / 2
    np.fill_diagonal(dist, 0)
    Z = linkage(squareform(dist, checks=False), method='average')
    best = None
    for t in np.unique(Z[:, 2])[::-1][:2000]:
        labels = fcluster(Z, t, criterion='distance')
        sizes = np.bincount(labels)
        big = int((sizes >= min_size).sum())
        if best is None or abs(big - k) < abs(best[0] - k):
            best = (big, labels, sizes)
        if big >= k:
            break
    _, labels, sizes = best
    order = [c for c in np.argsort(-sizes) if sizes[c] >= min_size]
    remap = {int(c): r + 1 for r, c in enumerate(order)}  # 1 = largest
    return np.array([remap.get(int(c), 0) for c in labels])


def write_gexf(path, nodes, edges):
    attrs = [('name', 'string'), ('year', 'integer'), ('sex', 'string'),
             ('color', 'string'), ('titles', 'string'), ('F', 'double'),
             ('ecg', 'double'), ('cluster', 'integer'), ('seq_rank', 'integer')]
    with open(path, 'w', encoding='utf-8') as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n'
                '<gexf xmlns="http://gexf.net/1.3" version="1.3">\n'
                '<graph defaultedgetype="undirected">\n<attributes class="node">\n')
        for i, (a, t) in enumerate(attrs):
            f.write(f'<attribute id="{i}" title="{a}" type="{t}"/>\n')
        f.write('</attributes>\n<nodes>\n')
        for n in nodes:
            f.write(f'<node id={quoteattr(n["id"])} label={quoteattr(n["name"])}><attvalues>')
            for i, (a, _) in enumerate(attrs):
                v = n.get(a)
                if v is not None and v != '':
                    f.write(f'<attvalue for="{i}" value={quoteattr(str(v))}/>')
            f.write('</attvalues></node>\n')
        f.write('</nodes>\n<edges>\n')
        for e, (s, t, w) in enumerate(edges):
            f.write(f'<edge id="{e}" source={quoteattr(s)} target={quoteattr(t)} weight="{w:.4f}"/>\n')
        f.write('</edges>\n</graph>\n</gexf>\n')


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('pedigree', nargs='+', help='.dbw file(s); later files override earlier ids')
    ap.add_argument('--out', required=True, help='output directory (keep outside the repo)')
    ap.add_argument('--from-year', type=int, default=2012)
    ap.add_argument('--to-year', type=int, default=2020)
    ap.add_argument('--candidates-from', type=int, default=None,
                    help='only dogs born this year or later may be picked (default: whole reference)')
    ap.add_argument('--include', default=None,
                    help='file of extra dog ids (one per line) to add to the reference population')
    ap.add_argument('--pick', type=int, default=40, help='how many dogs to select')
    ap.add_argument('--clusters', type=int, default=12)
    ap.add_argument('--edge-min', type=float, default=0.25,
                    help='min relationship for a graph edge (0.25 = half-sib level)')
    ap.add_argument('--max-neighbors', type=int, default=8)
    args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)

    dogs = load(args.pedigree)
    log(f'{len(dogs)} dogs loaded')
    dropped = drop_impossible_links(dogs)
    log(f'{len(dropped)} impossible parent links dropped (see data_issues.csv)')
    ref_ids = [d['id'] for d in dogs.values()
               if d['year'] and args.from_year <= d['year'] <= args.to_year
               and d['sire'] and d['dam']]
    if args.include:
        extra = [l.strip() for l in open(args.include) if l.strip() in dogs]
        ref_ids = list(dict.fromkeys(ref_ids + extra))
    log(f'reference population: {len(ref_ids)} dogs')

    order = ancestors_order(dogs, ref_ids, dropped)
    log(f'{len(order)} dogs in the trimmed pedigree')
    cache = os.path.join(args.out, 'matrix.npz')
    if os.path.exists(cache) and list(np.load(cache)['ids']) == ref_ids:
        log(f'reusing {cache}')
        z = np.load(cache)
        A, ecg, Fref, ngen = z['A'].astype(np.float64), z['ecg'], z['F'], int(z['ngen'])
    else:
        ped = Pedigree(dogs, order)
        ngen = int(ped.gen.max() + 1)
        log(f'{ngen} generations; computing inbreeding')
        ped.compute_inbreeding()
        cols = np.array([ped.idx[i] for i in ref_ids])
        log('computing relationship matrix')
        A, ecg = ped.relationship_block(cols)
        Fref = ped.F[cols]
        np.savez(cache, ids=np.array(ref_ids), A=A.astype(np.float32), ecg=ecg, F=Fref, ngen=ngen)

    cand = list(range(len(ref_ids)))
    if args.candidates_from:
        cand = [i for i, d in enumerate(ref_ids)
                if dogs[d]['year'] and dogs[d]['year'] >= args.candidates_from]
    log(f'selecting {args.pick} of {len(cand)} candidates')
    chosen, steps = greedy_select(A, cand, args.pick)
    log(f'clustering into {args.clusters} groups')
    cl = cluster(A, args.clusters)

    rank = {j: r + 1 for r, j in enumerate(chosen)}
    rows = []
    for i, d in enumerate(ref_ids):
        dog = dogs[d]
        rows.append(dict(id=d, name=dog['name'], year=dog['year'], sex=dog['sex'],
                         color=dog['color'], titles=dog['titles'], reg=dog['reg'],
                         F=round(float(Fref[i]), 4), ecg=round(float(ecg[i]), 2),
                         mean_kinship=round(float(A[i].mean() / 2), 4),
                         cluster=int(cl[i]), seq_rank=rank.get(i)))

    with open(os.path.join(args.out, 'reference_dogs.csv'), 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0]))
        w.writeheader()
        w.writerows(rows)
    with open(os.path.join(args.out, 'sequencing_picks.csv'), 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['rank', 'id', 'name', 'year', 'sex', 'cluster', 'F', 'ecg',
                    'mean_best_relationship', 'pct_with_halfsib_or_closer', 'pct_with_fullsib_or_closer'])
        for r, (j, s) in enumerate(zip(chosen, steps), 1):
            x = rows[j]
            w.writerow([r, x['id'], x['name'], x['year'], x['sex'], x['cluster'], x['F'], x['ecg'],
                        round(s['mean_best'], 4), round(100 * s['frac_halfsib'], 1),
                        round(100 * s['frac_fullsib'], 1)])

    # each dog keeps its closest few relatives above the threshold
    edges = {}
    for i in range(len(ref_ids)):
        a = A[i].copy()
        a[i] = 0
        for j in np.argsort(-a)[:args.max_neighbors]:
            if a[j] >= args.edge_min:
                edges[(min(i, j), max(i, j))] = float(a[j])
    edges = [(ref_ids[i], ref_ids[j], w) for (i, j), w in edges.items()]
    write_gexf(os.path.join(args.out, 'relatedness.gexf'), rows, edges)

    with open(os.path.join(args.out, 'data_issues.csv'), 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=['child', 'child_name', 'child_year', 'link',
                                          'parent', 'parent_name', 'parent_year', 'reason'])
        w.writeheader()
        w.writerows(dropped)

    by_year = collections.defaultdict(list)
    for x in rows:
        by_year[x['year']].append(x)
    summary = dict(
        dogs_loaded=len(dogs), links_dropped=len(dropped), reference=len(ref_ids), trimmed_pedigree=len(order),
        generations=ngen, edges=len(edges),
        mean_F=float(Fref.mean()), mean_kinship=float(A.mean() / 2), mean_ecg=float(ecg.mean()),
        by_year={y: dict(n=len(v), mean_F=float(np.mean([x['F'] for x in v])),
                         mean_ecg=float(np.mean([x['ecg'] for x in v])))
                 for y, v in sorted(by_year.items())},
        clusters={int(c): int((cl == c).sum()) for c in np.unique(cl)},
        selection=steps)
    with open(os.path.join(args.out, 'summary.json'), 'w') as f:
        json.dump(summary, f, indent=1)
    log('done')


if __name__ == '__main__':
    main()
