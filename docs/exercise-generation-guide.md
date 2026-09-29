# Exercise Generation Guide

How to author lesson content for ItaLearn, by hand or with AI. This document is the source of truth for any agent creating exercise content.

> **Status (2026-09-29):** the app's structure is being redesigned (chapters, whole-system grammar units, grammar in SRS; see [development-plan.md](development-plan.md), Product Shape). The JSON schema and exercise subtypes below describe what is built today. Grammar explanations are moving out of lesson `grammar_tips` into dedicated grammar units.

## Golden Rules

1. **Every Italian sentence must be correct and plausible.** Accurate grammar, and something a person could actually say. Drill sentences don't need to be native-level idiomatic (see the content quality philosophy in the development plan), but they must never be wrong or bizarre.
2. **Vocabulary must follow frequency order.** Use De Mauro's *Vocabolario di Base* (fondamentale → alto uso → alta disponibilità). Don't introduce rare words before common ones.
3. **98% comprehension rule.** Every exercise sentence should use ≤1 unknown word. All other words must have been introduced in earlier lessons/units.
4. **Context always.** Words are never taught in isolation. Every vocabulary item has an example sentence. Every exercise has `sentence_context`.
5. **Mix exercise types.** Move from recognition to production within a lesson, and don't run the same subtype many times in a row.
6. **Interleave prior material.** Every lesson recycles vocabulary and grammar from earlier lessons and units.
7. **Match the exercise mix to the level.** Mechanical exercises (fill_blank, cloze) build accuracy and dominate early. Production exercises (type_answer, translation) and especially open-ended `free_form` dominate later — a B2 learner is assessed on output, not gap-filling. See CEFR Level Guidelines.
8. **Size content to the topic, not to a number.** A lesson covers its topic completely: every word the topic needs, with enough practice that each is genuinely learned. There is no target number of lessons, exercises, or words. The one real count is vocabulary per CEFR level (counted in lemmas).

## Exercise Types: What and Why

Each exercise type trains a specific ability. Choose types for what the learner needs to do with the material, not for variety alone.

| Type | Trains | Use it for | Limits |
|---|---|---|---|
| `multiple_choice` | Recognizing meaning | First exposure to a word or form | Low value after first exposure; answers can be found by elimination |
| `match_pairs` | Recognizing meaning | Quick warm-up and review | Not real learning on its own |
| `type_answer` | Recall of a word or short phrase | Core vocabulary retrieval | Keep answers short; full sentences belong in translation |
| `cloze` | Recall in context | Vocabulary in a sentence | Overlaps with `fill_blank`; use `cloze` for vocabulary, `fill_blank` for grammar |
| `fill_blank` | Producing one grammatical form | Conjugation, articles, agreement, prepositions | One form at a time; pair with transformation for whole systems |
| `arrange_words` | Word order | Early sentence structure | The word bank makes it a puzzle; prefer translation once learners can type sentences |
| `read_aloud` | Pronunciation from text | Pronunciation practice | Reading, not speaking; add listen-and-repeat when audio exists |
| `free_form` | Written production | Writing tasks, open questions | AI-graded; can be long |

**Planned** (not built yet; see development plan, Workstream 0):

