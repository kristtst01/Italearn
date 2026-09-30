import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getPlannedGrammarUnit, type PlannedGrammarUnit } from '@/data/grammarPlan';
import { loadGrammarPractice } from '@/data/grammarLoader';
import { sectionAnchor } from '@/engine/grammar';
import { useProgressStore } from '@/stores/progressStore';
import type { Exercise, ExerciseResult, GrammarPractice, GrammarStop, MasteryAttempt } from '@/types';
import renderExercise from '@/features/exercises/renderExercise';
import ExitButton from '@/features/lesson/ExitButton';
import Confetti from '@/shared/components/Confetti';
import EmptyState from '@/shared/components/EmptyState';
import LoadingScreen from '@/shared/components/LoadingScreen';
import SessionHeader from '@/shared/components/SessionHeader';
import SessionLayout from '@/shared/components/SessionLayout';
import { Label, MajolicaTile } from '@/shared/components/design';
import { buttonVariants } from '@/components/ui/button';
import { toSegments } from '@/shared/utils/segments';
import { cn } from '@/lib/utils';

type Mode = 'practice' | 'check';

/** A practice stop (/grammar/:id/practice/:stopId) or the mastery check (/grammar/:id/check). */
export default function GrammarSessionPage({ mode }: { mode: Mode }) {
  const { grammarId, stopId } = useParams<{ grammarId: string; stopId: string }>();
  const unit = grammarId ? getPlannedGrammarUnit(grammarId) : undefined;
  const [loaded, setLoaded] = useState<{ id: string; practice?: GrammarPractice } | null>(null);

  useEffect(() => {
    if (!grammarId) return;
    let cancelled = false;
    loadGrammarPractice(grammarId).then((practice) => {
      if (!cancelled) setLoaded({ id: grammarId, practice });
    });
    return () => { cancelled = true; };
  }, [grammarId]);

  if (!unit) return <EmptyState title="Grammar unit not found" message="This grammar unit doesn't exist." />;
  if (!loaded || loaded.id !== grammarId) return <LoadingScreen />;
  if (!loaded.practice) return <EmptyState title="Not written yet" message="This unit has no practice yet." />;

  const stop = loaded.practice.stops.find((s) => s.id === stopId);
  if (mode === 'practice' && !stop) return <EmptyState title="Practice not found" message="This practice stop doesn't exist." />;

  // Remount per session so moving between stops or on to the check starts fresh
  return <Session key={`${mode}-${stopId}`} mode={mode} unit={unit} practice={loaded.practice} stop={stop} />;
}

function Session({
  mode,
  unit,
  practice,
  stop,
}: {
  mode: Mode;
  unit: PlannedGrammarUnit;
  practice: GrammarPractice;
  stop?: GrammarStop;
}) {
  const navigate = useNavigate();
  const markGrammarStep = useProgressStore((s) => s.markGrammarStep);
  const completeGrammarStop = useProgressStore((s) => s.completeGrammarStop);
  const recordMasteryCheck = useProgressStore((s) => s.recordMasteryCheck);
  const logActivity = useProgressStore((s) => s.logActivity);

  const all = useMemo(
    () => (mode === 'practice' && stop ? stop.exercises : practice.mastery.exercises).map((exercise) => ({ exercise })),
    [mode, practice, stop],
  );

  const [items, setItems] = useState(all);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [attempt, setAttempt] = useState<MasteryAttempt | null>(null);
  const done = results.length >= items.length;
  // Practising mistakes afterwards doesn't count as a new completion
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    markGrammarStep(unit.id, 'studiedAt');
  }, [markGrammarStep, unit.id]);

  function handleComplete(result: ExerciseResult) {
    const updated = [...results, result];
    setResults(updated);
    if (updated.length < items.length) {
      setIndex(index + 1);
      return;
    }
    if (retrying) return;
    logActivity('lesson');
    if (mode === 'practice' && stop) {
      completeGrammarStop(unit.id, stop.id, practice.stops.map((s) => s.id));
    } else {
      const score = updated.filter((r) => r.correct).length;
      const missed = new Set(updated.filter((r) => !r.correct).map((r) => r.exercise_id));
      const next: MasteryAttempt = {
        score,
        total: items.length,
        passed: score / items.length >= practice.mastery.pass_mark,
        at: new Date().toISOString(),
        missedPoints: [
          ...new Set(items.filter((i) => missed.has(i.exercise.id)).flatMap((i) => i.exercise.grammar_points ?? [])),
        ],
      };
      recordMasteryCheck(unit.id, next);
      setAttempt(next);
    }
  }

  function practiseMistakes() {
    const missed = new Set(results.filter((r) => !r.correct).map((r) => r.exercise_id));
    setItems(items.filter((i) => missed.has(i.exercise.id)));
    setIndex(0);
    setResults([]);
    setRetrying(true);
  }

  const current = items[index];
  const exit = () => navigate(`/grammar/${unit.id}`);

  return (
    <SessionLayout
      header={
        <SessionHeader
          context={`Grammar · ${unit.title}`}
          title={mode === 'practice' && stop ? `Practice · ${stop.title}` : 'Mastery check'}
          segments={toSegments(results, items.length)}
          counter={`${Math.min(results.length + 1, items.length)} / ${items.length}`}
          exit={
            <ExitButton
              showConfirm={showExitConfirm}
              onToggle={() => setShowExitConfirm(!showExitConfirm)}
              onExit={exit}
              inProgress={!done}
            />
          }
        />
      }
    >
      {done ? (
        mode === 'check' && attempt ? (
          <CheckResult unit={unit} practice={practice} attempt={attempt} />
        ) : (
          <PracticeResult
            unit={unit}
            stop={stop}
            isLast={!!stop && practice.stops[practice.stops.length - 1].id === stop.id}
            results={results}
            onPractiseMistakes={practiseMistakes}
          />
        )
      ) : (
        current && renderExercise({ exercise: current.exercise as Exercise, onComplete: handleComplete })
      )}
    </SessionLayout>
  );
}

