# Exercise Generation Guide

How to author lesson content for ItaLearn, by hand or with AI. This document is the source of truth for any agent creating exercise content.

> **Status (2026-10-08):** this describes the format used by grammar units 1–7 and chapters 1–4, which follow it fully. Chapters 5–21 predate it (they still have grammar tips and read-aloud inside lessons) and are brought into line as each is reworked. Helpers for writing content are in [tools/authoring/](../tools/authoring/).

## Golden Rules

1. **Every Italian sentence must be correct and plausible.** Accurate grammar, and something a person could actually say. Drill sentences don't need to be native-level idiomatic (see the content quality philosophy in the development plan), but they must never be wrong or bizarre.
2. **Vocabulary must follow frequency order.** Use De Mauro's *Vocabolario di Base* (fondamentale → alto uso → alta disponibilità). Don't introduce rare words before common ones.
3. **Taught before used.** Every Italian word a learner sees must have been introduced first: on a new-words list (this lesson or earlier) or by an earlier grammar unit. Deliberate fixed phrases go in `frontend/scripts/content-allowlist.json` with a reason. `npm run check:content` enforces this.
4. **Context always.** Words are never taught in isolation. Every vocabulary item has an example sentence. Every exercise has `sentence_context`.
5. **Mix exercise types.** Move from recognition to production within a lesson, and don't run the same subtype many times in a row.
6. **Interleave prior material.** Every lesson recycles vocabulary and grammar from earlier lessons and units.
7. **Match the exercise mix to the level.** Mechanical exercises (fill_blank, cloze) build accuracy and dominate early. Production exercises (type_answer, translation) and especially open-ended `free_form` dominate later — a B2 learner is assessed on output, not gap-filling. See CEFR Level Guidelines.
8. **Size content to the topic, not to a number.** A lesson covers its topic completely: every word the topic needs, with enough practice that each is genuinely learned. There is no target number of lessons, exercises, or words. The one real count is vocabulary per CEFR level (counted in lemmas).
9. **Grammar: simple, but true.** Present rules simply, but never present a tendency as an absolute. Say "usually" or "most" where it applies and name the common exceptions in the same place; mark deliberate A1 simplifications as simplifications ("there's a fuller rule; for now, learn these"); say how regular a system is (numbers are almost fully regular, gender mostly predictable, irregular verbs have to be memorised); prefer real usage where it differs from textbook purity. Check a rule's completeness against a source (Treccani, Accademia della Crusca) before writing it.
10. **Grammar readings: form follows content.** Don't write every unit to one template. Use tables for paradigms (conjugations, articles, numbers) and prose with examples for usage and judgement (tu/Lei/voi, when to use the article, essere vs stare); lead with examples where usage is easier to show than state. Size the typical-mistakes section to the topic (a full table, a sentence or two, or nothing), choose the summary's form to fit (table, a few sentences, or none), and add background where it helps a rule stick. Where a section is dense (many forms at once), a short reassurance helps ("you don't need all of these yet; you'll practise them in every chapter from here"); use it sparingly, and only promise practice that actually exists.

## How the Course Is Built

A learner alternates between **grammar units** and **chapters**, in the order listed in `frontend/src/data/course.ts`:

First phrases → chapter 1 → Essere → chapter 2 → Numbers → Avere → chapters 3 and 4 → Nouns & articles → Regular verbs → Irregular verbs → …

- **Grammar decides the order.** The unit sequence is set on its own merits (dependencies, usefulness, sources: see [a1-grammar-inventory.md](a1-grammar-inventory.md)). Chapters are built around it, and a chapter comes after every unit it needs.
- **Grammar units explain; chapters use.** All explanation lives in grammar units. Lessons in chapters carry no grammar tips.
- **Early on, about one chapter per grammar unit.** Once articles and the present tense are in, several vocabulary-heavy chapters can follow one unit; each heavy unit should be used substantially in two or three chapters after it.
- **Existing content is never fixed.** Lessons and chapters can be restructured, renamed, split or merged whenever the course is better for it. Good content that no longer fits goes to `data/pool/` with a note on where it came from and why, not in the bin.
- A unit or chapter is marked `ready: true` (in `grammarPlan.ts` or `curriculum.ts`) once it's written and reviewed; the rest are listed under "Under construction".

## How to Write a Grammar Unit

