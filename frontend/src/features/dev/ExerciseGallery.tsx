import { useState } from 'react';
import type { Exercise, ExerciseSubtype } from '@/types';
import renderExercise from '@/features/exercises/renderExercise';
import { PLANNED_EXERCISES } from '@/features/exercises/plannedExercises';
import { Label } from '@/shared/components/design';
import { cn } from '@/lib/utils';

const base = { distractors: [], hints: [], target_words: [] as string[] };

/** One sample per built exercise type (dev only, for design review). */
const SAMPLES: Exercise[] = [
  { ...base, id: 'dev-mc', type: 'vocab', subtype: 'multiple_choice', prompt: { text: "What does 'mi chiamo' mean?" }, sentence_context: 'Ciao, mi chiamo Marco.', correct_answer: 'My name is', distractors: ['I live in', 'I come from', 'I work at'] },
  { ...base, id: 'dev-type', type: 'vocab', subtype: 'type_answer', prompt: { text: "How do you say 'my father' in Italian?" }, sentence_context: 'Mio padre è alto.', correct_answer: 'mio padre' },
  { ...base, id: 'dev-arrange', type: 'writing', subtype: 'arrange_words', prompt: { text: "Build the sentence: 'Their mother is Italian.'" }, sentence_context: 'La loro madre è italiana.', correct_answer: ['La', 'loro', 'madre', 'è', 'italiana.'], distractors: ['sua', 'il'] },
  { ...base, id: 'dev-fill', type: 'writing', subtype: 'fill_blank', prompt: { text: 'Fill in the possessive (my).' }, sentence_context: '___ sorelle abitano a Roma.', correct_answer: 'Le mie' },
  { ...base, id: 'dev-cloze', type: 'vocab', subtype: 'cloze', prompt: { text: 'Complete the sentence.' }, sentence_context: 'Ho due ___ e una sorella.', correct_answer: 'fratelli', hints: ['I have two brothers and a sister.'] },
  { ...base, id: 'dev-match', type: 'vocab', subtype: 'match_pairs', prompt: { text: 'Match the Italian words with their meanings.' }, sentence_context: '', correct_answer: ['madre|mother', 'padre|father', 'nonno|grandfather', 'zia|aunt'] },
  { ...base, id: 'dev-read', type: 'speaking', subtype: 'read_aloud', prompt: { text: 'Read this sentence aloud.' }, sentence_context: 'Mia madre si chiama Anna.', correct_answer: 'Mia madre si chiama Anna.' },
  { ...base, id: 'dev-free', type: 'writing', subtype: 'free_form', prompt: { text: 'Describe your family in three or four sentences.' }, sentence_context: '', correct_answer: 'Nella mia famiglia siamo in quattro. Mio padre si chiama Paolo e mia madre si chiama Anna. Ho un fratello.', hints: ['Use mio / mia and the family rule.'] },
];

const BUILT = SAMPLES.map((e) => ({ subtype: e.subtype, name: e.subtype.replace(/_/g, ' '), exercise: e }));
const PLANNED = (Object.keys(PLANNED_EXERCISES) as ExerciseSubtype[]).map((subtype) => ({
  subtype,
  name: PLANNED_EXERCISES[subtype]!.name,
  exercise: {
    ...base,
    id: `dev-${subtype}`,
    type: 'writing',
    subtype,
    prompt: { text: PLANNED_EXERCISES[subtype]!.example.prompt },
    sentence_context: '',
    correct_answer: PLANNED_EXERCISES[subtype]!.example.answer,
  } as Exercise,
}));

export default function ExerciseGallery() {
  const [selected, setSelected] = useState<ExerciseSubtype>('multiple_choice');
  const [run, setRun] = useState(0);
  const current = [...BUILT, ...PLANNED].find((x) => x.subtype === selected)!;

  function pick(subtype: ExerciseSubtype) {
    setSelected(subtype);
    setRun((r) => r + 1);
  }

  const item = (x: { subtype: ExerciseSubtype; name: string }, soon: boolean) => (
    <button
      key={x.subtype}
      type="button"
      onClick={() => pick(x.subtype)}
      className={cn(
        'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm capitalize',
        selected === x.subtype ? 'bg-white font-bold ring-1 ring-border' : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {x.name}
      {soon && <span className="text-xs font-bold tracking-label text-muted-foreground uppercase">soon</span>}
    </button>
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 gap-12 px-14 py-11">
      <aside className="flex w-60 shrink-0 flex-col gap-2">
        <Label>Built</Label>
        {BUILT.map((x) => item(x, false))}
        <Label className="mt-4">Planned</Label>
        {PLANNED.map((x) => item(x, true))}
      </aside>
      <div className="max-w-3xl flex-1">
        <div key={`${selected}-${run}`}>
          {renderExercise({ exercise: current.exercise, onComplete: () => setRun((r) => r + 1) })}
        </div>
      </div>
    </div>
  );
}