function Score({ label, score, total }: { label: string; score: number; total: number }) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <p className="font-display text-title">
        {score}
        <span className="font-sans text-2xl font-medium text-muted-foreground"> of {total}</span>
      </p>
    </div>
  );
}

function PracticeResult({
  unit,
  stop,
  isLast,
  results,
  onPractiseMistakes,
}: {
  unit: PlannedGrammarUnit;
  stop?: GrammarStop;
  isLast: boolean;
  results: ExerciseResult[];
  onPractiseMistakes: () => void;
}) {
  const score = results.filter((r) => r.correct).length;
  const mistakes = results.length - score;
  const next = isLast ? 'take the mastery check' : 'carry on reading';
  return (
    <div className="flex flex-col gap-8 py-6">
      <Score label={stop ? `${stop.title} · done` : 'Practice complete'} score={score} total={results.length} />
      <p className="max-w-150 text-reading">
        {mistakes === 0 ? `No mistakes. When you're ready, ${next}.` : `Go over your mistakes, or ${next} when you're ready.`}
      </p>
      <div className="flex gap-3">
        {isLast ? (
          <Link to={`/grammar/${unit.id}/check`} className={buttonVariants({ size: 'xl' })}>
            Take the check
          </Link>
        ) : (
          <Link to={`/grammar/${unit.id}#stop-${stop?.id}`} className={buttonVariants({ size: 'xl' })}>
            Continue reading
          </Link>
        )}
        {mistakes > 0 && (
          <button type="button" onClick={onPractiseMistakes} className={buttonVariants({ variant: 'stroke', size: 'xl' })}>
            Practise {mistakes === 1 ? 'the mistake' : `the ${mistakes} mistakes`}
          </button>
        )}
        {isLast && (
          <Link to={`/grammar/${unit.id}`} className={buttonVariants({ variant: 'stroke', size: 'xl' })}>
            Back to the unit
          </Link>
        )}
      </div>
    </div>
  );
}

function CheckResult({
  unit,
  practice,
  attempt,
}: {
  unit: PlannedGrammarUnit;
  practice: GrammarPractice;
  attempt: MasteryAttempt;
}) {
  const needed = Math.ceil(practice.mastery.pass_mark * attempt.total);
  const missed = attempt.missedPoints.map((p) => practice.points[p]).filter(Boolean);

  return (
    <div className="flex flex-col gap-8 py-6">
      {attempt.passed && <Confetti />}
      <div className="flex items-start justify-between gap-8">
        <Score label={attempt.passed ? 'Unit learned' : 'Not passed yet'} score={attempt.score} total={attempt.total} />
        {attempt.passed && <MajolicaTile status="learned" size={72} />}
      </div>
      <p className="max-w-150 text-reading">
        {attempt.passed
          ? `${unit.title} is learned.`
          : `You need ${needed} of ${attempt.total} to pass. Read these parts again, then retake the check.`}
      </p>
      {missed.length > 0 && (
        <div className={cn('flex max-w-150 flex-col gap-1.5 rounded-lg border border-border border-t-5 bg-white px-5 py-4', attempt.passed ? 'border-t-in-progress' : 'border-t-correction')}>
          <Label>{attempt.passed ? 'Worth a second look' : 'Read again'}</Label>
          {missed.map((p) => (
            <Link key={p.label} to={`/grammar/${unit.id}#${sectionAnchor(p.section)}`} className="font-medium text-cobalto">
              {p.label}
            </Link>
          ))}
        </div>
      )}
      <div className="flex gap-3">
        <Link to={`/grammar/${unit.id}`} className={buttonVariants({ size: 'xl' })}>
          Back to the unit
        </Link>
        {attempt.passed && (
          <Link to="/grammar" className={buttonVariants({ variant: 'stroke', size: 'xl' })}>
            All grammar
          </Link>
        )}
      </div>
    </div>
  );
}
