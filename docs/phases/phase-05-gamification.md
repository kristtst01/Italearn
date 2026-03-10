# Phase 5 — Gamification

**Goal:** Add the motivational layer that keeps you coming back daily. XP, streaks, levels, and mastery tracking — but always in service of learning, never replacing it.

## What This Delivers

- XP system with per-exercise scoring
- Daily streak tracking with calendar visualization
- Level / rank progression
- Mastery percentage per unit (derived from SRS card state)
- Checkpoint badges
- Home screen dashboard showing all of the above

## Learning Principles Addressed

- **Gamification as motivation, not goal**: Duolingo's biggest criticism is that engagement metrics (streaks, leaderboards) became ends in themselves. Our gamification reflects actual learning progress — mastery decays when SRS cards are overdue, XP comes from completing exercises correctly, not just showing up.
- **Visible competence growth**: research on self-determination theory (Deci & Ryan) shows that perceived competence is a core motivator. Mastery percentages and level progression make learning progress tangible.
- **Daily habit formation**: streaks encourage consistent practice, which is critical for SRS to work (missed reviews create backlogs that degrade retention).

## Technical Deliverables

### 1. XP System (`src/engine/xp.ts`)
- Points per exercise: base 10 XP for correct answer, 0 for incorrect
- Streak bonus: consecutive correct answers within a lesson multiply XP (2x at 3 in a row, 3x at 5)
- Review XP: slightly lower (8 XP base) to incentivize new lessons over pure review grinding
- Checkpoint completion: bonus XP award (50 XP)

### 2. Level / Rank System
- Simple XP thresholds: Level 1 = 0 XP, Level 2 = 100 XP, Level 3 = 250 XP, etc. (increasing gaps)
- Optional rank names tied to Italian (Principiante, Studente, Intermedio, Avanzato, Esperto)
- Level-up notification when threshold crossed

### 3. Streak Tracking (`src/engine/streak.ts`)
- A "day" counts if the user completes at least 1 lesson or 5 reviews
- Store as array of dates in IndexedDB
- Current streak: consecutive days from today backward
- Longest streak: historical max
- Calendar view component showing last 30 days (green = active, gray = missed)

### 4. Mastery Percentage (`src/engine/mastery.ts`)
- Per-unit mastery derived from SRS card states for all vocabulary in that unit
- Formula: average retrievability across all cards in the unit (FSRS provides this)
- Decays naturally as cards become overdue — mastery is not permanent, it requires maintenance
- Shown on path screen next to each unit

### 5. Checkpoint Badges
- Awarded on passing a section checkpoint
- Stored in user progress
- Displayed on path screen and home dashboard
- Simple badge icons per section (Section 1: star, Section 2: book, etc.)

### 6. Home Dashboard (`src/pages/Home.tsx`)
- Daily summary: streak count, today's XP, cards due for review
- Quick actions: "Continue lesson" (resume where you left off), "Review" (SRS queue)
- Overall progress: current section/unit, total XP, level
- Mastery overview: mini progress bars per completed unit

### 7. Persistence Updates
- New Dexie tables/fields: `xpLog` (XP earned per day), `streakDates`, `badges`
- Zustand store updated with gamification state

## Design Notes

- Keep it clean and non-overwhelming — this isn't a casino
- Streak display should motivate, not guilt-trip. No aggressive "you'll lose your streak!" notifications.
- Mastery decay is shown matter-of-factly: "Unit 1: 92% → needs review" not "You're forgetting everything!"
