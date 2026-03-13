import { useParams, useNavigate, Link } from 'react-router-dom';
import ProgressBar from '@/shared/components/ProgressBar';
import CloseIcon from '@/shared/components/CloseIcon';
import Confetti from '@/shared/components/Confetti';
import renderExercise from '@/features/exercises/renderExercise';
import { useCheckpointSession } from './useCheckpointSession';
import type { CheckpointResult, AreaResult } from './useCheckpointSession';

export default function CheckpointPage() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();

  const {
    alreadyPassed,
    started,
    currentExercise,
    currentIndex,
    totalExercises,
    checkpointResult,
    handleStart,
    handleExerciseComplete,
  } = useCheckpointSession(sectionId ?? 'section-01');

  if (!started && !checkpointResult) {
    return (
      <CheckpointIntro
        alreadyPassed={alreadyPassed}
        onStart={handleStart}
        onBack={() => navigate('/')}
      />
    );
  }

  if (checkpointResult) {
    return <CheckpointResults result={checkpointResult} />;
  }

  const progress = ((currentIndex + 1) / totalExercises) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Exit checkpoint"
          >
            <CloseIcon />
          </button>
          <div className="flex-1">
            <ProgressBar progress={progress} />
          </div>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            Question {currentIndex + 1}/{totalExercises}
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        {currentExercise &&
          renderExercise({
            exercise: currentExercise,
            onComplete: handleExerciseComplete,
          })}
      </div>
    </div>
  );
}

function CheckpointIntro({
  alreadyPassed,
  onStart,
  onBack,
}: {
  alreadyPassed: boolean;
  onStart: () => void;
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto mt-12 space-y-6">
        <div className="text-center">
          <div className="text-5xl mb-4">🏁</div>
          <h1 className="text-3xl font-bold text-gray-900">
            Section 1 Checkpoint
          </h1>
          <p className="text-gray-500 mt-2">First Steps</p>
        </div>

        {alreadyPassed && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-green-700 font-medium">
              ✓ You already passed this checkpoint!
            </p>
            <p className="text-green-600 text-sm mt-1">
              Retake it for extra practice.
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Questions</span>
              <span className="font-medium text-gray-900">~18</span>
            </div>
            <div className="flex justify-between">
              <span>Pass score</span>
              <span className="font-medium text-gray-900">80%</span>
            </div>
            <div className="flex justify-between">
              <span>Covers</span>
              <span className="font-medium text-gray-900">Units 1–3</span>
            </div>
          </div>
          <hr className="border-gray-100" />
          <p className="text-sm text-gray-500">
            Tests vocabulary, greetings, essere, avere, numbers, and articles.
            Pass to unlock Section 2.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onStart}
            autoFocus
            className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            {alreadyPassed ? 'Retake Checkpoint' : 'Start Checkpoint'}
          </button>
          <button
            onClick={onBack}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
          >
            Back to path
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckpointResults({ result }: { result: CheckpointResult }) {
  const navigate = useNavigate();
  const pct =
    result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;

  const weakAreas = result.areas.filter(
    (a) => a.total > 0 && a.correct / a.total < 0.7,
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {result.passed && <Confetti />}
      <div className="max-w-md mx-auto mt-12 space-y-6">
        <div className="text-center">
          {result.passed ? (
            <div className="text-5xl mb-4 animate-[bounce_0.6s_ease-in-out]">⭐</div>
          ) : (
            <div className="text-5xl mb-4">📚</div>
          )}
          <h1 className="text-3xl font-bold text-gray-900">
            {result.passed ? 'Checkpoint Passed!' : 'Not Quite Yet'}
          </h1>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center space-y-2">
          <p
            className={`text-5xl font-bold ${result.passed ? 'text-green-600' : 'text-orange-500'}`}
          >
            {pct}%
          </p>
          <p className="text-gray-500">
            {result.score}/{result.total} correct
          </p>
          {result.passed ? (
            <p className="text-green-600 text-sm font-medium mt-2">
              Section 2 unlocked!
            </p>
          ) : (
            <p className="text-orange-500 text-sm font-medium mt-2">
              Need 80% to pass
            </p>
          )}
        </div>

        {result.areas.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Breakdown
            </h2>
            {result.areas.map((area) => (
              <AreaRow key={area.label} area={area} />
            ))}
          </div>
        )}

        {!result.passed && weakAreas.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 space-y-2">
            <h2 className="text-sm font-semibold text-orange-800">
              Areas to review:
            </h2>
            <ul className="text-sm text-orange-700 space-y-1">
              {weakAreas.map((a) => (
                <li key={a.label}>• {a.label}</li>
              ))}
            </ul>
            <div className="pt-2 space-y-1">
              {weakAreas
                .filter((a) => a.label.startsWith('Unit 1'))
                .map(() => (
                  <Link
                    key="unit-01"
                    to="/lesson/unit-01-lesson-05"
                    className="block text-sm text-blue-600 underline"
                  >
                    Review Unit 1 →
                  </Link>
                ))}
              {weakAreas
                .filter((a) => a.label.startsWith('Unit 2'))
                .map(() => (
                  <Link
                    key="unit-02"
                    to="/lesson/unit-02-lesson-08"
                    className="block text-sm text-blue-600 underline"
                  >
                    Review Unit 2 →
                  </Link>
                ))}
              {weakAreas
                .filter((a) => a.label.startsWith('Unit 3'))
                .map(() => (
                  <Link
                    key="unit-03"
                    to="/lesson/unit-03-lesson-09"
                    className="block text-sm text-blue-600 underline"
                  >
                    Review Unit 3 →
                  </Link>
                ))}
              {weakAreas
                .filter((a) => a.label.startsWith('Grammar'))
                .map(() => (
                  <Link
                    key="grammar"
                    to="/lesson/unit-02-lesson-08"
                    className="block text-sm text-blue-600 underline"
                  >
                    Review Essere & Avere →
                  </Link>
                ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {!result.passed && (
            <Link
              to="/checkpoint/section-01"
              className="block w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-medium text-center hover:bg-blue-700 transition-colors"
            >
              Try Again
            </Link>
          )}
          <button
            onClick={() => navigate('/')}
            autoFocus={result.passed}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
          >
            Back to path
          </button>
        </div>
      </div>
    </div>
  );
}

function AreaRow({ area }: { area: AreaResult }) {
  const pct = area.total > 0 ? Math.round((area.correct / area.total) * 100) : 0;
  const isWeak = pct < 70;
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-gray-600 flex-1">{area.label}</span>
      <div className="flex items-center gap-2">
        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${isWeak ? 'bg-orange-400' : 'bg-green-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span
          className={`text-sm font-medium w-10 text-right ${isWeak ? 'text-orange-600' : 'text-green-700'}`}
        >
          {pct}%
        </span>
      </div>
    </div>
  );
}
