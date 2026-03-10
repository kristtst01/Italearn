# ItaLearn Project Memory

## Project Overview
Italian language learning app (React + TS + Vite). Local-first, browser-only.
See root CLAUDE.md for full structure and conventions.

## Key Architecture
- Zustand stores with Dexie (IndexedDB) persistence
- FSRS-based spaced repetition (ts-fsrs library)
- Static curriculum data bundled in app
- Path alias: `@/` → `frontend/src/`
- All commands run from `frontend/` directory

## Development Status
- Phase 1 MVP in progress
- Unit 1 content complete (2 lessons, ~20 exercises)
- SRS engine + stores complete (#3)
- Curriculum structure complete (#4)
- Exercise components (#5), Lesson screen (#6) — in progress
- No tests, no backend, no audio/speech yet

## GitHub Issues Tracking
- Issue #3: SRS engine — DONE
- Issue #4: Curriculum content — DONE (unit 1)
- Issue #5: Exercise components — in progress
- Issue #6: Lesson screen — depends on #3, #4, #5
