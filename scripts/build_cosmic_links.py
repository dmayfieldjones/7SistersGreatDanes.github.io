#!/usr/bin/env python3
"""Build the registration-number -> link map for cosmicgreatdanes.com and merge it into public/data/our-pedigrees.json.

Nothing is downloaded except their small HTML pedigree pages (read once, to find names and numbers). Photos are only
checked with a HEAD request and then linked, never copied. Their pedigree pages sit at
  /images/{Dog}/{Dog}Pedigree.html          ({Dog} is the call name used on their site, found from their dog pages)
and each ancestor's photo is the link on the ancestor's name.

Result, stored under "cosmic": { "<AKC number>": {"page": <pedigree page URL>, "photo": <photo URL or ""> } }
Run:  python3 scripts/build_cosmic_links.py
"""
import json, re, sys, time, urllib.request, urllib.error
from html import unescape

BASE = 'https://www.cosmicgreatdanes.com'
OUT = 'public/data/our-pedigrees.json'
UA = {'User-Agent': 'Mozilla/5.0 (link checker for a Great Dane pedigree site)'}


def get(url, method='GET'):
    req = urllib.request.Request(url, headers=UA, method=method)
    try:
        with urllib.request.urlopen(req, timeout=25) as r:
            return r.status, (r.read().decode('latin1') if method == 'GET' else '')
    except urllib.error.HTTPError as e:
        return e.code, ''
    except Exception:
        return 0, ''


def candidate_names():
    names = {'Rafferty'}
    for p in ['', 'OurStars', 'Champions', 'CoStars', 'Nationalstars', 'FallenStars', 'Litterbox']:
        st, s = get(f'{BASE}/{p}.html' if p else f'{BASE}/')
        for h in re.findall(r'href="https?://www\.cosmicgreatdanes\.com/([A-Za-z0-9_\-]+)\.html"', s, re.I):
            if h not in ('AboutUs', 'Champions', 'CoStars', 'FallenStars', 'Litterbox', 'Nationalstars', 'OurStars', 'index', 'cd_index'):
                names.add(h)
        for h in re.findall(r'cosmicgreatdanes\.com/images/([A-Za-z0-9_\-]+)/', s, re.I):
            names.add(h)
        time.sleep(0.5)
    return sorted(names)


def parse(html, page):
    """Yield (reg, photo) for each ancestor cell on a SitStay-generated pedigree page."""
    out = []
    for cell in re.findall(r'<td[^>]*>(.*?)</td>', html, re.S | re.I):
        m = re.search(r'AKC#?-?\s*:?\s*([A-Z]{1,2}\d{5,8}(?:/\d{2})?)', cell)
        if not m:
            continue
        a = re.search(r'<a href="([^"]+)"', cell, re.I)
        photo = unescape(a.group(1)).replace('http://', 'https://') if a else ''
        out.append((m.group(1), photo))
    return out


def main():
    cosmic = {}
    for name in candidate_names():
        page = f'{BASE}/images/{name}/{name}Pedigree.html'
        st, html = get(page)
        if st != 200:
            continue
        found = parse(html, page)
        print(f'{name}: {len(found)} dogs', file=sys.stderr)
        for reg, photo in found:
            if photo and get(photo, 'HEAD')[0] != 200:
                photo = ''
            cur = cosmic.get(reg)
            if not cur or (photo and not cur['photo']):
                cosmic[reg] = {'page': page, 'photo': photo}
            time.sleep(0.2)
        time.sleep(0.5)
    j = json.load(open(OUT, encoding='utf8'))
    j['cosmic'] = cosmic
    json.dump(j, open(OUT, 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))
    print(f'{len(cosmic)} registration numbers linked ({sum(1 for v in cosmic.values() if v["photo"])} with photos)', file=sys.stderr)


if __name__ == '__main__':
    main()
