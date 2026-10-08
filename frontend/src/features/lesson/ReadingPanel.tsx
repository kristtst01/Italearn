import type { ReadingText } from '@/types';
import { Label } from '@/shared/components/design';

// Dialogue lines are written "Name: text". The name can be two or three words, each capitalised
// ("Signora Bianchi"), so narration like "Emma dice: …" isn't taken for a speaker.
const SPEAKER = /^(\p{Lu}[\p{L}'’]*(?: \p{Lu}[\p{L}'’]*){0,2}): (.+)$/u;
// List lines are written "Item · detail" (a price list, a timetable)
const LIST_ITEM = /^(.+?) · (.+)$/;

type Block =
  | { kind: 'text'; text: string }
  | { kind: 'dialogue'; lines: [string, string][] }
  | { kind: 'list'; items: [string, string][] };

/** Groups consecutive dialogue lines, and consecutive list lines, so each set sits together. */
function toBlocks(paragraphs: string[]): Block[] {
  const blocks: Block[] = [];
  for (const p of paragraphs) {
    const last = blocks[blocks.length - 1];
    const item = p.match(LIST_ITEM);
    const line = p.match(SPEAKER);
    if (item) {
      if (last?.kind === 'list') last.items.push([item[1], item[2]]);
      else blocks.push({ kind: 'list', items: [[item[1], item[2]]] });
    } else if (line) {
      if (last?.kind === 'dialogue') last.lines.push([line[1], line[2]]);
      else blocks.push({ kind: 'dialogue', lines: [[line[1], line[2]]] });
    } else {
      blocks.push({ kind: 'text', text: p });
    }
  }
  return blocks;
}

/**
 * The text of a reading lesson. Its width comes from the line length (max-w-prose at the passage
 * size), and it scrolls with the page, so a long text reads like a page.
 */
export default function ReadingPanel({ text }: { text: ReadingText }) {
  return (
    <article className="rounded-lg border border-border bg-white px-10 py-8">
      <div className="flex max-w-prose flex-col gap-5 text-passage">
        <div className="flex flex-col gap-2">
          <Label>Read</Label>
          <h2 className="font-display text-heading">{text.title}</h2>
        </div>
        {toBlocks(text.paragraphs).map((block, i) => {
          if (block.kind === 'list') {
            return (
              <dl key={i} className="flex w-2/3 flex-col gap-1">
                {block.items.map(([item, detail]) => (
                  <div key={item} className="flex items-baseline gap-3">
                    <dt>{item}</dt>
                    <span aria-hidden className="flex-1 border-b border-dotted border-border" />
                    <dd>{detail}</dd>
                  </div>
                ))}
              </dl>
            );
          }
          if (block.kind === 'dialogue') {
            return (
              <div key={i} className="flex flex-col gap-2">
                {block.lines.map(([speaker, line], j) => (
                  <p key={j}>
                    <b className="font-bold">{speaker}:</b> {line}
                  </p>
                ))}
              </div>
            );
          }
          return <p key={i}>{block.text}</p>;
        })}
      </div>
    </article>
  );
}
