import type { Exercise } from './exercise';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2';

export type UnitStatus = 'locked' | 'available' | 'in_progress' | 'completed';

export interface Section {
  id: string;
  name: string;
  description: string;
  order: number;
  cefr_level: CEFRLevel;
  units: Unit[];
}

/** Lightweight lesson metadata kept inline in the curriculum (no exercises/vocabulary). */
export interface LessonMeta {
  id: string;
  unit_id: string;
  name: string;
  order: number;
}

export interface Unit {
  id: string;
  section_id: string;
  name: string;
  grammar_focus: string;
  vocabulary_targets: string[];
  grammar_notes: string;
  lessons: LessonMeta[];
  order: number;
}

/** Lightweight vocab entry as authored in unit JSON files */
export interface LessonVocab {
  word: string;
  meaning: string;
  example: string;
}

export interface GrammarTip {
  id: string;
  title: string;
  explanation: string;
  table?: string[][];
  example?: { italian: string; english: string };
  before_exercise?: number;
}

export interface Lesson {
  id: string;
  unit_id: string;
  name: string;
  exercises: Exercise[];
  grammar_tips: GrammarTip[];
  order: number;
  vocabulary?: LessonVocab[];
}

export interface Curriculum {
  sections: Section[];
}
