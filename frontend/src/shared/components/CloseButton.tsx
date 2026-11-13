import type { ComponentProps } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/** The quiet × that leaves a session. Pass `aria-label` for what it closes. */
export default function CloseButton({ className, ...props }: ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className={cn('text-muted-foreground transition-colors hover:text-foreground', className)}
      {...props}
    >
      <X className="size-6" />
    </button>
  );
}
