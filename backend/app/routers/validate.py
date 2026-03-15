from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.validate import ValidateRequest, ValidateResponse
from app.services import llm, verdict_cache as cache_svc

router = APIRouter(prefix="/api/v1/ai", tags=["ai"])


@router.post("/validate", response_model=ValidateResponse)
async def validate_answer(
    body: ValidateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not llm.is_configured():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="LLM service not configured",
        )

    exercise_key = cache_svc.make_exercise_key(
        body.exercise_type, body.prompt, body.expected_answers
    )

    # Check cache first
    cached = await cache_svc.get_cached_verdict(db, exercise_key, body.user_answer)
    if cached is not None:
        return ValidateResponse(accepted=cached.accepted, reason=cached.reason, cached=True)

    # Cache miss — ask LLM
    verdict = await llm.judge_answer(
        exercise_type=body.exercise_type,
        prompt=body.prompt,
        expected_answers=body.expected_answers,
        user_answer=body.user_answer,
        sentence_context=body.sentence_context,
    )

    # Cache the result for future requests
    await cache_svc.cache_verdict(
        db,
        exercise_key=exercise_key,
        user_answer=body.user_answer,
        accepted=verdict["accepted"],
        reason=verdict["reason"],
    )

    return ValidateResponse(
        accepted=verdict["accepted"],
        reason=verdict["reason"],
        cached=False,
    )