A unit teaches one system of Italian in depth: a reading, practice placed inside the reading, and a mastery check. Files: `frontend/src/data/grammar/<id>.md` and `<id>.practice.json`, plus an entry in `grammarPlan.ts` and `course.ts`.

**The reading (`<id>.md`)**
- Front matter with `id`, `title`, `level` and `sources` (shown at the end of the page). Then `# Title`, an introduction, and `##` sections; `###` for subsections.
- An example is two blockquote lines, Italian then English:
  ```
  > Sono di Roma.
  > I'm from Rome.
  ```
- A table whose header starts with `✗ | ✓` is the typical-mistakes table (the wrong form gets a squiggly underline, the correction is handwritten).
- Every Italian word the unit uses should appear with a translation (an example line, or a table with a meaning), because that is what counts as "introduced" for the content check.
- **Simple, but true** (golden rule 9) and **form follows content** (rule 10): tables for paradigms, prose for usage and judgement; mistakes and summary sized to the topic; a short reassurance note where a section is dense. Check each rule against Treccani or the Accademia della Crusca before writing it.
- Don't reuse a heading's text inside the summary: headings become link targets and practice stops attach to them. Use bold lead-ins there instead.

**Practice and mastery (`<id>.practice.json`)**
```jsonc
{
  "unit_id": "a1-essere",
  "points": {                          // the grammar points exercises are tagged with
    "essere-forms": { "label": "The forms of essere", "section": "Essere: to be" }   // section = a heading in the reading
  },
  "stops": [                           // practice stops, shown as cards inside the reading
    { "id": "forms", "title": "The forms of essere", "after": "Essere: to be", "exercises": [ /* ... */ ] }
  ],
  "mastery": { "pass_mark": 0.85, "exercises": [ /* ... */ ] }
}
```
- A stop is placed right **after the section named in `after`** (before the next heading), so learners practise what they've just read. As many stops as the reading has natural breaks; the last one mixes everything.
- Every exercise carries `grammar_points`. After a failed check, the learner is sent back to the sections of the points they missed.
- Unit practice is about **form and rule**: fill in the form, rewrite for another subject (`transformation`), fix a typical mistake (`find_mistake`), choose between forms. Situations and vocabulary are the chapters' job.
- The mastery check uses new sentences, not ones from practice, and leans on production.
- Exercises may only use words introduced by earlier units and chapters, or by this unit's reading.

**Before marking it ready:** run `npm run check:content`, then an AI review pass on the reading and practice (correctness, naturalness, register, oversimplified rules, ambiguous exercises), as recorded in [reviews/](reviews/).

## How to Write a Chapter

A chapter is a situation with its vocabulary: it uses the grammar learners already have. Files: one JSON per lesson in `frontend/src/data/units/<unit>/`, the unit's entry in `curriculum.ts` (with each lesson's `role`), and a line in `course.ts`.

**Start from what the learner has.** List the grammar units before this chapter in `course.ts`, and write nothing that needs later grammar. Fixed phrases used deliberately before their grammar (like *un caffè* before the articles unit) go in `frontend/scripts/content-allowlist.json` with a reason.

**Lessons, by role** (the chapter page groups them: Lessons, Read, Write, Speak & listen):

