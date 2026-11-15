import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ChevronRight, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';
import { deleteFeedback, draftFeedbackReply, getInbox, markInboxSeen, retriageFeedback, updateFeedback } from '@/engine/api';
import { useFeedbackStore } from '@/stores/feedbackStore';
import { Label } from '@/shared/components/design';
import LoadingScreen from '@/shared/components/LoadingScreen';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { AdminFeedback, FeedbackCategory, FeedbackStatus } from '@/types';
import { Place, Quote } from './parts';
import { CATEGORY, CATEGORY_ORDER, FAMILIES } from './categories';
import { timeAgo } from './timeAgo';

type Group = FeedbackCategory | 'pressing' | 'unsorted';

const GROUPS: Record<Group, { name: string; dot: string }> = {
  pressing: { name: 'Most pressing', dot: 'bg-vermiglione' },
  ...CATEGORY,
  unsorted: { name: 'Unsorted', dot: 'border-2 border-muted-foreground bg-white' },
};
// Most pressing first; noise last (collapsed); unsorted just before it
const GROUP_ORDER: Group[] = ['pressing', ...CATEGORY_ORDER.filter((c) => c !== 'noise'), 'unsorted', 'noise'];

const STATUS_LABEL: Record<FeedbackStatus, string> = {
  new: 'New',
  seen: 'Seen',
  in_progress: 'Looking into it',
  will_fix: 'Will be fixed',
  fixed: 'Fixed',
  wont_fix: "Won't change",
};
// Will be fixed stays open: agreed, but the fix is still to do
const OPEN: FeedbackStatus[] = ['new', 'seen', 'in_progress', 'will_fix'];

type Where = 'lesson' | 'grammar' | 'review' | 'elsewhere';
const WHERE_LABEL: Record<Where, string> = { lesson: 'Lessons', grammar: 'Grammar', review: 'Review', elsewhere: 'Elsewhere' };
function whereOf(f: AdminFeedback): Where {
  const kind = f.context.kind;
  if (kind === 'lesson') return 'lesson';
  if (kind === 'grammar' || kind === 'grammar_session') return 'grammar';
  if (kind === 'review') return 'review';
  return 'elsewhere';
}

/**
 * The one group a note shows in: Most pressing while it's open and urgent, else its first
 * category (the learner's first pick, or the AI's main one). Its other categories are tags.
 */
function groupOf(f: AdminFeedback): Group {
  if (f.pressing && OPEN.includes(f.status)) return 'pressing';
  return f.categories?.[0] ?? 'unsorted';
}

/** A short key for "the same place": the exercise if there is one, else the page. */
function placeKey(f: AdminFeedback): string {
  return f.context.exercise_id ?? f.context.path ?? 'none';
}

type View = 'category' | 'place' | 'newest';

function copyAsIssue(f: AdminFeedback) {
  const lines = [
    `## ${f.summary ?? f.text.slice(0, 70)}`,
    '',
    `**Where:** ${f.context.label ?? 'not attached'}${f.context.path ? ` (\`${f.context.path}\`)` : ''}`,
    f.context.exercise_id ? `**Exercise:** \`${f.context.exercise_id}\`` : '',
    f.quote ? `**Quoted:** > ${f.quote}` : '',
    '',
    f.text,
    f.verdict ? `\n**AI check:** ${f.verdict}` : '',
  ].filter((l, i, all) => l !== '' || all[i - 1] !== '');
  navigator.clipboard.writeText(lines.join('\n')).then(
    () => toast.success('Copied as an issue'),
    () => toast.error('Could not copy'),
  );
}

