import { useEffect, useRef, useState, useMemo, createRef } from 'react';
import { Link } from 'react-router-dom';
import { curriculum } from '@/data/curriculum';
import { useProgressStore } from '@/stores/progressStore';
import { useSrsStore } from '@/stores/srsStore';
import type { Unit, UnitStatus } from '@/types';
import PathNode from './PathNode';
import PathConnector from './PathConnector';
import LessonList from './LessonList';

function getUnitStatus(
  unit: Unit,
  completedLessons: string[],
  isUnlocked: boolean,
): UnitStatus {
  if (!isUnlocked) return 'locked';
  if (unit.lessons.length === 0) return 'available';

  const completed = unit.lessons.filter((l) =>
    completedLessons.includes(l.id),
  ).length;

  if (completed === unit.lessons.length) return 'completed';
  if (completed > 0) return 'in_progress';
  return 'available';
}

function isUnitComplete(unit: Unit, completedLessons: string[]): boolean {
  return (
    unit.lessons.length > 0 &&
    unit.lessons.every((l) => completedLessons.includes(l.id))
  );
}

/** Zigzag pattern: left, center, right, center, left, ... */
const SIDE_PATTERN: ('left' | 'center' | 'right')[] = ['left', 'center', 'right', 'center'];

export default function PathPage() {
  const section = curriculum.sections[0];
  const units = section.units;

  const lessonsCompleted = useProgressStore((s) => s.lessons_completed);
  const lessonScores = useProgressStore((s) => s.lesson_scores);
  const resetLesson = useProgressStore((s) => s.resetLesson);
  const checkpointsPassed = useProgressStore((s) => s.checkpoints_passed);
  const dueCount = useSrsStore((s) => s.reviewableCount);
  const unitMastery = useSrsStore((s) => s.unitMastery);
  const badges = useProgressStore((s) => s.badges);

  const allSection1Complete = units.every((u) => isUnitComplete(u, lessonsCompleted));
  const section1CheckpointPassed = checkpointsPassed.includes(section.id);

  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  // Create refs for each unit node
  const nodeRefs = useMemo(
    () => units.map(() => createRef<HTMLDivElement>()),
    [units],
  );
  const scrolledRef = useRef(false);

  // Find the current (first non-completed, non-locked) unit index
  const currentUnitIndex = useMemo(() => {
    for (let i = 0; i < units.length; i++) {
      const isUnlocked = i === 0 || isUnitComplete(units[i - 1], lessonsCompleted);
      const status = getUnitStatus(units[i], lessonsCompleted, isUnlocked);
      if (status === 'in_progress' || status === 'available') return i;
    }
    return -1;
  }, [units, lessonsCompleted]);

  // Auto-scroll to current unit on mount
  useEffect(() => {
    if (scrolledRef.current || currentUnitIndex < 0) return;
    const ref = nodeRefs[currentUnitIndex];
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      scrolledRef.current = true;
    }
  }, [currentUnitIndex, nodeRefs]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Learning Path</h1>
            <p className="text-sm text-gray-500">
              {section.name} — {section.cefr_level}
            </p>
          </div>
          <Link
            to="/"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Home
          </Link>
        </div>

        {/* Review button */}
        {dueCount > 0 && (
          <Link
            to="/review"
            className="flex items-center justify-between rounded-xl bg-blue-600 text-white px-4 py-3 mb-6 hover:bg-blue-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="font-medium">Review</span>
            </div>
            <span className="bg-white/20 rounded-full px-2.5 py-0.5 text-sm font-medium">
              {dueCount} due
            </span>
          </Link>
        )}

        {/* Winding path */}
        <div className="relative px-4">
          {units.map((unit, index) => {
            const isUnlocked =
              index === 0 || isUnitComplete(units[index - 1], lessonsCompleted);
            const status = getUnitStatus(unit, lessonsCompleted, isUnlocked);
            const side = SIDE_PATTERN[index % SIDE_PATTERN.length];
            const isCurrent = index === currentUnitIndex;
            const selected = selectedUnit === unit.id;
            const completedCount = unit.lessons.filter((l) =>
              lessonsCompleted.includes(l.id),
            ).length;

            // Previous node info for connector
            const prevSide = index > 0 ? SIDE_PATTERN[(index - 1) % SIDE_PATTERN.length] : null;
            const prevStatus = index > 0
              ? getUnitStatus(
                  units[index - 1],
                  lessonsCompleted,
                  index - 1 === 0 || isUnitComplete(units[index - 2], lessonsCompleted),
                )
              : null;
            const connectorCompleted = prevStatus === 'completed';

            return (
              <div key={unit.id}>
                {/* Connector from previous node */}
                {prevSide && (
                  <PathConnector
                    from={prevSide}
                    to={side}
                    completed={connectorCompleted}
                  />
                )}

                <PathNode
                  unit={unit}
                  status={status}
                  mastery={unitMastery[unit.id]}
                  completedCount={completedCount}
                  isCurrent={isCurrent}
                  side={side}
                  onSelect={() =>
                    setSelectedUnit(selected ? null : unit.id)
                  }
                  selected={selected}
                  nodeRef={nodeRefs[index]}
                />

                {/* Lesson list dropdown */}
                {selected && unit.lessons.length > 0 && (
                  <div className="mt-2 mb-2 rounded-xl border border-gray-200 bg-white overflow-hidden">
                    <LessonList
                      lessons={unit.lessons}
                      completedLessons={lessonsCompleted}
                      lessonScores={lessonScores}
                      onResetLesson={resetLesson}
                    />
                  </div>
                )}
              </div>
            );
          })}

          {/* Checkpoint at the end */}
          {allSection1Complete && (
            <>
              <PathConnector
                from={SIDE_PATTERN[(units.length - 1) % SIDE_PATTERN.length]}
                to="center"
                completed
              />
              <div className="flex flex-col items-center w-full">
                <Link
                  to={`/checkpoint/${section.id}`}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className={`w-16 h-16 rounded-lg flex items-center justify-center text-lg font-bold transition-colors ${
                      section1CheckpointPassed
                        ? 'bg-green-500 text-white'
                        : 'bg-amber-500 text-white animate-pulse'
                    }`}
                  >
                    {badges.some((b) => b.sectionId === section.id) ? '⭐' : '🏁'}
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    Section Checkpoint
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {section1CheckpointPassed ? 'Passed' : '≥ 80% to pass'}
                  </span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
