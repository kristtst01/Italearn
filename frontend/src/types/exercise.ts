export type ExerciseType = 'vocab' | 'writing' | 'speaking' | 'listening';

export type ExerciseSubtype =
  | 'multiple_choice'
  | 'type_answer'
  | 'arrange_words'
  | 'fill_blank'
  | 'cloze'
  | 'dictation'
  | 'read_aloud'
  | 'listen_and_choose'
  | 'minimal_pair'
  | 'match_pairs'
  | 'free_form'
  | 'reading_comprehension';

export interface ExercisePrompt {
  text?: string;
  audio?: boolean;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  subtype: ExerciseSubtype;
  prompt: ExercisePrompt;
  sentence_context: string;
  correct_answer: string | string[];
  distractors: string[];
  hints: string[];
  target_words: string[];
}
