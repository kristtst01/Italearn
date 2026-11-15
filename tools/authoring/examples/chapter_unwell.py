"""Chapter 'Feeling Unwell' (unit-20), after the Imperative unit and Finding Your Way.

Available: units 1–15 (piacere and the indirect pronouns mi, ti, gli, le, Le; reflexives with
sentirsi and riposarsi; the imperative for tu and voi, non + infinitive, pronouns joined to the end,
and the Lei set phrases scusi, senta, mi dica, prego si accomodi), chapters 1–16.
Not yet: the past; Lei imperatives beyond the set phrases (a doctor or pharmacist says deve…,
può… or uses the present); direct object pronouns (lo, la). Likes & Plans, A Day in My Life and
Finding Your Way come earlier in the course but were written in parallel, so none of their words
are used here.
Mi fa male is taught as a phrase on a word list: the Piacere unit gives the pattern (fa / fanno
agree with the thing, the person is mi, ti, Le), but not this verb.
Cast facts used: Paul is a doctor at the hospital and always busy; Tomás is shy; Aiko and Yuki are
sisters; Chloé works at a bar on Saturdays from 8 to 3; Luca plays football; Tortellino is Luca's
family dog. New: Dottoressa Neri, Tomás's doctor, has her surgery near Giulia's school.
"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from chapterlib import Lesson, V

U = 'unit-20'
D = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'out', U)
os.makedirs(D, exist_ok=True)
LESSONS = []
def lesson(n, name, role):
    L = Lesson(U, D, n, name, role); LESSONS.append(L); return L

def P(word, meaning, example):  # a fixed phrase kept as its own entry
    return {**V(word, meaning, example), "phrase": True}

# ── 1. Where It Hurts ──
L = lesson(1, 'Where It Hurts', 'words')
L.vocab = [
    P('mi fa male', 'it hurts (me) · mi fanno male = they hurt · ti fa male? = does it hurt?', 'Mi fa male un dente.'),
    V('testa', 'head', 'Oggi mi fa male la testa.'),
    V('gola', 'throat', 'Ho la gola rossa.'),
    V('pancia', 'stomach, belly, tummy', 'Non mangio: mi fa male la pancia.'),
    V('schiena', 'back (of the body)', 'Lavoro al computer tutto il giorno e mi fa male la schiena.'),
    V('braccio', 'arm · le braccia (plural, feminine)', 'Mi fanno male le braccia.'),
    V('gamba', 'leg', 'Tortellino ha le gambe corte.'),
    V('dente', 'tooth', 'Giorgia ha sei anni e un dente nuovo.'),
    V('orecchio', 'ear · le orecchie (plural)', 'Il gatto ha le orecchie piccole.'),
]
L.meaning('gola', 'Ho la gola rossa.', ['throat', 'the throat', 'my throat'], 'Where your voice comes from.', ['gola'])
L.meaning('schiena', 'Lavoro al computer tutto il giorno e mi fa male la schiena.', ['back', 'my back', 'the back'], 'Part of the body, behind you.', ['schiena'])
L.meaning('pancia', 'Non mangio: mi fa male la pancia.', ['stomach', 'belly', 'tummy'], 'Where your food goes.', ['pancia'])
L.cloze('Complete: My head hurts.', 'Mi fa male la ___.', 'testa', 'Head.', ['testa', 'mi fa male'])
L.mc('Your feet hurt after a day walking around Florence. What do you say?', 'Mi fanno male i piedi.', ['Mi fa male i piedi.', 'Mi fanno male il piede.'],
     'More than one thing hurts: fanno, as with piacciono.', ['mi fa male'])
L.cloze("Complete: Tortellino has short legs.", 'Tortellino ha le ___ corte.', 'gambe', 'Gamba in the plural.', ['gamba'])
L.mc('Which says "my arms hurt"?', 'Mi fanno male le braccia.', ['Mi fanno male i bracci.', 'Mi fa male le braccia.'],
     'Braccio has an irregular plural: le braccia.', ['braccio', 'mi fa male'])
L.cloze('Complete: The cat has small ears.', 'Il gatto ha le ___ piccole.', 'orecchie', 'Orecchio in the plural.', ['orecchio'])
L.line('A friend sees you holding your face and asks what is wrong. A tooth hurts.',
       [{"speaker": "Friend", "text": "Che cos'hai?"}, {"speaker": "You"}],
       ['Mi fa male un dente.', 'Mi fa male un dente!'], 'Mi fa male + the thing that hurts.', ['dente', 'mi fa male'])
L.line('The doctor asks where it hurts. Your back hurts.',
       [{"speaker": "Doctor", "text": "Dove Le fa male?"}, {"speaker": "You"}],
       ['Mi fa male la schiena.', 'Qui, la schiena.'], 'She says Le (to you, formal); you answer with mi.', ['schiena', 'mi fa male'])
L.arrange("Arrange: 'Does your ear hurt?'", "Ti fa male l'orecchio?", ['fanno', 'mi'], 'Ti: to you.', ['orecchio', 'mi fa male'])
L.say('Say: My throat hurts.', ['mi fa male la gola'], 'One thing: fa.', ['gola', 'mi fa male'])
L.say('Say: My legs hurt.', ['mi fanno male le gambe'], 'More than one thing: fanno.', ['gamba', 'mi fa male'])
L.say('Ask a friend: does your head hurt?', ['ti fa male la testa'], 'Ti for a friend.', ['testa', 'mi fa male'])

# ── 2. I Don't Feel Well ──
L = lesson(2, "I Don't Feel Well", 'words')
L.vocab = [
    V('malato', 'ill, sick', 'Oggi Aiko è malata e non viene a lezione.'),
    V('febbre', 'fever, a temperature · ho la febbre = I have a temperature', 'Ho la febbre a trentotto.'),
    V('raffreddore', 'cold (the illness) · ho il raffreddore = I have a cold', 'In inverno ho sempre il raffreddore.'),
    V('tosse', 'cough · ho la tosse = I have a cough', 'Tomás ha la tosse.'),
    P('mal di', 'an ache, a pain in · ho mal di testa = I have a headache · mal di gola = a sore throat · mal di pancia, mal di denti, mal di schiena', 'Ho mal di testa e vado a letto.'),
    V('meglio', 'better · sto meglio, mi sento meglio = I feel better', 'Oggi sto meglio, grazie.'),
    V('peggio', 'worse · sto peggio = I feel worse', 'Stasera mi sento peggio.'),
]
L.meaning('raffreddore', 'In inverno ho sempre il raffreddore.', ['cold', 'a cold'], 'Winter, a red nose…', ['raffreddore'])
L.meaning('mal di gola', 'Ho mal di gola.', ['sore throat', 'a sore throat'], 'Mal di + the part that hurts.', ['mal di', 'gola'])
L.meaning('malata', 'Oggi Aiko è malata e non viene a lezione.', ['ill', 'sick'], 'Malato, for a woman.', ['malato'])
L.cloze('Complete: I have a temperature of thirty-eight.', 'Ho la ___ a trentotto.', 'febbre', 'A temperature.', ['febbre'])
L.mc('A friend asks how you are. You have a cold and feel bad. What do you say?', 'Sto male: ho il raffreddore.',
     ['Sto bene: ho il raffreddore.', 'Sono male: ho il raffreddore.'], 'How you feel: stare.', ['raffreddore'])
L.cloze('Complete: Tomás has a cough.', 'Tomás ha la ___.', 'tosse', 'A cough.', ['tosse'])
L.mc('Which says "I have a headache"?', 'Ho mal di testa.', ['Ho male la testa.', 'Sono mal di testa.'], 'Avere + mal di + the part.', ['mal di', 'testa'])
L.cloze('Complete: Today I feel better, thanks.', 'Oggi sto ___, grazie.', 'meglio', 'Better.', ['meglio'])
L.line('Giulia asks how you feel today. You feel worse: you have a temperature and a cough.',
       [{"speaker": "Giulia", "text": "Come ti senti oggi?"}, {"speaker": "You"}],
       ['Mi sento peggio: ho la febbre e la tosse.', 'Sto peggio. Ho la febbre e la tosse.'], 'Mi sento or sto + peggio.', ['peggio', 'febbre', 'tosse'])
L.line("A colleague asks why you aren't eating. You have a stomach ache.",
       [{"speaker": "Colleague", "text": "Perché non mangi?"}, {"speaker": "You"}],
       ['Perché ho mal di pancia.', 'Ho mal di pancia.'], 'Mal di + pancia.', ['mal di', 'pancia'])
L.arrange("Arrange: 'Aiko is ill and has a headache.'", 'Aiko è malata e ha mal di testa.', ['malato', 'la'], 'Malato agrees with Aiko.', ['malato', 'mal di'])
L.say('Say you have a cold and a sore throat.', ['ho il raffreddore e mal di gola', 'ho il raffreddore e il mal di gola'], 'Il raffreddore, then mal di.', ['raffreddore', 'mal di'])
L.say('Say: I feel better today.', ['oggi sto meglio', 'oggi mi sento meglio'], 'Stare or sentirsi + meglio.', ['meglio'])
L.say('Say: Emma is ill.', ['emma è malata'], 'Agree with Emma.', ['malato'])

# ── 3. At the Pharmacy ──
L = lesson(3, 'At the Pharmacy', 'words')
L.vocab = [
    V('farmacista', 'pharmacist · il farmacista, la farmacista', 'La farmacista è molto gentile.'),
    V('medicina', 'medicine · le medicine (plural)', 'Prendo la medicina dopo cena.'),
    V('qualcosa', 'something · qualcosa per la tosse = something for a cough', 'Vorrei qualcosa per il mal di testa.'),
    V('pastiglia', 'tablet, pill; a lozenge', 'Una pastiglia ogni otto ore.'),
    V('sciroppo', 'syrup (medicine) · lo sciroppo', 'Lo sciroppo per la tosse è buono.'),
    V('ricetta', 'prescription; a recipe', 'Per questa medicina ci vuole la ricetta.'),
    V('consigliare', 'to advise, recommend · Che cosa mi consiglia? = What do you recommend?', 'Il farmacista consiglia uno sciroppo.'),
]
L.meaning('pastiglia', 'Una pastiglia ogni otto ore.', ['tablet', 'a tablet', 'pill', 'a pill', 'lozenge'], 'You take it with water.', ['pastiglia'])
L.meaning('ricetta', 'Per questa medicina ci vuole la ricetta.', ['prescription', 'a prescription'], 'The paper the doctor gives you.', ['ricetta'])
L.cloze('Complete: I would like something for a cough.', 'Vorrei ___ per la tosse.', 'qualcosa', 'Something.', ['qualcosa'])
L.mc('You have a sore throat. What do you ask the pharmacist?', 'Ha qualcosa per il mal di gola?',
     ['Hai qualcosa per il mal di gola?', 'Ha qualcosa per la mal di gola?'], 'To the pharmacist, Lei: ha. Mal is masculine.', ['qualcosa', 'farmacista'])
L.cloze('Complete: I take the medicine after dinner.', 'Prendo la ___ dopo cena.', 'medicina', 'Medicine.', ['medicina'])
L.cloze('Complete: two tablets a day, after meals.', 'Due ___ al giorno, dopo i pasti.', 'pastiglie', 'Pastiglia in the plural.', ['pastiglia'])
L.mc('The pharmacist says: "Per questa medicina ci vuole la ricetta." What does she mean?', 'You need a prescription for this medicine',
     ["This medicine isn't for you", 'This medicine is expensive'], 'Ci vuole: you need.', ['ricetta'])
L.cloze('Complete: a spoonful of syrup three times a day.', 'Un cucchiaio di ___ tre volte al giorno.', 'sciroppo', 'Syrup.', ['sciroppo'])
L.line('At the pharmacy. You have a cough and want something for it.',
       [{"speaker": "Pharmacist", "text": "Buongiorno, mi dica."}, {"speaker": "You"}],
       ['Buongiorno. Vorrei qualcosa per la tosse, per favore.', 'Buongiorno, ho la tosse. Ha uno sciroppo?'], 'Vorrei qualcosa per…', ['qualcosa', 'tosse'])
L.line('The pharmacist shows you two things. Ask which one she recommends.',
       [{"speaker": "Pharmacist", "text": "Per il mal di testa ho queste pastiglie o questo sciroppo."}, {"speaker": "You"}],
       ['Che cosa mi consiglia?', 'Quale mi consiglia?'], 'Mi consiglia: Lei form.', ['consigliare'])
L.line("The pharmacist asks for a prescription. You don't have one: ask if you need it.",
       [{"speaker": "Pharmacist", "text": "Ha la ricetta?"}, {"speaker": "You"}],
       ['No. Ci vuole la ricetta?', 'No, non ho la ricetta. Ci vuole?'], 'Ci vuole…?', ['ricetta'])
L.arrange("Arrange: 'How many times a day?'", 'Quante volte al giorno?', ['quanti', 'alla'], 'Volta is feminine.', [])
L.say('Say: I need a medicine for a fever.', ['ho bisogno di una medicina per la febbre'], 'Avere bisogno di…', ['medicina', 'febbre'])
L.say('Say: The pharmacist recommends a syrup.', ['il farmacista consiglia uno sciroppo', 'la farmacista consiglia uno sciroppo'], 'Consigliare: consiglia.', ['farmacista', 'consigliare'])
L.say('Ask the pharmacist (Lei): what do you recommend?', ['che cosa mi consiglia', 'cosa mi consiglia'], 'Mi + the Lei form.', ['consigliare'])

# ── 4. At the Doctor's ──
L = lesson(4, "At the Doctor's", 'words')
L.vocab = [
    V('dolore', 'pain · un dolore alla schiena = a pain in the back', 'Ho un dolore alla schiena.'),
    V('forte', 'strong; bad, severe (pain, a cold)', 'Il caffè italiano è forte.'),
    V('grave', 'serious (an illness, a problem)', 'Non è grave: è solo un raffreddore.'),
    V('riposo', 'rest', 'Dopo una settimana di lavoro, ho bisogno di riposo.'),
    V('restare', 'to stay, remain', 'Oggi resto a casa: ho la febbre.'),
    V('guarire', 'to get better, recover (guarisco) · Guarisci presto! = Get well soon!', 'Con il riposo guarisco presto.'),
    V('salute', 'health · Salute! = Bless you! (after a sneeze)', 'Come va la salute, nonna?'),
]
L.meaning('grave', 'Non è grave: è solo un raffreddore.', ['serious', 'bad'], 'The doctor says not to worry.', ['grave'])
L.meaning('guarisci presto', 'Guarisci presto, Aiko!', ['get well soon', 'get better soon'], 'What you say to a friend who is ill.', ['guarire'])
L.mc('The doctor asks you a question. What is she asking?', 'How long have you had a temperature?',
     ['How high is your temperature?', 'Do you often have a temperature?'], 'Da quanto tempo…?', ['febbre'], ctx='Da quanto tempo ha la febbre?')
L.cloze('Complete: I have a pain in my back.', 'Ho un ___ alla schiena.', 'dolore', 'A pain.', ['dolore'])
L.mc('The doctor, who calls you Lei, tells you to stay at home for two days. What does she say?', 'Deve restare a casa due giorni.',
     ['Devi restare a casa due giorni.', 'Deve resta a casa due giorni.'], 'Lei: deve + the infinitive.', ['restare'])
L.cloze("Complete: It's not serious.", 'Non è ___.', 'grave', 'Serious.', ['grave'])
L.cloze('Complete: You (Lei) need rest.', 'Lei ha bisogno di ___.', 'riposo', 'Rest.', ['riposo'])
L.mc('Someone sneezes next to you. What do you say?', 'Salute!', ['Auguri!', 'Prego!'], 'Literally: health!', ['salute'])
L.cloze("Complete: The pain is strong, but it isn't serious.", 'Il dolore è ___, ma non è grave.', 'forte', 'Strong.', ['forte', 'dolore'])
L.line('The doctor asks what the problem is. You have had a bad pain in your stomach for two days.',
       [{"speaker": "Doctor", "text": "Buongiorno, si accomodi. Mi dica."}, {"speaker": "You"}],
       ['Ho un dolore forte alla pancia da due giorni.', 'Mi fa molto male la pancia da due giorni.'], 'Da + how long.', ['dolore', 'forte'])
L.line('The doctor says you must stay in bed for three days. Ask if it is serious.',
       [{"speaker": "Doctor", "text": "Deve restare a letto tre giorni."}, {"speaker": "You"}],
       ['È grave?', 'Ma è una cosa grave?'], 'A question with grave.', ['grave'])
L.arrange("Arrange: 'Get well soon, Tomás!'", 'Guarisci presto, Tomás!', ['guarisce', 'subito'], 'The tu command of guarire.', ['guarire'])
L.say('Say: Health is important.', ['la salute è importante'], 'Salute takes the article here.', ['salute'])
L.say("Say: I've had a cough for a week.", ['ho la tosse da una settimana'], 'Italian uses the present + da.', ['tosse'])
L.say('Say: Today I am staying at home.', ['oggi resto a casa', 'resto a casa oggi'], 'Restare: resto.', ['restare'])

# ── 5. At the Counter (practice, Lei) ──
L = lesson(5, 'At the Counter', 'practice')
L.line('At the pharmacy. You need something for a headache.',
       [{"speaker": "Pharmacist", "text": "Buongiorno, mi dica."}, {"speaker": "You"}],
       ['Buongiorno. Vorrei qualcosa per il mal di testa.', 'Buongiorno, ha qualcosa per il mal di testa?'], 'Qualcosa per il mal di testa.', ['qualcosa', 'mal di'])
L.line("The pharmacist asks if you have a temperature. You don't, but your throat hurts.",
       [{"speaker": "Pharmacist", "text": "Ha anche la febbre?"}, {"speaker": "You"}],
       ['No, ma mi fa male la gola.', 'No, la febbre no. Ma ho mal di gola.'], 'No, ma…', ['mi fa male', 'gola'])
L.line('The pharmacist recommends some tablets. Ask how many a day.',
       [{"speaker": "Pharmacist", "text": "Allora Le consiglio queste pastiglie."}, {"speaker": "You"}],
       ['Quante pastiglie al giorno?', 'Grazie. Quante al giorno?'], 'Quante: pastiglie is feminine plural.', ['pastiglia'])
L.line('You are at the pharmacy counter. Ask if you can pay by card.',
       [{"speaker": "Pharmacist", "text": "Sono nove euro e cinquanta."}, {"speaker": "You"}],
       ['Posso pagare con la carta?', 'Con la carta va bene?'], 'Posso + infinitive.', [])
L.line("At the doctor's. You have had a cough and a temperature for three days.",
       [{"speaker": "Doctor", "text": "Buongiorno, prego, si accomodi. Che cosa c'è?"}, {"speaker": "You"}],
       ['Ho la tosse e la febbre da tre giorni.', 'Da tre giorni ho la tosse e la febbre.'], 'The present + da.', ['tosse', 'febbre'])
L.line('The doctor asks where it hurts. Your ears hurt.',
       [{"speaker": "Doctor", "text": "Dove Le fa male?"}, {"speaker": "You"}],
       ['Mi fanno male le orecchie.', 'Le orecchie.'], 'Two ears: fanno.', ['orecchio', 'mi fa male'])
L.line('The doctor gives you her advice. Ask if you can go to work tomorrow.',
       [{"speaker": "Doctor", "text": "Non è grave. Deve prendere questo sciroppo e restare a casa."}, {"speaker": "You"}],
       ['Posso andare al lavoro domani?', 'Domani posso andare al lavoro?'], 'Posso + andare.', ['sciroppo', 'restare'])
L.line('The doctor gives you the prescription. Thank her and say goodbye.',
       [{"speaker": "Doctor", "text": "Ecco la ricetta. Due volte al giorno, dopo i pasti."}, {"speaker": "You"}],
       ['Grazie mille, dottoressa. Arrivederci.', 'Grazie, dottoressa. Buongiorno.'], 'Lei: arrivederci.', ['ricetta'])
L.mc('The doctor says: "Lei ha bisogno di riposo." What does she want you to do?', 'Rest', ['Come back tomorrow', 'Take a tablet'], 'Riposo: rest.', ['riposo'])

# ── 6. Looking After a Friend (practice, tu) ──
L = lesson(6, 'Looking After a Friend', 'practice')
L.line('Emma phones you. Tell her to stay in bed and drink lots of water.',
       [{"speaker": "Emma", "text": "Mi fa male la testa e ho la febbre."}, {"speaker": "You"}],
       ['Povera Emma! Resta a letto e bevi molta acqua.', 'Resta a letto e bevi molta acqua!'], 'Tu commands: resta, bevi.', ['restare'])
L.line("You are Paul. Luca phones after his football match: tell him not to play this week, and to rest (stare a riposo).",
       [{"speaker": "Luca", "text": "Paul, mi fa male la gamba. Che cosa faccio?"}, {"speaker": "You"}],
       ['Non giocare a calcio questa settimana: stai a riposo.', 'Stai a riposo e non giocare a calcio questa settimana!'], 'Don\'t: non + infinitive. Resting: a riposo.', ['gamba', 'riposo'])
L.line('A friend has a sore throat and wants to go to the gym. Tell him not to go.',
       [{"speaker": "Friend", "text": "Ho mal di gola. Vado in palestra?"}, {"speaker": "You"}],
       ['No, non andare in palestra! Resta a casa.', 'Non andare! Resta a casa.'], 'Non andare.', ['mal di', 'restare'])
L.line("Aiko is ill. Tell her not to come to class, and to write to Giulia.",
       [{"speaker": "Aiko", "text": "Sto male, ma oggi c'è lezione."}, {"speaker": "You"}],
       ['Non venire a lezione. Scrivi a Giulia.', 'Resta a casa e scrivi a Giulia.'], 'Non venire; scrivi.', [])
L.line('A friend still has a high temperature after three days. Tell her to call the doctor.',
       [{"speaker": "Friend", "text": "Ho ancora la febbre a trentanove."}, {"speaker": "You"}],
       ['Chiama il medico!', 'Va\' dal medico, subito!'], 'Chiama: tu command of chiamare.', ['febbre'])
L.mc('A friend with a cold wants to go out tonight. How do you say "Don\'t go out!"?', 'Non uscire!', ['Non esci!', 'Non uscite!'],
     'One friend: non + the infinitive.', [])
L.line('Yuki says Aiko is ill and asks if you have something for a temperature.',
       [{"speaker": "Yuki", "text": "Aiko è malata. Hai qualcosa per la febbre?"}, {"speaker": "You"}],
       ['Sì, ecco delle pastiglie. Una ogni otto ore.', 'Sì, ho delle pastiglie per la febbre.'], 'Ecco + what you give.', ['pastiglia', 'qualcosa'])
L.line('A friend says she feels better. Say you are glad, but tell her not to work too much.',
       [{"speaker": "Friend", "text": "Oggi sto meglio, grazie!"}, {"speaker": "You"}],
       ['Bene! Ma non lavorare troppo.', 'Che bello! Ma oggi non lavorare troppo.'], 'Non + infinitive.', ['meglio'])
L.say('Tell a friend: get well soon!', ['guarisci presto'], 'Guarire is an -isc- verb.', ['guarire'])

# ── 7. Emma's Cough Syrup (reading: a scene and instructions) ──
L = lesson(7, "Emma's Cough Syrup", 'reading')
L.reading = {"title": "Lo sciroppo di Emma", "paragraphs": [
    "Emma ha il raffreddore da tre giorni. Oggi ha anche la tosse e un po' di mal di gola, e di notte non dorme bene. Prima della lezione va in farmacia, vicino alla scuola.",
    "Farmacista: Buongiorno, mi dica.",
    "Emma: Buongiorno. Ho il raffreddore e la tosse. Ha qualcosa per la tosse?",
    "Farmacista: Ha anche la febbre?",
    "Emma: No, la febbre no. Ma sono stanca e mi fa male la gola.",
    "Farmacista: Allora Le consiglio questo sciroppo: per lo sciroppo non ci vuole la ricetta. E per la gola, ecco delle pastiglie. Può prendere una pastiglia ogni tre ore.",
    "Emma: Grazie. Quanto costa?",
    "Farmacista: Lo sciroppo otto euro e cinquanta, le pastiglie quattro euro. In tutto dodici euro e cinquanta.",
    "Fuori dalla farmacia, Emma legge le istruzioni dello sciroppo.",
    "Sciroppo per la tosse · per adulti e bambini da sei anni",
    "Quanto · adulti: un cucchiaio tre volte al giorno; bambini da sei a dodici anni: mezzo cucchiaio tre volte al giorno",
    "Quando · dopo i pasti",
    "Attenzione · non dare ai bambini sotto i sei anni. Lo sciroppo può dare sonno. Se la tosse dura più di una settimana, chiamare il medico.",
    "Emma prende un cucchiaio di sciroppo e va a lezione. In classe fa caldo, e la lezione è lunga.",
    "Alle tre Giulia fa una domanda a Emma. Ma Emma non risponde. Tutti guardano Emma: dorme sul libro!",
    "Giulia: Emma! Svegliati!",
    "Emma: Scusa, Giulia… È lo sciroppo!",
]}
L.vocab = [
    V('istruzione', 'instruction · le istruzioni = the instructions (on a box, a leaflet)', 'Prima di prendere la medicina, leggo le istruzioni.'),
    V('adulto', 'adult, grown-up', 'Questo sciroppo è per adulti.'),
]
L.mc('How long has Emma had a cold?', 'Three days', ['A week', 'Since this morning'], "'Da tre giorni.'", [])
L.mc('Does Emma have a temperature?', 'No', ['Yes, a high one', 'Yes, a little'], "'La febbre no.'", [])
L.mc('What does the pharmacist give Emma for her throat?', 'Some lozenges, one every three hours', ['A syrup, three times a day', 'Nothing: she needs a prescription'],
     'Read what the pharmacist says.', ['pastiglia'])
L.mc('True or false: Emma needs a prescription for the syrup.', 'False', ['True'], "'Per lo sciroppo non ci vuole la ricetta.'", ['ricetta'])
L.mc('How much syrup is for an adult?', 'A spoonful three times a day', ['Half a spoonful three times a day', 'A spoonful every three hours'],
     "Read the line 'Quanto'.", ['adulto'])
L.mc('Who should not take the syrup?', 'Children under six', ['Adults', 'Children over twelve'], "Read the line 'Attenzione'.", [])
L.mc('What does the leaflet say to do if the cough lasts more than a week?', 'Call the doctor', ['Take more syrup', 'Stay in bed'], "'Chiamare il medico.'", [])
L.mc('Why does Emma not answer Giulia?', "She's asleep: the syrup can make you sleepy", ["She doesn't understand the question", 'Her throat hurts too much'],
     "'Lo sciroppo può dare sonno.'", [])
L.cloze('Complete from the text: Emma reads the instructions for the syrup.', 'Emma legge le ___ dello sciroppo.', 'istruzioni', 'Istruzione in the plural.', ['istruzione'])
L.cloze('Complete from the leaflet: for adults and children from six.', 'Per ___ e bambini da sei anni.', 'adulti', 'Adulto in the plural.', ['adulto'])
L.answer('Quanto costa lo sciroppo?', ['otto euro e cinquanta', 'costa otto euro e cinquanta', '8,50 euro'], 'Read what the pharmacist says.', ['sciroppo'])
L.answer('Che cosa dice Giulia a Emma?', ['svegliati', 'Emma, svegliati'], 'A command with a reflexive verb.', [])

# ── 8. At the Doctor's (reading: messages and a scene) ──
L = lesson(8, "Doctor Neri", 'reading')
L.reading = {"title": "Dalla dottoressa", "paragraphs": [
    "Tomás ha la tosse da una settimana. Di notte non dorme, e oggi ha anche la febbre. Allora scrive un messaggio a Paul.",
    "Tomás: Ciao Paul, scusa, ho una domanda per un medico. Ho la tosse da una settimana e oggi ho la febbre a trentotto. Che cosa faccio?",
    "Paul: Una settimana è tanto! Va' dal medico oggi. Io non posso venire: sono in ospedale tutto il giorno. E bevi molta acqua.",
    "Il medico di Tomás è la dottoressa Neri. Il suo studio è vicino alla scuola di Giulia. Nella sala d'attesa ci sono già cinque persone, e Tomás aspetta quasi un'ora.",
    "Dottoressa Neri: Buongiorno, prego, si accomodi. Mi dica.",
    "Tomás: Buongiorno. Ho la tosse da una settimana e mi fa male la gola. Oggi ho anche la febbre, a trentotto.",
    "Dottoressa Neri: Vediamo un po' la gola… Sì, è molto rossa. Non è grave, ma Lei ha bisogno di riposo. Deve restare a casa tre giorni e bere molto. E deve prendere questo sciroppo due volte al giorno, dopo i pasti. Ecco la ricetta.",
    "Tomás: Posso andare a lezione?",
    "Dottoressa Neri: Questa settimana no. Lei studia italiano? Parla molto bene!",
    "Tomás: Grazie… Ma in classe non parlo quasi mai. Sono timido.",
    "Dottoressa Neri: Timido? Qui con me parla tanto! Allora ecco un'altra medicina: quando torna in classe, deve parlare.",
    "Tomás va in farmacia, compra lo sciroppo e torna a casa. Resta a letto tre giorni, beve molto tè e guarisce.",
    "Lunedì, a lezione, Giulia fa una domanda alla classe. E il primo a rispondere è… Tomás!",
]}
L.vocab = [
    P("sala d'attesa", 'waiting room', "Nella sala d'attesa ci sono molte persone."),
]
L.mc('Why does Tomás write to Paul?', 'He wants advice from a doctor', ['He wants to go out with Paul', 'He needs a lift to the doctor'], "'Ho una domanda per un medico.'", [])
L.mc("Why can't Paul come?", "He's at the hospital all day", ["He's ill too", "He's on holiday"], "'Sono in ospedale tutto il giorno.'", [])
L.mc('What does Paul tell Tomás to do?', 'Go to the doctor today and drink lots of water', ['Stay in bed and wait', 'Go to the hospital'], "Read Paul's message.", [])
L.mc('How long does Tomás wait?', 'Almost an hour', ['Five minutes', 'Three days'], "'Tomás aspetta quasi un'ora.'", ["sala d'attesa"])
L.mc('What does the doctor say about his throat?', "It's very red, but it isn't serious", ["It's fine", "It's serious: he must go to hospital"], "'È molto rossa. Non è grave.'", ['grave'])
L.mc('How often must Tomás take the syrup?', 'Twice a day, after he eats', ['Three times a day', 'Every three hours'], "'Due volte al giorno, dopo i pasti.'", ['sciroppo'])
L.mc('What is the doctor\'s "other medicine"?', 'He has to talk in class', ['A second syrup', 'Tea'], "'Quando torna in classe, deve parlare.'", ['medicina'])
L.mc('True or false: on Monday Tomás is the first to answer in class.', 'True', ['False'], 'Read the last paragraph.', [])
L.cloze("Complete from the text: in the waiting room there are already five people.", "Nella sala d'___ ci sono già cinque persone.", 'attesa', 'Waiting room.', ["sala d'attesa"])
L.cloze('Complete from the text: you need rest.', 'Lei ha bisogno di ___.', 'riposo', "The doctor's words.", ['riposo'])
L.answer('Quanti giorni deve restare a casa Tomás?', ['tre', 'tre giorni', 'deve restare a casa tre giorni'], "Read the doctor's advice.", ['restare'])
L.answer('Che cosa ha Tomás?', ['la tosse e la febbre', 'ha la tosse e la febbre', 'la tosse, mal di gola e la febbre'], 'Read the first paragraph.', ['tosse', 'febbre'])

# ── 9–10. Writing ──
L = lesson(9, "I Can't Come In", 'writing')
L.reading = {"title": "Un messaggio a Giulia", "paragraphs": [
    "Aiko: Cara Giulia, scusa, oggi non posso venire a lezione: sono malata. Ho la febbre a trentotto e mezzo e mi fa molto male la testa. Resto a letto tutto il giorno. Yuki viene a lezione, e poi studiamo insieme a casa. Giovedì vengo, se sto meglio. Un abbraccio, Aiko",
    "Giulia: Povera Aiko! Nessun problema. Resta a letto e bevi molta acqua. E oggi non studiare! Guarisci presto. Giulia",
]}
L.write("Aiko writes to her teacher. Now you are ill and can't go to work tomorrow. Write to your boss, who you call Lei: say what's wrong, what the doctor says, and when you hope to come back.",
        "Buongiorno, signor Ferri. Mi dispiace, ma domani non posso venire in ufficio: sono malato. Ho la febbre a trentotto, la tosse e un forte mal di gola. Il medico dice che devo restare a casa due giorni e prendere uno sciroppo. Giovedì, se sto meglio, vengo in ufficio. Grazie e buona giornata.",
        'Mi dispiace, ma…; sono malato or malata; then what is wrong and il medico dice che…', ['malato', 'febbre', 'restare'])

L = lesson(10, 'Get Well Soon', 'writing')
L.reading = {"title": "Un messaggio di Chloé", "paragraphs": [
    "Chloé: Emma, sto molto male! Ho il raffreddore, la tosse, e mi fanno male le orecchie. Non ho la febbre, ma sono molto stanca. E domani è sabato: devo lavorare al bar dalle otto alle tre. Che cosa faccio? Vado al lavoro?",
]}
L.write("Chloé writes to Emma for advice. Answer as Emma, a friend: say what Chloé should do and what she shouldn't, and end your message warmly.",
        "Povera Chloé! Non andare al bar domani: telefona oggi e resta a casa. Bevi molto tè caldo, prendi uno sciroppo per la tosse e va' a letto presto. Se domani hai la febbre o ti fanno ancora male le orecchie, chiama il medico. Guarisci presto! Un bacio, Emma",
        'Tu commands: resta, bevi, prendi; don\'t: non andare. Se + the present.', ['restare', 'guarire', 'tosse'])

# ── 11. Speaking ──
L = lesson(11, 'Say It Out Loud', 'speaking')
L.read('Mi fa male la testa.', 'Male: stress on the first syllable, ma-le.', ['testa', 'mi fa male'])
L.read('Mi fanno male le gambe.', 'Fanno: hold the double n.', ['gamba', 'mi fa male'])
L.read('Ho il raffreddore e la tosse.', 'Raffreddore: two f, two d. Tosse: double s.', ['raffreddore', 'tosse'])
L.read('Ho la febbre a trentotto.', 'Febbre: hold the double b.', ['febbre'])
L.read('Vorrei qualcosa per il mal di gola.', 'Qualcosa: qu as in quick.', ['qualcosa', 'mal di'])
L.read('Lo sciroppo per la tosse, per favore.', 'Sciroppo: sci sounds like the sh in shop.', ['sciroppo'])
L.read('Da quanto tempo ha la febbre?', 'A question from the doctor.', ['febbre'])
L.read('Non è grave, ma deve restare a casa.', 'Grave: two syllables, gra-ve.', ['grave', 'restare'])
L.read('Resta a letto e guarisci presto!', 'Guarisci: sci again, like sh.', ['restare', 'guarire'])

for L in LESSONS:
    L.dump()
print('\n'.join(L.meta(L.n) for L in LESSONS))
