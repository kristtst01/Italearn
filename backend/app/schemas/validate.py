from pydantic import BaseModel, Field

MAX_CHARS = 5000


class ValidateRequest(BaseModel):
    exercise_type: str = Field(..., max_length=100)
    prompt: str = Field(..., max_length=MAX_CHARS)
    sentence_context: str | None = Field(default=None, max_length=MAX_CHARS)
    expected_answers: list[str] = Field(..., max_length=10)
    user_answer: str = Field(..., max_length=MAX_CHARS)


class ValidateResponse(BaseModel):
    accepted: bool
    reason: str
    cached: bool


class GradeFreeResponseRequest(BaseModel):
    prompt: str = Field(..., max_length=MAX_CHARS)
    correct_answer: str = Field(..., max_length=MAX_CHARS)
    user_answer: str = Field(..., max_length=MAX_CHARS)
    curriculum_context: str = Field(..., max_length=MAX_CHARS)


class GradeFreeResponseResponse(BaseModel):
    accepted: bool
    feedback: str
