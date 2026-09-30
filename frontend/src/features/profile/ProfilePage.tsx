import { useState, useEffect } from 'react';
import { UserProfile, useClerk, useUser } from '@clerk/clerk-react';
import { TriangleAlert, Pencil, Check, X } from 'lucide-react';
import StreakCalendar from '@/shared/components/StreakCalendar';
import { getMe, updateMe, resetProgress } from '@/engine/api';
import { clerkAppearance } from '@/features/auth/appearance';
import { Page, PageHeader } from '@/shared/components/design';
import { buttonVariants } from '@/components/ui/button';

function UserTag() {
  const { user } = useUser();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMe().then((me) => setDisplayName(me.display_name));
  }, []);

  function startEdit() {
    setDraft(displayName ?? '');
    setEditing(true);
  }

  async function save() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      const updated = await updateMe({ display_name: trimmed });
      setDisplayName(updated.display_name);
      setEditing(false);
    } catch (err) {
      console.error('Failed to update display name:', err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-white px-5 py-4">
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-cobalto font-display text-lg text-white">
          {(displayName ?? user?.firstName ?? '?')[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && save()}
                maxLength={30}
                autoFocus
                className="flex-1 rounded-lg border-2 border-border px-3 py-1.5 text-base outline-none focus:border-cobalto"
                placeholder="Your display name"
              />
              <button onClick={save} disabled={saving} className="text-learned hover:opacity-80" aria-label="Save">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={() => setEditing(false)} className="text-muted-foreground hover:text-foreground" aria-label="Cancel">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="truncate text-lg font-bold">
                {displayName ?? 'Set your display name'}
              </p>
              <button onClick={startEdit} className="text-muted-foreground hover:text-foreground" aria-label="Edit display name">
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <p className="text-sm text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [confirmReset, setConfirmReset] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const { signOut } = useClerk();

  async function handleReset() {
    try {
      await resetProgress();
    } catch (err) {
      console.error('Failed to reset progress:', err);
    }
    setConfirmReset(false);
    window.location.reload();
  }

  return (
    <Page className="max-w-3xl">
      <PageHeader label="Account" title="Profile" />

      <UserTag />
      <StreakCalendar />

      <div className="flex flex-col items-start gap-3">
        <button
          type="button"
          onClick={() => setShowAccount(!showAccount)}
          className="font-bold text-cobalto hover:underline"
        >
          {showAccount ? 'Hide account settings' : 'Account settings'}
        </button>
        {showAccount && (
          <div className="w-full overflow-hidden rounded-lg border border-border bg-white">
            <UserProfile
              routing="hash"
              appearance={{
                ...clerkAppearance(),
                elements: {
                  ...clerkAppearance().elements,
                  rootBox: 'w-full',
                  cardBox: 'shadow-none border-0',
                },
              }}
            />
          </div>
        )}
        <button type="button" onClick={() => signOut()} className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Sign out
        </button>
      </div>

      <div className="border-t border-border pt-6">
        {!confirmReset ? (
          <button type="button" onClick={() => setConfirmReset(true)} className="text-sm font-medium text-correction hover:underline">
            Reset all progress
          </button>
        ) : (
          <div className="flex flex-col gap-4 rounded-lg border-2 border-correction bg-white p-5">
            <div className="flex items-start gap-3">
              <TriangleAlert className="mt-0.5 size-5 shrink-0 text-correction" />
              <div>
                <p className="font-bold">Reset everything?</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  This permanently deletes your completed lessons, streak, review cards and scores. It can't be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={handleReset} className={buttonVariants({ size: 'xl' })}>
                Yes, reset everything
              </button>
              <button type="button" onClick={() => setConfirmReset(false)} className={buttonVariants({ variant: 'stroke', size: 'xl' })}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
}
