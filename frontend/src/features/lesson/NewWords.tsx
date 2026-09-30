import { useEffect } from 'react';
import type { LessonVocab } from '@/types';
import { Label } from '@/shared/components/design';
import { ActionButton, ActionRow } from '@/features/exercises/ui';

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

      <ul className="flex flex-col divide-y divide-border rounded-lg border border-border bg-white">
        {words.map((w) => (
          <li key={w.id ?? w.word} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-x-6 gap-y-0.5 px-5 py-3.5">
            <span className="text-lg font-bold">{w.word}</span>
            <span className="text-lg text-muted-foreground">{w.meaning}</span>
            {w.example && <span className="col-span-2 text-base italic">{w.example}</span>}
          </li>
        ))}
      </ul>

      <ActionRow>
        <span className="text-sm text-muted-foreground">Press Enter to start</span>
        <ActionButton onClick={onStart}>Start</ActionButton>
      </ActionRow>
    </div>
  );
}
