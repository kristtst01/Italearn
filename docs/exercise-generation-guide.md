# Exercise Generation Guide

How to use AI to generate lesson exercises for ItaLearn. This document is the source of truth for any AI agent creating exercise content.

## Golden Rules

1. **Every Italian sentence must be natural.** No textbook-only constructions. If a native speaker wouldn't say it in conversation, don't use it.
2. **Vocabulary must follow frequency order.** Use De Mauro's *Vocabolario di Base* (fondamentale → alto uso → alta disponibilità). Don't introduce rare words before common ones.
3. **98% comprehension rule.** Every exercise sentence should use ≤1 unknown word. All other words must have been introduced in earlier lessons/units.
4. **Context always.** Words are never taught in isolation. Every vocabulary item has an example sentence. Every exercise has `sentence_context`.
5. **Mix exercise types.** Each lesson should use at least 3 different subtypes. Start with recognition (multiple_choice), build to production (type_answer, fill_blank, arrange_words).
6. **Interleave prior material.** At least 20-30% of exercises in each lesson should recycle vocabulary from earlier lessons/units.
7. **Match the exercise mix to the level.** Mechanical exercises (fill_blank, cloze) build accuracy and dominate early. Production exercises (type_answer, arrange_words) and especially open-ended `free_form` dominate later — a B2 learner is assessed on output, not gap-filling. See the per-level distribution table.

## Reference Sources

Use these as authoritative sources for vocabulary, grammar, and example sentences. They are open/freely available and well-established in Italian linguistics.

### Vocabulary
- **De Mauro's Vocabolario di Base** — The gold standard Italian frequency list. ~7,000 words in three tiers: fondamentale (~2,000 words, 86% text coverage), alto uso (~2,750), alta disponibilità (~2,300). Our curriculum targets are mapped to this.
- **Italian frequency lists from OpenSubtitles** — Corpus-derived word frequency from subtitles (conversational Italian). Available on Wiktionary and hermitdave/FrequencyWords on GitHub. Good cross-reference for spoken frequency vs written.
- **CILS/CELI exam word lists** — The official Italian certification exams (Università di Siena / Università di Perugia) publish vocabulary expectations per CEFR level. Use these to verify our per-level targets.

### Grammar
- **Italian Grammar in Practice** (Susanna Nocchi, Alma Edizioni) — Standard reference for exercise patterns at each level. Good model for fill_blank and cloze exercise design.
- **Grammatica italiana di base** (Pietro Trifone & Massimo Palermo) — Clear descriptions of grammar points for each CEFR level.
- **CEFR Can-Do Statements for Italian** — The Council of Europe's reference descriptors. Use these to verify what a learner should be able to do at each level (e.g., A1: "Can introduce themselves and ask/answer simple personal questions").

### Sentence Sources
- **Tatoeba** (tatoeba.org) — CC-licensed Italian↔English sentence pairs. Large corpus of natural sentences. Use for inspiration and to verify naturalness, but always adapt to our context.
- **Italian Wikipedia Simple** — For reading passage source material at higher levels.
- **OpenSubtitles parallel corpus** — Real conversational Italian from movie/TV subtitles. Good for natural phrasing and colloquial usage.

## File Structure

Each lesson is a separate JSON file:
```
frontend/src/data/units/
  unit-01/
    unit-01-lesson-01.json
    unit-01-lesson-02.json
    ...
  unit-02/
    unit-02-lesson-01.json
    ...
```

The unit directory must be created. Lessons are imported individually in `frontend/src/data/curriculum.ts`.

## Lesson JSON Schema

