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

export interface Unit {
  id: string;
  section_id: string;
  name: string;
  grammar_focus: string;
  vocabulary_targets: string[];
  grammar_notes: string;
  lessons: Lesson[];
  order: number;
}

/** Lightweight vocab entry as authored in unit JSON files */
export interface LessonVocab {
  word: string;
  meaning: string;
  example: string;
}

export interface Lesson {
  id: string;
  unit_id: string;
  name: string;
  exercises: Exercise[];
  grammar_tips: string[];
  order: number;
  vocabulary?: LessonVocab[];
}

export interface Curriculum {
  sections: Section[];
}
