#!/usr/bin/env python3
"""Build a .dbw supplement (same format as the pedigree export) from the
pedigree-explorer pages, for dogs the export lacks (recent litters and
their close relatives). Parents are linked by name through the explorer
nodes' tooltips, and by registration number to export ids where present.

usage: supplement_from_explorers.py export.dbw out.dbw page.html [page.html ...]
"""
import re
import sys

NODE = re.compile(r"^\s*(\d+):\{n:(['\"])(.*?)\2,r:(['\"])(.*?)\4(.*?)tip:(['\"])(.*)\7\},?\s*$", re.M)


def unesc(s):
    return s.replace("\\'", "'").replace('\\"', '"').encode().decode('unicode_escape') if '\\u' in s else s.replace("\\'", "'")


def read_export(path):
    buf, out = '', []
    for line in open(path, encoding='latin-1'):
        buf += line.rstrip('\r\n')
        if buf.count('|') >= 9:
            out.append([x.strip() for x in buf.split('|')])
            buf = ''
    return out


def main():
    export, out, pages = sys.argv[1], sys.argv[2], sys.argv[3:]
    by_reg = {}
    for r in read_export(export):
        for t in re.split(r'\s*/\s*', r[7]):
            if t:
                by_reg[t] = r[0]
    dogs = {}   # key: reg, else name
    for page in pages:
        for m in NODE.finditer(open(page, encoding='utf-8').read()):
            name, rest, tip = unesc(m.group(3)), unesc(m.group(5)), unesc(m.group(8))
            parts = [p.strip() for p in rest.split(' · ')]
            if len(parts) < 4 or ' × ' in name:
                continue
            reg = parts[0].split(' / ')[0]
            sire = re.search(r'Sire: (.*?)(?: \| |$)', tip)
            dam = re.search(r'Dam: (.*?)(?: \| |$)', tip)
            d = dict(name=name, reg=reg, color=parts[1], sex=parts[2], dob=parts[3],
                     sire=sire.group(1) if sire else '', dam=dam.group(1) if dam else '')
            dogs.setdefault(reg, d)
    name2reg = {d['name']: r for r, d in dogs.items()}
    n_new = 0
    with open(out, 'w', encoding='latin-1', errors='replace') as f:
        for reg, d in dogs.items():
            if reg in by_reg:
                continue
            n_new += 1
            def pid(pname):
                r = name2reg.get(pname)
                return by_reg.get(r) or (f'X-{r}' if r else '-1')
            f.write('|'.join([f'X-{reg}', d['name'], d['dob'], pid(d['sire']), pid(d['dam']),
                              '', '', reg, d['color'], d['sex']]) + '\n')
    print(f'{len(dogs)} explorer dogs, {n_new} not in export', file=sys.stderr)


main()
