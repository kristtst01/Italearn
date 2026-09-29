# A1 Curriculum Plan

Complete plan for the A1 level (CEFR "Breakthrough"). Covers everything a learner needs to survive basic Italian interactions: introducing themselves, describing things, talking about daily life, navigating places, and ordering food.

A1 is organized in **two parts**:

- **Foundations (Units 1–5)** — form-first. Greetings, *essere*, nouns/gender/articles, numbers, *avere*. These are taught as explicit grammar/vocabulary because they're the machinery every later unit depends on. You can't situate a conversation without pronouns, the two core verbs, and articles.
- **Situational arc (Units 6–21)** — scenario-organized (notional-functional). Each unit is a real-world situation ("My family", "Finding your way", "At the café"). Grammar is *threaded through* the scenario via a focus-on-form lesson, not the organizing principle. The unit's goal is a thing the learner can *do*.

> **Status (2026-09-29):** Content for units 1–21 is built (`frontend/src/data/units/`). The lesson JSON and `curriculum.ts` are the source of truth for the lesson split, which differs in places from the original lesson designs below. This document keeps the *why*: what each unit covers, in what order, and why.
>
> **Upcoming restructure:** units are to become chapters in a library, and grammar moves into whole-system grammar units (see [development-plan.md](development-plan.md), Product Shape). The A1 Grammar Coverage Map at the end is the starting point for those units.

## Design Principles

1. **Foundations first, then situations.** Units 1–5 are organized by grammatical concept because they're prerequisites with no useful communicative framing of their own. From Unit 6, the organizing unit is a *situation*, and grammar serves it.

2. **Scaffolding.** Every unit builds on what came before. If a concept requires another concept, the prerequisite comes first. No exceptions.

3. **Grammar threaded, not dropped.** Situational does not mean grammar-free. Each situational unit has a dedicated focus-on-form lesson for whatever structure the scenario needs (e.g. "A Day in My Life" needs regular verbs + reflexives + time). Research-backed sweet spot: communicative backbone + targeted explicit instruction. Pure immersion without focus-on-form fossilizes errors.

4. **Variable sizing.** Units have as many lessons as the topic needs, lessons as many exercises as the content needs. There are no target counts.

5. **Frequency-first vocabulary.** Words come from De Mauro's *vocabolario fondamentale* (the ~2,000 most frequent Italian words covering ~86% of text). Vocabulary is authored as **chunks and collocations** where natural (`vorrei un caffè`, `quanti anni hai`), not just bare lemmas — native-like fluency is heavily formulaic (lexical approach, Lewis).

6. **Honest vocabulary counting.** Counts are **headwords/lemmas**, never inflected forms. Conjugations and plurals are grammar practice, not vocabulary breadth. A1's target is the vocabulary expected at A1, defined by a sourced lemma list (still to be chosen; see the development plan, Workstream 4).

7. **Communicative purpose.** Each unit has a clear "by the end, you can…" outcome aligned with CEFR A1 can-do statements.

## Structure Overview

| Part | Units | Focus | Mode |
|------|-------|-------|------|
| Foundations | 1–5 | Greetings, *essere*, nouns/articles, numbers, *avere* | Form-first |
| Situational arc | 6–21 | People, daily life, getting around, daily needs, health, travel | Situational |

The grouping of units into sections lives in `curriculum.ts`.

## Capstones and the AI Tutor

Each situational unit ends with a **written capstone** (a normal lesson, AI-graded, required to complete the unit). A **spoken tutor scenario** for the same situation is planned as a voluntary extra once the AI tutor exists. The tutor's design is in [development-plan.md](development-plan.md), Workstream 2.

## Dependency Graph

```
FOUNDATIONS
U1 Greetings → U2 Essere → U3 Nouns/Articles → U4 Numbers → U5 Avere

SITUATIONAL ARC
U2,U3      → U6 Describing people/things (adjective agreement)
U6         → U7 Where we're from (nationalities = adjectives)
U3,U6      → U8 My family (possessives)
U2,U4      → U9 A day in my life (regular -are verbs, reflexives, time)
U9         → U10 Work, study & free time (regular -ere/-ire verbs)
U9,U10     → U11 Keeping a conversation going (questions, negation, frequency)
U9         → U12 Out and about (irregular verbs)
U3,U12     → U13 Finding your way (prepositions, articulated prepositions)
U13        → U14 Getting around (transport)
U12        → U15 Making plans (modal verbs)
U13        → U16 At the café & restaurant (partitive, vorrei)
U4,U6      → U17 Shopping (demonstratives, prices)
U10        → U18 Likes & preferences (piacere)
U12        → U19 Weather & small talk (fare/c'è for weather, calendar)
U5,U12     → U20 Feeling good, feeling bad (stare for health, avere idioms)  ← A1 capstone
U14,U17    → U21 Hotel & travel (booking, documents, sightseeing)
```

