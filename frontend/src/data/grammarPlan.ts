import type { CEFRLevel } from '@/types';

/**
 * The A1 grammar units. Written ones have a reading and practice in data/grammar/;
 * the others show their outline as a placeholder.
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
  /** Written and reviewed. Others are listed under "Under construction" (unwritten ones show their outline). */
  ready?: boolean;
}

/**
 * Grammar-first order: dependencies and usefulness decide the sequence, and chapters are
 * built around it (docs/a1-grammar-inventory.md). `chapters` are provisional until the
 * chapter rework.
 */
export const GRAMMAR_PLAN: PlannedGrammarUnit[] = [
  {
    id: 'a1-first-phrases', level: 'A1', order: 1, title: 'First phrases', short: 'First phrases',
    covers: ['Formal and informal', 'Hello and goodbye', 'Please, thank you and sorry', 'How are you?', 'Names', "When you're lost", 'Wishes'],
    chapters: ['unit-01'],
    ready: true,
  },
  {
    id: 'a1-essere', level: 'A1', order: 2, title: 'Subject pronouns & essere', short: 'Essere',
    covers: ['Subject pronouns', 'Tu, Lei and voi', 'Dropping the pronoun', 'The present of essere', 'What essere is used for', 'Essere and stare', 'Questions and negatives'],
    chapters: ['unit-02'],
    ready: true,
  },
  {
    id: 'a1-numbers', level: 'A1', order: 3, title: 'Numbers 0–100', short: 'Numbers',
    covers: ['Numbers 0–20', 'Numbers 21–100', 'Numbers with nouns', 'Phone numbers'],
    chapters: ['unit-04'],
    ready: true,
  },
  {
    id: 'a1-avere', level: 'A1', order: 4, title: 'Avere', short: 'Avere',
    covers: ['The present of avere', 'The silent h', 'Age', 'Avere expressions: hunger, thirst, cold, need', 'Hot and cold: avere, essere or fare?', 'Essere or avere?'],
    chapters: ['unit-04', 'unit-05'],
    ready: true,
  },
  {
    id: 'a1-nouns-articles', level: 'A1', order: 5, title: 'Nouns & the article system', short: 'Articles',
    covers: ['Gender', 'Nouns in -e, invariable nouns, irregular plurals', 'Indefinite articles', 'Definite articles', 'Plurals', "C'è and ci sono"],
    chapters: ['unit-03'],
    ready: true,
  },
  {
    id: 'a1-regular-verbs', level: 'A1', order: 6, title: 'The present tense: regular verbs', short: 'Regular verbs',
    covers: ['The three verb groups', '-are verbs', '-ere verbs', '-ire verbs', '-isc- verbs', 'Using the present'],
    chapters: ['unit-07', 'unit-09', 'unit-10', 'unit-12'],
    ready: true,
  },
  {
    id: 'a1-irregular-verbs', level: 'A1', order: 7, title: 'The present tense: irregular verbs & modals', short: 'Irregular verbs',
    covers: ['Fare, andare, stare, venire, uscire, dare', 'Volere, potere, dovere', 'Vorrei', 'Per + infinitive'],
    chapters: ['unit-09', 'unit-10', 'unit-12', 'unit-15'],
    ready: true,
  },
  {
    id: 'a1-questions-negation', level: 'A1', order: 8, title: 'Questions, negation & linking', short: 'Questions & negation',
    covers: ['Question words', 'Word order in questions', 'Non and double negatives', 'Frequency adverbs', 'Linking: e, ma, perché, quando'],
    chapters: ['unit-11'],
  },
  {
    id: 'a1-adjectives', level: 'A1', order: 9, title: 'Adjectives, demonstratives & quantities', short: 'Adjectives',
    covers: ['Agreement (-o/-a/-i/-e)', 'Position', 'Invariable adjectives', 'Nationalities', 'Questo and quello', 'Molto, poco, tanto, tutto, qualche', 'Nessuno and niente'],
    chapters: ['unit-06', 'unit-07', 'unit-17'],
  },
  {
    id: 'a1-prepositions', level: 'A1', order: 10, title: 'Prepositions', short: 'Prepositions',
    covers: ['Simple prepositions', 'A and in with places', 'Articulated prepositions', 'Partitives (del, della…)', 'Transport'],
    chapters: ['unit-13', 'unit-14', 'unit-16'],
  },
  {
    id: 'a1-time-dates', level: 'A1', order: 11, title: 'Time & dates', short: 'Time & dates',
    covers: ['Ordinal numbers', 'Telling the time', 'Days, months, seasons', 'Dates'],
    chapters: ['unit-09', 'unit-19'],
  },
  {
    id: 'a1-possessives', level: 'A1', order: 12, title: 'Possessive adjectives', short: 'Possessives',
    covers: ['The forms', 'Agreement with the thing owned', 'The article', 'Family members', 'Suo and formal Suo', 'Other patterns', 'Typical mistakes'],
    chapters: ['unit-08'],
  },
  {
    id: 'a1-piacere', level: 'A1', order: 13, title: 'Piacere', short: 'Piacere',
    covers: ['Mi piace / mi piacciono', 'Indirect pronouns with piacere', 'Piacere + infinitive', 'Preferire'],
    chapters: ['unit-18'],
  },
  {
    id: 'a1-reflexive', level: 'A1', order: 14, title: 'Reflexive verbs', short: 'Reflexive verbs',
    covers: ['Reflexive pronouns', 'Placement', 'Common reflexive verbs'],
    chapters: ['unit-09'],
  },
  {
    id: 'a1-imperative', level: 'A1', order: 15, title: 'The imperative', short: 'Imperative',
    covers: ['Tu and voi commands', 'Negative commands', 'Common irregular forms (va’, fa’, di’)', 'Formal set phrases (scusi, senta)'],
    chapters: ['unit-13'],
  },
  {
    id: 'a1-passato-prossimo', level: 'A1', order: 16, title: 'The passato prossimo', short: 'Passato prossimo',
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
