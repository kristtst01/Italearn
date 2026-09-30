import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Immersive session page: header on top, the exercise in a centred column, quiet shapes in the corners.
 * The exercise sits at a fixed distance from the top (not vertically centred), so feedback appearing
 * below it never moves what's above.
 */
export default function SessionLayout({
  header,
  wide = false,
  children,
}: {
  header: ReactNode;
  /** A wider column, for sessions that show a text beside the exercise (reading lessons) */
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-clip">
      <div aria-hidden className="fixed bottom-0 -left-20 -z-10 h-52.5 w-105 rounded-t-full bg-ocra" />
      <div aria-hidden className="fixed -right-22.5 -bottom-22.5 -z-10 size-65 rounded-full bg-vermiglione" />
      {header}
      <main className="flex flex-1 flex-col px-8">
        <div className={cn('mx-auto w-full pb-12', wide ? 'max-w-6xl pt-12' : 'max-w-190 pt-[max(3rem,12vh)]')}>{children}</div>
      </main>
    </div>
  );
}
