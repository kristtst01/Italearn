# A1 Grammar & Vocabulary Inventory

What A1 Italian contains, from published sources, and how ItaLearn's A1 grammar units map onto it. This is the reference for writing grammar units and checking chapter coverage.

## Sources

1. **Profilo della lingua italiana** (Università per Stranieri di Perugia; the Council of Europe "Reference Level Description" for Italian). The official per-level inventory. Grammar pages per category, plus A1 word lists.
   - Grammar: `https://www.unistrapg.it/profilo_lingua_italiana/site/gram_<category>_a1.html` for `verbi`, `nome`, `articoli`, `aggettivi`, `pronomi`, `preposizioni`, `avverbi`
   - Vocabulary: `https://www.unistrapg.it/profilo_lingua_italiana/site/liste_lessicali_a1.html` (486 lemmas, saved as [data/profilo-a1-lemmas.json](../data/profilo-a1-lemmas.json))
2. **CILS A1 syllabus** (Università per Stranieri di Siena), receptive and productive structures: `https://iicbuenosaires.esteri.it/wp-content/uploads/2025/05/Contenuti-Livello-A1.pdf`
3. **Nuovo Espresso 1** (Alma Edizioni, A1 coursebook, ~90 hours), table of contents: `https://www.almaedizioni.it/wp-content/uploads/2019/10/nesp1_indice-intro.pdf`

**Backbone:** the Profilo, because it is the official CEFR description and also gives the A1 word list. CILS and Nuovo Espresso are cross-checks, and show what A1 courses teach in practice.

## A1 grammar in the sources

| Area | Profilo A1 | CILS A1 (productive) | Nuovo Espresso 1 |
|---|---|---|---|
| Essere, avere | Present, all persons (focus on singular + noi) | Present | L1–2 |
| Regular verbs -are/-ere/-ire | Present of the main regular verbs | Present | L2–4 |
| Irregular verbs | Some (fare, andare, stare, venire, uscire…) | – | L2–5 |
| Modals potere, volere, dovere | Their modal meaning | Present | L3, L5, L6 |
| Vorrei | Formulaic | Receptive | L3 |
| Imperative | Formulaic only (scusi/scusa, andiamo) | 2nd person sg/pl, affirmative + negative | Not in book 1 |
| Passato prossimo | Not A1 | Yes: choose the right auxiliary (no participle agreement) | L7, L10 |
| Infinitive of purpose (per studiare) | Yes | Yes | – |
| C'è / ci sono | Yes | – | L5 |
| Nouns: gender, number, -e nouns, invariables, irregular plurals | Yes | Gender + number | L2–3 |
| Articles: all definite + indefinite; with time, possessives, demonstratives | Yes | Yes | L1–3 |
| Adjectives: -o/-a/-e, agreement | Yes | Agreement not required | L6 |
| Possessives | Mainly 1st person with family | Yes | L10 |
| Demonstratives questo, quello | Yes | Yes | L2 |
| Interrogatives che, chi, quale, quanto, come, dove, quando, perché | Yes | Yes | L1–6 |
| Indefinites molto, poco, tanto, tutto, nessuno, niente, qualche | Yes | Yes | L6–7 |
| Numbers | Cardinals 1–100, ordinals 1st–10th | Cardinals 1–20 | L1–5 |
| Personal pronouns: subject; object/indirect | Subject; object mostly formulaic (lo so, per me) | Subject | L1; L4 (mi piace), L8 (lo, la, ne) |
| Reflexives | Formulaic (mi chiamo) | – | L9 (full) |
| Prepositions simple + articulated (di, a, in, con, per, da) | Yes | Simple | L2–5 |
| Partitive | – | – | L6, L8 |
| Adverbs (time, place, frequency, quantity) | Yes | Yes | L4, L9 |
| Negation (non, non… mai) | Yes | Yes | L2, L7 |
| Linking sentences: e, ma; perché, quando; per + infinitive | – | Yes | L10 (perché/siccome) |
| Si impersonale, superlatives, direct object pronouns | – | – | L7–8, L10 |

## ItaLearn's A1 grammar units

Grammar comes first: the unit order below is decided on its own merits (dependencies, usefulness, the sources above), and chapter content and order are built around it. The chapter links are provisional until the chapters are reworked.

| # | Unit | Covers | Chapters (provisional) |
|---|---|---|---|
| 1 | Subject pronouns & essere | Pronouns, tu/Lei/voi, dropping them, essere and its uses, essere vs stare, questions and non | 2 |
| 2 | Avere | Avere, the silent h, age, avere expressions, hot and cold, essere or avere | 5 |
| 3 | Nouns & the article system | Gender, -e nouns, invariables, plurals, all articles, c'è / ci sono | 3 |
| 4 | The present tense | -are/-ere/-ire, -isc-, key irregulars, modals, vorrei, per + infinitive | 7, 9, 10, 12, 15 |
| 5 | Questions, negation & linking | Question words, word order, non, double negatives, frequency, e/ma/perché/quando | 11 |
| 6 | Adjectives, demonstratives & quantities | Agreement, position, nationalities, questo/quello, molto/poco/tanto/tutto/qualche, nessuno/niente | 6, 7, 17 |
| 7 | Prepositions | Simple, a vs in with places, articulated, partitives, transport | 13, 14, 16 |
| 8 | Numbers, time & dates | 0–100, ordinals, telling the time, days, months, seasons, dates | 4, 9, 19 |
| 9 | Possessive adjectives | Forms, agreement, the article, the family rule, Suo | 8 |
| 10 | Piacere | Mi piace/piacciono, indirect pronouns with piacere, piacere + infinitive, preferire | 18 |
| 11 | Reflexive verbs | Pronouns, placement, common verbs | 9 |
| 12 | The imperative | Tu and voi, affirmative and negative, va'/fa'/di', formal set phrases | 13 |
| 13 | The passato prossimo | Participles, avere or essere, agreement with essere, irregular participles, reflexives, time expressions | 20 |

Why this order:
- The present tense comes straight after essere, avere and nouns, because almost every later unit needs working verbs.
- Questions and negation follow straight after, since they only need the present.
- Numbers, time and dates come after prepositions, because telling the time and giving dates use articulated prepositions (alle tre, dal lunedì).
- Piacere comes before reflexives: it is more useful early and introduces the pronoun placement that reflexives reuse.
- The imperative and the passato prossimo close the level; both build on the full present tense and on reflexives.

## Decisions

1. **The passato prossimo is in A1**, as the last unit. CILS A1 and Nuovo Espresso 1 teach it, although the Profilo puts it at A2.
2. **The imperative is in A1, lightly:** tu and voi, affirmative and negative, the common irregular forms, and formal forms only as set phrases (scusi, senta).
3. **Essere and avere are two units**, pronouns + essere first, then avere. They were one unit at first; split so the first unit is lighter and each mastery check is focused. The essere/avere contrast is taught at the end of the avere unit.
4. **Grammar drives chapters.** Chapters are reordered and rebuilt around this sequence.

## Vocabulary

The Profilo A1 list has **486 lemmas**. A first automated match finds about **357 (≈73%)** already taught in the lesson `vocabulary` arrays (approximate: chunks, accents and multi-form entries make exact matching imperfect). ItaLearn's 768 A1 vocabulary entries go well beyond the list; that is fine (the list is the floor, not the ceiling). Missing items include common everyday words (e.g. *appartamento, cellulare, indirizzo, cognome, piatto, forchetta, scarpa, montagna, spiaggia*) to be added where a chapter naturally uses them.
