"""Rewrite lesson JSON files in the repo's style (short objects and arrays on one line).

Usage, from the repo root:
    python3 tools/authoring/format_lessons.py frontend/src/data/units/unit-01/*.json

Run it after editing a lesson by hand, so diffs stay small. It only changes formatting.
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from lessonfmt import dump_lesson

for path in sys.argv[1:]:
    dump_lesson(json.load(open(path)), path)
    print('formatted', path)
