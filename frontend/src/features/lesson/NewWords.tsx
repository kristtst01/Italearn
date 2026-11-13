import { useEffect } from 'react';
import type { LessonVocab } from '@/types';
import { Label } from '@/shared/components/design';
import { ActionButton, ActionRow, AudioButton } from '@/features/exercises/ui';

/** The lesson's new words, shown before its exercises so nothing is asked before it's been seen. */
export default function NewWords({ words, onStart }: { words: LessonVocab[]; onStart: () => void }) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        e.preventDefault();
        onStart();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <Label>New in this lesson</Label>
        <h2 className="font-display text-heading">
          {words.length} {words.length === 1 ? 'word' : 'words'}
        </h2>
      </div>

      <ul className="flex flex-col divide-y divide-border panel">
        {words.map((w) => (
          <li
            key={w.id ?? w.word}
            className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-0.5 px-4 py-3 sm:grid-cols-[auto_minmax(0,2fr)_minmax(0,3fr)] sm:gap-x-4 sm:px-5 sm:py-3.5"
          >
            <AudioButton />
            <span className="text-lg font-bold">{w.word}</span>
            <span className="col-start-2 text-base text-muted-foreground sm:col-start-auto sm:text-lg">{w.meaning}</span>
            {w.example && <span className="col-start-2 text-base italic sm:col-end-4">{w.example}</span>}
          </li>
        ))}
      </ul>

      <ActionRow>
        <span className="text-sm text-muted-foreground max-sm:hidden pointer-coarse:hidden">Press Enter to start</span>
        <ActionButton onClick={onStart}>Start</ActionButton>
      </ActionRow>
    </div>
  );
}
