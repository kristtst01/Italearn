"""Chapter 'Finding Your Way' (unit-13), after the Imperative unit.

Available: units 1–15 (the imperative for tu, voi and noi, non + infinitive, va'/vai, the Lei set phrases
scusi, senta, mi dica, prego si accomodi, prenda pure, venga; reflexives in the present; piacere;
possessives; clock times), chapters 1–16. Around Town (unit-12) taught the places and the location
words (vicino, lontano, davanti, dietro, accanto, di fronte, sotto, fuori, là).
Not yet: the other Lei imperatives (giri, vada, prenda…). Strangers giving directions use Lei commands
in real Italian; here they use the present (va dritto, poi gira a sinistra) or deve + infinitive, which
Italians use for directions too. Friends get tu and voi commands. No object pronouns (no ti aspetto),
no past.
Cast: Emma lives near piazza San Marco (Biscotto), Luca near the station, Giulia's school is in via dei
Servi (Rita's shop is at number 12), Paul is always in a hurry. Via delle Rose is fictional.
"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from chapterlib import Lesson, V

U = 'unit-13'
D = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'out', U)
os.makedirs(D, exist_ok=True)
LESSONS = []
def lesson(n, name, role):
    L = Lesson(U, D, n, name, role); LESSONS.append(L); return L

def blank(L, prompt, ctx, ans, hint, words):  # fill in one form
    L.add('writing', 'fill_blank', prompt, ctx, ans, (), [hint], words)

# ── 1. Left, Right, Straight On ──
L = lesson(1, 'Left, Right, Straight On', 'words')
L.vocab = [
    V('destra', 'right (direction) · a destra = on the right, to the right', 'La farmacia è a destra.'),
    V('sinistra', 'left · a sinistra = on the left, to the left', 'La banca è a sinistra.'),
    V('dritto', 'straight on, straight ahead (also written diritto) · sempre dritto = straight on, all the way', 'Vai sempre dritto.'),
    V('girare', 'to turn', 'Gira a sinistra dopo la chiesa.'),
    V('continuare', 'to carry on, to continue', 'Continua dritto per cinque minuti.'),
    V('avanti', 'forward, ahead · più avanti = further on · Avanti! = Come in!', 'La fermata è più avanti, a destra.'),
    V('indietro', 'back, backwards · tornare indietro = to go back', 'Non è qui: torna indietro.'),
]
L.meaning('dritto', 'Vai sempre dritto.', ['straight on', 'straight ahead', 'straight'], 'Sempre dritto: all the way.', ['dritto'])
L.meaning('indietro', 'Non è qui: torna indietro.', ['back', 'backwards'], 'Tornare indietro: to go back.', ['indietro'])
L.meaning('più avanti', 'La fermata è più avanti, a destra.', ['further on', 'further ahead', 'further'], 'Keep going a bit.', ['avanti'])
L.cloze('Complete: Turn left after the church.', 'Gira a ___ dopo la chiesa.', 'sinistra', 'Left.', ['sinistra'])
L.mc('A friend is looking for the bank. It is on the right. What do you say?', 'È a destra.', ['È a sinistra.', 'È dietro.'],
     'On the right.', ['destra'])
blank(L, 'Tell a friend: turn right.', '___ a destra.', 'Gira', 'Girare, to one friend.', ['girare'])
blank(L, 'Tell two friends: turn left at the church.', '___ a sinistra alla chiesa.', 'Girate', 'Girare, to two friends.', ['girare'])
blank(L, "Tell a friend: don't turn here, carry on straight.", 'Non ___ qui, continua dritto.', 'girare', "Don't, to one friend.", ['girare', 'continuare'])
L.mc("You're driving with a friend and she has gone past your street. What do you say?", 'Torna indietro!', ['Vai sempre dritto!', 'Continua!'],
     'Back the way you came.', ['indietro'])
L.line('A friend phones. She is in the square and asks which way to go. Tell her: straight on, then turn right.',
       [{"speaker": "Friend", "text": "Sono in piazza. Adesso dove vado?"}, {"speaker": "You"}],
       ['Vai sempre dritto e poi gira a destra.', 'Vai dritto, poi gira a destra.'], 'Vai, then gira.', ['dritto', 'girare'])
L.arrange("Arrange: 'Carry on straight, then turn left.'", 'Continua dritto, poi gira a sinistra.', ['girare', 'destra'],
          'Two commands to a friend.', ['continuare', 'sinistra'])
L.say('Tell a friend: the stop is further on, on the left.', ['la fermata è più avanti, a sinistra', 'la fermata è più avanti a sinistra'],
      'Più avanti, then a sinistra.', ['avanti', 'sinistra'])
L.say('Tell two friends: go straight on.', ['andate sempre dritto', 'andate dritto'], 'Andare, to two friends.', ['dritto'])
L.say("Say: let's go back.", ['torniamo indietro'], "Let's: the noi form.", ['indietro'])

# ── 2. Along the Street ──
L = lesson(2, 'Along the Street', 'words')
L.vocab = [
    V('incrocio', 'crossroads, junction · incroci (plural)', 'Al primo incrocio, gira a destra.'),
    V('semaforo', 'traffic lights', 'Al semaforo, gira a sinistra.'),
    V('angolo', "corner · all'angolo = on the corner", "C'è un bar all'angolo."),
    V('attraversare', 'to cross', 'Attraversiamo la piazza.'),
    V('fino a', 'as far as, up to · fino al semaforo = as far as the lights', 'Vai dritto fino al semaforo.'),
    V('in fondo', 'at the end, at the bottom · in fondo alla strada = at the end of the street', 'La chiesa è in fondo alla strada.'),
    V('ponte', 'bridge', 'A Firenze ci sono molti ponti.'),
    V('fiume', 'river', "Il fiume di Firenze è l'Arno."),
]
L.meaning('semaforo', 'Al semaforo, gira a sinistra.', ['traffic lights', 'the traffic lights', 'traffic light', 'the lights'], 'Red, yellow, green.', ['semaforo'])
L.meaning('incrocio', 'Al primo incrocio, gira a destra.', ['crossroads', 'junction', 'intersection', 'the crossroads'], 'Where two streets meet.', ['incrocio'])
L.meaning('fiume', "Il fiume di Firenze è l'Arno.", ['river', 'the river'], 'The Arno is one.', ['fiume'])
L.cloze('Complete: There is a bar on the corner.', "C'è un bar all'___.", 'angolo', 'On the corner.', ['angolo'])
L.cloze('Complete: Go straight on as far as the lights.', 'Vai dritto ___ al semaforo.', 'fino', 'As far as.', ['fino a', 'semaforo'])
L.mc('The church is at the end of the street. How do you say it?', 'La chiesa è in fondo alla strada.',
     ["La chiesa è all'angolo della strada.", 'La chiesa è dietro la strada.'], 'At the end: in fondo.', ['in fondo'])
blank(L, 'Tell a friend: cross the square.', '___ la piazza.', 'Attraversa', 'Attraversare, to one friend.', ['attraversare'])
L.mc('A friend asks how to get to the other side of the river. What do you say?', 'Attraversa il ponte.',
     ['Attraversa il semaforo.', "Gira all'angolo."], 'Over the river.', ['ponte', 'attraversare'])
L.line('Chloé asks where the bar is. It is at the end of the street, on the corner.',
       [{"speaker": "Chloé", "text": "Dov'è il bar?"}, {"speaker": "You"}],
       ["È in fondo alla strada, all'angolo.", "In fondo alla strada, all'angolo."], 'In fondo a + la strada.', ['in fondo', 'angolo'])
L.line("A friend on a bike asks if she should turn here. Tell her to carry on to the crossroads, then turn left.",
       [{"speaker": "Friend", "text": "Giro qui?"}, {"speaker": "You"}],
       ["No, continua fino all'incrocio, poi gira a sinistra.", "No, vai dritto fino all'incrocio e poi gira a sinistra."],
       "Fino a + l'incrocio.", ['incrocio', 'continuare'])
L.arrange("Arrange: 'Cross the bridge and turn right.'", 'Attraversa il ponte e gira a destra.', ['fiume', 'sinistra'],
          'Two commands to a friend.', ['ponte', 'attraversare'])
L.say('Tell two friends: cross the road at the lights.', ['attraversate la strada al semaforo', 'attraversate al semaforo'],
      'Attraversare, to two friends.', ['attraversare', 'semaforo'])
L.say('Tell a friend: take the second street on the left.', ['prendi la seconda a sinistra', 'prendi la seconda strada a sinistra'],
      'La seconda: the second (street).', ['sinistra'])
L.say('Say there are a lot of bridges in Florence.', ['a firenze ci sono molti ponti', 'ci sono molti ponti a firenze'], "Ci sono + ponti.", ['ponte'])
L.say('Say: the bridge is at the end of the street.', ['il ponte è in fondo alla strada'], 'In fondo a + la.', ['ponte', 'in fondo'])

# ── 3. Asking the Way ──
L = lesson(3, 'Asking the Way', 'words')
L.vocab = [
    V('chiedere', 'to ask (for) · chiedere la strada = to ask the way', 'Chiedo la strada a un signore.'),
    V('perdersi', 'to get lost · mi perdo = I get lost', 'A Firenze mi perdo sempre!'),
    V('mappa', 'map · sulla mappa = on the map', 'Hai una mappa di Firenze?'),
    V('sbagliato', 'wrong · la strada sbagliata = the wrong way', 'È la strada sbagliata!'),
]
L.meaning('perdersi', 'A Firenze è facile perdersi.', ['to get lost', 'get lost', 'getting lost'], 'Easy to do in old streets.', ['perdersi'])
L.meaning('sbagliata', 'È la strada sbagliata!', ['wrong', 'the wrong way', 'the wrong road'], 'The opposite of giusta.', ['sbagliato'])
L.mc('You want to stop an older man in the street and ask him the way. What do you say?', "Scusi, sa dov'è la stazione?",
     ["Scusa, sai dov'è la stazione?", "Senti, dov'è la stazione?"], 'A stranger: Lei.', [])
L.mc('A passer-by explains the way. What do you have to do?', 'Go straight on, then turn left',
     ['Turn left, then go back', 'Go straight on, then turn right'], 'Va dritto, then gira a sinistra.', ['sinistra'],
     ctx='Allora, va dritto e poi gira a sinistra.')
L.cloze("Complete: No, it's the wrong way.", 'No, è la strada ___.', 'sbagliata', 'Strada is feminine.', ['sbagliato'])
L.mc('The passer-by goes on. What do you have to do next?', 'Cross the bridge', ['Turn at the bridge', 'Go back to the bridge'],
     'Deve + attraversare.', ['attraversare', 'ponte'], ctx='Poi deve attraversare il ponte.')
L.mc("A tourist asks you the way, but you're not from here either. What do you say?", 'Mi dispiace, non sono di qui.',
     ['Mi dispiace, non sono qui.', 'Prego, sono di qui.'], 'Di qui: from here.', [])
L.cloze('Complete: Do you have a map? I always get lost.', 'Hai una mappa? Mi ___ sempre.', 'perdo', 'Perdersi, io.', ['perdersi', 'mappa'])
L.line('A woman stops you and asks the way to piazza della Signoria. Tell her: straight on, then turn right at the lights.',
       [{"speaker": "Woman", "text": "Scusi, per andare in piazza della Signoria?"}, {"speaker": "You"}],
       ['Va sempre dritto e al semaforo gira a destra.', 'Allora, va dritto e poi gira a destra al semaforo.'],
       'To a stranger: the present, va and gira.', ['dritto', 'semaforo'])
L.line("You're lost and ask a man for the station. He says it's far. Ask him where the bus stop is.",
       [{"speaker": "Man", "text": "La stazione? È lontano. Deve prendere l'autobus."}, {"speaker": "You"}],
       ["Scusi, dov'è la fermata?", "E dov'è la fermata dell'autobus?"], "Dov'è + la fermata.", [])
L.arrange("Arrange: 'Paul asks a lady the way.'", 'Paul chiede la strada a una signora.', ['chiedi', 'alla'],
          'Chiedere la strada a someone.', ['chiedere'])
L.say('Ask a stranger the way to the station.', ['scusi, per andare alla stazione', "scusi, sa dov'è la stazione"],
      'Scusi, per andare a + the place?', [])
L.say('Tell a stranger: you have to cross the square.', ['deve attraversare la piazza'], 'Deve + the infinitive.', ['attraversare'])
L.say('Ask a friend if she has a map of Florence.', ['hai una mappa di firenze'], 'Avere, tu.', ['mappa'])
L.say('Say you always get lost.', ['mi perdo sempre'], 'Perdersi, io.', ['perdersi'])

# ── 4. Showing Friends the Way (practice) ──
L = lesson(4, 'Showing Friends the Way', 'practice')
L.line("Tomás is coming to your place by bus. He phones from the stop. Tell him to cross the square and take the first street on the right.",
       [{"speaker": "Tomás", "text": "Sono alla fermata, in piazza. E adesso?"}, {"speaker": "You"}],
       ['Attraversa la piazza e prendi la prima a destra.', 'Attraversa la piazza, poi prendi la prima strada a destra.'],
       'Two commands to a friend.', ['attraversare', 'destra'])
L.line("Yuki and Aiko text you from in front of the Duomo. The bar is straight on, on the corner by the lights.",
       [{"speaker": "Aiko", "text": "Siamo davanti al Duomo. Dov'è il bar?"}, {"speaker": "You"}],
       ["Andate dritto fino al semaforo: il bar è all'angolo.", "Andate sempre dritto. Il bar è all'angolo, al semaforo."],
       'Two friends: andate.', ['fino a', 'angolo'])
L.line("Paul is walking with you and wants to turn left. It's straight on.",
       [{"speaker": "Paul", "text": "Giro a sinistra qui?"}, {"speaker": "You"}],
       ['No, non girare! Continua dritto.', 'No, vai sempre dritto.'], "Don't, to a friend: non + the infinitive.", ['girare', 'continuare'])
L.line("Chloé asks if the cinema is far. It's five minutes on foot, at the end of this street.",
       [{"speaker": "Chloé", "text": "È lontano il cinema?"}, {"speaker": "You"}],
       ['No, cinque minuti a piedi. È in fondo alla strada.', 'No, è in fondo a questa strada.'], 'In fondo a + la strada.', ['in fondo'])
L.line("Luca is driving to your place and asks where to park. There's a car park behind the church: at the lights he turns right.",
       [{"speaker": "Luca", "text": "C'è un parcheggio vicino a casa tua?"}, {"speaker": "You"}],
       ['Sì, dietro la chiesa. Al semaforo gira a destra.', 'Sì: al semaforo gira a destra, il parcheggio è dietro la chiesa.'],
       'Where it is, then a command.', ['semaforo', 'girare'])
L.line("A friend wants to go this way, but it's the wrong way.",
       [{"speaker": "Friend", "text": "Andiamo di qua?"}, {"speaker": "You"}],
       ['No, è la strada sbagliata. Torniamo indietro.', 'No, di qua è sbagliato. Torniamo indietro!'], "Let's go back: the noi form.", ['sbagliato', 'indietro'])
L.line("A friend arrives at the station and asks if she should take a taxi. Your place is close: tell her to walk.",
       [{"speaker": "Friend", "text": "Sono alla stazione. Prendo un taxi?"}, {"speaker": "You"}],
       ['No, vieni a piedi: ci vogliono dieci minuti.', 'No, non prendere il taxi! Vieni a piedi, è vicino.'], 'Venire, to a friend: vieni.', [])
L.mc('Two friends are about to cross a busy road without looking. You shout:', 'Attenzione! Non attraversate!',
     ['Attenzione! Non attraversare!', 'Attenzione! Attraversate!'], 'Two friends: voi.', ['attraversare'])
L.say("Tell a friend: don't take the bus, it's close.", ["non prendere l'autobus, è vicino"], "Don't, to a friend: non + the infinitive.", [])
L.arrange("Arrange: 'Let's cross here, at the lights.'", 'Attraversiamo qui, al semaforo.', ['attraversa', 'angolo'],
          "Let's: the noi form.", ['attraversare', 'semaforo'])
L.say('Tell a friend: carry on as far as the bridge, then turn left.', ['continua fino al ponte, poi gira a sinistra', 'continua fino al ponte e poi gira a sinistra'],
      'Continua, then gira.', ['continuare', 'ponte'])

# ── 5. Excuse Me… (practice) ──
L = lesson(5, 'Excuse Me…', 'practice')
L.line('An older tourist asks you the way to the Duomo. Tell her: straight on, then left. Ten minutes.',
       [{"speaker": "Tourist", "text": "Scusi, dov'è il Duomo?"}, {"speaker": "You"}],
       ['Va sempre dritto, poi gira a sinistra. Ci vogliono dieci minuti.', 'Allora, va dritto e poi gira a sinistra. Dieci minuti.'],
       'To a stranger: the present, va and gira.', ['dritto', 'sinistra'])
L.line("A man asks if there's a pharmacy nearby. There is, at the end of the street, on the right.",
       [{"speaker": "Man", "text": "Senta, scusi: c'è una farmacia qui vicino?"}, {"speaker": "You"}],
       ['Sì, in fondo alla strada, a destra.', 'Sì, è in fondo alla strada, a destra.'], 'In fondo a, then a destra.', ['in fondo', 'destra'])
L.line('You need the bus stop. Stop a passer-by and ask.',
       [{"speaker": "You"}, {"speaker": "Passer-by", "text": "La fermata? È lì, davanti alla banca."}],
       ["Scusi, dov'è la fermata dell'autobus?", "Scusi, sa dov'è la fermata?"], 'Scusi, then the question.', [])
L.line("A passer-by gives you directions much too fast. Ask her to repeat them more slowly.",
       [{"speaker": "Passer-by", "text": "Allora, va dritto, al secondo incrocio gira a destra, poi attraversa il ponte e…"}, {"speaker": "You"}],
       ['Scusi, può ripetere più piano, per favore?', 'Può ripetere, per favore?'], 'Potere, Lei: può.', ['incrocio'])
L.line("A tourist asks if the station is far. It is: he has to take the bus.",
       [{"speaker": "Tourist", "text": "La stazione è lontano?"}, {"speaker": "You"}],
       ["Sì, è lontano. Deve prendere l'autobus.", "Abbastanza. Deve prendere l'autobus."], 'Deve + the infinitive.', [])
L.line("A woman asks if this is the way to the station. It's the wrong way: she has to go back.",
       [{"speaker": "Woman", "text": "Scusi, è questa la strada per la stazione?"}, {"speaker": "You"}],
       ['No, è la strada sbagliata. Deve tornare indietro.', 'No, deve tornare indietro.'], 'Deve + tornare.', ['sbagliato', 'indietro'])
L.line("Someone asks you the way to the Ponte Vecchio, but you don't know Florence.",
       [{"speaker": "Man", "text": "Scusi, per il Ponte Vecchio?"}, {"speaker": "You"}],
       ['Mi dispiace, non lo so. Non sono di qui.', 'Mi dispiace, non sono di qui.'], 'Say sorry, and why.', [])
L.mc('A stranger asks the way. Which answer has the right register?', 'Va dritto e poi gira a destra.',
     ['Vai dritto e poi gira a destra.', 'Andate dritto e poi girate a destra.'], 'A stranger: Lei, with the present.', ['dritto', 'destra'])
L.say('Thank a stranger for the directions: thank you, very kind.', ['grazie, molto gentile', 'grazie mille, molto gentile'], 'Gentile.', [])
L.say('Ask a stranger how long it takes on foot.', ['quanto ci vuole a piedi', 'quanto tempo ci vuole a piedi'], 'Ci vuole: it takes.', [])

# ── 6. Come to Mine (reading: a message) ──
L = lesson(6, 'Directions to Emma\'s', 'reading')
L.reading = {"title": "Come arrivare da me", "paragraphs": [
    "Emma: Ciao Tomás! Allora, venerdì cena da me alle otto, con Yuki e Aiko. Ecco come arrivare.",
    "Emma: Prendi l'autobus e scendi in piazza San Marco. Dalla fermata guarda la chiesa: a destra della chiesa c'è una strada. Prendi quella e vai sempre dritto fino al semaforo.",
    "Emma: Al semaforo attraversa e continua dritto. Poi prendi la seconda strada a destra, non la prima! È una strada piccola e stretta, con un bar all'angolo.",
    "Emma: Il mio portone è in fondo alla strada, a sinistra: è verde, numero 14. Suona il campanello «Emma». Se ti perdi, telefona!",
    "Venerdì, alle otto e un quarto, arriva un messaggio di Tomás.",
    "Tomás: Emma, sono davanti al numero 14, ma il portone è marrone, non verde. E all'angolo non c'è un bar: c'è una farmacia.",
    "Emma: Sei nella strada sbagliata! È la prima a destra o la seconda?",
    "Tomás: La prima…",
    "Emma: Torna indietro, fino alla strada grande. Poi gira a destra, vai avanti un po' e prendi la prossima a destra. Aspetto davanti al portone!",
    "Dieci minuti dopo, Tomás vede un bar all'angolo. In fondo alla strada, davanti a un portone verde, ci sono Emma, Yuki e Aiko.",
    "Aiko: Benvenuto, Tomás! Destra, sinistra… È difficile, no?",
]}
L.vocab = [
    V('portone', 'front door, main door (of a building)', 'Il portone è verde.'),
    V('campanello', 'doorbell, buzzer · suonare il campanello = to ring the bell', 'Suona il campanello!'),
]
L.mc('What is happening on Friday?', "Dinner at Emma's", ['A lesson at school', 'A trip to the station'], "'Venerdì cena da me.'", [])
L.mc('Where does Tomás get off the bus?', 'In piazza San Marco', ['At the station', 'In front of the bar'], 'Read the second paragraph.', [])
L.mc('Which street should Tomás take after the lights?', 'The second on the right', ['The first on the right', 'The second on the left'],
     "'La seconda strada a destra, non la prima!'", ['destra'])
L.mc("What is on the corner of Emma's street?", 'A bar', ['A pharmacy', 'A church'], "'Con un bar all'angolo.'", ['angolo'])
L.mc("What is Emma's front door like?", 'Green, number 14', ['Brown, number 14', 'Green, number 41'], 'Read the fourth paragraph.', ['portone'])
L.mc('Why is Tomás in the wrong street?', 'He took the first street on the right', ['He got off at the wrong stop', 'He turned left at the lights'],
     "'La prima…'", ['sbagliato'])
L.mc('True or false: Emma waits for Tomás inside the flat.', 'False', ['True'], "'Aspetto davanti al portone!'", [])
L.cloze("Complete from the text: ring the bell.", 'Suona il ___.', 'campanello', 'Doorbell.', ['campanello'])
L.cloze('Complete from the text: if you get lost, phone!', 'Se ti ___, telefona!', 'perdi', 'Perdersi, tu.', ['perdersi'])
L.answer("Com'è la strada di Emma?", ['piccola e stretta', 'è piccola e stretta', 'è una strada piccola e stretta'], 'Read the third paragraph.', [])
L.answer("Che cosa c'è all'angolo della strada sbagliata?", ["una farmacia", "c'è una farmacia"], "Read Tomás's message.", ['angolo'])

# ── 7. Paul Is Late (reading: a story) ──
L = lesson(7, 'Paul Is Late', 'reading')
L.reading = {"title": "Dov'è via delle Rose?", "paragraphs": [
    "Stasera Paul va a cena da Luca. Luca abita in via delle Rose, vicino alla stazione, e cucina un risotto per due. La cena è alle otto.",
    "Paul esce dall'ospedale alle sette e mezza, di corsa come sempre. Ha l'indirizzo, ma non ha il telefono: è a casa, sul tavolo.",
    "Alle otto meno un quarto Paul è alla stazione. Entra nel bar della stazione e chiede la strada a una signora.",
    "Paul: Scusi, signora, sa dov'è via delle Rose?",
    "Signora: Via delle Rose? Sì, è vicino. Allora: va sempre dritto fino al semaforo e lì gira a destra. Poi prende la seconda a sinistra e attraversa una piccola piazza, con una chiesa. Via delle Rose è lì, dietro la chiesa.",
    "Paul: Grazie, molto gentile!",
    "Paul va dritto fino al semaforo e gira… a sinistra. Quando ha fretta, per Paul destra e sinistra sono uguali.",
    "Va avanti per venti minuti, ma non vede nessuna piazza e nessuna chiesa. Vede negozi, turisti e poi, davanti a lui, un fiume. L'Arno!",
    "Allora chiede la strada a un ragazzo.",
    "Ragazzo: Via delle Rose? Vicino alla stazione? Ma è lontano! Deve tornare indietro, verso la stazione.",
    "Paul torna indietro. Alle otto e mezza, stanco, è di nuovo al bar della stazione. Questa volta chiede al cameriere.",
    "Cameriere: Via delle Rose? È qui dietro! Esce dal bar, gira a destra e poi ancora a destra. Due minuti.",
    "Alle nove meno venti Paul suona il campanello. Luca apre il portone.",
    "Luca: Paul! Sono le nove meno venti! Il risotto è freddo!",
    "Paul: Lo so, lo so. Ma adesso conosco Firenze molto bene!",
]}
L.vocab = []  # verso is taught in Likes & Plans (unit-18)
L.mc('Why is Paul going to Luca\'s tonight?', 'For dinner', ['To study English', 'To watch a football match'], "'Paul va a cena da Luca.'", [])
L.mc("Why can't Paul phone Luca?", 'His phone is at home', ["He doesn't have Luca's number", 'Luca never answers'], "'Non ha il telefono: è a casa.'", [])
L.mc('What does the lady tell Paul to do at the lights?', 'Turn right', ['Turn left', 'Cross the road'], "'Lì gira a destra.'", ['destra'])
L.mc('What does Paul do at the lights?', 'He turns left', ['He turns right', 'He goes back'], "'E gira… a sinistra.'", ['sinistra'])
L.mc('Where does Paul end up after twenty minutes?', 'At the river', ['In a small square with a church', "At Luca's door"], "'Un fiume. L'Arno!'", ['fiume'])
L.mc('True or false: via delle Rose is far from the station.', 'False', ['True'], "'È qui dietro!'", [])
L.mc('Who finally gives Paul the right directions?', 'The waiter at the station bar', ['The young man', 'Luca'], 'Read the paragraph after Paul goes back.', [])
L.cloze('Complete from the text: he has to go back, towards the station.', 'Deve tornare indietro, ___ la stazione.', 'verso', 'Towards.', ['verso', 'indietro'])
L.cloze('Complete from the text: he goes on for twenty minutes.', 'Va ___ per venti minuti.', 'avanti', 'Forward.', ['avanti'])
L.answer('A chi chiede la strada Paul la prima volta?', ['a una signora', 'chiede la strada a una signora'], 'Read the third paragraph.', ['chiedere'])
L.answer('A che ora arriva Paul da Luca?', ['alle nove meno venti', 'arriva alle nove meno venti'], 'Read the end of the story.', [])

# ── 8. Getting to School (reading: a notice with a map) ──
L = lesson(8, 'Getting to School', 'reading')
L.reading = {"title": "Come arrivare alla scuola", "paragraphs": [
    "Benvenuti! La scuola è in via dei Servi 40, a cinque minuti a piedi dal Duomo. Le lezioni cominciano lunedì alle nove.",
    "Dalla stazione · a piedi, circa quindici minuti",
    "Uscite dalla stazione di Santa Maria Novella e prendete via Panzani. Andate sempre dritto: dopo dieci minuti arrivate in piazza del Duomo.",
    "Passate a sinistra del Duomo e continuate fino in fondo alla piazza. Lì, dietro il Duomo, comincia via dei Servi: è una strada lunga e dritta. Al numero 12 c'è il negozio di Rita; la scuola è più avanti, al numero 40.",
    "In autobus · la fermata è davanti alla stazione. Scendete in piazza San Marco: da lì ci vogliono cinque minuti a piedi.",
    "In bici · ci sono posti per le bici davanti alla scuola.",
    "In macchina · non venite in macchina: in centro non c'è parcheggio!",
    "Sulla mappa la stazione è in alto a sinistra e il Duomo è al centro. La scuola è a destra del Duomo, un po' più in alto, vicino a piazza San Marco. In basso c'è l'Arno, con il Ponte Vecchio.",
    "Se vi perdete, chiedete la strada: tutti sanno dov'è il Duomo!",
    "La segreteria",
]}
L.vocab = [
    V('segreteria', 'office (of a school or company), reception · in segreteria = at the office', 'Il libro è in segreteria.'),
    V('in alto', 'at the top, up there · in basso = at the bottom, down there', 'Sulla mappa, la stazione è in alto a sinistra.'),
]
L.mc('Who is this notice for?', 'New students at the school', ['Tourists at the station', "Rita's customers"], "'Benvenuti!'", [])
L.mc('How long is the walk from the station?', 'About fifteen minutes', ['About five minutes', 'About thirty minutes'], 'Read the second line.', [])
L.mc('Which side of the Duomo do you walk along?', 'The left', ['The right', 'You walk round the back of the station'], "'Passate a sinistra del Duomo.'", ['sinistra'])
L.mc('Where does via dei Servi start?', 'Behind the Duomo', ['In front of the station', 'At the river'], "'Dietro il Duomo, comincia via dei Servi.'", [])
L.mc("True or false: the school is before Rita's shop.", 'False', ['True'], "'La scuola è più avanti, al numero 40.'", ['avanti'])
L.mc('Why shouldn\'t you come by car?', "There's nowhere to park in the centre", ['The school is too far', 'The streets are closed'],
     "'In centro non c'è parcheggio!'", [])
L.mc('Where is the river on the map?', 'At the bottom', ['At the top', 'On the left'], "'In basso c'è l'Arno.'", ['in alto', 'fiume'])
L.cloze('Complete from the text: on the map, the station is at the top on the left.', 'Sulla mappa la stazione è in ___ a sinistra.', 'alto', 'At the top.', ['in alto', 'mappa'])
L.cloze('Complete from the text: if you get lost, ask the way.', 'Se vi perdete, ___ la strada.', 'chiedete', 'Chiedere, to several people.', ['chiedere', 'perdersi'])
L.answer('Dove scendete con l\'autobus?', ['in piazza San Marco', 'scendiamo in piazza San Marco'], 'Read the line about the bus.', [])
L.answer('Chi scrive?', ['la segreteria', 'la segreteria della scuola'], 'Read the last line.', ['segreteria'])

# ── 9–10. Writing ──
L = lesson(9, 'Come to My Place', 'writing')
L.write("A friend is coming to your home for the first time. Write a message with the way from the nearest bus stop or station to your door.",
        "Ciao Marco! Scendi dall'autobus in piazza Garibaldi. Attraversa la piazza e prendi la prima strada a sinistra. Vai sempre dritto fino al semaforo, poi gira a destra. La mia casa è in fondo alla strada, accanto a una farmacia: il portone è nero, numero 8. Suona il campanello e sali. Se ti perdi, telefona!",
        'Commands to a friend: prendi, vai, gira, attraversa. Add landmarks (al semaforo, all\'angolo, in fondo a).', ['destra', 'sinistra', 'semaforo', 'in fondo'])
L = lesson(10, 'Paul Is Lost Again', 'writing')
L.reading = {"title": "Un messaggio di Paul", "paragraphs": [
    "Paul: Aiuto! Sono in piazza del Duomo, davanti alla porta grande. La lezione comincia fra cinque minuti e non so dov'è la scuola. Destra o sinistra?",
]}
L.write("Paul is lost on his way to school. The school is in via dei Servi, behind the Duomo. Reply with the way, step by step.",
        "Ciao Paul! Non è lontano. Passa a sinistra del Duomo e vai avanti fino in fondo alla piazza. Lì, dietro il Duomo, c'è via dei Servi. Prendi quella strada e vai sempre dritto: la scuola è al numero 40, dopo il negozio di Rita. Cinque minuti a piedi. A dopo!",
        'Commands to a friend: passa, vai, prendi. Name the landmarks.', ['sinistra', 'in fondo', 'dritto'])

# ── 11. Speaking ──
L = lesson(11, 'Say It Out Loud', 'speaking')
L.read("Scusi, per andare alla stazione?", 'Asking the way.', [])
L.read('Vai sempre dritto e poi gira a destra.', 'Dritto, destra.', ['dritto', 'destra'])
L.read("Al semaforo, gira a sinistra.", 'Semaforo, sinistra.', ['semaforo', 'sinistra'])
L.read('Attraversate il ponte.', 'Attraversate: to several people.', ['attraversare', 'ponte'])
L.read("C'è un bar all'angolo.", "All'angolo.", ['angolo'])
L.read('No, è la strada sbagliata. Torniamo indietro.', 'Sbagliata, indietro.', ['sbagliato', 'indietro'])
L.read('Mi dispiace, non sono di qui.', 'Di qui.', [])
L.read("Scusi, può ripetere più piano?", 'Può ripetere.', [])

for L in LESSONS:
    L.dump()
print('\n'.join(L.meta(L.n) for L in LESSONS))
