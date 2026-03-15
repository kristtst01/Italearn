import uuid

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.progress import UserProgress
from app.models.srs_card import SRSCard


async def get_or_create_progress(db: AsyncSession, user_id: uuid.UUID) -> UserProgress:
    result = await db.execute(select(UserProgress).where(UserProgress.user_id == user_id))
    progress = result.scalar_one_or_none()

    if progress is None:
        progress = UserProgress(user_id=user_id)
        db.add(progress)
        await db.commit()
        await db.refresh(progress)

    return progress


async def update_progress(db: AsyncSession, user_id: uuid.UUID, data: dict) -> UserProgress:
    progress = await get_or_create_progress(db, user_id)

    for key, value in data.items():
        if value is not None and hasattr(progress, key):
            setattr(progress, key, value)

    await db.commit()
    await db.refresh(progress)
    return progress


async def reset_progress(db: AsyncSession, user_id: uuid.UUID) -> UserProgress:
    """Delete all SRS cards and reset progress to defaults."""
    await db.execute(delete(SRSCard).where(SRSCard.user_id == user_id))

    result = await db.execute(select(UserProgress).where(UserProgress.user_id == user_id))
    progress = result.scalar_one_or_none()

    if progress:
        progress.lessons_completed = []
        progress.lesson_scores = {}
        progress.badges = []
        progress.streak_dates = []
        progress.daily_activity = {}
        progress.xp = 0
        progress.streak = 0
        progress.level = 1
        progress.current_section = "a1-basics"
        progress.current_unit = ""
        progress.current_lesson = ""
        progress.checkpoints_passed = []
    else:
        progress = UserProgress(user_id=user_id)
        db.add(progress)

    await db.commit()
    await db.refresh(progress)
    return progress
