# Refactor Proposal: Codebase Restructure

~2,100 LOC across 25 files. This covers **structural reorganization**, **code quality issues**, **dead code**, and **duplication**.

---

## Part 1: Feature-Based File Structure

### Current (flat layer-based)
```
pages/          ← 3 files, some 400 lines with inline components
components/     ← 2 loose + 5 in exercises/
stores/         ← 3 files (clean)
engine/         ← 4 files (clean)
types/          ← 4 files (clean)
data/           ← curriculum + unit JSON
hooks/          ← empty
```

### Proposed
```
frontend/src/
├── App.tsx
├── main.tsx
│
├── features/
│   ├── lesson/
│   │   ├── LessonPage.tsx           ← slim orchestrator (~80 lines)
│   │   ├── CompletionScreen.tsx     ← extracted from Lesson.tsx
│   │   ├── ExitButton.tsx           ← extracted from Lesson.tsx
│   │   ├── LessonHeader.tsx         ← progress bar + exit button combo
│   │   └── useLessonState.ts        ← all state + handlers
│   │
│   ├── review/
│   │   ├── ReviewPage.tsx           ← slim orchestrator
│   │   ├── ReviewIntro.tsx          ← "N cards due" + "all caught up" screens
│   │   ├── ReviewSummary.tsx        ← completion summary
│   │   └── useReviewSession.ts      ← session state + handlers
│   │
│   ├── path/
│   │   ├── PathPage.tsx
│   │   ├── UnitCard.tsx             ← moved from components/
│   │   ├── LessonList.tsx           ← moved from components/
│   │   └── StatusIcon.tsx           ← extracted from UnitCard.tsx
│   │
│   └── exercises/
│       ├── ExerciseShell.tsx        ← shared wrapper
│       ├── Feedback.tsx
│       ├── MultipleChoice.tsx
│       ├── TypeAnswer.tsx
│       ├── ArrangeWords.tsx
│       └── renderExercise.tsx       ← shared dispatcher (deduplicated)
│
├── shared/
│   ├── components/
│   │   ├── ProgressBar.tsx          ← extracted (duplicated in Lesson + Review)
│   │   ├── EmptyState.tsx           ← shared empty/error screen pattern
│   │   └── LoadingScreen.tsx        ← shared loading state
│   └── utils/
│       ├── shuffle.ts               ← deduplicated from 3 files
│       └── exercise.ts              ← correctAnswer normalization helper
│
├── stores/                          ← stays as-is
│   ├── db.ts
│   ├── progressStore.ts
│   └── srsStore.ts
│
├── engine/                          ← minor cleanup (see Part 3)
│   ├── srs.ts
│   ├── reviewRunner.ts
│   ├── lessonRunner.ts
│   └── validation.ts
│
├── types/                           ← absorb stray type defs (see Part 3)
│   ├── index.ts
│   ├── curriculum.ts
│   ├── exercise.ts
│   └── progress.ts
│
└── data/
    ├── curriculum.ts
    └── units/unit-01.json
```

Delete: `pages/`, `components/`, `hooks/` (empty).

---

## Part 2: Break Up Large Files

### Lesson.tsx (380 lines → 5 files)

Currently one file with 3 components, 7 state variables, and async DB calls mixed into the page.

| New File | Extracted From | Responsibility |
|---|---|---|
| `LessonPage.tsx` (~80 lines) | Lesson() lines 16–235 | Orchestrator: loads lesson, renders header + exercise or completion |
| `useLessonState.ts` (~100 lines) | handleExerciseComplete, handleLessonComplete, handlePracticeMistakes, retry logic, SRS card creation | All state management + side effects |
| `CompletionScreen.tsx` (~60 lines) | CompletionScreen() lines 238–299 | Score display, practice mistakes button, continue |
| `ExitButton.tsx` (~80 lines) | ExitButton() lines 301–380 | X button with confirmation popover |
| `LessonHeader.tsx` (~25 lines) | JSX lines 197–217 | Sticky header: exit button + progress bar + counter |

### Review.tsx (221 lines → 4 files)

Same problem: multiple screens (intro, active session, completion) + state logic in one file.

| New File | Extracted From | Responsibility |
|---|---|---|
| `ReviewPage.tsx` (~60 lines) | Review() outer shell | Orchestrator: loading → intro → session → summary |
| `useReviewSession.ts` (~80 lines) | handleStart, handleExerciseComplete, grading, session state | All state + SRS interactions |
| `ReviewIntro.tsx` (~40 lines) | "N cards due" (lines 100–119) + "all caught up" (lines 77–98) | Pre-session screens |
| `ReviewSummary.tsx` (~30 lines) | Result screen (lines 123–150) | Post-session summary |

---

## Part 3: Code Quality Issues

### 3a. Duplicated code (copy-pasted)

| What | Locations | Fix |
|---|---|---|
| `shuffle<T>()` — identical Fisher-Yates | `MultipleChoice.tsx:10-17`, `ArrangeWords.tsx:10-17`, `reviewRunner.ts:4-11` | → `shared/utils/shuffle.ts` |
| `renderExercise()` — switch on subtype | `Lesson.tsx:171-192`, `Review.tsx:203-221` | → `features/exercises/renderExercise.tsx` |
| `correctAnswer` normalization — `Array.isArray(ex.correct_answer) ? ex.correct_answer[0] : ex.correct_answer` | `MultipleChoice.tsx:25-27`, `TypeAnswer.tsx:17-19`, `ArrangeWords.tsx:23-25`, `ExerciseShell.tsx:32-34` | → `shared/utils/exercise.ts` helper |
| Progress bar header — sticky bar with X button + progress + counter | `Lesson.tsx:197-217`, `Review.tsx:158-192` | → `shared/components/ProgressBar.tsx` |
| Loading screen — `min-h-screen bg-gray-50 flex items-center justify-center` | `Path.tsx:55-60`, `Review.tsx:68-73` | → `shared/components/LoadingScreen.tsx` |
| Error/empty state — centered card with title + subtitle + back button | `Lesson.tsx:46-64` (not found), `Lesson.tsx:66-85` (no exercises), `Review.tsx:77-98` (all caught up) | → `shared/components/EmptyState.tsx` |
| Blue primary button — `w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-medium...` | `Lesson.tsx:290`, `Review.tsx:91, 112, 142` | Consider a `<Button>` component or shared Tailwind class |
| Inline SVG close icon (X) — identical 6-line SVG | `ExitButton` (twice), `Review.tsx:166-178` | Extract a `<CloseIcon>` or use an icon util |

