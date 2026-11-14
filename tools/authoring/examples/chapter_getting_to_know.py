"""Chapter 'Getting to Know Someone' (unit-11), after the grammar unit Questions, negation & linking.

Available: units 1–9 (question words, prepositions first, non and double negatives, how often,
e/o/ma/però/perché/quando/se/anche), chapters 1–10. Not yet: adjective agreement, possessives,
clock times and days, piacere, reflexives (ci vediamo), the imperative, the past.
Readings are longer here (about 150–250 words): an ad, then the chat that follows it.
"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from chapterlib import Lesson, V

U = 'unit-11'
D = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'out', U)
os.makedirs(D, exist_ok=True)
LESSONS = []
def lesson(n, name, role):
    L = Lesson(U, D, n, name, role); LESSONS.append(L); return L

# ── 1. Asking and Answering ──
L = lesson(1, 'Asking and Answering', 'words')
L.vocab = [
    V('domandare', 'to ask', 'Posso domandare una cosa?'),
    V('significare', 'to mean · Che cosa significa? = What does it mean?', "Che cosa significa 'strada'?"),
    V('strada', 'road, street', 'Abito in una strada vicino al centro.'),
    V('telefonare', 'to phone · telefonare a = to phone someone', 'Stasera telefono a Giulia.'),
    V('messaggio', 'message · messaggi = messages', 'Scrivo un messaggio a Marco.'),
    V('internet', 'the internet · su internet = online', 'Parliamo su internet.'),
    V('saluto', 'greeting · saluti = regards, best wishes', 'Saluti da Firenze!'),
]
L.meaning('strada', 'Abito in una strada vicino al centro.', ['road', 'street', 'a road', 'a street'], 'Where the cars go.', ['strada'])
L.meaning('telefono', 'Stasera telefono a Giulia.', ['I phone', "I'll phone", 'I call', "I'll call", "I'm phoning"], 'Telefonare, io.', ['telefonare'])
L.mc("Someone uses a word you don't know. How do you ask what it means?", "Che cosa significa?", ['Come si chiama?', 'Di chi è?'],
     'Significare: to mean.', ['significare'])
L.cloze('Complete: Can I ask something?', 'Posso ___ una cosa?', 'domandare', 'To ask.', ['domandare'])
L.mc('A friend says she is writing to Marco. What is she writing?', 'Scrivo un messaggio a Marco.', ['Scrivo un saluto di Marco.', 'Telefono un messaggio a Marco.'],
     'A message to someone: a.', ['messaggio'])
L.cloze('Complete: We talk online.', 'Parliamo su ___.', 'internet', 'The internet.', ['internet'])
L.mc('You end a postcard from Florence. What do you write?', 'Saluti da Firenze!', ['Saluti a Firenze!', 'Saluti in Firenze!'], 'From a place: da.', ['saluto'])
L.say('Ask a friend who they are phoning.', ['a chi telefoni', 'a chi telefoni?'], 'The preposition goes first: a chi.', ['telefonare'])
L.say("Ask what 'messaggio' means.", ["che cosa significa 'messaggio'", "che cosa significa messaggio", "cosa significa messaggio"], 'Che cosa significa…?', ['significare'])
L.arrange("Arrange: 'Where do you live? In which street?'", 'Dove abiti? In che strada?', ['quando', 'chi'], 'Dove, then in che strada.', ['strada'])
L.say("Ask a friend why they don't phone Giulia.", ['perché non telefoni a Giulia'], 'Perché, then non.', ['telefonare'])

# ── 2. How Often ──
L = lesson(2, 'How Often', 'words')
L.vocab = [
    V('quasi', 'almost · quasi sempre, quasi mai', 'Non guardo quasi mai la televisione.'),
    V('ogni tanto', 'now and then, from time to time', 'Ogni tanto vado al cinema.'),
    V('dopo', 'after, afterwards, later · dopo il lavoro', 'Dopo il lavoro vado a casa.'),
    V('fumare', 'to smoke', 'Fumi? No, non fumo.'),
    V('sigaretta', 'cigarette', 'Non fumo sigarette.'),
    V('palestra', 'gym · in palestra', 'Vado in palestra ogni tanto.'),
]
L.meaning('quasi mai', 'Non guardo quasi mai la televisione.', ['almost never', 'hardly ever'], 'Quasi: almost.', ['quasi'])
L.meaning('ogni tanto', 'Ogni tanto vado al cinema.', ['now and then', 'from time to time', 'sometimes', 'every now and then'], 'Not often, not never.', ['ogni tanto'])
L.mc("A friend asks 'Fumi?'. You don't smoke. What do you answer?", 'No, non fumo.', ['No, fumo.', 'Sì, non fumo.'], 'No, then non + verb.', ['fumare'], ctx='Fumi?')
L.cloze("Complete: I almost never watch TV.", 'Non guardo ___ mai la televisione.', 'quasi', 'Almost.', ['quasi'])
L.cloze('Complete: After work I go home.', '___ il lavoro vado a casa.', 'Dopo', 'After.', ['dopo'])
L.mc('You go to the gym two or three times a year. What do you say?', 'Vado in palestra ogni tanto.', ['Vado sempre in palestra.', 'Vado spesso in palestra.'],
     'Not often.', ['ogni tanto', 'palestra'])
L.line('A new friend asks about your habits.',
       [{"speaker": "Friend", "text": "Vai spesso in palestra?"}, {"speaker": "You"}],
       ['No, quasi mai.', 'Sì, quasi sempre.', 'Ogni tanto.', 'No, non vado mai in palestra.'], 'How often, with quasi or ogni tanto.', ['quasi', 'palestra'])
L.say("Say you never smoke.", ['non fumo mai'], 'Non … mai.', ['fumare'])
L.say('Say you almost always eat at home.', ['mangio quasi sempre a casa'], 'Quasi sempre, after the verb.', ['quasi'])
L.arrange("Arrange: 'Now and then I go to the gym after work.'", 'Ogni tanto vado in palestra dopo il lavoro.', ['mai', 'al'], 'Ogni tanto at the start.', ['ogni tanto', 'dopo'])
L.say("Say you don't smoke cigarettes any more.", ['non fumo più sigarette', 'non fumo più le sigarette'], 'Non … più.', ['sigaretta'])

# ── 3. Keeping It Going ──
L = lesson(3, 'Keeping It Going', 'words')
L.vocab = [
    V('davvero', 'really · Davvero? = Really?', 'Abiti a Roma? Davvero?'),
    V('non lo so', "I don't know (a fixed phrase)", 'Dov\'è la posta? Non lo so.'),
    V('credo di sì', 'I think so · credo di no = I don\'t think so', 'Marco viene stasera? Credo di sì.'),
    V('dipende', 'it depends · dipende da = it depends on', 'Vieni al cinema? Dipende.'),
    V('posto', 'seat, place · È libero questo posto? = Is this seat free?', 'Scusi, è libero questo posto?'),
    V('falso', 'false, untrue, fake · vero o falso? = true or false?', 'Vero o falso?'),
    V('come?', 'pardon?, sorry? (when you didn\'t hear)', 'Come? Può ripetere?'),
]
L.meaning('dipende', 'Vieni al cinema? Dipende.', ['it depends', 'depends'], 'Not yes, not no.', ['dipende'])
L.meaning('davvero', 'Abiti a Roma? Davvero?', ['really', 'really?'], 'Surprised.', ['davvero'])
L.mc("Someone asks you where the post office is. You have no idea.", 'Mi dispiace, non lo so.', ['Mi dispiace, non so lo.', 'Mi dispiace, lo non so.'],
     'A fixed phrase: non lo so.', ['non lo so'])
L.mc("You didn't hear what someone said. You say:", 'Come? Può ripetere?', ['Davvero? Può ripetere?', 'Dipende. Può ripetere?'], 'Come?: pardon?', ['come?'])
L.cloze("Complete: Is Marco coming tonight? I think so.", 'Marco viene stasera? Credo di ___.', 'sì', 'I think so.', ['credo di sì'], )
L.cloze('Complete: Excuse me, is this seat free?', 'Scusi, è libero questo ___?', 'posto', 'A seat.', ['posto'])
L.mc("Your friend says 'Gli italiani mangiano pasta ogni giorno!'. You think it's not true.", 'Non è vero!', ['È vero!', 'Dipende!'],
     'Not true: non è vero.', [])
L.cloze('Complete: True or false?', 'Vero o ___?', 'falso', 'The opposite of vero.', ['falso'])
L.line("A friend asks if Giulia is coming to the party tonight. You don't think so.",
       [{"speaker": "Friend", "text": "Giulia viene stasera?"}, {"speaker": "You"}],
       ['Credo di no.', 'Non lo so. Credo di no.'], "I don't think so: credo di no.", ['credo di sì'])
L.line('A friend asks if you go out tonight. It depends on the weather.',
       [{"speaker": "Friend", "text": "Esci stasera?"}, {"speaker": "You"}],
       ['Dipende.', 'Non lo so, dipende.', 'Dipende. Se fa freddo, no.'], 'Not yes or no.', ['dipende'])
L.say('Ask a stranger politely if this seat is free.', ['scusi, è libero questo posto', 'è libero questo posto'], 'Scusi, then the question.', ['posto'])

# ── 4. On the Train (practice, with Lei) ──
L = lesson(4, 'On the Train', 'practice')
L.line('The train is full. You want to sit next to an older man.',
       [{"speaker": "You"}, {"speaker": "Passenger", "text": "Sì, sì, prego."}],
       ['Scusi, è libero questo posto?', 'Scusi, è libero?'], 'Ask politely: Lei.', ['posto'])
L.line("He's curious about your accent. You're English, from London.",
       [{"speaker": "Passenger", "text": "Lei è inglese?"}, {"speaker": "You"}],
       ['Sì, sono inglese, di Londra.', 'Sì, di Londra.'], 'Sì, then where from.', [])
L.line("You're in Italy for work.",
       [{"speaker": "Passenger", "text": "E perché è in Italia?"}, {"speaker": "You"}],
       ['Sono qui per lavoro.', 'Per lavoro.', 'Perché lavoro qui.'], 'Per lavoro, or perché + a reason.', [])
L.line("He says your Italian is very good. You're modest.",
       [{"speaker": "Passenger", "text": "Parla molto bene l'italiano!"}, {"speaker": "You"}],
       ["Grazie, ma non è vero! Parlo un po' di italiano.", "Davvero? Grazie! Ma parlo un po' di italiano."], 'Thank him, and say it\'s not true.', ['davvero'])
L.line('He asks if you come to Italy often. You almost never do.',
       [{"speaker": "Passenger", "text": "Viene spesso in Italia?"}, {"speaker": "You"}],
       ['No, quasi mai.', 'No, non vengo quasi mai.'], 'Quasi mai.', ['quasi'])
L.line('He asks where you are going. Florence first, then Rome.',
       [{"speaker": "Passenger", "text": "Dove va?"}, {"speaker": "You"}],
       ['Vado a Firenze, e poi a Roma.', 'Prima a Firenze, poi a Roma.'], 'Prima … poi.', [])
L.mc("He says 'Binario tre'. You don't know 'binario'. What do you ask?", "Scusi, che cosa significa 'binario'?",
     ["Scusa, che cosa significa 'binario'?", "Scusi, come si chiama 'binario'?"], 'Lei: scusi; to mean: significare.', ['significare'])
L.mc("At the end, he says 'Arrivederci, buon viaggio!'. What do you answer?", 'Grazie, arrivederci!', ['Ciao, buon viaggio a te!', 'Prego, arrivederci!'],
     'He is a stranger: formal.', [])

# ── 5. A Language Exchange (practice, with tu) ──
L = lesson(5, 'A Language Exchange', 'practice')
L.line('Luca, your exchange partner, asks when you are free. In the evening, almost always.',
       [{"speaker": "Luca", "text": "Quando sei libero?"}, {"speaker": "You"}],
       ['La sera, quasi sempre.', 'Quasi sempre la sera.'], 'La sera; quasi sempre.', ['quasi'])
L.line("He suggests a coffee in the evening. You never drink coffee in the evening; you'll have tea.",
       [{"speaker": "Luca", "text": "Prendiamo un caffè?"}, {"speaker": "You"}],
       ['No, non bevo mai caffè la sera. Prendo un tè.', 'La sera non bevo mai caffè. Un tè, per favore.'], 'Non … mai.', [])
L.line('He asks what you do in your free time.',
       [{"speaker": "Luca", "text": "Che cosa fai nel tempo libero?"}, {"speaker": "You"}],
       ['Leggo, cucino e ogni tanto vado al cinema.', 'Vado in palestra e ogni tanto gioco a tennis.'], 'Two or three things, and how often.', ['ogni tanto'])
L.line("He uses a word you don't know: scambio.",
       [{"speaker": "Luca", "text": "Allora, facciamo uno scambio linguistico?"}, {"speaker": "You"}],
       ["Scusa, che cosa significa 'scambio'?", "Come? Che cosa significa 'scambio'?"], 'Ask what it means: tu.', ['significare'])
L.line('He asks about your family. No brothers, and no sisters either.',
       [{"speaker": "Luca", "text": "Hai fratelli?"}, {"speaker": "You"}],
       ['No, non ho fratelli, e neanche sorelle.', 'No, non ho fratelli. Neanche sorelle.'], 'Non … neanche.', [])
L.line("He says he is from Bologna. You're surprised: so is your teacher.",
       [{"speaker": "Luca", "text": "Sono di Bologna."}, {"speaker": "You"}],
       ["Davvero? Anche l'insegnante di italiano è di Bologna!", "Davvero? Anche l'insegnante è di Bologna!"], 'Davvero?, then anche.', ['davvero'])
L.say("Ask Luca why he's studying English.", ["perché studi l'inglese", 'perché studi inglese', "perché impari l'inglese"], 'Perché + the verb.', [])
L.arrange("Arrange: 'I almost never watch TV.'", 'Non guardo quasi mai la televisione.', ['sempre', 'nessuno'], 'Non … quasi mai.', ['quasi'])

# ── 6. Luca's Ad (reading: a notice) ──
L = lesson(6, "Luca's Ad", 'reading')
# The ad is shown again beside the writing task that answers it (lesson 8)
AD = {"title": "Scambio linguistico: italiano–inglese", "paragraphs": [
    "Ciao! Mi chiamo Luca e ho ventotto anni. Sono di Bologna, ma adesso abito a Firenze, vicino alla stazione. Faccio l'ingegnere e lavoro in un ufficio in centro.",
    "Parlo italiano e un po' di spagnolo, ma non parlo bene l'inglese, e per il lavoro ho bisogno dell'inglese. Per questo cerco uno scambio linguistico: un'ora in italiano, un'ora in inglese.",
    "Studio l'inglese da un anno, con un libro e su internet. Leggo abbastanza bene, ma da solo è difficile: non ho nessuno per parlare, e quando un inglese parla, non capisco quasi niente. Ho bisogno di parlare con una persona, non con un computer!",
    "Quando non lavoro, leggo, cucino e gioco a calcio con gli amici. Vado in palestra quasi ogni giorno. Non guardo mai la televisione e non fumo.",
    "Sei inglese o americano? Hai tempo la sera o nel fine settimana? Possiamo prendere un caffè insieme in centro, o parlare su internet se abiti lontano.",
    "Telefono · 347 812 9056 (solo messaggi, per favore!)",
]}
L.reading = AD
L.vocab = [
    V('scambio', 'exchange · scambio linguistico = language exchange', 'Cerco uno scambio linguistico.'),
    V('per questo', "that's why, for this reason", 'Non parlo bene inglese. Per questo studio.'),
    V('solo', 'only, just', 'Solo messaggi, per favore.'),
    V('ora', "hour · un'ora = an hour", "Un'ora in italiano, un'ora in inglese."),
    V('abbastanza', 'quite, fairly; enough', 'Leggo abbastanza bene.'),
    V('persona', 'person · persone = people', 'Ho bisogno di parlare con una persona.'),
]
L.mc('How old is Luca?', '28', ['18', '38'], "'Ho ventotto anni.'", [])
L.mc('Where is Luca from?', 'Bologna', ['Florence', 'Rome'], "'Sono di Bologna.'", [])
L.mc('Why does Luca need English?', 'For his job', ['For a holiday', 'For his family'], "'Per il lavoro ho bisogno dell'inglese.'", ['per questo'])
L.mc('What is a "scambio linguistico" here?', 'An hour in Italian, then an hour in English', ['An English course at a school', 'A job as a teacher'],
     'Read the second paragraph.', ['scambio'])
L.mc("Why can't Luca learn English well on his own?", 'He has nobody to speak with', ['He has no book', "He doesn't have time"],
     "'Non ho nessuno per parlare.'", ['persona'])
L.cloze('Complete from the text: I need to talk with a person.', 'Ho bisogno di parlare con una ___.', 'persona', 'A person, not a computer.', ['persona'])
L.cloze('Complete from the text: I read quite well.', 'Leggo ___ bene.', 'abbastanza', 'Quite.', ['abbastanza'])
L.mc('How often does Luca go to the gym?', 'Almost every day', ['Never', 'Now and then'], "'Quasi ogni giorno.'", ['quasi'])
L.mc('True or false: Luca watches TV in the evening.', 'False', ['True'], "'Non guardo mai la televisione.'", [])
L.mc('How does Luca want people to contact him by phone?', 'Only by message', ['Only by calling', 'Any way they like'], "'Solo messaggi, per favore!'", ['solo', 'messaggio'])
L.cloze('Complete from the text: That\'s why I\'m looking for a language exchange.', '___ questo cerco uno scambio linguistico.', 'Per', 'That\'s why: per questo.', ['per questo'])
L.cloze('Complete from the text: messages only, please.', '___ messaggi, per favore!', 'Solo', 'Only.', ['solo'])
L.cloze("Complete from the text: an hour in Italian.", "Un'___ in italiano.", 'ora', 'An hour.', ['ora'])
L.answer('Dove lavora Luca?', ['in un ufficio in centro', 'lavora in un ufficio in centro', 'in centro'], 'Read the first paragraph.', [])
L.answer('Luca fuma?', ['no, non fuma', 'no, Luca non fuma', 'no'], 'Read the third paragraph.', ['fumare'])

# ── 7. Paul Writes Back (reading: a chat) ──
L = lesson(7, 'Paul Writes Back', 'reading')
L.reading = {"title": "Messaggi", "paragraphs": [
    "Paul: Ciao Luca! Mi chiamo Paul, sono inglese, di Leeds. Cerco anch'io uno scambio linguistico!",
    "Luca: Ciao Paul! Grazie per il messaggio. Da quanto tempo sei in Italia?",
    "Paul: Da due settimane. Sono medico e lavoro in un ospedale qui a Firenze.",
    "Luca: Davvero? E perché Firenze?",
    "Paul: Per lavoro, ma anche per imparare l'italiano. Però è difficile: al telefono non capisco quasi niente!",
    "Luca: Non è vero, scrivi molto bene! Quando sei libero?",
    "Paul: La sera, quasi sempre. E tu?",
    "Luca: Anch'io. Che cosa fai la sera?",
    "Paul: Leggo, e ogni tanto cucino. Ma non cucino bene: mangio spesso un panino!",
    "Luca: Un panino? Davvero? Io cucino quasi ogni sera. Se vuoi, una sera cucino io per te.",
    "Luca: Ma non stasera: stasera gioco a calcio. Domani?",
    "Paul: Va bene! Dove? Al bar in piazza San Marco?",
    "Luca: Perfetto. Ma io la sera non bevo mai caffè: prendo una birra!",
    "Paul: Nessun problema. Anch'io! A domani!",
]}
L.vocab = [
    V('a domani', 'see you tomorrow', 'Ciao, a domani!'),
    V('perfetto', 'perfect, great', 'Domani alle otto? Perfetto.'),
]
L.vocab[1]['example'] = 'Al bar in piazza? Perfetto.'
L.mc('How long has Paul been in Italy?', 'Two weeks', ['Two days', 'A year'], "'Da due settimane.'", [])
L.mc('What is Paul\'s job?', 'He is a doctor in a hospital', ['He is an engineer', 'He is a teacher'], "'Sono medico.'", [])
L.mc('Why is Paul in Florence?', 'For work, and to learn Italian', ['For a holiday', 'For a language course'], 'Read his fourth message.', [])
L.mc('What does Paul find hard?', 'Understanding people on the phone', ['Writing messages', 'Finding a job'], "'Al telefono non capisco quasi niente!'", ['quasi'])
L.mc('What does Paul often eat in the evening?', 'A sandwich', ['Pasta that he cooks', 'Dinner at Luca\'s'], "'Mangio spesso un panino!'", [])
L.mc('What does Luca offer?', 'To cook for Paul one evening', ['To teach Paul to cook', 'To pay for dinner'], "'Una sera cucino io per te.'", [])
L.mc("Why can't Luca meet tonight?", 'He plays football tonight', ['He works late', 'He has a lesson'], "'Stasera gioco a calcio.'", [])
L.mc('What will Luca drink?', 'A beer', ['A coffee', 'A tea'], "'Prendo una birra!'", [])
L.mc('True or false: Paul also wants a beer.', 'True', ['False'], "'Anch'io!'", [])
L.cloze("Complete: Luca's last message.", 'Al bar in piazza? ___.', 'Perfetto', 'Great.', ['perfetto'])
L.answer('Quando vanno al bar Paul e Luca?', ['domani', 'domani sera', 'vanno al bar domani'], 'Read the last messages.', ['a domani'])
L.answer('Dove vanno?', ['al bar in piazza San Marco', 'in piazza San Marco', 'al bar'], 'Paul suggests a place.', [])

# ── 8–9. Writing ──
L = lesson(8, 'Answering an Ad', 'writing')
L.reading = AD
L.write("Answer Luca's ad. Say who you are, where you're from, what you do and how often you do it, then ask him three questions.",
        "Ciao Luca! Mi chiamo Sarah e sono americana, di Boston. Abito a Firenze da un mese e lavoro in una scuola. Nel tempo libero leggo, cucino e ogni tanto vado in palestra. Non fumo e non guardo quasi mai la televisione. E tu? Quando sei libero? Perché studi l'inglese? Dove prendiamo un caffè? Saluti, Sarah",
        'Who you are, then habits with quasi mai, ogni tanto, non … mai; then three questions with question words.', ['quasi', 'ogni tanto'])
L = lesson(9, 'How Often?', 'writing')
L.write('A friend wants to know your week. Write what you always, often, sometimes and never do, and why.',
        "Vado sempre al lavoro in bici, perché non ho la macchina. Vado spesso in palestra dopo il lavoro. Ogni tanto la sera vado al cinema con gli amici. Non guardo mai la televisione e non fumo. E tu?",
        'Sempre, spesso, ogni tanto, non … mai; perché for a reason.', ['ogni tanto', 'dopo'])

# ── 10. Speaking ──
L = lesson(10, 'Say It Out Loud', 'speaking')
L.read('Scusi, è libero questo posto?', 'Asking a stranger.', ['posto'])
L.read("Che cosa significa 'scambio'?", 'Asking what a word means.', ['significare', 'scambio'])
L.read('Non guardo quasi mai la televisione.', 'Quasi mai.', ['quasi'])
L.read('Ogni tanto vado in palestra.', 'Ogni tanto.', ['ogni tanto', 'palestra'])
L.read('Non lo so. Dipende.', 'Two short answers.', ['non lo so', 'dipende'])
L.read('Davvero? Anch\'io!', 'Surprise.', ['davvero'])
L.read('Perché studi l\'italiano?', 'Perché, with the accent.', [])

for L in LESSONS:
    L.dump()
print('\n'.join(L.meta(L.n) for L in LESSONS))
