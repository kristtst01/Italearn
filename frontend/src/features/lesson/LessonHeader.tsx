import ProgressBar from '@/shared/components/ProgressBar';
import ExitButton from './ExitButton';

interface LessonHeaderProps {
  progress: number;
  exercisesDone: number;
  totalExercises: number;
  isComplete: boolean;
  showExitConfirm: boolean;
  onToggleExit: () => void;
  onExit: () => void;
}

export default function LessonHeader({
  progress,
  exercisesDone,
  totalExercises,
  isComplete,
  showExitConfirm,
  onToggleExit,
  onExit,
}: LessonHeaderProps) {
  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
      <div className="max-w-2xl mx-auto flex items-center gap-4">
        <ExitButton
          showConfirm={showExitConfirm}
          onToggle={onToggleExit}
          onExit={onExit}
          inProgress={!isComplete}
        />
        <div className="flex-1">
          <ProgressBar progress={progress} />
        </div>
        <span className="text-sm text-gray-500 whitespace-nowrap">
          {Math.min(exercisesDone + 1, totalExercises)}/{totalExercises}
        </span>
      </div>
    </div>
  );
}
