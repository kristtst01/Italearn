import uuid
from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field

Category = Literal[
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
]
Status = Literal["new", "seen", "in_progress", "will_fix", "fixed", "wont_fix"]
LearnerStatus = Literal["received", "in_progress", "will_fix", "fixed", "wont_fix"]
# What a learner can pick when sending. The other categories are finer sorting by the AI
# (and the admin); noise is only ever the AI's call.
LearnerCategory = Literal[
    "bug", "italian_content", "answer_not_accepted", "unclear_explanation", "idea", "other"
]


def learner_status(status: str) -> LearnerStatus:
    """Learners see five statuses; 'new' and 'seen' are both just 'received' to them."""
    return "received" if status in ("new", "seen") else status  # type: ignore[return-value]


class FeedbackCreate(BaseModel):
    text: str = Field(min_length=1, max_length=5000)
    quote: str | None = Field(default=None, max_length=2000)
    context: dict[str, Any] = {}
    categories: list[LearnerCategory] = Field(default=[], max_length=10)


class MyFeedback(BaseModel):
    """A learner's own note, without the admin-only fields (categories, verdict, ...)."""

    id: uuid.UUID
    text: str
    quote: str | None
    context: dict[str, Any]
    status: LearnerStatus
    learner_categories: list[LearnerCategory]
    reply: str | None
    unread: bool
    created_at: datetime
    updated_at: datetime


class AdminFeedback(BaseModel):
    id: uuid.UUID
    text: str
    quote: str | None
    context: dict[str, Any]
    learner_categories: list[LearnerCategory]
    categories: list[Category] | None
    category_by_admin: bool
    summary: str | None
    pressing: bool
    verdict: str | None
    triaged_at: datetime | None
    status: Status
    reply: str | None
    created_at: datetime
    updated_at: datetime
    user_name: str | None
    user_is_me: bool
    hidden_by_learner: bool


class AdminFeedbackUpdate(BaseModel):
    status: Status | None = None
    categories: list[Category] | None = Field(default=None, min_length=1, max_length=11)
    pressing: bool | None = None
    # An empty string removes the reply
    reply: str | None = Field(default=None, max_length=5000)


class FeedbackSummary(BaseModel):
    """Counts for the dot on Profile."""

    unread_updates: int
    inbox_new: int | None  # None for non-admins


class DraftReply(BaseModel):
    reply: str
