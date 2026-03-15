import { useState, useMemo, useEffect } from 'react';
import { UserProfile, useClerk, useUser } from '@clerk/clerk-react';
import { TriangleAlert, Pencil, Check, X } from 'lucide-react';
import StreakCalendar from '@/shared/components/StreakCalendar';
import ProgressBar from '@/shared/components/ProgressBar';
import { useProgressStore } from '@/stores/progressStore';
import { getLevel } from '@/engine/xp';
import { getMe, updateMe, resetProgress } from '@/engine/api';
import { clerkAppearance } from '@/features/auth/appearance';

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
    <div className="rounded-xl bg-white border border-gray-200 p-4 mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
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
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Your display name"
              />
              <button onClick={save} disabled={saving} className="text-green-600 hover:text-green-700">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-gray-900 truncate">
                {displayName ?? 'Set your display name'}
              </p>
              <button onClick={startEdit} className="text-gray-400 hover:text-gray-600">
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <p className="text-xs text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const xp = useProgressStore((s) => s.xp);
  const badges = useProgressStore((s) => s.badges);
  const [confirmReset, setConfirmReset] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const { signOut } = useClerk();

  const levelInfo = useMemo(() => getLevel(xp), [xp]);
  const xpInLevel = levelInfo.currentXP - levelInfo.currentThreshold;
  const xpNeeded = levelInfo.nextThreshold - levelInfo.currentThreshold;
  const levelProgress = xpNeeded > 0 ? Math.round((xpInLevel / xpNeeded) * 100) : 100;

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>

        {/* User tag */}
        <UserTag />

        {/* Level & rank card */}
        <div className="rounded-xl bg-white border border-gray-200 p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Level {levelInfo.level}</p>
              <p className="text-lg font-bold text-gray-900">{levelInfo.rank}</p>
            </div>
            <p className="text-sm text-gray-500">{xp.toLocaleString()} XP</p>
          </div>
          <div className="mb-1">
            <ProgressBar progress={levelProgress} />
          </div>
          <p className="text-xs text-gray-400">
            {xpNeeded > 0
              ? `${xpInLevel} / ${xpNeeded} XP to level ${levelInfo.level + 1}`
              : 'Max level reached'}
          </p>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="rounded-xl bg-white border border-gray-200 p-4 mb-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Badges</p>
            <div className="flex items-center gap-2">
              {badges.map((b) => (
                <span key={b.sectionId} className="text-2xl" title={`Section: ${b.sectionId}`}>
                  ⭐
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Streak calendar */}
        <StreakCalendar />

        {/* Account management */}
        <div className="mt-6">
          <button
            onClick={() => setShowAccount(!showAccount)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            {showAccount ? 'Hide account settings' : 'Account settings'}
          </button>

          {showAccount && (
            <div className="mt-4 rounded-xl bg-white border border-gray-200 overflow-hidden">
              <UserProfile
                routing="hash"
                appearance={{
                  ...clerkAppearance,
                  elements: {
                    ...clerkAppearance.elements,
                    rootBox: 'w-full',
                    cardBox: 'shadow-none border-0',
                  },
                }}
              />
            </div>
          )}
        </div>

        {/* Sign out */}
        <div className="mt-4">
          <button
            onClick={() => signOut()}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Sign out
          </button>
        </div>

        {/* Reset progress */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              Reset all progress
            </button>
          ) : (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">
              <div className="flex items-start gap-2">
                <TriangleAlert className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Are you sure?</p>
                  <p className="text-xs text-red-600 mt-0.5">
                    This will permanently delete all your lessons, XP, streaks, SRS cards, and scores. This cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Yes, reset everything
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
