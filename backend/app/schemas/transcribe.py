from pydantic import BaseModel


class TranscribeResponse(BaseModel):
    text: str
    language: str
    language_probability: float
    duration: float
