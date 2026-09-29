import SessionHeader from '@/shared/components/SessionHeader';
import ExitButton from './ExitButton';

interface LessonHeaderProps {
  label: string;
  progress: number;
  exercisesDone: number;
  totalExercises: number;
  isComplete: boolean;
  showExitConfirm: boolean;
  onToggleExit: () => void;
  onExit: () => void;
}

export default function LessonHeader({
  label,
  progress,
  exercisesDone,
  totalExercises,
  isComplete,
  showExitConfirm,
  onToggleExit,
  onExit,
}: LessonHeaderProps) {
  return (
    <SessionHeader
      label={label}
      progress={progress}
      counter={`${Math.min(exercisesDone + 1, totalExercises)} / ${totalExercises}`}
      exit={<ExitButton showConfirm={showExitConfirm} onToggle={onToggleExit} onExit={onExit} inProgress={!isComplete} />}
    />
  );
}
