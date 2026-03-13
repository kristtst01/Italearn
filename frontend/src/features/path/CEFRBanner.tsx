import type { CEFRLevel } from '@/types';

const CEFR_CONFIG: Record<CEFRLevel, { label: string; color: string; bg: string; border: string }> = {
  A1: { label: 'A1 — Foundations', color: 'text-emerald-800', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  A2: { label: 'A2 — Elementary', color: 'text-blue-800', bg: 'bg-blue-50', border: 'border-blue-200' },
  B1: { label: 'B1 — Intermediate', color: 'text-purple-800', bg: 'bg-purple-50', border: 'border-purple-200' },
  B2: { label: 'B2 — Upper Intermediate', color: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-200' },
};

interface CEFRBannerProps {
  level: CEFRLevel;
}

export default function CEFRBanner({ level }: CEFRBannerProps) {
  const config = CEFR_CONFIG[level];
  return (
    <div className={`w-full rounded-xl ${config.bg} border ${config.border} px-4 py-3 my-6 text-center`}>
      <p className={`text-sm font-bold tracking-wide uppercase ${config.color}`}>
        {config.label}
      </p>
    </div>
  );
}
