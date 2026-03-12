# Exercise Generation Guide

How to use AI to generate lesson exercises for ItaLearn. This document is the source of truth for any AI agent creating exercise content.

## Golden Rules

1. **Every Italian sentence must be natural.** No textbook-only constructions. If a native speaker wouldn't say it in conversation, don't use it.
2. **Vocabulary must follow frequency order.** Use De Mauro's *Vocabolario di Base* (fondamentale → alto uso → alta disponibilità). Don't introduce rare words before common ones.
3. **98% comprehension rule.** Every exercise sentence should use ≤1 unknown word. All other words must have been introduced in earlier lessons/units.
4. **Context always.** Words are never taught in isolation. Every vocabulary item has an example sentence. Every exercise has `sentence_context`.
5. **Mix exercise types.** Each lesson should use at least 3 different subtypes. Start with recognition (multiple_choice), build to production (type_answer, fill_blank, arrange_words).
6. **Interleave prior material.** At least 20-30% of exercises in each lesson should recycle vocabulary from earlier lessons/units.

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
  "target_words": ["sono"]             // Words this exercise teaches (for SRS card creation)
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

## Lesson Design Patterns

### Exercise Count
- **15 exercises per lesson** as the standard target (~10 minute session at ~30-40s per exercise).
- This gives enough room for the full introduce → drill → produce → review cycle.
- When listening/speaking exercises are added (Phase 3-4), lessons may grow to 17-18 to accommodate the additional skill types.

### Exercise Ordering Within a Lesson
Follow this progression for each new concept:

1. **Introduce** (2-3 exercises): `multiple_choice` — low-stakes recognition
2. **Reinforce** (2-3 exercises): more `multiple_choice` with variations, `cloze` for context
3. **Produce** (4-5 exercises): `type_answer`, `fill_blank` — active recall
4. **Combine** (2-3 exercises): `arrange_words` — full sentence production
5. **Review** (2-3 exercises): mix of types, recycling earlier vocabulary from previous lessons

### Exercise Type Distribution (per lesson of 15)
| Type | Count | Target % | Purpose |
|------|-------|----------|---------|
| multiple_choice | 4 | ~25% | Introduction, recognition |
| type_answer | 3 | ~20% | Translation recall |
| fill_blank | 3 | ~20% | Grammar drilling |
| cloze | 3 | ~20% | Vocabulary in context |
| arrange_words | 2 | ~15% | Sentence construction |

### Vocabulary Per Lesson
- Introduce **4-6 new words** per lesson
- Total per unit (5 lessons): **20-30 new words**
- The `vocabulary` array in the lesson JSON should contain only words *first introduced* in that lesson

## CEFR Level Guidelines

### A1 (Units 1-10) — Survival Italian
- **Sentences:** 3-6 words. Simple SVO structure. Present tense only.
- **Topics:** greetings, introductions, numbers, family, basic descriptions, food, directions
- **Grammar:** essere/avere, regular -are/-ere/-ire verbs, articles, adjectives, possessives, reflexives, simple prepositions
- **Prompts:** Always in English. Hints in English.
- **Exercise focus:** Heavy on multiple_choice (recognition). Typed answers are 1-2 words.

### A2 (Units 11-21) — Everyday Situations
- **Sentences:** 5-10 words. Past tense, future, conditional.
- **Topics:** past events, travel, shopping, health, plans, opinions
- **Grammar:** passato prossimo, future simple, conditional, pronouns, comparatives, imperative
- **Prompts:** English, but can include familiar Italian phrases in quotes
- **Exercise focus:** More production. type_answer and fill_blank increase. Typed answers can be 2-3 words.

### B1 (Units 22-30) — Independent Communication
- **Sentences:** 8-15 words. Complex tenses, subjunctive, relative clauses.
- **Topics:** storytelling, opinions, hypotheticals, formal situations
- **Grammar:** imperfetto vs passato prossimo, trapassato, congiuntivo, periodo ipotetico, passive
- **Prompts:** Can start including Italian in prompts. Hints can be Italian.
- **Exercise focus:** Heavy production. Fewer multiple_choice. More arrange_words with longer sentences.

### B2 (Units 31-38) — Fluent Discussion
- **Sentences:** 10-20 words. All tenses, nuanced register, idioms.
- **Topics:** abstract discussion, formal register, literature, current events
- **Grammar:** passato remoto, indirect speech, advanced pronouns, conjunctions + subjunctive
- **Prompts:** Primarily in Italian. English only for new/complex concepts.
- **Exercise focus:** Primarily production. Multiple_choice used only for nuanced distinctions.

## Quality Checklist

Run through this for every generated lesson before committing:

- [ ] Every `sentence_context` is natural Italian (not word-for-word translated from English)
- [ ] Every exercise has a valid `sentence_context` (never empty)
- [ ] `fill_blank` and `cloze` exercises have exactly one `___` in `sentence_context`
- [ ] `arrange_words` has `correct_answer` as an array, others have it as a string
- [ ] `multiple_choice` has exactly 3 distractors of the same category as the answer
- [ ] `type_answer`, `fill_blank`, `cloze` have `distractors: []`
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