```jsonc
{
  "id": "unit-02-lesson-01",           // {unit_id}-lesson-{NN}
  "unit_id": "unit-02",
  "name": "Who Am I?",                 // Short, thematic lesson name
  "order": 1,                          // Position within the unit (1-indexed)
  "grammar_tips": [                    // 2-3 short explanations shown before exercises
    "Subject pronouns in Italian: io (I), tu (you informal), lui/lei (he/she), Lei (you formal), noi (we), voi (you all), loro (they).",
    "Unlike English, Italian often drops the subject pronoun because the verb ending tells you who's speaking: 'Sono italiano' = 'I am Italian'."
  ],
  "kind": "standard",                  // OPTIONAL — "standard" (default) | "writing" | "listening" | "reading"
  "passages": [                        // OPTIONAL — only for listening/reading comprehension lessons
    {
      "id": "passage-01",
      "format": "audio",               // "audio" | "text"
      "style": "dialogue",             // audio only: "monologue" | "dialogue"
      "audio_url": "/audio/unit-22/lesson-04/passage-01.mp3",  // format: audio
      "text": "...",                   // format: text (reading comprehension)
      "transcript": "...",             // audio only — revealed after the learner answers
      "speakers": ["Marco", "Giulia"]  // audio only
    }
  ],
  "exercises": [ /* ... see below ... */ ],
  "vocabulary": [                      // New words introduced in this lesson
    {
      "word": "sono",
      "meaning": "I am / they are",
      "example": "Sono italiano."
    }
  ]
}
```

Most lessons omit `kind` and `passages` entirely (a plain `standard` lesson). They're only used for comprehension lessons — see [Comprehension Lessons](#comprehension-lessons-listening--reading).

## Exercise JSON Schema

Every exercise has the same shape regardless of subtype:

```jsonc
{
  "id": "unit-02-lesson-01-ex-01",     // {lesson_id}-ex-{NN}
  "type": "vocab",                     // vocab | writing | speaking | listening
  "subtype": "multiple_choice",        // See subtypes below
  "prompt": {
    "text": "What does 'sono' mean in 'Io sono italiano'?"
  },
  "sentence_context": "Io sono italiano.",   // Full Italian sentence for context
  "correct_answer": "I am",            // String or string[] (arrange_words uses array)
  "distractors": [                     // For multiple_choice: 3 wrong options
    "I have",                          // For arrange_words: extra distractor words
    "You are",                         // Empty [] for type_answer, fill_blank, cloze
    "They go"
  ],
  "hints": [                           // Optional hints shown to the user
    "The verb 'essere' conjugates irregularly."
  ],
  "target_words": ["sono"],            // Words this exercise teaches (for SRS card creation)
  "passage_ref": "passage-01"          // OPTIONAL — in comprehension lessons, the passage this question tests
}
```

## Exercise Subtypes — How to Write Each

### `multiple_choice` (type: `vocab`)
Recognition exercise. User picks one of four options.

- `correct_answer`: single string — the correct option
- `distractors`: exactly 3 strings — plausible wrong answers
- **Distractor quality matters.** Distractors should be the same category as the answer (all greetings, all verbs, all nouns). Never mix categories. A learner should need to *know* the answer, not just eliminate absurd options.
- Good for: new vocabulary introduction, meaning recognition, context-appropriate selection

```json
{
  "type": "vocab",
  "subtype": "multiple_choice",
  "prompt": { "text": "What does 'mi chiamo' mean?" },
  "sentence_context": "Ciao, mi chiamo Marco.",
  "correct_answer": "My name is",
  "distractors": ["I live in", "I come from", "I work at"],
  "hints": ["Literally: 'I call myself'"],
  "target_words": ["mi chiamo"]
}
```

### `type_answer` (type: `vocab`)
Production exercise. User types a translation.

- `correct_answer`: the expected typed answer (string)
- `distractors`: `[]` (not used)
- Prompt asks for a translation in one direction (EN→IT or IT→EN)
- Keep answers short (1-3 words) to reduce frustration. Save full sentences for arrange_words.
- The validation engine handles: case-insensitive matching, accent tolerance (accepts without accent + shows reminder), typo tolerance (Levenshtein), trailing punctuation stripping.

