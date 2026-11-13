import { useProgressStore } from '@/stores/progressStore';
import { useSrsStore } from '@/stores/srsStore';
import { getAllVocab } from '@/engine/vocabCache';
import { getChapters, stampEarned } from '@/engine/chapters';
import { GRAMMAR_PLAN } from '@/data/grammarPlan';
import { grammarTiles } from '@/engine/grammar';
import { Count, Label, Page, PageHeader, Postcard, SegmentBar, Stamp, TileGrid } from '@/shared/components/design';

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
  const tiles = grammarTiles();

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

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
        <div className="flex flex-col gap-3 lg:flex-1">
          <Label>Words · of the A1 vocabulary</Label>
          <Count value={known.size} rest={`known of ${total}`} />
          <SegmentBar learned={solidPct} fading={fadingPct} thick />
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm whitespace-nowrap text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-learned" />{solidPct}% solid</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-fading" />{fadingPct}% due for review</span>
          </div>
        </div>
        <div className="flex items-center gap-4 sm:gap-5.5 lg:w-105 lg:shrink-0">
          <TileGrid tiles={tiles} size={44} columns={8} className="max-sm:hidden" />
          <TileGrid tiles={tiles} size={26} columns={8} className="sm:hidden" />
          <div className="flex flex-col gap-1">
            <Label>Grammar units</Label>
            <Count value={tiles.filter((t) => t === 'learned').length} rest={`of ${GRAMMAR_PLAN.length}`} className="text-3xl" />
            <p className="text-sm text-muted-foreground">
              {tiles.filter((t) => t === 'in-progress').length} in progress
            </p>
          </div>
        </div>
      </div>

      <Postcard
        title="Your stamp book · what you can do in Italian"
        meta={`${earnedCount} of ${stamps.length} collected`}
        postmark="A1"
      >
        <div className="grid grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))] gap-3 sm:grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] sm:gap-5">
          {stamps.map(({ unit, earned }) => (
            <Stamp key={unit.id} title={unit.stamp_title ?? unit.name} caption={`A1 · ${unit.name}`} earned={earned} fluid />
          ))}
        </div>
      </Postcard>
    </Page>
  );
}
