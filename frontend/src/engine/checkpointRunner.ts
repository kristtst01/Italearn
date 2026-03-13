import type { Exercise, VocabEntry } from '../types';
import { db } from '../stores/db';
import { shuffle } from '../shared/utils/shuffle';

const SECTION_1_UNITS = ['unit-01', 'unit-02', 'unit-03'];

/** Map exercise id → unit_id for weak-area reporting */
export type CheckpointExerciseMap = Map<string, string>;

const TARGET_COUNT = 18;

/** Hand-crafted exercises for essere/avere grammar — tagged as 'grammar' */
const GRAMMAR_EXERCISES: Exercise[] = [
  {
    id: 'cp-grammar-01',
    type: 'writing',
    subtype: 'fill_blank',
    prompt: { text: 'Fill in the correct form of essere.' },
    sentence_context: 'Io ___ stanco.',
    correct_answer: 'sono',
    distractors: [],
    hints: ['io → sono'],
    target_words: ['essere'],
  },
  {
    id: 'cp-grammar-02',
    type: 'writing',
    subtype: 'fill_blank',
    prompt: { text: 'Fill in the correct form of essere.' },
    sentence_context: 'Tu ___ italiano?',
    correct_answer: 'sei',
    distractors: [],
    hints: ['tu → sei'],
    target_words: ['essere'],
  },
  {
    id: 'cp-grammar-03',
    type: 'writing',
    subtype: 'fill_blank',
    prompt: { text: 'Fill in the correct form of essere.' },
    sentence_context: 'Noi ___ studenti.',
    correct_answer: 'siamo',
    distractors: [],
    hints: ['noi → siamo'],
    target_words: ['essere'],
  },
  {
    id: 'cp-grammar-04',
    type: 'vocab',
    subtype: 'multiple_choice',
    prompt: { text: "Which form of essere means 'they are'?" },
    sentence_context: 'Loro ___ amici.',
    correct_answer: 'sono',
    distractors: ['siamo', 'siete', 'è'],
    hints: [],
    target_words: ['essere'],
  },
  {
    id: 'cp-grammar-05',
    type: 'writing',
    subtype: 'fill_blank',
    prompt: { text: 'Fill in the correct form of avere.' },
    sentence_context: 'Io ___ fame.',
    correct_answer: 'ho',
    distractors: [],
    hints: ['io → ho'],
    target_words: ['avere'],
  },
  {
    id: 'cp-grammar-06',
    type: 'writing',
    subtype: 'fill_blank',
    prompt: { text: 'Fill in the correct form of avere.' },
    sentence_context: 'Tu ___ un cane?',
    correct_answer: 'hai',
    distractors: [],
    hints: ['tu → hai'],
    target_words: ['avere'],
  },
  {
    id: 'cp-grammar-07',
    type: 'vocab',
    subtype: 'multiple_choice',
    prompt: { text: "Which form of avere means 'we have'?" },
    sentence_context: 'Noi ___ due gatti.',
    correct_answer: 'abbiamo',
    distractors: ['hanno', 'avete', 'ho'],
    hints: [],
    target_words: ['avere'],
  },
  {
    id: 'cp-grammar-08',
    type: 'writing',
    subtype: 'fill_blank',
    prompt: { text: 'Fill in the correct form of avere.' },
    sentence_context: 'Loro ___ trent\'anni.',
    correct_answer: 'hanno',
    distractors: [],
    hints: ['loro → hanno'],
    target_words: ['avere'],
  },
];

function buildTypeAnswer(entry: VocabEntry, idx: number): Exercise {
  const meaning = entry.meaning.replace(/\s*\(.*?\)\s*/g, '').trim();
  return {
    id: `cp-vocab-${idx}-ta`,
    type: 'vocab',
    subtype: 'type_answer',
    prompt: { text: `Translate to Italian: '${meaning}'` },
    sentence_context: entry.example,
    correct_answer: entry.word,
    distractors: [],
    hints: [],
    target_words: [entry.id],
  };
}

function buildMultipleChoice(
  entry: VocabEntry,
  idx: number,
  pool: VocabEntry[],
): Exercise {
  const meaning = entry.meaning.replace(/\s*\(.*?\)\s*/g, '').trim();
  const distractors = shuffle(pool.filter((v) => v.id !== entry.id))
    .slice(0, 3)
    .map((v) => v.meaning.replace(/\s*\(.*?\)\s*/g, '').trim());
  return {
    id: `cp-vocab-${idx}-mc`,
    type: 'vocab',
    subtype: 'multiple_choice',
    prompt: { text: `What does '${entry.word}' mean?` },
    sentence_context: entry.example,
    correct_answer: meaning,
    distractors,
    hints: [],
    target_words: [entry.id],
  };
}

function buildCloze(entry: VocabEntry, idx: number): Exercise | null {
  const pattern = new RegExp(
    entry.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    'i',
  );
  if (!pattern.test(entry.example)) return null;
  return {
    id: `cp-vocab-${idx}-cloze`,
    type: 'vocab',
    subtype: 'cloze',
    prompt: { text: 'Complete the sentence with the missing word.' },
    sentence_context: entry.example.replace(pattern, '___'),
    correct_answer: entry.word,
    distractors: [],
    hints: [entry.meaning.replace(/\s*\(.*?\)\s*/g, '').trim()],
    target_words: [entry.id],
  };
}

/**
 * Build a mixed exercise set from Section 1 vocabulary + grammar.
 * Returns exercises and a map from exercise id → unit_id (or 'grammar').
 */
export async function buildCheckpointExercises(): Promise<{
  exercises: Exercise[];
  unitMap: CheckpointExerciseMap;
}> {
  const vocab = await db.vocabulary
    .filter((v) => SECTION_1_UNITS.includes(v.unit_id))
    .toArray();

  const pool = shuffle(vocab);

  // Grammar exercises: pick 4 from the pool
  const grammarSample = shuffle(GRAMMAR_EXERCISES).slice(0, 4);

  // Vocab exercises: fill remaining slots (~14) from vocab pool
  // Weight: 50% type_answer, 30% multiple_choice, 20% cloze
  const vocabTarget = TARGET_COUNT - grammarSample.length;
  const vocabSample = pool.slice(0, Math.min(vocabTarget, pool.length));

  const vocabExercises: Exercise[] = [];
  for (let i = 0; i < vocabSample.length; i++) {
    const entry = vocabSample[i];
    const roll = Math.random();
    if (roll < 0.5) {
      vocabExercises.push(buildTypeAnswer(entry, i));
    } else if (roll < 0.8) {
      vocabExercises.push(buildMultipleChoice(entry, i, pool));
    } else {
      const cloze = buildCloze(entry, i);
      vocabExercises.push(cloze ?? buildTypeAnswer(entry, i));
    }
  }

  const allExercises = shuffle([...grammarSample, ...vocabExercises]).slice(
    0,
    TARGET_COUNT,
  );

  // Build unit map for weak-area tracking
  const unitMap: CheckpointExerciseMap = new Map();
  for (const ex of grammarSample) {
    unitMap.set(ex.id, 'grammar');
  }
  for (let i = 0; i < vocabSample.length; i++) {
    const entry = vocabSample[i];
    // Match exercise id suffix pattern to find the exercise
    const possible = [
      `cp-vocab-${i}-ta`,
      `cp-vocab-${i}-mc`,
      `cp-vocab-${i}-cloze`,
    ];
    for (const id of possible) {
      if (allExercises.some((e) => e.id === id)) {
        unitMap.set(id, entry.unit_id);
      }
    }
  }

  return { exercises: allExercises, unitMap };
}
