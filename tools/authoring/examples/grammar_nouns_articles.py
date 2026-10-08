import json, os

# Example: writes to tools/authoring/out/, never over the real practice file.
OUT = os.path.join(os.path.dirname(__file__), '..', 'out')
os.makedirs(OUT, exist_ok=True)
UNIT = 'a1-nouns-articles'

def ex(sub, typ, prompt, ctx, ans, dist=None, hints=None, points=None):
    return dict(type=typ, subtype=sub, prompt={"text": prompt}, sentence_context=ctx,
                correct_answer=ans, distractors=dist or [], hints=hints or [], target_words=[],
                grammar_points=points or [])
MC = lambda *a, **k: ex('multiple_choice', 'vocab', *a, **k)
FB = lambda *a, **k: ex('fill_blank', 'writing', *a, **k)
TA = lambda *a, **k: ex('type_answer', 'writing', *a, **k)
TR = lambda *a, **k: ex('transformation', 'writing', *a, **k)
FM = lambda *a, **k: ex('find_mistake', 'writing', *a, **k)

G = 'gender'; HS = 'hard-start'; PL = 'plurals'; IN = 'indefinite'; DE = 'definite'; US = 'using-articles'; CE = 'ce-ci-sono'
GENDERS = ["masculine", "feminine", "either"]
def gender(word, ans, hint, pts=(G,)):
    return MC(f"Is '{word}' masculine or feminine?", "", ans, [g for g in GENDERS if g != ans], [hint], list(pts))