```json
{
  "type": "vocab",
  "subtype": "type_answer",
  "prompt": { "text": "How do you say 'I am' in Italian?" },
  "sentence_context": "Io sono italiano.",
  "correct_answer": "sono",
  "distractors": [],
  "hints": ["It's the 'io' form of 'essere'."],
  "target_words": ["sono"]
}
```

### `arrange_words` (type: `writing`)
User arranges word chips into the correct Italian sentence.

- `correct_answer`: **array of strings** — the words in correct order
- `distractors`: 1-2 extra distractor words that don't belong in the answer
- The prompt gives the English sentence to translate
- Keep sentences short (3-6 words). The component shuffles the word chips.

```json
{
  "type": "writing",
  "subtype": "arrange_words",
  "prompt": { "text": "Arrange the words to say: 'I am Italian.'" },
  "sentence_context": "Io sono italiano.",
  "correct_answer": ["Io", "sono", "italiano."],
  "distractors": ["ha", "sei"],
  "hints": ["Subject first, then the verb."],
  "target_words": ["sono"]
}
```

### `fill_blank` (type: `writing`)
An Italian sentence with `___` replacing a grammar target (conjugation, article, preposition). User types the missing word.

- `sentence_context`: the sentence with `___` where the blank is. **Must contain exactly one `___`.**
- `correct_answer`: the missing word (string)
- `distractors`: `[]` (not used)
- `prompt.text`: optional instruction (e.g., "Fill in the correct form of 'essere'")
- Best for: verb conjugation, article selection, preposition choice, agreement

```json
{
  "type": "writing",
  "subtype": "fill_blank",
  "prompt": { "text": "Fill in the correct form of 'essere'." },
  "sentence_context": "Io ___ italiano.",
  "correct_answer": "sono",
  "distractors": [],
  "hints": ["What is the 'io' form?"],
  "target_words": ["sono"]
}
```

### `cloze` (type: `vocab`)
A sentence with one vocabulary word blanked out. English hint is shown so the user knows which word to type. Tests vocabulary recall in context.

- `sentence_context`: the sentence with `___` where the missing word is. **Must contain exactly one `___`.**
- `correct_answer`: the missing Italian word (string)
- `distractors`: `[]` (not used)
- `hints[0]`: **the English translation of the full sentence** — this is how the user knows what word to fill in
- Best for: vocabulary recall, word-in-context usage

```json
{
  "type": "vocab",
  "subtype": "cloze",
  "prompt": { "text": "Complete the sentence with the missing word." },
  "sentence_context": "Io ___ Marco.",
  "correct_answer": "sono",
  "distractors": [],
  "hints": ["I am Marco."],
  "target_words": ["sono"]
}
```

### `free_form` (type: `writing`)
Open-ended written production. The user writes a free response — a sentence up to a short paragraph. Graded by the cloud LLM (`gradeFreeResponse`), not by exact match.

- `correct_answer`: a **model answer** — what a good response looks like. Used as a grading reference, not an exact target.
- `distractors`: `[]` (not used)
- `prompt.text`: the task ("Introduce yourself in Italian. Include your name, where you're from, and your age.")
- `hints`: optional scaffolding ("Use mi chiamo, sono di, and ho ... anni.")
- Best for: written capstones, comprehension questions that need explanation, anything with no single right answer.
- Used in writing lessons and, increasingly, at A2+ — see the per-level distribution table.

```json
{
  "type": "writing",
  "subtype": "free_form",
  "prompt": { "text": "Introduce yourself in Italian. Include your name, where you're from, and your age." },
  "sentence_context": "",
  "correct_answer": "Ciao! Mi chiamo Marco. Sono di Roma. Ho venti anni.",
  "distractors": [],
  "hints": ["Use mi chiamo, sono di, and ho ... anni."],
  "target_words": ["mi chiamo", "sono", "di", "ho", "anni"]
}
```

