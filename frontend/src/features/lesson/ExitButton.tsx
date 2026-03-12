import CloseIcon from '@/shared/components/CloseIcon';

interface ExitButtonProps {
  showConfirm: boolean;
  onToggle: () => void;
  onExit: () => void;
  inProgress: boolean;
}

export default function ExitButton({
  showConfirm,
  onToggle,
  onExit,
  inProgress,
}: ExitButtonProps) {
  if (!inProgress) {
    return (
      <button
        onClick={onExit}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Exit lesson"
      >
        <CloseIcon />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Exit lesson"
      >
        <CloseIcon />
      </button>
      {showConfirm && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-20">
          <p className="text-sm text-gray-700 mb-3">
            Exit lesson? Progress will be lost.
          </p>
          <div className="flex gap-2">
            <button
              onClick={onExit}
              className="flex-1 px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Exit
            </button>
            <button
              onClick={onToggle}
              className="flex-1 px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
