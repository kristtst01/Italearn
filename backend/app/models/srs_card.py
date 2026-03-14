import uuid
from datetime import datetime

from sqlalchemy import ForeignKey, Index, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.database import Base


class SRSCard(Base):
    __tablename__ = "srs_cards"
    __table_args__ = (
        UniqueConstraint("user_id", "word_id", "skill_type"),
        Index("ix_srs_cards_user_due", "user_id", "due"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    word_id: Mapped[str] = mapped_column(String(100), nullable=False)
    skill_type: Mapped[str] = mapped_column(String(50), nullable=False)
    due: Mapped[datetime] = mapped_column(nullable=False)
    # Full FSRS card state stored as JSON — avoids mapping every FSRS field individually
    card_data: Mapped[dict] = mapped_column(JSONB, nullable=False)
    review_log: Mapped[dict] = mapped_column(JSONB, default=list)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
