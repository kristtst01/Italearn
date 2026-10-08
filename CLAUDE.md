# ItaLearn - AI Agent Guide

Italian learning app for serious learners, A1 → B2 (current scope: A1). React frontend + FastAPI backend. See [README.md](README.md) for the vision and principles.

## Content philosophy (read before touching curriculum or lessons)
- The curriculum is driven by **coverage of Italian**: each CEFR level has grammar, vocabulary, and can-do functions it must teach. Units and lessons group that content and are as large as the topic needs.
- **No quota numbers.** Don't plan or author to "n lessons per unit", "x exercises per lesson", or "y words per lesson". The one real count is vocabulary per CEFR level (A1 teaches the A1 words, etc.), counted in lemmas, never inflected forms.
- **Grammar decides the order.** Grammar units come first and chapters are built around them; `frontend/src/data/course.ts` is the order a learner meets them in. Explanations live in grammar units, never in lessons.
- **Existing content is never fixed.** Restructure freely. Good content that no longer fits goes to `frontend/src/data/pool/`, not the bin.
- **Grammar is simple, but true:** say when a rule is a tendency, name the exceptions, flag simplifications, and check rules against sources (Treccani, Accademia della Crusca, Profilo della lingua italiana).
- Authoring spec (read it before writing any content): [docs/exercise-generation-guide.md](docs/exercise-generation-guide.md). Grammar inventory: [docs/a1-grammar-inventory.md](docs/a1-grammar-inventory.md). Roadmap, status and decisions: [docs/development-plan.md](docs/development-plan.md). Open work: GitHub issues.

## Working with the maintainer
- **Ask before every git commit and push**, even when running autonomously.
- The maintainer doesn't speak Italian. Correctness rests on sources, the content check and review, so verify Italian against sources and flag anything you're unsure of instead of guessing.
- There is no user data yet: the database schema can be reset freely.
- Writing style, in UI copy, exercises and grammar: plain and direct. No forced "not X, but Y" contrasts, no em-dashes, no developer-facing wording in the app. Translate *voi* as "you (plural)", never "you all".
- Accepted answers: one model answer plus at most an obvious alternative. The AI check judges other variants.

## Tech Stack
- **Frontend:** React 19 + TypeScript (strict) + Vite 7, Tailwind CSS 4 + shadcn/ui, Zustand 5, React Router 7, ts-fsrs. Fonts: Archivo, Archivo Black, Caveat (self-hosted via @fontsource)
- **Backend:** FastAPI + PostgreSQL (async SQLAlchemy, Alembic), Docker Compose
- **Auth:** Clerk (frontend `@clerk/clerk-react`, backend verifies JWTs)
- **AI:** Anthropic API: Claude Haiku for answer validation, Claude Sonnet for feedback on free-form writing (`backend/app/services/llm.py`); Google Cloud Speech-to-Text for read-aloud

## Commands
Frontend (from `frontend/`):
```
npm run dev       # Vite dev server
npm run build     # tsc -b && vite build
npx eslint src/   # lint (use this; `npm run lint` also picks up .vite cache noise)
npm run lint:tokens  # list raw colours that should be design tokens
npm run check:content  # content check: words/grammar taught before use, structure, answers, style, Profilo A1 coverage
                      #   (--all includes chapters under construction, --info shows coverage notes, --missing lists untaught Profilo words)
```
Backend (from `backend/`): `make setup` (first run), `make run`, `make migrate`, `make migration msg="..."`, `make logs`.

## Project Structure
```
frontend/src/
  App.tsx              # Router, Clerk wiring, HydrationGuard
  features/            # One folder per feature: page + components + hooks
    today/             # / — Today: plan built from due reviews + recommended chapter
    library/           # /library (chapter grid, Words tab) and /library/:unitId (Chapter page)
    grammar/           # /grammar, /grammar/:grammarId (the reading), /grammar/:grammarId/practice/:stopId and /check (sessions)
    progress/          # /progress — words known, grammar tiles, stamp book
    lesson/            # /lesson/:id — LessonPage, NewWords ("New in this lesson"), ReadingPanel, useLessonState (retry, completion, SRS card creation)
    review/            # /review — SRS review session
    exercises/         # Exercise components (lesson + review); ui.tsx = shared exercise primitives;
                       #   renderExercise.tsx dispatches by subtype; planned types render PlannedExerciseCard
    words/             # Word bank (shown in the Library's Words tab)
    profile/, auth/    # /profile, Clerk sign-in/up
    dev/               # /dev/exercises gallery (dev build only)
  shared/components/   # design.tsx (Page, PageHeader, Label, Placeholder, Status, tiles, Stamp, Postcard, Correction),
                       #   AppLayout (top bar), SessionLayout/SessionHeader (lessons + review), HydrationGuard, etc.
  shared/utils/        # shuffle, exercise answer helpers, vocab helpers, progress segments
  components/ui/       # shadcn/ui primitives
  stores/              # progressStore, srsStore (Zustand, persisted via the API)
  engine/              # Pure logic + API client
    api.ts             # All backend calls (progress, SRS cards, validate, grade, transcribe)
    chapters.ts        # Chapter status, progress, recommended next, stamp earned
    srs.ts             # ts-fsrs wrapper (90% target retention)
    validation.ts      # Local answer validation: exact → accent-tolerant → typo-tolerant (Levenshtein)
    useLLMValidation.ts# LLM fallback when local validation rejects
    vocabCache.ts      # In-memory vocabulary, seeded from lesson JSON at startup
    reviewRunner.ts    # Builds review exercises from due cards; answerToGrade
    lessonRunner.ts, mastery.ts, streak.ts, curriculumContext.ts
  types/               # All interfaces, barrel export from types/index.ts
  data/
    course.ts          # The course: grammar units and chapters in the order a learner meets them
    curriculum.ts      # A1 sections → units (chapters: can_do, stamp_title, ready) → LessonMeta (with role)
    grammarPlan.ts     # The 16 A1 grammar units in order (title, covers, chapters that use them, ready)
    grammarLoader.ts   # Lazy-loads written units from grammar/
    grammar/           # <id>.md = the reading (Markdown; `> Italian` + `> English` lines are examples);
                       #   <id>.practice.json = practice stops (each placed after a reading heading) + mastery check; exercises tagged with grammar_points
    lessonLoader.ts    # Lazy-loads lesson JSON via import.meta.glob
    units/unit-NN/     # One JSON file per lesson: unit-NN-lesson-NN.json
    pool/              # Good content that no longer fits where it was; reuse before writing new
frontend/scripts/      # check-content.ts (npm run check:content), content-allowlist.json

backend/app/
  main.py              # FastAPI app, router registration
  routers/             # auth (/me), progress (/progress, /srs/*), validate (/validate, /grade-free-response), transcribe, health
  services/            # Business logic: llm.py, speech.py, srs.py, progress.py, verdict_cache.py, auth.py
  models/, schemas/    # SQLAlchemy models, Pydantic schemas
backend/migrations/    # Alembic

tools/authoring/       # Python helpers for writing lesson and grammar JSON in the repo's format (see its README)
docs/reviews/          # AI review reports on content, with what was and wasn't applied
data/italian-frequency-50k.txt  # Italian word frequency list (reference for vocabulary work; not used by code)
```

