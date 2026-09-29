# New Structure: Design

How the new frontend is organized: content model, screens, progress, and what replaces what. Implements the Product Shape in [development-plan.md](development-plan.md); visuals follow [design-system.md](design-system.md). Scope: **A1 only**, desktop only.

Built on the long-lived branch `feature/new-frontend`, merged when usable.

## What stays, what goes

| Area | Decision |
|---|---|
| Backend (FastAPI, Postgres, Clerk, validation, grading, speech) | **Keep.** One small addition (grammar progress field, below). |
| `engine/` (SRS, validation, API client, vocab cache, review builder) | **Keep**, extend for grammar items. |
| `stores/`, `types/`, `data/` (all lesson content) | **Keep**, extend. |
| Exercise components, lesson flow (`useLessonState`), review session | **Keep the logic, rebuild the look** with design tokens. |
| Path page, winding path, CEFR banners, unit test-out, home dashboard, stats page, badges, checkpoints | **Delete.** Replaced by Today, Library and Progress. |
| XP and levels | **Delete** (decided 2026-09-29). The streak stays as a quiet line in the top bar. |

## Content model

### Chapter (= today's unit)

Chapters are the existing units, one to one. No lesson files move. `curriculum.ts` gains a few fields per unit:

```ts
interface Unit {
  // existing: id, section_id, name, grammar_focus, vocabulary_targets, grammar_notes, lessons, order
  can_do: string;            // "Name and describe family members and say whose they are."
  stamp_title: string;       // "La mia famiglia" (Italian, shown on the stamp)
  grammar_units: string[];   // grammar unit ids this chapter uses, e.g. ["a1-possessives"]
}
interface LessonMeta {
  // existing: id, unit_id, name, order
  role: 'words' | 'practice' | 'writing';   // how the Chapter page groups it
}
```

- `role` is tagged by hand in `curriculum.ts` (a quick pass over ~100 lessons): vocabulary lessons → `words`, grammar/mixed drilling → `practice`, "Practice Writing" → `writing`.
- The Chapter page shows: can-do goal, stamp, grammar used (with status), then Words (word-set lessons), Use it (practice + writing), and later a model dialogue.
- **Stamp earned** = the chapter's `writing` lesson is completed.
- **Chapter learned** = all its lessons completed. **In progress** = at least one.

### Grammar unit (new)

A1 grammar as ~10 whole-system units, one JSON file each in `data/grammar/`, lazy-loaded like lessons.

```ts
interface GrammarUnit {
  id: string;                 // "a1-possessives"
  level: CEFRLevel;
  order: number;              // position in the level's grammar sequence
  title: string;              // "Possessive adjectives"
  minutes: number;            // estimated study time
  prerequisites: string[];    // other grammar unit ids (warnings only, never locks)
  sections: { id: string; title: string; body: string }[];   // body is Markdown (tables, italics, lists)
  mistakes: { wrong: string; right: string; why: string }[];
  practice: Exercise[];       // done in the same sitting, ordered recognition → production
  mastery: Exercise[];        // the check; each exercise has section_id so misses point back to a section
  review_items: GrammarItem[];// what goes into SRS after mastery
}
interface GrammarItem {
  id: string;                 // "a1-possessives:family-rule"
  section_id: string;
  exercises: Exercise[];      // a pool; review picks one at random
}
```

- Section bodies are **Markdown** (rendered with `react-markdown` + GFM tables). Easy to write and review, and it keeps long-form text out of JSON escaping hell as much as possible.
- Practice and mastery reuse the existing `Exercise` shape. New exercise subtypes (transformation, structured input, find the mistake, translation) are added to the types as they are built.
- Status: **learned** = mastery check passed; **in progress** = opened or practice started; **slipping** = its SRS items have recent lapses or are overdue.

### Grammar in SRS

- Uses the existing SRS cards: `word_id = "g:<grammar item id>"`, `skill_type = "grammar"`. No backend change.
- Cards are created when the mastery check is passed (one per `review_items` entry).
- `reviewRunner` gets a `grammar` branch: load the unit, pick an exercise from the item's pool.

### Progress storage

