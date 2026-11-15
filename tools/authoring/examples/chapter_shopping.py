"""Chapter 'Shopping' (unit-17), after the Adjectives unit and Describing People & Things.

Available: units 1–10 (adjective agreement, blu/rosa invariable, questo/quello, molto/poco/tanto/troppo),
chapters 1–12 (prices and costare from At the Café, portare from Around Town, largo/stretto/lungo/corto
from Describing). Not yet: object pronouns (no 'la prendo'), indirect pronouns (no 'ti sta bene'),
clock times and days, piacere, the imperative, the past, comparisons (no 'una taglia più grande').
Cast: Giulia's class (Emma, Tomás, Yuki and Aiko, Paul); Rita runs a clothes shop in the centre.
"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from chapterlib import Lesson, V

U = 'unit-17'
D = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'out', U)
os.makedirs(D, exist_ok=True)
LESSONS = []
def lesson(n, name, role):
    L = Lesson(U, D, n, name, role); LESSONS.append(L); return L

# ── 1. Clothes ──
L = lesson(1, 'Clothes', 'words')
L.vocab = [
    V('maglietta', 'T-shirt', 'Una maglietta bianca.'),
    V('camicia', 'shirt · camicie (plural)', 'Paul porta sempre la camicia.'),
    V('maglione', 'jumper, sweater', 'Un maglione rosso e caldo.'),
    V('pantaloni', 'trousers (always plural)', 'Questi pantaloni sono troppo lunghi.'),
    V('gonna', 'skirt', 'Una gonna corta e nera.'),
    V('vestito', 'dress; suit (for a man)', 'Un vestito verde.'),
    V('giacca', 'jacket · giacche (plural)', 'Questa giacca è comoda.'),
    V('cappotto', 'coat', 'Fa freddo: porto il cappotto.'),
    V('scarpe', 'shoes · una scarpa = one shoe', 'Le scarpe nere sono care.'),
    V('calza', 'sock; stocking · calze (plural)', 'Le calze sono sotto il letto.'),
    V('cappello', 'hat', 'Tomás ha un cappello blu.'),
]
L.meaning('maglione', 'Un maglione rosso e caldo.', ['jumper', 'sweater', 'a jumper', 'a sweater'], 'You wear it when it is cold.', ['maglione'])
L.meaning('gonna', 'Una gonna corta e nera.', ['skirt', 'a skirt'], 'Corta: short.', ['gonna'])
L.mc('Which do you wear on your feet?', 'le scarpe', ['il cappello', 'la giacca'], 'On your feet.', ['scarpe', 'cappello', 'giacca'])
L.mc('Paul is going to work at the hospital. What does he wear under his jacket?', 'una camicia', ['una gonna', 'un cappotto'], 'A shirt.', ['camicia', 'gonna', 'cappotto'])
L.cloze('Make it agree: a white T-shirt.', 'Una maglietta ___.', 'bianca', 'Maglietta is feminine.', ['maglietta'])
L.cloze('Make it agree: The trousers are too long.', 'I pantaloni sono troppo ___.', 'lunghi', 'Pantaloni is masculine plural: -ghi.', ['pantaloni'])
L.cloze('Make it agree: The shoes are black.', 'Le scarpe sono ___.', 'nere', 'Scarpe is feminine plural.', ['scarpe'])
L.cloze('Make it agree: two blue hats.', 'Due cappelli ___.', 'blu', 'Blu never changes.', ['cappello'])
L.cloze('Make it agree: The jackets are red.', 'Le giacche sono ___.', 'rosse', 'Giacche: feminine plural.', ['giacca'])
L.say('Say: a green dress.', ['un vestito verde'], 'Vestito is masculine.', ['vestito'])
L.say("Say: It's cold. I'm wearing my coat.", ['fa freddo, porto il cappotto', 'fa freddo. porto il cappotto'], 'Portare also means to wear. Use il, not a possessive.', ['cappotto'])
L.arrange("Arrange: 'The socks are under the bed.'", 'Le calze sono sotto il letto.', ['calzi', 'sopra'], 'Calze: feminine plural.', ['calza'])

# ── 2. Size and Colour ──
L = lesson(2, 'Size and Colour', 'words')
L.vocab = [
    V('taglia', 'size (clothes) · Che taglia porta? = What size are you? (formal) · Porto la 42 = I take a 42', 'Che taglia porta?'),
    V('provare', 'to try; to try on', 'Posso provare questa giacca?'),
    V('camerino', 'fitting room, changing room', 'Il camerino è lì.'),
    V('grigio', 'grey · grigi, grigie (plural)', 'Un maglione grigio.'),
    V('marrone', 'brown · marroni (plural)', 'Le scarpe marroni sono comode.'),
    V('brutto', 'ugly; bad', 'Quel cappello è brutto!'),
]
L.meaning('provare', 'Posso provare questa giacca?', ['to try on', 'try on', 'to try', 'try'], 'Before you buy.', ['provare'])
L.meaning('brutto', 'Quel cappello è brutto!', ['ugly', 'horrible'], 'The opposite of bello.', ['brutto'])
L.mc('In a clothes shop: where do you try things on?', 'nel camerino', ['alla cassa', 'in cucina'], 'A small room in the shop.', ['camerino'])
L.mc('Shoes have a numero. What do clothes have?', 'una taglia', ['un numero', 'un prezzo'], 'Che taglia porta?', ['taglia'])
L.cloze('Make it agree: grey trousers.', 'Dei pantaloni ___.', 'grigi', 'Grigio, masculine plural: one i.', ['grigio', 'pantaloni'])
L.cloze('Make it agree: brown shoes.', 'Le scarpe ___.', 'marroni', 'An -e adjective: -i in the plural.', ['marrone', 'scarpe'])
L.cloze('Make it agree: an ugly skirt.', 'Una gonna ___.', 'brutta', 'Gonna is feminine.', ['brutto', 'gonna'])
L.line('The shop assistant asks your size. You take a 40.',
       [{"speaker": "Commessa", "text": "Che taglia porta?"}, {"speaker": "You"}],
       ['Porto la 40.', 'La 40.'], 'Porto la + the number.', ['taglia'])
L.say('Ask if you can try on this jumper.', ['posso provare questo maglione?'], 'Posso + provare.', ['provare', 'maglione'])
L.mc('Which is correct?', 'una camicia grigia', ['una camicia grigio', 'una grigia camicia'], 'Colours go after the noun and agree.', ['grigio', 'camicia'])
L.say('Say the brown coat is ugly.', ['il cappotto marrone è brutto'], 'Colour after the noun.', ['marrone', 'brutto'])

# ── 3. At the Till ──
L = lesson(3, 'At the Till', 'words')
L.vocab = [
    V('negozio di abbigliamento', 'clothes shop · abbigliamento = clothing', 'C\'è un negozio di abbigliamento in centro.'),
    V('cassa', 'till, checkout', 'Pago alla cassa.'),
    V('contanti', 'cash (always plural) · in contanti = in cash', 'Pago in contanti.'),
    V('scontrino', 'receipt', 'Ecco lo scontrino.'),
    V('sconto', 'discount · il 20% di sconto = 20% off', 'C\'è uno sconto del venti per cento.'),
    V('saldi', 'the sales · in saldo = on sale', 'Oggi ci sono i saldi!'),
    V('regalo', 'present, gift', 'È un regalo per Emma.'),
    V('centesimo', 'cent · € 9,90 = nove euro e novanta (centesimi)', 'Costa novanta centesimi.'),
]
L.meaning('scontrino', 'Ecco lo scontrino.', ['receipt', 'the receipt', 'a receipt'], 'The paper you get after paying.', ['scontrino'])
L.meaning('regalo', 'È un regalo per Emma.', ['present', 'gift', 'a present', 'a gift'], 'For a birthday.', ['regalo'])
L.mc('How do you say you want to pay in cash?', 'Pago in contanti.', ['Pago con la carta.', 'Pago alla cassa.'], 'Cash: contanti.', ['contanti', 'cassa'])
L.mc("A sign says 'Saldi: -30%'. What does it mean?", "It's the sales: 30% off", ['Prices go up by 30%', 'Only 30 items left'], 'Saldi: the sales.', ['saldi'])
L.cloze('Complete: Today there are the sales!', 'Oggi ci sono i ___!', 'saldi', 'The sales.', ['saldi'])
L.cloze('Complete: It costs ninety cents.', 'Costa novanta ___.', 'centesimi', 'Centesimo, plural.', ['centesimo'])
L.cloze('Complete: a shop that sells clothes.', 'Un negozio di ___.', 'abbigliamento', 'Clothing.', ['negozio di abbigliamento'])
L.cloze('Complete: The till is there.', 'La ___ è lì.', 'cassa', 'Where you pay.', ['cassa'])
L.cloze('Complete: There is a discount.', 'C\'è uno ___.', 'sconto', 'Uno before s + consonant.', ['sconto'])
L.mc('How do you read € 4,50?', 'quattro euro e cinquanta', ['quattro euro e cinque', 'quarantacinque euro'], 'Euros, then the cents.', ['centesimo'])
L.say('Ask if you can pay by card.', ['posso pagare con la carta?'], 'Posso + pagare.', [])
L.line('At the till, the assistant gives you the receipt. Say thank you and goodbye.',
       [{"speaker": "Commessa", "text": "Ecco lo scontrino. Buona giornata!"}, {"speaker": "You"}],
       ['Grazie, arrivederci!', 'Grazie mille, buona giornata!'], 'Thanks and goodbye.', ['scontrino'])
L.say("Say it's a present for Paul.", ['è un regalo per paul'], 'Per + the person.', ['regalo'])

# ── 4. In the Shop (practice) ──
L = lesson(4, 'In the Shop', 'practice')
L.line("You're in a clothes shop. The assistant greets you. You're looking for a jumper.",
       [{"speaker": "Commessa", "text": "Buongiorno!"}, {"speaker": "You"}],
       ['Buongiorno, cerco un maglione.', 'Vorrei un maglione, per favore.'], 'Cerco… or Vorrei…', ['maglione'])
L.line('The assistant shows you a grey one. You want it in blue.',
       [{"speaker": "Commessa", "text": "Questo grigio va bene?"}, {"speaker": "You"}],
       ['Avete questo maglione in blu?', 'Avete questo in blu?'], 'Avete… in blu?', ['grigio'])
L.line('You want to try it on.',
       [{"speaker": "Commessa", "text": "Ecco il maglione blu."}, {"speaker": "You"}],
       ['Posso provare questo maglione?', 'Grazie. Dov\'è il camerino?'], 'Posso provare…? or ask for the fitting room.', ['provare', 'camerino'])
L.line("You come out of the fitting room. It's too tight. Ask for a 44.",
       [{"speaker": "Commessa", "text": "Allora, com'è?"}, {"speaker": "You"}],
       ['È troppo stretto. Avete la 44?', 'Un po\' stretto. C\'è la 44?'], 'Maglione is masculine: stretto.', ['taglia'])
L.line("The 44 is perfect. Ask how much it costs.",
       [{"speaker": "Commessa", "text": "Ecco la 44."}, {"speaker": "You"}],
       ['Perfetto! Quanto costa?', 'Va bene. Quanto costa?'], 'Quanto costa?', [])
L.line("It's on sale. You'll take it.",
       [{"speaker": "Commessa", "text": "Costa sessanta euro, ma oggi c'è il trenta per cento di sconto."}, {"speaker": "You"}],
       ['Bene, prendo questo.', 'Perfetto, prendo questo maglione.'], 'Prendo questo.', ['sconto'])
L.line('At the till, you want to pay by card.',
       [{"speaker": "Commessa", "text": "Paga in contanti?"}, {"speaker": "You"}],
       ['No, con la carta, per favore.', 'Posso pagare con la carta?'], 'Con la carta.', ['contanti'])
L.mc("The assistant says 'Costa quarantadue euro'. How much is it?", '€ 42', ['€ 32', '€ 24'], 'Quaranta + due.', [])

# ── 5. This One or That One? (practice: questo/quello) ──
L = lesson(5, 'This One or That One?', 'practice')
L.cloze('That coat (over there).', '___ cappotto è caro.', 'Quel', 'Quel before most masculine nouns.', ['cappotto'])
L.cloze('Those trousers (over there).', 'Quanto costano ___ pantaloni?', 'quei', 'Masculine plural before a consonant.', ['pantaloni'])
L.cloze('Those glasses (over there).', 'Quanto costano ___ occhiali?', 'quegli', 'Before a vowel: quegli.', [])
L.cloze('Those shoes (over there).', '___ scarpe sono belle.', 'Quelle', 'Feminine plural.', ['scarpe'])
L.cloze('These socks.', '___ calze sono care.', 'Queste', 'Feminine plural.', ['calza'])
L.mc('One thing or more? Choose the right verb.', 'Quanto costano queste scarpe?', ['Quanto costa queste scarpe?', 'Quanto costano questa scarpe?'], 'Plural things: costano.', ['scarpe'])
L.mc('One thing or more? Choose the right verb.', 'Quanto costa quella giacca?', ['Quanto costano quella giacca?', 'Quanto costa quelle giacca?'], 'One jacket: costa.', ['giacca'])
L.line('You and a friend are choosing a skirt. Your friend asks which one. You prefer the black one.',
       [{"speaker": "Friend", "text": "Quale gonna prendo? Quella rossa o quella nera?"}, {"speaker": "You"}],
       ['Quella nera.', 'Quella nera: è bella e costa poco.'],
       'Quella + the colour.', ['gonna'])
L.line('Your friend points at shirts. You think the white ones are nicer than the grey ones.',
       [{"speaker": "Friend", "text": "Queste camicie grigie sono belle, no?"}, {"speaker": "You"}],
       ['Preferisco quelle bianche.', 'Sono belle, ma preferisco quelle bianche.'],
       'Quelle + the colour, feminine plural.', ['camicia', 'grigio'])
L.fix('Fix the mistake.', 'Quel scarpe sono troppo strette.', ['quelle scarpe sono troppo strette'], 'Scarpe is feminine plural.', ['scarpe'])
L.fix('Fix the mistake.', 'Questo pantaloni sono comodi.', ['questi pantaloni sono comodi'], 'Pantaloni is plural.', ['pantaloni'])
L.say('Ask how much that hat costs.', ['quanto costa quel cappello?'], 'Quel before cappello.', ['cappello'])
L.arrange("Arrange: 'These brown shoes cost ninety euros.'", 'Queste scarpe marroni costano novanta euro.', ['costa', 'marrone'], 'Plural: costano.', ['scarpe', 'marrone'])

# ── 6. Sale at Rita's (reading: a shop notice) ──
FLYER = {"title": "Saldi da Rita", "paragraphs": [
    "Rita · abbigliamento · via dei Servi 12, Firenze",
    "Saldi! Da oggi tutto il negozio è in saldo.",
    "Magliette: € 9,90 (prima € 19,90)",
    "Camicie bianche e blu: € 25 (prima € 50)",
    "Maglioni grigi e marroni: il 30% di sconto",
    "Gonne e vestiti: metà prezzo",
    "Giacche e cappotti: il 40% di sconto",
    "Scarpe da donna e da uomo, tutti i numeri: da € 39",
    "Calze: € 3, o quattro paia a € 10",
    "Cappelli: senza sconto, ma molto belli!",
    "Potete provare tutto: i camerini sono dietro la cassa. Alla cassa potete pagare in contanti o con la carta.",
    "Attenzione: per cambiare i vestiti in saldo, avete bisogno dello scontrino.",
]}
L = lesson(6, "Sale at Rita's", 'reading')
L.reading = FLYER
L.vocab = [
    V('paio', 'pair · paia (plural, feminine): due paia di scarpe', 'Un paio di calze.'),
    V('da donna', "women's (clothes, shoes) · da uomo = men's", 'Scarpe da donna.'),
]
L.mc('What is this text?', "Rita's sale prices", ["Rita's receipt", "Rita's shopping list"], "'Saldi!'", ['saldi'])
L.mc('How much does a T-shirt cost now?', '€ 9,90', ['€ 19,90', '€ 25'], "'Prima' is the old price.", ['maglietta'])
L.mc('Which are half price?', 'Skirts and dresses', ['Jackets and coats', 'Shirts'], "'Metà prezzo.'", ['gonna', 'vestito'])
L.mc('Which have no discount?', 'Hats', ['Socks', 'Shoes'], "'Senza sconto.'", ['cappello', 'sconto'])
L.mc('A coat cost € 100. What does it cost now?', '€ 60', ['€ 40', '€ 50'], '40% off.', ['cappotto'])
L.mc('Where are the fitting rooms?', 'Behind the till', ['Next to the door', 'In another shop'], "'Dietro la cassa.'", ['camerino', 'cassa'])
L.mc('What do you need to exchange something bought in the sale?', 'The receipt', ['Cash', 'The card'], "'Lo scontrino.'", ['scontrino'])
L.cloze('Complete from the text: four pairs of socks.', 'Quattro ___ di calze.', 'paia', 'Paio, plural: paia.', ['paio'])
L.cloze("Complete from the text: women's shoes.", 'Scarpe da ___.', 'donna', "Women's: da donna.", ['da donna'])
L.answer('Quanto costano le camicie?', ['venticinque euro', 'costano venticinque euro', '25 euro'], 'Read the line about shirts.', ['camicia'])
L.answer('Come potete pagare?', ['in contanti o con la carta', 'in contanti o con la carta.'], 'Read the line about the till.', ['contanti'])

# ── 7. A Present for Tomás (reading: a story) ──
L = lesson(7, 'A Present for Tomás', 'reading')
L.reading = {"title": "Un regalo per Tomás", "paragraphs": [
    "Domani è il compleanno di Tomás, e Yuki e Aiko cercano un regalo. Vanno insieme da Rita, il negozio di abbigliamento in centro: oggi ci sono i saldi.",
    "Aiko vede subito una maglietta gialla con un grande gatto nero. «Questa! È divertente!» Yuki non è d'accordo: «È brutta, Aiko. E Tomás è timido: porta sempre il grigio o il blu.»",
    "Allora Yuki prende un maglione grigio, semplice e comodo. Costa quaranta euro, ma è in saldo: con il trenta per cento di sconto costa ventotto euro.",
    "«Che taglia porta Tomás?» domanda Rita. Le sorelle non sanno. «È basso e magro» dice Yuki, «come Aiko.»",
    "Aiko prova il maglione nel camerino. Le maniche sono un po' lunghe, ma per il resto va bene. «Allora prendiamo questo» dice Yuki.",
    "Alla cassa Yuki paga in contanti. Rita dà lo scontrino: «Se la taglia non va bene, Tomás può cambiare il maglione. Ma ha bisogno dello scontrino.»",
    "Fuori dal negozio, Aiko dice: «Un momento!» Torna dentro e dopo cinque minuti esce con una borsa piccola.",
    "«Che cosa hai?» domanda Yuki. Aiko apre la borsa: dentro c'è la maglietta gialla con il gatto nero. «Questa è per me!»",
]}
L.vocab = [
    V('semplice', 'simple, plain', 'Un maglione semplice e comodo.'),
    V('manica', 'sleeve · maniche (plural)', 'Le maniche sono lunghe.'),
    V('per il resto', 'otherwise, apart from that', 'È un po\' caro, ma per il resto va bene.'),
]
L.mc('Why are Yuki and Aiko in the shop?', "They're looking for a birthday present for Tomás", ["They're buying clothes for school", 'Aiko needs a new jumper'], 'Read the first paragraph.', ['regalo'])
L.mc("Why doesn't Yuki want the yellow T-shirt?", "She thinks it's ugly, and Tomás wears grey or blue", ["It's too expensive", "It's too big"], 'Read the second paragraph.', ['brutto'])
L.mc('How much does the jumper cost with the discount?', '€ 28', ['€ 40', '€ 30'], "'Con il trenta per cento di sconto…'", ['sconto'])
L.mc('Why does Aiko try on the jumper?', "She's short and thin, like Tomás", ['She wants it for herself', 'Rita asks her to'], 'Read the fourth paragraph.', ['provare'])
L.mc('What is not quite right with the jumper?', 'The sleeves are a bit long', ["It's too tight", 'The colour'], "'Le maniche…'", ['manica'])
L.mc('What does Tomás need to exchange the jumper?', 'The receipt', ['Yuki', 'The bag'], "'Ha bisogno dello scontrino.'", ['scontrino'])
L.mc('What does Aiko buy at the end?', 'The yellow T-shirt, for herself', ['Another jumper for Tomás', 'A bag'], 'Read the last paragraph.', ['maglietta'])
L.cloze('Complete from the text: the sleeves are a bit long.', "Le ___ sono un po' lunghe.", 'maniche', 'Manica, plural: -che.', ['manica'])
L.cloze('Complete from the text: a simple, comfortable jumper.', 'Un maglione ___ e comodo.', 'semplice', 'Simple.', ['semplice'])
L.cloze('Complete from the text: apart from that, it is fine.', 'Per il ___ va bene.', 'resto', 'Otherwise: per il resto.', ['per il resto'])
L.answer('Come paga Yuki?', ['in contanti', 'paga in contanti', 'Yuki paga in contanti'], 'Read the paragraph about the till.', ['contanti'])
L.answer('Di che colore è il maglione?', ['grigio', 'è grigio', 'il maglione è grigio'], 'Read the third paragraph.', ['grigio'])

# ── 8–9. Writing ──
L = lesson(8, 'Going to the Sale', 'writing')
L.reading = FLYER
L.write("You're going to the sale at Rita's. Write a message to a friend: what you want to buy there, in which colours, and how much it costs now.",
        "Ciao Marta! Oggi ci sono i saldi da Rita, in via dei Servi. Io vorrei comprare una giacca e due magliette. Le giacche hanno il 40% di sconto e le magliette costano solo € 9,90. Cerco una giacca nera o grigia, e le magliette bianche. Vieni anche tu? Ci sono anche vestiti a metà prezzo!",
        'Vorrei comprare… / Cerco… Check every colour agrees, and costa or costano.', ['saldi', 'sconto', 'giacca'])
L = lesson(9, 'What I Wear', 'writing')
L.write('Describe what you usually wear: for work or study, at home, and when it is cold. Say the colours.',
        "Per il lavoro porto i pantaloni neri o grigi e una camicia bianca o blu. A casa porto una maglietta e dei pantaloni comodi. Quando fa freddo porto un maglione e un cappotto marrone, e a volte un cappello. Non porto quasi mai la gonna.",
        'Porto… Colours after the noun, and they agree. Blu and rosa never change.', ['pantaloni', 'camicia', 'maglione'])

# ── 10. Speaking ──
L = lesson(10, 'Say It Out Loud', 'speaking')
L.read('Posso provare questa giacca?', 'Posso provare…?', ['provare', 'giacca'])
L.read('Che taglia porta? Porto la 42.', 'Taglia: the gl sounds like the lli in million.', ['taglia'])
L.read('Quanto costano quelle scarpe marroni?', 'Costano: plural.', ['scarpe', 'marrone'])
L.read('Pago in contanti.', 'Contanti.', ['contanti'])
L.read('Ecco lo scontrino.', 'Lo before sc-.', ['scontrino'])
L.read('Questi pantaloni sono troppo stretti.', 'Pantaloni: plural.', ['pantaloni'])
L.read('Il maglione grigio costa ventotto euro.', 'Grigio: one i sound.', ['grigio', 'maglione'])

for L in LESSONS:
    L.dump()
print('\n'.join(L.meta(L.n) for L in LESSONS))
