# Phase 4 — Speaking Exercises

> **Status: Deferred — blocked on Phase 3 (audio).**
> Tiered approach: **Web Speech API** for single words and short phrases (free, in-browser), **Whisper** (local server) for sentences and paragraphs. An **LLM fallback layer** handles fuzzy grading for both tiers. This follows the Duolingo playbook: constrained recognition + lenient grading beats a perfect speech model.

**Goal:** Add speech recognition so the learner can practice pronunciation. The app listens to you speak Italian and evaluates whether you said it correctly — with the bar set at "would a native speaker understand you?", not perfect accent.

## What This Delivers

- Tiered speech recognition: Web Speech API (short) → Whisper (long)
- LLM-powered answer validation with hardcoded fast path
- 2 new exercise types that require speaking aloud
- Pronunciation scoring with deliberate leniency for non-native accents
- Graceful degradation for unsupported browsers

## Learning Principles Addressed

- **Output hypothesis** (Swain): producing language, not just receiving it, is necessary for full acquisition. Speaking forces deeper processing than reading or listening.
- **Oral proficiency gap**: Loewen et al. (2019) found Duolingo produced no significant oral proficiency gains. Speaking exercises directly target this weakness.
- **Phonological production**: hearing yourself say Italian words reinforces the sound-meaning connection and builds muscle memory for Italian phonemes.

## Tiered Speech Recognition

### Tier 1 — Web Speech API (single words, short phrases)
- Free, zero latency, runs in-browser
- `lang: 'it-IT'` — handles common Italian words well
- Best for: "say 'buongiorno'", "how do you say 'thank you'?"
- No backend needed — works with the current local-first architecture
- **Limitation:** No Firefox support, spotty on some mobile browsers → graceful fallback to "type instead"

### Tier 2 — Whisper (sentences, paragraphs, longer utterances)
- `faster-whisper` + FastAPI running locally (RTX 3070 Ti: `large-v3` processes short clips in ~0.5s)
- Alternatively: OpenAI Whisper API ($0.006/min) for portable/cloud use
- **Key trick:** Pass the expected answer as Whisper's `initial_prompt` — this biases the model toward Italian vocabulary and dramatically improves accuracy for learner speech
- Best for: read-aloud exercises, sentence repetition, paragraph reading
- `speech.ts` engine abstracts transport so switching local↔cloud is a config change

### Why Two Tiers?
- Web Speech API is perfectly adequate for "say this word" and costs nothing
- It breaks down on longer utterances from non-native speakers (drops words, mishears more)
- Whisper handles longer content reliably but requires a server
- The grading pipeline is identical for both — only the transcription source changes

## Answer Validation — Hardcoded + LLM Fallback

The grading approach mirrors what Duolingo does with constrained recognition + lenient thresholds, but uses an LLM to absorb edge cases they had to build custom rules for.

### Pipeline
1. **Normalize** transcript (lowercase, strip punctuation)
2. **Hardcoded check** — compare against a list of known acceptable answers. Covers 90%+ of cases with zero latency and zero cost
3. **Levenshtein distance** — if close but not exact, apply existing typo tolerance logic
4. **LLM fallback** — if hardcoded + Levenshtein both miss, ask a lightweight local LLM: "The exercise expected 'ciao'. The learner said 'chow'. Is this an acceptable spoken attempt at the Italian word?"
5. **Cache the verdict** — if the LLM says "yes", add it to the accepted answers list. Over time the hardcoded list grows organically and the LLM fires less and less

### LLM Choice
- Local: Phi-3 or Gemma 2B — tiny models, more than capable of "is X a reasonable attempt at Y?"
- These run on CPU in seconds for a single yes/no judgment
- Same local server as Whisper (FastAPI), or a separate lightweight service
- The LLM is also useful beyond speaking: typed translation exercises benefit from the same fallback (e.g., "Salve" is also valid for "hello", not just "Ciao")

## Technical Deliverables

### 1. Speech Recognition Service (`src/engine/speech.ts`)
- Unified interface: `listen(): Promise<string>` — returns transcript regardless of tier
- Auto-selects tier based on exercise type (word-level → Web Speech API, sentence+ → Whisper)
- Configure for Italian (`lang: 'it-IT'`)
- `stop()` — stops listening
- Visual microphone state indicator (idle / listening / processing)
- Feature detection: check for `SpeechRecognition` support, fall back to type-answer if unavailable

### 2. Pronunciation Scoring (`src/engine/pronunciation.ts`)
- Compare recognized text against expected text via the validation pipeline above
- Lenient threshold: "would a native speaker understand you?" not "perfect pronunciation"
- Normalize both sides (lowercase, strip punctuation, handle articles being dropped)
- Hardcoded acceptable answers per exercise
- LLM fallback for unexpected but valid attempts
- Cached verdicts stored alongside exercise data

### 3. New Exercise Components
- `ReadAloud.tsx` — show an Italian sentence, user reads it aloud. Transcribe (Whisper for sentences, Web Speech API for short phrases), compare to expected. Show what was heard vs what was expected. Pass/fail with tolerance.
- `ListenAndRepeat.tsx` — play pre-generated audio (Phase 3), then user repeats it. Combines Phase 3 audio with speech recognition. Good for drilling pronunciation of new phrases.

### 4. Microphone Permission UX
- Request mic permission on first speaking exercise
- Clear explanation of why ("This exercise needs your microphone to hear your pronunciation")
- Graceful fallback if denied or unsupported: swap speaking exercises for type-answer variants
- Remember permission state

### 5. Curriculum Updates
- Speaking exercises mixed into lessons (~15% of exercises)
- Word-level pronunciation drills (Web Speech API tier) + sentence-level read-aloud (Whisper tier)
- Focus on phrases that are practically useful to say aloud

## Future: Real-Time Conversation (beyond Phase 4)

Once the structured speaking exercises are solid, the natural next step is freeform conversation practice using **OpenAI's real-time voice API**. By that point we'll have:
- Full curriculum context and user progress data to feed as system prompt
- A proven grading pipeline for evaluating Italian speech
- Understanding of common learner errors from cached LLM verdicts

The real-time voice endpoint enables "talk with an AI tutor in Italian, scoped to what you've learned so far" — the highest-value exercise for fluency, but also the most expensive to run. This is a separate phase.

## Browser Compatibility

| Browser | Web Speech API | Whisper (local server) |
|---------|---------------|----------------------|
| Chrome | Full support | Full support |
| Firefox | No support | Full support |
| Safari | Partial | Full support |
| Mobile Chrome | Works (needs HTTPS) | Works if server reachable |
| Mobile Safari | Partial | Works if server reachable |

For browsers without Web Speech API support, word-level speaking exercises fall back to type-answer. Sentence-level exercises always use Whisper (server), so they work everywhere.
