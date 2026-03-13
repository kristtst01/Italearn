import { useEffect, useRef, useState, useMemo, createRef } from 'react';
import { Link } from 'react-router-dom';
import { curriculum } from '@/data/curriculum';
import { useProgressStore } from '@/stores/progressStore';
import { useSrsStore } from '@/stores/srsStore';
import type { CEFRLevel, Section, Unit, UnitStatus } from '@/types';
import PathNode from './PathNode';
import PathConnector from './PathConnector';
import CEFRBanner from './CEFRBanner';
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

function isSectionComplete(section: Section, completedLessons: string[]): boolean {
  return section.units.every((u) => isUnitComplete(u, completedLessons));
}

/** Zigzag pattern: left, center, right, center, left, ... */
const SIDE_PATTERN: ('left' | 'center' | 'right')[] = ['left', 'center', 'right', 'center'];

interface PathItem {
  unit: Unit;
  section: Section;
  /** Show CEFR banner before this unit (first unit at a new CEFR level) */
  showCEFRBanner: boolean;
  /** Show checkpoint before this unit (first unit of a new section) */
  showCheckpoint: boolean;
  /** The previous section (for rendering its checkpoint) */
  prevSection: Section | null;
}

/** Flatten all units with precomputed banner/checkpoint flags. */
function buildPathItems(): PathItem[] {
  const items: PathItem[] = [];
  let lastCEFR: CEFRLevel | null = null;
  let lastSectionId: string | null = null;
  let prevSection: Section | null = null;

  for (const section of curriculum.sections) {
    for (let i = 0; i < section.units.length; i++) {
      const unit = section.units[i];
      const showCEFRBanner = section.cefr_level !== lastCEFR;
      const showCheckpoint = section.id !== lastSectionId && lastSectionId !== null;

      items.push({
        unit,
        section,
        showCEFRBanner: showCEFRBanner && i === 0,
        showCheckpoint: showCheckpoint && i === 0,
        prevSection: (showCheckpoint && i === 0) ? prevSection : null,
      });

      if (showCEFRBanner) lastCEFR = section.cefr_level;
      if (section.id !== lastSectionId) {
        prevSection = curriculum.sections.find((s) => s.id === lastSectionId) ?? null;
        lastSectionId = section.id;
      }
    }
  }
  return items;
}