### `match_pairs` (type: `vocab`)
User matches Italian words with their English meanings.

- `correct_answer`: **array of strings**, each `"italiano|english"` — the correct pairings
- `distractors`: `[]` (not used)
- Needs at least 3 pairs.
- Best for: vocabulary consolidation and review. The review runner builds these automatically from due cards.

```json
{
  "type": "vocab",
  "subtype": "match_pairs",
  "prompt": { "text": "Match the Italian words with their English meanings." },
  "sentence_context": "",
  "correct_answer": ["cane|dog", "gatto|cat", "casa|house"],
  "distractors": [],
  "hints": [],
  "target_words": ["cane", "gatto", "casa"]
}
```

### `read_aloud` (type: `speaking`)
User reads an Italian sentence aloud; speech is captured and checked against the expected text via backend transcription.

- `sentence_context`: the sentence to read
- `correct_answer`: the same sentence (the expected spoken text)
- `distractors`: `[]` (not used)
- Best for: pronunciation practice.
- Requires the speaking infrastructure (mic capture + transcription).

```json
{
  "type": "speaking",
  "subtype": "read_aloud",
  "prompt": { "text": "Read this sentence aloud." },
  "sentence_context": "Mi chiamo Marco e sono di Roma.",
  "correct_answer": "Mi chiamo Marco e sono di Roma.",
  "distractors": [],
  "hints": [],
  "target_words": ["mi chiamo", "sono"]
}
```

## Comprehension Lessons (Listening & Reading)

Listening and reading comprehension are **lesson kinds**, not single exercises. A comprehension lesson holds one or more *passages* plus a set of questions about them — the same way a writing lesson is just a lesson of `free_form` exercises.

- Set the lesson `kind` to `"listening"` or `"reading"`.
- Add a `passages` array (see the Lesson JSON Schema). A lesson may have several passages — e.g. one monologue and one dialogue, each with its own questions.
- Each question exercise carries a `passage_ref` pointing at the passage it tests.
- Questions **reuse ordinary subtypes** — `multiple_choice`, `type_answer`, and `free_form`. There is no dedicated "comprehension" exercise subtype.
- The transcript (audio) or full text (reading) is revealed after the learner answers.

### Listening passages
- `format: "audio"`, with `style: "monologue"` (one speaker reading/narrating) or `style: "dialogue"` (two or more speakers in conversation).
- Audio is **pre-generated at authoring time**, never at runtime. Use ElevenLabs — Text to Speech for monologues, Text to Dialogue (v3, multi-speaker) for dialogues. Store the result as a static asset and reference it by `audio_url`.
- Keep each dialogue script under ~2,000 characters per generation request.
- Always store the `transcript` in the lesson JSON.

### Reading passages
- `format: "text"`, with the passage in the `text` field. No audio.

### Question mix in comprehension lessons
- **A2:** mostly `multiple_choice` and short `type_answer` — "did you catch the key fact?"
- **B1/B2:** increasingly `free_form` — "explain", "summarize", "what did the speaker mean?" — AI-graded. A B2 listening lesson is mostly free-form questions.

## Lesson Design Patterns

### Exercise Count
- **15 exercises per lesson** as the standard target for grammar-core and situational lessons (~10 minute session at ~30-40s per exercise).
- This gives enough room for the full introduce → drill → produce → review cycle.
- Comprehension and writing lessons run shorter — a comprehension lesson is typically 1-2 passages with 4-6 questions each; a writing lesson is 2-4 `free_form` tasks. `free_form` exercises take longer per item, so the count is lower.

### Exercise Ordering Within a Lesson
Follow this progression for each new concept:

1. **Introduce** (2-3 exercises): `multiple_choice` — low-stakes recognition
2. **Reinforce** (2-3 exercises): more `multiple_choice` with variations, `cloze` for context
3. **Produce** (4-5 exercises): `type_answer`, `fill_blank` — active recall
4. **Combine** (2-3 exercises): `arrange_words` — full sentence production
5. **Review** (2-3 exercises): mix of types, recycling earlier vocabulary from previous lessons

