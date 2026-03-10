# Phase 2 — Complete Section 1

**Goal:** Flesh out the full first section (Units 1-3) with two additional exercise types and grammar tips. After this phase, the learner completes all of "First Steps" — greetings, essere, numbers/avere — and hits their first checkpoint.

## What This Delivers

- Units 2 and 3 fully populated with curriculum content
- 2 new exercise types (fill-in-blank, cloze deletion) that add grammar drilling
- Grammar tip cards that appear inline during lessons (the "explicit instruction" part of our approach)
- Checkpoint 1 as a gated review
- Typo tolerance for typed answers

## Learning Principles Addressed

- **Balanced explicit + implicit grammar**: grammar tips give short, clear explanations (2-3 sentences) when a new pattern appears (e.g., "Essere is irregular — here are its forms: sono, sei, è, siamo, siete, sono"). Then exercises immediately drill the pattern.
- **Fill-in-blank and cloze** target specific grammar points (verb conjugation, article selection) — this is the "form-focused instruction" that research shows is more effective than pure implicit exposure.
- **Interleaving**: Lessons in Units 2-3 mix in vocabulary from Unit 1 to reinforce earlier material.
- **Frequency-first**: Unit 2 (essere + pronouns) and Unit 3 (avere + numbers) cover the two most essential Italian verbs — these are in the top 10 of De Mauro's frequency list.

## Technical Deliverables

### 1. Curriculum Content
- `unit-02.json` — Introductions & Essere (~5 lessons)
  - Subject pronouns (io, tu, lui, lei, Lei, noi, voi, loro)
  - Present tense of essere (sono, sei, è, siamo, siete, sono)
  - Nationalities, professions, basic descriptions
  - mi chiamo..., sono di..., di dove sei?
- `unit-03.json` — Numbers, Age & Avere (~5 lessons)
  - Numbers 0-100
  - Present tense of avere (ho, hai, ha, abbiamo, avete, hanno)
  - Indefinite articles (un, uno, una, un')
  - Age (quanti anni hai?), idiomatic expressions (ho fame, ho sete, ho freddo, ho caldo)

### 2. New Exercise Components
- `FillInBlank.tsx` — Italian sentence with a blank (___), user types the missing word. Used for drilling conjugation ("Io ___ italiano" → sono) and articles ("___ ragazzo" → un).
- `ClozeDelete.tsx` — Full Italian sentence with one word replaced by blank, English translation shown. User types the missing Italian word. Differs from fill-in-blank in that it tests vocabulary recall in context rather than grammar forms.

### 3. Grammar Tip Cards (`src/components/GrammarTip.tsx`)
- Shown inline during a lesson when a new grammar pattern is first introduced
- Short card: title, 2-3 sentence explanation, conjugation table or example
- Dismissible, not an exercise — just information
- Data stored in curriculum JSON per lesson (`grammar_tips` array)

### 4. Checkpoint (`src/components/Checkpoint.tsx`)
- A special lesson-like screen that gates progression to Section 2
- Pulls exercises from all Unit 1-3 vocabulary and grammar
- Harder than normal lessons: more production (type answer), fewer multiple choice
- Must score above a threshold (e.g., 80%) to pass
- On fail: shows which areas need review, links back to relevant lessons

### 5. Answer Validation (`src/engine/validation.ts`)
- Fuzzy matching for typed answers: case-insensitive, accent-forgiving (e → è accepted with warning), minor typo tolerance (Levenshtein distance ≤ 1 for words > 4 chars)
- "Almost correct" feedback: "You typed 'buongiornio' — close! The correct spelling is 'buongiorno'"
- Accent teaching: accept without accents but flag it ("Remember: it's perché with an accent!")

## Not In This Phase

- Audio/TTS
- Speaking/listening exercises
- Gamification
- Sections beyond Section 1
