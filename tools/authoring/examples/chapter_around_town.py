"""Chapter 9 'Around Town' (unit-12), straight after the Prepositions grammar unit.

Available: units 1–8 (essere, avere, numbers, articles, c'è, regular and irregular verbs, modals,
per + infinitive, all prepositions and joined forms, a/in/da with places, transport, partitives),
and chapters 1–8. The places in the Prepositions table (supermercato, biblioteca, cinema, teatro…)
are already taught there, so they aren't on these word lists.
Not yet: adjective agreement, possessives, clock times, reflexives (ci vediamo), the imperative,
question words beyond dove / che cosa. Directions (destra, sinistra) wait for Finding Your Way.
"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from chapterlib import Lesson, V

U = 'unit-12'
D = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'out', U)
os.makedirs(D, exist_ok=True)
LESSONS = []
def lesson(n, name, role):
    L = Lesson(U, D, n, name, role); LESSONS.append(L); return L

# ── 1. Places in Town ──
L = lesson(1, 'Places in Town', 'words')
L.vocab = [
    V('negozio', 'shop · negozi = shops', "C'è un negozio qui vicino?"),
    V('chiesa', 'church', 'La chiesa è in piazza.'),
    V('posta', 'post office (also: the post) · in posta, alla posta', 'Vado in posta.'),
    V('parcheggio', 'car park, parking space', "C'è un parcheggio vicino alla stazione?"),
    V('polizia', 'police', 'Scusi, dov\'è la polizia?'),
]
L.meaning('negozi', 'In centro ci sono negozi e bar.', ['shops'], 'Negozio, in the plural.', ['negozio'])
L.meaning('chiesa', 'La chiesa è in piazza.', ['church', 'the church'], 'A building with a bell tower.', ['chiesa'])
L.meaning('posta', 'Vado in posta.', ['post office', 'the post office'], 'Where you send letters.', ['posta'])
L.mc('You need to send something by post. Where do you go?', 'Vado in posta.', ['Vado in chiesa.', 'Vado al parco.'],
     'Posta: the post office.', ['posta'])
L.cloze('Complete: Is there a car park near the station?', "C'è un ___ vicino alla stazione?", 'parcheggio', 'Where you leave the car.', ['parcheggio'])
L.mc('Someone has taken your bag. What do you ask a passer-by?', "Scusi, dov'è la polizia?", ["Scusi, dov'è la chiesa?", "Scusi, dov'è un negozio?"],
     'You need the police.', ['polizia'])
L.mc("You're going to the bank, then to the doctor's. How do you say it?", 'Vado in banca e poi dal medico.',
     ['Vado a banca e poi dal medico.', 'Vado in banca e poi in medico.'], 'In banca; da + a person.', [])
L.line('A friend sees you in the street with a parcel under your arm.',
       [{"speaker": "Friend", "text": "Ciao! Dove vai?"}, {"speaker": "You"}],
       ['Vado in posta.', 'Ciao! Vado in posta.', 'Vado alla posta.'], 'Say where you are going.', ['posta'])
L.say("Ask if there's a shop near here.", ["c'è un negozio qui vicino"], "C'è + un negozio.", ['negozio'])
L.arrange("Arrange: 'The church is in the square.'", 'La chiesa è in piazza.', ['nella', 'al'], 'In piazza, no article.', ['chiesa'])
L.say("Say you're going to the park.", ['vado al parco'], 'A + il.', [])
L.say('Ask where the post office is.', ["dov'è la posta", 'dove è la posta'], "Dov'è + la posta.", ['posta'])

# ── 2. Where Is It? ──
L = lesson(2, 'Where Is It?', 'words')
L.vocab = [
    V('lontano', 'far, far away · lontano da = far from', 'La stazione è lontano da qui?'),
    V('davanti', 'in front · davanti a = in front of', 'Marco è davanti alla chiesa.'),
    V('dietro', 'behind · dietro la stazione, or dietro alla stazione', 'Il parcheggio è dietro la stazione.'),
    V('accanto', 'next to it · accanto a = next to', 'La farmacia è accanto alla banca.'),
    V('di fronte', 'opposite · di fronte a = opposite', 'Il bar è di fronte alla posta.'),
    V('sopra', 'on, on top of, above', 'Le chiavi sono sopra il tavolo.'),
    V('sotto', 'under, below · sotto casa = downstairs, just outside the building', 'Il gatto è sotto il letto.'),
    V('fuori', 'outside, out', 'Marco aspetta fuori.'),
    V('là', 'there, over there (like lì)', 'Il bar è là, in piazza.'),
]
L.meaning('lontano', 'La stazione è lontano?', ['far', 'far away'], 'The opposite of vicino.', ['lontano'])
L.meaning('accanto a', 'La farmacia è accanto alla banca.', ['next to', 'beside'], 'Right beside it.', ['accanto'])
L.mc("How do you say 'The bar is opposite the post office'?", 'Il bar è di fronte alla posta.',
     ['Il bar è dietro la posta.', 'Il bar è accanto alla posta.'], 'Di fronte a: opposite.', ['di fronte'])
L.cloze('Complete: The cat is under the bed.', 'Il gatto è ___ il letto.', 'sotto', 'Under.', ['sotto'])
L.cloze('Complete: The car park is behind the station.', 'Il parcheggio è ___ la stazione.', 'dietro', 'Behind.', ['dietro'])
L.cloze('Complete: The pharmacy is next to the bank.', 'La farmacia è accanto ___ banca.', 'alla', 'Accanto a + la.', ['accanto'])
L.line("A tourist asks you the way. The post office is in the square, next to the church.",
       [{"speaker": "Tourist", "text": "Scusi, dov'è la posta?"}, {"speaker": "You"}],
       ['È in piazza, accanto alla chiesa.', 'In piazza, accanto alla chiesa.'], 'In piazza, then accanto a.', ['accanto'])
L.mc("A friend asks 'La stazione è lontano?'. It's five minutes away. What do you say?", 'No, è vicino. Cinque minuti.',
     ['No, è lontano. Cinque minuti.', 'Sì, è fuori. Cinque minuti.'], 'Five minutes: close.', ['lontano'], ctx='La stazione è lontano?')
L.arrange("Arrange: 'Marco is waiting outside.'", 'Marco aspetta fuori.', ['sotto', 'è'], 'Aspettare, then fuori.', ['fuori'])
L.say('Say the keys are on the table.', ['le chiavi sono sul tavolo', 'le chiavi sono sopra il tavolo'], 'Sul tavolo or sopra il tavolo.', ['sopra'])
L.say('Ask if the station is far from here.', ['la stazione è lontano da qui', 'è lontano da qui la stazione'], 'Lontano da qui.', ['lontano'])
L.say('Say the bar is over there, in the square.', ['il bar è là, in piazza', 'il bar è lì, in piazza'], 'Là, then in piazza.', ['là'])
L.say("Say there's a bar downstairs, just outside your building.", ["sotto casa c'è un bar", "c'è un bar sotto casa"], 'Sotto casa.', ['sotto'])

# ── 3. Errands ──
L = lesson(3, 'Errands', 'words')
L.vocab = [
    V('francobollo', 'stamp · francobolli = stamps', "Un francobollo per l'Inghilterra, per favore."),
    V('busta', 'envelope; also a shopping bag', 'Ho bisogno di una busta.'),
    V('pacco', 'parcel, package · pacchi = parcels', 'Devo spedire un pacco.'),
    V('indirizzo', 'address', "Ho l'indirizzo di Giulia."),
    V('cambiare', 'to change · cambiare soldi = to change money', 'Devo cambiare soldi in banca.'),
    V('portare', 'to bring, to take, to carry', 'Porto il pacco in posta.'),
    V('incontrare', 'to meet (someone)', 'Oggi incontro Giulia in centro.'),
    V('attenzione', 'attention · Attenzione! = Careful! Watch out!', "Attenzione! C'è una macchina!"),
]
L.meaning('francobollo', 'Un francobollo, per favore.', ['stamp', 'a stamp'], 'You put it on a letter.', ['francobollo'])
L.meaning('pacco', 'Devo spedire un pacco.', ['parcel', 'a parcel', 'package', 'a package'], 'Something you send by post.', ['pacco'])
L.meaning('incontro', 'Oggi incontro Giulia in centro.', ['I meet', "I'm meeting", 'I am meeting'], 'Incontrare, io.', ['incontrare'])
L.mc('At the post office, you want to send a parcel to England.', "Vorrei spedire un pacco in Inghilterra.",
     ['Vorrei portare un francobollo in Inghilterra.', 'Vorrei cambiare un pacco in Inghilterra.'], 'Spedire un pacco.', ['pacco'])
L.cloze('Complete: I need an envelope.', 'Ho bisogno di una ___.', 'busta', 'For a letter.', ['busta'])
L.cloze('Complete: I have to change money at the bank.', 'Devo ___ soldi in banca.', 'cambiare', 'To change.', ['cambiare'])
L.line('A friend asks what you are doing in town today.',
       [{"speaker": "Friend", "text": "Che cosa fai oggi in centro?"}, {"speaker": "You"}],
       ['Vado in posta a spedire un pacco.', 'Devo andare in banca e in posta.', 'Incontro Marco in piazza.'],
       'Where you are going, and why.', ['pacco'])
L.mc("A car is coming and your friend hasn't seen it. You shout:", 'Attenzione!', ['Permesso!', 'Prego!'], 'Watch out!', ['attenzione'])
L.say("Say you're taking the parcel to the post office.", ['porto il pacco in posta', 'porto il pacco alla posta'], 'Portare.', ['portare', 'pacco'])
L.arrange("Arrange: 'I'm meeting Marco in the square.'", 'Incontro Marco in piazza.', ['alla', 'incontra'], 'Incontrare, io.', ['incontrare'])
L.say("Say you have Giulia's address.", ["ho l'indirizzo di Giulia"], "L'indirizzo di Giulia.", ['indirizzo'])
L.meaning('indirizzo', 'Ho un indirizzo a Firenze.', ['address', 'an address'], 'Where someone lives.', ['indirizzo'])
L.say('Ask for two stamps for England.', ["due francobolli per l'Inghilterra, per favore", "due francobolli per l'Inghilterra"], 'Francobolli, plural.', ['francobollo'])

# ── 4. Going Places (practice) ──
L = lesson(4, 'Going Places', 'practice')
L.line("Your older neighbour meets you on the stairs. You're on your way to the doctor's.",
       [{"speaker": "Neighbour", "text": "Buongiorno! Dove va?"}, {"speaker": "You"}],
       ['Buongiorno! Vado dal medico.', 'Vado dal medico.'], 'Da + a person.', [])
L.line("A friend calls. You're at the library.",
       [{"speaker": "Friend", "text": "Ciao! Dove sei?"}, {"speaker": "You"}],
       ['Sono in biblioteca.', 'Ciao! Sono in biblioteca.'], 'In biblioteca.', [])
L.line('A tourist asks for a pharmacy. There is one in the square, next to the bank.',
       [{"speaker": "Tourist", "text": "Scusi, c'è una farmacia qui vicino?"}, {"speaker": "You"}],
       ['Sì, è in piazza, accanto alla banca.', "Sì, c'è una farmacia in piazza, accanto alla banca."], 'Sì, then where.', ['accanto'])
L.line("A friend suggests the cinema tonight, but you're going to Giulia's.",
       [{"speaker": "Friend", "text": "Andiamo al cinema stasera?"}, {"speaker": "You"}],
       ['Mi dispiace, non posso. Vado da Giulia.', 'No, mi dispiace. Stasera vado da Giulia.'], "Say no, and that you're going to Giulia's.", [])
L.line('A new colleague asks where you live. You live in the centre, near the station.',
       [{"speaker": "Colleague", "text": "Dove abiti?"}, {"speaker": "You"}],
       ['Abito in centro, vicino alla stazione.'], 'In centro; vicino a + la.', [])
L.mc('Giulia is at Marco\'s place. How do you say it?', 'Giulia è da Marco.', ['Giulia è a Marco.', 'Giulia è di Marco.'], 'At a person\'s place: da.', [])
L.line("A friend calls and asks if you're at home. You're out, in town.",
       [{"speaker": "Friend", "text": "Sei a casa?"}, {"speaker": "You"}],
       ['No, sono fuori. Sono in centro.', 'No, sono in centro.'], 'No, then where you are.', ['fuori'])
L.say("Tell a friend you're going to the supermarket and then home.", ['vado al supermercato e poi a casa'], 'Al supermercato, a casa.', [])
L.line('A friend asks where to wait for you. Say: in front of the church, in the square.',
       [{"speaker": "Friend", "text": "Dove aspetto?"}, {"speaker": "You"}],
       ['Davanti alla chiesa, in piazza.', 'Aspetti davanti alla chiesa, in piazza.'], 'Davanti a + la.', ['davanti'])

# ── 5. Showing Chloé Around (practice) ──
L = lesson(5, 'Showing Chloé Around', 'practice')
L.line("Chloé is visiting your town. The museum is in the square, opposite the church.",
       [{"speaker": "Chloé", "text": "Dov'è il museo?"}, {"speaker": "You"}],
       ['È in piazza, di fronte alla chiesa.', 'In piazza, di fronte alla chiesa.'], 'Di fronte a + la.', ['di fronte'])
L.line("It's ten minutes on foot.",
       [{"speaker": "Chloé", "text": "È lontano?"}, {"speaker": "You"}],
       ['No, è vicino. Dieci minuti a piedi.', 'No, dieci minuti a piedi.'], 'Vicino, and how long.', ['lontano'])
L.line('She suggests the bus. You want to walk.',
       [{"speaker": "Chloé", "text": "Andiamo in autobus?"}, {"speaker": "You"}],
       ['No, andiamo a piedi.', 'No, a piedi.'], 'A piedi.', [])
L.line("She'd like a coffee first. There's a bar behind the museum.",
       [{"speaker": "Chloé", "text": "C'è un bar qui vicino?"}, {"speaker": "You"}],
       ["Sì, c'è un bar dietro il museo.", 'Sì, dietro il museo.'], 'Dietro + il museo.', ['dietro'])
L.line('She needs to change money. There is a bank next to the post office.',
       [{"speaker": "Chloé", "text": "Devo cambiare soldi. Dov'è una banca?"}, {"speaker": "You"}],
       ["C'è una banca accanto alla posta.", 'È accanto alla posta.'], 'Accanto a + la.', ['cambiare'])
L.line('She wants to send a parcel home to Paris.',
       [{"speaker": "Chloé", "text": "Devo spedire un pacco a Parigi."}, {"speaker": "You"}],
       ['Andiamo in posta.', 'La posta è in piazza.'], 'Suggest going to the post office.', ['posta'])
L.say("Say: let's go to the museum and then to the park.", ['andiamo al museo e poi al parco'], 'Andiamo; al museo, al parco.', [])
L.arrange("Arrange: 'The bank is opposite the station.'", 'La banca è di fronte alla stazione.', ['dietro', 'al'], 'Di fronte a + la.', ['di fronte'])

# ── 6. Where Giulia Lives (reading: a description) ──
L = lesson(6, 'Where Giulia Lives', 'reading')
L.reading = {"title": "Dove abita Giulia", "paragraphs": [
    "Giulia abita a Firenze, in un appartamento in centro, vicino a piazza San Marco.",
    "Sotto casa c'è un bar. Ogni mattina Giulia prende un caffè al bar, al banco, e poi va al lavoro.",
    "Di fronte al bar c'è una farmacia, e accanto alla farmacia c'è un piccolo supermercato. La banca è vicino, dietro la chiesa. La posta, invece, è lontano.",
    "Giulia insegna italiano in una scuola di lingue. Non prende l'autobus: va a scuola a piedi o in bici.",
    "Nel fine settimana incontra gli amici in piazza, o va al cinema.",
    "Giulia non ha la macchina: in centro non c'è parcheggio!",
]}
L.vocab = [V('invece', 'on the other hand, instead', 'La banca è vicino. La posta, invece, è lontano.')]
L.mc('Where does Giulia live?', 'In the centre of Florence', ['Near the station', 'In the countryside'], "'In un appartamento in centro.'", [])
L.mc("What's downstairs from Giulia's flat?", 'A bar', ['A pharmacy', 'A supermarket'], "'Sotto casa c'è un bar.'", ['sotto'])
L.mc('Where is the supermarket?', 'Next to the pharmacy', ['Behind the church', 'Opposite the bar'], "'Accanto alla farmacia.'", ['accanto'])
L.mc('True or false: the post office is close to Giulia\'s flat.', 'False', ['True'], "'La posta, invece, è lontano.'", ['invece'])
L.mc('How does Giulia get to work?', 'On foot or by bike', ['By bus', 'By car'], "'A piedi o in bici.'", [])
L.mc("Why doesn't Giulia have a car?", "There's nowhere to park in the centre", ['She lives far from the centre', 'She has no money'],
     "'In centro non c'è parcheggio!'", ['parcheggio'])
L.cloze('Complete: The bank is near. The post office, on the other hand, is far.', 'La banca è vicino. La posta, ___, è lontano.', 'invece',
        'On the other hand.', ['invece'])
L.answer("Dov'è la banca?", ['è dietro la chiesa', 'dietro la chiesa', 'la banca è dietro la chiesa'], 'Read the third paragraph.', ['dietro'])
L.answer('Dove lavora Giulia?', ['in una scuola di lingue', 'lavora in una scuola di lingue', 'Giulia lavora in una scuola di lingue'], 'Insegna inglese…', [])

# ── 7. Paul's List (reading: a to-do list and a short scene) ──
L = lesson(7, "Paul's List", 'reading')
L.reading = {"title": "Oggi in centro", "paragraphs": [
    "Paul è a Firenze da una settimana. Oggi deve andare in centro. Ecco la lista:",
    "Banca · cambiare soldi",
    "Posta · spedire un pacco a Londra, due francobolli",
    "Supermercato · pane, latte, acqua",
    "Prima va in banca. Ma c'è un problema: Paul non ha il passaporto, e senza passaporto non può cambiare soldi.",
    "Allora va in posta, spedisce il pacco e compra i francobolli. Poi torna a casa a prendere il passaporto.",
    "Che giornata! E il supermercato? Domani.",
]}
L.vocab = [
    V('lista', 'list', 'Ecco la lista: pane, latte, acqua.'),
    V('senza', 'without', 'Senza passaporto non può cambiare soldi.'),
    V('prima', 'first, before · prima … poi = first … then', 'Prima va in banca, poi in posta.'),
    V('allora', 'so, then', 'Non ho soldi. Allora vado in banca.'),
]
L.mc('How long has Paul been in Florence?', 'A week', ['A month', 'A day'], "'Da una settimana.'", [])
L.mc('What does Paul need at the bank?', 'To change money', ['To send a parcel', 'To buy stamps'], 'Read the list.', ['cambiare'])
L.mc('Where is the parcel going?', 'To London', ['To Florence', 'To Paris'], 'Read the list.', ['pacco'])
L.mc("What's the problem at the bank?", "He doesn't have his passport", ['The bank is far away', 'He has no money'],
     "'Senza passaporto non può cambiare soldi.'", ['senza'])
L.mc('What does Paul do after the bank?', 'He goes to the post office', ['He goes to the supermarket', 'He goes home first'],
     "'Allora va in posta.'", ['allora'])
L.mc('True or false: Paul goes to the supermarket today.', 'False', ['True'], "'E il supermercato? Domani.'", ['lista'])
L.cloze('Complete from the text: Here is the list.', 'Ecco la ___.', 'lista', 'Paul writes one.', ['lista'])
L.meaning('senza', 'Senza passaporto non può cambiare soldi.', ['without'], 'Paul has no passport.', ['senza'])
L.meaning('allora', 'Non ha il passaporto. Allora va in posta.', ['so', 'then', 'so then'], 'What he does next, because of that.', ['allora'])
L.answer('Che cosa compra Paul in posta?', ['due francobolli', 'compra due francobolli', 'i francobolli'], 'Read the list.', ['francobollo'])
L.mc('Why does Paul go home in the end?', 'To get his passport', ['To leave the parcel', 'To have lunch'],
     "'Torna a casa a prendere il passaporto.'", ['senza'])
L.answer('Dove va Paul prima?', ['in banca', 'va in banca', 'prima va in banca'], 'Prima…', ['prima'])

# ── 8–9. Writing ──
L = lesson(8, 'My Neighbourhood', 'writing')
L.write("Describe where you live: what's near your home, what's far, and how you get to town.",
        "Abito a Leeds, vicino alla stazione. Sotto casa c'è un supermercato, e di fronte c'è un parco. La banca e la posta sono in centro, lontano da casa. Vado in centro in autobus. Nel fine settimana incontro gli amici al bar.",
        "Vicino a, sotto casa, di fronte, lontano da; then transport with in or a piedi.", ['sotto', 'di fronte', 'lontano'])
L = lesson(9, 'A Note for a Guest', 'writing')
L.write("A friend is staying at your place while you're at work. Leave a note: where they can find a bar, a supermarket and a pharmacy nearby, and where the keys are.",
        "Ciao! C'è un bar sotto casa. Il supermercato è in piazza, accanto alla chiesa, e la farmacia è di fronte alla posta. Le chiavi sono sul tavolo, in cucina. A presto!",
        "Where each place is, with accanto a, di fronte a, sotto casa.", ['accanto', 'di fronte', 'sotto'])

# ── 10. Speaking ──
L = lesson(10, 'Say It Out Loud', 'speaking')
L.read("Scusi, dov'è la posta?", 'Asking the way, politely.', ['posta'])
L.read('La farmacia è accanto alla banca.', 'Accanto alla.', ['accanto'])
L.read('Il bar è di fronte alla chiesa.', 'Di fronte alla.', ['di fronte', 'chiesa'])
L.read('Il parcheggio è dietro la stazione.', 'Dietro la.', ['dietro', 'parcheggio'])
L.read('Vado in centro a piedi.', 'In centro, a piedi.', [])
L.read('Devo spedire un pacco in Inghilterra.', 'Spedire un pacco.', ['pacco'])
L.read('Scusi, la stazione è lontano da qui?', 'Lontano da qui.', ['lontano'])

for L in LESSONS:
    L.dump()
print('\n'.join(L.meta(L.n) for L in LESSONS))
