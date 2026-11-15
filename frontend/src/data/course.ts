/**
 * The order a learner goes through A1: grammar units and chapters, interleaved. A chapter comes
 * after every grammar unit it needs. This is the one place the sequence is defined; the content
 * check uses it to know what a learner has been taught at each point, and the recommended course
 * in Today can use it later.
 *
 * Only the parts that are written are listed. Later units and chapters are added as they're built.
 */
export type CourseStep = { kind: 'grammar'; id: string } | { kind: 'chapter'; id: string };

const g = (id: string): CourseStep => ({ kind: 'grammar', id });
const c = (id: string): CourseStep => ({ kind: 'chapter', id });

export const COURSE: CourseStep[] = [
  g('a1-first-phrases'),
  c('unit-01'), // Greetings & Survival Phrases
  g('a1-essere'),
  c('unit-02'), // Who Am I?
  g('a1-numbers'),
  g('a1-avere'),
  c('unit-04'), // Numbers & Age
  c('unit-05'), // Having & Needing
  g('a1-nouns-articles'),
  c('unit-03'), // Things
  g('a1-regular-verbs'),
  c('unit-10'), // Work & Study
  c('unit-22'), // Free Time
  g('a1-irregular-verbs'),
  c('unit-23'), // At the Café
  g('a1-prepositions'),
  c('unit-12'), // Around Town
  c('unit-16'), // Food & the Market
  g('a1-questions-negation'),
  c('unit-11'), // Getting to Know Someone
  g('a1-adjectives'),
  c('unit-06'), // Describing People & Things
  c('unit-17'), // Shopping
  g('a1-time-dates'),
  c('unit-14'), // Getting Around
  c('unit-19'), // Weather & Seasons
  g('a1-possessives'),
  c('unit-08'), // My Family
  g('a1-piacere'),
  c('unit-18'), // Likes & Plans
  g('a1-reflexive'),
  c('unit-09'), // A Day in My Life
  g('a1-imperative'),
  c('unit-13'), // Finding Your Way
  c('unit-20'), // Feeling Unwell
  g('a1-passato-prossimo'),
  c('unit-21'), // A Trip
];
