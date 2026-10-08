"""Chapter 4 'Having & Needing' (unit-05), after avere and Numbers 0–100.

Available: essere, avere (possession, family, age, avere expressions, bisogno/voglia di), numbers,
fa caldo / fa freddo as set phrases, un/una + noun as chunks, First phrases.
Not yet: articles as a system, possessives (mio fratello), other verbs, c'è. Avere forms and the
essere/avere contrast are drilled in the grammar unit; here they're used in situations.
"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from chapterlib import Lesson, V

U = 'unit-05'
# Examples write to tools/authoring/out/, never over the real lessons. To author a new chapter,
# copy this file, set U, and point D at frontend/src/data/units/<unit>.
D = os.path.join(os.path.dirname(__file__), '..', 'out', U)
os.makedirs(D, exist_ok=True)
LESSONS = []
def lesson(n, name, role):
    L = Lesson(U, D, n, name, role); LESSONS.append(L); return L

# ── 1. Family & Pets ──
L = lesson(1, 'Family & Pets', 'words')
L.vocab = [
    V('fratello', 'brother · fratelli = brothers, or brothers and sisters', 'Ho un fratello.'),
    V('sorella', 'sister · sorelle = sisters', 'Ho due sorelle.'),
    V('figlio', 'son · figli = sons, or children', 'Hai figli?'),
    V('figlia', 'daughter', 'Anna ha una figlia.'),
    V('sposato', 'married · sposata (a woman)', 'Sei sposato?'),
    V('cane', 'dog', 'Ho un cane.'),
    V('gatto', 'cat', 'Hai un gatto?'),
    V('si chiama', 'his / her / its name is', 'Ho un cane. Si chiama Max.'),
]
L.meaning('figlia', 'Anna ha una figlia.', ['daughter'], "Figlio is son; -a for a girl.", ['figlia'])
L.meaning('sposata', 'Marta è sposata.', ['married'], 'A woman: -a.', ['sposato'])
L.mc("A new colleague asks 'Hai fratelli?'. You have one sister. What do you answer?", 'Sì, ho una sorella.',
     ['Sì, sono una sorella.', 'Sì, ho un fratello.'], 'Having a sister: avere.', ['sorella'], ctx='Hai fratelli?')
L.cloze('Complete: I have a dog. His name is Max.', 'Ho un cane. ___ chiama Max.', ['Si', 'si'], 'His name is: si chiama.', ['si chiama'])
L.line('Your new neighbour, an older lady, is curious about you.',
       [{"speaker": "Neighbour", "text": "Lei è sposato?"}, {"speaker": "You"}],
       ['Sì, sono sposato.', 'No, non sono sposato.', 'Sì, sono sposata.', 'No, non sono sposata.'], 'Married is essere + sposato/sposata.', ['sposato'])
L.line('A colleague asks about your family.',
       [{"speaker": "Colleague", "text": "Hai figli?"}, {"speaker": "You"}],
       ['Sì, ho due figli.', 'No, non ho figli.', 'Sì, ho una figlia.'], 'Say how many, or that you have none.', ['figlio'])
L.mc('Anna has a son and a daughter. How does she say it?', 'Ho un figlio e una figlia.', ['Ho due figlie.', 'Ho un figlia e una figlio.'],
     'Un figlio, una figlia.', ['figlio', 'figlia'])
L.cloze('Complete: Marta is married.', 'Marta è ___.', 'sposata', 'Marta is a woman.', ['sposato'])
L.say('Say you have a dog called Rex.', ['ho un cane, si chiama Rex', 'ho un cane. si chiama Rex', 'ho un cane che si chiama Rex'],
      "Ho un cane, then 'si chiama'.", ['cane', 'si chiama'])
L.say("Say you don't have any brothers or sisters.", ['non ho fratelli'], 'Fratelli covers brothers and sisters.', ['fratello'])
L.arrange("Arrange: 'Luca is married and has two children.'", 'Luca è sposato e ha due figli.', ['sono', 'figlio'], 'Married: essere. Children: avere.', ['sposato', 'figlio'])
L.say('Ask a friend if they have a cat.', ['hai un gatto'], 'The informal question.', ['gatto'])

# ── 2. Things You Have ──
L = lesson(2, 'Things You Have', 'words')
L.vocab = [
    V('casa', 'house, home', 'Ho una casa a Roma.'),
    V('macchina', 'car', 'Hai la macchina?'),
    V('bicicletta', 'bicycle', 'Ho una bicicletta.'),
    V('telefono', 'phone', 'Scusi, ha un telefono?'),
    V('lavoro', 'job, work', 'Ho un lavoro.'),
    V('tempo', 'time', 'Non ho tempo.'),
    V('soldi', 'money (always plural)', 'Non ho soldi!'),
    V('problema', 'problem (masculine: un problema)', 'Abbiamo un problema.'),
    V('idea', "idea (un'idea)", "Ho un'idea!"),
]
L.meaning('Non ho tempo', 'Non ho tempo.', ["I don't have time", 'I have no time'], 'Tempo = time.', ['tempo'])
L.meaning('soldi', 'Non ho soldi!', ['money'], 'Always plural in Italian.', ['soldi'])
L.mc('A friend invites you out, but you are busy. What do you say?', 'Mi dispiace, non ho tempo.', ['Mi dispiace, non sono tempo.', 'Mi dispiace, ho tempo.'],
     'Having time: avere.', ['tempo'])
L.mc('Something has gone wrong at work. You tell your colleague:', 'Abbiamo un problema.', ['Abbiamo una problema.', 'Siamo un problema.'],
     'Problema ends in -a but is masculine: un problema.', ['problema'])
L.cloze('Complete: I have an idea!', 'Ho ___ idea!', ["un'"], "Before a vowel, una becomes un'.", ['idea'])
L.line('A friend asks how you get to work.',
       [{"speaker": "Friend", "text": "Hai la macchina?"}, {"speaker": "You"}],
       ['No, non ho la macchina. Ho una bicicletta.', 'Sì, ho la macchina.'], 'Yes or no, and what you have.', ['macchina'])
L.mc('Your phone is dead and you need to call someone. You ask a stranger:', 'Scusi, ha un telefono?', ['Scusa, hai telefono?', 'Scusi, è un telefono?'],
     'A stranger: formal, and having uses avere.', ['telefono'])
L.say('Say you have a job.', ['ho un lavoro'], 'Un lavoro.', ['lavoro'])
L.say("Say you don't have any money.", ['non ho soldi'], 'Non before the verb.', ['soldi'])
L.arrange("Arrange: 'We have a house in Rome.'", 'Abbiamo una casa a Roma.', ['siamo', 'un'], 'Casa is feminine: una.', ['casa'])
L.say('Ask two friends if they have time.', ['avete tempo'], 'Two people: voi.', ['tempo'])

# ── 3. How You Feel (practice) ──
L = lesson(3, 'How You Feel', 'practice')
L.vocab = [
    V('fa freddo', "it's cold (the weather)", 'Oggi fa freddo!'),
    V('fa caldo', "it's hot (the weather)", 'Fa caldo! Ho sete.'),
    V('molto', 'very · molta with feminine nouns', 'Ho molta fame! Ho molto freddo!'),
]
L.mc("It's 11 PM and you can't keep your eyes open. You say:", 'Ho sonno.', ['Sono sonno.', 'Ho fame.'], 'Being sleepy: avere sonno.', ['sonno'])
L.mc("You're outside in January in a T-shirt. You say:", 'Ho freddo!', ['Sono freddo!', 'Fa caldo!'], 'You feel cold: avere.', ['freddo'])
L.mc("It's 35°C in Rome in August. How do you describe the weather?", 'Fa caldo!', ['Sono caldo!', 'Ha caldo!'], 'The weather: fa.', ['fa caldo'])
L.line('At lunchtime, a colleague asks you a question.',
       [{"speaker": "Colleague", "text": "Hai fame?"}, {"speaker": "You"}],
       ['Sì, ho molta fame!', 'No, non ho fame.', 'Sì, ho fame.'], 'Yes or no, with avere.', ['fame'])
L.line('A friend offers you a coffee, but your train leaves in five minutes.',
       [{"speaker": "Friend", "text": "Un caffè?"}, {"speaker": "You"}],
       ['No, grazie. Ho fretta!', 'Mi dispiace, ho fretta.'], 'Say no, and why.', ['fretta'])
L.mc('Your friend sees a big dog and steps back. She says:', 'Ho paura!', ['Sono paura!', 'Ho fretta!'], 'Being afraid: avere paura.', ['paura'])
L.say("Say 'We're cold.'", ['abbiamo freddo'], 'We: abbiamo.', ['freddo'])
L.say("Tell your friend 'You're right!'", ['hai ragione'], 'Being right: avere ragione.', ['ragione'])
L.cloze("Complete: It's hot! I'm hot.", 'Fa ___! Ho caldo.', 'caldo', 'The weather: fa caldo.', ['fa caldo'])
L.arrange("Arrange: 'I'm sleepy and I'm cold.'", 'Ho sonno e ho freddo.', ['sono', 'fa'], 'Both use avere.', ['sonno', 'freddo'])

# ── 4. What You Need (practice) ──
L = lesson(4, 'What You Need', 'practice')
L.vocab = [
    V('un caffè', 'a coffee', 'Un caffè, per favore.'),
    V('acqua', 'water', 'Ho bisogno di acqua.'),
    V('un panino', 'a sandwich, a filled roll', 'Ho fame. Un panino, per favore!'),
    V('aiuto', 'help', 'Scusi, ho bisogno di aiuto!'),
    V('un gelato', 'an ice cream', 'Ho voglia di un gelato.'),
]
L.line('At a bar in the morning.',
       [{"speaker": "Barista", "text": "Buongiorno! Prego?"}, {"speaker": "You"}],
       ['Buongiorno! Un caffè, per favore.', 'Un cappuccino, per favore.'], 'Greet back and order.', ['un caffè'])
L.line('The barista offers you a coffee, but you are thirsty.',
       [{"speaker": "Barista", "text": "Un caffè?"}, {"speaker": "You"}],
       ['No, grazie. Ho sete: acqua, per favore.', 'No, grazie. Ho sete. Acqua, per favore.'], 'Say no, that you are thirsty, and ask for water.', ['acqua'])
L.mc("You're lost and need help. You say to a passer-by:", 'Scusi, ho bisogno di aiuto!', ['Scusi, sono bisogno di aiuto!', 'Scusi, ho bisogno aiuto!'],
     'Avere bisogno di.', ['aiuto'])
L.cloze('Complete: Excuse me, I need a doctor!', 'Scusi, ho bisogno ___ un medico!', 'di', 'Bisogno takes di.', ['aiuto'])
L.say('Say you feel like an ice cream.', ['ho voglia di un gelato'], 'Avere voglia di.', ['un gelato'])
L.say('Say you need water.', ['ho bisogno di acqua', "ho bisogno d'acqua"], 'Avere bisogno di.', ['acqua'])
L.mc("It's 1 PM and you're hungry, at the bar. You say:", 'Ho fame. Un panino, per favore.', ['Sono fame. Un panino, per favore.', 'Ho sete. Un panino, per favore.'],
     'Hungry: ho fame.', ['un panino'])
L.arrange("Arrange: 'I'm thirsty and I need water.'", 'Ho sete e ho bisogno di acqua.', ['sono', 'voglia'], 'Two avere expressions.', ['acqua'])
L.line('A friend has an idea.',
       [{"speaker": "Friend", "text": "Hai voglia di un gelato?"}, {"speaker": "You"}],
       ['Sì! Ho molta voglia di un gelato!', 'No, grazie. Non ho fame.'], 'Yes or no, with avere.', ['un gelato'])
L.say('Ask a friend if they need help.', ['hai bisogno di aiuto', "hai bisogno d'aiuto"], 'The informal question.', ['aiuto'])

# ── 5. Emma's Message (reading) ──
L = lesson(5, "Emma's Message", 'reading')
L.vocab = [V('adesso', 'now', 'Adesso sono a Firenze.'), V('oggi', 'today', 'Oggi fa caldo.')]
L.reading = {"title": "Ciao da Firenze!", "paragraphs": [
    "Ciao Marco!",
    "Mi chiamo Emma e ho ventiquattro anni. Sono inglese, di Londra, ma adesso sono a Firenze. Sono studentessa di italiano.",
    "Ho una sorella, Kate. Kate ha trent'anni, è sposata e ha due figli, Tom e Lily. Tom ha sei anni e Lily ha tre anni.",
    "Ho anche un gatto. Si chiama Biscotto ed è un gatto italiano!",
    "Oggi fa caldo e ho sete. Ho voglia di un gelato!",
    "E tu? Quanti anni hai? Hai fratelli?",
    "Ciao, Emma",
]}
L.mc('How old is Emma?', '24', ['42', '34', '30'], "'Ventiquattro.'", ['anni'])
L.mc('Where is Emma now?', 'In Florence', ['In London', 'In Rome', 'With Kate'], "'Adesso sono a Firenze.'", ['adesso'])
L.mc('Who is Kate?', "Emma's sister", ["Emma's daughter", "Emma's teacher", "Emma's cat"], "'Ho una sorella, Kate.'", ['sorella'])
L.mc('True or false: Kate is married.', 'True', ['False'], "'È sposata.'", ['sposato'])
L.mc('How old is Lily?', '3', ['6', '30', '13'], "'Lily ha tre anni.'", ['anni'])
L.mc('What pet does Emma have?', 'A cat called Biscotto', ['A dog called Biscotto', 'Two cats', 'No pets'], "'Ho anche un gatto.'", ['gatto'])
L.mc('Why does Emma feel like an ice cream?', "It's hot and she's thirsty", ["She's hungry and cold", "It's her birthday"], "'Fa caldo e ho sete.'", ['un gelato'])
L.answer('Quanti anni ha Kate?', ["ha trent'anni", "Kate ha trent'anni", 'ha trenta anni'], 'Ha + age + anni.', ['anni'])
L.answer('Emma ha un cane?', ['no, ha un gatto', 'no, non ha un cane, ha un gatto', 'no, Emma ha un gatto'], 'No, and say what she has.', ['cane'])

# ── 6. Paul in a Hurry (reading, a short story) ──
L = lesson(6, 'Paul in a Hurry', 'reading')
L.vocab = [V('ecco', 'here it is, here you are', 'Ecco il caffè!'), V('domani', 'tomorrow', 'Domani!')]
L.vocab[0]['example'] = 'Ecco: un caffè!'
L.reading = {"title": "Paul ha fretta", "paragraphs": [
    "Oggi fa freddo. Paul ha fretta, ha freddo e ha molta fame.",
    "Paul: Buongiorno, Chloé! Un caffè e un panino, per favore. Ho fame e ho fretta!",
    "Chloé: Buongiorno, dottore! Ha freddo?",
    "Paul: Sì, ho molto freddo!",
    "Chloé: Ecco: caffè e panino!",
    "Paul: Grazie! Oh, no… Non ho soldi!",
    "Chloé: Non è un problema, dottore. Domani!",
    "Paul: Grazie, Chloé. Domani, due caffè!",
]}
L.mc("What's the weather like?", "It's cold", ["It's hot", "It's raining"], "'Fa freddo.'", ['fa freddo'])
L.mc('What does Paul order?', 'A coffee and a sandwich', ['Two coffees', 'An ice cream', 'Water'], "'Un caffè e un panino.'", ['un panino'])
L.mc('How does Paul feel?', 'Cold, hungry and in a hurry', ['Hot and thirsty', 'Sleepy and afraid'], 'Read the first line.', ['fretta'])
L.mc('True or false: Paul is hot.', 'False', ['True'], "'Ho molto freddo.'", ['freddo'])
L.mc("What is Paul's problem?", 'He has no money', ['He has no time', 'He is not hungry', 'Chloé has no coffee'], "'Non ho soldi!'", ['soldi'])
L.mc("What does Chloé say?", "It's not a problem: he can pay tomorrow", ['He has to pay now', 'The coffee is for her'], "'Non è un problema. Domani!'", ['domani'])
L.mc("Paul says 'Domani, due caffè!'. What does he mean?", "Tomorrow he'll pay for two coffees", ['He wants two coffees now', 'He has two coffees tomorrow at home'],
     'One for today, one for tomorrow.', ['domani'])
L.answer('Paul ha soldi?', ['no, non ha soldi', 'no, Paul non ha soldi'], 'No, with non.', ['soldi'])

# ── 7–9. Writing ──
L = lesson(7, 'All About Me', 'writing')
L.write('Write a short message to a new language partner: your age, where you are from, your family and any pets.',
        'Ciao! Mi chiamo Tom e ho trentadue anni. Sono inglese, di Leeds. Ho una sorella e due fratelli. Ho un cane, si chiama Rex.',
        'Age with avere, family with ho + number, pets with si chiama.', ['anni', 'fratello', 'cane'])
L = lesson(8, 'At the Bar', 'writing')
L.write('You walk into a bar, hungry and cold. Greet the barista, say how you feel and order.',
        'Buongiorno! Ho fame e ho freddo. Un caffè e un panino, per favore.', 'A greeting, two avere expressions, then your order.', ['fame', 'freddo', 'un panino'])
L = lesson(9, "Can't Make It", 'writing')
L.write("A friend invites you out tonight. Say you're sorry and explain why you can't come: you're tired, and you have no time or money.",
        'Mi dispiace! Sono stanco e non ho tempo. E non ho soldi!', 'Mi dispiace, then the reasons: essere for tired, avere for time and money.', ['tempo', 'soldi'])

# ── 10. Speaking ──
L = lesson(10, 'Say It Out Loud', 'speaking')
L.read('Ho un fratello e due sorelle.', 'Family.', ['fratello', 'sorella'])
L.read('Ho un cane. Si chiama Max.', 'A pet with a name.', ['cane', 'si chiama'])
L.read('Mi dispiace, non ho tempo.', 'Saying no politely.', ['tempo'])
L.read("Ho un'idea! Abbiamo un problema.", "Un'idea, un problema.", ['idea', 'problema'])
L.read('Oggi fa caldo e ho sete.', 'Weather and feeling.', ['fa caldo'])
L.read('Scusi, ho bisogno di aiuto!', 'Asking for help.', ['aiuto'])
L.read('Ho fame. Un panino, per favore!', 'Ordering.', ['un panino'])

for L in LESSONS:
    L.dump()
print([(L.name, len(L.ex)) for L in LESSONS], sum(len(L.ex) for L in LESSONS))
print('\n'.join(L.meta(i + 1) for i, L in enumerate(LESSONS)))
