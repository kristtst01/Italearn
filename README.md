# ItaLearn

A personal, gamified Italian learning app (EN→IT only) inspired by Duolingo's path structure but designed to move faster and be grounded in language acquisition research.

## Vision

A Duolingo-style path system for learning Italian from A1 to B2, covering four core skill types driven by modern spaced repetition. The curriculum follows the CEFR framework and is modeled on university Italian course progressions (Wellesley College's Italian Studies program, standard CEFR syllabi).

## Science-Backed Design Principles

### Spaced Repetition — FSRS Algorithm
We use FSRS (Free Spaced Repetition Scheduler) rather than the older SM-2. Research shows FSRS reduces review load by 20–30% compared to SM-2 for the same retention level, with a 99.6% superiority rate across users. FSRS models three components of memory and adapts intervals based on your personal review history — no manual tuning needed.

Every word and grammar pattern is tracked as an individual SRS card, with **separate scores per skill type** (you might recognize a word by ear but not be able to spell it).

### Sentence-Based Learning Over Isolated Words
Words are always taught in context. Research consistently shows that learning vocabulary in sentences leads to better retention, natural usage patterns, and grammatical intuition compared to isolated word lists. Each new word is introduced via an example sentence, and exercises use full sentences wherever possible.

### Balanced Explicit + Implicit Grammar
Pure comprehensible input (Krashen's i+1) has mixed empirical support on its own. Research shows the strongest gains come from **combining comprehensible input with explicit form-focused instruction**. Our approach:
- Short grammar explanations before exercises (explicit)
- Massive contextual exposure through exercises (implicit)
- Grammar patterns reinforced across all four skill types

### Frequency-First Vocabulary (De Mauro's Vocabolario di Base)
Vocabulary is sourced from Tullio De Mauro's *Vocabolario di Base* — the gold standard for Italian frequency:
- *Vocabolario fondamentale*: ~2,000 most frequent words (covers ~86% of text)
- *Vocabolario di alto uso*: next ~2,750 words (~6% more coverage)
- *Vocabolario di alta disponibilità*: ~2,300 words common in speech but rare in writing (body parts, household items, etc.)

The top 300 words alone cover ~65% of all Italian text. We front-load these heavily, then expand by CEFR level. Each level should teach the vocabulary a learner at that level is expected to know. The exact per-level word lists still need to be sourced (see [development-plan.md](docs/development-plan.md)).

Vocabulary is counted in **lemmas** (headwords), never inflected forms: "parlare" is one word, not parlo, parli, parla, parliamo, parlate, parlano, parlato, parlando.

### Active Recall Over Passive Recognition
Production exercises (typing Italian, speaking, constructing sentences) are weighted more heavily than recognition exercises (multiple choice). This is harder but produces significantly stronger retention.

### Interleaving
Each lesson mixes all four skill types and revisits prior material. This is harder in the moment but produces better long-term retention than blocked practice.

### Error Correction — Immediate, Explanatory, No Punishment
Research (Li 2010 meta-analysis) shows corrective feedback is effective when it's immediate and explicit. Our approach:
- **Always show the correct answer immediately** after an error
- **Brief explanation of why** (1–2 sentences) — metalinguistic feedback is the most effective type
- **Show the full correct sentence** for context
- **No lives/hearts system** — punishing errors discourages risk-taking and deeper processing
- **FSRS handles re-scheduling** — wrong answers automatically get shorter intervals
- **Track error patterns** — if you consistently confuse essere/avere auxiliaries, surface a targeted mini-lesson

### L1 (English) Usage — Gradual Transition
Research (Laufer & Girsai 2008) shows L1 translations are more efficient than L2 definitions for beginners, and contrastive analysis (comparing English↔Italian) improves retention:
- **A1–A2**: English freely used for explanations, translations, interface
- **B1**: Grammar notes in simplified Italian where possible, English as fallback
- **B2**: Interface predominantly Italian, English only for complex grammar explanations
- **False friends explicitly taught** at all levels (actually ≠ attualmente, factory ≠ fattoria, etc.)

### Addressing Duolingo's Weaknesses
Research (Loewen et al. 2019) found Duolingo users improved in grammar/reading but showed **no significant improvement in oral proficiency**. Key shortcomings we aim to fix:
- **Too slow** — our path moves at university pace, not drip-feed pace
- **Over-reliance on multiple choice** — we emphasize typed production and free recall (the "testing effect" — Roediger & Karpicke 2006)
- **Weak grammar instruction** — we include explicit grammar notes and pattern drilling
- **Gamification over learning** — engagement serves learning, not the other way around
- **Decontextualized bizarre sentences** — we use realistic, practical sentences
- **Lack of connected text** — we include reading passages and dictation, not just isolated sentences
- **No proper SRS** — Duolingo used a "strength" decay model; we use FSRS

## Skill Types

### 1. Vocabulary
- Sentence-context flashcards with FSRS scheduling
- Multiple choice (IT→EN and EN→IT)
- Type the translation (with typo tolerance)
- Match pairs (timed)

### 2. Writing (Production)
- Arrange words into correct sentence order
- Fill in the blank (conjugation, prepositions, articles, agreement)
- Translate full sentences EN→IT by typing
- Cloze deletion (complete the missing word in an Italian sentence)

### 3. Speaking (Pronunciation)
- Read-aloud exercises (words and full sentences), checked via speech-to-text
- Listen and repeat
- Respond to a spoken prompt verbally

### 4. Listening (Comprehension) — planned, needs the audio pipeline
- Hear Italian, select the correct translation
- Dictation — hear a sentence, type what you heard in Italian
- Hear a question, pick the correct Italian answer
- Minimal pairs — distinguish similar-sounding words

## CEFR-Aligned Path Structure

The path runs A1 → B2 and is organized by **coverage**: each level has an inventory of grammar, vocabulary, and can-do functions, and units group that content into coherent topics. Units have as many lessons as the topic needs; there are no fixed counts. The live structure is in `frontend/src/data/curriculum.ts`, and the A1 design is in [docs/a1-curriculum-plan.md](docs/a1-curriculum-plan.md).

Units unlock linearly. A "test out" option lets you skip units you already know.

## Gamification

- **XP** earned per exercise (bonus for streaks of correct answers within a lesson)
- **Daily streak** tracking with calendar view
- **Mastery percentage** per unit — driven by SRS, mastery decays if you don't review
- **Level / rank** based on total XP
- **Review queue** — daily SRS review separate from new lessons, always accessible

## Core Learning Loop

Every new concept follows this research-backed sequence:

```
1. INTRODUCE  → New word/structure with translation + audio + 2–3 example sentences
2. EXPLAIN    → Brief grammar pop-up (2–3 sentences) when a new pattern appears
3. PRACTICE   → Cloze deletion, EN→IT typed translation, arrange words, fill-in-blank
4. REVIEW     → FSRS-scheduled spaced repetition (target 90% retention)
5. CONTEXT    → Graded reading/listening passages recycling known vocabulary
```

This combines initial form-meaning mapping (efficient — Prince 1996) with contextual encounters (durable — Joe 1998) and retrieval practice (the testing effect — Roediger & Karpicke 2006).

## Curriculum Content

Content is generated via LLM following CEFR progression and university Italian course structure, then reviewed and tweaked. Vocabulary is sourced from De Mauro's Vocabolario di Base. Stored as structured JSON files covering:

- Target vocabulary and phrases per unit (with example sentences)
- Grammar concepts introduced per unit (with short explanations)
- Exercise definitions (type, prompt, correct answer, distractors)
- Grammar tip snippets shown during lessons
- Reading passages for later sections
- False friends and contrastive notes (EN↔IT)

## Tech Stack

- **Frontend:** Vite + React 19 + TypeScript, Tailwind CSS 4 (design tokens in `index.css`), shadcn/ui, Zustand, React Router
- **Backend:** FastAPI + PostgreSQL (SQLAlchemy/Alembic), Docker Compose
- **Auth:** Clerk
- **FSRS:** ts-fsrs for spaced repetition scheduling
- **Answer validation:** local fast path (accent/typo tolerance) with Claude as fallback for answers the fast path rejects, plus AI grading of free-form writing
- **Speech:** Google Cloud Speech-to-Text for read-aloud exercises
- **Audio on everything (planned):** every Italian word and sentence gets pre-generated TTS audio (ElevenLabs). Phonological memory is a top predictor of L2 vocabulary acquisition (Baddeley et al. 1998). Browser SpeechSynthesis was rejected as too inconsistent across browsers.

## Running It

**Frontend** (from `frontend/`):
```
npm install
npm run dev       # Vite dev server on :5173
npm run build     # type-check + production build
```
Needs `VITE_CLERK_PUBLISHABLE_KEY`; `VITE_API_URL` defaults to `http://localhost:8000`.

**Backend** (from `backend/`, requires Docker):
```
make setup                 # build containers, start Postgres, run migrations
make run                   # start API + DB
make migration msg="..."   # new Alembic migration
```
Needs `backend/.env` with `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `ANTHROPIC_API_KEY`, and `GOOGLE_APPLICATION_CREDENTIALS`.

## Documentation

| Doc | Purpose |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Code layout and conventions (for humans and AI agents) |
| [docs/development-plan.md](docs/development-plan.md) | Roadmap, what's built, open questions, decisions log |
| [docs/a1-curriculum-plan.md](docs/a1-curriculum-plan.md) | A1 design: what it covers and why it's ordered this way |
| [docs/exercise-generation-guide.md](docs/exercise-generation-guide.md) | Spec for authoring lesson content |
| [docs/design-system.md](docs/design-system.md) | Colours, type, components and UI rules; tokens live in `frontend/src/index.css` |

## Research Sources

### Tools & Algorithms
- [FSRS Algorithm & Benchmarks](https://github.com/open-spaced-repetition/fsrs4anki/wiki/abc-of-fsrs)
- [ts-fsrs — TypeScript FSRS Implementation](https://github.com/open-spaced-repetition/ts-fsrs)

### Curriculum & CEFR
- [CEFR Italian Levels — Europass](https://www.europassitalian.com/blog/cefr-levels/)
- [Italian A1 Grammar Study Plan — EasItalian](https://www.easitalian.com/italian-a1-beginner-grammar-study-plan/)
- [Online Italian Club — Grammar by Level](https://onlineitalianclub.com/index-of-free-italian-exercises-and-grammar-lessons/)
- [Wellesley College Italian Studies](https://catalog.wellesley.edu/courses.php?pos=47&doc_type=itas+-+italian+studies+courses)
- [Wellesley Italian on edX](https://www.edx.org/certificates/professional-certificate/wellesleyx-italian-language-and-culture-beginner-to-advanced)
- De Mauro, T. — *Nuovo Vocabolario di Base della Lingua Italiana* (2016)

### Language Acquisition Research
- Cepeda et al. (2008) — Spacing effects in learning: a meta-analysis
- Norris & Ortega (2000) — Effectiveness of L2 instruction (meta-analysis: explicit > implicit, d=1.13 vs d=0.54)
- Roediger & Karpicke (2006) — The testing effect: retrieval practice > re-study
- Laufer & Girsai (2008) — Contrastive analysis (L1↔L2 comparison) improves vocabulary retention
- Nation (2006) — 98% comprehension threshold for incidental vocabulary acquisition
- Li (2010) — Corrective feedback meta-analysis (immediate + explicit is most effective)
- Baddeley, Gathercole & Papagno (1998) — Phonological memory predicts L2 vocabulary acquisition
- Loewen et al. (2019) — Duolingo users: improved grammar/reading, no oral proficiency gains
- Joe (1998) — Words in context + generative use > words in isolation
- Webb (2007) — Sentences > isolation for collocations and grammatical knowledge
- [Sentence Mining Guide — Migaku](https://migaku.com/blog/language-fun/sentence-mining-guide-learn-vocabulary-faster)
- [Duolingo Effectiveness Research](https://www.duolingo.com/efficacy/studies)
- [Comprehensible Input Critique — Frontiers in Psychology 2025](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1636777/full)
