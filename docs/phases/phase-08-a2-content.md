# Phase 8 — A2 Content & Match Pairs

**Goal:** Expand the curriculum through A2 (Sections 4-6, Units 11-21). The learner moves from survival Italian into everyday conversation — past tense, pronouns, comparatives, future and conditional.

## What This Delivers

- Sections 4-6 fully populated (11 units of content)
- Checkpoints 4, 5, 6
- Match pairs exercise type (timed vocabulary drill)
- Grammar explanations begin mixing in simple Italian at the later A2 units
- ~1,200 cumulative word families

## Learning Principles Addressed

- **L1 transition begins**: per our plan, A2 is still primarily English-based, but toward the end (Units 19-21) grammar notes start including simple Italian alongside English. This follows Macaro (2005) — gradual L2 increase is more effective than sudden switch.
- **Past tense is the #1 stumbling block**: Units 11-14 (passato prossimo) are the most critical grammar milestone for English speakers learning Italian. We dedicate 4 full units to it — essere vs avere auxiliary, regular vs irregular participles, pronoun agreement. This gets more time than Duolingo gives it.
- **Match pairs as speed drill**: timed matching engages a different cognitive mode — it builds automaticity for word-meaning connections, which is important for fluent reading/listening where you can't pause to think.

## Content to Generate

### Section 4: Talking About the Past (Units 11-14)
- Passato prossimo with avere (regular participles)
- Passato prossimo with essere (motion/state verbs, participle agreement)
- Irregular past participles (fatto, detto, visto, scritto, letto, preso, stato, aperto, chiuso, messo, rimasto)
- Direct object pronouns (lo, la, li, le) + their effect on past participle agreement

### Section 5: Expanding Expression (Units 15-18)
- Indirect object pronouns + piacere construction
- Imperative (tu, Lei, noi, voi) + negative imperative (non + infinitive for tu)
- Comparatives and superlatives (più di/che, meno di/che, il più/il meno, migliore/peggiore)
- Present progressive (stare + gerundio) and near future (stare per + infinitive)

### Section 6: The Future (Units 19-21)
- Future simple tense (regular and key irregulars: sarò, avrò, farò, andrò, verrò, potrò, dovrò, vedrò)
- Conditional present (vorrei, potrei, dovrei) + polite requests
- Adverb formation (-mente) and discourse connectors (però, quindi, inoltre, comunque, infatti, invece)

## Technical Deliverables

### 1. Match Pairs Exercise (`src/components/exercises/MatchPairs.tsx`)
- Grid of ~6 Italian words and ~6 English translations, shuffled
- User taps one from each column to match
- Correct matches disappear, timer counts up
- Score based on time and accuracy
- Good for rapid vocabulary review — used in later lessons and review sessions

### 2. L1 Transition Mechanism
- Grammar tips gain an optional `italian_text` field alongside `english_text`
- For A2 late units: show Italian first, English below in smaller text
- Configurable in settings: "Always show English" / "Italian with English fallback" / "Italian only"

### 3. Curriculum JSON Files
- `unit-11.json` through `unit-21.json`
- Checkpoint 4, 5, 6 content
- Each unit ~5-6 lessons, ~10-15 exercises per lesson
- Exercise mix: ~25% multiple choice, ~25% type answer, ~15% fill-in-blank, ~15% cloze, ~10% listening, ~10% match pairs
