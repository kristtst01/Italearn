import * as AlertDialog from '@radix-ui/react-alert-dialog';
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
    <AlertDialog.Root open={showConfirm} onOpenChange={onToggle}>
      <AlertDialog.Trigger asChild>
        <button
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Exit lesson"
        >
          <CloseIcon />
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-white rounded-lg shadow-lg p-6 z-50">
          <AlertDialog.Title className="text-lg font-semibold text-gray-900">
            Exit lesson?
          </AlertDialog.Title>
          <AlertDialog.Description className="text-sm text-gray-500 mt-2">
            Progress will be lost.
          </AlertDialog.Description>
          <div className="flex gap-3 mt-5">
            <AlertDialog.Action asChild>
              <button
                onClick={onExit}
                className="flex-1 px-3 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
              >
                Exit
              </button>
            </AlertDialog.Action>
            <AlertDialog.Cancel asChild>
              <button className="flex-1 px-3 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50 transition-colors font-medium">
                Cancel
              </button>
            </AlertDialog.Cancel>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
