# Phase 7 — A1 Complete (Sections 2-3)

**Goal:** Populate the full A1 curriculum (Sections 2 and 3, Units 4-10) so a learner can complete the entire A1 level — approximately 500 word families and foundational grammar.

## What This Delivers

- Section 2: Everyday Basics (Units 4-7) — articles, adjectives, family, regular verbs
- Section 3: Daily Life (Units 8-10) — reflexives, prepositions, food/ordering
- Checkpoints 2 and 3
- Reading comprehension exercises (short passages)
- False friends / contrastive notes
- Error pattern tracking

## Learning Principles Addressed

- **Frequency-first vocabulary**: by the end of A1 we've covered the top ~500 word families — the most impactful learning happens here because each word covers a huge chunk of everyday Italian.
- **Grammar scaffolding**: Units 4-10 systematically build: nouns → articles → adjectives → regular verbs → reflexive verbs → prepositions → modal verbs. Each unit builds on the grammar from the previous, exactly like a university first-semester progression.
- **Connected text**: Phase 7 introduces short reading passages (3-5 sentences) that recycle known vocabulary. This addresses the Duolingo criticism of isolated, disconnected sentences and implements Nation's 98% comprehension threshold — passages are composed almost entirely of known words.
- **Contrastive analysis**: false friends are explicitly flagged (Laufer & Girsai 2008). For A1, these are basic ones like "camera" (room, not camera), "firma" (signature, not firm).
- **Error pattern tracking**: the system starts tracking which grammar areas the learner consistently gets wrong and can surface targeted review.

## Content to Generate

### Section 2: Everyday Basics

**Unit 4: Articles, Gender & Noun Agreement** (~5 lessons)
- Definite articles: il, lo, la, l', i, gli, le
- Gender rules: -o masculine, -a feminine, -e either
- Plural formation: -o→-i, -a→-e, -e→-i
- Common nouns: objects, classroom items, house items

**Unit 5: Descriptions & Adjectives** (~5 lessons)
- Adjective agreement: -o/-a/-i/-e
- Position: usually after noun (una casa grande), some before (bello, buono, brutto)
- Colors, sizes, personality traits, physical descriptions
- Bello/quello special forms (bel, bell', bei, begli)

**Unit 6: Family & Possessives** (~5 lessons)
- Family vocabulary: madre, padre, fratello, sorella, nonno, nonna, figlio, figlia, zio, zia
- Possessive adjectives: mio, tuo, suo, nostro, vostro, loro
- Special rule: no article with singular family members (mia madre, NOT la mia madre)
- But: article with plural (i miei fratelli) and with loro (la loro madre)

**Unit 7: Regular Verbs (-are, -ere, -ire)** (~6 lessons)
- -are: parlare, mangiare, lavorare, studiare, guardare, ascoltare
- -ere: scrivere, leggere, prendere, vivere, vedere
- -ire: dormire, partire, aprire, sentire
- -ire (isc): capire, finire, preferire, pulire
- Common irregular presents: fare, andare, dare, stare, dire, uscire, venire

### Section 3: Daily Life

**Unit 8: Daily Routines & Reflexive Verbs** (~5 lessons)
- Reflexive pronouns: mi, ti, si, ci, vi, si
- Common reflexives: svegliarsi, alzarsi, lavarsi, vestirsi, pettinarsi, addormentarsi
- Telling time basics (sono le tre, è l'una, è mezzogiorno)
- Daily routine vocabulary

**Unit 9: Prepositions & Places** (~6 lessons)
- Simple: di, a, da, in, con, su, per, tra/fra
- Articulated: al, allo, alla, all', ai, agli, alle (and same for di, da, in, su)
- Places: la banca, il supermercato, la farmacia, la stazione, il ristorante
- Directions: a destra, a sinistra, dritto, vicino a, lontano da

**Unit 10: Food, Drink & Ordering** (~5 lessons)
- Food vocab: pane, pasta, carne, pesce, verdura, frutta, formaggio
- Drinks: acqua, caffè, vino, birra, succo
- Ordering: vorrei..., per me..., il conto per favore, un tavolo per due
- Modal verbs: volere, potere, dovere (present tense)
- Partitive articles: del, dello, della, dei, degli, delle

## Technical Deliverables

### 1. Reading Passage Exercise (`src/components/exercises/ReadingPassage.tsx`)
- Short Italian passage (3-5 sentences) using known vocabulary
- Followed by 2-3 comprehension questions (multiple choice)
- All words in passage should be from already-taught vocabulary (98% comprehension threshold)

### 2. Error Pattern Tracking (`src/engine/errorTracking.ts`)
- Track which grammar categories the user gets wrong (articles, verb conjugation, gender agreement, etc.)
- Each exercise tags which grammar point it tests
- After enough data (e.g., 5+ errors in same category), surface a notification: "You're struggling with article agreement — here's a quick review"
- Link to relevant grammar tip + targeted exercises

### 3. Contrastive Notes
- False friends data added to curriculum JSON
- Shown as special tip cards when a false friend is encountered
- A1 false friends: camera/camera, firma/firm, caldo/cold, largo/large, parente/parent

### 4. Curriculum JSON Files
- `unit-04.json` through `unit-10.json`
- Each following the same schema as Unit 1-3
- Checkpoint 2 and 3 content