---

# Section 1: Foundations (Units 1–5)

**Mode:** form-first. **Can-do at section end:** Learner can greet people formally and informally, introduce themselves (name, origin), name common objects with correct articles, use numbers for age and prices, and express possession and basic states with *avere*.

These five units are deliberately *not* situational. Greetings, *essere*, the article system, numbers, and *avere* are the structural machinery of Italian — there's nothing to "situate" yet, and front-loading them as clean explicit instruction means the situational arc can move fast. This honestly signals to the learner: basics first, then you start *using* it.

---

## Unit 1: Greetings & Survival Phrases

**Goal:** Survive your first 60 seconds of an Italian encounter — greet someone, be polite, ask how they are, and manage the conversation when you're lost.

**Grammar:** None. Everything here is formulaic chunks memorized as fixed phrases. This is deliberate: learners need social survival tools before any grammar analysis. Mirrors how children acquire L1 social routines and how phrasebook Italian actually works.

**Vocabulary:** greetings, politeness, basic responses

**Why this comes first:** Research on communicative competence (Canale & Swain 1980) shows sociolinguistic competence — knowing *when* to say *what* — matters as much as grammatical accuracy. Italian's formal/informal distinction (tu/Lei) is a social minefield. Front-loading it means learners build correct instincts from day one rather than unlearning bad habits later.

### Lesson 1: Hello & Goodbye

Introduces the core greeting system. The formal/informal split is the single most important social concept in Italian — every textbook (Nuovo Espresso, Prego, Chiaro!) opens here.

- **Vocabulary:** ciao, buongiorno, buonasera, buonanotte, arrivederci, salve
- **Key concept:** ciao = informal (friends, family), buongiorno/buonasera = formal or default-safe, salve = middle ground. Ciao works for both hello AND goodbye.
- **Why these words:** All 6 are in De Mauro's *fondamentale*. They're the literal first words any Italian course teaches because you cannot have any interaction without them.

### Lesson 2: Please & Thank You

Politeness vocabulary. These words appear in virtually every real interaction and are expected even in the most casual encounters. Italians notice when foreigners skip them.

