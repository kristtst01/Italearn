import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, Square, Loader2, RotateCcw } from 'lucide-react';
import type { Exercise, ExerciseResult } from '@/types';
import { transcribeAudio } from '@/engine/api';
import { validateAnswerMulti } from '@/engine/validation';
import HighlightedText from '@/shared/components/HighlightedText';
import ExerciseShell from './ExerciseShell';

interface ReadAloudProps {
  exercise: Exercise;
  onComplete: (result: ExerciseResult) => void;
}

type RecordingState = 'idle' | 'recording' | 'transcribing';

/** Simple hook that reads mic volume via AnalyserNode */
function useVolumeMeter(stream: MediaStream | null) {
  const [volume, setVolume] = useState(0);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!stream) {
      setVolume(0);
      return;
    }

    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    const data = new Uint8Array(analyser.frequencyBinCount);

    function tick() {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((sum, v) => sum + v, 0) / data.length;
      setVolume(Math.round((avg / 255) * 100));
      rafRef.current = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ctx.close();
    };
  }, [stream]);

  return volume;
}

export default function ReadAloud({ exercise, onComplete }: ReadAloudProps) {
  const [state, setState] = useState<RecordingState>('idle');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [activeStream, setActiveStream] = useState<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const volume = useVolumeMeter(activeStream);

  const expectedText = Array.isArray(exercise.correct_answer)
    ? exercise.correct_answer[0]
    : exercise.correct_answer;

  const validation = validateAnswerMulti(transcript, exercise.correct_answer);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.stop();
    }
  }, []);

  // Auto-stop after 10 seconds
  useEffect(() => {
    if (state !== 'recording') return;
    const timer = setTimeout(stopRecording, 10_000);
    return () => clearTimeout(timer);
  }, [state, stopRecording]);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => { if (audioUrl) URL.revokeObjectURL(audioUrl); };
  }, [audioUrl]);

  async function startRecording() {
    setError('');
    setTranscript('');
    if (audioUrl) { URL.revokeObjectURL(audioUrl); setAudioUrl(null); }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setActiveStream(stream);

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : undefined;

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      chunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setActiveStream(null);
        const blob = new Blob(chunks.current, { type: recorder.mimeType });
        setAudioUrl(URL.createObjectURL(blob));
        setState('transcribing');

        try {
          const result = await transcribeAudio(blob, expectedText);
          if (result.text.trim()) {
            setTranscript(result.text.trim());
          } else {
            setError("Couldn't hear anything. Make sure your microphone is working and speak clearly.");
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Transcription failed');
        } finally {
          setState('idle');
        }
      };

      mediaRecorder.current = recorder;
      recorder.start();
      setState('recording');
    } catch {
      setError('Could not access microphone. Please allow microphone access.');
    }
  }

  return (
    <ExerciseShell
      exercise={exercise}
      onComplete={onComplete}
      userAnswer={transcript}
      isCorrect={validation.correct}
      canSubmit={transcript.length > 0}
      feedback={validation.feedback}
    >
      <p className="mb-2 text-sm font-medium text-gray-500">Read aloud in Italian:</p>
      <p className="mb-8 text-2xl font-bold text-gray-900">
        <HighlightedText text={expectedText} words={exercise.target_words} />
      </p>

      <div className="flex flex-col items-center gap-5">
        {/* Mic / Stop / Spinner button */}
        {state === 'idle' && !transcript && !error && (
          <button
            type="button"
            onClick={startRecording}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700 active:scale-95"
          >
            <Mic className="h-8 w-8" />
          </button>
        )}

        {state === 'recording' && (
          <button
            type="button"
            onClick={stopRecording}
            className="flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <Square className="h-6 w-6" />
          </button>
        )}

        {state === 'transcribing' && (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}

        {/* Volume meter while recording */}
        {state === 'recording' && (
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-40 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-red-400 transition-all duration-75"
                style={{ width: `${Math.min(volume, 100)}%` }}
              />
            </div>
            <span className="text-xs tabular-nums text-gray-400">{volume}%</span>
          </div>
        )}

        {/* Result: what we heard */}
        {state === 'idle' && transcript && (
          <div className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-center">
            <p className="text-sm text-gray-500">We heard:</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">"{transcript}"</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="w-full rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Playback */}
        {audioUrl && state === 'idle' && (
          <audio controls src={audioUrl} className="w-full max-w-xs" />
        )}

        {/* Try again */}
        {state === 'idle' && (transcript || error) && (
          <button
            type="button"
            onClick={startRecording}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <RotateCcw className="h-4 w-4" /> Try again
          </button>
        )}

        {/* Hint text */}
        {state === 'idle' && !transcript && !error && (
          <p className="text-sm text-gray-400">Tap the microphone and read the text above</p>
        )}
        {state === 'recording' && (
          <p className="text-sm text-gray-400">Listening… tap to stop</p>
        )}
        {state === 'transcribing' && (
          <p className="text-sm text-gray-400">Processing…</p>
        )}
      </div>
    </ExerciseShell>
  );
}
