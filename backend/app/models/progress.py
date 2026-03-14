import uuid
from datetime import datetime

from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.database import Base


class UserProgress(Base):
    __tablename__ = "user_progress"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    current_section: Mapped[str] = mapped_column(String(50), default="a1-basics")
    current_unit: Mapped[str] = mapped_column(String(50), default="")
    current_lesson: Mapped[str] = mapped_column(String(50), default="")
    xp: Mapped[int] = mapped_column(default=0)
    streak: Mapped[int] = mapped_column(default=0)
    level: Mapped[int] = mapped_column(default=1)
    lessons_completed: Mapped[dict] = mapped_column(JSONB, default=list)
    checkpoints_passed: Mapped[dict] = mapped_column(JSONB, default=list)
    lesson_scores: Mapped[dict] = mapped_column(JSONB, default=dict)
    badges: Mapped[dict] = mapped_column(JSONB, default=list)
    streak_dates: Mapped[dict] = mapped_column(JSONB, default=list)
    daily_activity: Mapped[dict] = mapped_column(JSONB, default=dict)
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())