stops = [
 {"id": "gender", "title": "Masculine and feminine", "after": "Masculine and feminine", "exercises": [
  gender('casa', 'feminine', 'It ends in -a.'),
  gender('libro', 'masculine', 'It ends in -o.'),
  gender('stazione', 'feminine', 'Nouns in -zione are feminine.'),
  gender('dottore', 'masculine', 'Nouns in -ore are masculine.'),
  gender('problema', 'masculine', 'One of the exceptions: masculine in -a.'),
  gender('mano', 'feminine', 'One of the exceptions: feminine in -o.'),
  MC("Who can 'turista' describe?", "", "a man or a woman", ["only a man", "only a woman"], ["Nouns in -ista are the same for both."], [G]),
  FB("Complete: the female form of 'studente'.", "studente → ___", "studentessa", [], ["A special feminine form."], [G]),
  FB("Complete: the female form of 'amico'.", "amico → ___", "amica", [], ["-o becomes -a."], [G]),
 ]},
 {"id": "plurals", "title": "Plurals", "after": "Plurals", "exercises": [
  TA("Write the plural of 'libro'.", "", ["libri"], [], ["-o becomes -i."], [PL]),
  TA("Write the plural of 'casa'.", "", ["case"], [], ["-a becomes -e."], [PL]),
  TA("Write the plural of 'chiave'.", "", ["chiavi"], [], ["-e becomes -i."], [PL]),
  TA("Write the plural of 'problema'.", "", ["problemi"], [], ["A masculine noun in -a: -i."], [PL]),
  TA("Write the plural of 'amica'.", "", ["amiche"], [], ["Add h to keep the hard sound."], [PL]),
  TA("Write the plural of 'amico'.", "", ["amici"], [], ["The big exception: -co becomes -ci here."], [PL]),
  TA("Write the plural of 'figlio'.", "", ["figli"], [], ["-io loses the o."], [PL]),
  MC("What is the plural of 'caffè'?", "", "caffè", ["caffèi", "caffès"], ["Accented endings don't change."], [PL]),
  MC("What is the plural of 'bar'?", "", "bar", ["bari", "bars"], ["Consonant endings don't change."], [PL]),
  TA("Write the plural of 'uomo'.", "", ["uomini"], [], ["One of the irregular ones."], [PL]),
  FM("Fix the mistake.", "Due caffès, per favore.", ["Due caffè, per favore."], [], ["Accented endings don't change in the plural."], [PL]),
 ]},
 {"id": "indefinite", "title": "Un, uno, una, un'", "after": "Indefinite articles", "exercises": [
  FB("Add the right article: a book.", "___ libro", "un", [], ["Masculine, most words."], [IN]),
  FB("Add the right article: a backpack.", "___ zaino", "uno", [], ["Masculine, before z."], [IN]),
  FB("Add the right article: a student (man).", "___ studente", "uno", [], ["Masculine, before s + consonant."], [IN]),
  FB("Add the right article: a psychologist.", "___ psicologo", "uno", [], ["Ps is one of the hard starts."], [IN, HS]),
  FB("Add the right article: a pen.", "___ penna", "una", [], ["Feminine, before a consonant."], [IN]),
  FB("Add the right article: a friend (woman).", "___ amica", ["un'"], [], ["Feminine, before a vowel."], [IN]),
  FB("Add the right article: a friend (man).", "___ amico", "un", [], ["Masculine: no apostrophe."], [IN]),
  MC("Which means 'a female friend'?", "", "un'amica", ["un amica", "uno amica"], ["Feminine before a vowel: un'."], [IN]),
  FM("Fix the mistake.", "Ho un zaino.", ["Ho uno zaino."], [], ["Before z, uno."], [IN]),
 ]},
 {"id": "definite", "title": "Il, lo, l', la, i, gli, le", "after": "Definite articles", "exercises": [
  FB("Add 'the'.", "___ libro", "il", [], ["Masculine, most words."], [DE]),
  FB("Add 'the'.", "___ zaino", "lo", [], ["Masculine, before z."], [DE]),
  FB("Add 'the'.", "___ yogurt", "lo", [], ["Y is one of the rarer hard starts."], [DE, HS]),
  FB("Add 'the'.", "___ amico", ["l'"], [], ["Before a vowel."], [DE]),
  FB("Add 'the'.", "___ casa", "la", [], ["Feminine, before a consonant."], [DE]),
  FB("Add 'the'.", "___ libri", "i", [], ["The plural of il."], [DE]),
  FB("Add 'the'.", "___ zaini", "gli", [], ["The plural of lo."], [DE]),
  FB("Add 'the'.", "___ amici", "gli", [], ["The plural of l' (masculine)."], [DE]),
  FB("Add 'the'.", "___ amiche", "le", [], ["The feminine plural is always le."], [DE]),
  TR("Make it plural.", "lo studente", ["gli studenti"], [], ["Lo becomes gli; -e becomes -i."], [DE, PL]),
  TR("Make it plural.", "l'amica", ["le amiche"], [], ["Feminine plural: le, and -ca becomes -che."], [DE, PL]),
  TR("Make it plural.", "il problema", ["i problemi"], [], ["Il becomes i; problema is masculine."], [DE, PL]),
  FM("Fix the mistake.", "i amici", ["gli amici"], [], ["Gli before a vowel."], [DE]),
 ]},
 {"id": "using-ce", "title": "Using the article, c'è and ci sono", "after": "C'è and ci sono", "exercises": [
  MC("You meet Mr Rossi in the street. How do you greet him?", "", "Buongiorno, signor Rossi!", ["Buongiorno, il signor Rossi!", "Buongiorno, signore Rossi!"],
     ["No article when you speak to him; signore becomes signor before a name."], [US]),
  MC("You tell a friend that Mr Rossi is a doctor.", "", "Il signor Rossi è medico.", ["Signor Rossi è medico.", "Il signore Rossi è medico."],
     ["Talking about him: il signor Rossi."], [US]),
  MC("How do you say 'Italy is beautiful'?", "", "L'Italia è bella.", ["Italia è bella.", "La Italia è bella."], ["Countries take the article, l' before a vowel."], [US]),
  MC("How do you say 'I speak Italian, but Italian is hard'?", "", "Parlo italiano, ma l'italiano è difficile.", ["Parlo l'italiano, ma italiano è difficile.", "Parlo italiano, ma italiano è difficile."], ["No article after parlare; the article when the language is the topic."], [US]),
  FB("Complete: I'm at home.", "Sono a ___.", "casa", [], ["A casa: no article."], [US]),
  FB("Complete: there's a bar here.", "___ un bar qui.", ["C'è", "c'è"], [], ["Singular: c'è."], [CE]),
  FB("Complete: there are two bars here.", "___ due bar qui.", ["Ci sono", "ci sono"], [], ["Plural: ci sono."], [CE]),
  MC("You're new in town. How do you ask if there's a pharmacy?", "", "C'è una farmacia?", ["Ci sono una farmacia?", "È una farmacia?"],
     ["Whether one exists: c'è + un/una."], [CE]),
  MC("You know there's a station. How do you ask where it is?", "", "Dov'è la stazione?", ["C'è la stazione?", "Ci sono la stazione?"],
     ["Where a particular one is: dov'è + il/la."], [CE]),
  TR("Make it negative.", "C'è un bar.", ["Non c'è un bar."], [], ["Non before c'è."], [CE]),
  TR("Make it plural, with two.", "C'è un libro.", ["Ci sono due libri."], [], ["Ci sono, and a plural noun."], [CE, PL]),
  FM("Fix the mistake.", "C'è due bar.", ["Ci sono due bar."], [], ["Two bars: plural."], [CE]),
 ]},
]

