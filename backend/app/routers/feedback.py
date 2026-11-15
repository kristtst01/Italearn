import json
import logging
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy import delete, func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session, get_db
from app.dependencies import get_current_user, require_admin
from app.models.feedback import Feedback
from app.models.user import User
from app.schemas.feedback import (
    AdminFeedback,
    AdminFeedbackUpdate,
    DraftReply,
    FeedbackCreate,
    FeedbackSummary,
    MyFeedback,
    learner_status,
)
from app.services import feedback_ai

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/feedback", tags=["feedback"])
admin_router = APIRouter(prefix="/api/v1/admin/feedback", tags=["admin"])

MAX_CONTEXT_CHARS = 20_000


def _now() -> datetime:
    # Columns are naive timestamps (server_default now()), so store naive UTC
    return datetime.now(timezone.utc).replace(tzinfo=None)


async def run_triage(feedback_id: uuid.UUID) -> None:
    """Sort one note with the AI. Runs after the note is saved, with its own session.
    It never fails the note: if the AI errors or is unavailable, the note stays unsorted
    (categories None) and shows in the inbox's Unsorted group."""
    try:
        await _triage(feedback_id)
    except Exception:
        logger.exception("[feedback] Triage failed for %s; left unsorted", feedback_id)


async def _triage(feedback_id: uuid.UUID) -> None:
    async with async_session() as db:
        fb = await db.get(Feedback, feedback_id)
        if fb is None:
            return
        result = await feedback_ai.triage(fb.text, fb.quote, fb.context, fb.learner_categories)
        if result is None:
            return
        await db.refresh(fb)
        # The admin's choice (if they sorted it meanwhile) stays; the learner's picks are kept
        # and the AI may add to them
        if not fb.category_by_admin:
            ai = [c for c in result["categories"] if c != "noise" or not fb.learner_categories]
            fb.categories = list(dict.fromkeys([*fb.learner_categories, *ai]))
            fb.pressing = result["pressing"]
        fb.summary = result["summary"]
        fb.verdict = result["verdict"]
        fb.triaged_at = _now()
        await db.commit()


def _to_mine(fb: Feedback) -> MyFeedback:
    return MyFeedback(
        id=fb.id,
        text=fb.text,
        quote=fb.quote,
        context=fb.context,
        status=learner_status(fb.status),
        learner_categories=fb.learner_categories,
        reply=fb.reply,
        unread=fb.learner_unread,
        created_at=fb.created_at,
        updated_at=fb.updated_at,
    )


def _to_admin(fb: Feedback, author: User, me: User) -> AdminFeedback:
    return AdminFeedback(
        id=fb.id,
        text=fb.text,
        quote=fb.quote,
        context=fb.context,
        learner_categories=fb.learner_categories,
        categories=fb.categories,
        category_by_admin=fb.category_by_admin,
        summary=fb.summary,
        pressing=fb.pressing,
        verdict=fb.verdict,
        triaged_at=fb.triaged_at,
        status=fb.status,
        reply=fb.reply,
        created_at=fb.created_at,
        updated_at=fb.updated_at,
        user_name=author.display_name,
        user_is_me=author.id == me.id,
        hidden_by_learner=fb.hidden_by_learner,
    )


# --- Learners ---


