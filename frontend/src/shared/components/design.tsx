import { useId, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/*
 * Design-system building blocks (docs/design-system.md).
 * Colours come only from tokens in index.css.
 */

// ── Type ──────────────────────────────────────────────

export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('text-xs font-bold uppercase tracking-label text-muted-foreground', className)}>
      {children}
    </p>
  );
}

export function PageHeader({
  label,
  title,
  description,
  aside,
}: {
  /** Always present, so titles line up across pages (no jump when switching sections) */
  label: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-8">
      <div className="flex flex-col gap-2">
        <Label>{label}</Label>
        <h1 className="font-display text-title">{title}</h1>
        {description && <p className="max-w-2xl text-base text-muted-foreground">{description}</p>}
      </div>
      {aside}
    </div>
  );
}

// ── Page frame with background shapes ────────────────

type ShapeColor = 'vermiglione' | 'cobalto' | 'ocra';

export interface Shape {
  kind: 'circle' | 'half';
  color: ShapeColor;
  size: number;
  /** Offsets in px from the page edges; negative values push the shape off-screen.
   *  A half-circle's flat side must sit on the bottom edge (bottom: 0), or it looks cut off. */
  position: Pick<CSSProperties, 'top' | 'right' | 'bottom' | 'left'>;
  /** Only show on wide screens, for pages whose content would otherwise run under the shape */
  wideOnly?: boolean;
}

const SHAPE_BG: Record<ShapeColor, string> = {
  vermiglione: 'bg-vermiglione',
  cobalto: 'bg-cobalto',
  ocra: 'bg-ocra',
};

/**
 * A page below the top bar. Background shapes sit behind the content and must only
 * be placed in empty space (never behind cards or text).
 */
export function Page({
  shapes = [],
  children,
  className,
}: {
  shapes?: Shape[];
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="relative isolate flex-1 overflow-clip">
      {shapes.map((s, i) => (
        <div
          key={i}
          aria-hidden
          className={cn(
            'absolute -z-10',
            SHAPE_BG[s.color],
            s.kind === 'circle' ? 'rounded-full' : 'rounded-t-full',
            s.wideOnly && 'hidden 2xl:block',
          )}
          style={{ ...s.position, width: s.size, height: s.kind === 'circle' ? s.size : s.size / 2 }}
        />
      ))}
      <main className={cn('mx-auto flex max-w-7xl flex-col gap-7 px-14 py-11', className)}>{children}</main>
    </div>
  );
}

// ── Placeholders ──────────────────────────────────────

/** A feature that exists in the design but isn't built yet. Same footprint as the real thing. */
export function Placeholder({
  title,
  description,
  label = 'Coming soon',
  className,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  label?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn('flex flex-col gap-1 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-white px-4 py-3.5', className)}>
      <Label>{label}</Label>
      <p className="font-bold">{title}</p>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {children}
    </div>
  );
}

// ── Status ────────────────────────────────────────────

export type StatusKind = 'learned' | 'in-progress' | 'recommended' | 'not-started';

const STATUS: Record<StatusKind, { label: string; dot?: string; text: string }> = {
  learned: { label: 'Learned', dot: 'bg-learned', text: 'text-foreground' },
  'in-progress': { label: 'In progress', dot: 'bg-in-progress', text: 'text-foreground' },
  recommended: { label: 'Recommended next', dot: 'bg-vermiglione', text: 'text-vermiglione-scuro' },
  'not-started': { label: 'Not started', text: 'text-muted-foreground' },
};

export function Status({ kind, label }: { kind: StatusKind; label?: string }) {
  const s = STATUS[kind];
  return (
    <span className={cn('flex items-center gap-1.5 text-xs font-bold', s.text)}>
      {s.dot && <span className={cn('size-2 rounded-full', s.dot)} />}
      {label ?? s.label}
    </span>
  );
}

/** Thin bar: learned (green) then in-progress (ochre) segments, in percent. */
export function SegmentBar({
  learned,
  inProgress = 0,
  fading = 0,
  thick = false,
}: {
  learned: number;
  inProgress?: number;
  fading?: number;
  thick?: boolean;
}) {
  return (
    <div className={cn('flex overflow-hidden rounded-full bg-vuoto', thick ? 'h-2.5' : 'h-1')}>
      <div className="bg-learned" style={{ width: `${learned}%` }} />
      <div className="bg-in-progress" style={{ width: `${inProgress}%` }} />
      <div className="bg-fading" style={{ width: `${fading}%` }} />
    </div>
  );
}

// ── Majolica tiles ────────────────────────────────────

export type TileStatus = 'learned' | 'in-progress' | 'empty';