### 3b. Stray types defined outside `types/`

Types should live in `types/`, not scattered across components and engine files.

| Type | Current Location | Move To |
|---|---|---|
| `UnitStatus` | `UnitCard.tsx:4` (exported as type from a component) | `types/curriculum.ts` |
| `LessonResult` | `lessonRunner.ts:6-12` | `types/progress.ts` |
| `ReviewSession` | `Review.tsx:10-13` (inline interface) | `types/progress.ts` |
| `ReviewResult` | `Review.tsx:15-18` (inline interface) | `types/progress.ts` |

### 3c. Layer violation — direct DB access from a page component

`Lesson.tsx:137-143` directly queries `db.srsCards` to check for existing cards before calling `addCards()`. This bypasses the store layer:

```ts
// Lesson.tsx — page component directly using Dexie
const existing = await db.srsCards
  .where('[word_id+skill_type]')
  .equals([word, skillType])
  .first();
```

**Fix:** Move this "create cards if not exists" logic into `srsStore.addCards()` or into `engine/lessonRunner.ts`. The page should just call `addCards(words)` and not know about Dexie.

### 3d. Dead code

| What | Location | Action |
|---|---|---|
| `checkAnswer()` function | `lessonRunner.ts:27-31` | Exported but never imported anywhere. Delete. |
| `lessonsCompleted` Dexie table | `db.ts:8, 15, 21` | Defined in schema but never written to or queried. All lesson completion tracking uses the `lessons_completed` array in the `progress` singleton instead. Delete the table definition (requires a DB version bump). |
| `hooks/` directory | `frontend/src/hooks/` | Empty directory. Delete. |

### 3e. Inconsistent hydration pattern

Each page handles store hydration differently:

| Page | Pattern |
|---|---|
| `Path.tsx` | Hydrates both `progressStore` + `srsStore` in `useEffect` |
| `Review.tsx` | Hydrates `srsStore` in `useEffect`, doesn't touch `progressStore` |
| `Lesson.tsx` | No hydration at all — assumes already hydrated from Path |

If a user deep-links to `/lesson/unit-01-lesson-01` or `/review`, the stores won't be hydrated.

**Fix:** Either:
- Create a `useHydration()` hook that hydrates all stores once, used in `App.tsx`
- Or add a `<HydrationGuard>` wrapper component in `App.tsx` that blocks rendering until stores are ready

### 3f. Inline SVGs scattered everywhere

Raw SVG markup appears in at least 8 places across 5 files. Each is 5-8 lines of JSX for simple icons (close, chevron, lock, play, check, clock, refresh).

**Fix:** Create a small `shared/components/Icon.tsx` with named icon components, or at minimum extract the repeated close-X and chevron SVGs that appear in 3+ places.

---

## Part 4: Migration Order

Each step should result in a building, working app. One commit per step.

1. **Dead code cleanup** — Delete `checkAnswer()`, remove `lessonsCompleted` table (DB version bump), delete `hooks/`
2. **Extract shared utils** — `shuffle.ts`, `correctAnswer` normalization helper
3. **Extract shared components** — `LoadingScreen`, `EmptyState`, `ProgressBar`, icon components
4. **Extract `renderExercise.tsx`** — shared exercise dispatcher
5. **Restructure `features/exercises/`** — move exercise components from `components/exercises/`
6. **Restructure `features/path/`** — move UnitCard, LessonList, Path; extract StatusIcon
7. **Break up `Lesson.tsx`** — extract `useLessonState`, `CompletionScreen`, `ExitButton`, `LessonHeader`; fix DB access layer violation
8. **Break up `Review.tsx`** — extract `useReviewSession`, `ReviewIntro`, `ReviewSummary`
9. **Move stray types** — `UnitStatus`, `LessonResult`, `ReviewSession`, `ReviewResult` into `types/`
10. **Fix hydration** — centralize in `App.tsx` or create `useHydration` hook
11. **Update `App.tsx` router imports** — point to `features/*/`
12. **Delete empty directories** — `pages/`, `components/`
13. **Verify** — `npm run build` + `npm run lint` + manual smoke test (path → lesson → review)

---

## Summary

| Metric | Before | After |
|---|---|---|
| Largest file | 380 lines (Lesson.tsx) | ~100 lines |
| `shuffle()` copies | 3 | 1 |
| `correctAnswer` normalization copies | 4 | 1 |
| `renderExercise` copies | 2 | 1 |
| Inline components | 3 (CompletionScreen, ExitButton, StatusIcon) | 0 |
| Dead code | `checkAnswer()`, `lessonsCompleted` table, empty `hooks/` | 0 |
| Stray type definitions | 4 types outside `types/` | 0 |
| Direct DB access from pages | 1 (Lesson.tsx → db.srsCards) | 0 |
| Hydration bugs (deep-link broken) | 2 pages | 0 |
| Feature isolation | None | Full |
| Total files | 25 | ~35 |
| Total lines | ~2,100 | ~2,100 (reorganized, minus dead code) |