@router.post("", response_model=MyFeedback, status_code=status.HTTP_201_CREATED)
async def create_feedback(
    body: FeedbackCreate,
    background: BackgroundTasks,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    context = body.context
    if len(json.dumps(context, ensure_ascii=False)) > MAX_CONTEXT_CHARS:
        # Keep the place, drop the bulky exercise snapshot
        context = {k: v for k, v in context.items() if k != "exercise"}
    fb = Feedback(
        user_id=user.id,
        text=body.text.strip(),
        quote=(body.quote or "").strip() or None,
        context=context,
        learner_categories=list(dict.fromkeys(body.categories)),
        # Shown right away; the AI may add to them once it has looked
        categories=list(dict.fromkeys(body.categories)) or None,
        status="new",
        category_by_admin=False,
        pressing=False,
        learner_unread=False,
        hidden_by_learner=False,
    )
    db.add(fb)
    await db.commit()
    await db.refresh(fb)
    background.add_task(run_triage, fb.id)
    return _to_mine(fb)


@router.get("/mine", response_model=list[MyFeedback])
async def my_feedback(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    rows = await db.execute(
        select(Feedback)
        .where(Feedback.user_id == user.id, Feedback.hidden_by_learner.is_(False))
        .order_by(Feedback.created_at.desc())
    )
    return [_to_mine(fb) for fb in rows.scalars()]


@router.post("/mine/read", status_code=status.HTTP_204_NO_CONTENT)
async def mark_mine_read(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    await db.execute(
        update(Feedback)
        .where(Feedback.user_id == user.id, Feedback.learner_unread.is_(True))
        .values(learner_unread=False, updated_at=Feedback.updated_at)
    )
    await db.commit()


@router.delete("/mine/{feedback_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_mine(
    feedback_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Removes a note from the learner's own list. The team keeps it in the inbox."""
    result = await db.execute(
        update(Feedback)
        .where(Feedback.id == feedback_id, Feedback.user_id == user.id)
        .values(hidden_by_learner=True, learner_unread=False, updated_at=Feedback.updated_at)
    )
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Feedback not found")
    await db.commit()


@router.get("/summary", response_model=FeedbackSummary)
async def feedback_summary(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    unread = await db.scalar(
        select(func.count()).where(
            Feedback.user_id == user.id,
            Feedback.learner_unread.is_(True),
            Feedback.hidden_by_learner.is_(False),
        )
    )
    inbox_new = None
    if user.is_admin:
        inbox_new = await db.scalar(
            select(func.count()).where(
                Feedback.status == "new",
                # Noise doesn't ping; it waits in its own collapsed group
                Feedback.categories.is_(None) | ~Feedback.categories.any("noise"),
            )
        )
    return FeedbackSummary(unread_updates=unread or 0, inbox_new=inbox_new)


# --- Admin ---


@admin_router.get("", response_model=list[AdminFeedback])
async def list_feedback(admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db)):
    rows = await db.execute(
        select(Feedback, User).join(User, Feedback.user_id == User.id).order_by(Feedback.created_at.desc())
    )
    return [_to_admin(fb, author, admin) for fb, author in rows.all()]


@admin_router.post("/mark-seen", status_code=status.HTTP_204_NO_CONTENT)
async def mark_seen(admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db)):
    """Opening the inbox marks new notes as seen. The learner's view doesn't change."""
    await db.execute(update(Feedback).where(Feedback.status == "new").values(status="seen"))
    await db.commit()


async def _get_or_404(db: AsyncSession, feedback_id: uuid.UUID) -> tuple[Feedback, User]:
    row = (
        await db.execute(
            select(Feedback, User).join(User, Feedback.user_id == User.id).where(Feedback.id == feedback_id)
        )
    ).first()
    if row is None:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return row[0], row[1]


@admin_router.patch("/{feedback_id}", response_model=AdminFeedback)
async def update_feedback(
    feedback_id: uuid.UUID,
    body: AdminFeedbackUpdate,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    fb, author = await _get_or_404(db, feedback_id)
    before = (learner_status(fb.status), fb.reply)

    if body.status is not None:
        fb.status = body.status
    if body.categories is not None:
        fb.categories = list(dict.fromkeys(body.categories))
        fb.category_by_admin = True
    if body.pressing is not None:
        fb.pressing = body.pressing
        fb.category_by_admin = True
    if body.reply is not None:
        fb.reply = body.reply.strip() or None

    # The learner gets a dot when what they can see changed
    if (learner_status(fb.status), fb.reply) != before:
        fb.learner_unread = True

    await db.commit()
    await db.refresh(fb)
    return _to_admin(fb, author, admin)


@admin_router.post("/{feedback_id}/draft-reply", response_model=DraftReply)
async def draft_reply(
    feedback_id: uuid.UUID,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    fb, _ = await _get_or_404(db, feedback_id)
    text = await feedback_ai.draft_reply(fb.text, fb.quote, fb.context, fb.status, fb.verdict)
    if text is None:
        raise HTTPException(status_code=503, detail="AI is not available")
    return DraftReply(reply=text)


@admin_router.post("/{feedback_id}/retriage", response_model=AdminFeedback)
async def retriage(
    feedback_id: uuid.UUID,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Sort a note again (e.g. one the AI missed). Categories picked by hand are kept."""
    await run_triage(feedback_id)
    fb, author = await _get_or_404(db, feedback_id)
    await db.refresh(fb)
    return _to_admin(fb, author, admin)


@admin_router.delete("/{feedback_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_feedback(
    feedback_id: uuid.UUID,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Deletes a note for good, from the inbox and from the learner's own list."""
    result = await db.execute(delete(Feedback).where(Feedback.id == feedback_id))
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Feedback not found")
    await db.commit()
