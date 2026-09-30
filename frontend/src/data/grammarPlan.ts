import type { CEFRLevel } from '@/types';

/**
 * The planned A1 grammar units (docs/structure-design.md). None are written yet;
 * pages show them as placeholders until their content exists in data/grammar/.
 */
export interface PlannedGrammarUnit {
  id: string;
  level: CEFRLevel;
  order: number;
  title: string;
  /** Short name for chips on chapter cards */
  short: string;
  /** What the unit will cover, used as its outline until it's written */
  covers: string[];
  /** Chapters (unit ids) that use this grammar */
  chapters: string[];
}

/**
 * Grammar-first order: dependencies and usefulness decide the sequence, and chapters are
 * built around it (docs/a1-grammar-inventory.md). `chapters` are provisional until the
 * chapter rework.
 */
export const GRAMMAR_PLAN: PlannedGrammarUnit[] = [
  {
    id: 'a1-essere', level: 'A1', order: 1, title: 'Subject pronouns & essere', short: 'Essere',
    covers: ['Subject pronouns', 'Tu, Lei and voi', 'Dropping the pronoun', 'The present of essere', 'What essere is used for', 'Essere and stare', 'Questions and negatives'],
    chapters: ['unit-02'],
  },
  {
    id: 'a1-avere', level: 'A1', order: 2, title: 'Avere', short: 'Avere',
    covers: ['The present of avere', 'The silent h', 'Age', 'Avere expressions: hunger, thirst, cold, need', 'Hot and cold: avere, essere or fare?', 'Essere or avere?'],
    chapters: ['unit-05'],
  },
  {
    id: 'a1-nouns-articles', level: 'A1', order: 3, title: 'Nouns & the article system', short: 'Articles',
    covers: ['Gender', 'Nouns in -e, invariable nouns, irregular plurals', 'Indefinite articles', 'Definite articles', 'Plurals', "C'è and ci sono"],
    chapters: ['unit-03'],
  },
  {
    id: 'a1-present-tense', level: 'A1', order: 4, title: 'The present tense', short: 'Present tense',
    covers: ['-are verbs', '-ere verbs', '-ire and -isc- verbs', 'Key irregular verbs', 'Modal verbs: volere, potere, dovere', 'Vorrei', 'Per + infinitive'],
    chapters: ['unit-07', 'unit-09', 'unit-10', 'unit-12', 'unit-15'],
  },
  {
    id: 'a1-questions-negation', level: 'A1', order: 5, title: 'Questions, negation & linking', short: 'Questions & negation',
    covers: ['Question words', 'Word order in questions', 'Non and double negatives', 'Frequency adverbs', 'Linking: e, ma, perché, quando'],
    chapters: ['unit-11'],
  },
  {
    id: 'a1-adjectives', level: 'A1', order: 6, title: 'Adjectives, demonstratives & quantities', short: 'Adjectives',
    covers: ['Agreement (-o/-a/-i/-e)', 'Position', 'Invariable adjectives', 'Nationalities', 'Questo and quello', 'Molto, poco, tanto, tutto, qualche', 'Nessuno and niente'],
    chapters: ['unit-06', 'unit-07', 'unit-17'],
  },
  {
    id: 'a1-prepositions', level: 'A1', order: 7, title: 'Prepositions', short: 'Prepositions',
    covers: ['Simple prepositions', 'A and in with places', 'Articulated prepositions', 'Partitives (del, della…)', 'Transport'],
    chapters: ['unit-13', 'unit-14', 'unit-16'],
  },
  {
    id: 'a1-numbers-time', level: 'A1', order: 8, title: 'Numbers, time & dates', short: 'Numbers & time',
    covers: ['Numbers 0–100', 'Ordinal numbers', 'Telling the time', 'Days, months, seasons', 'Dates'],
    chapters: ['unit-04', 'unit-09', 'unit-19'],
  },
  {
    id: 'a1-possessives', level: 'A1', order: 9, title: 'Possessive adjectives', short: 'Possessives',
    covers: ['The forms', 'Agreement with the thing owned', 'The article', 'Family members', 'Suo and formal Suo', 'Other patterns', 'Typical mistakes'],
    chapters: ['unit-08'],
  },
  {
    id: 'a1-piacere', level: 'A1', order: 10, title: 'Piacere', short: 'Piacere',
    covers: ['Mi piace / mi piacciono', 'Indirect pronouns with piacere', 'Piacere + infinitive', 'Preferire'],
    chapters: ['unit-18'],
  },
  {
    id: 'a1-reflexive', level: 'A1', order: 11, title: 'Reflexive verbs', short: 'Reflexive verbs',
    covers: ['Reflexive pronouns', 'Placement', 'Common reflexive verbs'],
    chapters: ['unit-09'],
  },
  {
    id: 'a1-imperative', level: 'A1', order: 12, title: 'The imperative', short: 'Imperative',
    covers: ['Tu and voi commands', 'Negative commands', 'Common irregular forms (va’, fa’, di’)', 'Formal set phrases (scusi, senta)'],
    chapters: ['unit-13'],
  },
  {
    id: 'a1-passato-prossimo', level: 'A1', order: 13, title: 'The passato prossimo', short: 'Passato prossimo',
    covers: ['Forming the past participle', 'Avere or essere?', 'Agreement with essere', 'Common irregular participles', 'Reflexive verbs in the past', 'Time expressions: ieri, la settimana scorsa, fa'],
    chapters: ['unit-20'],
  },
];

export function grammarForChapter(unitId: string): PlannedGrammarUnit[] {
  return GRAMMAR_PLAN.filter((g) => g.chapters.includes(unitId));
}

export function getPlannedGrammarUnit(id: string): PlannedGrammarUnit | undefined {
  return GRAMMAR_PLAN.find((g) => g.id === id);
}