- **Vocabulary:** grazie, per favore, scusi, scusa, prego, mi dispiace, permesso
- **Key concept:** scusi (formal) vs scusa (informal) reinforces the formal/informal distinction from Lesson 1. Permesso is culturally specific (used when entering someone's space) and has no clean English equivalent.
- **Why these words:** Prego alone has 4+ uses (you're welcome, please sit, go ahead, can I help you?). These are among the top 100 most frequent Italian words.

### Lesson 3: How Are You?

The first real conversational exchange pattern: ask → respond → ask back. Introduces "stare" as a chunk (come stai/sta) without analyzing the verb paradigm — that comes in Unit 12.

- **Vocabulary:** come stai, come sta, sto bene, sto male, bene, male, così così, e tu, e Lei, non c'è male
- **Key concept:** come stai (informal) vs come sta (formal). Italian uses *stare* not *essere* for "how are you" — this is a false friend trap (English "How are you?" ≠ "Come sei?"). Teach the correct form early as a chunk.
- **Why this lesson exists:** The "greet → how are you → fine, and you?" sequence is the #1 most practiced exchange in every Italian textbook (Nuovo Espresso Lezione 1, Prego Chapter 1, Chiaro! A1 Unit 1). It's universal social glue.

### Lesson 4: When You're Lost

Metacommunicative phrases — the tools you need when communication itself breaks down. These are arguably the most important survival phrases because they let you *stay* in a conversation even when you don't understand.

- **Vocabulary:** non capisco, può ripetere (per favore), come si dice, va bene, d'accordo, sì, no
- **Key concept:** "Non capisco" and "Può ripetere?" are survival lifelines. "Come si dice...?" lets you learn *within* Italian by asking for words. Va bene vs d'accordo (both ≈ "okay" but different registers/nuances).
- **Why this is its own lesson:** Most courses bury these in a footnote. But research on communication strategies (Dörnyei & Scott 1997) shows that learners who can signal confusion and request clarification stay in conversations longer and acquire more input. These phrases are force multipliers.

---

## Unit 2: Who Am I? — Essere & Introductions

**Goal:** Introduce yourself (name, city of origin) and others. Ask and answer "Who is this?" and "Where are you from?"

**Grammar:** Subject pronouns (io, tu, lui, lei, Lei, noi, voi, loro) and the full present tense of *essere* (sono, sei, è, siamo, siete, sono).

**Vocabulary:** pronouns, essere forms, introduction phrases, a few professions

**Prerequisites:** Unit 1 (greetings, formal/informal awareness)

**Why this unit exists:** Essere is the #1 most frequent Italian verb and the foundation of identity statements ("I am Marco," "She is a doctor," "We are from Rome"). Every A1 syllabus teaches essere first — it's the grammatical backbone everything else attaches to.

**IMPORTANT — What this unit does NOT teach:** Nationalities (italiano, americana, etc.) are *not* introduced here, even though the current content uses them. Nationality words are adjectives that require gender agreement (-o/-a/-e), which isn't taught until Unit 6. Instead, we use "Sono di Roma," "Sono di New York" (essere + di + city) to express origin. This is equally natural Italian and avoids teaching agreement before its time.

### Lesson 1: I Am, You Are — Io sono, Tu sei

The first real grammar lesson. Introduces just 2 subject pronouns (io, tu) and 2 verb forms (sono, sei). Keeping it to 2 forms avoids cognitive overload — learners need to internalize the concept of verb conjugation itself before expanding the paradigm.

- **Vocabulary:** io, tu, sono, sei, mi chiamo, di, dove
- **Grammar:** Subject pronoun + essere (1st/2nd person singular only). Pronoun dropping: "Sono Marco" is more natural than "Io sono Marco" — Italian verb endings carry the person information, so pronouns are optional emphasis.
- **Key phrases:** "Mi chiamo..." (taught as a chunk — the reflexive grammar is explained much later in Unit 9), "Sono di [città]"
- **Why just 2 forms:** Research on working memory (Miller 1956, Cowan 2001) suggests 3-4 new items is optimal per learning episode. Two pronoun-verb pairs plus "mi chiamo" and "sono di" is exactly 4 new patterns. Learners master these before moving on.

### Lesson 2: He Is, She Is — Lui è, Lei è

Extends to third person. Also tackles the notorious lei/Lei ambiguity (she vs formal you) head-on, in context, where it makes sense.

- **Vocabulary:** lui, lei, Lei (formal), è, questo/questa, chi, anche
- **Grammar:** 3rd person singular è. Demonstratives questo/questa as chunks ("Questo è Marco, questa è Maria") — gender agreement is noted but not formally taught yet.
- **Key concept:** lei (she) vs Lei (formal you) — identical pronunciation, distinguished by context and capitalization in writing. Teach it here because learners encounter it immediately in real Italian and it causes confusion if not addressed.
- **Why this sequence:** Going io → tu → lui/lei follows natural conversation flow: you talk about yourself first, then your interlocutor, then others. It's also the standard textbook progression (Nuovo Espresso, Prego, Chiaro!).

### Lesson 3: We, You (plural), They — The Full Picture

Completes the essere paradigm with plural forms. Heavier on review and consolidation because the full 6-form paradigm is a lot to hold at once.

- **Vocabulary:** noi, voi, loro, siamo, siete, professions (dottore/dottoressa, studente/studentessa, insegnante)
- **Grammar:** Full essere paradigm. Note that "sono" does double duty (io sono / loro sono) — this is a common confusion point that needs explicit drilling.
- **Key concept:** Introducing professions here uses essere naturally ("Sono un insegnante," "Lei è dottoressa") and previews gender patterns (-ore/-oressa, -ente) without requiring formal adjective agreement. The article with professions is variable in Italian (both "Sono dottore" and "Sono un dottore" work).
- **Why professions:** They're among the first things people say about themselves after name and origin. They also let us practice all essere forms ("Noi siamo studenti," "Loro sono insegnanti") with meaningful content rather than abstract drills.

### Lesson 4: Introductions Practice

A consolidation lesson. No new grammar. Heavy on production exercises (type_answer, arrange_words) and realistic mini-dialogues. Recycles all of Unit 1 + Unit 2 vocabulary.

- **Focus:** Formal vs informal introductions (Ciao, mi chiamo... vs Buongiorno, sono...), introducing others (Questo è il mio amico Marco — taught as a chunk), asking follow-up questions (Di dove sei? Chi è?)
- **Why a consolidation lesson:** Essere is used in virtually every subsequent unit. Shaky essere = shaky everything. The investment in a full practice lesson pays dividends throughout A1. Here it's all review, which is appropriate at this early stage.

---

## Unit 3: Things — Nouns, Gender & Articles

**Goal:** Name everyday objects using the correct article. Understand that every Italian noun has a grammatical gender and that articles must match.

**Grammar:** Grammatical gender (masculine/feminine), indefinite articles (un, uno, una, un'), definite articles (il, lo, la, l', i, gli, le), plural formation (-o→-i, -a→-e, -e→-i).

**Vocabulary:** common objects, basic environmental nouns

**Prerequisites:** Unit 2 (essere — needed for "È un libro," "Sono i libri")

**Why this unit exists:** The article+gender system is the structural backbone of Italian. Every noun, every adjective, every possessive, every pronoun must agree in gender and number. Getting this right early is critical because errors here cascade into everything that follows. Standard Italian textbooks (Nocchi's *Grammatica Pratica*, Trifone & Palermo's *Grammatica di base*) all treat this as the first major grammar topic after essere.

**Why it gets extra time:** This is genuinely the densest grammar topic in A1. Italian has 7 definite articles (vs English "the") and 4 indefinite articles (vs English "a/an"). Rushing it causes persistent errors.

### Lesson 1: Masculine & Feminine

The foundational concept: every Italian noun is either masculine or feminine. Start with the clearest patterns only.

- **Vocabulary:** libro, tavolo, telefono, ragazzo, amico (masc), penna, sedia, borsa, ragazza, amica (fem)
- **Grammar:** Pattern rules: most -o nouns are masculine, most -a nouns are feminine. Indefinite articles: un (masc) / una (fem). "È un libro." "È una penna."
- **Why start here:** The -o/-a pattern covers ~70% of Italian nouns. By giving learners this rule first with clean examples, they build a reliable default instinct. Exceptions (-e nouns, irregular gender) come in Lesson 3 after the default is solid.
- **Exercise focus:** Heavy on multiple_choice (recognition: "Is 'libro' masculine or feminine?") and type_answer ("What is 'a book' in Italian?"). Production is limited to single article+noun pairs.

### Lesson 2: The Full Article System

Introduces all 7 definite articles and the remaining indefinite articles (uno, un'). This is the single hardest lesson in A1 — it deserves more exercises.

- **Vocabulary:** studente, zaino, specchio (lo/uno triggers), uomo, donna, acqua (l' triggers), casa, chiave, porta, finestra
- **Grammar:**
  - Definite articles: il (default masc), lo (before s+consonant, z, gn, ps, x), la (default fem), l' (before vowel, both genders)
  - Indefinite: uno (same triggers as lo), un' (feminine before vowel)
- **Key concept:** The "lo/uno" rule trips up every learner. Rather than memorizing abstract rules, teach it with the most common trigger words: lo studente, lo zaino, lo specchio. The rule is phonological (Italian avoids consonant clusters at word boundaries) — explaining the *why* helps retention.
- **Why this is a lot:** 7 definite articles where English has 1. This needs dedicated drilling, more than a typical lesson.

### Lesson 3: One and Many — Plurals

Plural formation plus the plural articles (i, gli, le). Now learners can talk about "the books," "the chairs," "the friends."

- **Vocabulary:** libri, tavoli, penne, sedie, amici, amiche, studenti, chiavi, uomini, donne
- **Grammar:**
  - Regular plurals: -o→-i, -a→-e, -e→-i
  - Plural articles: i (default masc pl), gli (before vowel/s+cons/z), le (all fem pl)
  - Common irregulars: uomo→uomini
- **Key concept:** The -e nouns (la chiave, il cane) are the tricky ones — they can be either gender and their plural is always -i regardless. Teach gender as a property you learn *per noun* (with its article), not a rule you can always predict.
- **Why now:** Plurals are prerequisite for adjective agreement (Unit 6), possessives with family (Unit 8: "i miei fratelli"), and verb conjugation practice (Unit 10: "noi parliamo, loro parlano").

### Lesson 4: Things Around Me

Consolidation using real-world contexts. The grammar is done — this lesson applies it to practical scenarios: describing what's in a room, what's in your bag, what's on the table.

- **Vocabulary:** stanza, camera, letto, cucina, bagno, giardino
- **Grammar review:** All articles (definite + indefinite, singular + plural) with the vocabulary from this and previous lessons. Introduces c'è (there is) and ci sono (there are) as useful chunks.
- **Why c'è/ci sono here:** "C'è un libro sul tavolo" / "Ci sono tre sedie" are the most natural way to talk about objects in a space. They use the article system extensively, making them perfect consolidation material. These phrases also recur constantly in Unit 13 (Finding Your Way).
- **Exercise focus:** More production (type_answer, arrange_words, fill_blank). Sentences get slightly longer: "Ci sono due libri sul tavolo."

---

## Unit 4: Counting — Numbers 0-100

**Goal:** Use Italian numbers for age, prices, phone numbers, and addresses.

**Grammar:** None. Numbers are pure vocabulary memorization with pattern rules for 21-100.

**Vocabulary:** numbers 0-20 individually, then pattern words for 21-100

**Prerequisites:** None technically, but placed here because numbers are needed for avere + age in Unit 5.

**Why this is its own unit (not bundled with avere):** Numbers and avere have completely different learning modalities. Numbers are rote vocabulary memorization (11 unique words for 0-10, then patterns). Avere is verb conjugation + idiomatic expressions. Bundling them creates a unit with no thematic unity. Separating them lets each topic get the focused practice it needs.


### Lesson 1: Numbers 0-20

Each of these 21 numbers is a unique word that must be memorized individually. No patterns exist below 20. Fewer exercises because the task is pure memorization — SRS handles the long-term retention.

- **Vocabulary:** zero, uno, due, tre, quattro, cinque, sei, sette, otto, nove, dieci, undici, dodici, tredici, quattordici, quindici, sedici, diciassette, diciotto, diciannove, venti
- **Key concept:** "Sei" means both "six" and "you are" (from essere). Context disambiguates, but learners should be aware.
- **Exercise focus:** Multiple_choice for recognition, type_answer for recall. Matching exercises (number ↔ word). Practical contexts: phone numbers, addresses, bus numbers.

### Lesson 2: Numbers 21-100 & Using Numbers

After 20, Italian numbers follow predictable patterns. Teach the pattern, drill the key ones, and practice in realistic contexts.

- **Vocabulary:** ventuno, ventidue, trenta, quaranta, cinquanta, sessanta, settanta, ottanta, novanta, cento, numero, quanto/quanta
- **Grammar pattern:** [tens] + [units], dropping the final vowel of the tens before uno/otto: ventuno, ventotto (not "ventiuno"). Tre takes an accent when appended: ventitré, trentatré.
- **Practical contexts:** Prices ("Costa venti euro"), age ("Ho venticinque anni" — previewing Unit 5), addresses ("Via Roma, numero trentadue"), counting objects with già-known nouns ("Ci sono quaranta studenti").
- **Why stop at 100:** Numbers beyond 100 (mille, milione) are A2. The 0-100 range covers virtually all A1 practical needs.

---

## Unit 5: Having & Needing — Avere

**Goal:** Express possession, state your age, and talk about physical/emotional states using avere idioms.

**Grammar:** Present tense of avere (ho, hai, ha, abbiamo, avete, hanno).

**Vocabulary:** avere forms, age expressions, idiomatic states

**Prerequisites:** Unit 2 (essere — for contrast), Unit 4 (numbers — for age)

**Why this unit exists:** Avere is the #2 most frequent Italian verb and, together with essere, forms the auxiliary system for all compound tenses (A2). Beyond "to have," it's used idiomatically for age, hunger, thirst, cold, heat, fear, and need — expressions where English uses "to be." These idioms are among the most common A1 phrases and are a major source of interference errors for English speakers ("I am hungry" → *"Sono fame"* instead of "Ho fame").

### Lesson 1: I Have, You Have — Ho, Hai, Ha

Introduces avere singular forms with concrete possessions. Keeping it to 3 forms (like Unit 2 Lesson 1 did for essere) respects working memory limits.

- **Vocabulary:** ho, hai, ha, avere, cane, gatto, macchina, bicicletta, fratello, sorella
- **Grammar:** Avere singular: ho, hai, ha. The silent H: ho/hai/ha/hanno all have a silent initial H, existing only to distinguish them in writing from o (or), ai (to the), a (to/at), anno (year).
- **Key concept:** Contrast with essere: "Sono Marco" (identity) vs "Ho un cane" (possession). These verbs will be confused constantly — start the contrast drills early.
- **Practical sentences:** "Ho un cane." "Hai una macchina?" "Ha un fratello."

### Lesson 2: We Have, They Have — Full Paradigm

Completes the avere paradigm and drills the full 6-form conjugation through mixed exercises.

- **Vocabulary:** abbiamo, avete, hanno, tempo, problema, idea, soldi, ragione
- **Grammar:** Full avere paradigm. Emphasis on "hanno" (they have) vs "anno" (year) — a common written error even for native Italian children.
- **Exercise focus:** Fill_blank drills with mixed essere/avere: "Io ___ un cane" (ho) vs "Io ___ italiano" (sono). This contrast is the highest-value drill at this stage.

### Lesson 3: How Old Are You? & Avere Idioms

The payoff lesson: avere is used for age and many physical/emotional states. This is where English speakers must rewire their instincts — Italian says "I have 25 years" not "I am 25 years old," and "I have hunger" not "I am hungry."

- **Vocabulary:** quanti anni hai, ho [X] anni, fame, sete, freddo, caldo, sonno, paura, bisogno (di), voglia (di), fretta, ragione
- **Grammar:** Avere + noun (no article!) for states: "Ho fame" (not *"Ho la fame"*). Age: "Ho venticinque anni" — uses numbers from Unit 4.
- **Key concept:** These are among the most frequent A1 expressions. The English interference is strong ("I am cold" → *"Sono freddo"* which actually means "I am emotionally cold/frigid"). Explicit contrastive analysis (Laufer & Girsai 2008) helps: show the English, show the Italian, explain why they're different.
- **Why this is the longest lesson:** There are ~10 common avere idioms, each requiring dedicated practice because English interference makes them non-obvious.

---

# Section 2: People & Relationships (Units 6–8)

**Mode:** situational. **Can-do at section end:** Learner can describe people and things, talk about where people are from, and talk about their family — in conversation, not as isolated grammar.

---

## Unit 6: Describing People & Things

- **Situation:** Describing a friend, a family member, or an object to someone who hasn't met/seen them.
- **Can-do:** Describe physical appearance, personality, size, and colour. "Mia sorella è alta e simpatica." "Ho una macchina rossa."
- **Grammar (focus-on-form lesson):** Adjective agreement (-o/-a/-i/-e), 2-form -e adjectives, invariable adjectives (blu, rosa, viola), adjective position (after the noun by default).
- **Vocabulary:** appearance (alto, basso, grande, piccolo…), personality (simpatico, intelligente, contento…), colours, common qualities (nuovo, vecchio, bello).
- **Tutor scenario (voluntary):** Describe a person the tutor "can't see" — the tutor asks follow-up questions.

## Unit 7: Where We're From

- **Situation:** Small talk with someone new — where you're from, what languages you speak.
- **Can-do:** State and ask nationality and origin. "Sono italiano, e tu?" "Parli inglese?"
- **Grammar (focus-on-form lesson):** Nationality adjectives as a *direct application* of Unit 6 agreement (italiano/a, inglese); countries; `di`/`in` with places; `parlare` + language.
- **Vocabulary:** countries, nationalities, languages, "di dove sei?".
- **Tutor scenario (voluntary):** A first-meeting exchange — names, origins, languages.

## Unit 8: My Family

- **Situation:** Telling someone about your family.
- **Can-do:** Name and describe family members, say whose they are. "Mia madre si chiama Anna." "I miei fratelli sono grandi."
- **Grammar (focus-on-form lesson):** Possessive adjectives (mio/tuo/suo/nostro/vostro/loro), and the family-no-article rule (`mia madre`, but `i miei fratelli`, `la loro madre`).
- **Vocabulary:** family members, possessives.
- **Tutor scenario (voluntary):** Describe your family tree to the tutor.

---

# Section 3: Everyday Life (Units 9–12)

**Mode:** situational. **Can-do at section end:** Learner can describe their daily routine and free time, keep a simple conversation going, and talk about going places.

---

## Unit 9: A Day in My Life

- **Situation:** Telling someone what your typical day looks like.
- **Can-do:** Describe a daily routine with times. "Mi sveglio alle sette, faccio colazione, vado a lavorare."
- **Grammar (focus-on-form lesson):** Regular **-are verbs**, **reflexive verbs** (mi/ti/si…), **telling time** (Che ore sono? / alle…). This is the densest situational unit.
- **Vocabulary:** routine verbs, reflexive verbs, time expressions, parts of the day.
- **Tutor scenario (voluntary):** Walk the tutor through your morning.

## Unit 10: Work, Study & Free Time

- **Situation:** Talking about what you do — job, studies, hobbies.
- **Can-do:** Describe activities and interests. "Studio italiano." "Leggo molto." "Gioco a calcio."
- **Grammar (focus-on-form lesson):** Regular **-ere** and **-ire verbs**, including the **-isc-** pattern (capire, finire, preferire).
- **Vocabulary:** jobs, study, hobbies, sports.
- **Tutor scenario (voluntary):** Talk about your work/studies and what you do for fun.

## Unit 11: Keeping a Conversation Going

- **Situation:** Actively participating in a chat — asking back, saying how often, disagreeing.
- **Can-do:** Ask questions, answer in the negative, say how frequently you do things. "Quando ti svegli?" "Non lavoro il sabato." "Vado spesso al cinema."
- **Grammar (focus-on-form lesson):** Question words (dove, cosa, quando, come, perché), negation with `non`, frequency adverbs (sempre, spesso, qualche volta, mai).
- **Vocabulary:** question words, connectors (ma, o, perché, anche), frequency adverbs.
- **Tutor scenario (voluntary):** A back-and-forth Q&A where the learner must ask the tutor questions too.

## Unit 12: Out and About

- **Situation:** Talking about going out and doing things.
- **Can-do:** Say where you're going and what you're doing. "Vado al supermercato." "Cosa fai stasera?" "Esco con gli amici."
- **Grammar (focus-on-form lesson):** Key irregular verbs — fare, andare, venire, uscire, stare, dare, dire — and `andare a` + infinitive.
- **Vocabulary:** the 7 verbs + collocations (fare la spesa, fare colazione…), time-out words (stasera, domani, insieme).
- **Tutor scenario (voluntary):** Plan an evening out loud with the tutor.

---

# Section 4: Out in the World (Units 13–15)

**Mode:** situational. **Can-do at section end:** Learner can navigate a town — ask for directions, use transport, and arrange to meet someone.

---

## Unit 13: Finding Your Way

- **Situation:** Lost in an Italian town, asking for and giving directions.
- **Can-do:** Ask where things are and follow simple directions. "Dov'è la stazione?" "È a destra, vicino alla banca."
- **Grammar (focus-on-form lesson):** Simple prepositions (di, a, da, in, con, su, per, tra/fra), articulated prepositions (al, allo, della, nel…), c'è/ci sono recap.
- **Vocabulary:** places in a city, direction words (a destra, dritto, vicino a, davanti a).
- **Tutor scenario (voluntary):** Ask the tutor for directions to a place.

## Unit 14: Getting Around

- **Situation:** Using public transport, buying a ticket.
- **Can-do:** Talk about how you travel and buy a ticket. "Vado in treno." "Un biglietto per Roma, per favore."
- **Grammar (focus-on-form lesson):** Prepositions with transport (in macchina, in treno, a piedi), numbers/time review in a travel context.
- **Vocabulary:** transport, travel, ticket/station vocabulary.
- **Tutor scenario (voluntary):** Buy a train ticket from the tutor playing a clerk.

## Unit 15: Making Plans

- **Situation:** Inviting someone out and arranging when/where to meet.
- **Can-do:** Express wants, ability, obligation; arrange a meeting. "Vuoi venire al cinema?" "Non posso, devo lavorare." "Ci vediamo domani."
- **Grammar (focus-on-form lesson):** Modal verbs (volere, potere, dovere) + infinitive; days of the week.
- **Vocabulary:** modal verbs, days of the week, planning phrases.
- **Tutor scenario (voluntary):** Negotiate a plan to meet up with the tutor.

---

# Section 5: Daily Needs (Units 16–20)

**Mode:** situational. **Can-do at section end:** Learner can handle the core daily-needs scenarios of a trip to Italy — eating out, shopping, expressing preferences, small talk, and basic health.

---

## Unit 16: At the Café & Restaurant

- **Situation:** Ordering food and drink at a bar or restaurant.
- **Can-do:** Order politely, ask for the bill. "Vorrei un caffè." "Per me la pasta." "Il conto, per favore."
- **Grammar (focus-on-form lesson):** `vorrei` as a polite chunk (conditional grammar deferred to A2), partitive articles (del, della, dei… = "some").
- **Vocabulary:** food, drink, restaurant/bar vocabulary, meal names.
- **Tutor scenario (voluntary):** Order a full meal from the tutor playing a waiter.

## Unit 17: Shopping

- **Situation:** Buying things in a shop — clothes, groceries — and asking prices.
- **Can-do:** Ask for items and prices. "Quanto costa questo?" "Vorrei quella maglia rossa."
- **Grammar (focus-on-form lesson):** Demonstratives questo/quello, `quanto costa/costano`, recap of numbers (prices) and colours.
- **Vocabulary:** shops, clothing, money, sizes.
- **Tutor scenario (voluntary):** Buy an item of clothing, haggle over size/colour.

## Unit 18: Likes & Preferences

- **Situation:** Talking about what you like, love, and prefer.
- **Can-do:** Express likes and preferences. "Mi piace la pizza." "Mi piacciono i film italiani." "Preferisco il tè."
- **Grammar (focus-on-form lesson):** `piacere` (mi piace / mi piacciono — the "it pleases me" construction), `preferire`.
- **Vocabulary:** food/activities/things to like, preference verbs.
- **Tutor scenario (voluntary):** Compare tastes with the tutor.

## Unit 19: Weather & Small Talk

- **Situation:** Making small talk about the weather, seasons, and dates.
- **Can-do:** Describe the weather, say the date. "Fa caldo oggi." "C'è il sole." "Il mio compleanno è in agosto."
- **Grammar (focus-on-form lesson):** Weather expressions (`fa` caldo/freddo, `c'è` il sole/vento, `piove`), months, seasons, dates.
- **Vocabulary:** weather, seasons, months, calendar.
- **Tutor scenario (voluntary):** Chat about the weather and your favourite season.

## Unit 20: Feeling Good, Feeling Bad — A1 Capstone

- **Situation:** Saying how you feel, describing a problem at the pharmacy.
- **Can-do:** Describe physical state and symptoms. "Sto male." "Ho mal di testa." "Mi fa male la gola."
- **Grammar (focus-on-form lesson):** `stare` for health (recap from Unit 1, now full), avere idioms recap (`ho mal di…`, `ho fame/freddo`), `fare male`.
- **Vocabulary:** the body, ailments, pharmacy vocabulary.
- **Tutor scenario (voluntary):** The A1 final — a free conversation with the tutor covering self-introduction, routine, plans, and a problem to solve.

## Unit 21: Hotel & Travel

- **Situation:** Staying at a hotel and getting around as a tourist.
- **Can-do:** Book and check into a room, handle documents and luggage, ask about sights. "Vorrei una camera doppia." "Ecco il mio passaporto."
- **Grammar:** None new; recycles *vorrei*, prepositions, numbers and dates.
- **Vocabulary:** hotel and booking, documents and luggage, sightseeing.
- *Added after the original 20-unit plan. Whether it belongs at the end of A1 or opens A2 is open.*

---

# Appendix

## Vocabulary

Counts are **headwords/lemmas**: inflected forms (conjugations, plurals, agreement) are not separate vocabulary. The A1 target is a sourced A1 lemma list (to be chosen). The built units currently hold 772 vocabulary entries; these still need de-duplicating to lemmas and checking against that list.

## A1 Grammar Coverage Map

Every A1 grammar topic, and the unit that currently teaches it. This is the starting point for the A1 grammar units in the upcoming restructure.

| Grammar topic | Unit |
|---|---|
| Greetings, formulaic chunks | 1 |
| Subject pronouns, *essere* | 2 |
| Gender, articles, plurals, c'è/ci sono | 3 |
| Numbers 0–100 | 4 |
| *Avere* + idioms | 5 |
| Adjective agreement, colours | 6 |
| Nationality adjectives, di/in + places | 7 |
| Possessive adjectives, family rule | 8 |
| Regular -are verbs, reflexives, telling time | 9 |
| Regular -ere/-ire verbs, -isc- pattern | 10 |
| Questions, negation, frequency adverbs | 11 |
| Irregular verbs (fare, andare, venire…) | 12 |
| Simple & articulated prepositions | 13 |
| Transport prepositions | 14 |
| Modal verbs, days of the week | 15 |
| Partitive articles, *vorrei* | 16 |
| Demonstratives questo/quello | 17 |
| *piacere*, *preferire* | 18 |
| Weather expressions, calendar | 19 |
| *stare* for health, *fare male* | 20 |

Content that reaches beyond A1 and should be reviewed: the imperative (unit 13, lesson 5) and *sembra che* (unit 11, lesson 5, a subjunctive trigger).

## Open Design Questions

- Where unit 21 (Hotel & Travel) belongs: end of A1 or start of A2.
- How the units map onto chapters and grammar units in the restructure.
- SRS lemma model and the AI tutor: see the development plan.

## A1 Can-Do Goals

By the end of A1 a learner should be able to do the following. (Section checkpoints were removed from the app; these goals are planned to become progress milestones.)
- Introduce yourself and others (name, origin, nationality, profession, age)
- Describe people and things (appearance, personality, colours, size)
- Talk about family using possessives
- Describe daily routine with times, work, and free time
- Keep a simple conversation going (questions, frequency, negation)
- Ask for and give directions, use transport, make plans
- Order food, shop, express preferences, make small talk, describe how they feel

This aligns with CEFR A1: "Can understand and use familiar everyday expressions and very basic phrases aimed at the satisfaction of needs of a concrete type. Can introduce him/herself and others and can ask and answer questions about personal details. Can interact in a simple way provided the other person talks slowly and clearly and is prepared to help."

## Sources

The grammar progression is informed by:
- **Nuovo Espresso 1** (Alma Edizioni) — standard Italian A1 textbook progression
- **Grammatica Pratica della Lingua Italiana** (Susanna Nocchi, Alma Edizioni) — exercise patterns per grammar topic
- **CEFR A1 Can-Do Statements** (Council of Europe) — communicative outcomes
- **De Mauro's Vocabolario di Base** — word frequency and selection
- **Prego! An Invitation to Italian** (McGraw-Hill) — university Italian course progression
- Communicative/notional-functional design — Canale & Swain (1980), Wilkins' notional syllabus; lexical approach — Lewis (1993)
