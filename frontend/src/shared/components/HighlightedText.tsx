import type { ReactNode } from 'react';

interface HighlightedTextProps {
  text: string;
  words: string[];
}

/**
 * Renders text with target words highlighted.
 * Uses Unicode-aware boundaries so accented Italian words match correctly.
 */
export default function HighlightedText({ text, words }: HighlightedTextProps) {
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
    result.push(
      <mark
        key={idx}
        className="rounded-sm bg-amber-100/80 px-0.5 font-semibold text-inherit"
      >
        {match[0]}
      </mark>,
    );
    lastIndex = idx + match[0].length;
  }

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return <>{result.length ? result : text}</>;
}
