import { useEffect, useRef, useState, useMemo, createRef } from 'react';
import { Link } from 'react-router-dom';

import { curriculum } from '@/data/curriculum';
import { useProgressStore } from '@/stores/progressStore';
import type { CEFRLevel, Unit, UnitStatus } from '@/types';
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

/** Zigzag pattern: left, center, right, center, left, ... */
const SIDE_PATTERN: ('left' | 'center' | 'right')[] = ['left', 'center', 'right', 'center'];

interface PathItem {
  unit: Unit;
  sectionCEFR: CEFRLevel;
  /** Show CEFR banner before this unit (first unit at a new CEFR level) */
  showCEFRBanner: boolean;
}

/** Flatten all units with precomputed banner flags. */
function buildPathItems(): PathItem[] {
  const items: PathItem[] = [];
  let lastCEFR: CEFRLevel | null = null;

  for (const section of curriculum.sections) {
    for (let i = 0; i < section.units.length; i++) {
      const unit = section.units[i];
      const showCEFRBanner = section.cefr_level !== lastCEFR && i === 0;

      items.push({
        unit,
        sectionCEFR: section.cefr_level,
        showCEFRBanner,
      });

      if (showCEFRBanner) lastCEFR = section.cefr_level;
    }
  }
  return items;
}

export default function PathPage() {
  const pathItems = useMemo(() => buildPathItems(), []);

  const lessonsCompleted = useProgressStore((s) => s.lessons_completed);
  const lessonScores = useProgressStore((s) => s.lesson_scores);
  const resetLesson = useProgressStore((s) => s.resetLesson);
  const lessonProgress = useMemo(() => {
    const progress: Record<string, number> = {};
    for (const item of pathItems) {
      const unit = item.unit;
      if (unit.lessons.length === 0) continue;
      const completed = unit.lessons.filter((l) => lessonsCompleted.includes(l.id)).length;
      progress[unit.id] = Math.round((completed / unit.lessons.length) * 100);
    }
    return progress;
  }, [pathItems, lessonsCompleted]);

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
      {/* Winding path — stays narrow and centered */}
      <div className="max-w-md mx-auto">
        <div className="relative px-4">
          {pathItems.map((item, index) => {
            const { unit, sectionCEFR, showCEFRBanner } = item;
            const isUnlocked =
              index === 0 || isUnitComplete(pathItems[index - 1].unit, lessonsCompleted);
            const status = getUnitStatus(unit, lessonsCompleted, isUnlocked);
            const side = SIDE_PATTERN[index % SIDE_PATTERN.length];
            const isCurrent = index === currentUnitIndex;
            const selected = selectedUnit === unit.id;
            const prevSide = index > 0 ? SIDE_PATTERN[(index - 1) % SIDE_PATTERN.length] : null;
            const prevStatus = index > 0
              ? getUnitStatus(
                  pathItems[index - 1].unit,
                  lessonsCompleted,
                  index - 1 === 0 || isUnitComplete(pathItems[index - 2].unit, lessonsCompleted),
                )
              : null;
            const connectorCompleted = prevStatus === 'completed';

            return (
              <div key={unit.id}>
                {/* CEFR level banner */}
                {showCEFRBanner && <CEFRBanner level={sectionCEFR} />}

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
                  mastery={lessonProgress[unit.id]}
                  isCurrent={isCurrent}
                  side={side}
                  onSelect={() =>
                    setSelectedUnit(selected ? null : unit.id)
                  }
                  nodeRef={nodeRefs[index]}
                />

                {/* Lesson list dropdown */}
                {selected && unit.lessons.length > 0 && (
                  <div className="mt-2 mb-2 rounded-xl border border-gray-200 bg-white overflow-hidden">
                    <div className="px-4 pt-3 pb-1">
                      <h3 className="text-sm font-semibold text-gray-900">{unit.name}</h3>
                      {unit.grammar_focus && (
                        <p className="text-xs text-gray-500">{unit.grammar_focus}</p>
                      )}
                    </div>
                    <LessonList
                      lessons={unit.lessons}
                      completedLessons={lessonsCompleted}
                      lessonScores={lessonScores}
                      unitId={unit.id}
                      hasCards={unit.lessons.some((l) => lessonsCompleted.includes(l.id))}
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
        </div>
      </div>
    </div>
  );
}
