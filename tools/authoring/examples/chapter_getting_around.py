"""Chapter 'Getting Around' (unit-14), after the grammar unit Time & dates.

Available: units 1–11 (clock times, alle / dalle, the 24-hour clock on timetables, days, dates;
in treno / in autobus / a piedi from Prepositions; volere / potere / dovere and vorrei; regular
verbs prendere, partire, arrivare, aspettare), chapters 1–12. Not yet: possessives (no 'mio'),
piacere, reflexives, the imperative (so: 'Deve scendere alla terza fermata', 'Puoi prendere un
taxi'), the past. Shopping (unit-17) is written in parallel, so none of its words are used.
Cast: Giulia's class takes the train to Bologna on a Saturday; Luca (Paul's language-exchange
partner, from Bologna) meets them there. Readings: a message with a plan, then a departures board,
an announcement and the morning itself.
"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from chapterlib import Lesson, V

U = 'unit-14'
D = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'out', U)
os.makedirs(D, exist_ok=True)
LESSONS = []
def lesson(n, name, role):
    L = Lesson(U, D, n, name, role); LESSONS.append(L); return L

def phrase(word, meaning, example):
    v = V(word, meaning, example); v['phrase'] = True; return v

# ── 1. Bus, Taxi and Metro ──
L = lesson(1, 'Bus, Taxi and Metro', 'words')
L.vocab = [
    V('fermata', "stop (bus, tram, metro) · la fermata dell'autobus = the bus stop", "La fermata dell'autobus è davanti alla banca."),
    V('passare', 'to come by, to pass (a bus or train); to spend (time)', "L'autobus passa ogni dieci minuti."),
    V('prossimo', 'next · la prossima fermata = the next stop', 'Il prossimo autobus passa fra cinque minuti.'),
    V('scendere', 'to get off, to go down · scendere dal treno = to get off the train', 'Scendo alla prossima fermata.'),
    V('taxi', 'taxi · i taxi (no change in the plural)', 'Prendo un taxi per la stazione.'),
    V('aeroporto', "airport · all'aeroporto = at or to the airport", "L'autobus per l'aeroporto parte dalla stazione."),
    V('metro', 'underground, metro · la metro (short for la metropolitana)', 'A Roma vado al lavoro in metro.'),
    V('tabaccheria', "tobacconist's (it also sells bus tickets and stamps) · in tabaccheria", "Compro il biglietto dell'autobus in tabaccheria."),
    V('traffico', 'traffic', "Oggi c'è molto traffico in centro."),
]
L.meaning('fermata', "La fermata dell'autobus è davanti alla banca.", ['stop', 'bus stop', 'the stop', 'the bus stop'], 'Where the bus stops.', ['fermata'])
L.meaning('scendo', 'Scendo alla prossima fermata.', ['I get off', "I'm getting off", "I'll get off"], 'Scendere, io.', ['scendere', 'prossimo'])
L.mc("You're at a bus stop and want to know how often the bus comes. What do you ask?", "Ogni quanto passa l'autobus?",
     ["Quando scende l'autobus?", "Quanto costa l'autobus?"], 'Ogni quanto: how often.', ['passare'])
L.cloze('Complete: The bus comes every ten minutes.', "L'autobus ___ ogni dieci minuti.", 'passa', 'Passare, for the bus.', ['passare'])
L.mc("You need a bus ticket in an Italian town. Where can you usually buy one?", 'In tabaccheria.', ['In farmacia.', 'In banca.'],
     'The same shop sells stamps.', ['tabaccheria'])
L.cloze('Complete: I take a taxi to the airport.', "Prendo un ___ per l'aeroporto.", 'taxi', 'The same word as in English.', ['taxi', 'aeroporto'])
L.mc('You live in Rome and go to work by underground. How do you say it?', 'Vado al lavoro in metro.', ['Vado al lavoro a metro.', 'Vado al lavoro di metro.'],
     'Like in treno and in autobus.', ['metro'])
L.cloze('Complete: Florence airport is small.', "L'___ di Firenze è piccolo.", 'aeroporto', 'Where the planes are.', ['aeroporto'])
L.cloze('Complete: The next bus comes in five minutes.', 'Il ___ autobus passa fra cinque minuti.', 'prossimo', 'Next.', ['prossimo'])
L.line("At the bus stop, a woman asks if this bus goes to the centre. It does.",
       [{"speaker": "Woman", "text": "Scusi, questo autobus va in centro?"}, {"speaker": "You"}],
       ['Sì, va in centro.', 'Sì, questo va in centro.'], 'Andare: va.', [])
L.line("You're on a bus and ask the driver where to get off for the museum.",
       [{"speaker": "You"}, {"speaker": "Driver", "text": "Alla prossima fermata."}],
       ['Scusi, dove devo scendere per il museo?', 'Scusi, per il museo dove scendo?'], 'Dovere + scendere.', ['scendere'])
L.arrange("Arrange: 'The bus for the airport leaves from the station.'", "L'autobus per l'aeroporto parte dalla stazione.", ['alla', 'passa'],
          'Per + where it goes, da + where it leaves from.', ['aeroporto'])
L.say('Say you are getting off at the next stop.', ['scendo alla prossima fermata', 'scendo alla prossima'], 'Alla prossima: a + la.', ['scendere', 'prossimo', 'fermata'])
L.say('Ask how much a taxi to the airport costs.', ["quanto costa un taxi per l'aeroporto", "quanto costa il taxi per l'aeroporto"], 'Quanto costa, then per.', ['taxi', 'aeroporto'])
L.say("Say there's a lot of traffic today.", ["oggi c'è molto traffico", "c'è molto traffico oggi"], "C'è molto…", ['traffico'])
L.say('Say that in Rome you take the metro every day.', ['a roma prendo la metro ogni giorno', 'a roma prendo la metro tutti i giorni'], 'La metro.', ['metro'])

# ── 2. Trains and Times ──
L = lesson(2, 'Trains and Times', 'words')
L.vocab = [
    V('orario', 'timetable; time (of a train or a shop) · in orario = on time', 'Il treno per Roma è in orario.'),
    V('partenza', 'departure · partenze = departures (on a board)', 'La partenza è alle nove.'),
    V('arrivo', 'arrival · arrivi = arrivals (on a board)', "L'arrivo a Roma è alle undici."),
    V('binario', 'platform, track · binari (plural)', 'Il treno per Bologna parte dal binario sei.'),
    V('ritardo', 'delay · in ritardo = late', 'Il treno è in ritardo di dieci minuti.'),
    V('diretto', 'direct', 'È un treno diretto: non devo cambiare.'),
    V('durare', 'to last, to take (time)', 'Il viaggio dura due ore.'),
    V('circa', 'about, roughly', "Il viaggio dura circa un'ora."),
    phrase('ci vuole', 'it takes (time) · ci vogliono with a plural: ci vogliono dieci minuti', 'Da qui al centro ci vogliono dieci minuti.'),
    phrase("mezz'ora", 'half an hour', "Il treno per Pisa parte fra mezz'ora."),
]
L.add('vocab', 'match_pairs', 'Match the Italian words with their English meanings.', '',
      ['partenza|departure', 'arrivo|arrival', 'binario|platform', 'ritardo|delay', 'orario|timetable'], (), [], ['partenza', 'arrivo', 'binario', 'ritardo', 'orario'])
L.meaning('binario', 'Il treno per Bologna parte dal binario sei.', ['platform', 'track', 'the platform'], 'Where you wait for the train.', ['binario'])
L.meaning('in ritardo', 'Il treno è in ritardo di dieci minuti.', ['late', 'delayed'], 'Ritardo: delay.', ['ritardo'])
L.mc('The board shows your train like this. What does it tell you?', "It's on time", ["It's late", 'It leaves from another platform'],
     'Orario: time, timetable.', ['orario'], ctx='Bologna · binario 4 · in orario')
L.mc("You're going to Rome. Which platform do you go to?", '7', ['3', '9'], 'Find Roma on the board.', ['partenza', 'binario'],
     ctx='Partenze\n9:10 · Pisa · binario 3\n9:25 · Roma · binario 7\n9:40 · Milano · binario 9')
L.cloze('Complete: The departure is at nine and the arrival at half past ten.', "La ___ è alle nove e l'arrivo alle dieci e mezza.", 'partenza', 'Departure.', ['partenza', 'arrivo'])
L.cloze('Complete: How long does the journey take?', 'Quanto ___ il viaggio?', 'dura', 'Durare.', ['durare'])
L.cloze('Complete: The journey takes about an hour.', "Il viaggio dura ___ un'ora.", 'circa', 'About.', ['circa'])
L.mc("You want to know if you have to change trains. What do you ask?", 'È diretto?', ['È in orario?', 'È in ritardo?'], 'Direct: no change.', ['diretto'])
L.mc('Which says "It takes two hours"?', 'Ci vogliono due ore.', ['Ci vuole due ore.', 'Ci vogliono due ora.'], 'Ore is plural, so the verb is plural too.', ['ci vuole'])
L.line("At the station, you ask when the next train to Rome leaves.",
       [{"speaker": "You"}, {"speaker": "Employee", "text": "Alle undici e mezza, dal binario due."}],
       ['Scusi, a che ora parte il prossimo treno per Roma?', 'A che ora parte il prossimo treno per Roma?'], 'A che ora…?', ['prossimo'])
L.line("A friend is waiting for you at the station. Your train is twenty minutes late.",
       [{"speaker": "Friend", "text": "Ciao! A che ora arrivi?"}, {"speaker": "You"}],
       ['Il treno è in ritardo di venti minuti.', 'Il treno ha venti minuti di ritardo.'], 'In ritardo di + the minutes.', ['ritardo'])
L.arrange("Arrange: 'The train arrives in Bologna at ten.'", 'Il treno arriva a Bologna alle dieci.', ['parte', 'dal'], 'Alle + the hour.', [])
L.say('Ask how long the journey takes.', ['quanto dura il viaggio', 'quanto tempo ci vuole'], 'Durare, or ci vuole.', ['durare'])
L.say('Say it takes half an hour.', ["ci vuole mezz'ora", "dura mezz'ora"], "Mezz'ora.", ["mezz'ora", 'ci vuole'])
L.say('Say the train for Florence leaves from platform four.', ['il treno per firenze parte dal binario quattro'], 'Dal binario.', ['binario'])
L.say('Ask if the train for Rome is on time.', ['il treno per roma è in orario'], 'In orario.', ['orario'])

# ── 3. Buying a Ticket ──
L = lesson(3, 'Buying a Ticket', 'words')
L.vocab = [
    V('biglietteria', 'ticket office', 'La biglietteria è vicino al binario uno.'),
    V('andata', 'the way there · solo andata = one way, a single', 'Solo andata, per favore.'),
    V('ritorno', 'the way back, return · andata e ritorno = a return (ticket)', 'Un biglietto andata e ritorno per Roma, per favore.'),
    V('finestrino', 'window (of a train, bus or car)', 'Vorrei un posto vicino al finestrino.'),
    V('veloce', 'fast · veloci (plural)', 'Il treno veloce è caro.'),
    V('lento', 'slow', "Il treno lento è economico, ma dura quattro ore."),
]
L.meaning('andata e ritorno', 'Un biglietto andata e ritorno per Roma, per favore.', ['return', 'a return', 'return ticket', 'round trip'],
          'There and back.', ['andata', 'ritorno'])
L.meaning('lento', "Il treno lento è economico, ma dura quattro ore.", ['slow'], 'The opposite of veloce.', ['lento'])
L.cloze("Complete: Where's the ticket office?", "Scusi, dov'è la ___?", 'biglietteria', 'Where you buy tickets.', ['biglietteria'])
L.mc('At the ticket office you want a ticket to Pisa and back. What do you say?', 'Andata e ritorno per Pisa, per favore.',
     ['Solo andata per Pisa, per favore.', 'Andata e arrivo per Pisa, per favore.'], 'There and back.', ['andata', 'ritorno'])
L.cloze("Complete: I'd like a seat by the window.", 'Vorrei un posto vicino al ___.', 'finestrino', 'The window of a train.', ['finestrino'])
L.mc('Which sentence is true?', "Il treno lento è economico, ma dura quattro ore.",
     ['Il treno veloce è economico.', "Il treno lento dura un'ora e mezza."], 'Compare the two trains.', ['veloce', 'lento'],
     ctx="Firenze · Roma\nTreno veloce · un'ora e mezza · 45 euro\nTreno lento · quattro ore · 20 euro")
L.line('At the ticket office in Florence. You want to go to Bologna.',
       [{"speaker": "Clerk", "text": "Buongiorno! Dove va?"}, {"speaker": "You"}],
       ['Un biglietto per Bologna, per favore.', 'Vorrei un biglietto per Bologna, per favore.'], 'Un biglietto per + the city.', ['biglietteria'])
L.line('The clerk asks if you want a single. You want a return.',
       [{"speaker": "Clerk", "text": "Solo andata?"}, {"speaker": "You"}],
       ['No, andata e ritorno.', 'Andata e ritorno, per favore.'], 'There and back.', ['andata', 'ritorno'])
L.line('You pay. Then you ask which platform the train leaves from.',
       [{"speaker": "Clerk", "text": "Sono venti euro, grazie."}, {"speaker": "You"}],
       ['Da quale binario parte il treno?', 'Grazie. Da che binario parte?'], 'The preposition goes first: da quale…?', ['binario'])
L.arrange("Arrange: 'A one-way ticket to Rome.'", 'Un biglietto di sola andata per Roma.', ['ritorno', 'solo'], 'Sola agrees with andata.', ['andata'])
L.say("Say you'd like two return tickets to Pisa.", ['vorrei due biglietti andata e ritorno per pisa', 'vorrei due biglietti di andata e ritorno per pisa'],
      'Vorrei, then biglietti (plural).', ['andata', 'ritorno'])
L.say('Say this train is fast but expensive.', ['questo treno è veloce ma caro', 'questo treno è veloce, ma è caro'], 'Veloce, caro.', ['veloce'])
L.say('Ask if there is a fast train to Rome.', ["c'è un treno veloce per roma"], "C'è…?", ['veloce'])

# ── 4. At the Station (practice) ──
L = lesson(4, 'At the Station', 'practice')
L.line("At the ticket office in Florence. You want a return ticket to Rome for today.",
       [{"speaker": "Clerk", "text": "Buongiorno! Dove va?"}, {"speaker": "You"}],
       ['Un biglietto andata e ritorno per Roma, per favore.', 'Vorrei un biglietto per Roma, andata e ritorno.'], 'Un biglietto per…, andata e ritorno.', ['ritorno'])
L.line("The clerk gives you two trains. You have time and want the cheap one.",
       [{"speaker": "Clerk", "text": "Il treno delle dieci è veloce, ma costa quaranta euro. Il treno delle dieci e mezza è lento e costa venti euro."}, {"speaker": "You"}],
       ['Prendo il treno delle dieci e mezza.', 'Il treno delle dieci e mezza, per favore.'], 'Il treno delle + the time.', ['lento'])
L.line("On the platform, a man asks if this is the train for Bologna. It's the train for Rome; the Bologna train leaves from platform five.",
       [{"speaker": "Man", "text": "Scusi, è questo il treno per Bologna?"}, {"speaker": "You"}],
       ['No, questo è il treno per Roma. Il treno per Bologna parte dal binario cinque.', 'No, il treno per Bologna parte dal binario cinque.'],
       'Dal binario + the number.', ['binario'])
L.line("A friend phones. Your train arrives at 18:40, but it's ten minutes late.",
       [{"speaker": "Friend", "text": "Allora, a che ora arrivi?"}, {"speaker": "You"}],
       ['Il treno è in ritardo di dieci minuti: arrivo alle sette meno dieci.', 'Alle diciotto e cinquanta. Il treno è in ritardo.'],
       'Add ten minutes to 18:40.', ['ritardo'])
L.line("At the bus stop, an older woman asks how often bus number 12 comes. It comes every fifteen minutes.",
       [{"speaker": "Woman", "text": "Scusi, ogni quanto passa il dodici?"}, {"speaker": "You"}],
       ['Passa ogni quindici minuti.', 'Ogni quindici minuti.'], 'Passare.', ['passare'])
L.line("You get into a taxi. Say where you're going, and ask how long it takes.",
       [{"speaker": "Driver", "text": "Buonasera! Dove andiamo?"}, {"speaker": "You"}],
       ["All'aeroporto, per favore. Quanto tempo ci vuole?", "All'aeroporto, per favore. Quanto ci vuole?"], 'A + the place, then ci vuole.', ['aeroporto', 'ci vuole'])
L.line("The driver answers. Now ask about the price.",
       [{"speaker": "Driver", "text": "Con il traffico, ci vogliono circa venti minuti."}, {"speaker": "You"}],
       ['E quanto costa?', 'Quanto costa, circa?'], 'Quanto costa?', ['circa'])
L.line("A friend asks how you're getting to the airport. You're taking the bus, because it's cheap.",
       [{"speaker": "Friend", "text": "Come vai all'aeroporto? In taxi?"}, {"speaker": "You"}],
       ["No, in autobus: costa poco.", "No, prendo l'autobus, perché è economico."], 'In autobus.', ['aeroporto'])
L.line("You're on a crowded bus. A man behind you wants to get past.",
       [{"speaker": "Man", "text": "Scusi, scende alla prossima?"}, {"speaker": "You"}],
       ['Sì, scendo alla prossima.', 'No, scendo dopo. Prego!'], 'Scendere, io.', ['scendere'])
L.mc('The announcement says this. When does the train leave now?', 'Alle otto e trentacinque.',
     ['Alle otto e venti.', 'Alle otto meno venti.'], 'Add twenty minutes.', ['ritardo'],
     ctx='Il treno delle otto e un quarto per Bologna è in ritardo di venti minuti.')
L.say('Ask if the train for Bologna is direct.', ['il treno per bologna è diretto', 'è diretto il treno per bologna'], 'Diretto.', ['diretto'])

# ── 5. Saturday in Bologna (reading: a message with a plan) ──
L = lesson(5, 'Saturday in Bologna', 'reading')
GIULIA_MESSAGE = {"title": "Sabato a Bologna!", "paragraphs": [
    "Ciao a tutti! Sabato andiamo a Bologna, tutti insieme, in treno. Luca, l'amico di Paul, è di Bologna e conosce bene la città: aspetta la classe alla stazione di Bologna, e poi visitiamo insieme il centro.",
    "Firenze, stazione di Santa Maria Novella · alle 7:50, davanti alla biglietteria",
    "Partenza · 8:15, treno per Bologna",
    "Arrivo a Bologna · 9:40",
    "Ritorno · 18:10 da Bologna, arrivo a Firenze alle 19:35",
    "Con il treno veloce ci vogliono circa quaranta minuti, ma il biglietto è caro. Noi prendiamo il treno lento: dura un'ora e mezza, ma è economico. Il biglietto andata e ritorno costa circa venti euro. Potete comprare il biglietto in biglietteria o su internet. Il treno è diretto: non dobbiamo cambiare.",
    "Tomás e Yuki arrivano in autobus: la fermata è davanti alla stazione.",
    "Paul, il treno parte alle otto e un quarto, non alle otto e mezza!",
    "Se il treno è in ritardo, aspettiamo al bar della stazione. A sabato!",
    "Giulia",
]}
L.reading = GIULIA_MESSAGE
L.mc('How is the class travelling to Bologna?', 'By train', ['By bus', 'By car'], "'In treno.'", [])
L.mc('Who is waiting for the class in Bologna?', "Luca, Paul's friend", ['Paul', "Giulia's colleague"], 'Read the first paragraph.', [])
L.mc('Where does the class meet in Florence?', 'In front of the ticket office', ['At the bus stop', 'At the station bar'], "'Davanti alla biglietteria.'", ['biglietteria'])
L.mc('What time does the train leave Florence?', '8:15', ['7:50', '8:30'], 'Read the line that starts with Partenza.', ['partenza'])
L.mc('Why does the class take the slow train?', "It's cheap", ["It's direct", "It's fast"], 'Read the paragraph about the two trains.', ['lento'])
L.mc('True or false: they have to change trains.', 'False', ['True'], "'Il treno è diretto.'", ['diretto'])
L.mc('How do Tomás and Yuki get to the station?', 'By bus', ['On foot', 'By taxi'], 'Read the paragraph about Tomás and Yuki.', ['fermata'])
L.mc('What does Giulia remind Paul?', 'The train leaves at 8:15, not 8:30', ['The train is late', 'He has to buy his ticket online'], 'Read the line to Paul.', [])
L.answer('A che ora arriva il treno a Bologna?', ['alle nove e quaranta', 'alle dieci meno venti', 'arriva alle nove e quaranta'], 'Read the line that starts with Arrivo.', ['arrivo'])
L.answer('Quanto costa il biglietto andata e ritorno?', ['circa venti euro', 'costa circa venti euro', 'venti euro'], 'Read the paragraph about the two trains.', ['circa', 'ritorno'])
L.answer('Che cosa fa la classe se il treno è in ritardo?', ['aspetta al bar della stazione', 'aspettiamo al bar della stazione', 'aspetta al bar'],
         'Read the last paragraph.', ['ritardo'])

# ── 6. Platform Six (reading: a departures board, an announcement, the morning) ──
L = lesson(6, 'Platform Six', 'reading')
L.reading = {"title": "Binario sei", "paragraphs": [
    "Sabato mattina, alla stazione di Firenze. Sono le otto meno dieci. Davanti alla biglietteria ci sono Giulia, Emma, Tomás, Yuki e Aiko. Paul non c'è.",
    "Partenze",
    "8:05 · Roma · binario 9 · in orario",
    "8:15 · Bologna · binario 6 · ritardo 20 minuti",
    "8:20 · Pisa · binario 4 · in orario",
    "Annuncio: Attenzione! Il treno delle otto e quindici per Bologna è in ritardo di venti minuti. Il treno parte dal binario sei.",
    "Aiko: Venti minuti di ritardo! Allora prendiamo un caffè?",
    "Giulia: Va bene. Ma dov'è Paul?",
    "Alle otto e venti arriva un messaggio di Paul: «Sono in taxi, ma c'è molto traffico! Arrivo fra dieci minuti.»",
    "La classe aspetta al bar. Alle otto e mezza Paul arriva di corsa, senza biglietto. Compra il biglietto in biglietteria, e alle otto e trentacinque il treno parte.",
    "Il viaggio dura circa un'ora e mezza. Tomás guarda la campagna dal finestrino, Yuki legge, Aiko dorme, e Paul beve il caffè di Aiko.",
    "Alle dieci il treno arriva a Bologna. Sul binario c'è Luca.",
    "Luca: Benvenuti a Bologna! Ma perché siete in ritardo?",
    "Tutti guardano Paul.",
    "Paul: Io? Io sono in orario!",
]}
L.vocab = [
    V('annuncio', 'announcement · annunci (plural)', "Ascolto l'annuncio: il treno è in ritardo."),
]
L.mc("Who isn't at the ticket office at ten to eight?", 'Paul', ['Emma', 'Aiko'], "'Paul non c'è.'", [])
L.mc('Which platform does the train for Pisa leave from?', '4', ['6', '9'], 'Read the board.', ['binario'])
L.mc('What does the announcement say about the Bologna train?', "It's twenty minutes late", ['It leaves from another platform', "It's on time"],
     'Read the announcement.', ['annuncio'])
L.mc('Why is Paul late?', "He's in a taxi and there's a lot of traffic", ["He's on the wrong train", "He's buying his ticket"], "Read Paul's message.", ['traffico'])
L.mc("What doesn't Paul have when he arrives?", 'A ticket', ['A coffee', 'His phone'], "'Senza biglietto.'", [])
L.mc('What does Aiko do on the train?', 'She sleeps', ['She reads', 'She looks out of the window'], 'Read the paragraph about the journey.', [])
L.mc('True or false: the train arrives in Bologna on time.', 'False', ['True'], 'Departure 8:15, arrival 9:40, and twenty minutes late.', ['orario'])
L.cloze("Complete from the text: There's a lot of traffic!", "C'è molto ___!", 'traffico', 'Traffic.', ['traffico'])
L.cloze('Complete: The announcement says the train is late.', "L'___ dice: il treno è in ritardo.", 'annuncio', 'At the station, from the loudspeaker.', ['annuncio'])
L.answer('A che ora parte il treno per Bologna?', ['alle otto e trentacinque', 'parte alle otto e trentacinque'], 'Add the delay to 8:15.', ['ritardo'])
L.answer('Chi aspetta la classe sul binario a Bologna?', ['Luca', "c'è Luca", 'Luca aspetta la classe'], 'Read the end of the text.', [])
L.answer('Che cosa dice Paul alla fine?', ['io sono in orario', 'sono in orario'], 'Read the last line.', ['orario'])

# ── 7–8. Writing ──
L = lesson(7, 'Reply to Giulia', 'writing')
L.reading = GIULIA_MESSAGE
L.write("Reply to Giulia's message: say that you're coming, how you get to the station, and ask one question about the trip.",
        "Ciao Giulia! Grazie per il messaggio. Sabato vengo anch'io! Vado alla stazione in bici, perché abito vicino. Compro il biglietto su internet. Una domanda: dopo il treno delle diciotto e dieci, c'è un altro treno per Firenze? A sabato!",
        'Vengo, then how you travel (in bici, in autobus, a piedi). A question with a che ora, quanto or c\'è.', ['ritorno', 'biglietto'])
L = lesson(8, 'From the Airport', 'writing')
L.reading = {"title": "Un messaggio di Sam", "paragraphs": [
    "Ciao! Allora, arrivo venerdì da Londra, in aereo. L'aereo arriva all'aeroporto di Firenze alle 15:40.",
    "Come arrivo da te? Prendo un taxi o c'è un autobus? Quanto tempo ci vuole? E quanto costa, più o meno?",
    "Ho solo una borsa piccola: va bene anche l'autobus.",
    "A venerdì!",
    "Sam",
]}
L.write("Your friend Sam is flying in to visit you. Reply to Sam's message: say how to get from the airport to your place, how long it takes and what it costs.",
        "Ciao Sam! Dall'aeroporto puoi prendere un taxi: ci vogliono circa venti minuti e costa circa venticinque euro. C'è anche un autobus per la stazione: passa ogni mezz'ora e costa poco. Io abito vicino alla stazione, a dieci minuti a piedi. Se vuoi, vengo alla stazione alle quattro e mezza. A venerdì!",
        'Puoi prendere…; ci vuole or ci vogliono for the time; costa for the price.', ['taxi', 'aeroporto', 'ci vuole'])

# ── 9. Speaking ──
L = lesson(9, 'Say It Out Loud', 'speaking')
L.read('Un biglietto andata e ritorno per Bologna, per favore.', 'Andata e ritorno.', ['andata', 'ritorno'])
L.read('A che ora parte il prossimo treno?', 'Prossimo.', ['prossimo'])
L.read('Il treno parte dal binario sei.', 'Binario.', ['binario'])
L.read('Il treno è in ritardo di venti minuti.', 'Ritardo: the stress is on tar.', ['ritardo'])
L.read('Scusi, dove devo scendere per il museo?', 'Scendere: the sc is soft, like "sh".', ['scendere'])
L.read("L'autobus passa ogni dieci minuti.", 'Passa: hold the double s.', ['passare'])
L.read("Quanto tempo ci vuole per l'aeroporto?", 'Aeroporto: say every vowel.', ['aeroporto', 'ci vuole'])

for L in LESSONS:
    L.dump()
print('\n'.join(L.meta(L.n) for L in LESSONS))
