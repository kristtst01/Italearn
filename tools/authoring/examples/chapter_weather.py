"""Chapter 'Weather & Seasons' (unit-19), after the Time & dates unit and the chapter Getting Around.

Available: units 1–11 (fare/stare and the other irregular verbs, prepositions with the article,
question words, non … più, adjectives, days, months, seasons, dates, the clock), chapters 1–12.
Not yet: possessives (no 'la mia stagione preferita'), piacere (no 'mi piace l'estate': use
preferire or amare), reflexives, the imperative (no 'porta l'ombrello'), the past.
Known before this chapter: fa caldo / fa freddo (chapter 4), ombrello (chapter 5), montagna and
campagna (Work & Study), auguri and buone vacanze (chapter 1), the seasons, the months and al mare
(Time & dates). Cast: Giulia teaches Italian in Florence; Emma (English student), Chloé (French,
works at a bar), Paul (English doctor), Tomás, Yuki and Aiko.
"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from chapterlib import Lesson, V

U = 'unit-19'
D = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'out', U)
os.makedirs(D, exist_ok=True)
LESSONS = []
def lesson(n, name, role):
    L = Lesson(U, D, n, name, role); LESSONS.append(L); return L

# ── 1. What's the Weather Like? ──
L = lesson(1, "What's the Weather Like?", 'words')
L.vocab = [
    {**V('che tempo fa?', "what's the weather like? · il tempo = the weather (and time) · fa bel tempo = the weather's nice", 'Che tempo fa a Londra?'), "phrase": True},
    V('sole', 'sun · c\'è il sole = it\'s sunny', 'Oggi c\'è il sole.'),
    V('piovere', 'to rain · piove = it\'s raining, it rains', 'A Londra piove spesso.'),
    V('pioggia', 'rain', 'Non esco con questa pioggia.'),
    V('nevicare', 'to snow · nevica = it\'s snowing, it snows', 'In montagna nevica.'),
    V('neve', 'snow', 'C\'è la neve in montagna.'),
    V('vento', 'wind · c\'è vento = it\'s windy', 'Oggi c\'è molto vento.'),
    V('nuvola', 'cloud', 'Nel cielo non c\'è una nuvola.'),
    V('nuvoloso', 'cloudy', 'Oggi è nuvoloso, ma non piove.'),
    V('cielo', 'sky', 'Il cielo è azzurro.'),
    V('fresco', 'cool, fresh · fa fresco = it\'s cool', 'La sera fa fresco.'),
    V('grado', 'degree · ci sono venti gradi = it\'s twenty degrees', 'Oggi ci sono trenta gradi!'),
]
L.meaning('piove', 'Oggi piove.', ["it's raining", 'it is raining', 'it rains'], 'From piovere.', ['piovere'])
L.meaning('nuvoloso', 'Oggi è nuvoloso, ma non piove.', ['cloudy'], 'From nuvola.', ['nuvoloso'])
L.meaning('fresco', 'La sera fa fresco.', ['cool', 'fresh'], 'Not hot, not cold.', ['fresco'])
L.mc("You look out of the window: a blue sky, no clouds. A friend asks 'Che tempo fa?'", "C'è il sole.", ["C'è vento.", 'Piove.', 'Nevica.'],
     'Blue sky.', ['sole'], 'Che tempo fa?')
L.cloze('Complete: It\'s raining today: I\'m taking the umbrella.', "Oggi ___: prendo l'ombrello.", 'piove', 'From piovere.', ['piovere'])
L.cloze('Complete: There\'s snow in the mountains.', "In montagna c'è la ___.", 'neve', 'Snow.', ['neve'])
L.mc('It is July in Florence, and it is midday. What is the weather most likely to be?', 'Fa molto caldo.', ['Nevica.', 'Fa molto freddo.', 'Fa fresco.'],
     'Summer in Florence.', [])
L.cloze("Complete: It's cold today and it's snowing.", 'Oggi ___ freddo e nevica.', 'fa', 'The weather uses fare.', ['nevicare'])
L.cloze("Complete: It's thirty degrees!", 'Ci sono trenta ___!', 'gradi', 'Degrees, plural.', ['grado'])
L.cloze('Complete: The sky is blue.', 'Il ___ è azzurro.', 'cielo', 'Sky.', ['cielo'])
L.line('A friend in London phones and asks about the weather in Florence. It is sunny and hot.',
       [{"speaker": "Friend", "text": "Che tempo fa lì a Firenze?"}, {"speaker": "You"}],
       ["C'è il sole e fa caldo.", "Bel tempo: c'è il sole e fa caldo!"], "C'è il sole; fa caldo.", ['che tempo fa?', 'sole'])
L.arrange("Arrange: 'Today it's raining and it's very windy.'", "Oggi piove e c'è molto vento.", ['fa', 'molta'], 'Vento is masculine.', ['piovere', 'vento'])
L.say("Say it's snowing in the mountains.", ['in montagna nevica', 'nevica in montagna'], 'From nevicare.', ['nevicare'])
L.say('Say there are a lot of clouds today.', ['oggi ci sono molte nuvole', 'ci sono molte nuvole oggi'], 'Nuvola is feminine.', ['nuvola'])
L.say('Ask what the weather is like in Rome.', ['che tempo fa a roma'], 'Che tempo fa…?', ['che tempo fa?'])

# ── 2. Seasons ──
L = lesson(2, 'Seasons', 'words')
L.vocab = [
    V('stagione', 'season · le stagioni (plural)', "L'estate è una bella stagione."),
    V('fiore', 'flower · i fiori (plural)', 'In primavera ci sono molti fiori.'),
    V('albero', 'tree', 'Davanti a casa c\'è un albero grande.'),
    V('foglia', 'leaf · le foglie (plural)', 'In autunno le foglie sono gialle e rosse.'),
    V('spiaggia', 'beach · in spiaggia = on the beach', 'Ad agosto la spiaggia è piena di gente.'),
    V('vacanza', 'holiday · in vacanza = on holiday', 'Ad agosto sono in vacanza.'),
    V('nuotare', 'to swim', 'Al mare nuoto ogni mattina.'),
    V('sciare', 'to ski · scio, scii, scia', "D'inverno scio in montagna."),
]
L.vocab[4]['example'] = 'Ad agosto vado in spiaggia ogni giorno.'
L.meaning('stagione', 'Ci sono quattro stagioni.', ['season', 'seasons'], 'Primavera, estate, autunno, inverno.', ['stagione'])
L.meaning('spiaggia', 'Ad agosto vado in spiaggia ogni giorno.', ['beach', 'the beach'], 'At the seaside.', ['spiaggia'])
L.cloze('Complete: In spring there are flowers in the gardens.', 'In primavera ci sono i ___ in giardino.', 'fiori', 'Fiore, plural.', ['fiore'])
L.mc("Which season is it? 'Fa molto caldo, le giornate sono lunghe e molte persone vanno al mare.'", "L'estate", ["L'inverno", "L'autunno", 'La primavera'],
     'Hot, long days, the seaside.', [])
L.cloze('Complete: In autumn the leaves of the trees are yellow and red.', 'In autunno le ___ degli alberi sono gialle e rosse.', 'foglie', 'Foglia, plural.', ['foglia', 'albero'])
L.cloze("Complete: In winter I go to the mountains to ski.", 'In inverno vado in montagna a ___.', 'sciare', 'Andare a + the infinitive.', ['sciare'])
L.mc("A colleague asks 'Quale stagione preferisci?' Summer is your favourite.", "Preferisco l'estate.", ["Preferisci l'estate.", "Preferisce l'estate.", "Preferiamo l'estate."],
     'The io form of preferire.', ['stagione'], 'Quale stagione preferisci?')
L.cloze('Complete: In summer I swim in the sea every day.', "D'estate ___ al mare ogni giorno.", 'nuoto', 'The io form of nuotare.', ['nuotare'])
L.line('A friend asks where you are going on holiday in August. You are going to the seaside.',
       [{"speaker": "Friend", "text": "Dove vai in vacanza ad agosto?"}, {"speaker": "You"}],
       ['Vado al mare.', 'Al mare, in Sicilia!'], 'Al mare.', ['vacanza'])
L.arrange("Arrange: 'In front of the house there is a tree with flowers.'", "Davanti a casa c'è un albero con i fiori.", ['foglia', 'sono'], "Davanti a casa c'è…", ['fiore', 'albero'])
L.say('Say you are on holiday.', ['sono in vacanza'], 'In vacanza.', ['vacanza'])
L.say("Say that in winter it's cold and it snows.", ['in inverno fa freddo e nevica', "d'inverno fa freddo e nevica"], 'Fa freddo; nevica.', ['nevicare'])
L.say('Ask a friend which season they prefer.', ['quale stagione preferisci', 'che stagione preferisci'], 'Quale + noun; preferire.', ['stagione'])
L.say('Say you are on the beach.', ['sono in spiaggia'], 'In spiaggia.', ['spiaggia'])

# ── 3. Holidays & Wishes ──
L = lesson(3, 'Holidays & Wishes', 'words')
L.vocab = [
    V('Natale', 'Christmas · buon Natale! = happy Christmas!', 'Natale è il venticinque dicembre.'),
    V('Capodanno', "New Year: the 1st of January, and the celebrations the night before · buon anno! = happy New Year!", 'Capodanno è il primo gennaio.'),
    V('Pasqua', 'Easter · buona Pasqua! = happy Easter! · l\'uovo di Pasqua = Easter egg', 'Pasqua è a marzo o ad aprile.'),
    V('Ferragosto', 'the 15th of August, a summer holiday in Italy', 'A Ferragosto molti italiani sono al mare.'),
    V('augurio', 'a wish · auguri!, tanti auguri! = best wishes! · fare gli auguri = to send your best wishes', 'Telefono a Giulia per fare gli auguri.'),
    V('festeggiare', 'to celebrate', 'Domani festeggiamo il compleanno di Emma.'),
]
L.meaning('Capodanno', 'Capodanno è il primo gennaio.', ["new year's day", 'new year', "new year's"], 'The first of January.', ['Capodanno'])
L.meaning('festeggiare', 'Domani festeggiamo il compleanno di Emma.', ['to celebrate', 'celebrate'], 'What you do on a birthday.', ['festeggiare'])
L.cloze("Complete: Christmas is on the twenty-fifth of December.", 'Natale è il ___ dicembre.', ['venticinque', '25'], 'The number, in words.', ['Natale'])
L.cloze("Complete: New Year's Day is the first of January.", 'Capodanno è il ___ gennaio.', 'primo', 'The first of the month.', ['Capodanno'])
L.mc("It's the 23rd of December. A colleague is leaving work for the holidays. What do you say?", 'Buon Natale!', ['Buona Pasqua!', 'Buon appetito!', 'Buon compleanno!'],
     'The holiday in two days.', ['Natale'])
L.mc('Your friend says it is her birthday today. What do you say?', 'Tanti auguri!', ['Buon Natale!', 'Buona Pasqua!', 'Buon anno!'],
     'For a birthday.', ['augurio'])
L.cloze('Complete: The children eat the Easter egg.', "I bambini mangiano l'uovo di ___.", 'Pasqua', 'Easter.', ['Pasqua'])
L.mc('When is Easter?', 'A marzo o ad aprile', ['Il venticinque dicembre', 'Il primo gennaio', 'Il quindici agosto'], 'It changes every year.', ['Pasqua'])
L.cloze('Complete: Ferragosto is the fifteenth of August.', 'Ferragosto è il ___ agosto.', ['quindici', '15'], 'The number, in words.', ['Ferragosto'])
L.line("On the 24th of December your neighbour, Signora Bianchi, says goodbye on the stairs. You use Lei with her.",
       [{"speaker": "Signora Bianchi", "text": "Buon Natale!"}, {"speaker": "You"}],
       ['Grazie, buon Natale anche a Lei!', 'Auguri anche a Lei!'], 'Anche a Lei.', ['Natale', 'augurio'])
L.line("A friend asks where you are celebrating New Year's Day. In Rome, with friends.",
       [{"speaker": "Friend", "text": "Dove festeggi Capodanno?"}, {"speaker": "You"}],
       ['A Roma, con gli amici.', 'Festeggio a Roma, con gli amici.'], 'Festeggio, or just the place.', ['festeggiare'])
L.arrange("Arrange: 'In December we put up the Christmas tree.'", "A dicembre facciamo l'albero di Natale.", ['fiore', 'fanno'], "Fare l'albero: to put up the tree.", ['albero', 'Natale'])
L.say('Say: happy Easter!', ['buona pasqua'], 'Pasqua is feminine.', ['Pasqua'])
L.say('Say: best wishes for your birthday! (to a friend)', ['tanti auguri di buon compleanno', 'auguri di buon compleanno'], 'Auguri di + the wish.', ['augurio'])

# ── 4. Small Talk (practice) ──
L = lesson(4, 'Small Talk', 'practice')
L.line('You meet your neighbour at the door on a hot afternoon in July.',
       [{"speaker": "Neighbour", "text": "Che caldo oggi!"}, {"speaker": "You"}],
       ['Sì, fa molto caldo!', 'Sì, ci sono trentacinque gradi!'], 'Agree: fa caldo.', ['grado'])
L.line('A friend wants to go to the seaside tomorrow. You saw that tomorrow it will rain.',
       [{"speaker": "Friend", "text": "Domani andiamo al mare?"}, {"speaker": "You"}],
       ['No, domani piove. Andiamo domenica?', 'Domani piove! Andiamo un altro giorno?'], 'The present works for tomorrow: piove.', ['piovere'])
L.line('A classmate asks the date. Today is the 3rd of March.',
       [{"speaker": "Classmate", "text": "Quanti ne abbiamo oggi?"}, {"speaker": "You"}],
       ['Oggi è il tre marzo.', 'È il tre.'], 'Il + the number + the month.', [])
L.line("A friend asks when Emma's birthday is. It is the 12th of April.",
       [{"speaker": "Friend", "text": "Quando è il compleanno di Emma?"}, {"speaker": "You"}],
       ['È il dodici aprile.', 'Il dodici aprile.'], 'Il + the number + the month.', [])
L.line('A friend asks which season you prefer. Spring, because there are flowers and it is not hot.',
       [{"speaker": "Friend", "text": "Quale stagione preferisci?"}, {"speaker": "You"}],
       ['Preferisco la primavera, perché ci sono i fiori e non fa caldo.', 'La primavera: ci sono i fiori e non fa caldo.'], 'Preferisco… perché…', ['stagione', 'fiore'])
L.line('In July, a friend invites you to the mountains, where it is cooler.',
       [{"speaker": "Friend", "text": "Vieni in montagna con noi? Lì fa fresco."}, {"speaker": "You"}],
       ['Volentieri! Qui fa troppo caldo.', 'Sì, volentieri!'], 'Volentieri.', ['fresco'])
L.line('A colleague asks where you are going for Easter. To the seaside, with friends.',
       [{"speaker": "Colleague", "text": "Dove vai a Pasqua?"}, {"speaker": "You"}],
       ['Vado al mare con gli amici.', 'Al mare, con gli amici.'], 'Andare + al mare.', ['Pasqua'])
L.line('A friend phones from London and complains about the weather there. You say in Florence it is sunny.',
       [{"speaker": "Friend", "text": "Qui a Londra piove da una settimana! E lì?"}, {"speaker": "You"}],
       ["Qui c'è il sole!", "Qui fa bel tempo: c'è il sole e ci sono venti gradi."], "C'è il sole.", ['sole'])
L.line('On the 31st of December a friend leaves your flat after dinner.',
       [{"speaker": "Friend", "text": "Ciao, e buon anno!"}, {"speaker": "You"}],
       ['Buon anno anche a te!', 'Grazie, auguri!'], 'Anche a te.', ['augurio'])
L.mc("Someone says 'Che tempo fa da voi?' What are they asking?", "What's the weather like where you are?", ['What time is it where you are?', 'How long have you been there?'],
     'Da voi: at your place.', ['che tempo fa?'], 'Che tempo fa da voi?')
L.say("Say it isn't cold any more.", ['non fa più freddo'], 'Non … più.', [])
L.arrange("Arrange: 'In November it rains a lot in Florence.'", 'A novembre piove molto a Firenze.', ['pioggia', 'molta'], 'Piove molto.', ['piovere'])

# ── 5. The Forecast (reading: a forecast and a scene) ──
L = lesson(5, 'The Forecast', 'reading')
L.reading = {"title": "Le previsioni del tempo", "paragraphs": [
    "Toscana · sabato 6 e domenica 7 giugno",
    "Firenze · nuvole la mattina, pioggia il pomeriggio · da 16 a 22 gradi",
    "Pisa · pioggia e vento tutto il giorno · da 17 a 21 gradi",
    "Viareggio · pioggia la mattina, sole il pomeriggio · da 18 a 24 gradi",
    "Abetone · nebbia e temporali · da 7 a 13 gradi",
    "Domenica · sole in tutta la Toscana · da 20 a 29 gradi",
    "Venerdì sera Emma legge le previsioni e telefona a Chloé.",
    "Emma: Chloé, sabato piove a Firenze e a Pisa! Ma a Viareggio il pomeriggio c'è il sole. Andiamo al mare dopo pranzo?",
    "Chloé: Sabato lavoro al bar dalle otto alle tre. E domenica?",
    "Emma: Domenica c'è il sole in tutta la Toscana, e fa caldo: ventinove gradi!",
    "Chloé: Perfetto. Ma con il sole e il caldo, tutta Firenze va al mare. Prendiamo il treno delle otto?",
    "Emma: Alle otto? Di domenica? Va bene…",
    "Domenica alle dieci Emma e Chloé sono in spiaggia a Viareggio. Il cielo è azzurro, il mare è bello e in spiaggia ci sono già molte persone. Nuotano, mangiano un panino e dormono un po' al sole.",
    "Alle quattro arriva una grande nuvola nera. Poi un'altra. E comincia a piovere.",
    "Emma: Ma… le previsioni!",
    "Chloé: Le previsioni dicono «sole». Il cielo dice «pioggia». Andiamo al bar: con la pioggia un gelato è sempre buono!",
]}
L.vocab = [
    V('previsione', 'forecast · le previsioni del tempo = the weather forecast', 'Che cosa dicono le previsioni per domani?'),
    V('nebbia', 'fog', 'La mattina c\'è la nebbia.'),
    V('temporale', 'thunderstorm', 'Stasera arriva un temporale.'),
    V('già', 'already', 'Sono le otto e Paul è già al lavoro.'),
]
L.mc('What is the weather like in Florence on Saturday?', 'Cloudy in the morning, rain in the afternoon', ['Rain and wind all day', 'Sunny all day', 'Fog and thunderstorms'],
     'Read the line for Firenze.', [])
L.mc('Where is there fog on Saturday?', 'Abetone', ['Pisa', 'Viareggio', 'Firenze'], 'Nebbia.', ['nebbia'])
L.mc("Why can't Chloé go to the seaside on Saturday afternoon?", 'She works at the bar until three', ["She doesn't like the sea", "It's raining in Viareggio", 'She has no money'],
     "'Sabato lavoro al bar.'", [])
L.mc('True or false: on Sunday it is hot all over Tuscany.', 'True', ['False'], "'Sole in tutta la Toscana.'", [])
L.mc('Why does Chloé want to take the eight o\'clock train?', 'With sun and heat, everyone in Florence goes to the sea', ['The train is cheaper', 'It rains in the afternoon', 'She works in the afternoon'],
     "'Tutta Firenze va al mare.'", [])
L.mc('What happens at four o\'clock?', 'A big black cloud arrives and it starts to rain', ['They take the train home', 'The sun comes out', 'They go for a swim'],
     "'Comincia a piovere.'", ['nuvola'])
L.cloze('Complete from the text: Emma reads the weather forecast.', 'Emma legge le ___ del tempo.', 'previsioni', 'Previsione, plural.', ['previsione'])
L.cloze('Complete from the text: fog and thunderstorms.', 'Nebbia e ___.', 'temporali', 'Temporale, plural.', ['temporale', 'nebbia'])
L.cloze('Complete from the text: on the beach there are already a lot of people.', 'In spiaggia ci sono ___ molte persone.', 'già', 'Already.', ['già'])
L.cloze('Complete from the text: rain and wind all day.', 'Pioggia e vento ___ il giorno.', 'tutto', 'All day.', ['pioggia', 'vento'])
L.answer('Che tempo fa a Viareggio sabato pomeriggio?', ["c'è il sole", 'sole'], 'Read the line for Viareggio.', ['sole'])
L.answer('Quanti gradi ci sono domenica?', ['da venti a ventinove gradi', 'ventinove gradi'], 'Read the line for domenica.', ['grado'])
L.answer('Che cosa fanno Emma e Chloé in spiaggia?', ["nuotano, mangiano un panino e dormono un po' al sole", 'nuotano e mangiano un panino'],
         'Read the paragraph about the beach.', ['nuotare', 'spiaggia'])

# ── 6. Florence in Four Seasons (reading: an information page) ──
L = lesson(6, 'Florence in Four Seasons', 'reading')
L.reading = {"title": "Firenze in quattro stagioni", "paragraphs": [
    "Siete nuovi a Firenze? Ecco il tempo in città, stagione per stagione.",
    "La primavera è bella, ma il tempo cambia spesso: un giorno c'è il sole, il giorno dopo piove. Ad aprile ci sono fiori in tutti i giardini, e le giornate sono più lunghe. Pasqua è a marzo o ad aprile, e in centro ci sono molti turisti.",
    "L'estate è molto calda. A luglio e ad agosto ci sono spesso trentacinque gradi, e c'è poco vento. Molti fiorentini vanno al mare o in montagna, dove fa più fresco. A Ferragosto, il quindici agosto, molti negozi e ristoranti sono chiusi.",
    "In autunno piove spesso, e novembre è un mese di pioggia. Ma ottobre è un bel mese: non fa più caldo e non fa ancora freddo, e le foglie degli alberi sono gialle e rosse.",
    "L'inverno non è molto freddo, ma è umido, e qualche volta la mattina c'è la nebbia. In città nevica poco, quasi mai. Ma non lontano, in montagna, all'Abetone, c'è la neve e potete sciare.",
    "A dicembre in piazza del Duomo c'è un grande albero di Natale, e la sera le strade del centro sono molto belle.",
    "Un'ultima cosa: a Firenze l'ombrello è utile in ogni stagione. Gli studenti di Giulia hanno sempre un ombrello nello zaino!",
]}
L.vocab = [
    V('fiorentino', 'from Florence; a person from Florence', 'Giulia è fiorentina.'),
    V('chiuso', 'closed · the opposite of aperto', 'La domenica il negozio è chiuso.'),
    V('ancora', 'still; yet · non … ancora = not yet', 'Sono le nove e Paul dorme ancora.'),
    V('umido', 'damp, humid', 'Oggi non piove, ma è umido.'),
    V('utile', 'useful', 'Il telefono è molto utile.'),
]
L.vocab[2]['example'] = 'Sono le dieci, ma Paul non è ancora al lavoro.'
L.mc('What is spring like in Florence?', 'The weather changes often', ['It rains every day', "It's very hot", 'It snows'], 'Read the second paragraph.', [])
L.mc('True or false: in summer there is a lot of wind in Florence.', 'False', ['True'], "'C'è poco vento.'", [])
L.mc('Why do many Florentines go to the sea or the mountains in summer?', "It's cooler there", ["They're on holiday at Easter", 'The shops are closed in the city', "It's sunnier there"],
     "'Dove fa più fresco.'", ['fiorentino'])
L.mc('What happens at Ferragosto?', 'Many shops and restaurants are closed', ['There are lots of flowers', 'It snows in the city', 'The schools start again'],
     "'Molti negozi e ristoranti sono chiusi.'", ['chiuso'])
L.mc('Why is October a nice month?', "It's no longer hot and not yet cold", ["It's sunny every day", "It's the month with the most tourists"],
     'Read the fourth paragraph.', ['ancora'])
L.mc('How often does it snow in the city?', 'Hardly ever', ['Every winter', 'Often in December', 'Only at Christmas'], "'Quasi mai.'", [])
L.cloze('Complete from the text: winter is not very cold, but it is damp.', "L'inverno non è molto freddo, ma è ___.", 'umido', 'Damp.', ['umido'])
L.cloze('Complete from the text: the umbrella is useful in every season.', "L'ombrello è ___ in ogni stagione.", 'utile', 'Useful.', ['utile', 'stagione'])
L.cloze("Complete from the text: it's not cold yet.", 'Non fa ___ freddo.', 'ancora', 'Not yet.', ['ancora'])
L.cloze('Complete from the text: many shops and restaurants are closed.', 'Molti negozi e ristoranti sono ___.', 'chiusi', 'Chiuso, masculine plural.', ['chiuso'])
L.answer('Dove vanno molti fiorentini in estate?', ['al mare o in montagna', 'vanno al mare o in montagna'], 'Read the paragraph about summer.', ['fiorentino'])
L.answer("Dov'è il grande albero di Natale?", ['in piazza del Duomo', 'è in piazza del Duomo'], 'Read the paragraph about December.', ['albero'])
L.answer('Quando è Ferragosto?', ['il quindici agosto', 'è il quindici agosto'], 'Read the paragraph about summer.', ['Ferragosto'])
L.answer('Che cosa hanno sempre nello zaino gli studenti di Giulia?', ['un ombrello', "hanno sempre un ombrello"], 'Read the last paragraph.', [])

# ── 7–8. Writing ──
L = lesson(7, 'A Card for Giulia', 'writing')
L.reading = {"title": "Cari studenti", "paragraphs": [
    "Cari studenti,",
    "la scuola è chiusa per le vacanze di Natale dal 22 dicembre al 6 gennaio. Le lezioni cominciano di nuovo il 7 gennaio, alle nove.",
    "Ma prima festeggiamo insieme: venerdì 18 dicembre, dopo la lezione, in classe. Io porto un dolce di Natale e una bottiglia di vino. E voi?",
    "A Natale sto a Firenze, e a Capodanno vado in montagna con gli amici, a sciare. Lì c'è già la neve!",
    "Tanti auguri di buon Natale e felice anno nuovo a tutti!",
    "Giulia",
]}
L.write('Giulia sends the class this card. Write a card back: thank her, say what you are bringing on Friday, say where you are for the holidays and what the weather is like there, and send your wishes.',
        "Cara Giulia, grazie per il messaggio! Venerdì porto un dolce inglese. A Natale vado a Londra: lì fa freddo e piove spesso, ma non è un problema. Festeggio Capodanno con gli amici. Tanti auguri di buon Natale e felice anno nuovo anche a te! A presto, Emma",
        'Cara Giulia; porto…; a Natale vado a / sto a…; lì fa… or c\'è…; tanti auguri.', ['augurio', 'Natale', 'Capodanno'])
L = lesson(8, 'The Weather Where You Live', 'writing')
L.write('A new friend in Florence asks about the weather where you live. Describe it season by season, then say which season you prefer and why.',
        "Abito a Manchester, in Inghilterra. In inverno fa freddo e piove molto, ma nevica poco. In primavera il tempo cambia spesso, e ci sono molti fiori in giardino. L'estate non è molto calda: ci sono venti o venticinque gradi. In autunno c'è vento e piove di nuovo. Preferisco la primavera, perché le giornate sono più lunghe e non fa freddo.",
        'In inverno / in estate + fa caldo, fa freddo, piove, nevica; preferisco… perché…', ['stagione', 'piovere', 'nevicare'])

# ── 9. Speaking ──
L = lesson(9, 'Say It Out Loud', 'speaking')
L.read('Che tempo fa oggi?', 'Che tempo fa.', ['che tempo fa?'])
L.read("Oggi piove e c'è molto vento.", 'Piove; vento.', ['piovere', 'vento'])
L.read('In montagna nevica, ma qui fa fresco.', 'Nevica; fresco.', ['nevicare', 'fresco'])
L.read("Il cielo è azzurro e non c'è una nuvola.", 'Cielo; nuvola.', ['cielo', 'nuvola'])
L.read("D'estate vado in spiaggia e nuoto al mare.", 'Spiaggia: a double g, and the i after it is silent.', ['nuotare', 'spiaggia'])
L.read("Davanti a casa c'è un albero con i fiori.", 'Albero: stress on the first syllable.', ['fiore', 'albero'])
L.read('Natale è il venticinque dicembre.', 'A date.', ['Natale'])
L.read('Tanti auguri di buona Pasqua!', 'Auguri: the stress is on gu.', ['augurio', 'Pasqua'])

for L in LESSONS:
    L.dump()
print('\n'.join(L.meta(L.n) for L in LESSONS))
