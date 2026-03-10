# Issue Roadmap

---

## Phase 1 — MVP: One Playable Unit

### - [ ] Project scaffold

#### Branch
`setup/project-scaffold`

#### Goal
Set up Vite + React + TypeScript + Tailwind project in `frontend/` with all dependencies installed and basic routing working.

#### Files
- `frontend/package.json` (new) — project config with all dependencies
- `frontend/vite.config.ts` (new) — Vite config
- `frontend/tsconfig.json` (new) — TypeScript config
- `frontend/tailwind.config.js` (new) — Tailwind config
- `frontend/src/main.tsx` (new) — app entry point with React Router
- `frontend/src/App.tsx` (new) — root component with route definitions
- `frontend/index.html` (new) — HTML entry

#### Tasks
1. [ ] Initialize Vite project with React + TypeScript template in `frontend/`
2. [ ] Install and configure Tailwind CSS
3. [ ] Install React Router and set up 3 routes: `/` (path), `/lesson/:id` (lesson), `/review` (review)
4. [ ] Install Zustand for state management
5. [ ] Install Dexie.js for IndexedDB persistence
6. [ ] Install ts-fsrs for spaced repetition
7. [ ] Create placeholder pages for each route (just a title, enough to verify routing works)
8. [ ] Verify `npm run dev` starts and all routes render

#### Acceptance Criteria
- [ ] `npm run dev` starts without errors
- [ ] Navigating to `/`, `/lesson/1`, `/review` renders correct placeholder pages
- [ ] Tailwind classes work (verify with a styled element)
- [ ] All dependencies importable (Zustand, Dexie, ts-fsrs, React Router)
- [ ] `npm run build` succeeds

#### Constraints
- No application logic — just scaffolding
- All code in `frontend/` directory

---

### - [ ] TypeScript types and data model

#### Branch
`feature/types-and-data-model`

#### Goal
Define the full TypeScript type system for curriculum, exercises, user progress, and SRS cards. This is the contract everything else builds on — even types for exercise subtypes not yet implemented, so the schema doesn't change later.

#### Files
- `frontend/src/types/curriculum.ts` (new) — Curriculum, Section, Unit, Lesson types
- `frontend/src/types/exercise.ts` (new) — Exercise type with all subtypes and prompt/answer shapes
- `frontend/src/types/progress.ts` (new) — UserProgress, SRSCard, ReviewEntry, ExerciseResult types
- `frontend/src/types/index.ts` (new) — re-exports

#### Tasks
1. [ ] Define `Section` type: id, name, description, order, cefr_level (A1/A2/B1/B2), units[]
2. [ ] Define `Unit` type: id, section_id, name, grammar_focus, vocabulary_targets[], grammar_notes, lessons[], order
3. [ ] Define `Lesson` type: id, unit_id, name, exercises[], grammar_tips[], order
4. [ ] Define `ExerciseType` enum: vocab, writing, speaking, listening
5. [ ] Define `ExerciseSubtype` enum: multiple_choice, type_answer, arrange_words, fill_blank, cloze, dictation, read_aloud, listen_and_choose, minimal_pair, match_pairs, free_form, reading_comprehension
6. [ ] Define `Exercise` type: id, type, subtype, prompt (text/audio), sentence_context, correct_answer (string | string[]), distractors[], hints[], target_words[]
7. [ ] Define `ExerciseResult` type: exercise_id, correct (boolean), user_answer, time_spent_ms
8. [ ] Define `UserProgress` type: current_section, current_unit, current_lesson, xp, streak, level, lessons_completed (Set), checkpoints_passed (Set)
9. [ ] Define `SRSCard` type: id, word_id, skill_type, fsrs_state (stability, difficulty, due, last_review), review_log[]
10. [ ] Define `ReviewEntry` type: date, rating, response_time_ms
11. [ ] Create `index.ts` re-exporting everything

#### Acceptance Criteria
- [ ] All types compile without errors
- [ ] Types cover the full data model from README (curriculum, exercises, progress, SRS)
- [ ] Exercise subtypes include future types (dictation, read_aloud, etc.) even though components don't exist yet
- [ ] Types are importable from `@/types`

#### Constraints
- Types only — no runtime code, no components
- Depends on scaffold being done (needs tsconfig)

---

### - [ ] FSRS engine + Dexie persistence layer

#### Branch
`feature/srs-engine-and-persistence`

#### Goal
Create the SRS engine (wrapping ts-fsrs) and the IndexedDB persistence layer (Dexie + Zustand store). After this, the app can create SRS cards, schedule reviews, and persist all state across browser sessions.

