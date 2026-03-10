# Phase 9 — B1 Content & Advanced Exercises

**Goal:** Build out B1 (Sections 7-8, Units 22-30). This is the intermediate plateau where grammar gets significantly harder — imperfetto vs passato prossimo, combined pronouns, subjunctive, conditionals. Exercise types expand to match.

## What This Delivers

- Sections 7-8 fully populated (9 units of content)
- Checkpoints 7 and 8
- Free-form short answer exercise type (typed Italian evaluated with fuzzy matching)
- Longer reading passages (5-8 sentences) and connected text dictation
- Grammar notes shift to simplified Italian with English fallback
- ~2,500 cumulative word families

## Learning Principles Addressed

- **The intermediate plateau**: B1 is where many learners stall. The grammar becomes abstract (subjunctive, hypotheticals) and progress feels slower. Our approach combats this with:
  - The power law of practice visible in UI — "progress naturally slows, this is normal"
  - Mastery percentages that show tangible growth even when new material feels hard
  - Heavy sentence-context drilling so abstract grammar is always grounded in real usage
- **Imperfetto vs passato prossimo**: the single hardest grammar distinction for English speakers (English uses one past tense where Italian uses two). Units 22-23 dedicate extensive practice to this contrast with narrative contexts — stories where both tenses naturally occur.
- **Free-form production**: at B1 level, the learner should be constructing Italian from scratch, not just filling blanks. Free-form answers (with fuzzy evaluation) push toward real production, which research shows produces the strongest retention (testing effect + generation effect).
- **Connected text**: reading passages grow to paragraph length. Dictation uses connected text, not isolated sentences. This builds discourse-level comprehension.

## Content to Generate

### Section 7: Narration & Complex Past (Units 22-26)
- Imperfetto formation + usage (descriptions, habits, ongoing states in the past)
- Imperfetto vs passato prossimo — narrative exercises, "when I was a child..." stories
- Trapassato prossimo (aveva fatto, era andato) — sequencing events in the past
- Combined pronouns (me lo, te la, glielo, ce li, ve ne...)
- Relative pronouns (che, cui, il quale, chi, ciò che)

### Section 8: Subjunctive & Hypotheticals (Units 27-30)
- Present subjunctive formation + triggers (penso che, credo che, è importante che, voglio che, before "che" clauses expressing opinion/doubt/desire)
- Subjunctive past and imperfect (congiuntivo passato, congiuntivo imperfetto)
- Conditional sentences — all three types:
  - Type 1 (real): Se piove, prendo l'ombrello
  - Type 2 (hypothetical): Se avessi tempo, viaggerei
  - Type 3 (impossible/past): Se avessi studiato, avrei superato l'esame
- Passive voice (essere + past participle, si passivante, si impersonale)

## Technical Deliverables

### 1. Free-Form Answer Exercise (`src/components/exercises/FreeFormAnswer.tsx`)
- Prompt: English sentence or question
- User types full Italian sentence (no word bank, no hints)
- Evaluation: compare against 2-3 accepted correct answers using fuzzy matching
  - Word-order flexibility (Italian allows some reordering)
  - Synonym acceptance (listed in exercise data)
  - Typo tolerance (inherited from Phase 2 validation)
- Feedback: show user's answer vs expected, highlight differences
- Partial credit: if most words correct but one error, show as "almost right"

### 2. Long Reading Passages (`src/components/exercises/ReadingComprehension.tsx`)
- Extends Phase 7's ReadingPassage to support longer texts (5-8 sentences)
- Paragraph display with optional vocabulary glosses (tap a word to see translation)
- 3-5 comprehension questions per passage
- Questions test both factual recall and inference

### 3. Connected Dictation
- Extends Phase 3's Dictation to play 2-3 sentences in sequence
- User types the full passage
- Graded per-sentence, with overall score

### 4. Curriculum JSON Files
- `unit-22.json` through `unit-30.json`
- Checkpoint 7 and 8 content
- Exercise mix shifts toward more production: ~30% type/free-form, ~20% fill-in-blank/cloze, ~20% listening/dictation, ~15% multiple choice, ~15% speaking
