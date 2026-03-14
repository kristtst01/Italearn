import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.progress import UserProgress


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
