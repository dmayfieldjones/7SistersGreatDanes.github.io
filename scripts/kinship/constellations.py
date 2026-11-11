"""Constellations: groups of dogs that belong to the same lines of descent.

The pedigree is one big network (dog - parent links). A community-detection pass
(Leiden, a refinement of Louvain) cuts it where links are sparse between groups
and dense inside them. The number of groups is not chosen by hand: the
resolution is swept and the partition with the highest modularity (the share of
links inside groups beyond what chance would put there) wins. Groups too small
to draw are folded into the group they are linked to most. Each group is then
named for the kennel that best characterises it.
"""
import collections

import numpy as np

MIN_SIZE = 150          # a constellation needs at least this many dogs
RESOLUTIONS = (0.4, 0.6, 0.8, 1.0, 1.25, 1.6, 2.0, 3.0)
SEEDS = (1, 2, 3)


def sweep(sg, log=print):
    """Leiden at several resolutions and seeds. Returns (best labels, table rows).
    Quality is modularity at resolution 1 for every partition, so rows are comparable."""
    import leidenalg as la
    rows, best = [], None
    for r in RESOLUTIONS:
        parts = []
        for sd in SEEDS:
            p = la.find_partition(sg, la.RBConfigurationVertexPartition,
                                  resolution_parameter=r, seed=sd, n_iterations=3)
            lab = np.array(p.membership)
            parts.append((sg.modularity(lab), lab))
        q, lab = max(parts, key=lambda t: t[0])
        k_big = int((np.bincount(lab) >= MIN_SIZE).sum())
        # stability: agreement between the seeds (normalised mutual information)
        nmi = np.mean([__import__('igraph').compare_communities(parts[i][1], parts[j][1], method='nmi')
                       for i in range(len(parts)) for j in range(i + 1, len(parts))])
        rows.append(dict(resolution=r, groups=k_big, modularity=round(float(q), 4), stability=round(float(nmi), 3)))
        log(f'  resolution {r}: {k_big} groups of {MIN_SIZE}+ dogs, modularity {q:.4f}, seed agreement {nmi:.3f}')
        if best is None or q > best[0]:
            best = (q, lab, r)
    log(f'  best: resolution {best[2]} (modularity {best[0]:.4f})')
    return best[1], rows


def merge_small(sg, lab, min_size=MIN_SIZE):
    """Fold groups under min_size into the neighbouring group they share the most links with.
    Returns labels renumbered 0..k-1, largest group first."""
    lab = lab.copy()
    E = np.array(sg.get_edgelist())
    while True:
        size = np.bincount(lab)
        small = [c for c in np.where((size > 0) & (size < min_size))[0]]
        if not small:
            break
        c = min(small, key=lambda c: size[c])
        m = (lab[E[:, 0]] == c) ^ (lab[E[:, 1]] == c)
        other = np.where(lab[E[m, 0]] == c, lab[E[m, 1]], lab[E[m, 0]])
        if len(other) == 0:                       # no links out: leave it with the largest group
            lab[lab == c] = size.argmax()
        else:
            lab[lab == c] = collections.Counter(other.tolist()).most_common(1)[0][0]
    size = np.bincount(lab)
    order = [c for c in np.argsort(-size, kind='stable') if size[c] > 0]
    remap = np.zeros(len(size), int)
    remap[order] = np.arange(len(order))
    return remap[lab]


def name_groups(lab, kennels, min_purity=0.35):
    """Name each group for the kennel that best characterises it.
    kennels: [(label, rows)] with rows indexing `lab`. Score = overlap / sqrt(kennel size * group size),
    so a kennel must both fill much of the group and sit mostly inside it. Each kennel names one group.
    Returns a list of names ('' where nothing fits) and the share of the group's dogs carrying the name."""
    k = int(lab.max()) + 1
    size = np.bincount(lab, minlength=k)
    cand = []
    for label, rows in kennels:
        rows = np.asarray(rows)
        if len(rows) < 5 or len(label) < 4:    # too short to be a recognisable kennel name
            continue
        cnt = np.bincount(lab[rows], minlength=k)
        for c in np.where(cnt > 0)[0]:
            purity = cnt[c] / len(rows)
            if purity >= min_purity:
                cand.append((cnt[c] / np.sqrt(len(rows) * size[c]), int(c), label, cnt[c] / size[c]))
    cand.sort(reverse=True)
    names, share, used = [''] * k, [0.0] * k, set()
    for score, c, label, sh in cand:
        if names[c] or label in used:
            continue
        names[c], share[c] = label, sh
        used.add(label)
    return names, share
