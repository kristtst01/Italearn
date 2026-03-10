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

The top 300 words alone cover ~65% of all Italian text. We front-load these heavily, then expand by CEFR level:
- **A1**: ~500 word families (survival Italian, ~75% text coverage)
- **A2**: ~1,200 word families (everyday situations, ~85% coverage)
- **B1**: ~2,500 word families (independent communication, ~90% coverage)
- **B2**: ~4,000 word families (fluent discussion on abstract topics, ~95% coverage)

A "word family" includes the headword plus inflected/derived forms (e.g., "parlare" includes parlo, parli, parla, parliamo, parlate, parlano, parlato, parlando).

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
- See a phrase, say it aloud — scored via Web Speech API
- Read-aloud exercises (full sentences)
- Listen and repeat
- Respond to a spoken prompt verbally

### 4. Listening (Comprehension)
- Hear Italian (browser TTS), select the correct translation
- Dictation — hear a sentence, type what you heard in Italian
- Hear a question, pick the correct Italian answer
- Minimal pairs — distinguish similar-sounding words

## CEFR-Aligned Path Structure

The curriculum is organized into 10 sections spanning A1→B2, following standard CEFR grammar progression and university Italian course sequencing.

```
═══════════════════════════════════════════════════════
  A1 — FOUNDATIONS (Sections 1–3)
═══════════════════════════════════════════════════════

Section 1: First Steps
  ├── Unit 1: Alphabet, Pronunciation & Greetings
  │     Grammar: Italian sounds, double consonants, stress patterns
  │     Vocab: ciao, buongiorno, come stai, grazie, per favore
  ├── Unit 2: Introductions & Essere
  │     Grammar: present tense of essere, subject pronouns (io, tu, lui/lei...)
  │     Vocab: mi chiamo, sono, di dove sei, nazionalità
  ├── Unit 3: Numbers, Age & Avere
  │     Grammar: present tense of avere, indefinite articles (un, uno, una)
  │     Vocab: numbers 0–100, quanti anni hai, ho fame/sete/freddo
  └── Checkpoint 1

Section 2: Everyday Basics
  ├── Unit 4: Articles, Gender & Noun Agreement
  │     Grammar: definite articles (il, lo, la, i, gli, le), gender/number of nouns
  │     Vocab: common objects, classroom, house
  ├── Unit 5: Descriptions & Adjectives
  │     Grammar: adjective agreement (-o/-a/-i/-e), position of adjectives
  │     Vocab: colors, size, personality, appearance
  ├── Unit 6: Family & Possessives
  │     Grammar: possessive adjectives (mio, tuo, suo...), family + articles
  │     Vocab: madre, padre, fratello, sorella, family relationships
  ├── Unit 7: Regular Verbs (-are, -ere, -ire)
  │     Grammar: present tense conjugation of all three verb classes
  │     Vocab: parlare, mangiare, scrivere, leggere, dormire, partire
  └── Checkpoint 2

Section 3: Daily Life
  ├── Unit 8: Daily Routines & Reflexive Verbs
  │     Grammar: reflexive verbs (svegliarsi, lavarsi, vestirsi), reflexive pronouns
  │     Vocab: routine actions, times of day
  ├── Unit 9: Prepositions & Places
  │     Grammar: simple prepositions (di, a, da, in, con, su, per, tra/fra)
  │     Grammar: articulated prepositions (al, nel, sul, dal...)
  │     Vocab: places in a city, directions
  ├── Unit 10: Food, Drink & Ordering
  │     Grammar: partitive articles, vorrei (conditional courtesy), modal verbs intro (volere, potere, dovere)
  │     Vocab: food, drink, restaurant phrases, il conto per favore
  └── Checkpoint 3 (A1 Complete)

═══════════════════════════════════════════════════════
  A2 — ELEMENTARY (Sections 4–6)
═══════════════════════════════════════════════════════

Section 4: Talking About the Past
  ├── Unit 11: Passato Prossimo with Avere
  │     Grammar: passato prossimo formation, regular past participles (-ato, -uto, -ito)
  │     Vocab: ieri, la settimana scorsa, time expressions for past
  ├── Unit 12: Passato Prossimo with Essere
  │     Grammar: verbs that take essere, past participle agreement
  │     Vocab: andare, venire, partire, nascere, common essere verbs
  ├── Unit 13: Irregular Past Participles
  │     Grammar: fatto, detto, visto, scritto, letto, preso, stato...
  │     Vocab: common irregular verbs in context
  ├── Unit 14: Direct Object Pronouns
  │     Grammar: lo, la, li, le + position with verbs, agreement in passato prossimo
  │     Vocab: review vocabulary with pronoun substitution
  └── Checkpoint 4

Section 5: Expanding Expression
  ├── Unit 15: Indirect Object Pronouns & Piacere
  │     Grammar: mi, ti, gli, le, ci, vi, gli; the piacere construction
  │     Vocab: hobbies, preferences, opinions
  ├── Unit 16: Imperative & Giving Directions
  │     Grammar: imperative (tu, Lei, noi, voi forms), negative imperative
  │     Vocab: directions, instructions, recipes
  ├── Unit 17: Comparatives & Superlatives
  │     Grammar: più...di/che, meno...di/che, il più, irregular forms (migliore, peggiore)
  │     Vocab: describing and comparing things
  ├── Unit 18: Present Progressive & Stare
  │     Grammar: stare + gerundio, stare per + infinitive
  │     Vocab: actions in progress, immediate future
  └── Checkpoint 5

Section 6: The Future
  ├── Unit 19: Future Simple Tense
  │     Grammar: futuro semplice (regular and irregular), future of probability
  │     Vocab: plans, predictions, weather
  ├── Unit 20: Conditional Present
  │     Grammar: condizionale presente, polite requests, hypothetical desires
  │     Vocab: vorrei, potrei, dovrei — polite/hypothetical situations
  ├── Unit 21: Adverbs & Connectors
  │     Grammar: formation of adverbs (-mente), position, common connectors
  │     Vocab: linking words (però, quindi, inoltre, comunque, infatti)
  └── Checkpoint 6 (A2 Complete)

═══════════════════════════════════════════════════════
  B1 — INTERMEDIATE (Sections 7–8)
═══════════════════════════════════════════════════════

Section 7: Narration & Complex Past
  ├── Unit 22: Imperfetto
  │     Grammar: imperfect tense formation, usage (habits, descriptions, ongoing past)
  │     Vocab: da bambino, di solito, mentre, ogni giorno
  ├── Unit 23: Imperfetto vs Passato Prossimo
  │     Grammar: choosing between the two past tenses, narrative structure
  │     Vocab: storytelling vocabulary, time connectors
  ├── Unit 24: Trapassato Prossimo
  │     Grammar: past perfect (aveva fatto, era andato), sequencing past events
  │     Vocab: narrative sequences, già, ancora, prima di
  ├── Unit 25: Combined Pronouns
  │     Grammar: me lo, te la, glielo, ce li... pronoun stacking
  │     Vocab: giving/sending/telling things to people
  ├── Unit 26: Relative Pronouns
  │     Grammar: che, cui, il quale/la quale, chi, ciò che
  │     Vocab: complex sentence construction
  └── Checkpoint 7

Section 8: Subjunctive & Hypotheticals
  ├── Unit 27: Present Subjunctive
  │     Grammar: congiuntivo presente formation, triggers (penso che, credo che, è importante che)
  │     Vocab: opinions, emotions, doubts, desires
  ├── Unit 28: Subjunctive Past & Imperfect
  │     Grammar: congiuntivo passato, congiuntivo imperfetto
  │     Vocab: expressing past doubts, wishes about the past
  ├── Unit 29: Conditional Sentences (If Clauses)
  │     Grammar: periodo ipotetico (Type 1, 2, 3), se + subjunctive + conditional
  │     Vocab: hypothetical situations, regrets, possibilities
  ├── Unit 30: Passive Voice & Si Impersonale
  │     Grammar: passive with essere/venire, si passivante, si impersonale
  │     Vocab: formal/written Italian, news language
  └── Checkpoint 8 (B1 Complete)

═══════════════════════════════════════════════════════
  B2 — UPPER INTERMEDIATE (Sections 9–10)
═══════════════════════════════════════════════════════

Section 9: Refinement
  ├── Unit 31: Passato Remoto
  │     Grammar: remote past tense, regular and irregular forms
  │     Vocab: historical narration, literature, fairy tales
  ├── Unit 32: Indirect Speech
  │     Grammar: discorso indiretto, tense shifting, reporting verbs
  │     Vocab: ha detto che, mi ha chiesto se, comunicare
  ├── Unit 33: Gerund, Infinitive & Participle Constructions
  │     Grammar: pur + gerundio, prima di + infinitive, implicit clauses
  │     Vocab: formal writing structures
  ├── Unit 34: Advanced Pronouns & Ne/Ci
  │     Grammar: pronominal verbs (farcela, andarsene, cavarsela), ne vs ci in depth
  │     Vocab: idiomatic pronoun usage
  └── Checkpoint 9

Section 10: Fluency
  ├── Unit 35: Conjunctions & Complex Sentences
  │     Grammar: affinché, nonostante, a meno che, purché + subjunctive
  │     Vocab: advanced connectors, argumentative language
  ├── Unit 36: Register & Formal Italian
  │     Grammar: Lei vs tu revisited, formal letter conventions, congiuntivo in formal speech
  │     Vocab: formal expressions, business Italian basics
  ├── Unit 37: Idiomatic Expressions & Proverbs
  │     Grammar: figurative language, collocations, false friends (EN↔IT)
  │     Vocab: common idioms (in bocca al lupo, non vedo l'ora, prendere in giro...)
  ├── Unit 38: Reading & Listening Consolidation
  │     Longer reading passages, dictation of connected text, review of all grammar
  └── Final Checkpoint (B2 Complete)
```

