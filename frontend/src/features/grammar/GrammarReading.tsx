import { Fragment, type ReactNode } from 'react';
import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sectionAnchor } from '@/engine/grammar';
import { cn } from '@/lib/utils';

/* Minimal hast shape, enough to read the text of a node. */
interface HastNode {
  type: string;
  value?: string;
  tagName?: string;
  children?: HastNode[];
}

function textOf(node: HastNode | undefined): string {
  if (!node) return '';
  if (node.type === 'text') return node.value ?? '';
  if (node.tagName === 'br') return '\n';
  return (node.children ?? []).map(textOf).join('');
}

function headingText(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(headingText).join('');
  if (children && typeof children === 'object' && 'props' in children) {
    return headingText((children.props as { children?: ReactNode }).children);
  }
  return '';
}

const components: Components = {
  h2: ({ children }) => (
    <h2 id={sectionAnchor(headingText(children))} className="mt-6 scroll-mt-24 font-display text-heading">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 id={sectionAnchor(headingText(children))} className="mt-2 scroll-mt-24 text-xl font-bold">
      {children}
    </h3>
  ),
  p: ({ children }) => <p>{children}</p>,
  ul: ({ children }) => <ul className="flex list-disc flex-col gap-1.5 pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="flex list-decimal flex-col gap-3 pl-6 [&>li>blockquote]:mt-2">{children}</ol>,
  a: ({ children, href }) => (
    <a href={href} className="font-medium text-cobalto underline underline-offset-2">
      {children}
    </a>
  ),
  /* An example: the Italian on the first line, the English on the second. */
  blockquote: ({ node }) => {
    const [italian, ...english] = textOf(node as HastNode).trim().split('\n');
    return (
      <div className="flex flex-col gap-0.5 border-l-3 border-grammar py-1 pl-4.5">
        <p className="font-medium italic">{italian}</p>
        {english.length > 0 && <p className="text-base text-muted-foreground">{english.join(' ')}</p>}
      </div>
    );
  },
  /* The typical-mistakes table (headed ✗ / ✓) gets red-pen styling. */
  table: ({ node, children }) => {
    const mistakes = textOf(node as HastNode).trimStart().startsWith('✗');
    return (
      <div className="overflow-x-auto">
        <table
          className={cn(
            'w-full border border-border bg-white text-base',
            mistakes &&
              '[&_tbody_td:nth-child(1)]:underline [&_tbody_td:nth-child(1)]:decoration-correction [&_tbody_td:nth-child(1)]:decoration-wavy [&_tbody_td:nth-child(1)]:decoration-1 [&_tbody_td:nth-child(1)]:underline-offset-4 [&_tbody_td:nth-child(1)]:[text-decoration-skip-ink:none] [&_tbody_td:nth-child(2)]:font-hand [&_tbody_td:nth-child(2)]:text-2xl [&_tbody_td:nth-child(2)]:leading-none [&_tbody_td:nth-child(2)]:text-correction',
          )}
        >
          {children}
        </table>
      </div>
    );
  },
  /* Conjugation tables have an empty header row, which isn't shown. */
  thead: ({ node, children }) =>
    textOf(node as HastNode).trim() ? <thead className="border-b-2 border-foreground text-left">{children}</thead> : null,
  tr: ({ children }) => <tr className="border-t border-border first:border-t-0">{children}</tr>,
  th: ({ children }) => <th className="px-4 py-2 text-xs font-bold uppercase tracking-label text-muted-foreground">{children}</th>,
  td: ({ children }) => <td className="px-4 py-2 align-top">{children}</td>,
};

/** Splits the Markdown into sections, one per heading (the intro before the first heading has none). */
function splitSections(body: string): { heading?: string; markdown: string }[] {
  const sections: { heading?: string; markdown: string }[] = [{ markdown: '' }];
  for (const line of body.split('\n')) {
    const m = line.match(/^#{2,3} (.+)$/);
    if (m) sections.push({ heading: m[1].replace(/[*_`]/g, ''), markdown: '' });
    sections[sections.length - 1].markdown += `${line}\n`;
  }
  return sections;
}

/**
 * A grammar unit's reading, rendered from its Markdown. `after` places extra content (practice stops)
 * right after the section with that heading, before the next heading.
 */
export default function GrammarReading({ body, after = {} }: { body: string; after?: Record<string, ReactNode> }) {
  return (
    <div className="flex max-w-4xl flex-col gap-4.5 text-reading">
      {splitSections(body).map((s, i) => (
        <Fragment key={i}>
          <Markdown remarkPlugins={[remarkGfm]} components={components}>
            {s.markdown}
          </Markdown>
          {s.heading && after[s.heading]}
        </Fragment>
      ))}
    </div>
  );
}