| Role | What it is |
|---|---|
| `words` | Introduces a set of words and practises them in situations. The point of each exercise is a communicative task (saying where you're from, choosing tu or Lei), with the words varying to support it; no exercise exists just to drill one word. |
| `practice` | Combines what's been learned into exchanges, mostly "Your line" dialogues. |
| `reading` | A text (`reading`: title and paragraphs) that stays beside the questions. Comprehension questions in English, then one or two answers in Italian. Dialogue lines are written `Name: text`. Stories reuse a small recurring cast (Emma, Paul, Chloé, Giulia's class in Florence). |
| `writing` | One free-form text per lesson, with a model answer; finishing all of a chapter's writing lessons earns its stamp. |
| `speaking` | Read-aloud sentences. Speaking and listening get their own lessons because they need a microphone or sound. |

**Inside a lesson**
- The lesson's `vocabulary` is shown first as a "New in this lesson" list, so nothing is asked before it's been seen. One entry per word: a phrase built from a word on the same list goes into that word's meaning and example (`bene: well · sto bene = I'm well`), unless it's a fixed phrase that can't be broken down yet (`"phrase": true`). Each word needs its own example.
- Order exercises **recognise → recall → produce**: typed Italian → English recall of the new words; situational multiple choice mixed with cloze; fill in the blank; arrange the words; typed English → Italian at the end.
- Prefer typed recall to "What does X mean?" multiple choice. Keep multiple choice for situations where the options are all plausible and the learner has to choose.
- Every word introduced should be used in at least one exercise.

**Accepted answers.** Give one model answer and at most an obvious alternative; the AI check judges other wordings. Don't list every possible translation. Never use a wrong option that is actually acceptable Italian (check regional and colloquial usage).

## Writing Style

For everything a learner reads: prompts, hints, readings, UI text.

- Plain, direct English. No em-dashes (use a comma, colon or full stop), no capitals for emphasis, no forced "not X, but Y" contrasts.
- Nothing on screen that is written for developers.
- Don't overclaim about Italians or Italian ("Italians never…"). Say what is usual.
- Translate *voi* as "you (plural)", never "you all".
- Hints explain the point being tested; they aren't shown before answering in most exercise types, but fill-in-the-blank shows its first hint up front, so that one mustn't give the answer away.

## Exercise Types: What and Why

Each exercise type trains a specific ability. Choose types for what the learner needs to do with the material, not for variety alone.

| Type | Trains | Use it for | Limits |
|---|---|---|---|
| `multiple_choice` | Choosing between plausible options | Situations where the learner has to pick the right phrase or form | Weak for plain meaning ("What does X mean?"): answers can be found by elimination. Use typed recall for that |
| `match_pairs` | Recognizing meaning | Quick warm-up and review | Not real learning on its own |
| `type_answer` | Recall of a word, phrase or short sentence | Italian → English recall of new words; English → Italian production | One model answer; the AI check judges other wordings |
| `cloze` | Recall in context | Vocabulary in a sentence | Overlaps with `fill_blank`; use `cloze` for vocabulary, `fill_blank` for grammar |
| `fill_blank` | Producing one grammatical form | Conjugation, articles, agreement, prepositions | One form at a time; pair with transformation for whole systems |
| `arrange_words` | Word order | Early sentence structure | The word bank makes it a puzzle; prefer translation once learners can type sentences |
| `read_aloud` | Pronunciation from text | Pronunciation practice | Reading, not speaking; add listen-and-repeat when audio exists |
| `free_form` | Written production | Writing lessons, one text each | AI-graded (Sonnet); can be long |
| `dialogue_completion` ("Your line") | Using language in an exchange | Write one turn of a short dialogue | Open answers, judged by the AI check |
| `transformation` | Controlling a grammar system | "Rewrite with *noi*", "make it negative" | Grammar unit practice, mostly |
| `find_mistake` | Noticing errors | Typical English-speaker mistakes (*sono fame*) | The answer box starts with the faulty sentence |

**Planned** (not built yet):

| Type | Trains | Why |
|---|---|---|
| Structured input ("whose is it?") | Noticing form to get meaning | The learner can only answer by attending to the ending, article or pronoun (VanPatten's processing instruction). |
| Dictation | Decoding speech + spelling | Needs the audio pipeline. |
| Minimal pairs | Hearing double consonants and similar sounds | *caro/carro*, *pala/palla*. Needs audio. |
| Listen and repeat | Pronunciation from a model | Better than `read_aloud` for pronunciation. Needs audio. |
| Answer a spoken question | Short spoken production | Bridge to the AI tutor; leniently graded. |

**Grammar in review:** planned (issue #67). Today only vocabulary is reviewed; a passed grammar unit doesn't come back yet.

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

Lesson files are discovered automatically (`import.meta.glob` in `data/lessonLoader.ts`). To make a lesson appear, add its `LessonMeta` (`id`, `unit_id`, `name`, `role`, `order`) to the unit's `lessons` array in `frontend/src/data/curriculum.ts`. `role` is `words`, `practice`, `reading`, `writing` or `speaking` (see How to Write a Chapter; `grammar` survives only in chapters not yet reworked).

Grammar units live in `frontend/src/data/grammar/` (`<id>.md` and `<id>.practice.json`), are listed in `grammarPlan.ts`, and are discovered automatically. The order a learner meets everything is `data/course.ts`.

## Lesson JSON Schema

```jsonc
{
  "id": "unit-02-lesson-01",           // {unit_id}-lesson-{NN}
  "unit_id": "unit-02",
  "name": "Where Are You From?",       // Short, thematic lesson name
  "order": 1,
  "grammar_tips": [],                  // Always empty in reworked chapters: explanations live in grammar units
  "exercises": [ /* ... see below ... */ ],
  "vocabulary": [                      // Words first introduced in this lesson, shown as "New in this lesson"
    {
      "word": "tedesco",               // One entry per lemma
      "meaning": "German",             // Other forms can be given here: "student (man) · studentessa (woman)"
      "example": "Anna è tedesca, di Berlino.",   // Its own example, using only known words
      "phrase": true                   // OPTIONAL: a fixed phrase kept as its own entry (non c'è male)
    }
  ],
  "reading": {                         // Reading lessons only: the text shown beside every question
    "title": "Un caffè a Roma",
    "paragraphs": [
      "Paul è a Roma. È americano, di Chicago, ed è medico.",
      "Paul: Buonasera! Scusi, Lei è italiana?"    // "Name: text" lines show the speaker in bold
    ]
  }
}
```

Write lesson files with the helpers in `tools/authoring/`, or run `format_lessons.py` after a hand edit, so short objects and arrays stay on one line as in the existing files.

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
  "sentence_context": "Io sono italiano.",   // The Italian sentence shown or completed; "" where there is none
                                             //   (a situational question, a writing task)
  "correct_answer": "I am",            // String, or string[]: for arrange_words the words in order, for match_pairs
                                       //   the "italiano|english" pairs, for everything else the accepted answers
                                       //   (model answer first)
  "distractors": [                     // For multiple_choice: 3 wrong options
    "I have",                          // For arrange_words: extra distractor words
    "You are",                         // Empty [] for type_answer, fill_blank, cloze
    "They go"
  ],
  "hints": [                           // Optional hints shown to the user
    "The verb 'essere' conjugates irregularly."
  ],
  "target_words": ["sono"],            // Vocabulary entries this exercise practises (for SRS card creation)
  "grammar_points": ["essere-forms"],  // Grammar unit practice only: keys of the unit's "points"
  "strict_accents": true,              // OPTIONAL: a missing accent is wrong (è/e, sì/si, ventitré), not just a reminder
  "dialogue": [                        // dialogue_completion only: the exchange; the line without "text" is the learner's
    { "speaker": "Luca", "text": "Di dove sei?" },
    { "speaker": "You" }
  ]
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

### `dialogue_completion` (type: `writing`) — "Your line"
A short exchange where the learner writes one turn. The `prompt.text` sets the scene, `dialogue` holds the lines (the one without `text` is the learner's), and `sentence_context` is the same exchange as plain text with `___` for the learner's line (the AI check reads it). Answers are open, so `correct_answer` gives one or two model replies and the AI check accepts anything that fits.

```json
{
  "id": "unit-02-lesson-03-ex-02",
  "type": "writing",
  "subtype": "dialogue_completion",
  "prompt": { "text": "Luca asks where you are from." },
  "sentence_context": "Luca: Di dove sei?\nYou: ___",
  "correct_answer": ["Sono di Londra.", "Sono inglese, di Londra."],
  "distractors": [],
  "hints": ["Di + your city, or your nationality."],
  "target_words": ["di dove sei"],
  "dialogue": [{ "speaker": "Luca", "text": "Di dove sei?" }, { "speaker": "You" }]
}
```

### `transformation` and `find_mistake` (type: `writing`)
Both show a sentence (`sentence_context`) and ask for a rewritten one. `transformation`: "Rewrite the sentence with noi", "Make it negative". `find_mistake`: "Fix the mistake", with the faulty sentence pre-filled for editing. `correct_answer` lists every accepted sentence, model answer first. Use typical learner mistakes for `find_mistake`, not slips nobody makes.

```json
{
  "id": "a1-essere-p-21",
  "type": "writing",
  "subtype": "transformation",
  "prompt": { "text": "Rewrite the sentence with noi." },
  "sentence_context": "Sono di Roma.",
  "correct_answer": ["Siamo di Roma.", "Noi siamo di Roma."],
  "distractors": [],
  "hints": ["Noi siamo."],
  "target_words": [],
  "grammar_points": ["essere-forms"]
}
```

## Reading and Listening Lessons

**Reading lessons are built.** A lesson with role `reading` has a `reading` text (title and paragraphs) that stays on screen beside every question. Questions are ordinary exercises: comprehension in English (`multiple_choice`, including true/false), then one or two answers in Italian (`type_answer` with a prompt starting "Answer in Italian:"). The text uses only words and grammar the learner has, plus a few new words on the lesson's own list. A text that is a small story, with a turn at the end, is better than a list of facts.

**Listening lessons are planned** and need the audio pipeline (issue #68). Audio is pre-generated at authoring time with ElevenLabs, never at runtime; a transcript is always stored. Model dialogues for chapters (issue #69) use two voices.

## Lesson Design Patterns

### Exercise Ordering Within a Lesson
The lesson's new words are shown first, on the "New in this lesson" screen. Then:

1. **Recall the meaning:** typed Italian → English for the new words (`type_answer`, "What does 'X' mean?")
2. **Choose and complete:** situational `multiple_choice` alternating with `cloze`
3. **Produce a form:** `fill_blank`
4. **Build a sentence:** `arrange_words`, "Your line" dialogues
5. **Produce:** typed English → Italian (`type_answer`) to end the lesson

As many exercises per step as the material needs. A dense topic gets more; a light one fewer. Research behind this order (typed recall beats recognition; Italian → English first for new words) is summarised in the development plan's decisions.

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
| Grammar unit readings | **English always**, with Italian examples translated |
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

- [ ] `npm run check:content` passes with no errors or warnings (it checks taught-before-used, word lists, structure, accepted answers and style)
- [ ] Every Italian sentence is correct and natural (not word-for-word from English); doubtful usage is checked against a source
- [ ] No "wrong" option is acceptable Italian, including regional or colloquial usage
- [ ] No question has two defensible answers; situations give the cue explicitly ("a new classmate your age", not "a stranger")
- [ ] `fill_blank` and `cloze` have exactly one `___` in `sentence_context`
- [ ] `multiple_choice` options are plausible and of the same kind as the answer
- [ ] `free_form` has a model answer; writing lessons have one text each
- [ ] Reading lessons have a `reading` text; speaking lessons hold the read-aloud
- [ ] One vocabulary entry per word, each with its own example; every new word is used in an exercise
- [ ] Hints explain the point without giving the answer away (fill-in-the-blank shows its first hint up front)
- [ ] No em-dashes, capitals for emphasis or overclaims in anything the learner reads
- [ ] Accents are correct, and `strict_accents` is set where the accent is the point
- [ ] Grammar readings: rules checked against a source, tendencies marked as tendencies, exceptions named

## Workflow for AI Agents

When asked to write a chapter or a grammar unit:

1. **Find its place.** Read `frontend/src/data/course.ts` to see what comes before it, and `grammarPlan.ts` / `curriculum.ts` for the unit or chapter itself.
2. **Know what the learner has.** Read the grammar units before it (the readings) and skim the earlier chapters' word lists. `npm run check:content -- --missing` lists Profilo A1 words not taught yet, which is a good source of vocabulary for new chapters.
3. **Plan it** as described in How to Write a Grammar Unit / How to Write a Chapter, sized to the topic.
4. **Write it,** using `tools/authoring/` (see its README and examples) or by hand.
5. **Register it:** `curriculum.ts` (lessons and roles) or `grammarPlan.ts`, and `course.ts`.
6. **Check it:** `npm run check:content`, then `npm run build` in `frontend/`. Fix what it flags: teach the word, rephrase, or allowlist a deliberate phrase.
7. **Review it:** for a grammar unit, an AI review pass (see [reviews/](reviews/)); for everything, play through it.
8. **Mark it ready** only after review.

Move anything good that no longer fits to `data/pool/` rather than deleting it.

### Prompt Template for Exercise Generation

When generating exercises, include this context in your prompt:
- The unit's grammar focus and vocabulary targets (from curriculum.ts)
- The lesson's theme and position within the unit
- The grammar units and chapters that come before it in `course.ts`, and the words they introduce
- The level's exercise-mix guidance (CEFR Level Guidelines)
- 2-3 examples of each exercise subtype from a reworked chapter (`unit-02` or `unit-05`), and the matching example in `tools/authoring/examples/`