## Key Conventions
- **Path alias:** `@/` maps to `frontend/src/`
- **IDs:** `section-01`, `unit-01`, `unit-01-lesson-01`, `unit-01-lesson-01-ex-01`
- **Course order:** `data/course.ts` lists grammar units and chapters in the order a learner meets them; the content check uses it. Deliberate early fixed phrases go in `frontend/scripts/content-allowlist.json` with a reason.
- **Adding a lesson:** drop the JSON in `data/units/unit-NN/` (auto-discovered by `import.meta.glob`) and add its `LessonMeta` to the unit in `curriculum.ts`, with a `role`: `words`, `grammar`, `practice`, `reading` (has a `reading` text), `writing` (one free-form text; completing all of a chapter's writing lessons earns its stamp) or `speaking` (read-aloud). Lessons carry no grammar tips; explanations live in grammar units. Good content that no longer fits goes to `data/pool/`, not the bin
- **Stores:** `use` prefix, async actions that persist through `engine/api.ts`
- **Hydration:** Centralized in `HydrationGuard`, which seeds vocabulary and hydrates both stores before any route renders. Pages assume stores are ready.
- **Styling:** colours, fonts and radii come only from the tokens in `src/index.css` (see [docs/design-system.md](docs/design-system.md)). Use token classes (`bg-primary`, `text-learned`, `font-display`), never raw Tailwind colours or hex. `npm run lint:tokens` lists violations.
- **Types:** PascalCase, all in `types/`, barrel export
- **Components:** Functional + hooks, PascalCase filenames. Cross-feature code goes in `shared/`.

## Data Flow
- User input → component → Zustand store action → `engine/api.ts` → FastAPI → PostgreSQL
- Curriculum structure is bundled; lesson content is lazy-loaded per lesson (separate chunks).
- **Vocabulary (Anki-style note/card split):** the `vocabulary` arrays in lesson JSON are the single source of truth for word content (`{ id?, word, meaning, example }`). They're loaded into `vocabCache` at startup. SRS cards (server-side) hold only FSRS state and reference vocabulary by `word_id`. Reviews build exercises from vocab at review time.
- `srsStore.addCards()` deduplicates internally. Use `reviewableCount` (cards with a matching vocab entry) for UI counts, not `dueCards.length`.
- **FSRS grading:** incorrect → Again(1), correct + fast (<5s) → Easy(4), correct → Good(3).

## Answer Validation
1. Local `validateAnswer`: exact → accent-tolerant (correct, with an accent reminder) → typo-tolerant (incorrect, with a hint)
2. If rejected locally, the backend `/validate` asks Claude whether the answer is acceptable. Verdicts are cached in Postgres so repeat answers skip the LLM.
3. `free_form` exercises are graded by `/grade-free-response` against the model answer.

Local validation ignores punctuation and case, treats spelling variants as equal (buongiorno / buon giorno), and allows a typo in one word. Verdicts come from the cache, so clear `verdict_cache` after changing the prompt in `llm.py`.

## Exercise Subtypes
Implemented: `multiple_choice`, `type_answer`, `arrange_words`, `fill_blank`, `cloze`, `match_pairs`, `read_aloud`, `free_form`, `dialogue_completion` ("Your line", `DialogueCompletion`: one turn of an exchange, judged by the AI check), `transformation` and `find_mistake` (both `RewriteSentence`; `correct_answer` lists every accepted sentence, model answer first). `strict_accents: true` makes a missing accent wrong (for è/e and similar).
Planned (render as a "coming soon" card via `PlannedExerciseCard`, described in `exercises/plannedExercises.ts`): `structured_input`, `translation`, `dictation`, `minimal_pair`, `listen_and_choose`, `listen_and_repeat`, `spoken_answer`. `reading_comprehension` is superseded by comprehension lesson kinds.

## Known Issues
- `npx eslint src/` reports 9 errors and 1 warning (react-hooks rules and shadcn `only-export-components`), all pre-existing.
- No tests.