#### Files
- `frontend/src/engine/srs.ts` (new) — wrapper around ts-fsrs: createCard, reviewCard, getDueCards
- `frontend/src/stores/db.ts` (new) — Dexie database schema (tables: srsCards, progress, lessons_completed)
- `frontend/src/stores/progressStore.ts` (new) — Zustand store backed by Dexie for user progress
- `frontend/src/stores/srsStore.ts` (new) — Zustand store backed by Dexie for SRS card state

#### Tasks
1. [ ] Create Dexie database class with tables: `srsCards` (indexed on word_id + skill_type, due), `progress` (singleton row), `lessonsCompleted` (lesson_id set)
2. [ ] Create `srs.ts` wrapper:
   - `createCard(wordId: string, skillType: string): SRSCard` — creates a new FSRS card with default parameters
   - `reviewCard(card: SRSCard, rating: Rating): SRSCard` — runs FSRS scheduling, returns updated card
   - `getDueCards(): Promise<SRSCard[]>` — queries Dexie for cards where due <= now
   - `getCardCount(): Promise<{ due: number, total: number }>` — for UI display
3. [ ] Create `progressStore.ts`:
   - State: current_section, current_unit, lessons_completed, checkpoints_passed
   - Actions: completeLesson(lessonId), unlockUnit(unitId), passCheckpoint(sectionId)
   - Auto-persist to Dexie on every state change
   - Hydrate from Dexie on app startup
4. [ ] Create `srsStore.ts`:
   - Actions: addCards(cards[]), reviewCard(cardId, rating), getDueCards()
   - Auto-persist to Dexie
5. [ ] Verify persistence: create a card, refresh the page, card still exists

#### Acceptance Criteria
- [ ] SRS cards can be created, reviewed, and rescheduled via ts-fsrs
- [ ] getDueCards returns only cards where due date has passed
- [ ] All state persists across browser refresh (IndexedDB via Dexie)
- [ ] Zustand stores hydrate from Dexie on startup
- [ ] FSRS target retention is 90% (configurable)

#### Constraints
- No UI — this is pure engine/store layer
- Depends on types being defined
- Reference: ts-fsrs docs at https://github.com/open-spaced-repetition/ts-fsrs

---

### - [ ] Unit 1 curriculum content: Greetings & Pronunciation

#### Branch
`content/unit-01-greetings`

#### Goal
Generate real Italian curriculum content for Unit 1 (Alphabet, Pronunciation & Greetings). 5 lessons, ~60 exercises total, using only the 3 MVP exercise subtypes (multiple_choice, type_answer, arrange_words). All vocabulary taught in sentence context.

#### Files
- `frontend/src/data/curriculum.ts` (new) — full section/unit/lesson tree (units beyond Unit 1 are stubs with names only)
- `frontend/src/data/units/unit-01.json` (new) — complete Unit 1: 5 lessons, all exercises

#### Tasks
1. [ ] Create `curriculum.ts` with the full 10-section, 38-unit tree structure from README (only names, IDs, CEFR levels — no exercises for units 2-38)
2. [ ] Create Unit 1, Lesson 1: Hello & Goodbye (~10 exercises)
   - Vocab: ciao, buongiorno, buonasera, buonanotte, arrivederci, salve
   - Every word introduced with an example sentence (e.g., "Ciao, come stai?" not just "ciao")
   - Mix: ~4 multiple choice, ~4 type answer, ~2 arrange words
3. [ ] Create Unit 1, Lesson 2: Polite Phrases (~10 exercises)
   - Vocab: grazie, prego, per favore, scusi, scusa, mi dispiace, permesso
4. [ ] Create Unit 1, Lesson 3: How Are You? (~12 exercises)
   - Vocab: come stai, come sta (formal), sto bene, bene grazie, così così, non c'è male, e tu, e Lei
5. [ ] Create Unit 1, Lesson 4: Basic Responses (~10 exercises)
   - Vocab: sì, no, va bene, d'accordo, non capisco, può ripetere, come si dice
6. [ ] Create Unit 1, Lesson 5: Review & Mix (~15 exercises)
   - Interleaved review of all Lesson 1-4 vocabulary in new sentence contexts
   - Heavier on type_answer (production) than earlier lessons
7. [ ] Add grammar_tips to lessons where relevant (e.g., "Italian has formal (Lei) and informal (tu) 'you'")
8. [ ] Verify all exercises have: sentence_context, correct_answer, target_words, and reasonable distractors for multiple choice

#### Acceptance Criteria
- [ ] 5 lessons with ~60 total exercises
- [ ] Every vocabulary word appears in at least one sentence context
- [ ] Exercise mix: ~40% multiple choice, ~40% type answer, ~20% arrange words
- [ ] Distractors are plausible (real Italian words, not gibberish)
- [ ] Grammar tips present for formal/informal distinction, pronunciation notes
- [ ] JSON is valid and matches the TypeScript types from the types issue
- [ ] All Italian is correct and natural-sounding

