"""Chapter 'My Family' (unit-08), after the grammar unit Possessives.

Available: units 1–12 (possessives: the article with possessives, no article with a single family
member, the article back in the plural and with loro, la mia mamma, suo for Lei), chapters 1–12
(fratello, sorella, figlio, figlia, genitori, sposato and bambino are already known; looks and
character adjectives come from Describing People & Things).
Not yet: piacere, reflexives (si chiama only as the fixed phrase), the imperative, the past.
Shopping, Getting Around and Weather come earlier in the course but were written in parallel, so
none of their words are used here. Cast facts used: Luca is 28, an engineer from Bologna living in
Florence; Paul is a doctor; Yuki (serious) and Aiko (funny) are sisters from Japan.
New cast facts: Luca's family in Bologna (father Franco, a doctor; mother Anna, a teacher; sister
Sara, married to Davide, children Giorgia 6 and Pietro 3; grandmother Rosa, 87; cousin Elena; the
dog Tortellino). Aiko and Yuki's family in Osaka (parents Kenji and Haruko, grandmother Sachiko,
the cat Momo).
"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from chapterlib import Lesson, V

U = 'unit-08'
D = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'out', U)
os.makedirs(D, exist_ok=True)
LESSONS = []
def lesson(n, name, role):
    L = Lesson(U, D, n, name, role); LESSONS.append(L); return L

# ── 1. Parents & Partners ──
L = lesson(1, 'Parents & Partners', 'words')
L.vocab = [
    V('famiglia', 'family · famiglie (plural)', 'La mia famiglia è piccola.'),
    V('padre', 'father', 'Mio padre è medico.'),
    V('madre', 'mother', 'Mia madre è di Napoli.'),
    V('mamma', 'mum, mom · la mia mamma, mia mamma', 'Ciao, mamma! Come stai?'),
    V('papà', 'dad · il mio papà, mio papà', 'Il mio papà lavora in banca.'),
    V('marito', 'husband', 'Suo marito è inglese.'),
    V('moglie', 'wife · mogli (plural)', 'Marco e sua moglie abitano a Roma.'),
    V('fidanzato', 'boyfriend; fiancé · fidanzata = girlfriend; fiancée', 'Sara ha un fidanzato molto simpatico.'),
    V('unico', 'only (one) · figlio unico, figlia unica = only child', 'Non ho fratelli: sono figlio unico.'),
]
L.meaning('fidanzata', 'Questa è Anna, la fidanzata di Marco.', ['girlfriend', 'fiancée', 'his girlfriend'], 'Fidanzato, for a woman.', ['fidanzato'])
L.meaning('figlia unica', 'Non ho fratelli: sono figlia unica.', ['only child', 'an only child', 'only daughter'], 'No brothers, no sisters.', ['unico'])
L.mc('How do you say "My father is a doctor"?', 'Mio padre è medico.', ['Il mio padre è medico.', 'Mia padre è medico.'],
     'One family member: no article. Mio agrees with padre.', ['padre'])
L.cloze('Complete: My mother is from Naples.', 'Mia ___ è di Napoli.', 'madre', 'Mother.', ['madre'])
L.mc('You introduce your wife to a colleague. What do you say?', 'Questa è mia moglie.', ['Questa è la mia moglie.', 'Questo è mio moglie.'],
     'One family member: no article.', ['moglie'])
L.cloze("Complete: Hi, mum! How are you?", 'Ciao, ___! Come stai?', 'mamma', 'Mum.', ['mamma'])
L.mc('A friend tells you about her husband. Which sentence is right?', 'Mio marito lavora in banca.', ['Mia marito lavora in banca.', 'Il mio marito lavora in banca.'],
     'Marito is masculine, and one family member takes no article.', ['marito'])
L.cloze('Complete: This is my family.', 'Questa è la mia ___.', 'famiglia', 'Family.', ['famiglia'])
L.line('A new colleague asks if you have a family. You are married: say what your husband or wife is called.',
       [{"speaker": "Colleague", "text": "Hai famiglia?"}, {"speaker": "You"}],
       ['Sì, sono sposato. Mia moglie si chiama Anna.', 'Sì, sono sposata. Mio marito si chiama Marco.'],
       'Sono sposato or sposata, then mio marito or mia moglie.', ['moglie', 'marito', 'famiglia'])
L.arrange("Arrange: 'My father and my mother work together.'", 'Mio padre e mia madre lavorano insieme.', ['il', 'la'],
          'One family member each: no article.', ['padre', 'madre'])
L.say('Say you are an only child.', ['sono figlio unico', 'sono figlia unica'], 'Unico agrees: figlio unico, figlia unica.', ['unico'])
L.say('Say: My dad is tall and my mum is short.', ['il mio papà è alto e la mia mamma è bassa', 'mio papà è alto e mia mamma è bassa'],
      'With papà and mamma the article is common.', ['papà', 'mamma'])
L.say('Say: My parents are from Rome.', ['i miei genitori sono di roma'], 'More than one: the article comes back.', [])

# ── 2. Grandparents, Uncles & Cousins ──
L = lesson(2, 'Grandparents, Uncles & Cousins', 'words')
L.vocab = [
    V('nonno', 'grandfather · nonna = grandmother · i nonni = grandparents', "Mio nonno ha ottant'anni."),
    V('zio', 'uncle · zia = aunt · gli zii = uncles, or uncle and aunt', 'Mia zia abita a Milano.'),
    V('cugino', 'cousin (man) · cugina = cousin (woman)', 'Mio cugino Marco è molto simpatico.'),
    V('nipote', 'grandchild; nephew, niece · il nipote, la nipote, i nipoti', 'La nonna ha cinque nipoti.'),
    V('parente', 'relative · i parenti', 'Ho molti parenti in Italia.'),
    V('anziano', 'elderly, old (of people)', 'Mio nonno è anziano, ma sta bene.'),
    V('in pensione', 'retired', 'Mia nonna è in pensione.'),
]
L.vocab[-1]['phrase'] = True
L.meaning('nipoti', 'La nonna ha cinque nipoti.', ['grandchildren', 'five grandchildren'], 'The children of her children.', ['nipote'])
L.meaning('in pensione', 'Mia nonna è in pensione.', ['retired'], 'She no longer works.', ['in pensione'])
L.cloze('Complete: My grandparents live in the country.', 'I miei ___ abitano in campagna.', 'nonni', 'More than one grandparent.', ['nonno'])
L.mc("Your aunt's son is your…", 'mio cugino', ['mio nipote', 'mio zio'], "Your aunt's children are your cousins.", ['cugino', 'nipote', 'zio'])
L.cloze('Complete: I have many relatives in Italy.', 'Ho molti ___ in Italia.', 'parenti', 'Relatives.', ['parente'])
L.mc("Your sister's daughter is your…", 'mia nipote', ['mia cugina', 'mia figlia'], 'Nipote: also a niece.', ['nipote', 'cugino'])
L.mc('How do you say "my uncles and aunts"?', 'i miei zii', ['miei zii', 'le mie zie'], 'A mixed group is masculine plural, with the article.', ['zio'])
L.add('writing', 'fill_blank', 'Complete with the article if one is needed.', '___ loro nonna abita a Osaka.', 'La', [],
      ['Their grandmother lives in Osaka.'], ['nonno'])
L.line('Luca asks about your grandparents. Your grandfather is ninety, and he is retired.',
       [{"speaker": "Luca", "text": "E i tuoi nonni? Sono anziani?"}, {"speaker": "You"}],
       ["Sì, mio nonno ha novant'anni ed è in pensione.", "Mio nonno ha novant'anni. È in pensione."],
       'Mio nonno: one person, no article.', ['nonno', 'in pensione'])
L.line('A friend asks if you have cousins. You have two: Marco and Sara.',
       [{"speaker": "Friend", "text": "Hai cugini?"}, {"speaker": "You"}],
       ['Sì, ho due cugini: mio cugino Marco e mia cugina Sara.', 'Sì, due: Marco e Sara.'],
       'Cugino and cugina.', ['cugino'])
L.arrange("Arrange: 'My grandparents are retired.'", 'I miei nonni sono in pensione.', ['nonno', 'mie'], 'More than one: the article comes back.', ['nonno', 'in pensione'])
L.say('Say your uncle is elderly, but very funny.', ['mio zio è anziano, ma molto divertente', 'mio zio è anziano ma è molto divertente'],
      'Mio zio: no article.', ['zio', 'anziano'])
L.say('Say: My aunt has three grandchildren.', ['mia zia ha tre nipoti'], 'Nipote: the plural ends in -i.', ['zio', 'nipote'])

# ── 3. Love, Kisses & Pets ──
L = lesson(3, 'Love, Kisses & Pets', 'words')
L.vocab = [
    V('amore', "love · Ciao, amore! = Bye, love! · ti amo = I love you (to a partner)", "L'amore è importante."),
    V('ti voglio bene', 'I love you (to family and friends)', 'Ciao, nonna! Ti voglio bene.'),
    V('bacio', 'kiss · baci = kisses; love (at the end of a message)', 'Tanti baci da Firenze!'),
    V('abbraccio', 'hug · un abbraccio = a hug; love (at the end of a message)', 'Un abbraccio, Emma'),
    V('affetto', 'affection · con affetto = with love (at the end of a letter)', 'Con affetto, la tua nonna'),
    V('animale', 'animal; pet · animali (plural)', 'Hai animali? Sì, un cane e due gatti.'),
]
L.vocab[1]['phrase'] = True
L.meaning('con affetto', 'Con affetto, la tua nonna', ['with love', 'with affection', 'love'], 'At the end of a letter.', ['affetto'])
L.meaning('animali', 'Hai animali? Sì, un cane e due gatti.', ['animals', 'pets'], 'A dog, a cat…', ['animale'])
L.cloze('Complete: Lots of kisses from Florence!', 'Tanti ___ da Firenze!', 'baci', 'Kisses: the plural of bacio.', ['bacio'])
L.mc('Your grandmother tells you she loves you. What does she say?', 'Ti voglio bene.', ['Ti voglio.', 'Sto bene.'],
     'For family and friends: volere bene.', ['ti voglio bene'])
L.cloze('Complete: Bye, love!', 'Ciao, ___!', 'amore', 'Love: also what partners call each other.', ['amore'])
L.mc('You end a short message to a good friend. What do you write?', 'Un abbraccio, a presto!', ['Un abbraccio, buongiorno!', 'Un abbraccio, piacere!'],
     'A hug, see you soon.', ['abbraccio'])
L.cloze('Complete: With love, your grandmother.', 'Con ___, la tua nonna', 'affetto', 'With affection.', ['affetto'])
L.line('A friend shows you a photo of her dog and asks if you have pets. You have a black cat.',
       [{"speaker": "Friend", "text": "Questo è il mio cane, Leo. E tu, hai animali?"}, {"speaker": "You"}],
       ['Sì, ho un gatto nero.', 'Sì, un gatto. È nero.'], 'Ho un gatto…', ['animale'])
L.arrange("Arrange: 'Lots of kisses to your parents!'", 'Tanti baci ai tuoi genitori!', ['tue', 'miei'], 'I tuoi genitori, with a + i = ai.', ['bacio'])
L.say('Tell your grandmother you love her.', ['ti voglio bene, nonna', 'nonna, ti voglio bene'], 'For family: volere bene.', ['ti voglio bene'])
L.say('End a message to a friend: a hug, and see you soon.', ['un abbraccio, a presto'], 'Un abbraccio.', ['abbraccio'])
L.say('Say love is important.', ["l'amore è importante"], 'Amore takes the article.', ['amore'])

# ── 4. Tell Me About Your Family (practice) ──
L = lesson(4, 'Tell Me About Your Family', 'practice')
L.line('A new friend asks if you have brothers or sisters. You have one brother, Tom.',
       [{"speaker": "Friend", "text": "Hai fratelli?"}, {"speaker": "You"}],
       ['Sì, ho un fratello. Si chiama Tom.', 'Sì, un fratello, Tom.'], 'Ho un fratello…', [])
L.line("The friend asks what your mother is called. She's called Sarah.",
       [{"speaker": "Friend", "text": "Come si chiama tua madre?"}, {"speaker": "You"}],
       ['Mia madre si chiama Sarah.', 'Si chiama Sarah.'], 'Mia madre: no article.', ['madre'])
L.line('Luca asks what your parents do. Your father is an engineer and your mother a teacher.',
       [{"speaker": "Luca", "text": "Che lavoro fanno i tuoi genitori?"}, {"speaker": "You"}],
       ['Mio padre è ingegnere e mia madre è insegnante.', 'Mio padre fa l\'ingegnere e mia madre fa l\'insegnante.'],
       'Mio padre, mia madre.', ['padre', 'madre'])
L.line('A friend asks what your sister is like. She is tall and blonde, and very funny.',
       [{"speaker": "Friend", "text": "Com'è tua sorella?"}, {"speaker": "You"}],
       ['È alta e bionda, e molto divertente.', 'Mia sorella è alta e bionda. È molto divertente.'], 'The adjectives agree with sorella.', [])
L.line('Your elderly neighbour shows you a photo. Ask her, politely, how old her grandson is.',
       [{"speaker": "Signora", "text": "Ecco mio nipote, Giorgio."}, {"speaker": "You"}],
       ['Quanti anni ha Suo nipote?', 'Che bello! Quanti anni ha Suo nipote?'], 'For Lei, your is suo.', ['nipote'])
L.line('The neighbour asks if you have children. You have a daughter, six years old.',
       [{"speaker": "Signora", "text": "E Lei ha figli?"}, {"speaker": "You"}],
       ['Sì, ho una figlia di sei anni.', 'Sì, una figlia. Ha sei anni.'], 'Una figlia… ha sei anni.', [])
L.mc("Tom and Lily are the children of Emma's sister Kate. How does Emma say who they are?", 'Sono i figli di mia sorella.',
     ['Sono i miei figli.', 'Sono i figli di mio fratello.'], 'Kate is her sister.', [])
L.mc('And what are Tom and Lily to Emma?', 'I miei nipoti.', ['I miei cugini.', 'I miei figli.'], 'The children of your sister.', ['nipote'])
L.fix('Fix the mistake.', 'La mia madre abita a Londra.', ['Mia madre abita a Londra.'], 'One family member.', ['madre'])
L.fix('Fix the mistake.', 'Miei genitori sono molto simpatici.', ['I miei genitori sono molto simpatici.'], 'More than one.', [])
L.line('A friend asks if your grandparents live with your parents. They live in the country.',
       [{"speaker": "Friend", "text": "I tuoi nonni abitano con i tuoi genitori?"}, {"speaker": "You"}],
       ['No, i miei nonni abitano in campagna.', 'No, abitano in campagna.'], 'I miei nonni: plural, with the article.', ['nonno'])
L.say("Say: Their mother is Italian.", ['la loro madre è italiana'], 'Loro keeps the article.', ['madre'])
L.say('Say: My wife and my son are in Italy.', ['mia moglie e mio figlio sono in italia'], 'No article for either.', ['moglie'])

# ── 5. Luca's Photo (reading: a scene) ──
L = lesson(5, "Luca's Photo", 'reading')
L.reading = {"title": "La foto di Luca", "paragraphs": [
    "Paul e Luca sono al bar in piazza San Marco. Luca ha il telefono in mano e cerca una foto.",
    "Luca: Ecco la mia famiglia, a Bologna. Questo è mio padre, Franco. Ha sessantadue anni e fa il medico, come te!",
    "Paul: Davvero? E la signora accanto a lui?",
    "Luca: È mia madre, Anna. Fa l'insegnante in una scuola vicino a casa.",
    "Paul: E questi due bambini?",
    "Luca: Sono i miei nipoti, Giorgia e Pietro, i figli di mia sorella Sara. Sara è sposata con Davide e abitano vicino ai miei genitori.",
    "Paul: E la signora anziana con il cane?",
    "Luca: È mia nonna Rosa. Ha ottantasette anni e abita con i miei genitori. È in pensione da tanto tempo, ma ogni domenica cucina per tutta la famiglia. E il cane è Tortellino. È piccolo e un po' grasso, ma è un amore.",
    "Paul: È una famiglia grande! E tu? Hai una fidanzata?",
    "Luca: No, per ora no. Ma c'è mia madre: telefona ogni sera, alle otto!",
    "In quel momento il telefono suona. Luca guarda Paul.",
    "Luca: Ecco, sono le otto. Pronto, mamma? Sì, sto bene… Sì, mangio… No, non lavoro troppo… Sì, anche Paul sta bene. Un bacio, mamma. Ciao!",
]}
L.vocab = [
    V('grasso', 'fat', 'Il gatto di Marco è un po\' grasso.'),
    V('per ora', 'for now', 'Per ora abito da solo.'),
    V('come', 'like, as · come te = like you · come sempre = as always', 'Lavora troppo, come sempre.'),
]
L.vocab[2]['phrase'] = True
L.mc('Who is Franco?', "Luca's father", ["Luca's grandfather", "Luca's uncle"], "'Questo è mio padre, Franco.'", ['padre'])
L.mc("What does Luca's father do?", "He's a doctor, like Paul", ["He's an engineer, like Luca", "He's a teacher"], "'Fa il medico, come te!'", ['come'])
L.mc('Who are Giorgia and Pietro?', "The children of Luca's sister", ["Luca's cousins", "Luca's children"], "'I figli di mia sorella Sara.'", ['nipote'])
L.mc('True or false: Sara lives far from her parents.', 'False', ['True'], "'Abitano vicino ai miei genitori.'", [])
L.mc('What does nonna Rosa do every Sunday?', 'She cooks for the whole family', ['She phones Luca', 'She goes to the bar'], "'Ogni domenica cucina per tutta la famiglia.'", [])
L.mc('Does Luca have a girlfriend?', 'Not for now', ['Yes, in Bologna', 'Yes, in Florence'], "'No, per ora no.'", ['per ora'])
L.mc('Who phones at eight?', "Luca's mother", ["Luca's grandmother", "Luca's sister"], "'Pronto, mamma?'", [])
L.cloze('Complete from the text: for now, no.', 'No, per ___ no.', 'ora', 'For now.', ['per ora'])
L.cloze('Complete from the text: the dog is a bit fat.', "È piccolo e un po' ___.", 'grasso', 'Fat.', ['grasso'])
L.answer('Come si chiama la sorella di Luca?', ['Sara', 'si chiama Sara', 'la sorella di Luca si chiama Sara'], 'Read what Luca says about the two children.', [])
L.answer('Quanti anni ha la nonna di Luca?', ['ottantasette', 'ha ottantasette anni', 'ottantasette anni'], "Read the paragraph about nonna Rosa.", ['nonno'])
L.answer('Che cosa dice Luca alla fine?', ['un bacio, mamma', 'un bacio, mamma. ciao!'], 'The last line.', ['bacio'])

# ── 6. A Letter from Nonna (reading: a letter) ──
L = lesson(6, 'A Letter from Nonna', 'reading')
L.reading = {"title": "Caro Luca", "paragraphs": [
    "Bologna, 10 novembre",
    "Caro Luca,",
    "come stai? Come va il lavoro a Firenze? Qui a Bologna stiamo tutti bene. Io ho ottantasette anni, ma cucino ogni giorno, e la domenica a pranzo c'è tutta la famiglia.",
    "Tuo padre lavora troppo, come sempre: torna a casa alle nove di sera ed è molto stanco. Tua madre invece è contenta: quest'anno ha una classe nuova e gli studenti sono bravi.",
    "Tua sorella e Davide vengono qui ogni domenica con i bambini. Giorgia ha sei anni e adesso legge tutto: i libri, il giornale, anche le mie lettere! Pietro ha tre anni e gioca tutto il giorno con Tortellino.",
    "E Tortellino? Mangia tutto: la pasta, il pane, il formaggio… È un animale, ma per noi è come un altro nipote.",
    "Tua cugina Elena ha un fidanzato nuovo, un ragazzo di Modena. È simpatico e gentile, ma mangia poco. Non va bene!",
    "Quando vieni a Bologna? Perché non vieni a pranzo una domenica, con il tuo amico inglese, il medico? Io cucino i tortellini per tutti.",
    "Ti voglio tanto bene.",
    "Con affetto, la tua nonna",
    "P.S. Tua madre domanda: «Ma Luca mangia bene?»",
]}
L.vocab = [
    V('tortellini', 'tortellini (small filled pasta, from Bologna)', 'La domenica mangiamo i tortellini.'),
]
L.mc('Who writes the letter?', "Luca's grandmother", ["Luca's mother", "Luca's cousin"], "'La tua nonna.'", ['nonno'])
L.mc("How is Luca's father?", 'He works too much and is very tired', ['He is retired', 'He is happy with his new class'], "'Tuo padre lavora troppo.'", ['padre'])
L.mc("Why is Luca's mother happy?", 'She has a new class with good students', ['She has a new job in Florence', 'Luca phones every evening'], "'Ha una classe nuova.'", ['madre'])
L.mc('What does Giorgia do now?', 'She reads everything', ['She cooks', 'She plays with the dog all day'], "'Adesso legge tutto.'", [])
L.mc('True or false: Tortellino eats only meat.', 'False', ['True'], "'Mangia tutto.'", ['animale'])
L.mc("What does nonna think of Elena's new boyfriend?", "He's nice, but he doesn't eat much", ["He's nice and eats a lot", "He's not very nice"], "'Ma mangia poco. Non va bene!'", ['fidanzato'])
L.mc('What does nonna ask Luca?', 'Why he doesn\'t come to lunch one Sunday, with Paul', ['Why he doesn\'t phone', 'When Paul goes back to England'],
     "'Perché non vieni a pranzo una domenica?'", [])
L.cloze('Complete from the text: your father works too much, as always.', 'Tuo padre lavora troppo, ___ sempre.', 'come', 'As always.', ['come'])
L.cloze('Complete from the end of the letter.', 'Con ___, la tua nonna', 'affetto', 'With love.', ['affetto'])
L.answer('Chi è Elena?', ['la cugina di Luca', 'è la cugina di Luca', 'sua cugina'], 'Tua cugina Elena…', ['cugino'])
L.answer('Che cosa cucina la nonna per tutti?', ['i tortellini', 'tortellini'], 'Read the paragraph with the invitation.', ['tortellini'])
L.answer('Quanti anni ha Giorgia?', ['sei', 'sei anni', 'ha sei anni'], 'Read the paragraph about the children.', [])

# ── 7–8. Writing ──
L = lesson(7, 'Your Family', 'writing')
L.reading = {"title": "La mia famiglia (Aiko)", "paragraphs": [
    "Mio padre · Kenji, 55 anni. Fa l'ingegnere, lavora tanto e parla poco.",
    "Mia madre · Haruko, 52 anni. È insegnante di musica e ogni sera suona la chitarra.",
    "Mia sorella · Yuki, 26 anni. Studia italiano con me a Firenze. È seria e molto intelligente. Io sono la sorella divertente!",
    "Mia nonna · Sachiko, 80 anni. È piccola e allegra, e abita con i miei genitori.",
    "I miei zii e i miei cugini · abitano a Tokyo. Sono tanti!",
    "Momo · il nostro gatto, 12 anni. È un animale, ma per mia madre è il terzo figlio.",
    "La mia famiglia abita a Osaka, lontano da Firenze. Ogni domenica Yuki e io telefoniamo a casa: mia madre parla, mio padre ascolta e Momo dorme.",
]}
L.write('Aiko wrote about her family for Giulia\'s class. Now present your own family: who is in it, and one or two things about each person.',
        "Ho una famiglia piccola. Mio padre si chiama David e ha sessant'anni. È in pensione, ma lavora in giardino ogni giorno. Mia madre, Helen, è insegnante. È molto allegra e parla tanto. Ho un fratello, Tom: ha trent'anni ed è sposato. Sua moglie è italiana, di Milano! I miei nonni sono anziani e abitano in campagna. Non abbiamo animali.",
        'Mio padre, mia madre: no article. I miei nonni, i miei cugini: with the article.', ['famiglia', 'padre', 'madre', 'nonno'])

L = lesson(8, 'A Message Home', 'writing')
L.write("You live in Italy. Write a short message to someone in your family: say how you are, ask about the others, and end it the Italian way.",
        "Cara mamma, come stai? Io sto bene. Firenze è molto bella e la mia classe è simpatica. Come sta il papà? Lavora sempre troppo? E la nonna? Ogni domenica cucino la pasta, come te! Ti voglio bene. Un abbraccio e tanti baci, Emma",
        'Caro or cara to start; un abbraccio, baci or con affetto to end.', ['mamma', 'ti voglio bene', 'abbraccio', 'bacio'])

# ── 9. Speaking ──
L = lesson(9, 'Say It Out Loud', 'speaking')
L.read('Questa è la mia famiglia.', 'Famiglia: gli sounds like the lli in million.', ['famiglia'])
L.read('Mio padre e mia madre abitano a Bologna.', 'No article before padre and madre.', ['padre', 'madre'])
L.read('Mia moglie e mio figlio sono in Italia.', 'Moglie, figlio: the same gl sound.', ['moglie'])
L.read('I miei nonni sono in pensione.', 'Nonni: hold the double n.', ['nonno', 'in pensione'])
L.read('Mia cugina ha un fidanzato nuovo.', 'Cugina: the g is soft before i.', ['cugino', 'fidanzato'])
L.read('Ciao, nonna! Ti voglio bene.', 'Voglio: the gl sound again.', ['ti voglio bene'])
L.read('Un abbraccio e tanti baci!', 'Abbraccio: two b, two c.', ['abbraccio', 'bacio'])
L.read('Hai animali? Sì, un cane e due gatti.', 'Gatti: hold the double t.', ['animale'])

for L in LESSONS:
    L.dump()
print('\n'.join(L.meta(L.n) for L in LESSONS))
