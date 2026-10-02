# Review: Avere and Nouns & the article system

Files reviewed:
- `frontend/src/data/grammar/a1-avere.md`, `a1-avere.practice.json` (47 practice + 15 mastery)
- `frontend/src/data/grammar/a1-nouns-articles.md`, `a1-nouns-articles.practice.json` (54 practice + 17 mastery)

No grammatical errors were found in either unit's Italian sentences, forms, accents or apostrophes. Every finding below is about rules stated too absolutely, missing common exceptions, or wording that could mislead.

Note: answer validation already normalises typographic apostrophes (`’` → `'`) in `engine/validation.ts`, so answers like `un'` / `l'` are safe on that front.

---

## Unit: Avere (`a1-avere`)

### 1. "Ho fame, never Ho la fame": "never" is too absolute
- **Location:** Avere expressions, the paragraph after the examples ("The noun comes straight after the verb with **no article**: *Ho fame*, never *Ho la fame*.")
- **Severity:** should fix. **Confidence:** high
- **What's wrong:** *Ho la fame* is wrong, but the exclamatory *Ho una fame!*, *Ho una sete!*, *Ho una fame da lupi!* ("I'm starving!") is very common everyday Italian. A learner who reads "no article, never" will later think these are errors. *Avere sonno* works the same way (*Ho un sonno!*).
- **Fix:** "The noun comes straight after the verb with **no article**: *Ho fame*, not *Ho la fame*. (In exclamations you'll also hear *Ho una fame!*, 'I'm starving!', but the plain form never takes *la*.)"

### 2. "*Anni* is always needed": not true in short answers
- **Location:** What avere is used for, the **Age** paragraph ("*Anni* (years) is always needed: *Ho venticinque* on its own is not a sentence.") and Typical mistakes row "Ho venti. → Ho vent'anni."
- **Severity:** minor. **Confidence:** medium-high
- **What's wrong:** In a full sentence with *ho*, *anni* is expected. But the most natural reply to *Quanti anni hai?* is often just *Venticinque.*, or *Ne ho venticinque.* (with *ne* standing in for *anni*). "Always" is stronger than real usage.
- **Fix:** "In a full sentence, *anni* (years) is needed: *Ho venticinque anni*, not *Ho venticinque*. (In a quick reply, Italians often just say the number: *Quanti anni hai? Venticinque.*)" The p-15 distractor *Ho venticinque.* can stay as a wrong option, since the prompt asks for a full sentence.

### 3. "Ha un cane and A casa sound the same"
- **Location:** Avere: to have, the paragraph after the h table
- **Severity:** minor. **Confidence:** high
- **What's wrong:** The two phrases don't sound the same as wholes. Only *ha* and *a* do. A beginner could find this confusing.
- **Fix:** "*Ha* in *Ha un cane* (he has a dog) and *a* in *A casa* (at home) sound exactly the same but are different words."

### 4. "Sono giusto means 'I'm fair'"
- **Location:** Typical mistakes, row "Sono giusto. ("I'm right")"
- **Severity:** minor. **Confidence:** medium
- **What's wrong:** *Sono giusto* on its own is not idiomatic for "I'm fair". Italians would say *sono una persona giusta* or *sono onesto/corretto*. The real point is simply that "right" in this sense is *avere ragione*.
- **Fix:** Why column: "Being right is *avere ragione*. *Giusto* means 'correct' or 'fair' and describes things or people, not 'being right' in an argument." Or drop the gloss "*Sono giusto* means 'I'm fair'".

### 5. The h "exists only" to tell the forms apart (optional)
- **Location:** Avere: to have ("It exists only to tell these forms apart…")
- **Severity:** minor. **Confidence:** medium
- **What's wrong:** Historically the h comes from Latin *habere*. In modern spelling it's kept *as* a diacritic to separate ho/o, hai/ai, ha/a, hanno/anno, so the statement is functionally true. "Only" is a small overstatement and harmless at A1. Optional fix: "Today it's kept to tell these forms apart…".