### Exercise Type Distribution — shifts by level

The right mix changes as the learner advances. Mechanical exercises (`fill_blank`, `cloze`) build accuracy and are valuable early, but a B2 learner needs *production*, not gap-filling. As levels rise, shift toward `type_answer`, `arrange_words`, and especially `free_form`.

| Subtype | A1 | A2 | B1 | B2 |
|---|---|---|---|---|
| multiple_choice | ~25% | ~20% | ~10% | ~5% |
| fill_blank | ~20% | ~20% | ~15% | ~10% |
| cloze | ~20% | ~15% | ~15% | ~10% |
| type_answer | ~20% | ~20% | ~20% | ~15% |
| arrange_words | ~15% | ~15% | ~15% | ~10% |
| free_form | — | ~10% | ~25% | ~50% |

This guidance applies to **grammar-core and situational lessons**. Comprehension lessons (passages + questions) and writing lessons (`free_form`) are their own kinds and don't follow this table. `match_pairs` and `read_aloud` are added where a lesson calls for them.

### Vocabulary Per Lesson
- Introduce **4-6 new words** per lesson
- Total per unit (5 lessons): **20-30 new words**
- The `vocabulary` array in the lesson JSON should contain only words *first introduced* in that lesson

## Language of Instruction

Core principle: **the practice immerses, the explanation stays clear.** As the learner advances, the Italian *content* of lessons grows until lessons read as effectively all-Italian — but anything whose job is to *explain* stays in English, so the language barrier never obscures understanding.

| Element | Language |
|---|---|
| `sentence_context`, vocabulary, the Italian being practiced | Always Italian |
| `prompt.text` — the task/question | Gradient: English (A1) → mostly Italian (B2). See per-level guidance below. |
| Comprehension questions | Follow the prompt gradient — Italian by B2 |
| `grammar_tips` | **English always** (optionally bilingual English + Italian) |
| `hints` that explain a rule | English, or bilingual |
| App UI chrome ("Check", "Continue", screens) | English always — never affected by level |

The test for any piece of text: **is this the task, or is it teaching?** Teaching/explanation → English. The task itself → gradient toward Italian. A B2 lesson has Italian prompts and Italian questions, but its grammar tips are still in English.

## CEFR Level Guidelines

Unit counts and the per-level structure are defined in [development-plan.md](development-plan.md) (≈114 units total: A1≈20, A2≈28, B1≈32, B2≈34). Each level is built from three bands — grammar-core, situational, and extended-skills (comprehension + writing) lessons.

### A1 (≈20 units) — Survival Italian
- **Sentences:** 3-6 words. Simple SVO structure. Present tense only.
- **Topics:** greetings, introductions, numbers, family, basic descriptions, food, directions
- **Grammar:** essere/avere, regular -are/-ere/-ire verbs, articles, adjectives, possessives, reflexives, simple prepositions, modals
- **Prompts:** Always in English. Hints in English.
- **Exercise focus:** Heavy on multiple_choice (recognition). Typed answers are 1-2 words. No `free_form` except the written capstone lessons.

### A2 (≈28 units) — Everyday Situations
- **Sentences:** 5-10 words. Past tense, future, conditional.
- **Topics:** past events, travel, shopping, health, plans, opinions
- **Grammar:** passato prossimo, imperfetto (+ the contrast), futuro semplice, condizionale, object pronouns + ne/ci, imperative, comparatives
- **Prompts:** English, but can include familiar Italian phrases in quotes
- **Exercise focus:** More production. type_answer and fill_blank increase, `free_form` starts (~10%). Listening comprehension lessons begin here.

