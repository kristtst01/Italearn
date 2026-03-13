import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Lock, Check } from 'lucide-react';
import type { Unit, UnitStatus } from '@/types';

function getMasteryColor(percentage: number): string {
  if (percentage >= 80) return '#22c55e';
  if (percentage >= 50) return '#f59e0b';
  return '#fb923c';
}

interface PathNodeProps {
  unit: Unit;
  status: UnitStatus;
  mastery: number | undefined;
  completedCount: number;
  isCurrent: boolean;
  side: 'left' | 'center' | 'right';
  onSelect: () => void;
  selected: boolean;
  nodeRef?: React.RefObject<HTMLDivElement | null>;
}

export default function PathNode({
  unit,
  status,
  mastery,
  completedCount,
  isCurrent,
  side,
  onSelect,
  selected,
  nodeRef,
}: PathNodeProps) {
  const isLocked = status === 'locked';
  const nodeSize = 72;
  const masteryValue = isLocked ? 0 : (mastery ?? 0);
  const masteryColor = getMasteryColor(masteryValue);

  const alignClass =
    side === 'left' ? 'items-start' : side === 'right' ? 'items-end' : 'items-center';

  return (
    <div ref={nodeRef} className={`flex flex-col ${alignClass} w-full`}>
      <button
        onClick={isLocked ? undefined : onSelect}
        disabled={isLocked}
        className={`relative flex flex-col items-center gap-1 group ${
          isLocked ? 'cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        {/* Pulse ring for current unit */}
        {isCurrent && (
          <div
            className="absolute rounded-full bg-blue-400/30 animate-ping"
            style={{ width: nodeSize + 12, height: nodeSize + 12, top: -6, left: '50%', transform: 'translateX(-50%)' }}
          />
        )}

        <div className="relative flex items-center justify-center" style={{ width: nodeSize, height: nodeSize }}>
          <CircularProgressbar
            value={masteryValue}
            styles={buildStyles({
              pathColor: masteryColor,
              trailColor: '#e5e7eb',
              strokeLinecap: 'round',
            })}
            strokeWidth={6}
          />
          <div
            className={`absolute rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              isLocked
                ? 'bg-gray-200 text-gray-400'
                : status === 'completed'
                  ? 'bg-green-500 text-white'
                  : isCurrent
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border-2 border-gray-300'
            }`}
            style={{ width: nodeSize - 16, height: nodeSize - 16 }}
          >
            {isLocked ? (
              <Lock className="w-5 h-5" />
            ) : status === 'completed' ? (
              <Check className="w-5 h-5" />
            ) : (
              unit.order
            )}
          </div>
        </div>

        {/* Unit name label */}
        <span
          className={`text-xs font-medium text-center max-w-[120px] leading-tight ${
            isLocked ? 'text-gray-400' : selected ? 'text-blue-700' : 'text-gray-700'
          }`}
        >
          {unit.name}
        </span>

        {/* Progress indicator for in-progress units */}
        {status === 'in_progress' && unit.lessons.length > 0 && (
          <span className="text-[10px] text-blue-600 font-medium">
            {completedCount}/{unit.lessons.length}
          </span>
        )}
      </button>
    </div>
  );
}
