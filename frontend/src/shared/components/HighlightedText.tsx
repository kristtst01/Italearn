import { useEffect, useRef, useState, type ReactNode } from 'react';
import { getVocab } from '@/engine/vocabCache';
import type { VocabEntry } from '@/types';
import { useExerciseContext } from './ExerciseContext';

interface HighlightedTextProps {
  text: string;
  words: string[];
}

function WordHint({ entry, children }: { entry?: VocabEntry; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [open]);

  return (
    <span ref={ref} className="relative inline">
      <mark
        className="cursor-pointer bg-transparent font-bold text-inherit underline decoration-cobalto decoration-dotted decoration-2 underline-offset-4"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {children}
      </mark>
      {open && entry && (
        <span className="absolute top-full left-1/2 z-50 mt-2 block w-56 -translate-x-1/2 rounded-lg border border-border bg-white p-3.5 text-left text-base font-normal">
          <span className="block font-bold">{entry.word}</span>
          <span className="block text-sm text-muted-foreground">{entry.meaning}</span>
          {entry.example && (
            <span className="mt-1.5 block text-sm italic">
              &ldquo;{entry.example}&rdquo;
            </span>
          )}
        </span>
      )}
    </span>
  );
}

/**
 * Renders text with target words highlighted.
 * Tapping a highlighted word shows its translation and example.
 * Uses Unicode-aware boundaries so accented Italian words match correctly.
 */
export default function HighlightedText({ text, words }: HighlightedTextProps) {
  const { hintsDisabled } = useExerciseContext();
  const [vocabMap, setVocabMap] = useState<Map<string, VocabEntry>>(new Map());
  const [wordTexts, setWordTexts] = useState<string[]>([]);

  useEffect(() => {
    if (!words.length) return;
    const map = new Map<string, VocabEntry>();
    const texts: string[] = [];
    for (const wordId of words) {
      const entry = getVocab(wordId);
      // Resolve ID → actual word text for regex matching
      const w = entry?.word ?? wordId;
      map.set(w.toLowerCase(), entry ?? { id: wordId, word: w, meaning: '', example: '', unit_id: '' });
      if (!texts.some((t) => t.toLowerCase() === w.toLowerCase())) texts.push(w);
    }
    setVocabMap(map);
    setWordTexts(texts);
  }, [words]);

  if (!wordTexts.length || hintsDisabled) return <>{text}</>;

  const escaped = wordTexts.map((w) =>
    w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
  );
  const pattern = new RegExp(
    `(?<![\\p{L}])(${escaped.join('|')})(?![\\p{L}])`,
    'giu',
  );

  const result: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(pattern)) {
    const idx = match.index!;
    if (idx > lastIndex) {
      result.push(text.slice(lastIndex, idx));
    }
    const entry = vocabMap.get(match[0].toLowerCase());
    result.push(
      <WordHint key={idx} entry={entry}>
        {match[0]}
      </WordHint>,
    );
    lastIndex = idx + match[0].length;
  }

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return <>{result.length ? result : text}</>;
}
