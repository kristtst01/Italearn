"""Chapter 'Describing People & Things' (unit-06), after the Adjectives unit.

Available: units 1–10 (adjective agreement and position, bello/buono, nationalities, questo/quello,
molto/poco/tanto/troppo, tutto/ogni/qualche, più/meno as quantities), chapters 1–11.
Not yet: possessives (no 'mio fratello'), clock times and days, piacere, reflexives, the imperative,
the past, comparisons (più … di). Cast: Giulia teaches Italian in Florence; Emma (English, a student,
cat Biscotto), Paul (English doctor), Chloé (French, works at a bar).
"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from chapterlib import Lesson, V

U = 'unit-06'
D = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'out', U)
os.makedirs(D, exist_ok=True)
LESSONS = []
def lesson(n, name, role):
    L = Lesson(U, D, n, name, role); LESSONS.append(L); return L

# ── 1. Looks ──
L = lesson(1, 'Looks', 'words')
L.vocab = [
    V('alto', 'tall, high', 'Marco è alto.'),
    V('basso', 'short, low', 'Giulia è bassa.'),
    V('magro', 'thin, slim', 'Paul è alto e magro.'),
    V('capelli', 'hair (always plural for the hair on your head) · un capello = one hair', 'Ha i capelli neri.'),
    V('occhio', 'eye · gli occhi = the eyes', 'Ha gli occhi azzurri.'),
    V('biondo', 'blond, fair', 'Emma è bionda.'),
    V('castano', 'brown (hair and eyes)', 'Ho i capelli castani.'),
    V('azzurro', 'light blue, blue (eyes, sky)', 'Ha gli occhi azzurri.'),
    V('barba', 'beard', 'Tomás ha la barba.'),
    V('maschio', 'male; a boy (babies, animals)', 'È maschio o femmina?'),
    V('femmina', 'female; a girl (babies, animals)', 'Il gatto di Chloé è femmina.'),
]
L.vocab[0]['example'] = 'Marco è molto alto.'
L.vocab[4]['example'] = 'Chloé ha gli occhi verdi.'
L.meaning('capelli', 'Ha i capelli neri.', ['hair', 'the hair'], 'On your head: always plural.', ['capelli'])
L.meaning('magro', 'Paul è alto e magro.', ['thin', 'slim', 'skinny'], 'The opposite of big.', ['magro'])
L.cloze('Make it agree: Giulia is short.', 'Giulia è ___.', 'bassa', 'Basso, for a woman.', ['basso'])
L.cloze('Make it agree: She has blue eyes.', 'Ha gli occhi ___.', 'azzurri', 'Occhi is masculine plural.', ['azzurro', 'occhio'])
L.cloze('Make it agree: I have brown hair.', 'Ho i capelli ___.', 'castani', 'Capelli is masculine plural.', ['castano', 'capelli'])
L.mc('How do you say "Emma is blonde"?', 'Emma è bionda.', ['Emma è biondo.', 'Emma ha bionda.'], 'It agrees with Emma.', ['biondo'])
L.mc('A friend has a new puppy. How do you ask if it is a boy or a girl?', 'È maschio o femmina?', ['È ragazzo o ragazza?', 'È uomo o donna?'],
     'For babies and animals.', ['maschio', 'femmina'])
L.line('A friend asks what Tomás looks like. He is short and thin, with a beard and glasses.',
       [{"speaker": "Friend", "text": "Com'è Tomás?"}, {"speaker": "You"}],
       ['È basso e magro, con la barba e gli occhiali.', 'Tomás è basso e magro. Ha la barba e gli occhiali.'], 'Essere + adjectives, then con or avere.', ['basso', 'magro', 'barba'])
L.arrange("Arrange: 'Emma has blonde hair and blue eyes.'", 'Emma ha i capelli biondi e gli occhi azzurri.', ['è', 'biondo'], 'Avere + the hair and the eyes.', ['capelli', 'azzurro'])
L.say('Describe yourself: say you are tall, with brown hair.', ['sono alto, con i capelli castani', 'sono alta, con i capelli castani', 'sono alto e ho i capelli castani', 'sono alta e ho i capelli castani'],
      'Sono alto/alta; i capelli castani.', ['alto', 'castano'])
L.say('Say: Marco and Paul are tall and thin.', ['marco e paul sono alti e magri'], 'Masculine plural: -i.', ['alto', 'magro'])

# ── 2. What Someone Is Like ──
L = lesson(2, "What Someone Is Like", 'words')
L.vocab = [
    V('antipatico', 'unpleasant, not nice · antipatici (plural)', 'Il nuovo collega è antipatico.'),
    V('intelligente', 'intelligent, clever', 'Yuki è molto intelligente.'),
    V('timido', 'shy', 'Tomás è un po\' timido.'),
    V('allegro', 'cheerful', 'Emma è sempre allegra.'),
    V('felice', 'happy', 'Oggi sono felice!'),
    V('triste', 'sad', 'Perché sei triste?'),
    V('serio', 'serious', 'Yuki è seria, ma simpatica.'),
    V('divertente', 'funny, fun', 'Aiko è molto divertente.'),
    V('ricco', 'rich · ricchi (plural)', 'Non sono ricco!'),
]
L.meaning('timido', "Tomás è un po' timido.", ['shy'], "He doesn't talk much.", ['timido'])
L.meaning('divertente', 'Aiko è molto divertente.', ['funny', 'fun', 'amusing'], 'She makes you laugh.', ['divertente'])
L.cloze('Make it agree: Emma is always cheerful.', 'Emma è sempre ___.', 'allegra', 'Allegro, for a woman.', ['allegro'])
L.cloze('Make it agree: The students are intelligent.', 'Gli studenti sono ___.', 'intelligenti', 'An -e adjective in the plural.', ['intelligente'])
L.cloze('Make it agree: Yuki and Aiko are serious.', 'Yuki e Aiko sono ___.', 'serie', 'Feminine plural.', ['serio'])
L.mc('Your friend never smiles today. What do you ask?', 'Perché sei triste?', ['Perché sei felice?', 'Perché sei divertente?'], 'Sad.', ['triste'])
L.mc('The new colleague is not nice at all. How do you say it?', 'È antipatico.', ['È simpatico.', 'È antipatica.'], 'The opposite of simpatico; the colleague is a man.', ['antipatico'])
L.line('A friend asks what your new colleagues are like. They are nice but a little serious.',
       [{"speaker": "Friend", "text": "Come sono i nuovi colleghi?"}, {"speaker": "You"}],
       ['Sono simpatici, ma un po\' seri.', 'Simpatici, ma un po\' seri.'], 'Masculine plural: -i.', ['serio'])
L.say('Say you are happy today.', ['oggi sono felice', 'sono felice oggi'], 'Felice: one form for both.', ['felice'])
L.say("Say you aren't rich.", ['non sono ricco', 'non sono ricca'], 'Non before the verb.', ['ricco'])
L.arrange("Arrange: 'Aiko is very funny, but Yuki is shy.'", 'Aiko è molto divertente, ma Yuki è timida.', ['timido', 'molta'], 'Timido agrees with Yuki.', ['divertente', 'timido'])

# ── 3. What Something Is Like ──
L = lesson(3, "What Something Is Like", 'words')
L.vocab = [
    V('lungo', 'long · lunghi, lunghe (plural)', 'Il film è lungo.'),
    V('corto', 'short (length)', 'Tomás ha i capelli corti.'),
    V('largo', 'wide, loose · larghi, larghe (plural)', 'La strada è larga.'),
    V('stretto', 'narrow, tight', 'Le strade di Firenze sono strette.'),
    V('pulito', 'clean', 'La cucina è pulita.'),
    V('sporco', 'dirty · sporchi, sporche (plural)', 'Il bagno è sporco!'),
    V('comodo', 'comfortable; handy', 'Questa sedia è comoda.'),
    V('economico', 'cheap, inexpensive · economici (plural)', 'Il ristorante è buono ed economico.'),
    V('interessante', 'interesting', 'Il museo è interessante.'),
    V('noioso', 'boring', 'Il film è lungo e noioso.'),
]
L.meaning('noioso', 'Il film è lungo e noioso.', ['boring', 'dull'], 'The opposite of interessante.', ['noioso'])
L.meaning('economico', 'Il ristorante è buono ed economico.', ['cheap', 'inexpensive', 'good value'], 'The opposite of caro.', ['economico'])
L.cloze('Make it agree: The streets of Florence are narrow.', 'Le strade di Firenze sono ___.', 'strette', 'Feminine plural.', ['stretto'])
L.cloze('Make it agree: The films are long.', 'I film sono ___.', 'lunghi', 'Keep the hard sound: -ghi.', ['lungo'])
L.cloze('Make it agree: The plates are dirty.', 'I piatti sono ___.', 'sporchi', 'Keep the hard sound: -chi.', ['sporco'])
L.mc('The bed is very nice to lie on. How do you say it?', 'Il letto è comodo.', ['Il letto è economico.', 'Il letto è largo.'],
     'Nice to sit on: comfortable.', ['comodo'])
L.cloze('Make it agree: Tomás has short hair.', 'Tomás ha i capelli ___.', 'corti', 'Capelli is masculine plural.', ['corto'])
L.mc('Which is correct?', 'i capelli corti', ['i corti capelli', 'i capelli corto'], 'Usually after the noun, and it agrees.', ['corto'])
L.line('A friend asks what the museum is like. You find it interesting but expensive.',
       [{"speaker": "Friend", "text": "Com'è il museo?"}, {"speaker": "You"}],
       ['È interessante, ma un po\' caro.', 'Interessante, ma caro.'], 'Two adjectives with ma.', ['interessante'])
L.say('Say the kitchen is clean but the bathroom is dirty.', ['la cucina è pulita, ma il bagno è sporco', 'la cucina è pulita ma il bagno è sporco'],
      'Each adjective agrees with its noun.', ['pulito', 'sporco'])
L.arrange("Arrange: 'This chair is very comfortable.'", 'Questa sedia è molto comoda.', ['comodo', 'quella'], 'Comodo agrees with sedia.', ['comodo'])
L.say('Say the street is wide.', ['la strada è larga'], 'Larga: feminine.', ['largo'])

# ── 4. Who Is It? (practice) ──
L = lesson(4, 'Who Is It?', 'practice')
L.line("You're meeting Luca at the station for the first time. He describes himself and asks about you.",
       [{"speaker": "Luca", "text": "Io sono alto, con la barba. E tu, come sei?"}, {"speaker": "You"}],
       ['Sono bassa, con i capelli lunghi e biondi.', 'Sono alto e magro, con gli occhiali.', 'Ho i capelli castani e gli occhi azzurri.'],
       'Describe yourself: essere + adjectives, avere or con.', ['capelli'])
L.line('A friend points at a group. Which one is Paul? The tall one with glasses.',
       [{"speaker": "Friend", "text": "Chi è Paul?"}, {"speaker": "You"}],
       ['Quello alto con gli occhiali.', 'È quello alto, con gli occhiali.'], 'Quello + an adjective: the … one.', ['alto'])
L.line("A friend asks what the new teacher is like. She's very nice and funny.",
       [{"speaker": "Friend", "text": "Com'è la nuova insegnante?"}, {"speaker": "You"}],
       ['È molto simpatica e divertente.', 'Simpatica e molto divertente.'], 'Feminine: simpatica.', ['divertente'])
L.line('Your friend asks about your neighbours. They are a bit unpleasant.',
       [{"speaker": "Friend", "text": "E i vicini?"}, {"speaker": "You"}],
       ["Sono un po' antipatici.", "Un po' antipatici."], 'Masculine plural: -ci.', ['antipatico'])
L.line('Someone asks why Tomás never talks in class.',
       [{"speaker": "Classmate", "text": "Perché Tomás non parla mai?"}, {"speaker": "You"}],
       ["Perché è timido.", "È un po' timido."], 'Perché + the reason.', ['timido'])
L.mc('Which describes two women with long blonde hair?', 'Hanno i capelli lunghi e biondi.', ['Hanno i capelli lunghe e bionde.', 'Sono capelli lunghi e biondi.'],
     'The adjectives agree with capelli, not with the women.', ['capelli', 'biondo'])
L.say('Say Emma and Chloé are happy today.', ['oggi emma e chloé sono felici', 'emma e chloé oggi sono felici', 'emma e chloé sono felici oggi'],
      'Felice: -i in the plural.', ['felice'])
L.arrange("Arrange: 'Giulia's cat is small and black.'", 'Il gatto di Giulia è piccolo e nero.', ['piccola', 'nera'], 'Gatto is masculine.', [])

# ── 5. What's It Like? (practice) ──
L = lesson(5, "What's It Like?", 'practice')
L.line('A friend asks about your new flat. It is big but a bit expensive.',
       [{"speaker": "Friend", "text": "Com'è il nuovo appartamento?"}, {"speaker": "You"}],
       ["È grande, ma un po' caro.", "Grande, ma un po' caro."], 'Two adjectives with ma.', [])
L.line('A friend asks about the film. Long and boring.',
       [{"speaker": "Friend", "text": "Com'è il film?"}, {"speaker": "You"}],
       ['È lungo e noioso.', 'Lungo e noioso!'], 'Masculine: film.', ['lungo', 'noioso'])
L.line('In a shop, a friend shows you two bags. You prefer the black one, because it is comfortable.',
       [{"speaker": "Friend", "text": "Quale borsa prendo? Questa o quella?"}, {"speaker": "You"}],
       ['Quella nera: è comoda.', 'Prendi quella nera, è comoda.'], 'Quella + colour.', ['comodo'])
L.line('A friend asks if the restaurant near your house is good.',
       [{"speaker": "Friend", "text": "È buono il ristorante vicino a casa?"}, {"speaker": "You"}],
       ['Sì, è buono ed economico.', 'Sì, e anche economico!'], 'Ristorante is masculine.', ['economico'])
L.line('Your flatmate asks about the kitchen. It is dirty: the plates are dirty too.',
       [{"speaker": "Flatmate", "text": "Com'è la cucina?"}, {"speaker": "You"}],
       ['È sporca, e anche i piatti sono sporchi!', 'Sporca! E i piatti sono sporchi.'], 'Sporca, then sporchi.', ['sporco'])
L.mc("What does 'una bella casa' mean?", 'a beautiful house', ['a big house', 'a new house'], 'Bella: beautiful, nice.', [])
L.say('Say the museum is very interesting.', ['il museo è molto interessante'], 'Molto stays -o before an adjective.', ['interessante'])
L.arrange("Arrange: 'These streets are long and narrow.'", 'Queste strade sono lunghe e strette.', ['lunghi', 'stretti'], 'Feminine plural.', ['lungo', 'stretto'])

# ── 6. Giulia's Class (reading: a description) ──
L = lesson(6, "Giulia's Class", 'reading')
L.reading = {"title": "La classe di Giulia", "paragraphs": [
    "Quest'anno Giulia ha una classe piccola ma molto simpatica: cinque studenti di quattro paesi.",
    "Emma è inglese e ha ventiquattro anni. È alta e bionda, con i capelli lunghi e gli occhi azzurri. È sempre allegra e parla molto, in classe e fuori.",
    "Tomás è spagnolo. È basso e magro, con la barba e gli occhiali. È molto intelligente, ma è timido: in classe non parla quasi mai, e quando parla, parla piano.",
    "Yuki e Aiko sono giapponesi e sono sorelle, ma non sono uguali. Yuki è seria e studia tanto; Aiko è divertente e ogni tanto arriva senza i libri!",
    "E poi c'è Paul, un medico inglese. È simpatico e gentile, ma ha sempre fretta: arriva di corsa dall'ospedale e torna subito al lavoro.",
    "E Giulia? È bassa, con i capelli castani e corti e gli occhiali rossi. È un'insegnante seria, ma molto gentile, e con gli studenti parla sempre piano.",
    "La lezione è in una stanza piccola e un po' vecchia, con una finestra grande. Le sedie non sono comode, ma nessuno è triste.",
    "Giulia è contenta. La lezione è lunga, ma con questa classe non è mai noiosa.",
]}
L.vocab = [
    V('uguale', 'the same, alike · uguali (plural)', 'Le due sorelle non sono uguali.'),
    V('piano', 'quietly, softly; slowly', 'Tomás parla piano.'),
    V('di corsa', 'in a rush, running', 'Paul arriva di corsa.'),
]
L.mc('How many students are in the class?', 'Five', ['Four', 'Six'], "'Cinque studenti.'", [])
L.mc('What does Emma look like?', 'Tall and blonde, with long hair and blue eyes', ['Short and thin, with glasses', 'Dark-haired, with a beard'], 'Read the second paragraph.', [])
L.mc('Why does Tomás hardly ever talk in class?', "He's shy", ["He doesn't understand", "He's always late"], "'È timido.'", ['piano'])
L.mc('True or false: Yuki and Aiko are alike.', 'False', ['True'], "'Non sono uguali.'", ['uguale'])
L.mc('What does Aiko sometimes forget?', 'Her books', ['Her glasses', 'The lesson'], "'Arriva senza i libri!'", [])
L.mc('What is Paul like?', 'Nice and kind, but always in a hurry', ['Serious and shy', 'Funny but unpleasant'], 'Read the fifth paragraph.', ['di corsa'])
L.cloze('Complete from the text: the two sisters are not alike.', 'Yuki e Aiko non sono ___.', 'uguali', 'Plural of uguale.', ['uguale'])
L.cloze('Complete from the text: Paul arrives in a rush.', 'Paul arriva di ___.', 'corsa', 'In a rush.', ['di corsa'])
L.cloze('Complete from the text: Tomás speaks quietly.', 'Tomás parla ___.', 'piano', 'Quietly.', ['piano'])
L.answer('Com\'è Yuki?', ['è seria', 'Yuki è seria', 'seria'], 'Read the fourth paragraph.', [])
L.mc('What is the classroom like?', 'Small and a bit old, with a big window', ['Big and new', 'Small, with comfortable chairs'], 'Read the sixth paragraph.', [])
L.answer('Com\'è Giulia come insegnante?', ['seria, ma molto gentile', 'è seria ma gentile', 'è un\'insegnante seria, ma molto gentile'], 'Read the paragraph about Giulia.', ['serio'])
L.answer('Com\'è la lezione con questa classe?', ['non è mai noiosa', 'non è noiosa', 'è lunga, ma non è mai noiosa'], 'Read the last paragraph.', ['noioso'])

# ── 7. Missing Cat (reading: a notice and a scene) ──
L = lesson(7, 'Missing Cat', 'reading')
L.reading = {"title": "Cerchiamo Biscotto!", "paragraphs": [
    "Biscotto è un gatto piccolo, nero e bianco, con gli occhi verdi. È maschio e ha due anni.",
    "È molto timido e non mangia tutto: solo il pesce! Abita vicino a piazza San Marco, ma oggi non è a casa.",
    "Telefono · 339 456 7812 (Emma)",
    "Due giorni dopo, Paul telefona a Emma.",
    "Paul: Emma? Sono Paul. C'è un gatto nero e bianco sotto una macchina, davanti all'ospedale. È magro e sporco, ma ha gli occhi verdi. È Biscotto?",
    "Emma: Un gatto timido? Con una macchia bianca sul naso?",
    "Paul: Sì! Una piccola macchia bianca.",
    "Emma: È lui! Arrivo subito!",
    "Emma arriva all'ospedale di corsa. Sotto la macchina c'è un gatto piccolo e triste. Emma dice piano: «Biscotto?» e il gatto esce subito.",
    "La sera Biscotto è di nuovo a casa: pulito, felice e con un piatto di pesce.",
]}
L.vocab = [
    V('macchia', 'spot, patch, stain', 'Ha una macchia bianca sul naso.'),
    V('naso', 'nose', 'Il gatto ha il naso rosa.'),
    V('di nuovo', 'again, back again', 'Biscotto è di nuovo a casa.'),
]
L.mc('What does Biscotto look like?', 'Small, black and white, with green eyes', ['Big and black, with blue eyes', 'Small and white, with brown eyes'], 'Read the first paragraph.', [])
L.mc('What does Biscotto eat?', 'Only fish', ['Everything', 'Only meat'], "'Solo il pesce!'", [])
L.mc('Where does Paul find a cat?', 'Under a car, in front of the hospital', ['In the square', 'At the hospital, inside'], "'Sotto una macchina, davanti all'ospedale.'", [])
L.mc('How does Emma know it is Biscotto?', 'He has a small white spot on his nose', ['He is shy', 'He is thin and dirty'], "'Una macchia bianca sul naso.'", ['macchia', 'naso'])
L.mc('What does the cat do when Emma says his name?', 'He comes out at once', ['He runs away', 'He stays under the car'], "'Il gatto esce subito.'", [])
L.mc('True or false: in the evening, Biscotto is dirty and hungry.', 'False', ['True'], "'Pulito, felice e con un piatto di pesce.'", ['di nuovo'])
L.cloze('Complete from the text: a white spot on his nose.', 'Una ___ bianca sul naso.', 'macchia', 'A spot.', ['macchia'])
L.cloze('Complete: Biscotto is home again.', 'Biscotto è di ___ a casa.', 'nuovo', 'Again: di nuovo.', ['di nuovo'])
L.cloze('Complete from the text: the nose.', 'Sul ___.', 'naso', 'Nose.', ['naso'])
L.answer('Biscotto è maschio o femmina?', ['maschio', 'è maschio', 'Biscotto è maschio'], 'Read the first paragraph.', ['maschio'])
L.answer('Com\'è il gatto sotto la macchina?', ['magro e sporco', 'è magro e sporco'], "Read Paul's message.", ['magro', 'sporco'])

# ── 8–9. Writing ──
L = lesson(8, 'Someone You Know', 'writing')
L.write('Describe a person you know well: what they look like, and what they are like.',
        "Ho un'amica, si chiama Sara. È italiana, di Napoli, e ha trent'anni. È bassa e magra, con i capelli castani e lunghi e gli occhi verdi. È molto simpatica e divertente, ma un po' timida con le persone nuove. È anche molto intelligente: parla quattro lingue!",
        'Looks with essere and avere or con; then character. Check every adjective agrees.', ['capelli', 'timido', 'divertente'])
L = lesson(9, 'A Town You Know', 'writing')
L.write("Describe a town or city you know to a friend who has never been there: what it's like, its streets, and what there is to do.",
        "Bologna è una città bella e interessante, non molto grande. Le strade del centro sono strette e lunghe, con molti negozi e bar. Ci sono musei, chiese e una piazza grande. I ristoranti sono buoni ed economici. È una città allegra, con tanti studenti.",
        "Città is feminine; check each adjective's ending.", ['stretto', 'interessante', 'economico'])

# ── 10. Speaking ──
L = lesson(10, 'Say It Out Loud', 'speaking')
L.read('Emma è alta e bionda, con gli occhi azzurri.', 'Agreement with Emma.', ['biondo', 'azzurro'])
L.read('Tomás è un po\' timido.', 'Timido.', ['timido'])
L.read('Le strade sono strette e lunghe.', 'Feminine plural.', ['stretto', 'lungo'])
L.read('Il film è lungo e noioso.', 'Lungo e noioso.', ['lungo', 'noioso'])
L.read("Com'è Paul? È simpatico e gentile.", 'Com\'è…?', [])
L.read('I piatti sono sporchi.', 'The hard sound: -chi.', ['sporco'])
L.read('È maschio o femmina?', 'A question about a pet.', ['maschio', 'femmina'])

for L in LESSONS:
    L.dump()
print('\n'.join(L.meta(L.n) for L in LESSONS))
