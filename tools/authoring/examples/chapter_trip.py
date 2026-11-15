"""Chapter 'A Trip' (unit-21), the last A1 chapter, after the grammar unit Passato prossimo.

Available: grammar units 1–16 (the passato prossimo: avere or essere, agreement with essere, the
irregular participles the unit lists, ieri / scorso / fa, già / mai / non … ancora, mi è piaciuto;
reflexives in the past as in ci siamo divertiti; the imperative for tu / noi / voi and the Lei set
phrases mi dica, prego, scusi), chapters 1–16 (last finished: My Family).
Not used: words from Likes & Plans, A Day in My Life, Finding Your Way and Feeling Unwell, which come
before this chapter but were written in parallel (no trovare, tardi, purtroppo, peccato, destra,
sinistra, ponte, mappa). No Lei commands beyond the set phrases: the receptionist says mi dica, or
può / deve + infinitive. No imperfetto (A2): stories stay in the passato prossimo and the present.
The first half books a hotel (present); the second half tells about trips (past).
Cast facts used: Emma and Chloé (Chloé works at a bar on Saturdays), Paul (a doctor, always in a
hurry), Giulia, Aiko.
New cast facts: Emma and Chloé spend a weekend in Venice (Friday 15 to Sunday 17 May) at the
Albergo Stella; Chloé swaps her Saturday shift with her colleague Giada. Paul's parents, Peter and
Mary, visit from England in October; Paul books a hotel in Rome for the wrong month.
"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from chapterlib import Lesson, V

U = 'unit-21'
D = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'out', U)
os.makedirs(D, exist_ok=True)
LESSONS = []
def lesson(n, name, role):
    L = Lesson(U, D, n, name, role); LESSONS.append(L); return L

def fill(L, prompt, ctx, ans, hint, words):
    L.add('writing', 'fill_blank', prompt, ctx, ans, (), [hint], words)

def match(L, pairs, words):
    L.add('vocab', 'match_pairs', 'Match the Italian with the English.', '', pairs, (), [], words)

# ── 1. Booking a Room ──
L = lesson(1, 'Booking a Room', 'words')
L.vocab = [
    V('albergo', 'hotel · alberghi (plural)', "Il nostro albergo è vicino alla stazione."),
    V('hotel', "hotel, the same as albergo · gli hotel (plural: it doesn't change)", "L'hotel ha venti camere."),
    V('prenotare', 'to book, to reserve · ho prenotato = I booked', 'Ho prenotato una camera per due notti.'),
    V('prenotazione', 'booking, reservation · a nome Rossi = in the name of Rossi', 'Buonasera, ho una prenotazione a nome Rossi.'),
    V('singolo', 'single · una camera singola = a single room', 'Paul prende una camera singola.'),
    V('doppio', 'double · una camera doppia = a double room', 'Avete una camera doppia per sabato?'),
    V('incluso', 'included', 'La colazione è inclusa?'),
    V('completo', 'full · al completo = fully booked', 'Mi dispiace, sabato siamo al completo.'),
    V('reception', 'reception (desk) · alla reception = at reception', 'La chiave è alla reception.'),
    V('ascensore', 'lift, elevator', "Scusi, c'è l'ascensore?"),
]
L.meaning('prenotazione', 'Buonasera, ho una prenotazione a nome Rossi.', ['booking', 'reservation', 'a booking', 'a reservation'],
          'You made it before you came.', ['prenotazione'])
L.add('vocab', 'type_answer', "What does 'piano' mean here?", 'La camera è al terzo piano.', ['floor', 'the third floor', 'storey'], (),
      ["You know piano as 'slowly, quietly'. In a building, it's a floor."], ['piano'])
L.meaning('al completo', 'Mi dispiace, sabato siamo al completo.', ['full', 'fully booked', 'booked up'], 'There are no free rooms.', ['completo'])
L.mc('You want a room for one person. What do you ask for?', 'una camera singola', ['una camera doppia', 'una camera completa'],
     'Singolo: for one.', ['singolo'])
L.cloze('Complete: a double room, for two people.', 'Una camera ___, per due persone.', 'doppia', 'Doppio, agreeing with camera.', ['doppio'])
L.cloze('Complete: Is breakfast included?', 'La colazione è ___?', 'inclusa', 'Incluso, agreeing with colazione.', ['incluso'])
L.mc('Your room is on the fifth floor. What do you ask at reception?', "C'è l'ascensore?", ["C'è la colazione?", "C'è la prenotazione?"],
     'Five floors are a lot of stairs.', ['ascensore'])
L.cloze('Complete: The key is at reception.', 'La chiave è alla ___.', 'reception', 'The desk at the entrance.', ['reception'])
L.line('You phone a hotel. You want a double room for Friday and Saturday.',
       [{"speaker": "Receptionist", "text": "Albergo Stella, buongiorno. Mi dica."}, {"speaker": "You"}],
       ['Buongiorno, vorrei prenotare una camera doppia per venerdì e sabato.', 'Buongiorno, avete una camera doppia per venerdì e sabato?'],
       'Vorrei prenotare + the room + per + the days.', ['prenotare', 'doppio'])
L.line('The hotel is full on Saturday. Friday is fine for you.',
       [{"speaker": "Receptionist", "text": "Mi dispiace, sabato siamo al completo. Venerdì va bene?"}, {"speaker": "You"}],
       ['Sì, venerdì va bene.', 'Va bene, allora venerdì.'], 'Va bene.', ['completo'])
L.line('You arrive at your hotel. You booked a room in the name of Brown.',
       [{"speaker": "Receptionist", "text": "Buonasera, mi dica."}, {"speaker": "You"}],
       ['Buonasera, ho una prenotazione a nome Brown.', 'Buonasera, ho prenotato una camera a nome Brown.'],
       'Ho una prenotazione a nome …', ['prenotazione'])
L.arrange("Arrange: 'Is breakfast included in the price?'", 'La colazione è inclusa nel prezzo?', ['incluso', 'della'],
          'Incluso agrees with colazione.', ['incluso'])
L.say('Say you would like to book a single room for two nights.', ['vorrei prenotare una camera singola per due notti'],
      'Vorrei prenotare …', ['prenotare', 'singolo'])
L.say('Ask what floor the room is on.', ['a che piano è la camera?'], 'A che … ?', ['piano'])
L.say('Say: The hotel is near the station.', ["l'hotel è vicino alla stazione", "l'albergo è vicino alla stazione"],
      'Hotel or albergo, both with l\'.', ['hotel', 'albergo'])
L.say('Say: The hotel has no lift.', ["l'albergo è senza ascensore", "l'albergo non ha l'ascensore"], 'Senza …', ['ascensore'])
L.say('Say: The hotel is fully booked.', ["l'albergo è al completo", "l'hotel è al completo"], 'Al completo.', ['albergo', 'completo'])

# ── 2. Countries and Abroad ──
L = lesson(2, 'Countries and Abroad', 'words')
L.vocab = [
    V('Inghilterra', 'England', 'Londra è in Inghilterra.'),
    V('Francia', 'France', 'Chloé è francese: è nata in Francia.'),
    V('Spagna', 'Spain', 'Tomás è spagnolo, ma adesso abita in Italia, non in Spagna.'),
    V('Germania', 'Germany', 'Berlino è in Germania.'),
    V('Giappone', 'Japan', 'Osaka è in Giappone.'),
    V('Stati Uniti', 'the United States · negli Stati Uniti = in or to the United States', 'Il mio amico abita negli Stati Uniti.'),
    V('Europa', 'Europe', "L'Italia è in Europa."),
    V('estero', "abroad · all'estero = abroad (in or to another country)", "Quest'anno andiamo in vacanza all'estero."),
    V('straniero', 'foreign; a foreigner', 'A Firenze ci sono molti studenti stranieri.'),
    V('nazione', 'nation, country', 'Nella classe di Giulia ci sono studenti di tre nazioni.'),
    V('internazionale', 'international · internazionali (plural)', 'Pisa ha un aeroporto internazionale.'),
    V('ambasciata', 'embassy', "L'ambasciata di Spagna è a Roma."),
    V('consolato', 'consulate', "C'è un consolato americano a Firenze."),
]
match(L, ['Inghilterra|England', 'Germania|Germany', 'Giappone|Japan', 'Stati Uniti|the United States', 'Spagna|Spain'],
      ['Inghilterra', 'Germania', 'Giappone', 'Stati Uniti', 'Spagna'])
L.meaning("all'estero", "Luca ha un cugino che lavora all'estero, a Londra.", ['abroad'], 'Not in your own country.', ['estero'])
L.cloze('Complete: This year we are going on holiday abroad.', "Quest'anno andiamo in vacanza all'___.", 'estero', 'Abroad: all\'…', ['estero'])
L.meaning('straniero', 'Lo studente straniero parla bene italiano.', ['foreign', 'foreigner', 'the foreign student'], 'He comes from another country.', ['straniero'])
L.mc('Which is correct?', 'Vado in Germania.', ['Vado a Germania.', 'Vado alla Germania.'], 'Countries take in.', ['Germania'])
L.cloze('Complete: Paris is in France.', 'Parigi è in ___.', 'Francia', 'France.', ['Francia'])
L.cloze('Complete: Osaka is in Japan.', 'Osaka è in ___.', 'Giappone', 'Japan.', ['Giappone'])
L.cloze('Complete: In the class there are students from three nations.', 'In classe ci sono studenti di tre ___.', 'nazioni', 'Nazione, plural.', ['nazione'])
L.mc('How do you say "an international airport"?', 'un aeroporto internazionale', ['un internazionale aeroporto', 'un aeroporto internazionali'],
     'One noun: the singular adjective, after it.', ['internazionale'])
L.cloze('Complete: I lost my passport: I have to go to the embassy.', "Ho perso il passaporto: devo andare all'___.", 'ambasciata', 'Embassy.', ['ambasciata'])
L.cloze('Complete: There is an American consulate in Florence.', "C'è un ___ americano a Firenze.", 'consolato', 'Consulate.', ['consolato'])
L.line('A friend asks if you are going abroad on holiday this year. You are going to Spain.',
       [{"speaker": "Friend", "text": "Quest'anno vai in vacanza all'estero?"}, {"speaker": "You"}],
       ['Sì, vado in Spagna.', 'Sì, in Spagna!'], 'In + the country.', ['Spagna', 'estero'])
L.line("Someone at a party asks if you're from here. You're a foreigner: you're American.",
       [{"speaker": "Guest", "text": "Sei di qui?"}, {"speaker": "You"}],
       ['No, sono straniero: sono americano.', 'No, sono straniera: sono americana.'], 'Straniero, or your nationality.', ['straniero'])
L.arrange("Arrange: 'Many foreign tourists come to Florence.'", 'Molti turisti stranieri vengono a Firenze.', ['straniere', 'in'],
          'Straniero agrees with turisti.', ['straniero'])
L.say('Say: Berlin is in Germany.', ['berlino è in germania'], 'In + the country.', ['Germania'])
L.say('Say: England is in Europe.', ["l'inghilterra è in europa"], "The country takes the article as a subject: l'Inghilterra.", ['Inghilterra', 'Europa'])
L.say("Say you've never been abroad.", ["non sono mai stato all'estero", "non sono mai stata all'estero"],
      'Non sono mai stato / stata …', ['estero'])

# ── 3. Before You Go ──
L = lesson(3, 'Before You Go', 'words')
L.vocab = [
    V('valigia', 'suitcase · valigie (plural) · fare la valigia = to pack', 'Ho una valigia piccola e uno zaino.'),
    V('pesante', 'heavy', 'Questa valigia è molto pesante!'),
    V('agenzia', 'agency · agenzia di viaggi = travel agency', "Ho prenotato il viaggio in un'agenzia di viaggi."),
    V('informazione', 'information, a piece of information · informazioni (plural)', "Scusi, vorrei un'informazione."),
    V('check-in', 'check-in (at a hotel or an airport) · fare il check-in', 'Il check-in è dalle due del pomeriggio.'),
    {**V("carta d'identità", 'identity card, ID card', "Ecco la mia carta d'identità."), "phrase": True},
]
L.meaning('valigia', 'Ho una valigia piccola e uno zaino.', ['suitcase', 'a suitcase', 'a small suitcase'], 'You pack it for a trip.', ['valigia'])
L.meaning('agenzia di viaggi', "Ho prenotato il viaggio in un'agenzia di viaggi.", ['travel agency', 'a travel agency', "travel agent's"],
          'A shop where you book trips.', ['agenzia'])
L.cloze("Complete: Excuse me, I'd like some information.", "Scusi, vorrei un'___.", 'informazione', 'One piece of information.', ['informazione'])
L.cloze('Complete: This suitcase is very heavy!', 'Questa valigia è molto ___!', 'pesante', 'Heavy.', ['pesante'])
L.mc('At check-in, the receptionist asks for a document. What do you say?', "Ecco la mia carta d'identità.",
     ['Ecco la mia valigia.', 'Ecco il mio biglietto.'], 'A document with your photo and name.', ["carta d'identità"])
L.cloze('Complete: Check-in is from two in the afternoon.', 'Il ___ è dalle due del pomeriggio.', 'check-in', 'The English word.', ['check-in'])
L.line('A friend is leaving tomorrow and asks if you have packed yet. You have.',
       [{"speaker": "Friend", "text": "Hai già fatto la valigia?"}, {"speaker": "You"}],
       ['Sì, ho già fatto la valigia.', 'Sì, è pronta!'], 'Fare la valigia: to pack.', ['valigia'])
L.line("At the information office at the station. You want to know where the bus for the centre leaves from.",
       [{"speaker": "Clerk", "text": "Buongiorno, mi dica."}, {"speaker": "You"}],
       ["Buongiorno, vorrei un'informazione: dov'è la fermata dell'autobus per il centro?", "Scusi, dov'è l'autobus per il centro?"],
       "Vorrei un'informazione, then the question.", ['informazione'])
L.line('At a travel agency. You want a flight and a hotel in Rome for three nights.',
       [{"speaker": "Agent", "text": "Buongiorno, prego. Dove vuole andare?"}, {"speaker": "You"}],
       ['Vorrei andare a Roma: un volo e un albergo per tre notti.', 'A Roma. Vorrei un volo e un albergo per tre notti.'],
       'Vorrei + what you want.', ['agenzia'])
L.arrange("Arrange: 'We checked in at the airport.'", "Abbiamo fatto il check-in all'aeroporto.", ['siamo', 'fatti'],
          'Fare takes avere.', ['check-in'])
L.say('Say: My suitcase is heavy.', ['la mia valigia è pesante'], 'La mia valigia …', ['valigia', 'pesante'])
L.say('Say you booked the hotel at a travel agency.', ["ho prenotato l'albergo in un'agenzia di viaggi", "ho prenotato l'albergo in agenzia"],
      "In un'agenzia di viaggi.", ['agenzia', 'prenotare'])

# ── 4. At Reception (practice) ──
L = lesson(4, 'At Reception', 'practice')
L.line('You phone a hotel to book a double room for two nights, from Friday.',
       [{"speaker": "Receptionist", "text": "Hotel Roma, buonasera."}, {"speaker": "You"}],
       ['Buonasera, vorrei prenotare una camera doppia per due notti, da venerdì.', 'Buonasera, avete una camera doppia per venerdì e sabato?'],
       'Vorrei prenotare …', ['prenotare', 'doppio'])
L.line('The receptionist tells you the price. Ask if breakfast is included.',
       [{"speaker": "Receptionist", "text": "La camera doppia costa 120 euro a notte."}, {"speaker": "You"}],
       ['La colazione è inclusa?', 'Va bene. La colazione è inclusa nel prezzo?'], 'Incluso agrees with colazione.', ['incluso'])
L.line('The receptionist asks your name for the booking. Your name is Brown.',
       [{"speaker": "Receptionist", "text": "Perfetto. A che nome?"}, {"speaker": "You"}],
       ['A nome Brown.', 'Brown. Mi chiamo Sam Brown.'], 'A nome …', ['prenotazione'])
L.line("You arrive at the hotel. The receptionist asks for a document.",
       [{"speaker": "Receptionist", "text": "Ha un documento, per favore?"}, {"speaker": "You"}],
       ['Sì, ecco il passaporto.', "Sì, ecco la mia carta d'identità."], 'Ecco …', ["carta d'identità"])
L.line('Your room is on the fourth floor. Ask if there is a lift.',
       [{"speaker": "Receptionist", "text": "La Sua camera è la 408, al quarto piano."}, {"speaker": "You"}],
       ["C'è l'ascensore?", "Grazie. Scusi, c'è l'ascensore?"], "C'è …?", ['ascensore', 'piano'])
L.line('The receptionist gives you the key. Ask what time breakfast is.',
       [{"speaker": "Receptionist", "text": "Ecco la chiave. L'ascensore è lì."}, {"speaker": "You"}],
       ['Grazie. A che ora è la colazione?', 'Grazie mille. La colazione a che ora è?'], 'A che ora …?', [])
L.line("You phone a hotel, but it's full tonight. Ask if they know another hotel nearby.",
       [{"speaker": "Receptionist", "text": "Mi dispiace, stasera siamo al completo."}, {"speaker": "You"}],
       ['Conosce un altro albergo qui vicino?', "Allora, c'è un altro albergo qui vicino?"], 'Conosce (Lei) …? or C\'è …?', ['albergo', 'completo'])
L.line("You've lost your passport. Tell the receptionist, and ask where your country's consulate is.",
       [{"speaker": "Receptionist", "text": "Buongiorno, mi dica."}, {"speaker": "You"}],
       ["Ho perso il passaporto. Dov'è il consolato?", "Scusi, ho perso il passaporto. Sa dov'è il consolato?"],
       'Perdere → ho perso.', ['consolato'])
L.line('At a travel agency. You want to go abroad in May, to Japan.',
       [{"speaker": "Agent", "text": "Allora, dove vuole andare?"}, {"speaker": "You"}],
       ['Vorrei andare in Giappone, a maggio.', "A maggio vorrei andare all'estero, in Giappone."], 'In + the country.', ['Giappone'])
L.mc('The receptionist tells you about check-in. What does she mean?', 'You can check in from two o\'clock', ['You have to check in before two', 'Check-in is only at two'],
     'Può + infinitive: you can.', ['check-in'], ctx='Può fare il check-in dalle due.')
L.say('Ask the receptionist if they have a single room for tonight.', ['avete una camera singola per stasera?'], 'Avete …?', ['singolo'])
L.arrange("Arrange: 'I have a reservation in the name of Brown.'", 'Ho una prenotazione a nome Brown.', ['sono', 'di'],
          'A nome …', ['prenotazione'])

# ── 5. Back Home ──
L = lesson(5, 'Back Home', 'words')
L.vocab = [
    V('ritornare', 'to come back, to go back (like tornare) · sono ritornato, sono ritornata', 'Siamo ritornati a Firenze domenica sera.'),
    V('cartolina', 'postcard', 'Ho scritto una cartolina a Giulia.'),
    V('mandare', 'to send · ho mandato', 'Mando un messaggio a Luca.'),
    V('raccontare', 'to tell (what happened, a story) · racconta! = tell me! · ho raccontato', "Allora, racconta! Com'è andato il viaggio?"),
    V('morire', 'to die · è morto, è morta = he died, she died · muoio di fame = I\'m starving', 'Michelangelo è morto a Roma nel 1564.'),
]
L.meaning('ritornare', 'Siamo ritornati a Firenze domenica sera.', ['to come back', 'to go back', 'to return', 'come back', 'return'],
          'Like tornare.', ['ritornare'])
L.meaning('il fine settimana', 'Che cosa hai fatto il fine settimana?', ['the weekend', 'at the weekend', 'weekend'], 'Saturday and Sunday.', ['fine settimana'])
L.cloze('Complete: I sent a postcard to my grandmother.', 'Ho mandato una ___ a mia nonna.', 'cartolina', 'Postcard.', ['cartolina'])
L.cloze('Complete: I sent a message to Luca.', 'Ho ___ un messaggio a Luca.', 'mandato', 'Mandare, with avere.', ['mandare'])
L.mc('A friend is back from a trip. How do you ask how it went?', "Com'è andato il viaggio?", ["Com'è andata il viaggio?", "Com'è stato andato il viaggio?"],
     'Andare takes essere; the participle agrees with viaggio.', [])
L.meaning('muoio di fame', 'Muoio di fame! Andiamo a mangiare?', ["i'm starving", "i'm very hungry", "i'm dying of hunger"], 'A way of saying you are very hungry.', ['morire'])
L.cloze('Complete: Michelangelo died in Rome in 1564.', 'Michelangelo è ___ a Roma nel 1564.', 'morto', 'Morire takes essere, and the participle is irregular.', ['morire'])
L.mc('Which is correct?', 'Siamo ritornati domenica.', ['Abbiamo ritornato domenica.', 'Siamo ritornato domenica.'],
     'Like tornare: essere, and the participle agrees.', ['ritornare'])
L.line('Your friend wants to hear about your trip to Rome. You saw the Colosseum and ate a lot of pizza.',
       [{"speaker": "Friend", "text": "Allora, racconta! Che cosa hai fatto a Roma?"}, {"speaker": "You"}],
       ['Ho visto il Colosseo e ho mangiato tanta pizza!', 'Ho visto il Colosseo, e abbiamo mangiato molta pizza.'],
       'Vedere → visto; mangiare → mangiato.', ['raccontare'])
L.arrange("Arrange: 'We came back to Florence on Sunday evening.'", 'Siamo ritornati a Firenze domenica sera.', ['abbiamo', 'ritornato'],
          'Essere, and agreement.', ['ritornare'])
L.say('Say you sent three postcards.', ['ho mandato tre cartoline'], 'Ho mandato …', ['mandare', 'cartolina'])
L.say("Say you're starving.", ['muoio di fame'], 'Muoio di …', ['morire'])
L.say('Say you are sending a postcard to Giulia.', ['mando una cartolina a giulia'], 'Mandare, in the present.', ['mandare', 'cartolina'])
L.say('How do you say "to die" in Italian?', ['morire'], 'Its participle is morto.', ['morire'])
L.say('Ask a friend what they did at the weekend.', ['che cosa hai fatto il fine settimana?', 'cosa hai fatto il fine settimana?'],
      'Fare → fatto.', ['fine settimana'])

# ── 6. How Was Your Trip? (practice) ──
L = lesson(6, 'How Was Your Trip?', 'practice')
L.line('Luca asks what you did at the weekend. You went to Venice with a friend.',
       [{"speaker": "Luca", "text": "Che cosa hai fatto il fine settimana?"}, {"speaker": "You"}],
       ['Sono andato a Venezia con un amico.', "Sono andata a Venezia con un'amica."], 'Andare takes essere.', ['fine settimana'])
L.line('Your friend asks how the trip went. It went well, but the train arrived late.',
       [{"speaker": "Friend", "text": "Com'è andato il viaggio?"}, {"speaker": "You"}],
       ['Bene, ma il treno è arrivato in ritardo.', "Molto bene! Ma il treno è arrivato con un'ora di ritardo."], 'Arrivare takes essere.', [])
L.line('Your friend asks if you liked Venice. You liked it a lot, and you saw piazza San Marco.',
       [{"speaker": "Friend", "text": "Ti è piaciuta Venezia?"}, {"speaker": "You"}],
       ['Sì, mi è piaciuta molto! Ho visto piazza San Marco.', 'Sì, tanto. Abbiamo visto piazza San Marco.'], 'Mi è piaciuta: it agrees with Venezia.', [])
L.line('Your friend asks where you slept. In a small hotel near the station.',
       [{"speaker": "Friend", "text": "E dove avete dormito?"}, {"speaker": "You"}],
       ['Abbiamo dormito in un piccolo albergo vicino alla stazione.', 'In un piccolo hotel vicino alla stazione.'], 'Dormire takes avere.', ['albergo'])
L.line('Your friend asks when you came back. On Sunday evening.',
       [{"speaker": "Friend", "text": "Quando siete ritornati?"}, {"speaker": "You"}],
       ['Siamo ritornati domenica sera.', 'Domenica sera.'], 'Ritornare takes essere.', ['ritornare'])
L.line('Your friend asks if you took a lot of photos. You did, and you sent some postcards too.',
       [{"speaker": "Friend", "text": "Hai fatto tante foto?"}, {"speaker": "You"}],
       ['Sì, e ho mandato anche tre cartoline.', 'Sì, tante! E ho scritto due cartoline.'], 'Mandare → mandato.', ['cartolina', 'mandare'])
L.line('A colleague asks about your trip to London. It went badly: you lost your suitcase at the airport.',
       [{"speaker": "Colleague", "text": "Allora, com'è andato il viaggio a Londra?"}, {"speaker": "You"}],
       ["Male: ho perso la valigia all'aeroporto!", "Non bene. All'aeroporto ho perso la valigia."], 'Perdere → perso.', ['valigia'])
L.line('Your friend asks if you had fun at the seaside.',
       [{"speaker": "Friend", "text": "Vi siete divertiti al mare?"}, {"speaker": "You"}],
       ['Sì, ci siamo divertiti molto!', 'Sì, tanto! Abbiamo mangiato il pesce e dormito al sole.'], 'Ci siamo divertiti.', [])
L.fix('Fix the mistake.', 'Ho andato a Roma con mia sorella.', ['Sono andato a Roma con mia sorella.', 'Sono andata a Roma con mia sorella.'],
      'Andare takes essere.', [])
L.fix('Fix the mistake.', 'Emma è arrivato venerdì sera.', ['Emma è arrivata venerdì sera.'], 'With essere, the participle agrees with Emma.', [])
fill(L, 'Fill in the right form of essere or avere.', 'Domenica sera Emma e Chloé ___ ritornate a Firenze.', 'sono',
     'Ritornare: going and coming back.', ['ritornare'])
fill(L, 'Fill in the right form of essere or avere.', 'Paul ___ prenotato un albergo a Roma.', 'ha', 'Prenotare has an object.', ['prenotare'])
L.say('Say you went abroad last year.', ["l'anno scorso sono andato all'estero", "l'anno scorso sono andata all'estero"],
      "L'anno scorso …", ['estero'])
L.arrange("Arrange: 'I sent a postcard to my grandmother.'", 'Ho mandato una cartolina a mia nonna.', ['sono', 'mandata'],
          'Mandare takes avere.', ['mandare', 'cartolina'])

# ── 7. Two Nights in Venice (reading: a hotel page and two emails) ──
L = lesson(7, 'Two Nights in Venice', 'reading')
L.reading = {"title": "Albergo Stella, Venezia", "paragraphs": [
    "Albergo Stella · un piccolo albergo in centro, a dieci minuti a piedi da piazza San Marco",
    "Camera singola · 90 euro a notte",
    "Camera doppia · 130 euro a notte",
    "Colazione · inclusa nel prezzo, dalle 7:30 alle 10:00",
    "Check-in · dalle 14:00 alle 22:00",
    "Reception · aperta tutto il giorno: parliamo italiano, inglese e francese",
    "Emma e Chloé vogliono passare un fine settimana a Venezia. Emma scrive all'albergo.",
    "Buongiorno, vorrei prenotare una camera doppia per due notti, venerdì 15 e sabato 16 maggio, per me e un'amica. Arriviamo in treno venerdì sera, verso le otto. La camera ha il bagno? E c'è l'ascensore? Abbiamo due valigie pesanti! Grazie mille, Emma Wilson",
    "La risposta arriva dopo un'ora.",
    "Gentile Emma, per venerdì 15 e sabato 16 maggio abbiamo ancora una camera doppia con bagno, al terzo piano. Costa 130 euro a notte, con la colazione. Mi dispiace, ma l'albergo non ha l'ascensore: è una casa vecchia, come tante case di Venezia. Ma il ragazzo della reception può portare le valigie in camera. Per il check-in avete bisogno di un documento: il passaporto o la carta d'identità. Dalla stazione potete venire a piedi, in venti minuti. A presto! Marta, Albergo Stella",
    "Emma legge la mail a Chloé.",
    "Emma: 130 euro a notte! È un po' caro.",
    "Chloé: È Venezia! E la colazione è inclusa. Ma sabato lavoro al bar…",
    "Emma: Puoi cambiare con una collega?",
    "Chloé: Sì, telefono subito a Giada.",
    "La sera Emma risponde all'albergo e prenota la camera.",
]}
L.vocab = []
L.mc('How much is a double room?', '130 euros a night', ['90 euros a night', '130 euros for the weekend'], "'Camera doppia · 130 euro a notte.'", ['doppio'])
L.mc('What does Emma ask the hotel?', 'If the room has a bathroom, and if there is a lift', ['If breakfast is included', 'If they speak English'],
     "Read Emma's email.", ['ascensore'])
L.mc('On which floor is the room?', 'The third', ['The ground floor', 'The fifth'], "'Al terzo piano.'", ['piano'])
L.mc('True or false: the hotel has a lift.', 'False', ['True'], "'L'albergo non ha l'ascensore.'", ['ascensore'])
L.mc('Who will carry the suitcases?', 'The young man at reception', ['Emma and Chloé', 'Marta'], "'Il ragazzo della reception può portare le valigie.'", ['reception', 'valigia'])
L.mc('What do they need for check-in?', 'A passport or an identity card', ['The booking email', 'Their train tickets'], "Read Marta's answer.", ["carta d'identità", 'check-in'])
L.mc("What is Chloé's problem?", 'She works at the bar on Saturday', ['She thinks the hotel is too expensive', "She doesn't like Venice"],
     "'Sabato lavoro al bar.'", [])
L.cloze('Complete from the text: the room is on the third floor.', 'La camera è al terzo ___.', 'piano', 'Floor.', ['piano'])
L.answer('La colazione è inclusa?', ['sì, è inclusa', 'sì, la colazione è inclusa'], "Read the hotel's page.", ['incluso'])
L.answer('Come arrivano Emma e Chloé a Venezia?', ['in treno', 'arrivano in treno'], "Read Emma's email.", [])

# ── 8. Greetings from Venice (reading: a postcard and a message, in the past) ──
L = lesson(8, 'Greetings from Venice', 'reading')
L.reading = {"title": "Saluti da Venezia", "paragraphs": [
    "Venezia, sabato 16 maggio",
    "Cara Giulia,",
    "un saluto da Venezia! Siamo arrivate ieri sera, con un'ora di ritardo. L'albergo è piccolo e vecchio, e la nostra camera è al terzo piano, senza ascensore. Ma è bella e pulita, e la colazione è molto buona.",
    "Stamattina siamo andate in piazza San Marco. Ci sono turisti di tutte le nazioni: inglesi, tedeschi, giapponesi, americani… Venezia è davvero una città internazionale. Al bar un cameriere ha detto: «Ah, turiste! Di dove siete?» Per lui siamo due turiste straniere come tutte le altre!",
    "Il pomeriggio abbiamo camminato tanto per le strade piccole, e la sera abbiamo mangiato il pesce in un ristorante vicino all'albergo. Domani ritorniamo a Firenze.",
    "A lunedì! Emma (e Chloé)",
    "Lunedì Chloé scrive un messaggio ad Aiko.",
    "Ciao Aiko! Siamo ritornate ieri sera. Che fine settimana! Venezia mi è piaciuta molto. Ho fatto più di 200 foto e ho mandato cinque cartoline: una è per te!",
    "Ma il ritorno… Il treno è arrivato a Firenze con due ore di ritardo. Emma ha dormito tutto il viaggio. Io no: io ho mangiato i nostri panini, tutti e quattro. E a Venezia ho perso il mio ombrello rosso. Adesso sono stanca morta!",
    "A domani in classe, Chloé",
]}
L.vocab = [
    {**V('stanco morto', 'dead tired, exhausted · stanca morta (a woman)', 'Dopo il viaggio sono stanco morto.'), "phrase": True},
]
L.mc('When did Emma and Chloé arrive in Venice?', 'On Friday evening, an hour late', ['On Saturday morning', 'On Friday evening, on time'],
     "The postcard is from Saturday: 'Siamo arrivate ieri sera.'", [])
L.mc('What is their room like?', 'Nice and clean, on the third floor, with no lift', ['Big and new, with a lift', 'Small and dirty'],
     'Read the first paragraph of the postcard.', ['piano'])
L.mc('Why does Emma call Venice an international city?', 'There are tourists from every country', ['It has an international airport', 'Everyone speaks English'],
     "'Turisti di tutte le nazioni.'", ['internazionale', 'nazione'])
L.mc('What did they do in the afternoon?', 'They walked a lot', ['They slept at the hotel', 'They went to a museum'], "'Abbiamo camminato tanto.'", [])
L.mc('Who is one of the postcards for?', 'Aiko', ['Giulia', 'Emma'], "'Una è per te!'", ['cartolina'])
L.mc('What went wrong on the way back?', 'The train was two hours late', ['They missed the train', 'They lost the suitcases'], "'Con due ore di ritardo.'", [])
L.mc("Why is Chloé 'stanca morta'?", "She's very tired after the trip", ["She's ill", "She's hungry"], 'Stanca morta: dead tired.', ['stanco morto'])
L.cloze('Complete from the text: there are tourists from every nation.', 'Ci sono turisti di tutte le ___.', 'nazioni', 'Nations.', ['nazione'])
L.answer('Che cosa ha perso Chloé a Venezia?', ['il suo ombrello rosso', "l'ombrello rosso", 'ha perso il suo ombrello'], 'Read the end of the message.', [])
L.answer('Quando sono ritornate a Firenze?', ['domenica sera', 'sono ritornate domenica sera'], "Chloé writes on Monday: 'ieri sera'.", ['ritornare'])

# ── 9. A Weekend in Rome (reading: a story in the past) ──
L = lesson(9, 'A Weekend in Rome', 'reading')
L.reading = {"title": "Un fine settimana a Roma", "paragraphs": [
    "A ottobre i genitori di Paul, Peter e Mary, sono venuti in Italia dall'Inghilterra. Non sono mai stati a Roma, allora Paul ha prenotato un albergo per il fine settimana: una camera doppia per i genitori e una singola per lui, con la colazione inclusa. Ha fatto tutto su internet, in cinque minuti, di corsa, come sempre.",
    "Venerdì mattina hanno preso il treno a Firenze, e alle undici sono arrivati a Roma. L'albergo è vicino alla stazione. Alla reception c'è una signora molto gentile.",
    "Signora: Buongiorno, mi dica.",
    "Paul: Buongiorno, ho una prenotazione a nome Smith, per tre persone.",
    "Signora: Un momento… Sì, ecco la prenotazione. Ma è per il diciassette novembre, non per oggi!",
    "Paul: Novembre? Oh no!",
    "Signora: Mi dispiace. Oggi siamo quasi al completo: abbiamo solo una camera doppia, al quinto piano. E l'albergo non ha l'ascensore.",
    "Peter e Mary hanno preso la camera doppia. Paul ha fatto tre telefonate e alla fine ha preso una camera singola in un altro hotel, a dieci minuti a piedi.",
    "Cinque piani a piedi, con due valigie pesanti! Al quinto piano Peter ha detto: «Muoio di fame. Andiamo a mangiare?» Hanno mangiato una pizza in un piccolo ristorante, e la pizza è piaciuta molto a tutti.",
    "Sabato sono andati ai Musei Vaticani e hanno visto la Cappella Sistina. Mary conosce bene la vita di Michelangelo e ha raccontato tutto a Peter: Michelangelo è nato in Toscana nel 1475, ha lavorato molti anni a Roma ed è morto lì nel 1564, a quasi novant'anni. Peter ha fatto cento foto, e Mary ha comprato venti cartoline per gli amici in Inghilterra.",
    "Domenica sera sono ritornati a Firenze. Sul treno Paul ha detto: «Mi dispiace per l'albergo, mamma.»",
    "Mary: Ma no! È stato un fine settimana molto bello. I cinque piani, la pizza, Michelangelo…",
    "Peter: Sì, molto bello. Ma la prossima volta prenoto io!",
]}
L.vocab = [
    V('vita', 'life · vite (plural)', 'Mia nonna ha avuto una vita lunga e felice.'),
    V('telefonata', 'phone call · fare una telefonata = to make a phone call', 'Scusa, devo fare una telefonata.'),
]
L.mc('Who booked the hotel, and how?', 'Paul, on the internet, in a hurry', ['Mary, at a travel agency', 'Paul, by phone'],
     "Read the first paragraph.", ['prenotare'])
L.mc('What was wrong with the booking?', 'It was for November, not for that weekend', ['It was for a different hotel', 'It was only for one night'],
     "'È per il diciassette novembre.'", ['prenotazione'])
L.mc('Which room was still free?', 'A double room on the fifth floor', ['A single room on the first floor', 'Three single rooms'],
     "'Una camera doppia, al quinto piano.'", ['doppio', 'piano'])
L.mc('Where did Paul sleep?', 'In a single room in another hotel', ['In his parents\' room', 'At the station'], "Read the paragraph after the dialogue.", ['hotel', 'telefonata'])
L.mc("What does Peter mean by 'Muoio di fame'?", "He's very hungry", ["He's very tired", "He's ill"], 'After five floors, he wants to eat.', ['morire'])
L.mc('True or false: Michelangelo died in Tuscany.', 'False', ['True'], "'È morto lì', in Rome.", ['morire', 'vita'])
L.mc('What did Mary buy?', 'Twenty postcards', ['A hundred photos', 'A book about Michelangelo'], "'Venti cartoline.'", ['cartolina'])
L.cloze("Complete from the text: Mary knows Michelangelo's life well.", 'Mary conosce bene la ___ di Michelangelo.', 'vita', 'Life.', ['vita'])
L.cloze('Complete from the text: Paul made three phone calls.', 'Paul ha fatto tre ___.', 'telefonate', 'Telefonata, plural.', ['telefonata'])
L.answer('Dove è nato Michelangelo?', ['in Toscana', 'è nato in Toscana'], 'Read the paragraph about Saturday.', [])
L.answer('Quando sono ritornati a Firenze?', ['domenica sera', 'sono ritornati domenica sera'], 'Read the end of the story.', ['ritornare'])
L.answer('Chi prenota la prossima volta?', ['Peter', 'prenota Peter'], 'Read the last line.', ['prenotare'])

# ── 10–11. Writing ──
L = lesson(10, 'Book a Room', 'writing')
L.reading = {"title": "Hotel Il Campo, Siena", "paragraphs": [
    "Hotel Il Campo · in centro, a cinque minuti a piedi da piazza del Campo",
    "Camera singola · 70 euro a notte",
    "Camera doppia · 100 euro a notte",
    "Colazione · 8 euro a persona",
    "Parcheggio · 15 euro al giorno",
    "Check-in · dalle 15:00 alle 21:00",
    "Prenotazioni · per telefono o per mail",
]}
L.write('Write an email to the Hotel Il Campo to book a room: say who you are, what room you want and for which nights, and ask one or two questions.',
        "Buongiorno, mi chiamo Sam Taylor. Vorrei prenotare una camera doppia per due notti, venerdì 12 e sabato 13 giugno, per me e mia moglie. Arriviamo in macchina verso le dieci di sera: va bene per il check-in? C'è l'ascensore? Grazie mille, Sam Taylor",
        'Vorrei prenotare …; per + the nights; questions with c\'è …? or è incluso …?', ['prenotare', 'doppio', 'check-in'])
L = lesson(11, 'After the Weekend', 'writing')
L.reading = {"title": "Un messaggio di Giulia", "paragraphs": [
    "Ciao! Allora, com'è andato il fine settimana? Dove sei andato, con chi, e che cosa avete fatto? Tutto bene? Racconta! Giulia",
]}
L.write("Giulia asks about your weekend away. Reply: say where you went and how, where you stayed, what you did, and one thing that went wrong.",
        "Ciao Giulia! Il fine settimana sono andata a Bologna con mia sorella. Siamo partite sabato mattina in treno e abbiamo dormito in un piccolo albergo in centro. Abbiamo visto le piazze e le chiese, e abbiamo mangiato i tortellini. Ma domenica ho perso il telefono in un bar! Sono ritornata al bar di corsa, e il cameriere ha detto: «È questo?» Siamo ritornate domenica sera, stanche morte. A domani!",
        'Andare, arrivare, partire, ritornare take essere; mangiare, vedere, fare, dormire take avere.', ['fine settimana', 'ritornare', 'albergo'])

# ── 12. Speaking ──
L = lesson(12, 'Say It Out Loud', 'speaking')
L.read('Vorrei prenotare una camera doppia per due notti.', 'Prenotare: the stress is on -ta-.', ['prenotare', 'doppio'])
L.read('Buonasera, ho una prenotazione a nome Brown.', 'Prenotazione: -zio- sounds like "tsio".', ['prenotazione'])
L.read("La colazione è inclusa? E c'è l'ascensore?", 'Two questions: let your voice rise.', ['incluso', 'ascensore'])
L.read('La camera è al terzo piano.', 'Terzo: the z sounds like "ts".', ['piano'])
L.read("Quest'anno andiamo in vacanza all'estero, in Germania.", 'Estero: the stress is on e-.', ['estero', 'Germania'])
L.read("Ho perso il passaporto: devo andare all'ambasciata.", 'Passaporto: hold the double s.', ['ambasciata'])
L.read('Siamo ritornati domenica sera, stanchi morti.', 'Stanchi: the ch sounds like k.', ['ritornare'])
L.read('Ho mandato tre cartoline e ho fatto tante foto.', 'Fatto: hold the double t.', ['cartolina', 'mandare'])
L.read('Michelangelo è morto a Roma.', 'Morto: the stress is on mor-.', ['morire'])

for L in LESSONS:
    L.dump()
print('\n'.join(L.meta(L.n) for L in LESSONS))
