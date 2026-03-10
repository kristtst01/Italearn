# ItaLearn - AI Agent Guide

Italian learning app. Local-first, browser-only (no backend yet).

## Tech Stack
- **Frontend:** React 19 + TypeScript (strict) + Vite 7
- **Styling:** Tailwind CSS 4
- **State:** Zustand 5 (stores in `frontend/src/stores/`)
- **Persistence:** Dexie.js (IndexedDB) — no cloud sync
- **SRS:** ts-fsrs (Free Spaced Repetition Scheduler)
- **Routing:** React Router DOM 7

## Commands (run from `frontend/`)
```
npm run dev       # Vite dev server
npm run build     # tsc -b && vite build
npm run lint      # ESLint
npm run preview   # Preview production build
```

## Project Structure
```
frontend/src/
  App.tsx              # Router: /, /lesson/:id, /review
  main.tsx             # Entry point
  types/               # All TypeScript interfaces (barrel: index.ts)
    curriculum.ts      # Section, Unit, Lesson, Exercise
    exercise.ts        # ExerciseType, ExerciseSubtype, ExercisePrompt
    progress.ts        # UserProgress, SRSCard, ExerciseResult
  stores/
    db.ts              # Dexie DB: tables srsCards, progress, lessonsCompleted
    progressStore.ts   # useProgressStore — user progress, lesson completion
    srsStore.ts        # useSrsStore — due cards, add/review cards
  engine/
    srs.ts             # createCard, reviewCard, getDueCards, getCardCount
  data/
    curriculum.ts      # Full curriculum structure (10 sections, 38 units)
    units/unit-01.json # Unit 1 content (only populated unit)
  pages/
    Path.tsx           # Learning path dashboard (/)
    Lesson.tsx         # Lesson view (/lesson/:id)
    Review.tsx         # SRS review queue (/review)
  components/          # Exercise components (in progress)
  hooks/               # Custom hooks (empty)
```

## Key Conventions
- **Path alias:** `@/` maps to `frontend/src/` (vite + tsconfig)
- **IDs:** `section-01`, `unit-01`, `unit-01-lesson-01`, `unit-01-lesson-01-ex-01`
- **Stores:** `use` prefix, async actions, auto-persist to Dexie
- **Hydration:** Stores call `.hydrate()` on mount, set `hydrated: true`
- **Types:** PascalCase, separate files per domain, barrel export from `types/index.ts`
- **Components:** Functional + hooks, PascalCase filenames

## Data Flow
User Input → React Component → Zustand Store Action → Dexie (IndexedDB)
Curriculum data is static/bundled. User progress & SRS state are in IndexedDB.

## Database Schema (Dexie v1)
- `srsCards`: `++id, [word_id+skill_type], due` — FSRS card state
- `progress`: `++id` — singleton (id=1), user progress
- `lessonsCompleted`: `++id, &lesson_id` — completed lesson tracking

## Exercise Types
| ExerciseType | Subtypes |
|---|---|
| vocab | multiple_choice, type_answer, match_pairs |
| writing | arrange_words, fill_blank, cloze, type_answer |
| speaking | read_aloud, listen_and_repeat, respond_to_prompt, minimal_pair |
| listening | listen_and_choose, dictation, listen_and_respond, minimal_pair |

## Current State (Phase 1 MVP)
- Unit 1 has content (2 lessons, ~20 exercises)
- Units 2-38 are skeleton (no lessons/exercises)
- SRS engine and stores are complete
- Exercise components, lesson runner, and page integration are in progress
- No tests, no backend, no audio/speech yet
