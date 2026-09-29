import SessionHeader from '@/shared/components/SessionHeader';
import type { Segment } from '@/shared/utils/segments';
import ExitButton from './ExitButton';

interface LessonHeaderProps {
  context?: string;
  title: string;
  segments: Segment[];
  exercisesDone: number;
  totalExercises: number;
  stamp?: { earned: boolean };
  isComplete: boolean;
  showExitConfirm: boolean;
  onToggleExit: () => void;
  onExit: () => void;
}

export default function LessonHeader({
  context,
  title,
  segments,
  exercisesDone,
  totalExercises,
  stamp,
  isComplete,
  showExitConfirm,
  onToggleExit,
  onExit,
}: LessonHeaderProps) {
  return (
    <SessionHeader
      context={context}
      title={title}
      segments={segments}
      stamp={stamp}
      counter={`${Math.min(exercisesDone + 1, totalExercises)} / ${totalExercises}`}
      exit={<ExitButton showConfirm={showExitConfirm} onToggle={onToggleExit} onExit={onExit} inProgress={!isComplete} />}
    />
  );
}