- New JSONB field on `user_progress`: `grammar_units: { [unitId]: { started_at, mastered_at? } }` (Alembic migration; there is no real user data, so no backfill).
- Everything else is derived: chapter status and stamps from `lessons_completed`, words known/fading from SRS card state.

## Screens and routes

| Route | Screen |
|---|---|
| `/` | **Today** |
| `/library` | **Library**: tabs Chapters / Words (word bank moves here) |
| `/library/:unitId` | **Chapter** |
| `/grammar` | **Grammar**: all grammar units of the level, in order, with status |
| `/grammar/:grammarId` | **Grammar unit**: study → practice → mastery check, one page |
| `/progress` | **Progress**: words, grammar tiles, stamp book (replaces stats) |
| `/lesson/:id` | Lesson (existing flow, restyled) |
| `/review` | Review (existing flow, restyled, now includes grammar items) |
| `/profile` | Profile (reached from the top bar, not a main section) |

Top bar sections: Today · Library · Grammar · Progress. Grammar is a pillar of the app, so it's top-level (decided 2026-09-29).

## Progress metrics

- **Words known:** vocab SRS cards in review state. **Solid:** retrievability ≥ 0.9 now. **Fading:** below 0.9 or overdue. Shown against the A1 total (vocabulary entries in A1 chapters until a sourced list exists).
- **Grammar:** tiles per A1 grammar unit: learned (green), in progress (ochre), not started.
- **Stamp book:** one stamp per chapter, earned by its writing task.

## Today planner (v1: simple and explainable)

Input: time budget (setting, default 60 min), progress, SRS state.

1. **Review** due cards (words + grammar), capped at ~30% of the budget.
2. **Recommended chapter** = the first chapter (in order) that isn't learned.
3. If that chapter uses a grammar unit that isn't learned → **study that grammar unit** next.
4. Otherwise → the chapter's next unfinished lessons, until the budget is used.
5. Each step carries a one-line reason ("My Family uses possessives").

The learner can always ignore it and pick anything from the Library.

## Placeholders for what isn't built yet

Every planned feature gets a visible slot in the UI **now**, built with the same components as real content, so the design is unified from the start and later features slot in without redesign. A placeholder is honest about its state: it shows what the feature will be and is clearly marked "Coming soon". It never pretends to work.

| Where | Placeholder |
|---|---|
| Chapter page | **Model dialogue** (listen + transcript), **Tell the tutor** (spoken scenario) |
| Grammar | **All ~10 A1 grammar units** listed in order; unwritten ones shown as "Not written yet" |
| Grammar unit | Study / practice / mastery layout fully built; unwritten units show their outline (planned sections) |
| Exercises | **Planned exercise types** render a styled placeholder card via `renderExercise` instead of nothing: transformation, structured input, find the mistake, full-sentence translation, dialogue completion, dictation, minimal pairs, listen and repeat, spoken answer |
| Words, example sentences, grammar examples | **Audio play buttons** (disabled, "Audio coming soon") where TTS will go |
| Top bar / Today | **AI tutor** entry ("Talk to your tutor", coming soon) |
| Library / Progress | **Placement check** entry, coming soon |
| Progress | **A1 word target** labelled as provisional until the sourced list exists |

A small **exercise gallery** page (dev-only route, `/dev/exercises`) shows every exercise type, real and placeholder, side by side for design review.

## Build order

1. **App shell:** top bar, new routes, empty Today / Library / Chapter / Progress pages in the new style, and the `Placeholder` component. Delete path, test-out, home, stats.
2. **Library + Chapter** on existing content (add `can_do`, `stamp_title`, `grammar_units`, `role` to `curriculum.ts`).
3. **Exercises + lesson flow + review** restyled with tokens, plus placeholder cards for every planned exercise type and the `/dev/exercises` gallery.
4. **Grammar unit** screen + format, with one real unit (Possessives), + grammar SRS items + backend field.
5. **Progress** (metrics, tiles, stamp book).
6. **Today planner.**
7. Remaining A1 grammar units (content work).

## Open questions

- **Placement check** (replacing test-out): later, after grammar units exist.
- **Model dialogues:** content per chapter, later.
