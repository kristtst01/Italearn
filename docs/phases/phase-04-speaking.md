# Phase 4 — Speaking Exercises

> **Status: Deferred — requires a backend, do not implement with Web Speech API.**
> The Web Speech API (`webkitSpeechRecognition`) has no Firefox support, inconsistent Italian accuracy, and cannot evaluate pronunciation quality — only transcription. The right solution is **OpenAI Whisper** for ASR, which has strong Italian support and can be run locally (e.g. RTX 3070 Ti via faster-whisper + FastAPI) or via the OpenAI Whisper API ($0.006/min). This phase is blocked on Phase 3 (audio) being complete and a backend existing. Revisit after other phases are done.

**Goal:** Add speech recognition so the learner can practice pronunciation. The app listens to you speak Italian and evaluates whether you said it correctly.

## What This Delivers

- Web Speech API integration for Italian speech recognition
- 2 new exercise types that require speaking aloud
- Pronunciation scoring with tolerance for non-native accents

## Learning Principles Addressed

- **Output hypothesis** (Swain): producing language, not just receiving it, is necessary for full acquisition. Speaking forces deeper processing than reading or listening.
- **Oral proficiency gap**: Loewen et al. (2019) found Duolingo produced no significant oral proficiency gains. Speaking exercises directly target this weakness.
- **Phonological production**: hearing yourself say Italian words reinforces the sound-meaning connection and builds muscle memory for Italian phonemes.

## Technical Deliverables

### 1. Speech Recognition Service (`src/engine/speech.ts`)
- Wrapper around `webkitSpeechRecognition` / `SpeechRecognition`
- Configure for Italian (`lang: 'it-IT'`)
- `listen(): Promise<string>` — starts listening, returns transcript
- `stop()` — stops listening
- Confidence threshold handling
- Visual microphone state indicator (idle / listening / processing)

### 2. Pronunciation Scoring (`src/engine/pronunciation.ts`)
- Compare recognized text against expected text
- Normalize both (lowercase, strip punctuation)
- Score: exact match = perfect, Levenshtein distance based scoring for partial matches
- Distinguish "wrong word entirely" from "pronunciation too unclear to recognize"
- Accept common recognition errors gracefully (e.g., speech API often drops articles)

### 3. New Exercise Components
- `ReadAloud.tsx` — show an Italian sentence, user reads it aloud. Speech API transcribes, compare to expected. Show what the API heard vs what was expected. Pass/fail with tolerance.
- `ListenAndRepeat.tsx` — play an Italian sentence (TTS), then user repeats it. Combines Phase 3 audio with speech recognition. Good for drilling pronunciation of new phrases.

### 4. Microphone Permission UX
- Request mic permission on first speaking exercise
- Clear explanation of why ("This exercise needs your microphone to hear your pronunciation")
- Graceful fallback if denied: skip speaking exercises, show a "type instead" option
- Remember permission state

### 5. Curriculum Updates
- Speaking exercises mixed into lessons (~15% of exercises)
- Focus on phrases that are practically useful to say aloud
- Avoid testing speech on single words (too unreliable) — use full phrases/sentences

## Known Limitations

- Web Speech API accuracy varies significantly by browser and microphone quality
- Italian speech recognition is less mature than English — expect more misrecognitions
- Background noise can cause failures
- Scoring should be generous — the goal is practice, not perfection. A "close enough" approach is better than frustrating false negatives.

## Architecture Decision (when revisiting)

Use **Whisper** (not Web Speech API) for transcription:
- **Local:** `faster-whisper` + FastAPI on the user's machine. On an RTX 3070 Ti, `large-v3` processes a short clip in ~0.5s. App calls `localhost:8000/transcribe`.
- **Cloud/portable:** OpenAI Whisper API — trivial cost for personal use, same interface.
- The `speech.ts` engine should abstract the transport so switching local↔cloud is a config change.
- Pronunciation scoring via Levenshtein (as planned) remains valid — Whisper's transcription accuracy on Italian is high enough that distance from expected text is a meaningful pronunciation signal.
