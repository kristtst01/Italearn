"""Chapter 'Likes & Plans' (unit-18), after the grammar unit Piacere & indirect pronouns.

Available: units 1–13 (piacere: mi piace / mi piacciono, mi ti gli le Le ci vi gli, a + name,
a me / anche a me / neanche a me, piacere + infinitive, simpatico for people, preferire),
chapters 1–16 (Free Time already taught music, sport, hobby, libero, fine settimana; At the Café
taught volentieri and the volere/potere/dovere invitations; Time & dates taught days and clock times).
Not yet: reflexives (no 'ci vediamo'), the imperative (invitations use the present: 'Vieni?',
'Ti va di…?', 'Facciamo alle otto?'), the past, object pronouns beyond the piacere ones.
Built from the old unit-18 (Likes & Preferences) and the old unit-15 Making Plans (lesson 3,
Inviting & Planning), both in the pool.
Cast facts used: Chloé works at the bar on Saturdays from eight to three; Paul is a doctor and
always late; Tomás is shy, has a beard and glasses, comes from Madrid; Yuki and Aiko are sisters;
Luca plays football. New cast facts: Aiko's birthday party at the sisters' flat; Yuki likes
football and Aiko doesn't; Tomás draws and paints and hates the gym; Francesca, a Florentine who
paints, with a small black dog, Pepe.
"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from chapterlib import Lesson, V

U = 'unit-18'
D = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'out', U)
os.makedirs(D, exist_ok=True)
LESSONS = []
def lesson(n, name, role):
    L = Lesson(U, D, n, name, role); LESSONS.append(L); return L

# ── 1. What You Like ──
L = lesson(1, 'What You Like', 'words')
L.vocab = [
    V('preferito', 'favourite', 'Qual è il tuo film preferito?'),
    V('odiare', 'to hate · odio = I hate', 'Odio il freddo!'),
    V('per niente', 'not at all (with non)', 'Non mi piace per niente.'),
    V('arte', 'art · l\'arte (feminine)', "Mi piace molto l'arte italiana."),
    V('mostra', 'exhibition', "C'è una mostra interessante al museo."),
    V('concerto', 'concert', "Stasera c'è un concerto in piazza."),
]
L.vocab[2]['phrase'] = True
L.meaning('per niente', 'Non mi piace per niente.', ['not at all', "I don't like it at all"], 'With non: a strong no.', ['per niente'])
L.meaning('mostra', "C'è una mostra interessante al museo.", ['exhibition', 'an exhibition'], 'Something to see at a museum.', ['mostra'])
L.mc('A friend asks: "Ti piace il calcio?" You love it. What do you say?', 'Sì, mi piace tanto!', ['Sì, mi piacciono tanto!', 'Sì, io piace tanto!'],
     'One thing: piace.', [])
L.cloze('Complete: My favourite colour is blue.', 'Il mio colore ___ è il blu.', 'preferito', 'Favourite.', ['preferito'])
L.add('writing', 'fill_blank', 'Complete with piace or piacciono.', 'A Chloé ___ i concerti.', 'piacciono', [],
      ['Chloé likes concerts.'], ['concerto'])
L.mc('A friend says: "Mi piace l\'arte moderna." You like it too. What do you say?', 'Anche a me!', ['Neanche a me.', 'A me no.'],
     'Agreeing with a piace sentence.', ['arte'])
L.cloze('Complete: I hate the cold!', '___ il freddo!', 'Odio', 'The io form of odiare.', ['odiare'])
L.cloze('Complete: I really like Italian art.', "Mi piace molto l'___ italiana.", 'arte', 'Art.', ['arte'])
L.mc('A friend says: "Non mi piacciono i film lunghi." You don\'t like them either. What do you say?', 'Neanche a me.', ['Anche a me.', 'A me sì.'],
     'Agreeing with a negative.', [])
L.add('writing', 'fill_blank', 'You ask your teacher, formally, if she likes art.', "___ piace l'arte?", 'Le', [],
      ['Do you like art? (Lei)'], ['arte'])
L.cloze('Complete: I really like Giulia, she is so nice.', 'Giulia mi è molto ___.', 'simpatica', 'For people you like: simpatico, agreeing with Giulia.', [])
L.line('A friend asks if you like Italian music. You don\'t like it at all: you prefer English music.',
       [{"speaker": "Friend", "text": "Ti piace la musica italiana?"}, {"speaker": "You"}],
       ['No, non mi piace per niente. Preferisco la musica inglese.', 'Per niente! Preferisco la musica inglese.'],
       'Non mi piace per niente, then preferisco.', ['per niente'])
L.line('Luca asks about your favourite film. Tell him, and say you like it a lot.',
       [{"speaker": "Luca", "text": "Qual è il tuo film preferito?"}, {"speaker": "You"}],
       ['Il mio film preferito è Casablanca. Mi piace tanto!', 'Casablanca. Mi piace molto.'], 'Il mio film preferito è…', ['preferito'])
L.arrange("Arrange: 'My brother likes concerts, but I prefer the theatre.'", 'A mio fratello piacciono i concerti, ma io preferisco il teatro.',
          ['piace', 'mi'], 'A mio fratello: the concerts are the subject.', ['concerto'])
L.say('Say you hate the cold.', ['odio il freddo'], 'Odiare works like amare.', ['odiare'])
L.say("Say: Paul doesn't like football at all.", ['a paul non piace per niente il calcio', 'il calcio non piace per niente a paul'],
      'A Paul…, and non before piace.', ['per niente'])
L.say('Say there is an exhibition at the museum.', ["c'è una mostra al museo", "al museo c'è una mostra"], "C'è una…", ['mostra'])
L.say('Ask a friend if they like concerts.', ['ti piacciono i concerti'], 'More than one: piacciono.', ['concerto'])

# ── 2. Hobbies & Sport ──
L = lesson(2, 'Hobbies & Sport', 'words')
L.vocab = [
    V('correre', 'to run · corro = I run', 'La mattina corro al parco.'),
    V('camminare', 'to walk', 'Mi piace camminare in montagna.'),
    V('passeggiata', 'walk, stroll · fare una passeggiata = to go for a walk', 'Facciamo una passeggiata in centro?'),
    V('disegnare', 'to draw', 'Tomás disegna molto bene.'),
    V('dipingere', 'to paint (pictures) · dipingo = I paint', 'La domenica dipingo in giardino.'),
    V('quadro', 'painting, picture', 'Questo quadro è molto bello.'),
]
L.meaning('camminare', 'Mi piace camminare in montagna.', ['to walk', 'walking', 'walk'], 'With your feet, slowly.', ['camminare'])
L.meaning('quadro', 'Questo quadro è molto bello.', ['painting', 'picture', 'a painting'], 'You see it in a museum.', ['quadro'])
L.cloze('Complete: In the morning I run in the park.', 'La mattina ___ al parco.', 'corro', 'The io form of correre.', ['correre'])
L.mc('How do you say "Tomás likes drawing"?', 'A Tomás piace disegnare.', ['A Tomás piacciono disegnare.', 'Tomás piace disegnare.'],
     'A + name, and piace with a verb.', ['disegnare'])
L.cloze('Complete: Shall we go for a walk in the centre?', 'Facciamo una ___ in centro?', 'passeggiata', 'A walk.', ['passeggiata'])
L.add('writing', 'fill_blank', 'Complete with the right pronoun: she likes painting.', '___ piace dipingere.', 'Le', [],
      ['She likes painting.'], ['dipingere'])
L.add('writing', 'fill_blank', 'Complete with the right pronoun: he likes running and going to the gym.', '___ piace correre e andare in palestra.', 'Gli', [],
      ['He likes running and going to the gym.'], ['correre'])
L.add('writing', 'fill_blank', 'Complete with the right pronoun: do you (plural) like walking?', '___ piace camminare?', 'Vi', [],
      ['Do you (plural) like walking?'], ['camminare'])
L.mc('Yuki and Aiko both love paintings. How do you say it?', 'Gli piacciono molto i quadri.', ['Gli piace molto i quadri.', 'Le piacciono molto i quadri.'],
     'To them: gli. More than one painting: piacciono.', ['quadro'])
L.line('A friend asks what you like doing at the weekend. You like walking in the mountains and painting.',
       [{"speaker": "Friend", "text": "Che cosa ti piace fare il fine settimana?"}, {"speaker": "You"}],
       ['Mi piace camminare in montagna e dipingere.', 'Mi piace camminare in montagna. E dipingo!'], 'Mi piace + the verbs.', ['camminare', 'dipingere'])
L.line("A friend asks if you like running. You don't much: you prefer going for a walk.",
       [{"speaker": "Friend", "text": "Ti piace correre?"}, {"speaker": "You"}],
       ['Non tanto. Preferisco fare una passeggiata.', 'No, preferisco camminare.'], 'Preferisco + a verb.', ['correre', 'passeggiata'])
L.line("Chloé says she loves swimming and asks about you. You don't like it.",
       [{"speaker": "Chloé", "text": "A me piace tanto nuotare. E a te?"}, {"speaker": "You"}],
       ['A me no. Preferisco correre.', 'A me non piace molto.'], 'A me no.', [])
L.arrange("Arrange: 'Yuki and Aiko like walking in the mountains.'", 'A Yuki e Aiko piace camminare in montagna.', ['piacciono', 'mi'],
          'With a verb: always piace.', ['camminare'])
L.say("Say: I paint, but I don't draw.", ['dipingo, ma non disegno', 'dipingo ma non disegno'], 'Io forms of dipingere and disegnare.', ['dipingere', 'disegnare'])
L.say('Say you like this painting.', ['mi piace questo quadro', 'questo quadro mi piace'], 'One painting: piace.', ['quadro'])
L.say('Suggest to a friend: "Shall we go for a walk in the centre?"', ['facciamo una passeggiata in centro'],
      'Facciamo + the activity.', ['passeggiata'])

# ── 3. Invitations ──
L = lesson(3, 'Invitations', 'words')
L.vocab = [
    V('invitare', 'to invite · invitato = invited; a guest', 'Siete tutti invitati alla festa!'),
    V('invito', 'invitation', "Grazie per l'invito!"),
    V('festa', 'party; holiday', "Sabato c'è una festa da Chloé."),
    V('ti va?', 'do you feel like it? · ti va di + verb? = do you feel like…?', 'Ti va di andare al cinema stasera?'),
    V('purtroppo', 'unfortunately', 'Purtroppo stasera non posso.'),
    V('peccato', 'pity, shame · che peccato! = what a shame!', 'Non vieni? Peccato!'),
    V('forse', 'maybe, perhaps', 'Forse vengo, ma non lo so.'),
    V('magari', "maybe (to suggest something); I wish! · magari un'altra volta = maybe another time", 'Stasera no, ma magari domani?'),
]
L.vocab[3]['phrase'] = True
L.meaning('purtroppo', 'Purtroppo stasera non posso.', ['unfortunately'], 'Bad news is coming.', ['purtroppo'])
L.meaning('ti va', 'Ti va di prendere un gelato?', ['do you feel like', 'do you fancy', 'would you like'], 'A friendly way to invite.', ['ti va?'])
L.mc("A friend invites you to her party on Saturday. You'd love to go. What do you say?", "Sì, volentieri! Grazie per l'invito.",
     ['Purtroppo non posso.', 'Che peccato!'], 'Accept, and thank her.', ['invito'])
L.cloze("Complete: There's a party at Chloé's on Saturday.", "Sabato c'è una ___ da Chloé.", 'festa', 'A party.', ['festa'])
L.cloze("Complete: Unfortunately I can't, I have to work.", '___ non posso, devo lavorare.', 'Purtroppo', 'Unfortunately.', ['purtroppo'])
L.mc("Your friend can't come to your party. What do you say?", 'Che peccato!', ['Volentieri!', "Grazie per l'invito!"], 'What a shame.', ['peccato'])
L.mc("A friend invites you out, but you're not sure you can come. What do you say?", 'Forse vengo, ma non lo so.',
     ['Vengo volentieri!', 'Purtroppo non vengo.'], 'Maybe.', ['forse'])
L.cloze('Complete: Thanks for the invitation!', "Grazie per l'___!", 'invito', 'Invitation.', ['invito'])
L.cloze('Complete: Not tonight, but maybe tomorrow?', 'Stasera no, ma ___ domani?', 'magari', 'Maybe, to suggest something.', ['magari'])
L.line('A friend phones to invite you to the cinema tonight. You would like to go.',
       [{"speaker": "Friend", "text": "Ti va di andare al cinema stasera?"}, {"speaker": "You"}],
       ['Sì, volentieri! A che ora?', 'Sì, perché no?'], 'Accept, and ask the time.', ['ti va?'])
L.line("Emma asks if you're coming to Aiko's party on Saturday. You can't: you work on Saturday.",
       [{"speaker": "Emma", "text": "Vieni alla festa di Aiko sabato?"}, {"speaker": "You"}],
       ['Purtroppo non posso: sabato lavoro.', 'Mi dispiace, sabato devo lavorare.'], 'Purtroppo, then the reason.', ['purtroppo', 'festa'])
L.line("A friend suggests a concert tonight. You can't tonight: suggest another time.",
       [{"speaker": "Friend", "text": "Andiamo a un concerto stasera?"}, {"speaker": "You"}],
       ["Stasera non posso. Magari un'altra volta?", 'Purtroppo stasera no, ma magari domani?'], "Magari un'altra volta.", ['magari'])
L.arrange("Arrange: 'I invite all my friends to the party.'", 'Invito tutti i miei amici alla festa.', ['mie', 'inviti'],
          'Tutti i miei amici.', ['invitare', 'festa'])
L.say('Ask a friend if they feel like coming to dinner on Friday.', ['ti va di venire a cena venerdì', 'venerdì ti va di venire a cena'],
      'Ti va di + the infinitive.', ['ti va?'])
L.say("Say: Maybe another time.", ["magari un'altra volta", "forse un'altra volta"], "Un'altra volta.", ['magari'])
L.say('Say: What a shame!', ['che peccato', 'peccato'], 'Che…', ['peccato'])

# ── 4. When and Where ──
L = lesson(4, 'When and Where', 'words')
L.vocab = [
    V('appuntamento', 'appointment; arrangement to meet · ho un appuntamento = I am meeting someone', 'Ho un appuntamento con Luca alle sette.'),
    V('occupato', 'busy; taken (a seat, a phone line)', 'Domani sono occupato tutto il giorno.'),
    V('impegno', 'commitment · ho un impegno = I have something on', 'Sabato non posso, ho un impegno.'),
    V('verso', 'around (a time); towards · verso le otto = around eight', 'Arrivo verso le otto.'),
    V('spettacolo', 'show, performance', 'Lo spettacolo comincia alle nove.'),
    V('puntuale', 'on time, punctual', 'Paul non è mai puntuale!'),
]
L.meaning('impegno', 'Sabato non posso, ho un impegno.', ['commitment', 'something on', 'plans', 'engagement'], 'A reason to say no.', ['impegno'])
L.meaning('puntuale', 'Paul non è mai puntuale!', ['on time', 'punctual'], 'Paul is always late.', ['puntuale'])
L.cloze('Complete: I am meeting Luca at seven.', 'Ho un ___ con Luca alle sette.', 'appuntamento', 'An arrangement to meet.', ['appuntamento'])
L.mc("Emma is busy on Friday. How does she say it?", 'Venerdì sono occupata.', ['Venerdì sono occupato.', 'Venerdì sono libera.'],
     'Occupato agrees with Emma.', ['occupato'])
L.cloze('Complete: The show starts at nine.', 'Lo ___ comincia alle nove.', 'spettacolo', 'A show.', ['spettacolo'])
L.mc('A friend says: "Facciamo verso le otto?" What does it mean?', 'Shall we say around eight?',
     ['Shall we say before eight?', 'Shall we say after eight?'], 'Verso: around.', ['verso'])
L.cloze('Complete: I arrive around eight.', 'Arrivo ___ le otto.', 'verso', 'Around.', ['verso'])
L.line('A friend asks when you are free this week. You are free on Thursday evening.',
       [{"speaker": "Friend", "text": "Quando sei libero questa settimana?"}, {"speaker": "You"}],
       ['Sono libero giovedì sera.', 'Giovedì sera sono libera.'], 'Libero or libera, then the day.', [])
L.line('A friend suggests Saturday at nine and asks where. Suggest in front of the cinema.',
       [{"speaker": "Friend", "text": "Allora sabato alle nove. Dove?"}, {"speaker": "You"}],
       ['Davanti al cinema.', 'Facciamo davanti al cinema?'], 'Davanti a + the place.', [])
L.line('A friend asks if you can come for a coffee on Monday morning. You have an appointment at the bank.',
       [{"speaker": "Friend", "text": "Lunedì mattina prendiamo un caffè?"}, {"speaker": "You"}],
       ['Lunedì mattina non posso: ho un appuntamento in banca.', 'Mi dispiace, lunedì ho un appuntamento.'], 'Ho un appuntamento…', ['appuntamento'])
L.fix('Fix the mistake. Emma is talking about herself.', 'Stasera sono occupato.', ['Stasera sono occupata.'], 'Emma is a woman.', ['occupato'])
L.fix('Fix the mistake.', 'Ti va di vieni alla festa?', ['Ti va di venire alla festa?'], 'After di: the infinitive.', ['ti va?'])
L.arrange("Arrange: 'Paul is never on time!'", 'Paul non è mai puntuale!', ['sempre', 'sono'], 'Non … mai.', ['puntuale'])
L.say('Say you have something on tomorrow evening.', ['domani sera ho un impegno', 'ho un impegno domani sera'], 'Ho un…', ['impegno'])
L.say('Suggest half past seven, in front of the theatre: "Shall we say half past seven, in front of the theatre?"',
      ['facciamo alle sette e mezza davanti al teatro', 'facciamo alle sette e mezza, davanti al teatro'], 'Facciamo alle…', [])

# ── 5. Yes, No, Maybe (practice) ──
L = lesson(5, 'Yes, No, Maybe', 'practice')
L.line("Luca loves football and asks about you. You don't like it.",
       [{"speaker": "Luca", "text": "Mi piace tanto il calcio. E a te?"}, {"speaker": "You"}],
       ['A me no. Preferisco il tennis.', 'A me non piace per niente!'], 'A me no.', ['per niente'])
L.line("Emma doesn't like the cold. Neither do you.",
       [{"speaker": "Emma", "text": "Non mi piace il freddo."}, {"speaker": "You"}],
       ['Neanche a me!', 'Neanche a me. Preferisco il caldo.'], 'Agreeing with a negative.', [])
L.line("Chloé invites you to a party at the bar on Saturday. Accept, and ask what time it starts.",
       [{"speaker": "Chloé", "text": "Sabato c'è una festa al bar. Ti va di venire?"}, {"speaker": "You"}],
       ['Sì, volentieri! A che ora?', 'Volentieri! A che ora comincia?'], 'Volentieri, then a che ora.', ['festa'])
L.line('Chloé says it starts at nine and asks what you are bringing. You bring a bottle of wine.',
       [{"speaker": "Chloé", "text": "Alle nove. Che cosa porti?"}, {"speaker": "You"}],
       ['Porto una bottiglia di vino.', 'Una bottiglia di vino!'], 'Porto…', [])
L.line("Tomás invites you to an exhibition on Sunday. You have something on: suggest Saturday instead.",
       [{"speaker": "Tomás", "text": "Andiamo alla mostra domenica?"}, {"speaker": "You"}],
       ['Domenica ho un impegno. Magari sabato?', 'Purtroppo domenica sono occupato. Sabato?'], 'Ho un impegno, then another day.', ['impegno', 'mostra'])
L.line('You meet Yuki. Invite her to a concert on Friday.',
       [{"speaker": "Yuki", "text": "Ciao! Come va?"}, {"speaker": "You"}],
       ['Bene! Ti va di venire a un concerto venerdì?', "Bene, grazie. Venerdì c'è un concerto: vieni?"], 'Ti va di…?', ['concerto', 'ti va?'])
L.line("Yuki can't come. Say it's a shame, and suggest another time.",
       [{"speaker": "Yuki", "text": "Purtroppo venerdì lavoro."}, {"speaker": "You"}],
       ["Che peccato! Magari un'altra volta.", "Peccato! Allora un'altra volta."], "Che peccato, then un'altra volta.", ['peccato'])
L.line('Your neighbour, Signora Bianchi, has two tickets for the theatre on Saturday. Accept politely.',
       [{"speaker": "Signora Bianchi", "text": "Le piace il teatro? Ho due biglietti per sabato."}, {"speaker": "You"}],
       ["Sì, molto! Grazie per l'invito.", 'Volentieri, grazie! Sabato sono libero.'], 'Thank her for the invitation.', ['invito'])
L.mc('Paul asks: "Facciamo alle otto?" Eight is no good for you, but nine is fine. What do you say?', 'Alle otto no, ma alle nove sì.',
     ['Alle otto sì, ma alle nove no.', 'Alle otto e alle nove no.'], 'No to eight, yes to nine.', [])
L.line("Paul asks if you're coming to the party. You aren't sure yet.",
       [{"speaker": "Paul", "text": "Vieni alla festa stasera?"}, {"speaker": "You"}],
       ['Forse. Non lo so ancora.', 'Forse vengo, ma non lo so.'], 'Forse.', ['forse'])
L.fix('Fix the mistake.', 'Mi piace i concerti.', ['Mi piacciono i concerti.'], 'More than one concert.', ['concerto'])
L.fix('Fix the mistake.', 'Paul piace ballare.', ['A Paul piace ballare.'], 'With a name: a.', [])
L.say('Say: We like going to the theatre.', ['ci piace andare a teatro'], 'To us: ci.', [])
L.say('Ask your teacher, formally, if she likes painting.', ['le piace dipingere'], 'For Lei: Le.', ['dipingere'])

# ── 6. A Party at Aiko's (reading: an invitation and the replies) ──
L = lesson(6, "A Party at Aiko's", 'reading')
L.reading = {"title": "Festa da Aiko e Yuki!", "paragraphs": [
    "Ciao a tutti!",
    "Sabato prossimo è il mio compleanno, e io e Yuki facciamo una festa a casa nostra. Siete tutti invitati: la classe, Giulia, Luca e Chloé!",
    "Quando · sabato, dalle otto di sera",
    "Dove · via dei Servi 30, vicino al negozio di Rita",
    "Yuki cucina per tutti. Se volete, potete portare una bottiglia di vino o un dolce. C'è anche la musica: a Yuki non piace ballare, ma a me sì!",
    "Chi viene? Aspetto i vostri messaggi!",
    "Aiko",
    "Tomás: Grazie per l'invito! Vengo volentieri. Porto un dolce spagnolo.",
    "Emma: Che bello! Vengo anch'io, con un regalo. Ma è una sorpresa!",
    "Giulia: Grazie, Aiko! Purtroppo sabato sera ho un altro impegno, ma forse arrivo verso le dieci.",
    "Chloé: Sabato lavoro al bar dalle otto alle tre, poi sono libera. Vengo! Che cosa porto?",
    "Aiko: Niente, Chloé! Sei invitata: non devi portare niente.",
    "Luca: Vengo anch'io! Aiko, ti piace il calcio? Domenica c'è una partita e ho due biglietti: è il mio regalo!",
    "Aiko: Il calcio? Non mi piace per niente! Ma a Yuki sì…",
    "Yuki: Luca, vengo io! Grazie!",
    "Paul: Ciao Aiko! Sabato lavoro in ospedale, ma dopo vengo. Arrivo alle nove, puntuale!",
    "Aiko: Paul puntuale? Questo è un bel regalo!",
]}
L.vocab = [
    V('sorpresa', 'surprise', 'Il regalo è una sorpresa!'),
]
L.mc('Why is Aiko having a party?', "It's her birthday", ["It's Yuki's birthday", "It's the end of the course"], "'È il mio compleanno.'", ['festa'])
L.mc('Who is cooking?', 'Yuki', ['Aiko', 'Chloé'], "'Yuki cucina per tutti.'", [])
L.mc('True or false: Yuki and Aiko both like dancing.', 'False', ['True'], "'A Yuki non piace ballare, ma a me sì!'", [])
L.mc('What is Tomás bringing?', 'A Spanish dessert', ['A bottle of wine', 'A present'], "'Porto un dolce spagnolo.'", [])
L.mc('What does Emma say about her present?', "It's a surprise", ["It's a bottle of wine", "She doesn't have one"], "'È una sorpresa!'", ['sorpresa'])
L.mc('Why is Giulia arriving late?', 'She has something else on that evening', ['She works at the bar', 'She works at the hospital'],
     "'Ho un altro impegno.'", ['impegno'])
L.mc('When is Chloé free on Saturday?', 'After three', ['From eight in the evening', 'All day'], "'Dalle otto alle tre, poi sono libera.'", [])
L.mc("What is Luca's present?", 'Two tickets for a football match', ['A Spanish dessert', 'Two tickets for a concert'], "'Ho due biglietti.'", [])
L.mc('Who goes to the match with Luca?', 'Yuki', ['Aiko', 'Paul'], "'Luca, vengo io!'", [])
L.mc('Why does Aiko call Paul being on time "a nice present"?', "Because Paul is never on time", ["Because Paul doesn't come", 'Because Paul brings a present'],
     "Think of Paul, always late.", ['puntuale'])
L.cloze('Complete from the text: you are all invited.', 'Siete tutti ___.', 'invitati', 'Invited: more than one person.', ['invitare'])
L.cloze("Complete Emma's message: it's a surprise!", 'Ma è una ___!', 'sorpresa', 'A surprise.', ['sorpresa'])
L.answer('A che ora arriva Paul?', ['alle nove', 'arriva alle nove', 'Paul arriva alle nove'], "Read Paul's message.", [])
L.answer('A Yuki piace il calcio?', ['sì', 'sì, le piace', 'sì, a Yuki piace il calcio'], "Read Aiko's answer to Luca.", [])

# ── 7. Tomás's Profile (reading: a profile and messages) ──
L = lesson(7, "Tomás's Profile", 'reading')
L.reading = {"title": "Amici a Firenze", "paragraphs": [
    "Tomás · spagnolo, di Madrid, a Firenze per studiare l'italiano",
    "Ciao! Sono un po' timido, ma mi piace conoscere persone nuove, soprattutto in italiano.",
    "Che cosa mi piace · L'arte, i musei e le mostre. Mi piacciono molto i quadri: disegno ogni giorno e la domenica dipingo. Mi piace anche camminare: il sabato faccio lunghe passeggiate in campagna.",
    "Che cosa non mi piace · Le feste con tante persone: preferisco i gruppi piccoli. Non mi piace per niente il calcio, e odio la palestra!",
    "Che cosa cerco · Amici per andare alle mostre, o per una passeggiata e un caffè.",
    "Francesca: Ciao Tomás! Mi chiamo Francesca e sono di Firenze. Anche a me piace dipingere! Sabato prossimo al museo c'è una mostra di quadri, ed è gratis per gli studenti. Ti va di venire?",
    "Tomás: Ciao Francesca! Volentieri! Ma sabato mattina studio con Yuki. Sabato pomeriggio sei libera?",
    "Francesca: Sabato pomeriggio no, purtroppo: ho un impegno. Domenica?",
    "Tomás: Domenica va bene. A che ora?",
    "Francesca: Facciamo alle dieci, davanti al museo? Poi, se ti va, facciamo una passeggiata e prendiamo un caffè.",
    "Tomás: Perfetto! Io sono basso, con la barba e gli occhiali. E tu?",
    "Francesca: Anch'io ho gli occhiali! E ho un cane piccolo e nero, Pepe. Ti piacciono i cani?",
    "Tomás: Sì, molto. Allora a domenica!",
]}
L.vocab = [
    V('soprattutto', 'above all, especially', 'Mi piace la musica, soprattutto la musica italiana.'),
    V('gruppo', 'group', 'Preferisco i gruppi piccoli.'),
    V('gratis', 'free (no cost)', 'Per gli studenti il museo è gratis.'),
]
L.mc("What does Tomás like?", 'Art, museums and walking', ['Football and the gym', 'Big parties'], "Read 'Che cosa mi piace'.", [])
L.mc('What does he do on Sundays?', 'He paints', ['He runs', 'He goes to the gym'], "'La domenica dipingo.'", ['dipingere'])
L.mc("Why doesn't Tomás like big parties?", 'He prefers small groups', ['He hates music', 'He works in the evening'], "'Preferisco i gruppi piccoli.'", ['gruppo'])
L.mc('True or false: Tomás hates the gym.', 'True', ['False'], "'Odio la palestra!'", ['odiare'])
L.mc('What does Francesca invite Tomás to?', 'An exhibition of paintings', ['A football match', 'A party'], "'Una mostra di quadri.'", ['mostra'])
L.mc('How much does it cost for students?', 'Nothing', ['Ten euros', 'Half price'], "'È gratis per gli studenti.'", ['gratis'])
L.mc('Why not Saturday afternoon?', 'Francesca has something on', ['Tomás studies with Yuki', 'The museum is closed'], "'Ho un impegno.'", ['impegno'])
L.mc('Where and when do they meet?', 'On Sunday at ten, in front of the museum', ['On Saturday at ten, at the bar', 'On Sunday at ten, at the park'],
     "'Facciamo alle dieci, davanti al museo?'", [])
L.mc('What will they do after the exhibition?', 'Go for a walk and have a coffee', ['Paint together', 'Go to a party'], "'Facciamo una passeggiata e prendiamo un caffè.'", ['passeggiata'])
L.cloze('Complete from the text: I like meeting new people, above all in Italian.', 'Mi piace conoscere persone nuove, ___ in italiano.',
        'soprattutto', 'Above all.', ['soprattutto'])
L.cloze('Complete from the text: I prefer small groups.', 'Preferisco i ___ piccoli.', 'gruppi', 'Groups: the plural of gruppo.', ['gruppo'])
L.cloze('Complete from the text: it is free for students.', 'È ___ per gli studenti.', 'gratis', 'Free: no cost.', ['gratis'])
L.answer('Che cosa non piace a Tomás?', ['il calcio', 'le feste con tante persone', 'il calcio e la palestra'], "Read 'Che cosa non mi piace'.", [])
L.answer('Come si chiama il cane di Francesca?', ['Pepe', 'si chiama Pepe'], "Read Francesca's last message.", [])

# ── 8–9. Writing ──
L = lesson(8, 'A Reply to Luca', 'writing')
L.reading = {"title": "Un messaggio di Luca", "paragraphs": [
    "Ciao! Venerdì sera c'è un concerto in piazza della Signoria, alle nove. È un gruppo di Bologna, molto bravo. Ho due biglietti: ti va di venire?",
    "Ti piace la musica italiana? Dopo il concerto, se vuoi, mangiamo una pizza.",
    "Luca",
]}
L.write("Luca has invited you to a concert. Reply to him: thank him, say whether you like Italian music, explain that you can't come on Friday, and suggest another day and time for the pizza.",
        "Ciao Luca! Grazie per l'invito. Mi piace tanto la musica italiana, ma purtroppo venerdì sera non posso: ho un impegno di lavoro. Che peccato! Ti va di mangiare una pizza sabato? Sono libero dalle sette. Facciamo alle otto, davanti alla pizzeria in piazza? A presto!",
        "Grazie per l'invito, then purtroppo and a reason. Suggest a time with facciamo or ti va di.", ['invito', 'purtroppo', 'ti va?'])

L = lesson(9, 'Your Profile', 'writing')
L.write("Write your own profile for Amici a Firenze: say what you like and don't like, what you do in your free time, and what you are looking for.",
        "Ciao! Mi chiamo Ben, sono inglese e ho trentadue anni. Mi piace molto la musica, soprattutto i concerti, e mi piace cucinare per gli amici. Il fine settimana corro al parco o faccio una passeggiata in centro. Non mi piace per niente la televisione, e odio il freddo! Cerco amici per un caffè, un concerto o una pizza, e per parlare italiano.",
        'Mi piace with one thing or a verb, mi piacciono with more than one. Non mi piace per niente for a strong no.', ['per niente', 'soprattutto', 'odiare'])

# ── 10. Speaking ──
L = lesson(10, 'Say It Out Loud', 'speaking')
L.read('Mi piacciono i concerti.', 'Piacciono: a long ch sound, as in church.', ['concerto'])
L.read('Non mi piace per niente!', 'Piace: the c is soft before e.', ['per niente'])
L.read('Anche a me! Neanche a me.', 'Anche: the ch is a hard k.', [])
L.read('Ti va di andare al cinema stasera?', 'Cinema: a soft c.', ['ti va?'])
L.read("Grazie per l'invito! Vengo volentieri.", 'Volentieri: the stress falls on -tie-.', ['invito'])
L.read("Purtroppo stasera non posso. Che peccato!", 'Purtroppo, peccato: hold the double consonants.', ['purtroppo', 'peccato'])
L.read('Ho un appuntamento alle sette e mezza.', 'Appuntamento: two p, two t.', ['appuntamento'])
L.read('Facciamo una passeggiata?', 'Passeggiata: two s, two g.', ['passeggiata'])

for L in LESSONS:
    L.dump()
print('\n'.join(L.meta(L.n) for L in LESSONS))