function Card({
  f,
  samePlace,
  onChange,
  onDelete,
}: {
  f: AdminFeedback;
  samePlace: number;
  onChange: (updated: AdminFeedback) => void;
  onDelete: (id: string) => void;
}) {
  const [replying, setReplying] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [reply, setReply] = useState(f.reply ?? '');
  const [busy, setBusy] = useState<string | null>(null);

  async function save(data: Parameters<typeof updateFeedback>[1], what: string) {
    setBusy(what);
    try {
      onChange(await updateFeedback(f.id, data));
    } catch (err) {
      console.error('Failed to update feedback:', err);
      toast.error('Could not save. Try again.');
    } finally {
      setBusy(null);
    }
  }

  async function draft() {
    setBusy('draft');
    try {
      setReply((await draftFeedbackReply(f.id)).reply);
    } catch (err) {
      console.error('Failed to draft reply:', err);
      toast.error('The AI could not draft a reply.');
    } finally {
      setBusy(null);
    }
  }

  async function sortAgain() {
    setBusy('sort');
    try {
      const updated = await retriageFeedback(f.id);
      onChange(updated);
      if (!updated.categories) toast.error('The AI still could not sort this one.');
    } catch (err) {
      console.error('Failed to sort feedback:', err);
      toast.error('The AI could not sort this one.');
    } finally {
      setBusy(null);
    }
  }

  async function remove() {
    setBusy('delete');
    try {
      await deleteFeedback(f.id);
      onDelete(f.id);
    } catch (err) {
      console.error('Failed to delete feedback:', err);
      toast.error('Could not delete. Try again.');
      setBusy(null);
    }
  }

  const sorting = !f.categories && !f.triaged_at && Date.now() - new Date(`${f.created_at}Z`).getTime() < 60_000;

  return (
    <article className={cn('panel flex flex-col gap-2.5 px-5 py-4', !OPEN.includes(f.status) && 'opacity-70')}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-[1.0625rem] font-bold">
          {f.summary ?? (sorting ? 'Sorting…' : f.text.slice(0, 80))}
        </span>
        <span className="text-sm whitespace-nowrap text-muted-foreground">
          {f.user_is_me ? 'You' : f.user_name ?? 'A learner'} · {timeAgo(f.created_at)}
          {f.hidden_by_learner && ' · removed by the learner'}
          {f.status === 'new' && <span className="ml-2 text-xs font-bold tracking-label text-correction uppercase">New</span>}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Place context={f.context} />
        {samePlace > 1 && (
          <span className="rounded-lg border border-border px-2 py-0.5 text-xs font-bold text-muted-foreground">
            {samePlace} notes here
          </span>
        )}
      </div>
      {f.context.attempt && (
        <div className="flex flex-col gap-0.5 rounded-lg border border-border bg-background px-3 py-2 text-sm leading-snug">
          <span>
            <Label className="mr-2">They answered</Label>
            <span className="font-semibold">{f.context.attempt.answer || '(nothing)'}</span>
            <span className={cn('ml-2 font-bold', f.context.attempt.accepted ? 'text-learned' : 'text-correction')}>
              {f.context.attempt.accepted ? 'accepted' : 'marked wrong'}
            </span>
          </span>
          {f.context.attempt.feedback && <span className="text-muted-foreground">The app said: {f.context.attempt.feedback}</span>}
        </div>
      )}
      <CategoryTags f={f} disabled={busy !== null} onSave={(categories) => save({ categories }, 'categories')} />
      {f.quote && <Quote text={f.quote} />}
      <p className="text-[0.9375rem] leading-normal whitespace-pre-line">{f.text}</p>
      {f.verdict && (
        <div className="flex gap-2.5 rounded-lg border border-dashed border-muted-foreground/50 px-3 py-2 text-sm leading-snug">
          <Label className="shrink-0 pt-0.5">AI check</Label>
          <span>{f.verdict}</span>
        </div>
      )}
      {f.reply && !replying && (
        <div className="flex flex-col gap-1 rounded-lg border border-border bg-background px-3.5 py-2.5">
          <Label>Your reply</Label>
          <p className="text-sm whitespace-pre-line">{f.reply}</p>
        </div>
      )}

      {replying && (
        <div className="flex flex-col gap-2">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={3}
            autoFocus
            placeholder="The learner sees this under their note."
            className="rounded-lg border-2 border-border px-3 py-2 text-[0.9375rem] outline-none focus:border-cobalto"
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={busy !== null}
              onClick={async () => {
                await save({ reply }, 'reply');
                setReplying(false);
              }}
              className={cn(buttonVariants(), 'h-9 px-4 font-bold')}
            >
              {busy === 'reply' ? 'Saving…' : 'Save reply'}
            </button>
            <button type="button" disabled={busy !== null} onClick={draft} className="text-sm font-semibold text-cobalto hover:underline">
              {busy === 'draft' ? 'Drafting…' : 'Draft with AI'}
            </button>
            <button type="button" onClick={() => setReplying(false)} className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <select
          aria-label="Status"
          value={f.status}
          disabled={busy !== null}
          onChange={(e) => save({ status: e.target.value as FeedbackStatus }, 'status')}
          className="h-9 rounded-lg border-2 border-foreground bg-white px-2 font-bold"
        >
          {(Object.keys(STATUS_LABEL) as FeedbackStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABEL[s]}</option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 font-semibold">
          <input
            type="checkbox"
            checked={f.pressing}
            disabled={busy !== null}
            onChange={(e) => save({ pressing: e.target.checked }, 'pressing')}
            className="size-4 accent-nero"
          />
          Pressing
        </label>
        {!replying && (
          <button type="button" onClick={() => setReplying(true)} className="font-semibold text-cobalto hover:underline">
            {f.reply ? 'Edit reply' : 'Reply'}
          </button>
        )}
        <button type="button" onClick={() => copyAsIssue(f)} className="font-semibold text-cobalto hover:underline">
          Copy as issue
        </button>
        {!f.category_by_admin && (
          <button
            type="button"
            disabled={busy !== null}
            onClick={sortAgain}
            className="flex items-center gap-1 font-semibold text-cobalto hover:underline"
          >
            <RefreshCw className={cn('size-3.5', busy === 'sort' && 'animate-spin')} aria-hidden />
            Sort again
          </button>
        )}
        {confirmDelete ? (
          <span className="flex items-center gap-3">
            <span className="font-semibold">Delete for good? The learner loses it too.</span>
            <button type="button" disabled={busy !== null} onClick={remove} className="font-bold text-correction hover:underline">
              {busy === 'delete' ? 'Deleting…' : 'Delete'}
            </button>
            <button type="button" onClick={() => setConfirmDelete(false)} className="font-medium text-muted-foreground hover:text-foreground">
              Cancel
            </button>
          </span>
        ) : (
          <button type="button" disabled={busy !== null} onClick={() => setConfirmDelete(true)} className="font-semibold text-muted-foreground hover:text-correction">
            Delete
          </button>
        )}
      </div>
    </article>
  );
}

/** The note's categories as tags: remove with ×, add from the menu. The learner's own picks are marked. */
function CategoryTags({
  f,
  disabled,
  onSave,
}: {
  f: AdminFeedback;
  disabled: boolean;
  onSave: (categories: FeedbackCategory[]) => void;
}) {
  const current = f.categories ?? [];
  const addable = CATEGORY_ORDER.filter((c) => !current.includes(c));
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {current.map((c) => (
        <span
          key={c}
          title={f.learner_categories.includes(c as never) ? 'Picked by the learner' : undefined}
          className="flex h-7 items-center gap-1.5 rounded-md border border-border bg-white pr-0.5 pl-2 text-xs font-bold"
        >
          <span className={cn('size-2 rounded-full', CATEGORY[c].dot)} />
          {CATEGORY[c].name}
          {f.learner_categories.includes(c as never) && <span className="font-medium text-muted-foreground">· learner</span>}
          <button
            type="button"
            aria-label={`Remove ${CATEGORY[c].name}`}
            disabled={disabled || current.length === 1}
            onClick={() => onSave(current.filter((x) => x !== c))}
            className="flex size-6 items-center justify-center text-muted-foreground hover:text-foreground disabled:invisible"
          >
            <X className="size-3" strokeWidth={2.5} />
          </button>
        </span>
      ))}
      <select
        aria-label="Add a category"
        value=""
        disabled={disabled}
        onChange={(e) => e.target.value && onSave([...current, e.target.value as FeedbackCategory])}
        className="h-7 rounded-md border border-dashed border-muted-foreground/60 bg-transparent px-1.5 text-xs font-semibold text-muted-foreground"
      >
        <option value="">{current.length ? '+ Add' : 'Sort into…'}</option>
        {addable.map((c) => (
          <option key={c} value={c}>{CATEGORY[c].name}</option>
        ))}
      </select>
    </div>
  );
}

function CheckList<T extends string>({
  title,
  options,
  selected,
  counts,
  onToggle,
}: {
  title: string;
  options: { value: T; label: string }[];
  selected: Set<T>;
  counts: Record<string, number>;
  onToggle: (value: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <Label>{title}</Label>
      {options.map((o) => (
        <label key={o.value} className="flex items-center gap-2.5 text-[0.9375rem] font-semibold">
          <input type="checkbox" checked={selected.has(o.value)} onChange={() => onToggle(o.value)} className="size-4 accent-nero" />
          <span className="flex-1">{o.label}</span>
          <span className="text-muted-foreground tabular-nums">{counts[o.value] ?? 0}</span>
        </label>
      ))}
    </div>
  );
}

function toggle<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

type StatusFilter = 'open' | 'done';

/** Profile › Inbox (admins only): all feedback, sorted by the AI into groups. */
export default function Inbox() {
  const summary = useFeedbackStore((s) => s.summary);
  const refreshSummary = useFeedbackStore((s) => s.refreshSummary);
  const [items, setItems] = useState<AdminFeedback[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [view, setView] = useState<View>('category');
  const [statuses, setStatuses] = useState<Set<StatusFilter>>(new Set(['open']));
  const [wheres, setWheres] = useState<Set<Where>>(new Set(['lesson', 'grammar', 'review', 'elsewhere']));
  const [showNoise, setShowNoise] = useState(false);
  // Empty: all. Otherwise a note matches if it has any of these among its categories
  const [cats, setCats] = useState<Set<FeedbackCategory | 'unsorted'>>(new Set());

  useEffect(() => {
    let cancelled = false;
    getInbox()
      .then(async (list) => {
        if (cancelled) return;
        setItems(list);
        // Opened: new notes count as seen (the cards keep their New mark until next time)
        if (list.some((f) => f.status === 'new')) {
          await markInboxSeen();
          refreshSummary();
        }
      })
      .catch((err) => {
        console.error('Failed to load the inbox:', err);
        if (!cancelled) setFailed(true);
      });
    return () => { cancelled = true; };
  }, [refreshSummary]);

  // Notes just sent are still being sorted: look again shortly
  useEffect(() => {
    if (!items?.some((f) => !f.triaged_at && Date.now() - new Date(`${f.created_at}Z`).getTime() < 60_000)) return;
    const t = setTimeout(() => {
      getInbox().then(setItems).catch(() => {});
    }, 5000);
    return () => clearTimeout(t);
  }, [items]);

  const visible = useMemo(
    () =>
      (items ?? []).filter(
        (f) =>
          statuses.has(OPEN.includes(f.status) ? 'open' : 'done') &&
          wheres.has(whereOf(f)) &&
          (cats.size === 0 || (f.categories ?? ['unsorted' as const]).some((c) => cats.has(c))),
      ),
    [items, statuses, wheres, cats],
  );

  const samePlaceCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const f of visible) counts.set(placeKey(f), (counts.get(placeKey(f)) ?? 0) + 1);
    return counts;
  }, [visible]);

  // Wait for the summary so a non-admin isn't shown the page (the API refuses them anyway)
  if (summary && summary.inbox_new === null) return <Navigate to="/profile" replace />;
  if (failed) return <p className="text-muted-foreground">The inbox couldn't be loaded. Try again in a moment.</p>;
  if (!items) return <LoadingScreen />;

  // Each filter group counts the notes that pass the other groups, so the numbers match what
  // ticking that box would show (e.g. with only Open ticked, categories count open notes only)
  const statusOf = (f: AdminFeedback) => (OPEN.includes(f.status) ? 'open' : 'done');
  const catsOf = (f: AdminFeedback) => f.categories ?? ['unsorted' as const];
  const passStatus = (f: AdminFeedback) => statuses.has(statusOf(f));
  const passWhere = (f: AdminFeedback) => wheres.has(whereOf(f));
  const passCats = (f: AdminFeedback) => cats.size === 0 || catsOf(f).some((c) => cats.has(c));
  const tally = (list: AdminFeedback[], keys: (f: AdminFeedback) => string[]) => {
    const counts: Record<string, number> = {};
    for (const f of list) for (const k of keys(f)) counts[k] = (counts[k] ?? 0) + 1;
    return counts;
  };
  const statusCounts = tally(items.filter((f) => passWhere(f) && passCats(f)), (f) => [statusOf(f)]);
  const whereCounts = tally(items.filter((f) => passStatus(f) && passCats(f)), (f) => [whereOf(f)]);
  const catCounts = tally(items.filter((f) => passStatus(f) && passWhere(f)), catsOf);
  // Which categories to offer comes from all notes, so a ticked box never vanishes when its count drops to 0
  const allCats = tally(items, catsOf);
  const catOptions = [...CATEGORY_ORDER, 'unsorted' as const]
    .filter((c) => allCats[c])
    .map((c) => ({ value: c, label: c === 'unsorted' ? 'Unsorted' : CATEGORY[c].name }));

  function replace(updated: AdminFeedback) {
    setItems((list) => list?.map((f) => (f.id === updated.id ? updated : f)) ?? null);
    refreshSummary();
  }

  function removeItem(id: string) {
    setItems((list) => list?.filter((f) => f.id !== id) ?? null);
    refreshSummary();
  }

  const card = (f: AdminFeedback) => (
    <Card key={f.id} f={f} samePlace={samePlaceCounts.get(placeKey(f)) ?? 1} onChange={replace} onDelete={removeItem} />
  );

  let body;
  if (visible.length === 0) {
    body = <p className="text-muted-foreground">{items.length ? 'Nothing matches these filters.' : 'No feedback yet.'}</p>;
  } else if (view === 'newest') {
    body = <div className="flex flex-col gap-3">{visible.map(card)}</div>;
  } else if (view === 'place') {
    const byPlace = new Map<string, AdminFeedback[]>();
    for (const f of visible) {
      const key = f.context.label ?? 'No place attached';
      byPlace.set(key, [...(byPlace.get(key) ?? []), f]);
    }
    body = [...byPlace.entries()]
      .sort((a, b) => b[1].length - a[1].length)
      .map(([place, list]) => (
        <section key={place} className="flex flex-col gap-3">
          <h2 className="flex items-center gap-2.5 font-display text-xl">
            {place} <span className="font-sans text-sm text-muted-foreground">{list.length}</span>
          </h2>
          {list.map(card)}
        </section>
      ));
  } else {
    body = GROUP_ORDER.map((g) => {
      const list = visible.filter((f) => groupOf(f) === g);
      if (list.length === 0) return null;
      const header = (
        <h2 className="flex items-center gap-2.5 font-display text-xl">
          <span className={cn('size-2.5 shrink-0 rounded-full', GROUPS[g].dot)} />
          {GROUPS[g].name}
          <span className="font-sans text-sm text-muted-foreground">{list.length}</span>
        </h2>
      );
      if (g === 'noise' && !showNoise) {
        return (
          <button
            key={g}
            type="button"
            onClick={() => setShowNoise(true)}
            className="flex items-center gap-2.5 rounded-lg border-2 border-dashed border-border px-4 py-3 text-left text-[0.9375rem] font-bold text-muted-foreground"
          >
            <ChevronRight className="size-4" aria-hidden />
            Probably noise · {list.length}
            <span className="font-medium">(empty or accidental notes, hidden until opened)</span>
          </button>
        );
      }
      return (
        <section key={g} className="flex flex-col gap-3">
          {header}
          {g === 'unsorted' && (
            <p className="-mt-1 text-sm text-muted-foreground">The AI couldn't sort these, or is still working on them.</p>
          )}
          {list.map(card)}
        </section>
      );
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm text-muted-foreground">Admin · only you see this tab</span>
        <div className="flex gap-1 rounded-lg border border-border bg-white p-1">
          {(['category', 'place', 'newest'] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={cn(
                'h-8.5 rounded-md px-3.5 text-sm',
                view === v ? 'bg-nero font-bold text-white' : 'font-semibold text-muted-foreground hover:text-foreground',
              )}
            >
              {v === 'category' ? 'By category' : v === 'place' ? 'By place' : 'Newest'}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
        <aside className="flex shrink-0 flex-col gap-6 max-lg:flex-row max-lg:flex-wrap max-lg:gap-x-10 lg:w-50">
          <CheckList
            title="Status"
            options={[{ value: 'open' as StatusFilter, label: 'Open' }, { value: 'done' as StatusFilter, label: 'Done' }]}
            selected={statuses}
            counts={statusCounts}
            onToggle={(v) => setStatuses((s) => toggle(s, v))}
          />
          <CheckList
            title="Where"
            options={(Object.keys(WHERE_LABEL) as Where[]).map((w) => ({ value: w, label: WHERE_LABEL[w] }))}
            selected={wheres}
            counts={whereCounts}
            onToggle={(v) => setWheres((s) => toggle(s, v))}
          />
          {catOptions.length > 0 && (
            <div className="flex flex-col gap-4">
              {[...FAMILIES.map((fam) => ({ title: fam.name, ids: CATEGORY_ORDER.filter((c) => CATEGORY[c].family === fam.id) })),
                { title: 'Not sorted', ids: ['noise', 'unsorted'] as const }]
                .map((fam) => ({ ...fam, options: catOptions.filter((o) => (fam.ids as readonly string[]).includes(o.value)) }))
                .filter((fam) => fam.options.length > 0)
                .map((fam) => (
                  <CheckList
                    key={fam.title}
                    title={fam.title}
                    options={fam.options}
                    selected={cats}
                    counts={catCounts}
                    onToggle={(v) => setCats((s) => toggle(s, v))}
                  />
                ))}
              {cats.size > 0 && (
                <button type="button" onClick={() => setCats(new Set())} className="self-start text-sm font-semibold text-cobalto hover:underline">
                  Show all categories
                </button>
              )}
            </div>
          )}
          <p className="text-sm leading-normal text-muted-foreground max-lg:hidden">
            Each note shows once, under its first category. Tick categories to see every note that has them.
          </p>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col gap-7">{body}</div>
      </div>
    </div>
  );
}
