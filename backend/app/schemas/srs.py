from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel


class SRSCardResponse(BaseModel):
    id: uuid.UUID
    word_id: str
    skill_type: str
    due: datetime
    card_data: dict[str, Any]
    review_log: list[Any]

    model_config = {"from_attributes": True}


class SRSCardCreate(BaseModel):
    word_id: str
    skill_type: str
    due: datetime
    card_data: dict[str, Any]
    review_log: list[Any] = []


class SRSCardReview(BaseModel):
    due: datetime
    card_data: dict[str, Any]
    review_log: list[Any]