#### Constraints
- Only 3 exercise subtypes: multiple_choice, type_answer, arrange_words
- No audio flags (no listening/speaking exercises yet)
- English used freely for all explanations and translations (A1 level)
- Depends on types being defined

---

### - [ ] Exercise components: MultipleChoice, TypeAnswer, ArrangeWords

#### Branch
`feature/exercise-components`

#### Goal
Build the 3 MVP exercise components. Each receives an Exercise and an onComplete callback, renders the exercise UI, handles user interaction, and reports the result.

#### Files
- `frontend/src/components/exercises/MultipleChoice.tsx` (new)
- `frontend/src/components/exercises/TypeAnswer.tsx` (new)
- `frontend/src/components/exercises/ArrangeWords.tsx` (new)
- `frontend/src/components/exercises/ExerciseShell.tsx` (new) — shared wrapper (sentence context display, submit button, feedback overlay)
- `frontend/src/components/exercises/Feedback.tsx` (new) — correct/incorrect feedback display

#### Tasks
1. [ ] Create `ExerciseShell.tsx` — shared layout for all exercises:
   - Shows sentence context at top (if present)
   - Renders children (the specific exercise UI)
   - Shows submit/check button
   - After submission: shows `Feedback` component (correct/incorrect + correct answer)
   - Calls `onComplete(result: ExerciseResult)` after user dismisses feedback
2. [ ] Create `Feedback.tsx`:
   - Correct: green background, checkmark, "Correct!" text
   - Incorrect: red background, X mark, shows correct answer, brief explanation if available
   - "Continue" button to proceed
3. [ ] Create `MultipleChoice.tsx`:
   - Display prompt text (English or Italian depending on exercise direction)
   - 4 option buttons
   - Tap to select, tap "Check" to submit (or auto-submit on tap — decide which feels better)
   - Supports IT→EN and EN→IT via exercise prompt/answer fields
4. [ ] Create `TypeAnswer.tsx`:
   - Display prompt text
   - Text input field for user's answer
   - Submit on Enter or button tap
   - Case-insensitive comparison (exact match for MVP, fuzzy matching comes in Phase 2)
5. [ ] Create `ArrangeWords.tsx`:
   - Display English sentence as prompt
   - Italian words as tappable chips in shuffled order
   - Tap to add to answer area, tap in answer area to remove
   - Submit when all words placed (or manually via button)
   - Compare arranged order to correct_answer

#### Acceptance Criteria
- [ ] All 3 exercise types render correctly with sample data
- [ ] Correct/incorrect feedback shown after every answer
- [ ] ExerciseResult returned via onComplete with: exercise_id, correct, user_answer, time_spent_ms
- [ ] Keyboard accessible (Tab to navigate, Enter to submit)
- [ ] Styled with Tailwind — clean, readable, mobile-friendly
- [ ] No external state dependencies — components are pure (receive Exercise, emit ExerciseResult)

#### Constraints
- No audio (Phase 3)
- No fuzzy matching (Phase 2) — exact string comparison for TypeAnswer, case-insensitive
- Depends on types being defined

---

### - [ ] Lesson screen

#### Branch
`feature/lesson-screen`

#### Goal
Build the lesson page that sequences through exercises, shows progress, handles feedback, and on completion saves progress and creates SRS cards for encountered vocabulary.

#### Files
- `frontend/src/pages/Lesson.tsx` (new) — main lesson page
- `frontend/src/engine/lessonRunner.ts` (new) — logic for sequencing exercises, scoring, creating SRS cards

#### Tasks
1. [ ] Create `lessonRunner.ts`:
   - Takes a Lesson (with exercises[]) and returns exercise-by-exercise
   - Tracks score (correct/total), time per exercise
   - On lesson complete: returns LessonResult (score, time, words_encountered[])
2. [ ] Create `Lesson.tsx` page:
   - Load lesson data by ID from curriculum
   - Show progress bar at top (exercise 3/12)
   - Render current exercise using the appropriate component (MultipleChoice, TypeAnswer, or ArrangeWords based on exercise.subtype)
   - On exercise complete: advance to next exercise
   - On lesson complete: show summary screen (X/Y correct, time taken)
3. [ ] On lesson complete — persist:
   - Mark lesson as completed in progressStore
   - Create SRS cards for all target_words encountered (one card per word per skill type: vocab-recognition and vocab-production)
   - If lesson already completed before, don't create duplicate cards
4. [ ] Add "Exit lesson" button (with confirmation if in progress)
5. [ ] Handle edge case: lesson with 0 exercises (show error)

