from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.transcribe import TranscribeResponse
from app.services import speech

router = APIRouter(prefix="/api/v1/ai", tags=["ai"])

MAX_AUDIO_BYTES = 10 * 1024 * 1024  # 10 MB


@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe(
    audio: UploadFile = File(...),
    expected_text: str | None = Form(default=None),
    _user: User = Depends(get_current_user),
):
    data = await audio.read()
    if len(data) > MAX_AUDIO_BYTES:
        raise HTTPException(status_code=413, detail="Audio file too large (max 10 MB)")

    result = speech.transcribe(data, expected_text=expected_text)
    return result
