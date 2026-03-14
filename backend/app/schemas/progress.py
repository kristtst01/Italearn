from __future__ import annotations

import uuid
from typing import Any

from pydantic import BaseModel


class LessonScore(BaseModel):
    score: int
    total: int
    missedExerciseIds: list[str] = []


class Badge(BaseModel):
    sectionId: str
    earnedAt: str


class DailyActivity(BaseModel):
    lessons: int = 0
    reviews: int = 0


class ProgressResponse(BaseModel):
    id: uuid.UUID
    current_section: str
    current_unit: str
    current_lesson: str
    xp: int
    streak: int
    level: int
    lessons_completed: list[str]
    checkpoints_passed: list[str]
    lesson_scores: dict[str, LessonScore]
    badges: list[Badge]
    streak_dates: list[str]
    daily_activity: dict[str, DailyActivity]

    model_config = {"from_attributes": True}


class ProgressUpdate(BaseModel):
    current_section: str | None = None
    current_unit: str | None = None
    current_lesson: str | None = None
    xp: int | None = None
    streak: int | None = None
    level: int | None = None
    lessons_completed: list[str] | None = None
    checkpoints_passed: list[str] | None = None
    lesson_scores: dict[str, Any] | None = None
    badges: list[Any] | None = None
    streak_dates: list[str] | None = None
    daily_activity: dict[str, Any] | None = None
