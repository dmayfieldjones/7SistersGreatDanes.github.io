#!/usr/bin/env python3
"""Build public/breeding-history.html from the aggregate study data.

usage: build_history_story.py [study.json] [template.html] [out.html]
Only aggregate yearly series are embedded; no dog-level data.
"""
import json
import os
import sys

root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(root, 'src/lib/kinship-study.json')
tpl = sys.argv[2] if len(sys.argv) > 2 else os.path.join(root, 'scripts/kinship/history-story.template.html')
out = sys.argv[3] if len(sys.argv) > 3 else os.path.join(root, 'public/breeding-history.html')
H = json.load(open(src))['history']
data = dict(
    counts=H['counts'],
    region_years=H['region_years'],
    coi=[dict(y=r['y'], good=r['good'], close=r['close']) for r in H['coi']],
    color=[dict(y=r['y'], cross=r['cross'], black_fawn=r['black_fawn']) for r in H['color']],
    recording=H['recording'],
)
html = open(tpl, encoding='utf-8').read().replace('/*DATA*/null', json.dumps(data, separators=(',', ':')))
open(out, 'w', encoding='utf-8').write(html)
print('wrote', out, len(html) // 1024, 'KB')
