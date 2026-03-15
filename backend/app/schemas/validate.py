from pydantic import BaseModel


class ValidateRequest(BaseModel):
    exercise_type: str
    prompt: str
    sentence_context: str | None = None
    expected_answers: list[str]
    user_answer: str


class ValidateResponse(BaseModel):
    accepted: bool
    reason: str
    cached: bool
