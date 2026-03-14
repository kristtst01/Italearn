import { useEffect, useRef, useState, type ReactNode } from 'react';
import { db } from '@/stores/db';
import type { VocabEntry } from '@/types';

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
        className="cursor-pointer rounded-sm bg-amber-100/80 px-0.5 font-semibold text-inherit underline decoration-amber-300 decoration-dotted underline-offset-2"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {children}
      </mark>
      {open && entry && (
        <span className="absolute top-full left-1/2 z-50 mt-2 block w-52 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-3 text-left shadow-lg">
          <span className="block text-sm font-bold text-gray-900">{entry.word}</span>
          <span className="block text-sm text-gray-600">{entry.meaning}</span>
          {entry.example && (
            <span className="block mt-1 text-xs italic text-gray-400">
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
  const [vocabMap, setVocabMap] = useState<Map<string, VocabEntry>>(new Map());

  useEffect(() => {
    if (!words.length) return;
    async function load() {
      const map = new Map<string, VocabEntry>();
      for (const wordId of words) {
        const entry = await db.vocabulary.get(wordId);
        if (entry) map.set(entry.word.toLowerCase(), entry);
      }
      setVocabMap(map);
    }
    load();
  }, [words]);

  if (!words.length) return <>{text}</>;

  const escaped = words.map((w) =>
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