#### Acceptance Criteria
- [ ] Exercises render sequentially with correct component per subtype
- [ ] Progress bar advances after each exercise
- [ ] Feedback shown between exercises (correct/incorrect + correct answer)
- [ ] Lesson completion screen shows score summary
- [ ] Progress and SRS cards persisted to IndexedDB after completion
- [ ] Navigates back to path screen after completion
- [ ] Page works when navigated to directly via URL (`/lesson/unit1-lesson1`)

#### Constraints
- Depends on: exercise components, SRS engine + persistence, curriculum content
- No XP or gamification (Phase 5)
- No grammar tip cards (Phase 2)

---

### - [ ] Path screen

#### Branch
`feature/path-screen`

#### Goal
Build the main navigation screen showing Section 1's units as a vertical list with lock/unlock state. This is the app's home page.

#### Files
- `frontend/src/pages/Path.tsx` (new) — path/home page
- `frontend/src/components/UnitCard.tsx` (new) — individual unit display with status
- `frontend/src/components/LessonList.tsx` (new) — expandable lesson list within a unit

#### Tasks
1. [ ] Create `UnitCard.tsx`:
   - Shows unit name and status icon (locked/available/in-progress/completed)
   - Locked: grayed out, lock icon, not clickable
   - Available: highlighted, ready to start
   - In-progress: shows which lesson you're on (e.g., "Lesson 3/5")
   - Completed: checkmark, full color
2. [ ] Create `LessonList.tsx`:
   - Shown when a unit is tapped/expanded
   - Lists lessons within the unit
   - Each lesson shows: name, completed checkmark or "Start" button
   - Tap a lesson to navigate to `/lesson/:id`
3. [ ] Create `Path.tsx`:
   - Load curriculum tree and user progress from stores
   - Display Section 1 units as vertical list of UnitCards
   - Unit 1 unlocked by default
   - Subsequent units unlock when all lessons in previous unit are completed
   - Show section header: "Section 1: First Steps — A1"
   - Show review button with due card count if > 0 (links to `/review`)
4. [ ] Derive unit status from progress store (which lessons are completed)

#### Acceptance Criteria
- [ ] Unit 1 is available, other units show as locked
- [ ] Completing all lessons in Unit 1 unlocks Unit 2 (once content exists)
- [ ] Tapping a unit shows its lessons
- [ ] Tapping a lesson navigates to the lesson screen
- [ ] Review button shows due card count
- [ ] Styled with Tailwind — clean vertical layout, clear status indicators
- [ ] Page loads progress from IndexedDB (survives refresh)

#### Constraints
- Only Section 1 units shown for MVP (other sections exist in curriculum tree but hidden or grayed)
- Simple vertical list, not fancy winding path (that's Phase 6)
- Depends on: curriculum content, persistence layer

---

### - [ ] Review screen

#### Branch
`feature/review-screen`

#### Goal
Build the SRS review screen that presents due cards as exercises and updates their FSRS schedule based on the user's response.

#### Files
- `frontend/src/pages/Review.tsx` (new) — review session page
- `frontend/src/engine/reviewRunner.ts` (new) — logic for pulling due cards, converting to exercises, handling FSRS rating

#### Tasks
1. [ ] Create `reviewRunner.ts`:
   - Pull due cards from srsStore
   - Convert each SRS card to an Exercise:
     - vocab-recognition card → MultipleChoice (IT→EN)
     - vocab-production card → TypeAnswer (EN→IT)
   - Generate distractors for multiple choice from other known words
   - After user answers: map correct/incorrect to FSRS rating (Again/Hard/Good/Easy)
   - Update card via srsStore.reviewCard()
2. [ ] Create `Review.tsx` page:
   - Show "X cards due for review" at start
   - If 0 cards due: show "All caught up! No reviews right now." with link back to path
   - Sequence through due cards as exercises (reuse exercise components)
   - Show progress: "Review 3/17"
   - After each answer: update FSRS schedule immediately
   - On session complete: show summary (X/Y correct, cards reviewed)
3. [ ] FSRS rating mapping:
   - Correct + fast (< 5s): Easy (rating 4)
   - Correct: Good (rating 3)
   - Incorrect: Again (rating 1)
4. [ ] Navigate back to path screen after review complete

#### Acceptance Criteria
- [ ] Due cards appear as exercises (multiple choice or type answer)
- [ ] FSRS schedule updated after each answer
- [ ] Cards that were answered incorrectly get shorter next interval
- [ ] Cards that were answered correctly get longer next interval
- [ ] "All caught up" state when no cards are due
- [ ] Review count shown during session
- [ ] Review results persisted to IndexedDB

#### Constraints
- Only vocab-recognition (MultipleChoice) and vocab-production (TypeAnswer) for now
- Distractors generated from words the user has already encountered (pulled from existing SRS cards)
- Depends on: exercise components, SRS engine, curriculum content (need words to review)
