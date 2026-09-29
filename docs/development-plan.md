# ItaLearn — Development Plan

Forward-looking roadmap. Captures decisions made so far and flags what still needs discussion. Living document — expect it to change.

## Product Vision

A complete language-learning loop for Italian:

```
INPUT              RETENTION            OUTPUT
situational    →   spaced repetition →  written capstones (in tree)
lessons            (SRS)                AI conversation tutor (voluntary)
```

The current app is strong on input and retention but thin on output. The two big bets ahead are (1) finishing a real situational curriculum and (2) adding a voice AI tutor for spoken output. Written output already exists (unit 5 "Practice Writing"-style lessons) and becomes a required capstone in every situational unit.

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
- **Exercise monotony** — some lessons have 4 multiple_choice in a row instead of mixing types per the distribution table.

## Workstreams

Four parallel-ish tracks. Rough priority order, but they interleave.

### 1. Finish A1 content

The A1 structure is decided — see [a1-curriculum-plan.md](a1-curriculum-plan.md). 20 units: 1–5 form-first foundations (built/partly built), 6–20 situational (designed at unit level only).

- Units 1–5: complete content, minor polish.
- Units 6–20: **detailed lesson-level design** is the next step (the plan has unit-level outlines only).
- Each situational unit needs: focus-on-form lesson(s) + situational practice lessons + one **written capstone lesson** (in-tree, required).
- Authoring 15 situational units by hand is large — this is where an LLM-assisted content-generation pipeline (author exercises + vocab from a unit spec) becomes worth building. See [exercise-generation-guide.md](exercise-generation-guide.md).

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
| `reference` | Structured chart/table + optional drill | Alphabet, numbers 0–100, verb conjugation tables, calendar — content where the goal is lookup/recognition, not drilling 15 exercises. |
| `reading` | Text passage(s) + comprehension questions | Long-form reading at A2+; receptive vocabulary growth |
| `listening` | Audio passage(s) + comprehension questions | Listening practice at A2+ |
| `writing` | `free_form` exercises | Existing pattern — capstones |

**Implications for current content:** the alphabet lesson (Unit 2 L5), the numbers unit (Unit 4), and grammar-dense lessons (articles, prepositions, piacere) are bad fits for pure task-based delivery. They should be **rebuilt as `notes` or `reference` lessons** with task drilling layered on top, not replaced by it.

This is a deliberate divergence from Duolingo's all-tasks approach. We want active learning that delivers real results quickly — not engagement-padded gamification. Long-form grammar explanations that a learner reads and takes notes on are part of that.

### 2. Voice AI tutor

A real-time spoken conversation partner. Decided design:

- **Standalone feature, not a tree node.** Always available; never gates progression.
- **Context-aware.** On launch it receives the learner's tree position (completed units, known vocab/grammar) and calibrates difficulty.
- **Multiple doors.** Global entry (free conversation) + per-unit "Practice this unit with your tutor" buttons that deep-link in with that unit's scenario pre-seeded.
- **Voluntary.** Skippable, repeatable, zero effect on unit completion. Button isn't rendered until the feature ships, so the curriculum is never blocked on it.
- **Closes the SRS loop.** Post-conversation correction summary → review items.

Open implementation work:
- API choice — OpenAI Realtime API is the current lean (mature, low latency, good browser WebRTC). Gemini Live is a free-tier prototyping option. Cost is a non-issue at personal-use scale.
- Backend `/realtime/session` endpoint to mint short-lived ephemeral tokens (no API key in browser). The FastAPI backend already exists.
- `features/conversation/` (or `features/tutor/`) frontend module.
- Context payload format — depends on Workstream 3.

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

This should be decided **before** the tutor's context payload is built (Workstream 2 depends on it). Note: per [memory] there is no user data yet, so the DB schema can be changed freely.

### 4. Curriculum structure — A2 / B1 / B2

The current `curriculum.ts` has A1=10, A2=11, B1=9, B2=8 units — the count *decreases* as level rises, which is inverted. Each CEFR level is more work than the one below it. The structure below replaces that.

