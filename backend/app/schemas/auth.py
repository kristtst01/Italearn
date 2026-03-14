import uuid
from datetime import datetime

from pydantic import BaseModel


class UserResponse(BaseModel):
    id: uuid.UUID
    clerk_id: str
    email: str
    display_name: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    display_name: str | None = None