### Checked and fine (no action)
- All forms, translations, elisions (*vent'anni*, *ottant'anni*, *trent'anni*, *quarant'anni*) and the alternative accepted answers (*venti anni*, *quaranta anni*, *d'aiuto*, *voglia di caffè*) are correct.
- *Molto/molta* agreement (*molta fame*, *molto freddo*, *molto sonno*) is correct and well explained.
- The hot/cold avere/essere/fare table is accurate, and so is the note that *Sono freddo* describes personality.
- The noun → avere, adjective → essere heuristic is a sound, honest simplification. The *affamato* caveat is accurate.
- Distractors in p-15, p-23, p-31, p-32, p-33, m-10, m-11 are all genuinely wrong for the situation given. None is an acceptable alternative.
- p-41 *No, non abbiamo un cane.* is natural. (*No, non abbiamo cani* would also be natural. If the validator falls back to the LLM it should accept that, and it doesn't need adding.)

### Overall assessment: Avere
This unit is accurate and well pitched. I found no wrong Italian anywhere in the reading or the 62 exercises. The explanations (silent h, avere expressions, the three-way hot/cold split, noun vs adjective) are clear and true to real usage, and the exercises are unambiguous with genuinely wrong distractors. The only notable issue is the absolute "never *Ho la fame*", which should allow for the very common *Ho una fame!*. The age "always *anni*" claim could also be softened. Everything else is polish.

---

## Unit: Nouns & the article system (`a1-nouns-articles`)

### 1. -co/-go plurals: the "usually -chi/-ghi" rule is misleading. Give the stress tendency instead.
- **Location:** Plurals, "Spelling to keep the sound" paragraph; also the Summary ("-co → -chi or -ci")
- **Severity:** should fix. **Confidence:** high
- **What's wrong:** The text says -co/-go nouns "usually" take -chi/-ghi and that *amico*, *medico* are odd exceptions. In fact the split follows the stress, as a strong tendency. Nouns stressed on the second-to-last syllable keep the hard sound (*parco → parchi*, *lago → laghi*), with a few exceptions (*amico → amici*, *nemico → nemici*, *greco → greci*). Nouns stressed on the third-to-last syllable usually soften (*medico → medici*, *tecnico → tecnici*, *psicologo → psicologi*). As written, the rule predicts *psicologhi*, which clashes with *gli psicologi* in the unit's own mastery item m-05. *Medico* isn't an exception at all.
- **Fix:** "Nouns in *-co* and *-go* depend on the stress. If the stress falls on the second-to-last syllable, they usually keep the hard sound: *parco → parchi* (park), *lago → laghi*. If it falls earlier, they usually soften: *medico → medici*, *psicologo → psicologi*. The big exception is **amico → amici**. Learn these as you meet them." Update p-15's hint to "The big exception: -co → -ci." Summary: "*-co/-go → -chi/-ghi* or *-ci/-gi* (*parchi*, but *amici*, *medici*)".
- **Source:** Treccani, "-co, -go, plurale dei nomi in" (La grammatica italiana): https://www.treccani.it/enciclopedia/co-go-plurale-dei-nomi-in_(La-grammatica-italiana)/; Accademia della Crusca, "Plurale dei nomi in -co e -go": https://accademiadellacrusca.it/it/consulenza/plurale-dei-nomi-in-co-e-go/39

### 2. -io plurals: missing the stressed-i exception, and the unit itself uses *zio*
- **Location:** Plurals, "**Nouns in -io** lose the *o*"; Summary "*-io → -i*"
- **Severity:** should fix. **Confidence:** high
- **What's wrong:** When the *i* is stressed, the plural is *-ii*: *zio → zii* (uncles / uncle and aunt). *Lo zio* appears in the "Il or lo?" table of this same unit, so a learner applying the rule would write *gli zi*.
- **Fix:** "**Nouns in -io** usually lose the *o*: *figlio → figli*, *negozio → negozi* (shop). When the *i* is stressed, it stays: *zio → zii*."
- **Source:** Treccani, "-io, plurale dei nomi in": https://www.treccani.it/enciclopedia/plurale-dei-nomi-in-io_(La-grammatica-italiana)/

### 3. "-ione is feminine" is stated as absolute
- **Location:** Masculine and feminine ("**-ione** is feminine"); Summary ("*-ione* is feminine and *-ore* masculine"); hint on p-03 ("Nouns in -ione are feminine.")
- **Severity:** should fix. **Confidence:** high
- **What's wrong:** Nouns in *-zione* / *-sione* are essentially always feminine. But some common *-ione* nouns are masculine: *il milione* (which learners will meet with numbers), *il campione* (champion), *lo scorpione*. "Simple, but true" calls for "usually" or the narrower ending.
- **Fix:** "**-ione** is usually feminine (and *-zione*, *-sione* almost always): *stazione* (station), *lezione* (lesson). An exception you'll meet: *il milione*." Summary: "*-ione* is usually feminine". p-03 hint: "Nouns in -zione are feminine."
- **Source:** dictionary gender of *milione*, *campione* (m.) in the Vocabolario Treccani. This is standard and not in doubt.

### 4. -ista nouns: "the same for both" hides that the article and the plural change
- **Location:** Masculine and feminine ("Nouns in *-ista* and *-ante* are the same for both: *turista*, *insegnante*."); p-07
- **Severity:** should fix. **Confidence:** high
- **What's wrong:** The singular noun is the same, but gender still shows in the article (*il turista / la turista*, *un insegnante / un'insegnante*). The *-ista* plurals also differ: *i turisti / le turiste*. The plural section only says "masculine nouns in -a take -i", so a learner can't work out *le turiste*. In a unit about learning gender with the article, "the same for both" suggests gender doesn't matter here.
- **Fix:** "Nouns in *-ista* and *-ante* have one form for both, and the article shows who you mean: *il turista / la turista*, *l'insegnante / un'insegnante*. In the plural, *-ista* splits: *i turisti*, *le turiste*." Similar nouns in *-ente* (*il/la cliente*) could be added.

### 5. "Countries take the article… Cities don't": both absolute
- **Location:** When to use the article, **Countries and cities**; Summary ("Yes for… countries… No with cities")
- **Severity:** should fix. **Confidence:** high
- **What's wrong:** This is a strong tendency, but there are common exceptions. Countries without the article: *Israele*, *Cuba*, *Malta*, *Cipro*, *San Marino*. Cities with it: *L'Aquila*, *La Spezia*, *Il Cairo*, *L'Avana*. Treccani notes that article use with place names follows usage rather than generalisable rules.
- **Fix:** "Countries usually take the article: *l'Italia*, *la Francia*, *gli Stati Uniti*. Cities usually don't: *Roma*, *Londra*. (A few exceptions are learned one by one: *Israele*, *Cuba* and *Malta* have no article; *L'Aquila* and *La Spezia* do.)" Summary: "usually yes for countries… usually no with cities".
- **Source:** Treccani, "Come mai Malta non ha un articolo?": https://www.treccani.it/magazine/lingua_italiana/domande_e_risposte/grammatica/grammatica_685.html; Accademia della Crusca, "Israele: Stato senza l'articolo determinativo": https://accademiadellacrusca.it/it/consulenza/israele-stato-senza-larticolo-determinativo/33638

### 6. "Names have no article": true for standard Italian, but very common regional usage is not mentioned
- **Location:** When to use the article, **People** ("Names have no article: *Marco è di Roma*.")
- **Severity:** minor. **Confidence:** high
- **What's wrong:** The rule is correct for standard and written Italian. But in casual speech in the north (and Tuscany), *la Giulia*, *il Marco* are everyday usage, especially with women's names. Learners who visit Milan will hear it constantly and may think the course is wrong.
- **Fix:** add: "(In the north you'll often hear *la Giulia*, *il Marco* in casual speech. It's regional and best avoided in writing.)"
- **Source:** Treccani, Domande e risposte, grammatica_058: https://www.treccani.it/magazine/lingua_italiana/domande_e_risposte/grammatica/grammatica_058.html; Accademia della Crusca, "L'articolo prima di un prenome": https://accademiadellacrusca.it/it/consulenza/larticolo-prima-di-un-prenome/98

### 7. "That's why… you say your nationality instead of di + a country": muddled causal link
- **Location:** When to use the article, **Countries and cities** ("That's why *Sono di Roma* has no article, and why you say your nationality instead of *di* + a country.")
- **Severity:** minor. **Confidence:** medium
- **What's wrong:** The first half is fine. The second half implies the article is the reason Italians use the nationality adjective, which isn't really true and is hard for a beginner to follow. (*Sono dell'Italia* is just not idiomatic.)
- **Fix:** "That's why *Sono di Roma* has no article. For a country, Italians say the nationality instead: *Sono italiano*, not *Sono dell'Italia*."

### 8. Feminine-only scope of "-ca/-ga → -che/-ghe"
- **Location:** Plurals, "In *-ca* and *-ga* an *h* is added"
- **Severity:** minor. **Confidence:** medium
- **What's wrong:** This is true for feminine nouns, which is what the text means. Masculine nouns in -ca/-ga follow -i (*il collega → i colleghi*, *il belga → i belgi*). These are rare at A1, so this is optional. A one-word fix keeps it true.
- **Fix:** "In feminine nouns in *-ca* and *-ga* an *h* is added…"

### 9. Optional: other titles shorten too
- **Location:** When to use the article, **People** ("*Signore* becomes **signor** before a name")
- **Severity:** minor. **Confidence:** high
- **What's wrong:** Nothing is wrong. The same truncation applies to *dottore → il dottor Bianchi* and *professore → il professor Rossi*, which learners meet immediately (and *dottore* is taught in this unit). A one-line addition would make it complete: "Titles in *-ore* do the same: *il dottor Bianchi*, *il professor Neri*."

### Checked and fine (no action)
- Il/lo/l' rules, including *lo gnocco*, *lo psicologo*, *lo yogurt*, *lo iogurt*, *lo xilofono*, and the *gli/i pneumatici* note (accurately flagged as variable usage). The "sound straight after it" point (*il bravo studente*) is correct.
- Indefinite and definite article tables, *un'* only for feminine, *le* never elided, *gli* for both *lo* and *l'*.
- Invariable nouns (accented, consonant-final, short forms incl. *il cinema*) and irregulars (*uomini*, *mani*, *le uova*) are correct.
- Masculine -a (*problema*, *programma*) and feminine -o (*mano*, *foto*, *radio*, *moto*) exceptions are correct.
- Language article usage (*parlo italiano* / *l'italiano è difficile*, *studio (l')italiano*) is accurate and correctly hedged with "usually".
- *C'è / ci sono* and *c'è vs dov'è* are accurate. Distractors (*Ci sono una farmacia?*, *È una farmacia?*, *C'è la stazione?*) are genuinely wrong for the prompts given.
- p-43 / p-44 / m-14 title exercises are correct, and the distractors are all wrong in standard Italian.
- p-46: both distractors are wrong (each has an article error), so it's unambiguous.

### Overall assessment: Nouns & the article system
The article system itself (il/lo/l'/la, un/uno/una/un', i/gli/le, the hard-start list) is correct and unusually complete for A1. Every Italian form and exercise answer I checked is right, and the exercises are unambiguous. The weak spots are the plural and gender rules, several of which are stated as absolutes where Italian has common exceptions: -co/-go (the stress tendency is missing, and *medico* is presented as an exception), -io (*zio → zii*, with *zio* in the unit itself), -ione (*il milione*), -ista (gender still shows in the article and plural), and countries/cities with the article. These are exactly the "simple, but true" cases the course wants to get right. Each needs a sentence or a "usually", not a restructure. Once those are fixed, the unit is in good shape for native-speaker review.
