import { useProgressStore } from '@/stores/progressStore';
import { useSrsStore } from '@/stores/srsStore';
import { getAllVocab } from '@/engine/vocabCache';
import { getChapters, stampEarned } from '@/engine/chapters';
import { GRAMMAR_PLAN } from '@/data/grammarPlan';
import { grammarTiles } from '@/engine/grammar';
import { Label, Page, PageHeader, Postcard, SegmentBar, Stamp, TileGrid } from '@/shared/components/design';

export default function ProgressPage() {
  const completed = useProgressStore((s) => s.lessons_completed);
  const allCards = useSrsStore((s) => s.allCards);

  // Words: known = has a vocab card; fading = that card is due now.
  const now = new Date();
  const vocabCards = allCards.filter((c) => c.skill_type === 'vocab');
  const known = new Set(vocabCards.map((c) => c.word_id));
  const fading = new Set(vocabCards.filter((c) => c.due <= now).map((c) => c.word_id));
  const total = getAllVocab().length || 1;
  const solidPct = Math.round(((known.size - fading.size) / total) * 100);
  const fadingPct = Math.round((fading.size / total) * 100);

  const chapters = getChapters();
  const stamps = chapters.map((u) => ({ unit: u, earned: stampEarned(u, completed) }));
  const earnedCount = stamps.filter((s) => s.earned).length;

  return (
    <Page
      shapes={[
        { kind: 'circle', color: 'cobalto', size: 320, position: { right: -100, bottom: -120 } },
        { kind: 'half', color: 'vermiglione', size: 300, position: { left: -40, bottom: 0 } },
      ]}
      className="pb-40"
    >
      <PageHeader
        label="A1 · Breakthrough"
        title="Your A1"
        description="What you actually know, measured by your reviews. It drops if you stop practising."
      />

      <div className="flex items-start gap-12">
        <div className="flex flex-1 flex-col gap-3">
          <Label>Words · of the A1 vocabulary</Label>
          <p className="font-display text-4xl">
            {known.size} <span className="font-sans text-base font-medium text-muted-foreground">known of {total}</span>
          </p>
          <SegmentBar learned={solidPct} fading={fadingPct} thick />
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm whitespace-nowrap text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-learned" />{solidPct}% solid</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-fading" />{fadingPct}% due for review</span>
          </div>
        </div>
        <div className="flex w-105 shrink-0 items-center gap-5.5">
          <TileGrid tiles={grammarTiles()} size={44} columns={7} />
          <div className="flex flex-col gap-1">
            <Label>Grammar units</Label>
            <p className="font-display text-3xl">
              {grammarTiles().filter((t) => t === 'learned').length}
              <span className="font-sans text-base font-medium text-muted-foreground"> of {GRAMMAR_PLAN.length}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              {grammarTiles().filter((t) => t === 'in-progress').length} in progress
            </p>
          </div>
        </div>
      </div>

      <Postcard
        title="Your stamp book · what you can do in Italian"
        meta={`${earnedCount} of ${stamps.length} collected`}
        postmark="A1"
      >
        <div className="grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-5">
          {stamps.map(({ unit, earned }) => (
            <Stamp key={unit.id} title={unit.stamp_title ?? unit.name} caption={`A1 · ${unit.name}`} earned={earned} fluid />
          ))}
        </div>
      </Postcard>
    </Page>
  );
}