| Type | Trains | Why |
|---|---|---|
| Transformation | Controlling a grammar system | "Rewrite with *noi*", "make it plural/negative". Drills the whole paradigm, not one blank. |
| Structured input ("whose is it?") | Noticing form to get meaning | The learner can only answer by attending to the ending, article or pronoun. Effective for features English speakers ignore (VanPatten's processing instruction). |
| Find the mistake | Noticing errors | Targets English interference (*sono fame*, *la mia madre*). |
| Full-sentence translation (EN→IT, typed) | Sentence production | The highest-value production drill; LLM validation makes free translations gradeable. Should replace much of `arrange_words`. |
| Dialogue completion | Using language in an exchange | Write your line in a short dialogue. Fits situational chapters. |
| Dictation | Decoding speech + spelling | Needs the audio pipeline. |
| Minimal pairs | Hearing double consonants and similar sounds | *caro/carro*, *pala/palla*. Needs audio. |
| Listen and repeat | Pronunciation from a model | Better than `read_aloud` for pronunciation. Needs audio. |
| Answer a spoken question | Short spoken production | Bridge to the AI tutor; leniently LLM-graded. |

**Grammar in review:** once grammar units exist, grammar items (transformation, fill_blank, find the mistake, translation) are scheduled in SRS like words. Today only vocabulary is reviewed.

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

Lesson files are discovered automatically (`import.meta.glob` in `data/lessonLoader.ts`). To make a lesson appear, add its `LessonMeta` (`id`, `unit_id`, `name`, `order`) to the unit's `lessons` array in `frontend/src/data/curriculum.ts`.

## Lesson JSON Schema

```jsonc
{
  "id": "unit-02-lesson-01",           // {unit_id}-lesson-{NN}
  "unit_id": "unit-02",
  "name": "Who Am I?",                 // Short, thematic lesson name
  "order": 1,                          // Position within the unit (1-indexed)
  "grammar_tips": [                    // Short explanations shown in the lesson
    {
      "id": "subject-pronouns",
      "title": "Subject Pronouns",
      "explanation": "io (I), tu (you, informal), lui/lei (he/she), Lei (you, formal), noi (we), voi (you, plural), loro (they).",
      "table": [["io", "I"], ["tu", "you"]],          // OPTIONAL — rows of cells
      "example": { "italian": "Sono italiano.", "english": "I am Italian." },  // OPTIONAL
      "before_exercise": 3                             // OPTIONAL — show before this exercise index
    }
  ],
  "kind": "standard",                  // PLANNED, not in the types yet — "standard" | "writing" | "listening" | "reading"
  "passages": [                        // PLANNED — only for listening/reading comprehension lessons
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

`kind` and `passages` are designed but not implemented (`types/curriculum.ts` has neither). They're for comprehension lessons — see [Comprehension Lessons](#comprehension-lessons-listening--reading).

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

### Exercise Ordering Within a Lesson
Follow this progression for each new concept:

1. **Introduce:** recognition (`multiple_choice`, structured input) — low-stakes first contact
2. **Reinforce:** recall in context (`cloze`)
3. **Produce:** active recall (`type_answer`, `fill_blank`, transformation)
4. **Combine:** full sentences (translation, `arrange_words` early on)
5. **Review:** mixed types, recycling earlier lessons

As many exercises per step as the material needs. A dense topic gets more; a light one fewer.

### Exercise Mix — shifts by level

Mechanical exercises (`fill_blank`, `cloze`) build accuracy and matter most early. As levels rise, shift toward production: `type_answer`, translation, and especially `free_form`. A B2 learner needs output, not gap-filling. Comprehension lessons (passages + questions) and writing lessons have their own formats. `match_pairs` and `read_aloud` are added where a lesson calls for them.

### Vocabulary Per Lesson
- Introduce every word the topic needs; there is no per-lesson or per-unit word target
- One vocabulary entry per **lemma** (headword), not per inflected form
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

Each level is defined by its coverage (grammar, vocabulary, can-do functions), not by a unit count. See [development-plan.md](development-plan.md), Workstream 4.

### A1 — Survival Italian
- **Sentences:** short (typically 3-6 words). Simple SVO structure. Present tense only.
- **Topics:** greetings, introductions, numbers, family, basic descriptions, food, directions
- **Grammar:** essere/avere, regular -are/-ere/-ire verbs, articles, adjectives, possessives, reflexives, simple prepositions, modals
- **Prompts:** Always in English. Hints in English.
- **Exercise focus:** Recognition for first exposure, then quickly to recall and production. Typed answers are short. `free_form` in the writing tasks.

### A2 — Everyday Situations
- **Sentences:** 5-10 words. Past tense, future, conditional.
- **Topics:** past events, travel, shopping, health, plans, opinions
- **Grammar:** passato prossimo, imperfetto (+ the contrast), futuro semplice, condizionale, object pronouns + ne/ci, imperative, comparatives
- **Prompts:** English, but can include familiar Italian phrases in quotes
- **Exercise focus:** More production. `free_form` appears in ordinary lessons. Listening comprehension lessons begin here.

### B1 — Independent Communication
- **Sentences:** 8-15 words. Complex tenses, subjunctive, relative clauses.
- **Topics:** storytelling, opinions, hypotheticals, formal situations
- **Grammar:** imperfetto vs passato prossimo, trapassato, congiuntivo presente/passato, periodo ipotetico (1-2), relative clauses, passive
- **Prompts:** Can start including Italian in prompts. Hints can be Italian.
- **Exercise focus:** Heavy production, little multiple_choice, regular `free_form`. Reading and listening comprehension lessons are a regular presence.

### B2 — Fluent Discussion
- **Sentences:** 10-20 words. All tenses, nuanced register, idioms.
- **Topics:** abstract discussion, formal register, literature, current events
- **Grammar:** congiuntivo imperfetto/trapassato, periodo ipotetico (3), passato remoto, indirect speech, subjunctive-triggering connectives
- **Prompts:** Primarily in Italian. English only for new/complex concepts.
- **Exercise focus:** Mostly `free_form`. Multiple_choice only for nuanced distinctions. Comprehension and writing lessons dominate the extended-skills band.

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
- [ ] (Once implemented) Comprehension lessons: `kind` is set, `passages` is present, every question has a valid `passage_ref`; audio passages have a pre-generated `audio_url` and a `transcript`
- [ ] The exercise mix matches the level (more `free_form` at B1/B2, less `fill_blank`/`cloze`)
- [ ] IDs follow the pattern: `{unit_id}-lesson-{NN}-ex-{NN}`
- [ ] No word is used that hasn't been introduced in this lesson or an earlier one
- [ ] The `vocabulary` array only contains words *new* to this lesson
- [ ] Each vocabulary entry has `word`, `meaning`, and `example`
- [ ] `target_words` correctly references the vocabulary being tested
- [ ] Grammar tips in lessons are short reminders; full explanations belong in grammar units
- [ ] No em-dashes in prompts, hints, or grammar tips (use periods, colons, parentheses)
- [ ] Hints clarify the task without giving away the answer
- [ ] `multiple_choice` distractors share part of speech and semantic field with the answer
- [ ] Accented characters are correct (è, é, à, ù, ò, ì) — never missing
- [ ] No duplicate exercise IDs within or across lessons

## Workflow for AI Agents

When asked to generate exercises for a unit:

1. **Read the curriculum** — Check `frontend/src/data/curriculum.ts` for the unit's `grammar_focus`, `vocabulary_targets`, and position in the curriculum.
2. **Check what came before** — Read previous unit lesson files to know what vocabulary/grammar is already introduced.
3. **Plan the unit** — Split the unit's grammar and vocabulary into as many lessons as the topic needs.
4. **Generate one lesson at a time** — Follow the lesson JSON schema exactly. Use the exercise ordering pattern above.
5. **Validate** — Run the quality checklist. Run `npm run build` in `frontend/`.
6. **Register in curriculum.ts** — Add each lesson's `LessonMeta` to the unit's `lessons` array.

### Prompt Template for Exercise Generation

When generating exercises, include this context in your prompt:
- The unit's grammar focus and vocabulary targets (from curriculum.ts)
- The lesson's theme and position within the unit
- All vocabulary already introduced in previous units/lessons
- The level's exercise-mix guidance (CEFR Level Guidelines)
- 2-3 examples of each exercise subtype from existing lessons (read from unit-01)
