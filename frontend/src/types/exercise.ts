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
  | 'reading_comprehension'
  // Planned (render as placeholders until built; see docs/exercise-generation-guide.md)
  | 'transformation'
  | 'structured_input'
  | 'find_mistake'
  | 'translation'
  | 'dialogue_completion'
  | 'listen_and_repeat'
  | 'spoken_answer';

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
  /** Grammar points this exercise tests (grammar unit practice and mastery checks) */
  grammar_points?: string[];
  /** A missing accent counts as wrong (e.g. è vs e), instead of correct with a reminder */
  strict_accents?: boolean;
  /** dialogue_completion: the exchange, in order. The line without `text` is the learner's. */
  dialogue?: DialogueLine[];
}

export interface DialogueLine {
  speaker: string;
  text?: string;
}