**Anchor: vocabulary, not unit count or hours.** The full climb to B2 is ~5,000–6,000 words. Guided hours (~500+ to B2) are filled mostly by SRS review, reading, and conversation — they do *not* map to unit count. Unit count maps to vocabulary and grammar coverage.

**Units get denser, not just more numerous.** An A1 unit is ~3–4 lessons / ~32 words. Higher-level units run 6–10 lessons carrying 60–100 words. This is realistic: by B1/B2 grammar transfers, Latinate cognates compound, and longer reading texts expose vocabulary in bulk — each word is *cheaper* to acquire, so a unit can carry more. (Caveat: per-unit *time* still grows; units are not uniform in size, and the path UI shouldn't imply they are.)

**Three-band template per level.** Every level (including A1) is built from three kinds of unit, with the proportions sliding as level rises:

1. **Grammar-core** — front-loaded units concentrating the level's milestone grammar. At A1 these are pure-grammar (units 1–5). At A2+ they are *lightly situational* — A2+ grammar (passato prossimo, subjunctive) has natural communicative homes, so it should never be drilled in a vacuum. This band **shrinks** as you climb (B2 has little new grammar).
2. **Situational** — scenario-organized units, grammar threaded through (the A1 units 6–20 model).
3. **Extended-skills** — units built around longer reading texts, long-form writing, and sustained conversation/listening. Barely present at A1 (just the written capstones); **grows** to dominate B2.

**Target shape:**

| Level | Units | Grammar-core | Situational | Extended-skills | ~Words/unit | New words | Cumulative |
|---|---|---|---|---|---|---|---|
| A1 | 20 | 5 (pure) | 15 | — (capstones) | ~32 | ~650 | ~650 |
| A2 | ~28 | ~4 | ~8–10 | ~2–3 | ~45 | ~1,250 | ~1,900 |
| B1 | ~32 | ~3–4 | ~8 | ~4–5 | ~60 | ~1,900 | ~3,800 |
| B2 | ~34 | ~2–3 | ~6 | ~6–8 | ~70 | ~2,400 | ~6,200 |

≈ **114 units total, ~6,200 words** — genuinely B2. (Keeping units A1-sized instead of denser pushes the count toward ~190; the denser path is preferred.)

**Grammar milestones per level** (define the grammar-core band):

- **A2 — the past + pronouns:** passato prossimo (essere/avere auxiliary, participle agreement), imperfetto and the imperfetto-vs-passato-prossimo contrast, futuro semplice, condizionale presente, object pronouns (direct/indirect) + ne + ci, imperative, comparatives/superlatives.
- **B1 — the subjunctive:** congiuntivo presente e passato, periodo ipotetico (types 1–2), trapassato prossimo, condizionale passato, futuro anteriore, relative clauses, passive voice, combined pronouns, basic reported speech.
- **B2 — completing the systems:** congiuntivo imperfetto e trapassato, periodo ipotetico dell'irrealtà (type 3), passato remoto (mostly recognition), full reported speech with backshifting, subjunctive-triggering connectives. Beyond this B2 is mostly register, idiom, and nuance — hence the large extended-skills band.

**A1 grammar — minor open items:** A1 coverage is essentially complete. Two A1/A2-border items to place deliberately: **quantifiers** (molto, poco, tanto, troppo — lean: fold into A1) and **object pronouns** (lean: open A2 with them).

**Still to do:** per-unit titles, scenarios, and lesson-level design for A2/B1/B2 — a later pass, like A1 units 6–20. The `reading_comprehension` exercise subtype (currently a stub) must be built for the extended-skills band.

### 5. Content quality requirements & audit

Codify quality standards for lesson content and build a script that enforces them automatically. Without this, future content (especially LLM-generated) will keep introducing the same issues.

**Concrete checklist (to be added to [exercise-generation-guide.md](exercise-generation-guide.md)):**
- No em-dashes in `prompt.text`, `hints`, or `grammar_tips.explanation` — use periods, colons, parentheses
- `multiple_choice` distractors must be same part of speech AND same semantic field as the correct answer
- `sentence_context` and `correct_answer` use only vocabulary introduced in this lesson or earlier (98% rule) — except example sentences in `grammar_tips`, which may contain stretch input
- `free_form` model answers use only grammar/vocabulary the learner has at this point in the tree (no future tenses or unintroduced lemmas)
- Hints clarify the task without giving away the answer
- Exercise mix matches the per-level distribution table (no 4 multiple_choice in a row)
- Lesson IDs and exercise IDs unique and well-formed

**Audit script** (`scripts/audit-lessons.py`): walks all lesson JSON, runs the checks, prints a structured report of violations. Should run in CI eventually but for now: run locally before commit.

**Use it to audit existing A1 content** and fix the known issues listed under "Known Quality Issues" above.

### 6. Peer speaking (future)

A real-time speaking practice feature **between human learners** (not the AI tutor) — booked sessions or matched group rooms. Lets users get human conversation practice once they've built a foundation with the tutor. Far future, but tracked: this is what eventually distinguishes the app from any other.

Likely shape:
- Calendar-based session booking (italki-style)
- Or low-friction "match me with another A1 learner now"
- Or async voice-message practice (post a 30-second answer, get one back)

## Open Questions

- Per-unit titles, scenarios, and lesson-level design for A2/B1/B2 (the structure is set — see Workstream 4 — but the unit-by-unit breakdown is not).
- SRS lemma model — exact schema for note=lemma / card=form.
- Tutor API final choice and whether to prototype on Gemini's free tier first.
- LLM content-generation pipeline — build it to author the situational/extended units, or author by hand?
- Placement of A1/A2-border grammar: quantifiers (lean A1) and object pronouns (lean A2 opener).

## Decisions Log

- A1 is 20 units: 1–5 form-first foundations, 6–20 situational (notional-functional).
- Situational units organize around a scenario; grammar is threaded through via a focus-on-form lesson, not the unit's organizing principle.
- Two capstones per situational unit: a **written** one (in-tree, required, gates progression) and a **spoken tutor scenario** (outside the tree, voluntary).
- The AI tutor is a standalone feature, never a tree node — reachable globally and via per-unit deep-link buttons, context-aware of tree position.
- Vocabulary is counted as headwords/lemmas, never inflected forms.
- Every level is built from three bands — grammar-core, situational, extended-skills — with grammar-core shrinking and extended-skills growing as level rises.
- Curriculum is anchored on vocabulary (~6,200 words to B2), not unit count or guided hours.
- Higher-level units are denser (more lessons, more words), not just more numerous. Target ≈114 units total: A1=20, A2≈28, B1≈32, B2≈34.
- Listening and reading comprehension are lesson *kinds* (passages + question exercises), not new exercise subtypes — mirroring the existing `free_form` writing lessons.
- Listening audio is pre-generated at authoring time via ElevenLabs (TTS for monologue, Text to Dialogue for multi-speaker), never at runtime.
- Lesson *content* (prompts, questions) shifts gradually from English to Italian as level rises; *explanatory* text (grammar tips, rule-explaining hints) stays English; the app UI chrome stays English always. No UI internationalization feature.
- Task-based content does not need to be native-quality Italian — accurate, clear, and broad is enough. Native quality comes from the tutor and from sourced reading/listening material, not from generated drill exercises.
- Lesson `kind` is the main organizing axis: `standard` (tasks), `notes` (long-form grammar/concept text), `reference` (charts/tables for closed sets like alphabet, numbers), `reading` (passage + comprehension), `listening` (audio + comprehension), `writing` (free_form capstone).
- App-wide Text-to-Speech is required: every Italian word and example sentence shown in the app needs an on-demand audio button, pre-generated at authoring time via ElevenLabs. Same audio pipeline as listening comprehension; never runtime generation.
- Solo non-native-speaker maintainer model: own structure, pacing, UX, engineering; outsource linguistic naturalness to (in cost order) LLM cross-check, an Italian friend, italki tutors, published textbook patterns, native communities. Don't try to be the native speaker — that's the wrong leverage.
