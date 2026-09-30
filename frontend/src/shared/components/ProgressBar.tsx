interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-vuoto">
      <div className="h-full rounded-full bg-cobalto transition-all duration-300" style={{ width: `${progress}%` }} />
    </div>
  );
}
