# Phase 1 — MVP: One Playable Unit

**Goal:** Get a single unit (Unit 1: Alphabet, Pronunciation & Greetings) fully playable end-to-end with real Italian content, SRS tracking, and persistent progress. After this phase you can open the app and actually learn Italian.

## What This Delivers

- Project scaffolded and running
- TypeScript types locked down for the entire curriculum/exercise/progress data model
- FSRS integrated from day one — the core differentiator vs Duolingo
- 3 exercise types that cover both recognition and production
- Real Unit 1 content: ~15-20 vocabulary items (ciao, buongiorno, come stai, grazie, per favore, arrivederci, buonasera, prego, scusi...) with sentence contexts
- Progress persists across browser sessions

## Learning Principles Addressed

- **Sentence-based learning**: all exercises use full sentences, not isolated words. Even multiple choice shows the target word in a sentence context.
- **Active recall**: "type the answer" forces production, not just recognition. This is weighted as the primary exercise type.
- **FSRS from day one**: every word encountered creates an SRS card. When a lesson is completed, those cards enter the review queue with FSRS scheduling (target 90% retention).
- **Immediate feedback**: correct/incorrect shown instantly after each answer, with the correct answer displayed on errors.

## Technical Deliverables

### 1. Project Scaffold
- Vite + React + TypeScript project in `frontend/`
- Tailwind CSS configured
- React Router with 3 routes: `/path`, `/lesson/:id`, `/review`
- Zustand for state management
- Dexie.js for IndexedDB persistence
- ts-fsrs installed

### 2. TypeScript Types (`src/types/`)
Define the full data model upfront — this is the contract everything else builds on:
- `Curriculum`, `Section`, `Unit`, `Lesson` types
- `Exercise` type with all subtypes (even ones not built yet)
- `UserProgress`, `SRSCard`, `ReviewEntry` types
- `ExerciseResult` type (what an exercise component returns)

### 3. Curriculum Data (`src/data/`)
- `curriculum.ts` — the full section/unit/lesson tree structure (units beyond Unit 1 are stubs)
- `unit-01.json` — complete Unit 1 content: ~5 lessons, ~10-15 exercises each
  - Vocabulary: basic greetings, courtesy phrases, pronunciation notes
  - Each vocab item has: Italian word, English translation, example sentence, pronunciation hint
  - Exercise mix: ~40% multiple choice, ~40% type answer, ~20% arrange words

### 4. Exercise Components (`src/components/exercises/`)
- `MultipleChoice.tsx` — show prompt + 4 options, one correct. Used for both IT→EN and EN→IT.
- `TypeAnswer.tsx` — show prompt (English sentence or Italian with gap), user types Italian. Basic string matching (exact, case-insensitive).
- `ArrangeWords.tsx` — show English sentence, provide Italian words as draggable/clickable chips, user arranges into correct order.
- Each component receives an `Exercise` and calls `onComplete(result: ExerciseResult)`.

### 5. Lesson Screen (`src/pages/Lesson.tsx`)
- Takes a lesson ID, loads exercises from curriculum data
- Sequences through exercises one at a time
- Progress bar at top
- On correct: brief green flash, move to next
- On incorrect: show correct answer, brief explanation, then move on
- On lesson complete: summary screen (X/Y correct), save progress, create/update SRS cards

### 6. Path Screen (`src/pages/Path.tsx`)
- Simple vertical list of units in Section 1
- Each unit shows: name, status (locked / available / in-progress / completed)
- Unit 1 is unlocked by default, others locked
- Tap a unit to see its lessons, tap a lesson to start it

### 7. Review Screen (`src/pages/Review.tsx`)
- Queries Dexie for SRS cards where `due <= now`
- Presents them as exercises (multiple choice or type answer, based on skill type)
- After each answer, rates the card via ts-fsrs and updates the schedule
- Shows count of remaining reviews

### 8. SRS Engine (`src/engine/srs.ts`)
- Wrapper around ts-fsrs: `createCard()`, `reviewCard(card, rating)`, `getDueCards()`
- Each word gets one card per skill type encountered (vocab-recognition, vocab-production for now)
- Cards are created when a word is first encountered in a lesson

### 9. Persistence (`src/stores/`)
- Zustand store backed by Dexie.js
- Tables: `progress` (current position, lessons completed), `srsCards` (all FSRS card state)
- Auto-saves on every exercise completion and review

## Content Spec for Unit 1

Unit 1: Alphabet, Pronunciation & Greetings — 5 lessons:

**Lesson 1: Hello & Goodbye** (~10 exercises)
- ciao, buongiorno, buonasera, buonanotte, arrivederci

**Lesson 2: Polite Phrases** (~10 exercises)
- grazie, prego, per favore, scusi/scusa, mi dispiace

**Lesson 3: How Are You?** (~12 exercises)
- come stai?, sto bene, così così, non c'è male, e tu?

**Lesson 4: Basic Responses** (~10 exercises)
- sì, no, va bene, d'accordo, non capisco, può ripetere?

**Lesson 5: Review & Mix** (~15 exercises)
- Interleaved review of all Lesson 1-4 vocabulary in new sentence contexts

## Not In This Phase

- Audio/TTS (no listening or speaking exercises)
- Gamification (no XP, streaks, levels)
- Grammar tip cards
- Checkpoints
- Units beyond Unit 1
- Fancy path visualization
- Typo tolerance / fuzzy matching (exact match only for MVP)
