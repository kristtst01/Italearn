import type { ReactNode } from 'react';

/** Immersive session page: header on top, the exercise centred, quiet shapes in the corners. */
export default function SessionLayout({ header, children }: { header: ReactNode; children: ReactNode }) {
  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-hidden">
      <div aria-hidden className="fixed -bottom-0 -left-15 -z-10 h-45 w-90 rounded-t-full bg-ocra" />
      <div aria-hidden className="fixed -right-17.5 -bottom-17.5 -z-10 size-50 rounded-full bg-vermiglione" />
      {header}
      <main className="flex flex-1 flex-col px-8">
        <div className="mx-auto my-auto w-full max-w-190 py-12">{children}</div>
      </main>
    </div>
  );
}
