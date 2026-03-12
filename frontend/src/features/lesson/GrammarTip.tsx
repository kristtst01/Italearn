import { useEffect } from 'react';
import type { GrammarTip as GrammarTipType } from '@/types';

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
    <div className="flex min-h-[60vh] flex-col">
      <div className="flex-1">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-600">
            Grammar Tip
          </div>
          <h2 className="mb-3 text-xl font-bold text-gray-900">{tip.title}</h2>
          <p className="leading-relaxed text-gray-700">{tip.explanation}</p>

          {tip.table && (
            <table className="mt-4 w-full text-sm">
              <tbody>
                {tip.table.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-amber-100/50' : ''}>
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`px-3 py-1.5 ${j === 0 ? 'font-medium text-gray-600' : 'text-gray-900'}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tip.example && (
            <div className="mt-4 rounded-lg bg-white/60 px-4 py-3">
              <p className="font-medium italic text-gray-900">
                {tip.example.italian}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {tip.example.english}
              </p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onDismiss}
        className="mt-6 w-full rounded-xl bg-amber-500 py-3 font-semibold text-white transition-colors hover:bg-amber-600"
      >
        Got it
      </button>
    </div>
  );
}
