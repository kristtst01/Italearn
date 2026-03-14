interface PathConnectorProps {
  from: 'left' | 'center' | 'right';
  to: 'left' | 'center' | 'right';
  completed: boolean;
}

/** Position percentage for each side alignment */
const POS: Record<string, number> = { left: 20, center: 50, right: 80 };

export default function PathConnector({ from, to, completed }: PathConnectorProps) {
  const x1 = POS[from];
  const x2 = POS[to];

  /* Extend 36px (half node height) into the nodes above & below
     so the line runs from circle-center to circle-center.
     Nodes use z-10 to render on top of this. */
  return (
    <div className="w-full h-8 relative">
      <svg
        className="absolute w-full"
        style={{ top: -36, height: 'calc(100% + 72px)' }}
        preserveAspectRatio="none"
      >
        <line
          x1={`${x1}%`}
          y1="0"
          x2={`${x2}%`}
          y2="100%"
          stroke={completed ? '#22c55e' : '#d1d5db'}
          strokeWidth={completed ? 3 : 2}
          strokeDasharray={completed ? 'none' : '6 4'}
        />
      </svg>
    </div>
  );
}
