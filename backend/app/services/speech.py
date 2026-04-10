import logging

from google.cloud import speech
from google.api_core.exceptions import GoogleAPICallError

from app.config import settings

logger = logging.getLogger(__name__)

_client: speech.SpeechClient | None = None


def is_configured() -> bool:
    return bool(settings.GOOGLE_APPLICATION_CREDENTIALS)


def _get_client() -> speech.SpeechClient:
    global _client
    if _client is None:
        _client = speech.SpeechClient.from_service_account_json(
            settings.GOOGLE_APPLICATION_CREDENTIALS
        )
    return _client


def transcribe(audio_bytes: bytes, expected_text: str | None = None) -> dict:
    client = _get_client()

    logger.info("Transcribing %d bytes via Google Speech-to-Text", len(audio_bytes))

    config = speech.RecognitionConfig(
        language_code="it-IT",
        enable_automatic_punctuation=True,
        audio_channel_count=2,
    )

    if expected_text:
        config.adaptation = speech.SpeechAdaptation(
            phrase_sets=[
                speech.PhraseSet(
                    phrases=[speech.PhraseSet.Phrase(value=expected_text, boost=10.0)]
                )
            ]
        )

    audio = speech.RecognitionAudio(content=audio_bytes)

    try:
        response = client.recognize(config=config, audio=audio)
    except GoogleAPICallError as e:
        logger.error("Google Speech-to-Text API error: %s", e)
        return {"text": "", "language": "it", "language_probability": 0.0, "duration": 0.0}

    text = " ".join(
        result.alternatives[0].transcript.strip()
        for result in response.results
        if result.alternatives
    )

    confidence = 0.0
    if response.results and response.results[0].alternatives:
        confidence = response.results[0].alternatives[0].confidence

    duration = len(audio_bytes) / 32000  # rough estimate

    logger.info("Result: text=%r, confidence=%.3f", text, confidence)

    return {
        "text": text,
        "language": "it",
        "language_probability": round(confidence, 3),
        "duration": round(duration, 2),
    }
