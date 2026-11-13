import * as AlertDialog from '@radix-ui/react-alert-dialog';
import CloseButton from '@/shared/components/CloseButton';
import { buttonVariants } from '@/components/ui/button';

interface ExitButtonProps {
  showConfirm: boolean;
  onToggle: () => void;
  onExit: () => void;
  inProgress: boolean;
}

/** Leaves a lesson or grammar session; asks first if answers would be lost. */
export default function ExitButton({ showConfirm, onToggle, onExit, inProgress }: ExitButtonProps) {
  if (!inProgress) return <CloseButton onClick={onExit} aria-label="Exit lesson" />;

  return (
    <AlertDialog.Root open={showConfirm} onOpenChange={onToggle}>
      <AlertDialog.Trigger asChild>
        <CloseButton aria-label="Exit lesson" />
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-40 bg-foreground/40" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-96 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-7">
          <AlertDialog.Title className="font-display text-xl">
            Exit lesson?
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
            Your answers in this lesson so far will be lost.
          </AlertDialog.Description>
          <div className="mt-6 flex gap-3">
            <AlertDialog.Action asChild>
              <button
                onClick={onExit}
                className={buttonVariants({ size: 'xl', className: 'flex-1' })}
              >
                Exit
              </button>
            </AlertDialog.Action>
            <AlertDialog.Cancel asChild>
              <button className={buttonVariants({ variant: 'stroke', size: 'xl', className: 'flex-1' })}>
                Keep going
              </button>
            </AlertDialog.Cancel>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
