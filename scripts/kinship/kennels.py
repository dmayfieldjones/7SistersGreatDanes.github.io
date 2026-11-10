"""Kennel names as they appear inside registered dog names, and how far each kennel's dogs reach.

A kennel affix is the first word of a name (prefix kennels) or the word after of/von/vom/de/...
at its end (suffix kennels). It is a heuristic on names only: the export has no kennel field.
"""
import re
import collections

import numpy as np
import scipy.sparse as sp

SUFFIX_RE = re.compile(r"\b(?:of|von|vom|v|de|du|at|van|della|di|des|zum|zur)\s+(?:the\s+)?([^\W\d_][\w'’\-]*)(?:\s+[A-Z][\w'’\-]*)?\s*$", re.I)
GENERIC = set('''lady von sir the king queen princess prince duke duchess baron lord miss mr mrs dr great grand honey blue black dane danes
white fawn harlequin brindle my little big sweet pretty golden silver diamond magic bella flora lincoln harley lucky star
mantle sugar sunny angel buddy big baby bear bo jazz joy gentle noble royal regal mighty giant tall titan thor zeus zeus'
champion ch gch cd of de la le el der den die das und and a an in on at to for with from vom v van du des di'''.split())


def norm(s):
    return re.sub(r"['’`]s?$", '', s.strip(), flags=re.I).lower()


def affixes(name):
    """The kennel affix(es) a registered name carries: (prefix, suffix) each possibly None."""
    n = re.sub(r'^"[^"]*"\s*', '', name).strip()
    w = n.split()
    if not w:
        return None, None
    p = norm(w[0])
    p = None if p in GENERIC or len(p) < 3 or not re.search(r'[a-z]', p) else p
    m = SUFFIX_RE.search(n)
    s = norm(m.group(1)) if m else None
    s = None if s in GENERIC or (s and len(s) < 3) else s
    return p, s


def membership(dogs, ids):
    """kennel affix -> array of row indices in `ids` carrying it (as prefix or suffix)."""
    by = collections.defaultdict(set)
    for i, d in enumerate(ids):
        p, s = affixes(dogs[d]['name'])
        for k in (p, s):
            if k:
                by[k].add(i)
    return {k: np.array(sorted(v)) for k, v in by.items()}


def reach(sire, dam, members, keys, mask, chunk=64):
    """For each kennel: how many dogs under `mask` descend from any of its dogs (inclusive)."""
    N = len(sire)
    rows = np.concatenate([np.where(sire >= 0)[0], np.where(dam >= 0)[0]])
    cols = np.concatenate([sire[sire >= 0], dam[dam >= 0]])
    C = sp.csr_matrix((np.ones(len(rows), np.float32), (cols, rows)), shape=(N, N))  # parent -> child
    out = {}
    for a in range(0, len(keys), chunk):
        ks = keys[a:a + chunk]
        X = np.zeros((N, len(ks)), np.float32)
        for j, k in enumerate(ks):
            X[members[k], j] = 1
        Y = X.copy()
        for _ in range(60):
            Z = (C @ X) > 0
            new = Z & (Y == 0)
            if not new.any():
                break
            Y[new] = 1
            X = new.astype(np.float32)
        for j, k in enumerate(ks):
            out[k] = int(Y[mask, j].sum())
    return out


# Hand-picked buttons. A plain word is a name affix (prefix or suffix, see affixes());
# a (label, regex) pair matches the whole cleaned registered name. Group (modern or
# earlier) comes from the median birth year of the dogs that carry the name.
PICKS = [
    ('7Sisters', r'\b(7|seven)\s?sisters\b'),
    'leggo',
    ('Legado', r'legado'),
    ('Divine Acres', r'^divine acres\b'),
    ('Velocity', r"^velocity\b"),
    'chanoz', 'daynakin', 'divadanes', 'saravilla', 'wysiwyg', 'katcrew', 'northernaire', 'moonriver',
    'ellenni', 'dantrydanes', 'moredane', 'ravendane', 'lagarada', 'dundane', 'fendanesylcrest',
    'safrandane', 'rainmaster', 'bgdawgs', 'michaeldane', 'kingsize', 'hildydane', 'thor-kourt',
    'rojon', 'jerdans', 'kolyer', 'kochak', 'genedda', 'underane', 'amasa', 'danelyne', 'sharcon',
    'dahomey', 'dicarl', 'thunderfire', 'vanmore', 'haltmeier', 'caprata', 'damarkann', 'daneboa',
    'merriwa', 'danefred', 'dinro', 'helmlake', 'raatu',
    'hauer', 'laurado', 'raseac', 'anadane', 'dorneywood', 'riverwood', 'willowrun', 'sheridane',
    'devarro', 'meistersinger', 'stardayne', 'vi-dayne', 'jecamo', 'rokadanes', 'don-lu', 'bantry',
    'walkmyll', 'clausentum', 'ouborough', 'moonsfield', 'roxdane', 'winome', 'vakeck', 'treseder',
    'tallbrook',
]
OURS = {'7Sisters', 'Leggo', 'Legado'}
import os
EXCLUDE = set(filter(None, os.environ.get('KENNEL_EXCLUDE', '').lower().split(',')))   # affixes never listed (set in the shell, not in the repo)


def clean(name):
    return re.sub(r'^"[^"]*"\s*', '', name).strip().lower()


def word_counts(dogs, ids):
    """token -> number of dogs whose cleaned name contains it (anywhere)."""
    tok = collections.Counter()
    for d in ids:
        for t in {norm(t) for t in re.findall(r"[^\W\d_][\w'’\-]*", clean(dogs[d]['name']))}:
            tok[t] += 1
    return tok


CHIPS = 500   # buttons on the page; everything else with 15+ dogs is search-only
