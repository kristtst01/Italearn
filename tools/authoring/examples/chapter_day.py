"""Chapter 'A Day in My Life' (unit-09), after the Reflexive verbs unit.

Available: grammar units 1–14 (present tense, irregular verbs and modals, prepositions, questions and
how-often words, adjectives, clock times and days, possessives, piacere, reflexives with the pronoun
before the verb or joined to an infinitive), chapters 1–16 up to My Family. Likes & Plans (unit-18)
is written in parallel, so none of its words are used.
Not yet: the imperative, the past, comparisons (più … di).
Cast: Giulia teaches Italian in Florence; Emma (cat Biscotto), Paul (doctor, always late), Chloé
(works at a bar, Saturdays 8–3), Luca (Paul's language-exchange partner).
"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from chapterlib import Lesson, V

U = 'unit-09'
D = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'out', U)
os.makedirs(D, exist_ok=True)
LESSONS = []
def lesson(n, name, role):
    L = Lesson(U, D, n, name, role); LESSONS.append(L); return L

# ── 1. Getting Up ──
L = lesson(1, 'Getting Up', 'words')
L.vocab = [
    V('svegliarsi', 'to wake up · mi sveglio, ti svegli, si sveglia', 'Mi sveglio alle sette.'),
    V('sveglia', 'alarm clock, alarm · mettere la sveglia = to set the alarm', 'La sveglia suona alle sei e mezza.'),
    V('alzarsi', 'to get up · mi alzo, ti alzi, si alza', 'Mi sveglio, ma non mi alzo subito.'),
    V('lavarsi', 'to wash (yourself) · mi lavo, ti lavi, si lava', "Mi lavo la faccia con l'acqua fredda."),
    V('vestirsi', 'to get dressed · mi vesto, ti vesti, si veste', 'Mi vesto e faccio colazione.'),
    V('prepararsi', 'to get ready · mi preparo · preparare = to prepare, to make', 'Mi preparo in dieci minuti.'),
    V('tardi', 'late · più tardi = later · fare tardi = to stay out late, to be late', 'La domenica mi sveglio tardi.'),
    V('orologio', 'clock, watch', "Scusi, che ore sono? Non ho l'orologio."),
]
L.add('vocab', 'match_pairs', 'Match the verbs with their meanings.', '', ['svegliarsi|to wake up', 'alzarsi|to get up', 'lavarsi|to wash (yourself)', 'vestirsi|to get dressed', 'prepararsi|to get ready'],
      (), [], ['svegliarsi', 'alzarsi', 'lavarsi', 'vestirsi', 'prepararsi'])
L.meaning('sveglia', 'La sveglia suona alle sei e mezza.', ['alarm clock', 'alarm'], 'It rings in the morning.', ['sveglia'])
L.meaning('tardi', 'La domenica mi sveglio tardi.', ['late'], 'The opposite of presto.', ['tardi'])
L.cloze('Complete: I wake up at seven.', 'Mi ___ alle sette.', 'sveglio', 'Svegliarsi, the io form.', ['svegliarsi'])
L.mc('A friend asks when you get up. You get up at half past six. What do you say?', 'Mi alzo alle sei e mezza.',
     ['Alzo alle sei e mezza.', 'Mi alzo le sei e mezza.'], 'Alzarsi comes with mi, and a clock time takes alle.', ['alzarsi'])
L.cloze('Complete: Emma gets dressed and goes out.', 'Emma si ___ ed esce.', 'veste', 'Vestirsi, the lei form.', ['vestirsi'])
L.cloze('Complete: I wash my face with cold water.', "Mi ___ la faccia con l'acqua fredda.", 'lavo', 'Lavarsi, the io form.', ['lavarsi'])
L.mc("Someone in the street asks you the time, but you don't have a watch. What do you say?", "Mi dispiace, non ho l'orologio.",
     ['Mi dispiace, non ho la sveglia.', 'Mi dispiace, non ho tempo.'], 'A watch is an orologio.', ['orologio'])
L.meaning('prepararsi', 'Paul ha bisogno di dieci minuti per prepararsi.', ['to get ready', 'get ready'], 'Before going out.', ['prepararsi'])
L.line('A friend asks about your mornings. You wake up at seven, have a shower and get dressed.',
       [{"speaker": "Friend", "text": "Che cosa fai la mattina?"}, {"speaker": "You"}],
       ['Mi sveglio alle sette, faccio la doccia e mi vesto.', 'Alle sette mi sveglio, poi faccio la doccia e mi vesto.'],
       'Each reflexive verb takes mi.', ['svegliarsi', 'vestirsi'])
L.fix('Find the mistake: you like waking up late.', 'Mi piace svegliarsi tardi.', ['Mi piace svegliarmi tardi.'],
      'The pronoun joined to the infinitive matches the person.', ['svegliarsi', 'tardi'])
L.arrange("Arrange: 'I get ready in ten minutes.'", 'Mi preparo in dieci minuti.', ['si', 'alle'], 'Mi before the verb.', ['prepararsi'])
L.say('Ask a friend what time they get up.', ['A che ora ti alzi?'], 'Tu: ti alzi.', ['alzarsi'])
L.say('Say that on Saturdays you set the alarm for eight.', ['Il sabato metto la sveglia alle otto.'], 'Mettere la sveglia.', ['sveglia'])

# ── 2. Out All Day ──
L = lesson(2, 'Out All Day', 'words')
L.vocab = [
    V('finire', 'to finish, to end · finisco, finisci, finisce · finire di lavorare = to finish work', 'Finisco di lavorare alle sei.'),
    V('turno', 'shift (at work)', 'Il sabato Chloé ha il turno dalle otto alle tre.'),
    V('pausa', 'break · la pausa pranzo = lunch break', 'A mezzogiorno faccio una pausa.'),
    V('trovare', 'to find · trovare il tempo = to find the time', 'Non trovo le chiavi!'),
    V('vedersi', 'to see each other, to meet up · ci vediamo = see you · vederci = to meet (us)', 'Ci vediamo domani al bar?'),
]
L.meaning('vedersi', 'Paul e Luca vogliono vedersi il martedì.', ['to meet up', 'to see each other'], 'Two people, one meeting.', ['vedersi'])
L.meaning('turno', 'Il sabato Chloé ha il turno dalle otto alle tre.', ['shift', 'the shift'], 'Her hours at work.', ['turno'])
L.meaning('trovare', 'Non trovo le chiavi!', ['to find', 'find'], 'You are looking for your keys.', ['trovare'])
L.cloze('Complete: I finish work at six.', '___ di lavorare alle sei.', 'Finisco', 'Finire, the io form, like capisco.', ['finire'])
L.cloze('Complete: At noon I take a break.', 'A mezzogiorno faccio una ___.', 'pausa', 'A break.', ['pausa'])
L.mc("You're leaving a friend after a coffee. You'll meet again tomorrow. What do you say?", 'Ci vediamo domani!',
     ['Si vediamo domani!', 'Ci vedete domani!'], 'Noi: ci vediamo.', ['vedersi'])
L.mc('Chloé works on Saturdays from eight to three. How do you say it?', 'Il sabato lavora dalle otto alle tre.',
     ['Il sabato lavora alle otto dalle tre.', 'Il sabato lavora dalla otto alla tre.'], 'From … to …: dalle … alle.', [])
L.cloze('Complete: Paul never finds the time for lunch.', 'Paul non ___ mai il tempo per il pranzo.', 'trova', 'Trovare, the lui form.', ['trovare'])
L.line('A colleague asks when your shift ends. It ends at seven in the evening.',
       [{"speaker": "Colleague", "text": "A che ora finisce il turno?"}, {"speaker": "You"}],
       ['Finisce alle sette di sera.', 'Alle sette di sera.'], 'Alle + the hour, di sera.', ['finire', 'turno'])
L.line('A friend suggests a coffee tomorrow. You agree: at eleven, at the bar.',
       [{"speaker": "Friend", "text": "Prendiamo un caffè domani?"}, {"speaker": "You"}],
       ['Sì, ci vediamo alle undici al bar.', 'Va bene, ci vediamo al bar alle undici.'], 'Ci vediamo + time and place.', ['vedersi'])
L.arrange("Arrange: 'I usually finish work at five.'", 'Di solito finisco di lavorare alle cinque.', ['finire', 'dalle'],
          'Di solito goes at the start.', ['finire'])
L.say('Say: tomorrow I have to get up early.', ['Domani devo alzarmi presto.', 'Domani mi devo alzare presto.'],
      'With dovere, mi can go before it or on the infinitive.', ['alzarsi'])
L.say("Say you can't find your watch.", ['Non trovo il mio orologio.'], 'Trovare, the io form.', ['trovare', 'orologio'])
L.say('Say your lunch break is from one to two.', ["La pausa pranzo è dall'una alle due."], "From one: dall'una.", ['pausa'])

# ── 3. Evenings at Home ──
L = lesson(3, 'Evenings at Home', 'words')
L.vocab = [
    V('faccende', 'chores · le faccende di casa = housework (usually plural)', 'Il sabato faccio le faccende di casa.'),
    V('lavare', 'to wash (something) · lavare i piatti = to do the dishes', 'Dopo cena lavo i piatti.'),
    V('riposarsi', 'to rest · mi riposo, ti riposi, si riposa, ci riposiamo', 'La sera mi riposo un po\'.'),
    V('divano', 'sofa', 'Il gatto dorme sul divano.'),
    V('addormentarsi', 'to fall asleep · mi addormento, ti addormenti, si addormenta', 'Mi addormento davanti alla tv.'),
]
L.meaning('faccende', 'Il sabato faccio le faccende di casa.', ['chores', 'housework'], 'Cleaning, washing, shopping…', ['faccende'])
L.meaning('addormentarsi', 'Con il caffè è difficile addormentarsi.', ['to fall asleep', 'fall asleep'], 'You start to sleep.', ['addormentarsi'])
L.cloze('Complete: after dinner I do the dishes.', 'Dopo cena ___ i piatti.', 'lavo', 'Lavare, the io form: no mi, because you wash the plates.', ['lavare'])
L.mc('Which means "I\'m washing (myself)"?', 'Mi lavo.', ['Lavo.', 'Lavo i piatti.'], 'Washing yourself takes mi.', ['lavarsi', 'lavare'])
L.meaning('riposarsi', 'Dopo il turno, Chloé ha bisogno di riposarsi.', ['to rest', 'rest'], 'After a long day.', ['riposarsi'])
L.cloze('Complete: in the evening I rest on the sofa.', 'La sera mi ___ sul divano.', 'riposo', 'Riposarsi, the io form.', ['riposarsi', 'divano'])
L.mc('Your friend is very tired after work. What do you say?', "Perché non ti riposi un po'?",
     ["Perché non ti alzi un po'?", "Perché non ti vesti un po'?"], 'Riposarsi: to rest.', ['riposarsi'])
L.line('A friend asks what time you go to bed. Usually at midnight, but you fall asleep late.',
       [{"speaker": "Friend", "text": "A che ora vai a letto?"}, {"speaker": "You"}],
       ['Di solito a mezzanotte, ma mi addormento tardi.', 'Vado a letto a mezzanotte, ma mi addormento tardi.'],
       'A mezzanotte, with no article.', ['addormentarsi', 'tardi'])
L.line('Your flatmate asks who does the chores. You clean the kitchen and they do the dishes.',
       [{"speaker": "Flatmate", "text": "Chi fa le faccende?"}, {"speaker": "You"}],
       ['Io pulisco la cucina e tu lavi i piatti.', 'Io pulisco la cucina, tu lavi i piatti.'], 'Pulire: pulisco.', ['lavare'])
L.arrange("Arrange: 'On Sundays we rest at home.'", 'La domenica ci riposiamo a casa.', ['si', 'riposano'], 'Noi: ci riposiamo.', ['riposarsi'])
L.say('Say you often fall asleep on the sofa.', ['Mi addormento spesso sul divano.', 'Spesso mi addormento sul divano.'],
      'Spesso after the verb, or at the start.', ['addormentarsi', 'divano'])
L.say('Ask your flatmate if they are doing the dishes this evening.', ['Stasera lavi tu i piatti?', 'Lavi tu i piatti stasera?'],
      'Lavare i piatti.', ['lavare'])

# ── 4. What Time Do You…? (practice) ──
L = lesson(4, 'What Time Do You…?', 'practice')
L.line('Giulia asks the class about their mornings. You wake up at a quarter past seven.',
       [{"speaker": "Giulia", "text": "A che ora ti svegli la mattina?"}, {"speaker": "You"}],
       ['Mi sveglio alle sette e un quarto.', 'Alle sette e un quarto.'], 'E un quarto: a quarter past.', ['svegliarsi'])
L.line('Luca asks if you get up straight away. No: you stay in bed ten more minutes with your phone.',
       [{"speaker": "Luca", "text": "E ti alzi subito?"}, {"speaker": "You"}],
       ['No, sto a letto ancora dieci minuti con il telefono.', 'No, mi alzo dopo dieci minuti.'], 'Stare a letto: to stay in bed.', ['alzarsi'])
L.line('A classmate asks where you have breakfast. Usually at the bar: a cappuccino and a cornetto.',
       [{"speaker": "Classmate", "text": "Fai colazione a casa o al bar?"}, {"speaker": "You"}],
       ['Di solito al bar: un cappuccino e un cornetto.', 'Di solito faccio colazione al bar.'], 'Di solito at the start.', [])
L.line('A friend asks if you work on Saturdays too. Never: on Saturdays you rest.',
       [{"speaker": "Friend", "text": "Lavori anche il sabato?"}, {"speaker": "You"}],
       ['No, il sabato non lavoro mai. Mi riposo!', 'No, mai. Il sabato mi riposo.'], 'Non … mai.', ['riposarsi'])
L.line('Your neighbour, Signora Bianchi, sees you leave at half past six. Your shift starts at seven.',
       [{"speaker": "Signora Bianchi", "text": "Buongiorno! Esce sempre così presto?"}, {"speaker": "You"}],
       ['Sì, il turno comincia alle sette.', 'Sì, comincio a lavorare alle sette.'], 'She uses Lei; you answer about yourself.', ['turno'])
L.line("Emma asks the time. It's twenty to nine.",
       [{"speaker": "Emma", "text": "Che ore sono? Non ho l'orologio."}, {"speaker": "You"}],
       ['Sono le nove meno venti.', 'Sono le otto e quaranta.'], 'The next hour, meno the minutes.', ['orologio'])
L.mc('You go to the gym every day. How do you say it?', 'Vado in palestra ogni giorno.',
     ['Vado in palestra ogni giorni.', 'Vado in palestra tutti giorni.'], 'Ogni takes a singular noun.', [])
L.line('A friend asks when you finish work on Mondays. Late: at eight in the evening.',
       [{"speaker": "Friend", "text": "Il lunedì a che ora finisci?"}, {"speaker": "You"}],
       ['Tardi, alle otto di sera.', 'Il lunedì finisco tardi, alle otto.'], 'Tardi, then the time.', ['finire', 'tardi'])
L.say("Say you never go to bed before midnight.", ['Non vado mai a letto prima di mezzanotte.'], 'Non … mai; prima di.', [])

# ── 5. Two Saturdays (reading: a short story) ──
L = lesson(5, 'Two Saturdays', 'reading')
L.reading = {"title": "Due sabati", "paragraphs": [
    "Chloé ed Emma sono amiche, ma il sabato non si vedono quasi mai. Perché? Ecco le loro giornate.",
    "Il sabato la sveglia di Chloé suona alle sei e mezza. Chloé non è contenta, ma si alza subito: fa la doccia, si veste in cinque minuti e beve un caffè in piedi. Alle sette e mezza esce di casa e va al bar in bici.",
    "Il bar apre alle otto, e il sabato mattina ci sono sempre molte persone: studenti, turisti, famiglie con i bambini. Chloé prepara cappuccini e cornetti per tutta la mattina. A mezzogiorno mangia un panino al banco, in dieci minuti.",
    "Il turno finisce alle tre. Chloé torna a casa, si lava e si riposa un po' sul divano. La sera, di solito, esce con gli amici, ma non fa tardi: alle undici è già a letto, e si addormenta subito.",
    "Emma, invece, il sabato non lavora e non mette la sveglia. Si sveglia tardi, alle dieci o alle dieci e mezza, e sta a letto ancora un po' con il telefono. Poi si alza e fa colazione a casa, con Biscotto.",
    "Il pomeriggio fa le faccende di casa: lava i piatti, pulisce la cucina e va a fare la spesa. La sera Emma non è mai stanca. Va a ballare o al cinema e torna a casa a mezzanotte, o anche più tardi.",
    "Ma la domenica le due amiche si vedono sempre: alle undici, al bar di Chloé. Chloé non lavora, ma il caffè lì è buono. E chi arriva in ritardo? Emma, naturalmente.",
]}
L.vocab = [
    V('naturalmente', 'of course, naturally', 'Paul arriva in ritardo, naturalmente.'),
]
L.mc("What time does Chloé's alarm go off on Saturdays?", 'At half past six', ['At six', 'At half past seven'], "'Alle sei e mezza.'", ['sveglia'])
L.mc('How does Chloé get to the bar?', 'By bike', ['By bus', 'On foot'], "'In bici.'", [])
L.mc('When does she have lunch?', 'At noon, in ten minutes', ['At three, at home', 'At one, at a restaurant'], 'Read the third paragraph.', [])
L.mc('True or false: Chloé goes to bed late on Saturdays.', 'False', ['True'], "'Non fa tardi: alle undici è già a letto.'", ['tardi'])
L.mc('What does Emma do on Saturday afternoons?', 'Housework and the shopping', ['She works at the bar', 'She sleeps'], 'Read the sixth paragraph.', ['faccende'])
L.mc('When do the two friends see each other?', "On Sundays at eleven, at Chloé's bar", ['On Saturday evenings', "On Sundays at Emma's house"],
     'Read the last paragraph.', ['vedersi'])
L.cloze("Complete from the text: Emma doesn't set the alarm.", 'Emma non mette la ___.', 'sveglia', 'The alarm clock.', ['sveglia'])
L.cloze('Complete from the text: Chloé rests a little on the sofa.', "Si riposa un po' sul ___.", 'divano', 'The sofa.', ['divano'])
L.answer('A che ora si sveglia Emma il sabato?', ['Alle dieci o alle dieci e mezza.', 'Si sveglia alle dieci o alle dieci e mezza.'],
         'Read the fifth paragraph.', ['svegliarsi'])
L.answer('Che cosa fa Chloé dopo il turno?', ["Torna a casa, si lava e si riposa un po'.", "Si lava e si riposa sul divano."],
         'Read the fourth paragraph.', ['riposarsi', 'turno'])
L.answer('Chi arriva in ritardo la domenica?', ['Emma.', 'Arriva Emma.'], 'Read the last line.', [])
L.cloze('Complete from the text: Emma, of course.', 'Chi arriva in ritardo? Emma, ___.', 'naturalmente', 'Of course.', ['naturalmente'])

# ── 6. Busy Days (practice) ──
L = lesson(6, 'Busy Days', 'practice')
L.line("A friend wants to go out this evening. You can't: tomorrow you have to get up at five.",
       [{"speaker": "Friend", "text": "Stasera usciamo?"}, {"speaker": "You"}],
       ['No, mi dispiace: domani devo alzarmi alle cinque.', 'Non posso, domani mi devo alzare alle cinque.'],
       'Dovere + alzarsi: mi on either side.', ['alzarsi'])
L.line('Paul suggests seven. You finish work at seven, so you suggest half past.',
       [{"speaker": "Paul", "text": "Ci vediamo alle sette?"}, {"speaker": "You"}],
       ['Finisco di lavorare alle sette. Alle sette e mezza?', 'Ci vediamo alle sette e mezza? Finisco alle sette.'],
       'Finisco di lavorare…', ['finire', 'vedersi'])
L.line('Chloé tells you about her Saturdays and asks about yours. You wake up late and do the housework.',
       [{"speaker": "Chloé", "text": "Il sabato lavoro dalle otto alle tre. E tu, che cosa fai il sabato?"}, {"speaker": "You"}],
       ['Mi sveglio tardi e faccio le faccende di casa.', 'Io mi alzo tardi e faccio le faccende.'], 'Two things, joined with e.', ['faccende', 'tardi'])
L.line('Luca sees you are tired and asks if you want to rest. Yes, a little, on the sofa.',
       [{"speaker": "Luca", "text": "Sei stanco? Ti riposi un po'?"}, {"speaker": "You"}],
       ["Sì, mi riposo un po' sul divano.", "Sì, un po' sul divano."],
       'Ti riposi becomes mi riposo in your answer.', ['riposarsi', 'divano'])
L.line('A classmate asks how you find the time to study. You study on the bus, in the morning.',
       [{"speaker": "Classmate", "text": "Come trovi il tempo per studiare?"}, {"speaker": "You"}],
       ['Studio in autobus, la mattina.', 'La mattina studio in autobus.'], 'In autobus: on the bus.', ['trovare'])
L.fix("Find the mistake: tomorrow I have to get up early.", 'Domani devo alzarsi presto.', ['Domani devo alzarmi presto.'],
      'The pronoun matches the person: io, so -mi.', ['alzarsi'])
L.line("It's Friday. A friend asks if you're going to bed early. No: tomorrow you don't work, so you'll stay up late.",
       [{"speaker": "Friend", "text": "Vai a letto presto stasera?"}, {"speaker": "You"}],
       ['No, domani non lavoro: stasera faccio tardi!', 'No, domani non lavoro e mi sveglio tardi.'], 'Fare tardi.', ['tardi'])
L.say('Tell a friend: see you on Saturday at the station.', ['Ci vediamo sabato alla stazione.'], 'Ci vediamo + day + place.', ['vedersi'])

# ── 7. Five Questions for Paul (reading: an interview) ──
L = lesson(7, 'An Interview with Paul', 'reading')
L.reading = {"title": "Una giornata con Paul", "paragraphs": [
    "Ogni mese uno studente della scuola fa qualche domanda a un compagno di corso. Questo mese Aiko fa le domande a Paul, medico inglese e studente di Giulia.",
    "Aiko: Paul, a che ora ti svegli la mattina?",
    "Paul: Alle sei. Ho due sveglie: una sul telefono e una vecchia sveglia accanto al letto. Con una sveglia sola non mi alzo!",
    "Aiko: E poi?",
    "Paul: Faccio la doccia, mi vesto e bevo un caffè. Non faccio colazione: non ho tempo. Alle sei e quaranta esco di casa e prendo l'autobus.",
    "Aiko: Quante ore lavori?",
    "Paul: Tante! Di solito il turno in ospedale comincia alle sette e finisce alle sette di sera. Qualche volta lavoro anche di notte.",
    "Aiko: Ma la lezione con Giulia è alle due. Come fai?",
    "Paul: È la mia pausa pranzo! Vengo a scuola di corsa e dopo la lezione torno subito in ospedale. Per questo mangio il panino in autobus.",
    "Aiko: E la sera?",
    "Paul: Torno a casa verso le otto, cucino la cena e mi riposo un po'. Il martedì e il giovedì mi vedo con Luca per lo scambio linguistico, al bar in piazza San Marco.",
    "Aiko: A che ora vai a letto?",
    "Paul: Alle undici, ma non mi addormento subito: leggo un libro in italiano. Dopo cinque minuti dormo!",
    "Aiko: Un'altra domanda: hai un orologio?",
    "Paul: Sì, un orologio molto bello, un regalo di mia madre. Ma non guardo mai l'ora!",
]}
L.vocab = []  # compagno is taught in Work & Study (unit-10)
L.mc('Why does Paul have two alarm clocks?', "With only one, he doesn't get up", ['One is for the weekend', 'One is broken'], "'Con una sveglia sola non mi alzo!'", ['sveglia'])
L.mc('What does Paul have for breakfast?', 'Just a coffee', ['A cappuccino and a cornetto', 'Nothing at all'], 'Read his second answer.', [])
L.mc('When does his shift usually start and end?', 'At seven in the morning and seven in the evening', ['At six and six', 'At eight and two'],
     "'Comincia alle sette e finisce alle sette di sera.'", ['turno'])
L.mc('When does Paul come to the Italian lesson?', 'In his lunch break', ['After work', 'Before work'], "'È la mia pausa pranzo!'", ['pausa'])
L.mc('Where does he eat his sandwich?', 'On the bus', ['At the bar', 'In class'], "'Mangio il panino in autobus.'", [])
L.mc('Who does Paul meet on Tuesdays and Thursdays?', 'Luca', ['Giulia', 'Aiko'], "'Mi vedo con Luca.'", ['vedersi'])
L.mc('True or false: Paul falls asleep as soon as he goes to bed.', 'False', ['True'], "'Non mi addormento subito.'", ['addormentarsi'])
L.cloze('Complete from the text: I never check the time.', "Non guardo mai l'___!", 'ora', "Guardare l'ora: to check the time.", ['orologio'])
L.answer('A che ora esce di casa Paul?', ['Alle sei e quaranta.', 'Esce di casa alle sei e quaranta.'], 'Read his second answer.', [])
L.answer('Che cosa fa Paul prima di dormire?', ['Legge un libro in italiano.', 'Legge un libro.'], 'Read his answer about bedtime.', [])
L.answer('Chi è Aiko per Paul?', ['Una compagna di corso.', 'È una compagna di corso.'], 'Read the first paragraph.', ['compagno'])

# ── 8–9. Writing ──
L = lesson(8, 'A Weekday and a Sunday', 'writing')
L.write('Describe a normal weekday and then your Sunday: what time you get up, what you do, and when you go to bed.',
        "Il lunedì mi sveglio alle sette meno un quarto. Faccio la doccia, mi vesto e faccio colazione al bar. "
        "Alle otto e mezza comincio a lavorare e alle sei finisco. La sera ceno a casa, lavo i piatti e mi riposo un po' sul divano. "
        "Vado a letto alle undici. La domenica, invece, non metto la sveglia: mi alzo tardi, verso le dieci, e il pomeriggio vedo gli amici.",
        'Use clock times with alle, and the reflexive verbs with mi. Invece helps for the contrast.', ['svegliarsi', 'riposarsi', 'sveglia', 'tardi'])

L = lesson(9, 'A Message from Francesca', 'writing')
L.reading = {"title": "Un messaggio di Francesca", "paragraphs": [
    "Ciao! Mi chiamo Francesca e sono di Firenze. Giulia dice che cerchi una persona per parlare italiano: io studio l'inglese, allora è perfetto!",
    "Lavoro in un negozio di libri vicino al Duomo. Le mie giornate sono quasi tutte uguali: mi alzo alle sette, faccio la doccia, bevo un caffè e alle otto e mezza prendo l'autobus.",
    "Il negozio apre alle nove e chiude alle sette e mezza, con una pausa dall'una alle tre e mezza. Il lunedì mattina il negozio è chiuso, e io mi sveglio tardi!",
    "La sera ceno a casa, guardo una serie e alle undici vado a letto. Il fine settimana vedo gli amici.",
    "E tu? Com'è la tua giornata? A che ora ti alzi, e quando sei libero o libera? Così troviamo un giorno per vederci.",
    "A presto,",
    "Francesca",
]}
L.write("Reply to Francesca. Describe your day and say when you're free, so you can find a day to meet.",
        "Ciao Francesca! Grazie per il messaggio. Io lavoro in un ufficio dalle nove alle cinque. Mi alzo alle sette e mezza e vado al lavoro in bici. "
        "La sera di solito cucino e studio l'italiano. Il martedì e il giovedì ho lezione con Giulia. "
        "Sono libera il mercoledì sera e il sabato mattina. Ci vediamo sabato alle dieci al bar in piazza? A presto!",
        'Answer her questions: your times, your evenings, and a day and time to meet (ci vediamo…).', ['vedersi', 'alzarsi', 'trovare'])

# ── 10. Speaking ──
L = lesson(10, 'Say It Out Loud', 'speaking')
L.read('Mi sveglio alle sei e mezza, ma mi alzo alle sette.', 'Mi sveglio, mi alzo.', ['svegliarsi', 'alzarsi'])
L.read('Che ore sono? Sono le nove meno un quarto.', 'Telling the time.', ['orologio'])
L.read('Il turno finisce alle tre.', 'Finisce: the sc sounds like sh.', ['turno', 'finire'])
L.read('Dopo cena lavo i piatti e mi riposo.', 'Lavo, mi riposo.', ['lavare', 'riposarsi'])
L.read('Domani devo alzarmi presto.', 'Alzarmi: the stress is on zar.', ['alzarsi'])
L.read('La domenica mi addormento tardi.', 'Addormento: a double d.', ['addormentarsi', 'tardi'])
L.read('Ci vediamo domani a mezzogiorno!', 'Mezzogiorno: zz sounds like dz.', ['vedersi'])

for L in LESSONS:
    L.dump()
print('\n'.join(L.meta(L.n) for L in LESSONS))
