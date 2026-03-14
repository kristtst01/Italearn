# Phase 3 — Audio & Listening Exercises

> **Status: Deferred — needs further research before implementation.**
> The Web Speech API (`speechSynthesis`) produces inconsistent audio quality across browsers and OS — unacceptable for a language learning app where Italian pronunciation modelling matters. Use **ElevenLabs** to pre-generate all audio at build time and ship as static assets. Do not implement using `speechSynthesis`.

**Goal:** Add audio to the entire app and introduce listening-specific exercises. Every Italian word and sentence becomes audible, and new exercise types test comprehension by ear — including story/dialogue-based listening.

## What This Delivers

- Pre-generated ElevenLabs audio on every Italian word and sentence throughout the app (lessons, reviews, path)
- Play button on all Italian text
- 3 new listening exercise types
- Story and dialogue listening content with multiple voices
- Existing exercises gain audio cues (e.g., multiple choice can now play the prompt as audio)

## Learning Principles Addressed

- **Phonological memory**: Baddeley et al. (1998) showed phonological memory is one of the strongest predictors of L2 vocabulary acquisition. Hearing every word builds the "sound image" of Italian.
- **Listening comprehension**: a core skill that Duolingo under-serves. Loewen et al. (2019) found app learners often lack oral proficiency — listening exercises help bridge this gap.
- **Dual coding**: combining visual text with audio engages two memory systems (Paivio 1986), improving retention.
- **Minimal pairs**: training the ear to distinguish similar Italian sounds (e.g., pesca/pèsca, anno/ano) that English speakers often conflate.

## Technical Deliverables

### 1. Audio Generation Pipeline (build-time)
- Batch-generate all Italian audio using ElevenLabs API at build time
- Ship generated audio as static assets (no runtime API calls)
- Use at least 2 distinct Italian voices for dialogue/story content
- Output format: mp3 or opus, organized by unit/lesson
- Re-generate only changed/new content on subsequent builds
- Script: `scripts/generate-audio.ts` — reads lesson JSON, generates audio for all Italian text, outputs to `public/audio/`

### 2. Audio Playback Service (`src/engine/audio.ts`)
- `play(audioId: string, rate?: number)` — plays pre-generated audio by ID
- `playSlow(audioId: string)` — plays at reduced speed for dictation
- Queue management: cancel current playback before starting new
- Preload hints for upcoming exercises

### 3. Audio Play Button (`src/shared/components/AudioButton.tsx`)
- Small speaker icon, reusable everywhere
- Click to hear the Italian text
- Auto-plays on first appearance in exercises (configurable)
- Visual feedback while playing

### 4. Updated Existing Exercises
- `MultipleChoice`: option to play prompt as audio instead of (or alongside) showing text
- `TypeAnswer`: audio button next to Italian sentence context
- `ArrangeWords`: hear the target sentence before arranging
- `FillInBlank` / `ClozeDelete`: audio for the full sentence

### 5. New Listening Exercise Components
- `ListenAndChoose.tsx` — hear an Italian sentence, pick correct English translation from 4 options. Text is NOT shown — pure listening comprehension.
- `Dictation.tsx` — hear an Italian sentence, type what you heard. Can replay up to 3 times. Validates with fuzzy matching.
- `MinimalPairs.tsx` — hear one of two similar words, identify which one. Trains phonemic discrimination (e.g., "Did you hear 'nonno' or 'nono'?").

### 6. Story & Dialogue Content
- Short dialogues (2 speakers, distinct ElevenLabs voices) tied to unit vocabulary
- Listening comprehension questions after each dialogue
- Progressive difficulty: isolated sentences → short exchanges → multi-turn dialogues → short stories
- Content authored as structured JSON alongside lesson data

### 7. Curriculum Updates
- Add `audio: true` flag to exercises that should auto-play audio
- Add minimal pair sets to Unit 1 content (and future units)
- Listening exercises mixed into existing lessons (~20% of exercises become listening type)
- Update lesson generation to include listen-and-choose and dictation variants

## Audio for Dynamic Review Exercises

Review exercises are generated from the vocabulary DB, not lesson JSON. Strategy:
- Vocabulary words and example sentences get audio generated alongside lesson content (they're sourced from the same lesson JSON files)
- The audio ID maps to `word_id` / `vocab_id`, so reviews can look up audio by vocabulary reference
- Any new vocabulary added later triggers a re-run of the audio generation script

## Browser Compatibility Notes

- Pre-generated audio uses standard `<audio>` / `Audio()` API — works everywhere
- Mobile browsers may require user interaction before first audio play
- Consider showing a "enable audio" prompt on first visit
