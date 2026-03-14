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
  isCurrent: boolean;
  side: 'left' | 'center' | 'right';
  onSelect: () => void;
  nodeRef?: React.RefObject<HTMLDivElement | null>;
}

export default function PathNode({
  unit,
  status,
  mastery,
  isCurrent,
  side,
  onSelect,
  nodeRef,
}: PathNodeProps) {
  const isLocked = status === 'locked';
  const nodeSize = 72;
  const masteryValue = isLocked ? 0 : (mastery ?? 0);
  const masteryColor = getMasteryColor(masteryValue);

  /** Must match PathConnector POS values */
  const leftPercent = side === 'left' ? 20 : side === 'right' ? 80 : 50;

  return (
    <div ref={nodeRef} className="relative z-10 w-full" style={{ height: nodeSize }}>
      <button
        onClick={isLocked ? undefined : onSelect}
        disabled={isLocked}
        className={`absolute flex items-center justify-center group ${
          isLocked ? 'cursor-not-allowed' : 'cursor-pointer'
        }`}
        style={{ width: nodeSize, height: nodeSize, left: `${leftPercent}%`, transform: 'translateX(-50%)' }}
      >
        {/* Pulse ring for current unit */}
        {isCurrent && (
          <div
            className="absolute inset-0 rounded-full bg-blue-400/30 animate-ping"
            style={{ margin: -6 }}
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
      </button>
    </div>
  );
}
