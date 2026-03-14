import type { Exercise, ExerciseResult } from '@/types';
import MultipleChoice from './MultipleChoice';
import TypeAnswer from './TypeAnswer';
import ArrangeWords from './ArrangeWords';
import FillInBlank from './FillInBlank';
import ClozeDelete from './ClozeDelete';
import MatchPairs from './MatchPairs';

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
      return <FillInBlank key={exercise.id} {...props} />;
    case 'cloze':
      return <ClozeDelete key={exercise.id} {...props} />;
    case 'match_pairs':
      return <MatchPairs key={exercise.id} {...props} />;
    default:
      return (
        <div className="text-gray-500">
          Exercise type &ldquo;{exercise.subtype}&rdquo; is not yet supported.
        </div>
      );
  }
}