export default function PathPage() {
  const pathItems = useMemo(() => buildPathItems(), []);

  const lessonsCompleted = useProgressStore((s) => s.lessons_completed);
  const lessonScores = useProgressStore((s) => s.lesson_scores);
  const resetLesson = useProgressStore((s) => s.resetLesson);
  const checkpointsPassed = useProgressStore((s) => s.checkpoints_passed);
  const dueCount = useSrsStore((s) => s.reviewableCount);
  const unitMastery = useSrsStore((s) => s.unitMastery);
  const badges = useProgressStore((s) => s.badges);

  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  const nodeRefs = useMemo(
    () => pathItems.map(() => createRef<HTMLDivElement>()),
    [pathItems],
  );
  const scrolledRef = useRef(false);

  // Find the current unit index across all sections
  const currentUnitIndex = useMemo(() => {
    for (let i = 0; i < pathItems.length; i++) {
      const isUnlocked = i === 0 || isUnitComplete(pathItems[i - 1].unit, lessonsCompleted);
      const status = getUnitStatus(pathItems[i].unit, lessonsCompleted, isUnlocked);
      if (status === 'in_progress' || status === 'available') return i;
    }
    return -1;
  }, [pathItems, lessonsCompleted]);

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
              {curriculum.sections.length} sections — A1 to B2
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

        {/* Winding path with CEFR banners */}
        <div className="relative px-4">
          {pathItems.map((item, index) => {
            const { unit, section, showCEFRBanner, showCheckpoint, prevSection } = item;
            const isUnlocked =
              index === 0 || isUnitComplete(pathItems[index - 1].unit, lessonsCompleted);
            const status = getUnitStatus(unit, lessonsCompleted, isUnlocked);
            const side = SIDE_PATTERN[index % SIDE_PATTERN.length];
            const isCurrent = index === currentUnitIndex;
            const selected = selectedUnit === unit.id;
            const completedCount = unit.lessons.filter((l: { id: string }) =>
              lessonsCompleted.includes(l.id),
            ).length;

            const prevSide = index > 0 ? SIDE_PATTERN[(index - 1) % SIDE_PATTERN.length] : null;
            const prevStatus = index > 0
              ? getUnitStatus(
                  pathItems[index - 1].unit,
                  lessonsCompleted,
                  index - 1 === 0 || isUnitComplete(pathItems[index - 2].unit, lessonsCompleted),
                )
              : null;
            const connectorCompleted = prevStatus === 'completed';

            const prevSectionComplete = prevSection ? isSectionComplete(prevSection, lessonsCompleted) : false;
            const prevCheckpointPassed = prevSection ? checkpointsPassed.includes(prevSection.id) : false;

            return (
              <div key={unit.id}>
                {/* Section checkpoint (end of previous section) */}
                {showCheckpoint && prevSection && prevSectionComplete && (
                  <>
                    <PathConnector
                      from={prevSide ?? 'center'}
                      to="center"
                      completed={prevCheckpointPassed}
                    />
                    <div className="flex flex-col items-center w-full mb-2">
                      <Link
                        to={`/checkpoint/${prevSection.id}`}
                        className="flex flex-col items-center gap-1"
                      >
                        <div
                          className={`w-14 h-14 rounded-lg flex items-center justify-center text-lg font-bold transition-colors ${
                            prevCheckpointPassed
                              ? 'bg-green-500 text-white'
                              : 'bg-amber-500 text-white animate-pulse'
                          }`}
                        >
                          {badges.some((b) => b.sectionId === prevSection.id) ? '⭐' : '🏁'}
                        </div>
                        <span className="text-[10px] text-gray-500">
                          {prevCheckpointPassed ? 'Passed' : '≥ 80% to pass'}
                        </span>
                      </Link>
                    </div>
                  </>
                )}

                {/* CEFR level banner */}
                {showCEFRBanner && <CEFRBanner level={section.cefr_level} />}

                {/* Connector from previous node */}
                {prevSide && !showCheckpoint && (
                  <PathConnector
                    from={prevSide}
                    to={side}
                    completed={connectorCompleted}
                  />
                )}
                {showCheckpoint && (
                  <PathConnector
                    from="center"
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
                    {status !== 'completed' && (
                      <div className="border-t border-gray-100 px-4 py-2">
                        <Link
                          to={`/testout/${unit.id}`}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Already know this? Test out →
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Final checkpoint for the last section */}
          {(() => {
            const lastSection = curriculum.sections[curriculum.sections.length - 1];
            const complete = isSectionComplete(lastSection, lessonsCompleted);
            const passed = checkpointsPassed.includes(lastSection.id);
            if (!complete) return null;
            const lastIdx = pathItems.length - 1;
            const lastSide = SIDE_PATTERN[lastIdx % SIDE_PATTERN.length];
            return (
              <>
                <PathConnector from={lastSide} to="center" completed />
                <div className="flex flex-col items-center w-full">
                  <Link
                    to={`/checkpoint/${lastSection.id}`}
                    className="flex flex-col items-center gap-1"
                  >
                    <div
                      className={`w-16 h-16 rounded-lg flex items-center justify-center text-lg font-bold transition-colors ${
                        passed
                          ? 'bg-green-500 text-white'
                          : 'bg-amber-500 text-white animate-pulse'
                      }`}
                    >
                      {badges.some((b) => b.sectionId === lastSection.id) ? '⭐' : '🏁'}
                    </div>
                    <span className="text-xs font-medium text-gray-700">
                      Final Checkpoint
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {passed ? 'Passed' : '≥ 80% to pass'}
                    </span>
                  </Link>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
