# Frontend — Agent Guide

## Store APIs

### useProgressStore (progressStore.ts)
```ts
hydrated: boolean
hydrate(): Promise<void>
completeLesson(lessonId: string): Promise<void>
saveLessonScore(lessonId: string, score: number, total: number, missedExerciseIds: string[]): Promise<void>
resetLesson(lessonId: string): Promise<void>
unlockUnit(unitId: string): Promise<void>
passCheckpoint(sectionId: string): Promise<void>
// Also exposes UserProgress fields: current_section, current_unit, lessons_completed, lesson_scores, etc.
```

### useSrsStore (srsStore.ts)
```ts
dueCards: SRSCard[]
hydrated: boolean
hydrate(): Promise<void>
addCards(cards: { wordId: string; skillType: ExerciseType }[]): Promise<void>  // deduplicates internally
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

## Lesson Engine (engine/lessonRunner.ts)
```ts
findLesson(lessonId: string): Promise<Lesson | undefined>  // lazy-loads lesson chunk
collectTargetWords(exercises: Exercise[]): string[]
buildLessonResult(lessonId, exercises, results, startTime): LessonResult
```

## Validation Engine (engine/validation.ts)
```ts
validateAnswer(userInput: string, correctAnswer: string): ValidationResult
// Tiers: exact match → accent-tolerant → typo-tolerant (Levenshtein) → incorrect
```

## Shared Utilities
- `shared/utils/shuffle.ts` — `shuffle<T>(arr: T[]): T[]`
- `shared/utils/exercise.ts` — `getCorrectAnswer(exercise)`, `getFirstCorrectAnswer(exercise)`

## Shared Components
- `HydrationGuard` — wraps all routes, hydrates stores + seeds vocabulary before rendering
- `LoadingScreen`, `EmptyState`, `ProgressBar`, `CloseIcon`

## Hydration
All store hydration is centralized in `shared/components/HydrationGuard.tsx`, wrapped around routes in `App.tsx`. Individual pages do NOT handle hydration — they can assume stores are ready. Deep-links work correctly.

## Curriculum Data
- `data/curriculum.ts` — exports `curriculum: Curriculum` with sections/units and `LessonMeta[]` (lightweight: id, name, order)
- `data/lessonLoader.ts` — `loadLesson(id)` and `loadAllLessons()` via `import.meta.glob` (lazy chunks)
- `data/units/unit-01/` — per-lesson JSON files (unit-01-lesson-01.json, etc.)
- Curriculum structure is bundled; lesson content is lazy-loaded on demand

## Routing (App.tsx)
- `/` → `features/path/PathPage.tsx`
- `/lesson/:id` → `features/lesson/LessonPage.tsx` (`:id` is lesson ID like `unit-01-lesson-01`)
- `/review` → `features/review/ReviewPage.tsx`

## Feature Structure
Each feature (`lesson/`, `review/`, `path/`, `exercises/`) contains its own page, components, and hooks. Cross-feature code goes in `shared/`.