mastery = [
  FB("Add 'the'.", "___ stazione", "la", points=[DE, G]),
  FB("Add 'the'.", "___ sport", "lo", points=[DE]),
  FB("Add 'the'.", "___ uomo", ["l'"], points=[DE]),
  FB("Add 'the'.", "___ studenti", "gli", points=[DE]),
  FB("Add 'the'.", "___ psicologi", "gli", points=[DE, HS]),
  FB("Add the right article: an idea.", "___ idea", ["un'"], points=[IN]),
  FB("Add the right article: a problem.", "___ problema", "un", points=[IN, G]),
  MC("Is 'colore' masculine or feminine?", "", "masculine", ["feminine", "either"], points=[G]),
  TR("Make it plural.", "la città", ["le città"], points=[DE, PL]),
  TR("Make it plural.", "il medico", ["i medici"], points=[DE, PL]),
  TR("Make it plural.", "la mano", ["le mani"], points=[DE, PL]),
  FM("Fix the mistake.", "la problema", ["il problema"], points=[G]),
  FM("Fix the mistake.", "C'è tre studenti.", ["Ci sono tre studenti."], points=[CE]),
  FM("Fix the mistake.", "Buonasera, la signora Bianchi!", ["Buonasera, signora Bianchi!"], points=[US]),
  MC("How do you ask 'Is there a bar?'", "", "C'è un bar?", ["Ci sono un bar?", "È un bar?"], points=[CE]),
  MC("How do you say 'France is big'?", "", "La Francia è grande.", ["Francia è grande.", "Il Francia è grande."], points=[US]),
  TA("Say 'There are two students here.'", "", ["ci sono due studenti qui", "qui ci sono due studenti"], points=[CE, PL]),
]

points = {
  G: {"label": "Masculine and feminine", "section": "Masculine and feminine"},
  PL: {"label": "Plurals", "section": "Plurals"},
  HS: {"label": "Il or lo?", "section": "Il or lo?"},
  IN: {"label": "Un, uno, una, un'", "section": "Indefinite articles"},
  DE: {"label": "Il, lo, l', la, i, gli, le", "section": "Definite articles"},
  US: {"label": "When to use the article", "section": "When to use the article"},
  CE: {"label": "C'è and ci sono", "section": "C'è and ci sono"},
}

n = 0
for s in stops:
    for e in s['exercises']:
        n += 1; e['id'] = f"{UNIT}-p-{n:02d}"
for i, e in enumerate(mastery, 1):
    e['id'] = f"{UNIT}-m-{i:02d}"
used = {p for s in stops for e in s['exercises'] for p in e['grammar_points']} | {p for e in mastery for p in e['grammar_points']}
assert used <= set(points), used - set(points)
order = lambda e: {'id': e['id'], **{k: v for k, v in e.items() if k != 'id'}}
out = {"unit_id": UNIT, "points": points,
       "stops": [{"id": s['id'], "title": s['title'], "after": s['after'], "exercises": [order(e) for e in s['exercises']]} for s in stops],
       "mastery": {"pass_mark": 0.85, "exercises": [order(e) for e in mastery]}}
json.dump(out, open(os.path.join(OUT, 'a1-nouns-articles.practice.json'), 'w'), ensure_ascii=False, indent=2)
print([(s['id'], len(s['exercises'])) for s in stops], sum(len(s['exercises']) for s in stops), len(mastery))
