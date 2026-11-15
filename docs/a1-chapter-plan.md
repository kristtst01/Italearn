# A1 Chapter Plan

The chapters for the rest of A1, after the 16 grammar units were written (2026-11-13). Chapters 1–8 are done; this plans the 13 that follow, each placed after the grammar units it needs. Topics and word lists come from the 14 pre-redesign chapters (units 06–21), reworked to the [authoring guide](exercise-generation-guide.md), plus the Profilo A1 words not taught yet.

The order in [course.ts](../frontend/src/data/course.ts) follows this table as chapters are written. Grammar units 8–16 currently sit together after chapter 8; each chapter is inserted after its unit, so the course ends up interleaved again.

## Chapters

| After grammar unit | Chapter | Can-do | Built from |
|---|---|---|---|
| 8 Prepositions | **Around Town** | Say where places are and where you're going | unit-12 Out and About, unit-13 Finding Your Way (places) |
| 8 Prepositions | **Food & the Market** | Buy food, ask for amounts, order a meal | unit-16 At the Café & Restaurant (food, partitives) |
| 9 Questions & negation | **Getting to Know Someone** | Ask and answer about someone's life, say no, say how often | unit-11 Keeping a Conversation Going, trimmed to A1 |
| 10 Adjectives | **Describing People & Things** | Describe looks, personality, colours | unit-06 |
| 10 Adjectives | **Shopping** | Buy clothes, ask for sizes and colours, prices | unit-17 |
| 11 Time & dates | **Getting Around** | Buy a ticket, read a timetable, travel by train and bus | unit-14, expanded |
| 11 Time & dates | **Weather & Seasons** | Small talk about weather, seasons, dates and holidays | unit-19 |
| 12 Possessives | **My Family** | Present and describe your family | unit-08, grammar lessons removed |
| 13 Piacere | **Likes & Plans** | Say what you like, invite, accept and refuse | unit-18 + unit-15 |
| 14 Reflexives | **A Day in My Life** | Describe your routine, with times | unit-09 |
| 15 Imperative | **Finding Your Way** | Ask for and give directions | unit-13 (directions) |
| 15 Imperative | **Feeling Unwell** | Say what's wrong, at the pharmacy and the doctor's | unit-20 |
| 16 Passato prossimo | **A Trip** | Book a hotel, then tell someone about the trip in the past | unit-21, plus a past-tense capstone |

**Decisions, open to revisiting:**
- *Countries & Languages* (unit-07) is not a chapter: chapter 2 and the adjectives unit cover nationalities. Its lessons go to the pool; country names can come back in A Trip.
- *Food & the Market* is its own chapter; *At the Café* (chapter 8) stays as it is.
- Directions come after the imperative, because they're mostly commands. *Around Town* covers where places are, not how to get there.
- A1 ends with *A Trip*, told in the past tense.

## Profilo A1 words still to teach

138 of the Profilo's 486 A1 lemmas weren't taught by the finished material when this plan was written (`npm run check:content -- --missing`). Each planned chapter takes its share; about 8 are counting artefacts (taught in another form, e.g. *scarpe*, *ci vediamo*), and *fax* and *cd* are dated and skipped on purpose.

| Chapter | Profilo words to include |
|---|---|
| Around Town (written) | *attenzione, cambiare, incontrare, portare, chiesa, posta, francobollo, busta, pacco, indirizzo, parcheggio, polizia, là, senza*, and the location words *davanti, dietro, sopra, sotto, fuori, lontano*. Still to place: *giù, arte, quadro* |
| Food & the Market (written) | *carne, pesce, verdura, pasta, riso, pomodoro, frutta, menù, piatto, forchetta, coltello, cucchiaio, pepe, aceto, cibo, spaghetti, mercato, metà*, plus *importante* |
| Getting to Know Someone (written) | *dopo, posto, quasi, significare, strada, domandare, saluto, telefonare, internet, fumare, sigaretta, falso*, plus *persona* (*scusare* is covered by *scusa / scusi*) |
| Describing People & Things (written) | *corto, lungo, largo, stretto, magro, ricco, sporco, felice, triste, intelligente, interessante, biondo, castano, maschio, femmina*, plus *capelli, occhio* (*capello* in the Profilo) |
| Shopping (written) | *camicia, cappotto, giacca, gonna, vestito, maglietta, maglione, calza* |
| Getting Around (written) | *aeroporto, fermata, taxi* |
| Weather & Seasons (written) | *piovere, Natale, Pasqua, augurio, fiore, albero, spiaggia* |
| My Family (written) | *famiglia, amore, bacio, affetto, animale* |
| Likes & Plans (written) | *appuntamento, festa* |
| A Day in My Life (written) | *orologio, trovare* |
| Finding Your Way (written) | *destra, sinistra, avanti, indietro* (the location words moved to Around Town, which needs them to say where places are) |
| Feeling Unwell (written) | *malato, medicina, salute* |
| A Trip (written) | *albergo, hotel, piano, prenotare, valigia, straniero, estero, nazione, internazionale, agenzia, informazione, check-in, singolo, doppio, cartolina, ambasciata, consolato, ritornare, morire* |
| Not placed yet | *industria, stop* (*segreteria* went to Finding Your Way): wherever a chapter uses them. *Alfabeto* and *nazionalità* belong in chapters 1–2. |

## Vocabulary size

The Profilo list is a floor. With the old chapters' words (trimmed of duplicates and anything beyond A1, which goes to the pool for A2) and the words above, A1 should end at roughly 750–850 lemmas, within the usual range for A1 courses.
