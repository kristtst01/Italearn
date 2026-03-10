# Frontend — Agent Guide

## Store APIs

### useProgressStore (progressStore.ts)
```ts
hydrated: boolean
hydrate(): Promise<void>
completeLesson(lessonId: string): Promise<void>
unlockUnit(unitId: string): Promise<void>
passCheckpoint(sectionId: string): Promise<void>
// Also exposes UserProgress fields: current_section, current_unit, lessons_completed, etc.
```

### useSrsStore (srsStore.ts)
```ts
dueCards: SRSCard[]
hydrated: boolean
hydrate(): Promise<void>
addCards(cards: { wordId: string; skillType: ExerciseType }[]): Promise<void>
reviewCard(cardId: number, grade: Grade): Promise<void>
refreshDueCards(): Promise<void>
```

## SRS Engine (engine/srs.ts)
```ts
createCard(wordId: string, skillType: ExerciseType): Promise<SRSCard>
reviewCard(srsCard: SRSCard, grade: Grade): Promise<SRSCard>
getDueCards(): Promise<SRSCard[]>
getCardCount(): Promise<{ due: number; total: number }>
```
Uses ts-fsrs with 90% target retention.

## Curriculum Data
- `data/curriculum.ts` — exports `curriculum: Curriculum` with all sections/units (lessons empty for units 2-38)
- `data/units/unit-01.json` — full lesson/exercise content for unit 1
- Curriculum is imported statically, not fetched

## Routing (App.tsx)
- `/` → Path.tsx
- `/lesson/:id` → Lesson.tsx (`:id` is lesson ID like `unit-01-lesson-01`)
- `/review` → Review.tsx
