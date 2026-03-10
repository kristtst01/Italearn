# Phase 6 — Path & Progression Polish

**Goal:** Transform the basic unit list into a visually engaging Duolingo-style skill path. Add test-out functionality and section transitions.

## What This Delivers

- Visual winding path (not just a flat list) with node-based unit display
- CEFR level banners between sections (A1 → A2 → B1 → B2)
- Test-out option to skip units you already know
- Lesson-complete and checkpoint-complete animations
- Scroll-to-current-position on load

## Learning Principles Addressed

- **Visible progress path**: seeing the full journey from A1 to B2 provides a sense of direction and accomplishment. Research on goal-setting (Locke & Latham) shows that clear, visible goals improve motivation and performance.
- **Test-out / placement**: avoids boring learners who already know basics. Forcing someone through "ciao means hello" when they already know it creates frustration and wasted time — a core Duolingo complaint.
- **CEFR level awareness**: making CEFR levels visible helps learners understand where they are in internationally recognized terms, useful for self-assessment.

## Technical Deliverables

### 1. Visual Path Component (`src/components/Path.tsx`)
- Winding/zigzag layout of unit nodes (alternating left/right)
- Each node: unit icon, name, mastery ring (from Phase 5), lock/unlock state
- Connector lines between nodes
- Current unit highlighted/pulsing
- Checkpoint nodes styled distinctly (larger, different color)
- Auto-scroll to current position on page load

### 2. CEFR Section Banners
- Full-width banners between sections: "A1 — Foundations", "A2 — Elementary", etc.
- Show when a new CEFR level begins (Sections 1-3 = A1, 4-6 = A2, 7-8 = B1, 9-10 = B2)
- Celebratory transition when crossing a CEFR boundary

### 3. Test-Out Flow (`src/pages/TestOut.tsx`)
- Available on locked units: "Already know this? Test out!"
- Generates a challenging quiz from the unit's vocabulary and grammar
- Heavier on production (type answer, fill-in-blank) than recognition
- Must score ≥ 90% to skip the unit
- On pass: unit marked as completed, SRS cards created at a higher initial stability (you know these words, so longer first interval)
- On fail: "Good try! You got X/Y — we recommend starting from Lesson N"

### 4. Animations
- Lesson complete: confetti / checkmark animation, XP gained display
- Checkpoint passed: badge earned animation, section unlocked reveal
- Keep animations brief (< 2 seconds) — satisfying, not time-wasting

### 5. Unit Detail Modal
- Tap a unit on the path to see: lesson list, grammar focus, vocabulary preview, mastery breakdown
- Quick-start any available lesson from here
