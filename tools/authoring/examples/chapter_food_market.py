"""Chapter 'Food & the Market' (unit-16), after the Prepositions unit and Around Town.

Available: units 1–8 (including partitives del/della/dei, di for amounts, a/in with places), chapters 1–9.
Chapter 8 (At the Café) already taught drinks, pane, pizza, cornetto, dolce, conto, zucchero, altro,
basta così, quant'è, costare. Not yet: adjective agreement, possessives, clock times, piacere,
reflexives, the imperative, the past.
"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from chapterlib import Lesson, V

U = 'unit-16'
D = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'out', U)
os.makedirs(D, exist_ok=True)
LESSONS = []
def lesson(n, name, role):
    L = Lesson(U, D, n, name, role); LESSONS.append(L); return L

# ── 1. Food ──
L = lesson(1, 'Food', 'words')
L.vocab = [
    V('cibo', 'food', 'Amo il cibo italiano.'),
    V('carne', 'meat', 'Non mangio carne.'),
    V('pesce', 'fish', 'Il venerdì mangio pesce.'),
    V('pasta', 'pasta', 'Mangio pasta ogni giorno.'),
    V('riso', 'rice', 'Vorrei del riso, per favore.'),
    V('verdura', 'vegetables (usually singular)', 'Mangio molta verdura.'),
    V('frutta', 'fruit (usually singular)', 'Mangio frutta a colazione.'),
    V('pomodoro', 'tomato · pomodori = tomatoes', 'Vorrei dei pomodori.'),
    V('formaggio', 'cheese', 'Un panino con il formaggio, per favore.'),
    V('uovo', 'egg · plural: le uova (feminine)', 'Ho sei uova.'),
    V('insalata', 'salad; also lettuce', "Un'insalata e una bottiglia d'acqua."),
]
L.vocab[2]['example'] = 'Stasera mangiamo pesce.'
L.meaning('cibo', 'Amo il cibo italiano.', ['food'], 'Everything you eat.', ['cibo'])
L.meaning('carne', 'Non mangio carne.', ['meat'], 'Beef, chicken, pork…', ['carne'])
L.meaning('verdura', 'Mangio molta verdura.', ['vegetables', 'veg'], 'Carrots, beans, courgettes…', ['verdura'])
L.meaning('uova', 'Ho sei uova.', ['eggs'], 'The irregular plural of uovo.', ['uovo'])
L.mc("Your friend doesn't eat meat or fish. What can you cook?", 'Pasta con la verdura.', ['Pasta con il pesce.', 'Riso con la carne.'],
     'No carne, no pesce.', ['verdura', 'carne', 'pesce'])
L.cloze('Complete: I eat fruit at breakfast.', 'Mangio ___ a colazione.', 'frutta', 'Fruit, singular in Italian.', ['frutta'])
L.cloze('Complete: a cheese sandwich, please.', 'Un panino con il ___, per favore.', 'formaggio', 'Cheese.', ['formaggio'])
L.mc('How do you say "six eggs"?', 'sei uova', ['sei uovi', 'sei uove'], 'Uovo has an irregular plural.', ['uovo'])
L.cloze('Complete: Some rice, please.', 'Vorrei ___ riso, per favore.', 'del', 'Some: di + il.', ['riso'])
L.line('A friend asks what you eat in the evening.',
       [{"speaker": "Friend", "text": "Che cosa mangi la sera?"}, {"speaker": "You"}],
       ['Mangio pasta o riso, e un po\' di verdura.', 'Mangio pesce e insalata.', 'Mangio pasta.'],
       'Name two or three foods.', ['pasta', 'riso'])
L.say("Say you don't eat meat.", ['non mangio carne', 'non mangio la carne'], 'Non before the verb.', ['carne'])
L.arrange("Arrange: 'I'd like a salad and some bread.'", "Vorrei un'insalata e del pane.", ['dei', 'una'], "Un'insalata; del pane.", ['insalata'])
L.say('Ask for some tomatoes, please.', ['dei pomodori, per favore', 'vorrei dei pomodori'], 'Some: di + i.', ['pomodoro'])

# ── 2. At the Market ──
L = lesson(2, 'At the Market', 'words')
L.vocab = [
    V('mercato', 'market', 'Oggi vado al mercato.'),
    V('chilo', 'kilo · un chilo di = a kilo of', 'Un chilo di mele, per favore.'),
    V('etto', 'a hundred grams · un etto di, due etti di', 'Due etti di formaggio, per favore.'),
    V('mezzo', 'half (with an amount) · mezzo chilo = half a kilo', 'Mezzo chilo di pane.'),
    V('desidera?', 'what would you like? (shop staff, to Lei)', 'Buongiorno! Che cosa desidera?'),
    V('mela', 'apple', 'Una mela al giorno.'),
    V('sale', 'salt', 'Il sale è sul tavolo.'),
    V('pepe', 'pepper (the spice)', 'Sale e pepe, per favore.'),
    V('aceto', 'vinegar', "Olio e aceto per l'insalata."),
    V('metà', 'half (of something) · la metà di = half of', 'Metà della pizza è per te.'),
]
L.vocab[0]['example'] = 'Compro la frutta al mercato.'
L.meaning('etto', 'Due etti di formaggio, per favore.', ['a hundred grams', '100 grams', 'hundred grams', '100 g'], 'Italians buy cheese and ham by the etto.', ['etto'])
L.meaning('mezzo chilo', 'Mezzo chilo di pane.', ['half a kilo', 'half kilo', '500 grams'], 'Mezzo: half.', ['mezzo'])
L.mc("At the market you want 200 grams of cheese. What do you say?", 'Due etti di formaggio, per favore.',
     ['Due chili di formaggio, per favore.', 'Mezzo etto di formaggio, per favore.'], 'An etto is 100 grams.', ['etto'])
L.cloze('Complete: a kilo of apples.', 'Un ___ di mele.', 'chilo', 'A kilo.', ['chilo', 'mela'])
L.cloze('Complete: Oil and vinegar for the salad.', "Olio e ___ per l'insalata.", 'aceto', 'For a salad dressing.', ['aceto'])
L.mc('The stallholder asks "Altro?". You have everything. What do you say?', 'No, basta così, grazie.',
     ['Sì, basta così.', 'No, ancora, grazie.'], 'Basta così: that\'s all.', ['mercato'], ctx='Altro?')
L.line('At the market stall.',
       [{"speaker": "Stallholder", "text": "Buongiorno! Che cosa desidera?"}, {"speaker": "You"}],
       ['Buongiorno! Un chilo di pomodori, per favore.', 'Vorrei mezzo chilo di mele.', 'Due etti di formaggio, per favore.'],
       'Greet back and ask for an amount of something.', ['chilo', 'etto'])
L.say('Ask how much the apples cost.', ['quanto costano le mele', 'quanto costano le mele?'], 'Costano: more than one.', ['mela'])
L.say('Ask for salt and pepper, please.', ['sale e pepe, per favore', 'il sale e il pepe, per favore'], 'Sale e pepe.', ['sale', 'pepe'])
L.arrange("Arrange: 'Today I'm going to the market.'", 'Oggi vado al mercato.', ['in', 'alla'], 'A + il mercato.', ['mercato'])
L.say('Say: half of the pizza is for you.', ['metà della pizza è per te', 'la metà della pizza è per te'], 'Metà della pizza.', ['metà'])

# ── 3. At the Table ──
L = lesson(3, 'At the Table', 'words')
L.vocab = [
    V('piatto', 'plate; also a dish · un piatto di pasta', 'Un piatto di pasta, per favore.'),
    V('forchetta', 'fork', 'Scusi, non ho la forchetta.'),
    V('coltello', 'knife', 'Un coltello per la carne, per favore.'),
    V('cucchiaio', 'spoon · cucchiai = spoons', 'Il cucchiaio è per il dolce.'),
    V('menù', 'menu (doesn\'t change: i menù)', 'Il menù, per favore.'),
    V('antipasto', 'starter', 'Come antipasto, un piatto di formaggi.'),
    V('primo', 'first course (pasta, rice or soup)', 'Come primo, gli spaghetti.'),
    V('secondo', 'main course (meat or fish)', 'Come secondo, il pesce.'),
    V('contorno', 'side dish (usually vegetables)', "Come contorno, un'insalata."),
    V('spaghetti', 'spaghetti · un piatto di spaghetti', 'Spaghetti al pomodoro, per favore.'),
    V('per me', "for me; at a table, 'I'll have'", 'Per me un primo e un contorno.'),
]
L.meaning('forchetta', 'Scusi, non ho la forchetta.', ['fork', 'a fork', 'the fork'], 'You eat spaghetti with it.', ['forchetta'])
L.meaning('contorno', "Come contorno, un'insalata.", ['side dish', 'a side dish', 'side'], 'Something next to the main course.', ['contorno'])
L.mc('In an Italian restaurant, what is "il primo"?', 'Usually pasta, rice or soup', ['Usually meat or fish', 'The dessert'],
     'The first course.', ['primo'])
L.mc('In an Italian restaurant, what is "il secondo"?', 'Usually meat or fish', ['Usually pasta', 'A drink'], 'The main course.', ['secondo'])
L.cloze('Complete: The spoon is for the dessert.', 'Il ___ è per il dolce.', 'cucchiaio', 'A spoon.', ['cucchiaio'])
L.cloze('Complete: A knife for the meat, please.', 'Un ___ per la carne, per favore.', 'coltello', 'A knife.', ['coltello'])
L.mc("You've just sat down at a trattoria. What do you ask the waiter?", 'Il menù, per favore.', ['Il conto, per favore.', 'Basta così, grazie.'],
     'First you need to see the menu.', ['menù'])
L.line('The waiter is ready to take your order.',
       [{"speaker": "Waiter", "text": "Prego, che cosa prende?"}, {"speaker": "You"}],
       ['Per me gli spaghetti al pomodoro e un\'insalata.', 'Come primo, gli spaghetti. Come secondo, il pesce.', 'Per me un primo e un contorno.'],
       'Per me, then your dishes.', ['per me', 'primo'])
L.say('Ask for a plate of pasta.', ['un piatto di pasta, per favore', 'un piatto di pasta'], 'Un piatto di.', ['piatto'])
L.arrange("Arrange: 'As a main course, the fish.'", 'Come secondo, il pesce.', ['primo', 'del'], 'Come + course.', ['secondo'])
L.say("Tell the waiter you don't have a fork. Be polite.", ['scusi, non ho la forchetta', 'scusi, non ho una forchetta'], 'Scusi, then non ho.', ['forchetta'])

# ── 4. Shopping for Food (practice) ──
L = lesson(4, 'Shopping for Food', 'practice')
L.line('At the market. You want half a kilo of tomatoes.',
       [{"speaker": "Stallholder", "text": "Buongiorno! Prego?"}, {"speaker": "You"}],
       ['Buongiorno! Mezzo chilo di pomodori, per favore.', 'Vorrei mezzo chilo di pomodori.'], 'Mezzo chilo di + pomodori.', ['mezzo', 'pomodoro'])
L.line('The stallholder asks if you want anything else. You want some apples too.',
       [{"speaker": "Stallholder", "text": "Altro?"}, {"speaker": "You"}],
       ['Sì, delle mele, per favore.', 'Sì, un chilo di mele.'], 'Delle mele, or an amount.', ['mela'])
L.line("You have everything you need.",
       [{"speaker": "Stallholder", "text": "Altro?"}, {"speaker": "You"}],
       ["No, basta così. Quant'è?", 'No, grazie, basta così.'], "Basta così; then ask the price.", ['mercato'])
L.line('At the deli counter. You want 150 grams of cheese.',
       [{"speaker": "Assistant", "text": "Desidera?"}, {"speaker": "You"}],
       ['Un etto e mezzo di formaggio, per favore.', 'Vorrei un etto e mezzo di formaggio.'], 'One etto and a half.', ['etto', 'formaggio'])
L.line('Your flatmate asks what you need from the shop.',
       [{"speaker": "Flatmate", "text": "Vado al supermercato. Che cosa compro?"}, {"speaker": "You"}],
       ['Sì, del latte e delle uova.', 'Sì, del pane e un po\' di frutta.'], 'Sì, then some things with del, della, delle.', ['uovo'])
L.mc('You want "some eggs". Which is right?', 'delle uova', ['dei uova', 'degli uova'], 'Uova is feminine plural.', ['uovo'])
L.say('Ask how much the tomatoes are.', ['quanto costano i pomodori'], 'Costano: more than one.', ['pomodoro'])
L.arrange("Arrange: 'Two hundred grams of cheese, please.'", 'Due etti di formaggio, per favore.', ['chili', 'del'], 'Due etti di.', ['etto'])

# ── 5. At the Trattoria (practice) ──
L = lesson(5, 'At the Trattoria', 'practice')
L.vocab = [V('da bere', 'to drink, something to drink · E da bere? = And to drink?', 'Da bere, una bottiglia d\'acqua.')]
L.line('You arrive at a trattoria with a friend.',
       [{"speaker": "Waiter", "text": "Buonasera! In quanti siete?"}, {"speaker": "You"}],
       ['Siamo in due.', 'Buonasera! Siamo in due.'], 'In due: two of us.', ['per me'])
L.line("You've sat down and want to see the menu.",
       [{"speaker": "Waiter", "text": "Prego, ecco il tavolo."}, {"speaker": "You"}],
       ['Grazie. Il menù, per favore.', 'Grazie. Possiamo avere il menù?'], 'Ask for the menu.', ['menù'])
L.line('Order a first course and a side.',
       [{"speaker": "Waiter", "text": "Che cosa prendete?"}, {"speaker": "You"}],
       ['Per me gli spaghetti e un\'insalata.', 'Per me un primo, la pasta al pomodoro, e come contorno la verdura.'],
       'Per me, then a primo and a contorno.', ['per me', 'contorno'])
L.line('The waiter asks about drinks.',
       [{"speaker": "Waiter", "text": "E da bere?"}, {"speaker": "You"}],
       ["Una bottiglia d'acqua, per favore.", 'Un bicchiere di vino, per favore.', "Dell'acqua, per favore."],
       'A drink, with an amount.', ['da bere'])
L.line("You don't have a knife.",
       [{"speaker": "Waiter", "text": "Tutto bene?"}, {"speaker": "You"}],
       ['Sì, grazie. Ma non ho il coltello.', 'Scusi, non ho il coltello.'], 'Say what\'s missing.', ['coltello'])
L.line("You've finished and want to pay.",
       [{"speaker": "Waiter", "text": "Un dolce? Un caffè?"}, {"speaker": "You"}],
       ['No, grazie. Il conto, per favore.', 'Un caffè e il conto, per favore.'], 'Say no or yes, then ask for the bill.', ['per me'])
L.say("Tell the waiter: as a main course, I'll have the fish.", ['come secondo, il pesce', 'per me il pesce come secondo', 'come secondo per me il pesce'],
      'Come secondo.', ['secondo', 'pesce'])
L.mc('Your friend asks the waiter for "un piatto di spaghetti". What is she ordering?', 'A plate of spaghetti', ['A plate and some spaghetti', 'Spaghetti to take away'],
     'Un piatto di: a plate of.', ['piatto'])

# ── 6. Trattoria da Gino (reading: a menu and a scene) ──
L = lesson(6, 'Trattoria da Gino', 'reading')
L.reading = {"title": "Trattoria da Gino", "paragraphs": [
    "Antipasti",
    "Bruschetta al pomodoro · 5 euro",
    "Formaggi · 9 euro",
    "Primi",
    "Spaghetti al pomodoro · 8 euro",
    "Risotto ai funghi · 11 euro",
    "Secondi",
    "Pesce del giorno · 16 euro",
    "Pollo con le patate · 12 euro",
    "Contorni",
    "Insalata · 4 euro",
    "Verdura · 5 euro",
    "Marco e Chloé sono da Gino. Marco non mangia carne. Prende la bruschetta, il risotto e un'insalata. Chloé ha molta fame: prende gli spaghetti, il pollo con le patate e un dolce.",
    "Gino: Da bere?",
    "Marco: Una bottiglia d'acqua e due bicchieri di vino, per favore.",
    "Alla fine Chloé dice: Il conto, per favore. Offro io!",
]}
L.vocab = [
    V('bruschetta', 'bruschetta: toasted bread, usually with tomato', 'Una bruschetta al pomodoro.'),
    V('risotto', 'risotto: rice cooked slowly in stock', 'Un risotto ai funghi.'),
    V('pollo', 'chicken', 'Pollo con le patate.'),
    V('patata', 'potato · patate = potatoes', 'Vorrei due chili di patate.'),
    V('funghi', 'mushrooms · un fungo = a mushroom', 'Risotto ai funghi.'),
    V('alla fine', 'in the end, at the end', 'Alla fine Chloé paga il conto.'),
]
L.mc('How much are the spaghetti?', '8 euros', ['5 euros', '11 euros'], 'Look under Primi.', [])
L.mc('Which of these is a contorno at Gino\'s?', 'Insalata', ['Pollo con le patate', 'Risotto ai funghi'], 'Look under Contorni.', [])
L.mc("Why doesn't Marco order the chicken?", "He doesn't eat meat", ["He isn't hungry", "It's too expensive"], "'Marco non mangia carne.'", ['pollo'])
L.mc('What does Marco order as his first course?', 'The mushroom risotto', ['The spaghetti', 'The fish of the day'], "'Il risotto.'", ['risotto', 'funghi'])
L.mc('True or false: Chloé orders three dishes and a dessert.', 'True', ['False'], "'Gli spaghetti, il pollo con le patate e un dolce.'", ['pollo'])
L.mc('Who pays?', 'Chloé', ['Marco', 'They pay half each'], "'Offro io!'", ['alla fine'])
L.cloze('Complete from the menu: mushroom risotto.', 'Risotto ai ___', 'funghi', 'Look under Primi.', ['risotto', 'funghi'])
L.answer('Che cosa prende Chloé come secondo?', ['il pollo con le patate', 'pollo con le patate', 'prende il pollo con le patate'], 'Chloé is very hungry.', ['pollo'])
L.cloze('Complete from the menu: tomato bruschetta.', '___ al pomodoro', 'bruschetta', 'Look under Antipasti.', ['bruschetta'])
L.cloze('Complete: In the end, Chloé pays.', 'Alla ___ Chloé paga.', 'fine', 'In the end.', ['alla fine'])
L.answer('Che cosa bevono Marco e Chloé?', ["acqua e vino", "una bottiglia d'acqua e due bicchieri di vino", "dell'acqua e del vino"], 'Read what Marco says to Gino.', [])
L.answer('Quanto costa il pesce del giorno?', ['16 euro', 'sedici euro', 'costa sedici euro'], 'Look under Secondi.', [])

# ── 7. Emma's Email (reading: an email about meals) ──
L = lesson(7, "Emma's Email", 'reading')
L.reading = {"title": "Il cibo a Firenze", "paragraphs": [
    "Cara Kate,",
    "come stai? Io sto bene, ma qui a Firenze mangio molto!",
    "A colazione prendo un cappuccino e un cornetto al bar, al banco, come gli italiani.",
    "In Italia il pranzo è un pasto importante: un primo (la pasta o il riso), poi un secondo con un contorno. Io a pranzo mangio un panino o un'insalata, in piedi, vicino alla scuola.",
    "La sera vado da Giulia. Lei compra la verdura e la frutta al mercato vicino a casa, e cucina: pasta, pesce, verdure. Io porto il vino e il dolce.",
    "Una cosa strana: a cena prendo un cappuccino, e Giulia dice: «Il cappuccino è per la colazione, non per la cena!»",
    "A presto,",
    "Emma",
]}
L.vocab = [
    V('pranzo', 'lunch', 'A pranzo mangio un panino.'),
    V('cena', 'dinner, supper', 'A cena mangiamo pesce.'),
    V('pasto', 'meal', 'Il pranzo è un pasto importante.'),
    V('strano', 'strange, odd', 'Una cosa strana!'),
    V('importante', 'important', 'Oggi è un giorno importante.'),
]
L.mc('What does Emma have for breakfast?', 'A cappuccino and a cornetto at the bar', ['A sandwich near the school', 'Pasta and fish'], 'Read the third paragraph.', [])
L.mc('What does Emma say about lunch in Italy?', "It's an important meal, with more than one course", ["It's just a sandwich", 'People skip it'], 'Read the fourth paragraph.', ['pranzo', 'pasto', 'importante'])
L.mc('Where does Emma usually eat lunch?', 'Standing up, near the school', ['At Giulia\'s', 'At a restaurant'], "'In piedi, vicino alla scuola.'", ['pranzo'])
L.mc('Who cooks in the evening?', 'Giulia', ['Emma', 'A restaurant'], "'Cucina per tutti.'", [])
L.mc('What does Emma bring?', 'Wine and dessert', ['Fruit and vegetables', 'Fish'], "'Io porto il vino e il dolce.'", [])
L.mc('What does Giulia say about cappuccino?', "It's for breakfast, not dinner", ["It's for dinner", "It's too expensive"], "'Il cappuccino è per la colazione…'", ['strano'])
L.cloze('Complete: Lunch is an important meal.', 'Il pranzo è un pasto ___.', 'importante', 'Important.', ['importante'])
L.cloze('Complete: A strange thing!', 'Una cosa ___!', 'strana', 'Cosa is feminine.', ['strano'])
L.cloze('Complete: Dinner at Giulia\'s.', 'La ___ da Giulia.', 'cena', 'The evening meal.', ['cena'])
L.answer('Dove compra la verdura Giulia?', ['al mercato', 'al mercato vicino a casa', 'la compra al mercato'], 'Read the fifth paragraph.', ['mercato'])
L.answer('Che cosa mangia Emma a pranzo?', ["un panino o un'insalata", 'mangia un panino o un\'insalata'], 'Read the fourth paragraph.', ['pranzo'])

# ── 8–9. Writing ──
L = lesson(8, 'A Shopping List', 'writing')
L.write("You're cooking dinner for friends tonight. Write a note to your flatmate: what you're cooking, and what to buy at the market, with amounts.",
        "Ciao! Stasera cucino io: spaghetti al pomodoro e pesce con le patate. Puoi andare al mercato? Ho bisogno di un chilo di pomodori, mezzo chilo di patate, due etti di formaggio e delle mele. Io porto il vino. Grazie!",
        'What you are cooking, then a list with un chilo di, mezzo chilo di, due etti di, delle.', ['chilo', 'etto', 'mezzo'])
L = lesson(9, 'Ordering a Meal', 'writing')
L.write("You're at a trattoria. Greet the waiter, order a starter, a first or main course with a side, and a drink, then ask for the bill.",
        "Buonasera! Come antipasto, la bruschetta. Per me, come primo, gli spaghetti al pomodoro e come contorno un'insalata. Da bere, una bottiglia d'acqua. Poi il conto, per favore.",
        'Come antipasto, come primo, come contorno; per me; da bere.', ['antipasto', 'primo', 'contorno'])

# ── 10. Speaking ──
L = lesson(10, 'Say It Out Loud', 'speaking')
L.read('Un chilo di pomodori, per favore.', 'Un chilo di.', ['chilo', 'pomodoro'])
L.read('Due etti di formaggio.', 'Etti, formaggio.', ['etto', 'formaggio'])
L.read('Mezzo chilo di mele.', 'Mezzo chilo.', ['mezzo', 'mela'])
L.read("Per me gli spaghetti e un'insalata.", 'Ordering at the table.', ['per me', 'spaghetti'])
L.read('Come secondo, il pesce.', 'Come secondo.', ['secondo', 'pesce'])
L.read('Scusi, non ho la forchetta.', 'Forchetta: the -tt- is double.', ['forchetta'])
L.read('Il conto, per favore.', 'Asking for the bill.', [])

for L in LESSONS:
    L.dump()
print('\n'.join(L.meta(L.n) for L in LESSONS))
