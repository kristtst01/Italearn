import hashlib

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.verdict_cache import VerdictCache


def make_exercise_key(exercise_type: str, prompt: str, expected_answers: list[str]) -> str:
    """Create a normalized hash key from exercise context.

    Shared across users — if "buongiorno" is valid for "hello", it's valid for everyone.
    """
    normalized = f"{exercise_type}|{prompt}|{'|'.join(sorted(expected_answers))}"
    return hashlib.sha256(normalized.lower().encode()).hexdigest()[:32]


async def get_cached_verdict(
    db: AsyncSession, exercise_key: str, user_answer: str
) -> VerdictCache | None:
    result = await db.execute(
        select(VerdictCache).where(
            and_(
                VerdictCache.exercise_key == exercise_key,
                VerdictCache.user_answer == user_answer.lower().strip(),
            )
        )
    )
    return result.scalar_one_or_none()


async def cache_verdict(
    db: AsyncSession,
    exercise_key: str,
    user_answer: str,
    accepted: bool,
    reason: str,
) -> VerdictCache:
    verdict = VerdictCache(
        exercise_key=exercise_key,
        user_answer=user_answer.lower().strip(),
        accepted=accepted,
        reason=reason,
    )
    db.add(verdict)
    await db.commit()
    await db.refresh(verdict)
    return verdict