const TILE_FILL: Record<TileStatus, string> = {
  learned: 'bg-learned',
  'in-progress': 'bg-in-progress',
  empty: 'bg-vuoto',
};

export function MajolicaTile({ status, size = 44 }: { status: TileStatus; size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center border border-cobalto bg-maiolica"
      style={{ width: size, height: size }}
    >
      <div className={cn('rotate-45', TILE_FILL[status])} style={{ width: size * 0.53, height: size * 0.53 }} />
      <div className="absolute rounded-full bg-cobalto" style={{ width: size * 0.2, height: size * 0.2 }} />
    </div>
  );
}

export function TileGrid({ tiles, size = 44, columns = 5 }: { tiles: TileStatus[]; size?: number; columns?: number }) {
  return (
    <div className="grid w-max" style={{ gridTemplateColumns: `repeat(${columns}, ${size}px)` }}>
      {tiles.map((t, i) => (
        <MajolicaTile key={i} status={t} size={size} />
      ))}
    </div>
  );
}

// ── Stamps & postcard ─────────────────────────────────

export function Stamp({
  title,
  caption,
  earned,
  fluid = false,
  className,
}: {
  title: string;
  caption?: string;
  earned: boolean;
  /** Fill the width of its container (e.g. a grid cell) and keep stamp proportions */
  fluid?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex shrink-0 flex-col justify-between border-4 border-dotted bg-white p-2.5',
        fluid ? 'aspect-[120/148] w-full' : 'h-37 w-30',
        earned ? 'border-vermiglione-scuro' : 'border-muted-foreground/40',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-1">
        <p className={cn('font-display text-sm leading-tight', earned ? 'text-vermiglione-scuro' : 'text-muted-foreground')}>
          {title}
        </p>
        <span
          className={cn(
            'size-4 shrink-0 rounded-full',
            earned ? 'bg-vermiglione-scuro' : 'border-2 border-muted-foreground/40',
          )}
        />
      </div>
      {caption && <p className="text-xs leading-snug text-muted-foreground">{caption}</p>}
    </div>
  );
}

/** Airmail-bordered panel with a postmark. Only used for the stamp book. */
export function Postcard({
  title,
  meta,
  postmark,
  children,
}: {
  title: ReactNode;
  meta?: ReactNode;
  postmark: string;
  children: ReactNode;
}) {
  return (
    <div className="airmail rounded p-2.5">
      <div className="flex flex-col gap-6 bg-white px-10 pt-7 pb-10">
        <div className="flex items-center justify-between gap-6">
          <Label>{title}</Label>
          <div className="flex items-center gap-5">
            {meta && <span className="text-sm text-muted-foreground">{meta}</span>}
            <Postmark label={postmark} />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Round cancellation mark: curved text on a double ring, drawn in cobalt. */
function Postmark({ label }: { label: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 100 100" className="size-21 shrink-0 -rotate-12 text-cobalto" aria-hidden>
      <defs>
        <path id={`${id}-top`} d="M 15,50 A 35,35 0 0 1 85,50" />
        <path id={`${id}-bottom`} d="M 7,50 A 43,43 0 0 0 93,50" />
      </defs>
      <circle cx="50" cy="50" r="47" className="fill-white stroke-current" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="30" className="fill-none stroke-current" strokeWidth="1.5" />
      <text className="fill-current font-sans text-[10px] font-bold" letterSpacing="1.5">
        <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">ITALEARN</textPath>
      </text>
      <text className="fill-current font-sans text-[10px] font-bold" letterSpacing="1.2">
        <textPath href={`#${id}-bottom`} startOffset="50%" textAnchor="middle">POSTA AEREA</textPath>
      </text>
      <text x="50" y="57" textAnchor="middle" className="fill-current font-display text-[20px]">
        {label}
      </text>
    </svg>
  );
}

// ── Red-pen correction ────────────────────────────────

/** A wrong answer struck through in red, with the correction handwritten after it. */
export function Correction({ wrong, right }: { wrong?: string; right: string }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-3 text-reading">
      {wrong && <span className="text-muted-foreground line-through decoration-correction decoration-2">{wrong}</span>}
      <span className="font-hand text-3xl leading-none text-correction">{right}</span>
    </p>
  );
}

// ── Grammar chip ──────────────────────────────────────

/** A grammar unit a chapter uses, with its status as a small majolica tile. */
export function GrammarChip({ label, status }: { label: string; status: TileStatus }) {
  const text = { learned: 'learned', 'in-progress': 'in progress', empty: 'not started' }[status];
  return (
    <span className="flex items-center gap-1.5 text-sm font-medium" title={`${label}: ${text}`}>
      <MajolicaTile status={status} size={18} />
      {label}
    </span>
  );
}