### B1 (≈32 units) — Independent Communication
- **Sentences:** 8-15 words. Complex tenses, subjunctive, relative clauses.
- **Topics:** storytelling, opinions, hypotheticals, formal situations
- **Grammar:** imperfetto vs passato prossimo, trapassato, congiuntivo presente/passato, periodo ipotetico (1-2), relative clauses, passive
- **Prompts:** Can start including Italian in prompts. Hints can be Italian.
- **Exercise focus:** Heavy production. Fewer multiple_choice. `free_form` ~25%. Reading and listening comprehension lessons are a regular presence.

### B2 (≈34 units) — Fluent Discussion
- **Sentences:** 10-20 words. All tenses, nuanced register, idioms.
- **Topics:** abstract discussion, formal register, literature, current events
- **Grammar:** congiuntivo imperfetto/trapassato, periodo ipotetico (3), passato remoto, indirect speech, subjunctive-triggering connectives
- **Prompts:** Primarily in Italian. English only for new/complex concepts.
- **Exercise focus:** Primarily `free_form` (~50%). Multiple_choice only for nuanced distinctions. Comprehension and writing lessons dominate the extended-skills band.

## Quality Checklist

Run through this for every generated lesson before committing:

- [ ] Every `sentence_context` is natural Italian (not word-for-word translated from English)
- [ ] Every exercise has a valid `sentence_context` (never empty)
- [ ] `fill_blank` and `cloze` exercises have exactly one `___` in `sentence_context`
- [ ] `arrange_words` and `match_pairs` have `correct_answer` as an array; others have it as a string
- [ ] `multiple_choice` has exactly 3 distractors of the same category as the answer
- [ ] `type_answer`, `fill_blank`, `cloze`, `free_form`, `match_pairs`, `read_aloud` have `distractors: []`
- [ ] `free_form` has a model answer in `correct_answer`
- [ ] `match_pairs` `correct_answer` is an array of `"italiano|english"` strings, at least 3 pairs
- [ ] Comprehension lessons: `kind` is set, `passages` is present, every question has a valid `passage_ref`
- [ ] Audio passages reference a pre-generated `audio_url` and include a `transcript`
- [ ] The exercise mix matches the level (more `free_form` at B1/B2, less `fill_blank`/`cloze`)
- [ ] IDs follow the pattern: `{unit_id}-lesson-{NN}-ex-{NN}`
- [ ] No word is used that hasn't been introduced in this lesson or an earlier one
- [ ] The `vocabulary` array only contains words *new* to this lesson
- [ ] Each vocabulary entry has `word`, `meaning`, and `example`
- [ ] `target_words` correctly references the vocabulary being tested
- [ ] Grammar tips are 1-2 sentences each, max 3 per lesson
- [ ] Accented characters are correct (è, é, à, ù, ò, ì) — never missing
- [ ] No duplicate exercise IDs within or across lessons

## Workflow for AI Agents

When asked to generate exercises for a unit:

1. **Read the curriculum** — Check `frontend/src/data/curriculum.ts` for the unit's `grammar_focus`, `vocabulary_targets`, and position in the curriculum.
2. **Check what came before** — Read previous unit lesson files to know what vocabulary/grammar is already introduced.
3. **Plan the unit** — Decide on 5 lesson themes that cover the unit's grammar and vocabulary targets.
4. **Generate one lesson at a time** — Follow the lesson JSON schema exactly. Use the exercise ordering pattern above.
5. **Validate** — Run the quality checklist. Run `npx tsc -b --noEmit` to verify the JSON is valid.
6. **Register in curriculum.ts** — Add imports for each lesson file and add them to the unit's `lessons` array.

### Prompt Template for Exercise Generation

When generating exercises, include this context in your prompt:
- The unit's grammar focus and vocabulary targets (from curriculum.ts)
- The lesson's theme and position within the unit
- All vocabulary already introduced in previous units/lessons
- The exercise type distribution targets
- 2-3 examples of each exercise subtype from existing lessons (read from unit-01)
