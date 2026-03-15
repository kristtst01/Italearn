import uuid
from datetime import datetime

from sqlalchemy import Boolean, Index, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.database import Base


class VerdictCache(Base):
    __tablename__ = "verdict_cache"
    __table_args__ = (
        UniqueConstraint("exercise_key", "user_answer"),
        Index("ix_verdict_cache_lookup", "exercise_key", "user_answer"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    exercise_key: Mapped[str] = mapped_column(String(255), nullable=False)
    user_answer: Mapped[str] = mapped_column(String(500), nullable=False)
    accepted: Mapped[bool] = mapped_column(Boolean, nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
