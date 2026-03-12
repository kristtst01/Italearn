import type { Exercise } from '@/types';

interface FeedbackProps {
  correct: boolean;
  correctAnswer: string;
  exercise: Exercise;
  /** Optional validation feedback (accent reminders, typo hints) */
  feedback?: string;
  onContinue: () => void;
}

export default function Feedback({
  correct,
  correctAnswer,
  exercise,
  feedback,
  onContinue,
}: FeedbackProps) {
  return (
    <div
      className={`fixed inset-x-0 bottom-0 p-6 ${
        correct ? 'bg-green-50 border-t-2 border-green-400' : 'bg-red-50 border-t-2 border-red-400'
      }`}
    >
      <div className="mx-auto max-w-lg">
        <div className="mb-1 flex items-center gap-2">
          {correct ? (
            <>
              <span className="text-2xl text-green-600">&#10003;</span>
              <span className="text-lg font-bold text-green-700">Correct!</span>
            </>
          ) : (
            <>
              <span className="text-2xl text-red-600">&#10007;</span>
              <span className="text-lg font-bold text-red-700">Incorrect</span>
            </>
          )}
        </div>

        {feedback && (
          <p className={`mb-3 text-sm ${correct ? 'text-amber-700' : 'text-red-700'}`}>
            {feedback}
          </p>
        )}

        {!correct && !feedback && (
          <p className="mb-3 text-sm text-red-700">
            Correct answer: <span className="font-semibold">{correctAnswer}</span>
          </p>
        )}

        {exercise.sentence_context && (
          <p className="mb-3 rounded-md bg-white/60 px-3 py-2 text-sm italic text-gray-700">
            {exercise.sentence_context.replace('___', correctAnswer)}
          </p>
        )}

        <button
          onClick={onContinue}
          className={`w-full rounded-xl py-3 font-semibold text-white transition-colors ${
            correct
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
