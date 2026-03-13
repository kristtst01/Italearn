import type { Unit, UnitStatus } from '@/types';

interface MasteryRingProps {
  percentage: number;
  size: number;
  children: React.ReactNode;
}

function MasteryRing({ percentage, size, children }: MasteryRingProps) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const color =
    percentage >= 80 ? 'text-green-500' : percentage >= 50 ? 'text-amber-500' : 'text-orange-400';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200"
        />
        {percentage > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={color}
          />
        )}
      </svg>
      {children}
    </div>
  );
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

        <MasteryRing percentage={isLocked ? 0 : (mastery ?? 0)} size={nodeSize}>
          <div
            className={`rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
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
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            ) : status === 'completed' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              unit.order
            )}
          </div>
        </MasteryRing>

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
