import type { ExerciseSubtype } from '@/types';

/** Exercise types that exist in the design but aren't built yet. */
export interface PlannedExercise {
  name: string;
  /** The ability it trains */
  trains: string;
  description: string;
  example: { prompt: string; answer: string };
}

export const PLANNED_EXERCISES: Partial<Record<ExerciseSubtype, PlannedExercise>> = {
  transformation: {
    name: 'Transform',
    trains: 'Controlling a whole grammar system',
    description: 'Rewrite a sentence for another person, number or gender.',
    example: { prompt: 'Io parlo italiano. → noi', answer: 'Noi parliamo italiano.' },
  },
  structured_input: {
    name: 'Whose is it?',
    trains: 'Noticing form to get the meaning',
    description: 'Answer a question you can only get right by paying attention to an ending, article or pronoun.',
    example: { prompt: '"Parlano italiano." Who is speaking?', answer: 'They' },
  },
  find_mistake: {
    name: 'Fix the mistake',
    trains: 'Noticing errors, especially English interference',
    description: 'Spot what is wrong in a sentence and correct it.',
    example: { prompt: 'Sono fame.', answer: 'Ho fame.' },
  },
  translation: {
    name: 'Translate',
    trains: 'Producing full sentences',
    description: 'Write a whole sentence in Italian. Graded leniently, so any correct version counts.',
    example: { prompt: 'My brother lives in Rome.', answer: 'Mio fratello abita a Roma.' },
  },
  dialogue_completion: {
    name: 'Your line',
    trains: 'Using language in an exchange',
    description: 'Write your part in a short dialogue.',
    example: { prompt: '— Buongiorno! Cosa prende? — …', answer: 'Un caffè, per favore.' },
  },
  dictation: {
    name: 'Dictation',
    trains: 'Hearing and spelling',
    description: 'Listen to a sentence and type what you hear.',
    example: { prompt: '(audio)', answer: 'Ci vediamo domani.' },
  },
  minimal_pair: {
    name: 'Which one?',
    trains: 'Hearing double consonants and similar sounds',
    description: 'Listen and pick the word you heard.',
    example: { prompt: '(audio) caro or carro?', answer: 'carro' },
  },
  listen_and_choose: {
    name: 'Listen and choose',
    trains: 'Understanding speech',
    description: 'Listen and pick the right meaning or reply.',
    example: { prompt: '(audio) Come ti chiami?', answer: 'Mi chiamo Anna.' },
  },
  listen_and_repeat: {
    name: 'Listen and repeat',
    trains: 'Pronunciation from a native model',
    description: 'Hear a sentence, then say it back.',
    example: { prompt: '(audio) Piacere di conoscerti.', answer: '(you say it)' },
  },
  spoken_answer: {
    name: 'Answer out loud',
    trains: 'Short spoken production',
    description: 'Answer a spoken question in Italian. Graded leniently.',
    example: { prompt: '(audio) Di dove sei?', answer: 'Sono di Oslo.' },
  },
};
