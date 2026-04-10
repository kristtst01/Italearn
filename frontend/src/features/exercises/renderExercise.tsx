import type { Exercise, ExerciseResult } from '@/types';
import MultipleChoice from './MultipleChoice';
import TypeAnswer from './TypeAnswer';
import ArrangeWords from './ArrangeWords';
import FillInBlank from './FillInBlank';
import MatchPairs from './MatchPairs';
import ReadAloud from './ReadAloud';
import FreeResponse from './FreeResponse';

interface ExerciseProps {
  exercise: Exercise;
  onComplete: (result: ExerciseResult) => void;
}

export default function renderExercise({ exercise, onComplete }: ExerciseProps) {
  const props = { exercise, onComplete };

  switch (exercise.subtype) {
    case 'multiple_choice':
      return <MultipleChoice key={exercise.id} {...props} />;
    case 'type_answer':
      return <TypeAnswer key={exercise.id} {...props} />;
    case 'arrange_words':
      return <ArrangeWords key={exercise.id} {...props} />;
    case 'fill_blank':
    case 'cloze':
      return <FillInBlank key={exercise.id} {...props} />;
    case 'match_pairs':
      return <MatchPairs key={exercise.id} {...props} />;
    case 'read_aloud':
      return <ReadAloud key={exercise.id} {...props} />;
    case 'free_form':
      return <FreeResponse key={exercise.id} {...props} />;
    default:
      return (
        <div className="text-gray-500">
          Exercise type &ldquo;{exercise.subtype}&rdquo; is not yet supported.
        </div>
      );
  }
}
