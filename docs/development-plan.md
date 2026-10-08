# ItaLearn — Development Plan

Forward-looking roadmap. Captures decisions made so far and flags what still needs discussion. Living document — expect it to change.

## Product Vision

A complete language-learning loop for Italian:

```
INPUT              RETENTION            OUTPUT
chapters +     →   spaced repetition →  written tasks (per chapter)
grammar units      (words + grammar)    AI conversation tutor (voluntary)
```

The current app is strong on input and retention but thin on output. The two big bets ahead are (1) a curriculum that genuinely covers each CEFR level and (2) a voice AI tutor for spoken output. Written output already exists ("Practice Writing" capstone lessons, AI-graded).

**Who it's for:** serious learners who want to learn Italian on an accelerated timeline. Not a casual app, and not engagement-padded: time in the app should be time spent learning, not feeling productive.

**Coverage, not quotas.** The curriculum is measured by how much of each level's grammar, vocabulary, and can-do functions it teaches. Units and lessons are as large as their topic needs. The only numeric target is vocabulary per level: A1 teaches the words expected at A1, and so on, counted in lemmas.

## Product Shape (proposed 2026-09-29)

Agreed direction, pending a design doc (Workstream 0). Mockup: https://claude.ai/artifact/PZm3G6HYWHt9S9NLkhLDWM (desktop; UI is a placeholder, only the structure is agreed).

- **No visible tree.** The winding path goes. Prerequisites stay as an internal dependency graph that powers recommendations and "you might want X first" warnings; nothing is locked.
- **Today:** the home screen is a plan built around the learner's time budget (e.g. 30/60/90 min): due reviews, then the next study block (a grammar unit, a chapter's words, a reading), with a line explaining why it was picked.
- **Library:** chapters grouped by CEFR level, like a coursebook's table of contents. A chapter has a theme and a can-do goal, and holds a model dialogue, word sets, practice, and a writing task. It lists the grammar it uses. All open.
- **Grammar as its own section.** Each level's grammar is a small number of **whole-system units** (A1 ≈ 10, e.g. "The present tense", "Prepositions" incl. articulated prepositions and partitives). A unit is studied in one sitting (~30–60 min): textbook-depth reading covering every form, rule and exception at that level plus typical mistakes, then practice in the same sitting, then a mastery check. The same page is the reference afterwards. Reading material prioritizes completeness over slick UI.
- **Grammar enters SRS.** After the mastery check, grammar items (transformation, fill-blank, find-the-mistake, translation) are scheduled like words. Bite-sized practice is for maintenance, never for first learning.
- **Progress = coverage.** Words known of the level's list (solid vs fading), grammar units learned (and slipping), CEFR can-do statements achieved. It goes down when you stop reviewing. Replaces path position, CEFR banners and badges.
- **Placement checks** per grammar unit or level replace unit test-out.
- **Existing material is mostly reused:** 21 units → chapters; 772 vocabulary entries → chapter word sets; ~2,000 exercises → chapter and grammar practice; 70 writing tasks → chapter writing. The 298 grammar tips (only 5 with tables) are the raw material for the grammar units.

## What's Built

