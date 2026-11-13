import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Shapes, type Shape } from './design';

const SHAPES: Shape[] = [
  { kind: 'half', color: 'ocra', size: 420, position: { left: -80, bottom: 0 } },
  { kind: 'circle', color: 'vermiglione', size: 260, position: { right: -90, bottom: -90 } },
];

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
  /** Left out for the screens before and after a session (review intro and summary) */
  header?: ReactNode;
  /** No width cap: the content sets its own width (reading lessons, where the text's line length decides) */
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-clip">
      <Shapes shapes={SHAPES} fixed />
      {header}
      <main className="flex flex-1 flex-col px-8">
        <div className={cn('mx-auto w-full pb-12', wide ? 'pt-12' : 'max-w-190 pt-[max(3rem,12vh)]')}>{children}</div>
      </main>
    </div>
  );
}
