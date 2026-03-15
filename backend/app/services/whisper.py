import logging
from io import BytesIO

from faster_whisper import WhisperModel

from app.config import settings

logger = logging.getLogger(__name__)

_model: WhisperModel | None = None


def load_model() -> None:
    global _model
    model_size = settings.WHISPER_MODEL
    device = settings.WHISPER_DEVICE
    compute = "int8" if device == "cpu" else "float16"

    logger.info("Loading Whisper model '%s' on %s (%s)...", model_size, device, compute)
    _model = WhisperModel(model_size, device=device, compute_type=compute)
    logger.info("Whisper model loaded.")


def is_loaded() -> bool:
    return _model is not None


def transcribe(audio_bytes: bytes, expected_text: str | None = None) -> dict:
    if _model is None:
        raise RuntimeError("Whisper model not loaded")

    print(f"[whisper] Transcribing {len(audio_bytes)} bytes, expected_text={expected_text!r}")

    segments, info = _model.transcribe(
        BytesIO(audio_bytes),
        language="it",
        initial_prompt=expected_text,
    )

    text = " ".join(seg.text.strip() for seg in segments)

    print(f"[whisper] Result: text={text!r}, duration={info.duration:.2f}, lang_prob={info.language_probability:.3f}")

    return {
        "text": text,
        "language": info.language,
        "language_probability": round(info.language_probability, 3),
        "duration": round(info.duration, 2),
    }