Each unit contains 5–8 lessons. Each lesson has ~10–15 exercises mixing all four skill types.
Units unlock linearly. Checkpoints gate progression to the next section.
"Test out" option to skip units you already know.

## Gamification

- **XP** earned per exercise (bonus for streaks of correct answers within a lesson)
- **Daily streak** tracking with calendar view
- **Mastery percentage** per unit — driven by SRS, mastery decays if you don't review
- **Level / rank** based on total XP
- **Checkpoint badges** for completing sections
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

- **Vite + React + TypeScript** — fast dev, simple tooling
- **Tailwind CSS** — utility-first styling
- **Local-first storage** — IndexedDB (via Dexie.js or idb) for all SRS state and progress
- **FSRS** — ts-fsrs library for spaced repetition scheduling
- **Web Speech API** — speech recognition for speaking exercises
- **Browser SpeechSynthesis** — TTS for listening exercises (free, decent Italian voices)
- **Audio on everything** — every Italian word and sentence has TTS audio (phonological memory is a top predictor of L2 vocabulary acquisition — Baddeley et al. 1998)
- **No backend initially** — everything runs in the browser, zero hosting cost

## Data Model (High Level)

```
Curriculum
  └── Section[]
        ├── name, description, order, cefr_level (A1/A2/B1/B2)
        └── Unit[]
              ├── name, grammar_focus, vocabulary_targets[]
              ├── grammar_notes: string (short explanation)
              └── Lesson[]
                    ├── exercises: Exercise[]
                    └── grammar_tips: string[]

Exercise
  ├── type: vocab | writing | speaking | listening
  ├── subtype: multiple_choice | type_answer | arrange_words | fill_blank
  │            | dictation | read_aloud | listen_and_choose | cloze | minimal_pair
  ├── prompt: { text?: string, audio?: boolean }
  ├── sentence_context: string (the full Italian sentence for context)
  ├── correct_answer: string | string[]
  ├── distractors: string[] (for multiple choice)
  ├── hints: string[]
  └── target_words: string[] (which vocabulary items this exercise drills)

UserProgress
  ├── current_section, current_unit, current_lesson
  ├── xp, streak, level
  ├── lessons_completed: Set<lesson_id>
  ├── checkpoints_passed: Set<section_id>
  └── SRSCard[] (per word/phrase, per skill)
        ├── word_id, skill_type
        ├── fsrs_state: { stability, difficulty, due, last_review }
        └── review_log: ReviewEntry[]
```

## Project Structure

```
italearn/
├── frontend/          # Vite + React + TS app
│   ├── src/
│   │   ├── components/    # UI components (exercises, path, progress)
│   │   ├── data/          # Curriculum JSON files
│   │   ├── engine/        # SRS engine (FSRS), exercise logic, scoring
│   │   ├── hooks/         # React hooks (useSRS, useAudio, useSpeech)
│   │   ├── pages/         # Main views (Home, Path, Lesson, Review)
│   │   ├── stores/        # State management (progress, settings)
│   │   └── types/         # TypeScript types for curriculum & progress
│   └── ...
├── backend/           # Empty for now — future hosting/sync
└── README.md
```

## Future Ideas (Backburner)

- **AI conversation partner** — full voice dialogue with an LLM tutor (Claude API + Whisper + TTS)
- **Richer TTS** — ElevenLabs or similar for more natural listening exercises
- **Mobile PWA** — installable on phone for on-the-go practice
- **Import/export progress** — JSON backup of all learning data
- **Reading mode** — graded Italian texts with tap-to-translate
- **Cloze listening** — hear a sentence with a gap, fill in the missing word

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
