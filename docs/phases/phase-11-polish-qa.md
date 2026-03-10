# Phase 11 — Polish & QA

**Goal:** Final polish pass — PWA setup, data portability, settings, curriculum review, and overall quality assurance. After this phase, the app is complete and fully usable for daily Italian learning from A1 to B2.

## What This Delivers

- Progressive Web App (installable on phone/desktop)
- Offline support
- Import/export of all learning data
- Settings screen
- Full curriculum content review and correction
- Performance optimization
- Accessibility pass

## Technical Deliverables

### 1. PWA Setup
- Service worker for offline caching (Vite PWA plugin)
- Web app manifest (icon, name, theme color, display: standalone)
- Installable on mobile home screen and desktop
- Cache curriculum JSON files for offline use
- Offline indicator in UI

### 2. Import/Export Progress
- Export: download all user data as single JSON file (progress, SRS cards, XP, streaks, settings)
- Import: upload a JSON file to restore all state
- Useful for: backup, moving to a new device, starting fresh
- Format is human-readable and documented

### 3. Settings Screen (`src/pages/Settings.tsx`)
- **SRS target retention**: slider 80-95% (default 90%) — controls how aggressively FSRS schedules reviews
- **Daily new cards limit**: how many new words per day (default: 20)
- **Daily review limit**: max reviews per session (default: unlimited, but warn at 100+)
- **Interface language**: English / Mixed / Italian
- **Audio auto-play**: on/off
- **Speech exercises**: enable/disable (for when mic isn't available)
- **Reset progress**: with confirmation dialog
- **Export/import data**
- **About**: version, credits, research sources link

### 4. Curriculum Content Review
- Manual review pass over all generated curriculum content
- Verify Italian accuracy (spelling, grammar, natural phrasing)
- Check exercise quality (reasonable distractors, clear prompts, correct answers actually correct)
- Ensure vocabulary progression makes sense (no word used before it's taught)
- Verify 98% comprehension threshold in reading passages
- Fix any LLM-generated errors or unnatural phrasing

### 5. Performance Optimization
- Lazy-load curriculum JSON by section (don't load B2 content at A1)
- Virtualize long lists (path view with 38 units)
- Optimize IndexedDB queries (index on `due` date for SRS)
- Bundle size analysis — keep initial load fast

### 6. Accessibility
- Keyboard navigation for all exercises
- Screen reader labels on interactive elements
- Sufficient color contrast (especially for correct/incorrect feedback)
- Focus management during lesson flow
- Reduced motion option for animations

### 7. Edge Cases & QA
- What happens when all SRS cards are reviewed? (Show "all caught up" state)
- What happens when all lessons are completed? (Show "curriculum complete" celebration)
- Handle browser TTS unavailable gracefully
- Handle speech recognition unavailable gracefully
- Test on: Chrome, Firefox, Safari, mobile Chrome, mobile Safari
- Test with slow/no network connection (should work offline after first load)
- Verify IndexedDB doesn't grow unboundedly (review log pruning if needed)
