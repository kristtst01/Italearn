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
  App.tsx                # Router + HydrationGuard wrapper
  main.tsx               # Entry point

  features/
    lesson/              # Lesson exercise flow (/lesson/:id)
      LessonPage.tsx     # Orchestrator: loads lesson, renders header + exercise + completion
      useLessonState.ts  # All state + handlers (retry, completion, SRS card creation)
      LessonHeader.tsx   # Sticky header: exit button + progress bar + counter
      CompletionScreen.tsx # Score display, practice mistakes, continue
      ExitButton.tsx     # X button with confirmation popover

    review/              # SRS review session (/review)
      ReviewPage.tsx     # Orchestrator: intro → session → summary
      useReviewSession.ts # Session state, grading, SRS interactions
      ReviewIntro.tsx    # "N cards due" / "all caught up" screens
      ReviewSummary.tsx  # Post-session summary

    path/                # Learning path dashboard (/)
      PathPage.tsx       # Section view, unit grid, review button
      UnitCard.tsx       # Unit status display + lesson list toggle
      LessonList.tsx     # Lesson items with completion indicators
      StatusIcon.tsx     # Icon by status (locked/available/in_progress/completed)

    exercises/           # Shared exercise components (used by lesson + review)
      ExerciseShell.tsx  # Shared wrapper: check button + feedback display
      Feedback.tsx       # Correct/incorrect feedback bar
      MultipleChoice.tsx # Multiple choice exercise
      TypeAnswer.tsx     # Typed text answer exercise
      ArrangeWords.tsx   # Word arrangement exercise
      renderExercise.tsx # Exercise type dispatcher (switch on subtype)

  shared/
    components/
      HydrationGuard.tsx # Wraps routes, hydrates all stores before rendering
      LoadingScreen.tsx  # Shared loading state
      EmptyState.tsx     # Shared error/empty screen pattern
      ProgressBar.tsx    # Progress bar (used in Lesson + Review headers)
      CloseIcon.tsx      # Shared X icon SVG
    utils/
      shuffle.ts         # Fisher-Yates shuffle
      exercise.ts        # getCorrectAnswer(), getFirstCorrectAnswer()

  stores/
    db.ts              # Dexie DB (v3) + seedVocabulary()
    progressStore.ts   # useProgressStore — user progress, lesson completion
    srsStore.ts        # useSrsStore — due cards, add/review cards (with dedup)

  engine/
    srs.ts             # createCard, reviewCard, getDueCards, getCardCount
    reviewRunner.ts    # buildReviewExercises, answerToGrade
    lessonRunner.ts    # findLesson, collectTargetWords, buildLessonResult
    validation.ts      # validateAnswer (accent tolerance, typo tolerance via Levenshtein)

  types/               # All TypeScript interfaces (barrel: index.ts)
    curriculum.ts      # Section, Unit, Lesson, LessonVocab, UnitStatus
    exercise.ts        # ExerciseType, ExerciseSubtype, ExercisePrompt, Exercise
    progress.ts        # UserProgress, SRSCard, ExerciseResult, VocabEntry, LessonResult, LessonScore, ReviewSession, ReviewResult

  data/
    curriculum.ts      # Course structure with LessonMeta (10 sections, 38 units)
    lessonLoader.ts    # Lazy lesson loader using import.meta.glob
    units/unit-01/     # Per-lesson JSON files (unit-01-lesson-01.json, etc.)
```

## Key Conventions
- **Path alias:** `@/` maps to `frontend/src/` (vite + tsconfig)
- **IDs:** `section-01`, `unit-01`, `unit-01-lesson-01`, `unit-01-lesson-01-ex-01`
- **Stores:** `use` prefix, async actions, auto-persist to Dexie
- **Hydration:** Centralized in `HydrationGuard` — all stores hydrated before any route renders
- **Types:** PascalCase, all in `types/` with barrel export from `types/index.ts`
- **Components:** Functional + hooks, PascalCase filenames
- **Feature structure:** `features/<name>/` contains page, components, and hooks for each feature
- **Shared code:** `shared/components/` and `shared/utils/` for cross-feature utilities

## Data Flow
User Input → React Component → Zustand Store Action → Dexie (IndexedDB)
Curriculum structure is static/bundled. Lesson content is lazy-loaded via `import.meta.glob` (separate chunks). User progress & SRS state are in IndexedDB.

### Vocabulary Architecture (Anki-style Note/Card separation)
- **Content (Notes):** `vocabulary` arrays in lesson JSON → seeded to IndexedDB `vocabulary` table on app init via `seedVocabulary()`
- **Scheduling (Cards):** `srsCards` table holds FSRS state, references vocabulary by `word_id`
- **Review:** `reviewRunner.ts` queries vocabulary DB to build exercises from due SRS cards at review time
- Each vocab entry: `{ word, meaning, example, unit_id }` — single source of truth for word content
- Lessons use hand-authored exercises; reviews auto-generate from vocabulary data

## Database Schema (Dexie v3)
- `srsCards`: `++id, [word_id+skill_type], due` — FSRS card state
- `progress`: `++id` — singleton (id=1), user progress
- `vocabulary`: `&id, unit_id` — seeded from lesson JSON vocabulary arrays

## Exercise Types
| ExerciseType | Subtypes |
|---|---|
| vocab | multiple_choice, type_answer, match_pairs |
| writing | arrange_words, fill_blank, cloze, type_answer |
| speaking | read_aloud, listen_and_repeat, respond_to_prompt, minimal_pair |
| listening | listen_and_choose, dictation, listen_and_respond, minimal_pair |

## Current State (Phase 1 MVP — complete)
- Unit 1 has content (5 lessons, ~20 exercises, 27 vocabulary entries)
- Units 2-38 are skeleton (no lessons/exercises)
- SRS engine, stores, and review screen are complete
- Path screen, lesson screen, and review screen are functional
- Review generates exercises from vocabulary DB (MultipleChoice IT→EN, TypeAnswer EN→IT)
- FSRS grading: incorrect→Again(1), correct+fast(<5s)→Easy(4), correct→Good(3)
- No tests, no backend, no audio/speech yet
