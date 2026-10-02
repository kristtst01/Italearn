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
  /** What kind of lesson it is: vocabulary exercises, grammar in context, consolidation, a reading text, the writing task,
   *  or speaking (needs a microphone, so it has its own section) */
  role: LessonRole;
  order: number;
}

export type LessonRole = 'words' | 'grammar' | 'practice' | 'reading' | 'writing' | 'speaking';

export interface Unit {
  id: string;
  section_id: string;
  name: string;
  grammar_focus: string;
  vocabulary_targets: string[];
  grammar_notes: string;
  /** What the learner can do after the chapter (CEFR can-do style) */
  can_do?: string;
  /** Italian title on the chapter's stamp */
  stamp_title?: string;
  /** Reworked and reviewed. Other chapters still work, but are listed under "Under construction". */
  ready?: boolean;
  lessons: LessonMeta[];
  order: number;
}

/** Lightweight vocab entry as authored in unit JSON files */
export interface LessonVocab {
  /** Explicit unique ID — defaults to `word` if omitted. Use for homonyms (e.g. "sei-number" vs "sei"). */
  id?: string;
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
  /** Reading lessons: the text, shown beside every question */
  reading?: ReadingText;
}

export interface ReadingText {
  title: string;
  /** Paragraphs of the text, in Italian */
  paragraphs: string[];
}

export interface Curriculum {
  sections: Section[];
}
