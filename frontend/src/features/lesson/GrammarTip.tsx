import { useEffect } from 'react';
import type { GrammarTip as GrammarTipType } from '@/types';
import { Label } from '@/shared/components/design';
import { ActionButton, ActionRow } from '@/features/exercises/ui';

interface GrammarTipProps {
  tip: GrammarTipType;
  onDismiss: () => void;
}

export default function GrammarTip({ tip, onDismiss }: GrammarTipProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        e.preventDefault();
        onDismiss();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDismiss]);

  return (
    <div className="flex flex-col gap-5">
      <Label className="text-grammar">Grammar note</Label>
      <h2 className="font-display text-heading">{tip.title}</h2>
      <p className="max-w-175 text-reading">{tip.explanation}</p>

      {tip.table && (
        <table className="w-full max-w-175 border border-border bg-white text-base">
          <tbody>
            {tip.table.map((row, i) => (
              <tr key={i} className={i > 0 ? 'border-t border-border' : ''}>
                {row.map((cell, j) => (
                  <td key={j} className={`px-4 py-2 ${j === 0 ? 'text-muted-foreground' : ''}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tip.example && (
        <div className="flex max-w-175 flex-col gap-0.5 border-l-3 border-grammar py-1 pl-4.5">
          <p className="text-reading font-medium italic">{tip.example.italian}</p>
          <p className="text-sm text-muted-foreground">{tip.example.english}</p>
        </div>
      )}

      <ActionRow>
        <span className="text-sm text-muted-foreground">Press Enter to continue</span>
        <ActionButton tone="stroke" onClick={onDismiss}>
          Got it
        </ActionButton>
      </ActionRow>
    </div>
  );
}
