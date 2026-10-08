# Authoring tools

Small Python helpers for writing chapters and grammar practice. No dependencies beyond Python 3.

**The JSON and Markdown files under `frontend/src/data/` are the source of truth.** These tools only help write them in a consistent shape. There is no build step that regenerates content, and existing lessons are edited directly.

| File | What it does |
|---|---|
| `lessonfmt.py` | Writes lesson JSON in the repo's style: short objects and arrays on one line, long ones broken. |
| `format_lessons.py` | Reformats lesson files in place after a hand edit: `python3 tools/authoring/format_lessons.py frontend/src/data/units/unit-01/*.json` |
| `chapterlib.py` | A `Lesson` builder with one method per exercise kind (`meaning`, `mc`, `cloze`, `say`, `line`, `arrange`, `fix`, `read`, `write`, `answer`), so a whole chapter can be written as one readable script. Numbers exercise ids and prints the `LessonMeta` lines for `curriculum.ts`. |
| `examples/chapter_having_and_needing.py` | Chapter 4 as written with `chapterlib`: word lessons, dialogue practice, two readings, single-text writing lessons, a speaking lesson. |
| `examples/grammar_nouns_articles.py` | The practice stops and mastery check for the Nouns & articles unit: exercises tagged with grammar points, each stop placed after a heading of the reading. |

The examples write to `tools/authoring/out/` (ignored by git), so running them never touches real content. To write a new chapter, copy the chapter example, set the unit id, point its output at `frontend/src/data/units/<unit>/`, and run it once. From then on, edit the JSON.

After writing or editing content, run the content check from `frontend/`:

```
npm run check:content
```

See [docs/exercise-generation-guide.md](../../docs/exercise-generation-guide.md) for how chapters and grammar units are meant to be written.