*Status as of 2026-10-08. Open work is tracked as GitHub issues (#62–#81).*

- **App structure:** Today, Library (chapters and words), Grammar, Progress; lessons, grammar practice and reviews as full-screen sessions. No visible tree. Design system with a single token source ([design-system.md](design-system.md)).
- **Course:** grammar units and chapters interleaved, in the order in `frontend/src/data/course.ts`. Written and reviewed so far: grammar units 1–7 of 16 (First phrases, essere, numbers, avere, nouns & articles, regular verbs, irregular verbs & modals) and chapters 1–4. Chapters 5–21 exist from before the redesign and are listed as "Under construction" until reworked.
- **Grammar units:** a textbook-depth reading with practice stops inside it and a mastery check; progress saved per unit. Not yet in reviews (#67).
- **Lessons:** a "New in this lesson" word list, then exercises ordered recognise → recall → produce; reading lessons with the text beside the questions; single-text writing lessons (AI feedback) that earn the chapter's stamp; speaking lessons. 11 exercise types, including "Your line" dialogues, transformation and fix-the-mistake.
- **Quality:** `npm run check:content` (taught before used, word lists, structure, accepted answers, style, Profilo A1 coverage); AI review of units 1–7 in [reviews/](reviews/); misplaced content kept in `data/pool/`. No tests or CI yet (#80, #81).
- **Backend:** FastAPI + PostgreSQL + Clerk auth. Progress and SRS cards live server-side.
- **AI:** Claude Haiku as fallback for answers local validation rejects (with verdict cache), Claude Sonnet for feedback on free-form writing, Google Speech-to-Text for read-aloud.
- **Progress:** words known, grammar tiles, chapter stamps on a postcard, streak; word bank and profile pages. XP, levels and the winding path are gone.
- **Removed:** section checkpoints (test-out covers skipping; badges exist in the data model but nothing awards them now).

## Content Quality Philosophy

Once the AI tutor and real Italian input (reading/listening passages) carry the "real Italian" load, task content does *not* need to be native-quality. It needs to be:
- **Accurate** — no factual or grammatical errors
- **Clear** — a learner understands what to do
- **Sufficient breadth** — covers the target vocabulary and grammar

Real Italian — natural register, idiom, conversational rhythm — comes from the tutor and from sourced input material. Task drilling is scaffolding for vocabulary and grammar mechanics; it does not need to teach what Italian sounds like in real life. This is liberating: a solo non-native-speaker maintainer can ship strong task content without an Italian linguist on staff.

Native-speaker quality control should be reserved for:
- Reading passages and dialogue scripts (sourced, not generated)
- Occasional sanity-checks on the worst auto-generated task sentences
- The tutor's system prompt (so it stays in genuine Italian register)

## Known Quality Issues in Current Content

To audit and fix systematically (see Workstream 5):
- **Em-dash overuse** in grammar tips and prompts. Reads as LLM register; should use periods, colons, parentheses (textbook style).
- **Lazy distractors** in some `multiple_choice` exercises (generic placeholders rather than same-POS / same-semantic-field).
- **`sentence_context` vocabulary violations** — some exercises use words not yet introduced (violates the 98% rule).
- **Free-form model answers reach forward** — some capstones use grammar/vocab the learner shouldn't have yet (e.g. past tense in an A1 capstone).
- **Hint quality uneven** — some hints translate the sentence (gives away the answer); should clarify the task without spoiling.
- **Exercise monotony** — some lessons have 4 multiple_choice in a row instead of mixing types.

## Workstreams

Parallel-ish tracks. Rough priority order, but they interleave.

### 0. Structure redesign (done)

Built in September–October 2026: the app structure, the design system, the grammar unit format, the chapter format and the content check. What remains from it is tracked as issues: grammar in reviews (#67), the recommended course in Today (#73), and structured input and the audio exercise types (with #68).

### 1. Finish and audit A1

The course order is in `frontend/src/data/course.ts` and the grammar units in [a1-grammar-inventory.md](a1-grammar-inventory.md). The older chapter-first A1 design is in [a1-curriculum-plan.md](a1-curriculum-plan.md) (partly superseded): form-first foundations (units 1–5), then situational units, each with a focus-on-form lesson and a **written capstone lesson** (required to complete the unit). Content for units 1–21 exists.

- **Review existing content** with a stronger model: accuracy, naturalness, distractor quality, forward-reaching vocabulary/grammar (see Known Quality Issues).
- **Check coverage** against a sourced A1 inventory (Workstream 4): which A1 grammar points and lemmas are taught, which are missing, which are taught but belong to a higher level.
- **Fix `curriculum.ts`:** two units share the id `unit-21` ("Hotel & Travel" and an empty leftover "Adverbs & Connectors"), and there's no A2 section, so A1 is followed directly by the old B1 units 22–30.

**Comprehension & extended-skills lessons.** Listening and reading comprehension are **lesson kinds** (a lesson with `passages` + question exercises), not new exercise subtypes — same pattern as the existing `free_form` writing lessons. Required engineering:
- Schema extension: lesson-level `passages[]` + optional `passage_ref` on exercises (documented in the guide).
- A listening-player component and a reading-passage component; the `reading_comprehension` stub subtype is superseded by the lesson-kind approach.
- An **audio-generation script** (authoring-time, not runtime) using ElevenLabs — Text to Speech for monologue passages, Text to Dialogue (v3, multi-speaker) for dialogues. Audio is pre-generated and stored as static assets.
- Listening comprehension is an A2+ feature (A1 sentences are too short to comprehend-test); it lives in the extended-skills band.

**Lesson kinds beyond "standard."** Not every lesson should be a task list. Different content needs different formats. Planned `kind` values:

| `kind` | Format | Use for |
|---|---|---|
| `standard` (default) | Tasks (current behaviour) | Vocabulary drilling, grammar mechanics |
| `notes` | Long-form markdown body + optional check | Grammar concepts (the *why*), cultural notes, deep explanations. Inspired by classic Duolingo's "Tips & Notes." Completion = read and continue. |
| `reference` | Structured chart/table + optional drill | Alphabet, numbers 0–100, verb conjugation tables, calendar — content where the goal is lookup/recognition, not long drilling. |
| `reading` | Text passage(s) + comprehension questions | Long-form reading at A2+; receptive vocabulary growth |
| `listening` | Audio passage(s) + comprehension questions | Listening practice at A2+ |
| `writing` | `free_form` exercises | Existing pattern — capstones |

**Implications for current content:** the alphabet lesson (Unit 2 L5), the numbers unit (Unit 4), and grammar-dense lessons (articles, prepositions, piacere) are bad fits for pure task-based delivery. Grammar-dense content moves into grammar units (Workstream 0); alphabet, numbers and calendar become `reference` content with drilling on top.

This is a deliberate divergence from Duolingo's all-tasks approach. We want active learning that delivers real results quickly — not engagement-padded gamification. Long-form grammar explanations that a learner reads and takes notes on are part of that.

### 2. Voice AI tutor

A real-time spoken conversation partner. Decided design:

- **Standalone feature, not part of the curriculum sequence.** Always available; never required.
- **Context-aware.** On launch it receives the learner's coverage (known words, learned grammar units, completed chapters) and calibrates difficulty.
- **Multiple doors.** Global entry (free conversation) + per-unit "Practice this unit with your tutor" buttons that deep-link in with that unit's scenario pre-seeded.
- **Voluntary.** Skippable, repeatable, zero effect on unit completion. Button isn't rendered until the feature ships, so the curriculum is never blocked on it.
- **Closes the SRS loop.** Post-conversation correction summary → review items.

Open implementation work:
- API choice — OpenAI Realtime API is the current lean (mature, low latency, good browser WebRTC). Gemini Live is a free-tier prototyping option. Cost is a non-issue at personal-use scale.
- Backend `/realtime/session` endpoint to mint short-lived ephemeral tokens (no API key in browser). The FastAPI backend already exists.
- `features/conversation/` (or `features/tutor/`) frontend module.
- Context payload format — depends on Workstream 3.
- Cost (estimate, 2026-10-01, single user): ElevenLabs Agents ≈ $0.17–0.18 per minute (≈ $35–80/month at 15 min a few times a week to daily); a self-built pipeline (Google speech-to-text + Claude + cheaper TTS) ≈ $0.03–0.05/min. Start with Agents to test usefulness, move to a pipeline if usage is heavy. The tutor's language model should be Sonnet (quality vs latency).

### 2a. Text chat: "Talk about it" (before the voice tutor)

Written back-and-forth with an AI partner, the step between one-off writing tasks and live speaking. Same "brain" as the voice tutor, without the voice, so it doubles as a cheap way to test conversation quality before paying per minute for speech.

- **Grounded in a reading.** After a reading lesson, the AI asks about the text in Italian, then moves to the learner's own life (*Di dov'è Chloé? E tu, di dove sei?*).
- **Kept to the learner's level** using the same curriculum context the writing feedback gets: grammar and words covered so far.
- **Corrections without interrupting:** the AI recasts mistakes in its replies; a summary at the end lists the ones worth knowing, linked to grammar sections (and later into reviews).
- **A clear end:** 6–10 learner turns, then the summary. A lesson, not an open chatbot.
- **Limits for real users:** turn cap per conversation, a daily allowance per user, short context (reading + level + last few turns), and a topic guard that steers back to the reading.
- Cost: text only, roughly $0.01–0.05 per conversation.

### 2b. TTS for pronunciation (app-wide)

Beyond the listening-comprehension audio and the live tutor, the app needs **per-word Text-to-Speech everywhere Italian is shown**, so learners can hear correct pronunciation on demand.

- Use cases:
  - **Alphabet lesson** — useless without audio for each letter.
  - **Vocabulary cards** — a small speaker icon next to every Italian word/phrase in vocabulary entries, exercises, and SRS reviews.
  - **Example sentences** — clickable playback so learners can hear natural intonation.
  - **Reference pages** (numbers, days, months) — audio for each item.
- Requirements:
  - **High quality** — robotic TTS undermines the whole pronunciation purpose. Aim for ElevenLabs-tier quality.
  - **Pre-generated at authoring time** for every vocabulary word and example sentence, stored as static assets. Same model as comprehension passages — never runtime generation.
  - **Cached locally** for offline / fast playback.
- Implementation sketch:
  - Audio-generation script walks all lesson JSON, generates `audio/lemmas/{word}.mp3` and `audio/examples/{lesson-id}/{ex-id}.mp3` for new entries only.
  - Frontend components get a `<PlayIcon>` that triggers playback from the generated path.
- This is part of the same audio pipeline as listening passages — same ElevenLabs account, same script, different output buckets.

### 3. SRS lemma / dedup rework

Current state: the SRS stores **one card per inflected form**, with no lemma grouping. `ho`/`hai`/`ha`/`abbiamo`/`avete`/`hanno`/`avere` are 7 unrelated cards; `libro`/`libri` are 2. Dedup is exact-string only.

Consequences: vocabulary counts are inflated, related forms all come due together (redundant reps, correlated items), and there's no way to query "does the learner know lemma X."

Target model: **note = lemma, card = (lemma × form/skill)** — group inflected forms under one lemma note. Then counts are honest at lemma level, and the AI tutor can be scoped to known *lemmas*.

This should be decided **before** the tutor's context payload is built (Workstream 2 depends on it). There is no real user data yet, so the DB schema can be changed freely.

### 4. Curriculum coverage — A1 through B2

**Anchor: coverage.** Each level is defined by an inventory: grammar points, vocabulary (lemmas), and can-do functions. The curriculum is done for a level when it teaches that inventory. Unit and lesson counts fall out of the content; they are not targets.

**Build the inventory.**
- **Vocabulary per level:** a sourced lemma list per CEFR level. Candidates: *Profilo della lingua italiana* (Spinelli & Parizzi, the CEFR reference level description for Italian), CILS/CELI exam vocabulary expectations, De Mauro's frequency tiers. Existing estimates in older docs (A1 ≈ 500–650 lemmas, B2 ≈ 4,000–6,000) are unsourced and should be replaced by the list.
- **Grammar per level:** the milestones below, refined against the same sources.
- **Can-do functions per level:** from the CEFR descriptors.
- **Coverage script:** compare lesson JSON `vocabulary` entries (as lemmas) and grammar tags against the inventory and report what's missing or misplaced. `data/italian-frequency-50k.txt` (subtitle-corpus frequencies) can help rank missing words.

**Three kinds of unit per level**, with proportions sliding as level rises:

1. **Grammar-core** — units concentrating the level's milestone grammar. At A1 these are pure-grammar (units 1–5). At A2+ they are *lightly situational* — A2+ grammar (passato prossimo, subjunctive) has natural communicative homes, so it should never be drilled in a vacuum. This band **shrinks** as you climb (B2 has little new grammar).
2. **Situational** — scenario-organized units, grammar threaded through (the A1 situational model).
3. **Extended-skills** — units built around longer reading texts, long-form writing, and sustained conversation/listening. Barely present at A1 (just the written capstones); **grows** to dominate B2.

Higher-level units can carry more per unit (grammar transfers, cognates compound, longer texts expose vocabulary in bulk), so units will vary a lot in size. The path UI shouldn't imply they're uniform.

**Grammar milestones per level** (define the grammar-core band):

- **A2 — the past + pronouns:** passato prossimo (essere/avere auxiliary, participle agreement), imperfetto and the imperfetto-vs-passato-prossimo contrast, futuro semplice, condizionale presente, object pronouns (direct/indirect) + ne + ci, imperative, comparatives/superlatives.
- **B1 — the subjunctive:** congiuntivo presente e passato, periodo ipotetico (types 1–2), trapassato prossimo, condizionale passato, futuro anteriore, relative clauses, passive voice, combined pronouns, basic reported speech.
- **B2 — completing the systems:** congiuntivo imperfetto e trapassato, periodo ipotetico dell'irrealtà (type 3), passato remoto (mostly recognition), full reported speech with backshifting, subjunctive-triggering connectives. Beyond this B2 is mostly register, idiom, and nuance — hence the large extended-skills band.

**A1 grammar — minor open items:** A1 coverage is essentially complete. Two A1/A2-border items to place deliberately: **quantifiers** (molto, poco, tanto, troppo — lean: fold into A1) and **object pronouns** (lean: open A2 with them).

**Still to do:** unit design for A2/B1/B2, driven by the inventory. Comprehension lesson kinds (Workstream 1) must be built for the extended-skills band.

### 5. Content quality requirements & audit

Codify quality standards for lesson content and build a script that enforces them automatically. Without this, future content (especially LLM-generated) will keep introducing the same issues.

**Concrete checklist (to be added to [exercise-generation-guide.md](exercise-generation-guide.md)):**
- No em-dashes in `prompt.text`, `hints`, or `grammar_tips.explanation` — use periods, colons, parentheses
- `multiple_choice` distractors must be same part of speech AND same semantic field as the correct answer
- `sentence_context` and `correct_answer` use only vocabulary introduced in this lesson or earlier (98% rule) — except example sentences in `grammar_tips`, which may contain stretch input
- `free_form` model answers use only grammar/vocabulary the learner has at this point in the curriculum (no future tenses or unintroduced lemmas)
- Hints clarify the task without giving away the answer
- Exercise types are mixed (no 4 multiple_choice in a row), shifting toward production as level rises
- Lesson IDs and exercise IDs unique and well-formed

**Audit script** (`scripts/audit-lessons.py`): walks all lesson JSON, runs the checks, prints a structured report of violations. Should run in CI eventually but for now: run locally before commit.

**Use it to audit existing A1 content** and fix the known issues listed under "Known Quality Issues" above.

### 6. Peer speaking (future)

A real-time speaking practice feature **between human learners** (not the AI tutor) — booked sessions or matched group rooms. Lets users get human conversation practice once they've built a foundation with the tutor. Far future, but tracked: this is what eventually distinguishes the app from any other.

Likely shape:
- Calendar-based session booking (italki-style)
- Or low-friction "match me with another A1 learner now"
- Or async voice-message practice (post a 30-second answer, get one back)

### 6b. Costs and business model (later, if the app gains users)

Not a money-making project: the aim is an open, free platform. Costs have to stay predictable for a solo maintainer.

**Who pays for what (decided 2026-10-01):**
- **Free for everyone, no AI:** lessons, grammar units, readings, local answer checks.
- **Paid by the maintainer, with caps:** AI answer checks (Haiku), writing feedback (Sonnet), text chat "Talk about it". Roughly $1–3 per active user per month each.
- **The learner's own API key:** the real-time voice tutor (the expensive part, ≈ $0.03–0.18 per minute). The key stays in the learner's browser, never stored on the server.
- **Needed before real users:** a per-user daily AI allowance, a global monthly budget guard that pauses AI features gracefully before the cap, and the bring-your-own-key input for voice.

**Transparent finances (idea, if it gains traction):**
- A public "Where the money goes" page with real monthly costs per service (from the budget guard's tracking) next to income, plus what we'd like to fund (native-speaker review, better voices, content) and what's missing.
- An optional supporter subscription with a published split: API costs, content review, maintainer. It could include voice tutor minutes, so supporters don't need their own key. Free users keep everything else.
- Maintainer pay: propose a figure with the reasoning (hours, costs) and ask the community for feedback, rather than an open "what's fair?" (which tends to anchor low and favours the loudest voices).
- Options to look at: Open Collective (public ledger, can act as fiscal host); a merchant-of-record payment provider (Paddle, Lemon Squeezy) to handle EU/EEA VAT on digital subscriptions; local rules on side income before taking any money.

### 7. Backlog (from the original phase plans, not yet built)

- PWA install + offline support
- Import/export of learning data; settings screen
- Accessibility pass; performance (main JS chunk is ~930 kB, needs code-splitting)
- False friends / contrastive EN↔IT notes as first-class content
- Error-pattern tracking (e.g. repeated essere/avere confusion) → targeted mini-lessons
- More speaking exercises: listen-and-repeat, respond to a spoken prompt (tiered: short answers via browser speech recognition, longer via server STT, LLM for lenient grading)
- Listening exercises: listen-and-choose, dictation, minimal pairs (need the audio pipeline, Workstream 2b)
- Badges: decide whether to keep them now that checkpoints are gone
- **Recommended course in Today** (user idea, 2026-09-30): a suggested order through chapters and grammar units. E.g. once the learner has finished the chapters that sit at their current grammar level, Today recommends the next grammar unit before more chapters. Builds on the Today planner and the chapter → grammar unit links (`data/grammarPlan.ts`).

## Open Questions

- Gating: should a chapter require its grammar units, recommend them, or just link to them? (Lean: recommend + warn.)
- The exact list of A1 grammar units, and which source defines each level's grammar inventory.
- How the Today planner balances grammar, new words, and review for a given time budget.
- Whether XP, levels and streaks survive the redesign, and in what form.

- Which source defines the per-level vocabulary and grammar inventory (Workstream 4).
- Unit design for A2/B1/B2, once the inventory exists.
- SRS lemma model — exact schema for note=lemma / card=form.
- Tutor API final choice and whether to prototype on Gemini's free tier first.
- LLM content-generation pipeline — build it to author the situational/extended units, or author by hand?
- Placement of A1/A2-border grammar: quantifiers (lean A1) and object pronouns (lean A2 opener).

## Decisions Log

- (2026-09-29) Target audience is serious learners on an accelerated timeline.
- (2026-09-29) Proposed: no visible tree; chapters + separate grammar section + time-budgeted Today plan + coverage-based progress. Pending design doc.
- (2026-09-29) Grammar is taught as whole systems in one sitting, at textbook depth, then maintained through SRS. Bite-sized is for maintenance only.
- (2026-09-29) Desktop first. Mobile design is out of scope for now.
- (2026-10-02) Grammar is written "simple, but true" (name exceptions, flag simplifications, check rules against Treccani / Crusca) and each unit's form follows its content; see the authoring guide, rules 9 and 10.
- (2026-10-02) Quality pipeline: automatic content check on every change → AI review per unit → hands-on play-through (#62) → testers' error data. Native-speaker review when someone is available.
- (2026-10-01) Numbers 0–100 is its own early grammar unit (before avere); the present tense is split into regular verbs and irregular verbs & modals. A1 has 16 grammar units.
- (2026-10-01) Who pays: the maintainer covers capped text AI; voice needs the learner's own key (section 6b).
- (2026-09-30) Lessons: every word is introduced on a new-words list before it's asked for; exercises run recognise → recall → produce. Typed recall replaces "What does X mean?" multiple choice (production beats recognition, Webb 2009; Italian → English first for new words; multiple choice only with plausible options, Little & Bjork 2012).
- (2026-09-30) Accepted answers: one model answer, the AI check judges variants; effort goes into validating the AI's verdicts (#72), not listing every translation.
- (2026-09-30) No grammar tips in lessons; explanations live in grammar units. Speaking and long-form writing are separate lessons in their own chapter sections. Misplaced good content goes to `data/pool/`.
- (2026-09-30) Grammar decides the order; chapters are built around it and interleave with the units (`course.ts`). Existing chapters are never fixed and can be restructured freely.
- (2026-09-29) Visual direction: Olivetti colour and type (Archivo) with Mediterranean tiles and stamps; calm UI with background shapes; one token source in `index.css`. See design-system.md.

- A1 opens with form-first foundations (units 1–5), then moves to situational (notional-functional) units.
- Situational units organize around a scenario; grammar is threaded through via a focus-on-form lesson, not the unit's organizing principle.
- Two capstones per situational unit: a **written** one (required to complete the unit) and a **spoken tutor scenario** (voluntary).
- The AI tutor is a standalone feature, reachable globally and via per-unit deep-link buttons, context-aware of what the learner knows.
- Vocabulary is counted as headwords/lemmas, never inflected forms.
- Every level is built from three bands — grammar-core, situational, extended-skills — with grammar-core shrinking and extended-skills growing as level rises.
- Curriculum is anchored on **coverage** of each CEFR level's grammar, vocabulary, and functions — not unit count, lesson count, exercise count, or guided hours. The only numeric target is vocabulary per level, defined as a sourced lemma list (2026-09-29, replaces the earlier ≈114-unit target).
- Units and lessons are sized to their content; higher-level units can be much larger than A1 units.
- Listening and reading comprehension are lesson *kinds* (passages + question exercises), not new exercise subtypes — mirroring the existing `free_form` writing lessons.
- Listening audio is pre-generated at authoring time via ElevenLabs (TTS for monologue, Text to Dialogue for multi-speaker), never at runtime.
- Lesson *content* (prompts, questions) shifts gradually from English to Italian as level rises; *explanatory* text (grammar tips, rule-explaining hints) stays English; the app UI chrome stays English always. No UI internationalization feature.
- Task-based content does not need to be native-quality Italian — accurate, clear, and broad is enough. Native quality comes from the tutor and from sourced reading/listening material, not from generated drill exercises.
- Lesson `kind` is the main organizing axis: `standard` (tasks), `notes` (long-form grammar/concept text), `reference` (charts/tables for closed sets like alphabet, numbers), `reading` (passage + comprehension), `listening` (audio + comprehension), `writing` (free_form capstone).
- App-wide Text-to-Speech is required: every Italian word and example sentence shown in the app needs an on-demand audio button, pre-generated at authoring time via ElevenLabs. Same audio pipeline as listening comprehension; never runtime generation.
- Solo non-native-speaker maintainer model: own structure, pacing, UX, engineering; outsource linguistic naturalness to (in cost order) LLM cross-check, an Italian friend, italki tutors, published textbook patterns, native communities. Don't try to be the native speaker — that's the wrong leverage.
