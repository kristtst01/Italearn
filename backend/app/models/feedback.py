import uuid
from datetime import datetime

from sqlalchemy import Boolean, ForeignKey, Index, String, Text
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.database import Base

# Categories the AI (or the admin) sorts feedback into
CATEGORIES = (
    "italian_content",
    "english_wording",
    "vocabulary",
    "unclear_explanation",
    "taught_too_early",
    "difficulty",
    "missing_content",
    "answer_not_accepted",
    "ai_judgement",
    "bug",
    "progress_account",
    "review_scheduling",
    "audio",
    "design",
    "performance",
    "question",
    "idea",
    "praise",
    "other",
    "noise",
)

# Admin-side statuses. Learners see a simpler mapping (see schemas/feedback.py).
STATUSES = ("new", "seen", "in_progress", "will_fix", "fixed", "wont_fix")


class Feedback(Base):
    __tablename__ = "feedback"
    __table_args__ = (
        Index("ix_feedback_user", "user_id", "created_at"),
        Index("ix_feedback_status", "status"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    text: Mapped[str] = mapped_column(Text, nullable=False)
    quote: Mapped[str | None] = mapped_column(Text)
    # Where it was sent from: page kind, path, lesson/exercise/grammar ids and names,
    # a snapshot of the exercise, the heading a quote sits under
    context: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)

    # What the learner picked themselves (optional, any number). The AI keeps these and may add more.
    learner_categories: Mapped[list[str]] = mapped_column(ARRAY(String(40)), nullable=False, default=list)
    # A note can be several things at once. None: not sorted yet (the AI is working, or failed).
    # Filled in by the AI triage after sending; the admin can override categories/pressing
    categories: Mapped[list[str] | None] = mapped_column(ARRAY(String(40)))
    category_by_admin: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    summary: Mapped[str | None] = mapped_column(String(200))
    pressing: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    verdict: Mapped[str | None] = mapped_column(Text)
    triaged_at: Mapped[datetime | None] = mapped_column()

    status: Mapped[str] = mapped_column(String(20), nullable=False, default="new")
    reply: Mapped[str | None] = mapped_column(Text)
    # Set when the learner's view of this note changed (status or reply), cleared when they look
    learner_unread: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    # The learner removed it from their list. It stays in the admin inbox.
    hidden_by_learner: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())
