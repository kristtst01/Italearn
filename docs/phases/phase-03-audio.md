# Phase 3 — Audio & Listening Exercises

> **Status: Deferred — needs further research before implementation.**
> The Web Speech API (`speechSynthesis`) produces inconsistent audio quality across browsers and OS — unacceptable for a language learning app where Italian pronunciation modelling matters. The right approach is either pre-generated audio assets (one-time generation via a neural TTS API like Piper, Amazon Polly, or ElevenLabs) or a local backend service. This needs more research before building. Do not implement using `speechSynthesis`.

**Goal:** Add audio to the entire app and introduce listening-specific exercises. Every Italian word and sentence becomes audible, and two new exercise types test comprehension by ear.

## What This Delivers

- TTS audio on every Italian word and sentence throughout the app (lessons, reviews, path)
- Play button on all Italian text
- 3 new listening exercise types
- Existing exercises gain audio cues (e.g., multiple choice can now play the prompt as audio)

## Learning Principles Addressed

- **Phonological memory**: Baddeley et al. (1998) showed phonological memory is one of the strongest predictors of L2 vocabulary acquisition. Hearing every word builds the "sound image" of Italian.
- **Listening comprehension**: a core skill that Duolingo under-serves. Loewen et al. (2019) found app learners often lack oral proficiency — listening exercises help bridge this gap.
- **Dual coding**: combining visual text with audio engages two memory systems (Paivio 1986), improving retention.
- **Minimal pairs**: training the ear to distinguish similar Italian sounds (e.g., pesca/pèsca, anno/ano) that English speakers often conflate.

## Technical Deliverables

### 1. TTS Service (`src/engine/tts.ts`)
- Wrapper around `window.speechSynthesis`
- Select best available Italian voice (prefer `it-IT` voices)
- `speak(text: string, rate?: number)` — plays Italian audio
- `speakSlow(text: string)` — plays at reduced speed for dictation
- Queue management: cancel current speech before starting new
- Fallback handling if no Italian voice available

### 2. Audio Play Button (`src/components/AudioButton.tsx`)
- Small speaker icon, reusable everywhere
- Click to hear the Italian text
- Auto-plays on first appearance in exercises (configurable)
- Visual feedback while playing

### 3. Updated Existing Exercises
- `MultipleChoice`: option to play prompt as audio instead of (or alongside) showing text
- `TypeAnswer`: audio button next to Italian sentence context
- `ArrangeWords`: hear the target sentence before arranging
- `FillInBlank` / `ClozeDelete`: audio for the full sentence

### 4. New Listening Exercise Components
- `ListenAndChoose.tsx` — hear an Italian sentence, pick correct English translation from 4 options. Text is NOT shown — pure listening comprehension.
- `Dictation.tsx` — hear an Italian sentence, type what you heard. Can replay up to 3 times. Validates with fuzzy matching.
- `MinimalPairs.tsx` — hear one of two similar words, identify which one. Trains phonemic discrimination (e.g., "Did you hear 'nonno' or 'nono'?").

### 5. Curriculum Updates
- Add `audio: true` flag to exercises that should auto-play audio
- Add minimal pair sets to Unit 1 content (and future units)
- Listening exercises mixed into existing lessons (~20% of exercises become listening type)
- Update lesson generation to include listen-and-choose and dictation variants

## Browser Compatibility Notes

- `speechSynthesis` quality varies by browser/OS — Chrome on desktop typically has the best Italian voices
- Mobile browsers may require user interaction before first audio play
- Consider showing a "enable audio" prompt on first visit

## Open Questions (resolve before implementing)

- Pre-generated static audio assets vs. runtime TTS service — evaluate bundle size, regeneration workflow, and quality tradeoffs
- Which neural TTS engine to use for Italian (Piper TTS `it_IT-paola-medium`, Amazon Polly `Bianca` neural, ElevenLabs, Google Cloud TTS)
- Whether audio assets are bundled, hosted on CDN, or served by a local backend
- How to handle audio for dynamically generated review exercises (vocabulary not in lesson JSON)
