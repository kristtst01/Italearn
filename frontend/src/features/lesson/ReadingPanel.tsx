import type { ReadingText } from '@/types';
import { Label } from '@/shared/components/design';

/** The text of a reading lesson, kept beside every question so the learner can look back at it. */
export default function ReadingPanel({ text }: { text: ReadingText }) {
  return (
    <article className="sticky top-24 flex max-h-[calc(100dvh-8rem)] flex-col gap-4 overflow-y-auto rounded-lg border border-border bg-white px-7 py-6">
      <Label>Read</Label>
      <h2 className="font-display text-heading">{text.title}</h2>
      {text.paragraphs.map((p, i) => {
        // Dialogue lines are written "Name: text"; the speaker is shown in bold
        const line = p.match(/^([A-ZÀ-Ý][\p{L}]*): (.+)$/u);
        return (
          <p key={i} className="text-reading">
            {line ? (
              <>
                <b className="font-bold">{line[1]}:</b> {line[2]}
              </>
            ) : (
              p
            )}
          </p>
        );
      })}
    </article>
  );
}
