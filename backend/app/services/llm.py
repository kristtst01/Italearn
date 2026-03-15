import json
import logging

import anthropic

from app.config import settings

logger = logging.getLogger(__name__)

_client: anthropic.Anthropic | None = None


def _get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        _client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    return _client


def is_configured() -> bool:
    return bool(settings.ANTHROPIC_API_KEY)


SYSTEM_PROMPT = """\
You are an Italian language learning assistant that judges whether a student's \
answer is an acceptable translation or response.

You will be given:
- The exercise type (e.g. translation, fill_blank, type_answer, cloze, arrange_words)
- The prompt shown to the student
- The sentence context (the full sentence with a blank, if applicable — use this to judge correctness)
- The expected correct answer(s)
- The student's actual answer

Decide whether the student's answer is acceptable. An answer is acceptable if:
- It is a valid Italian translation/response even if it differs from the expected answers
- It uses a synonym or alternative phrasing that conveys the same meaning
- Minor differences in formality (tu/Lei) are acceptable unless the prompt specifies one
- For arrange_words exercises: the student builds a sentence from word cards. \
Dropping subject pronouns (io, tu, lui, lei, noi, voi, loro) is natural Italian \
and should be accepted — unused cards are fine as long as the sentence is grammatically \
correct and conveys the same meaning

An answer is NOT acceptable if:
- It changes the meaning
- It is grammatically incorrect in a way that changes meaning
- It is a different word/phrase entirely

Respond with ONLY a JSON object (no markdown, no extra text):
{"accepted": true/false, "reason": "1 short sentence teaching the student why their answer is or isn't valid"}\
"""


async def judge_answer(
    exercise_type: str,
    prompt: str,
    expected_answers: list[str],
    user_answer: str,
    sentence_context: str | None = None,
) -> dict:
    """Ask Claude Haiku whether the user's answer is acceptable."""
    client = _get_client()

    user_message = (
        f"Exercise type: {exercise_type}\n"
        f"Prompt: {prompt}\n"
        + (f"Sentence context: {sentence_context}\n" if sentence_context else "")
        + f"Expected answer(s): {', '.join(expected_answers)}\n"
        f"Student's answer: {user_answer}"
    )

    logger.info("[llm] Judging answer: %r for prompt: %r", user_answer, prompt)

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=300,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
    )

    raw = response.content[0].text.strip()
    # Strip markdown code fences if Haiku wraps the JSON
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[-1].rsplit("```", 1)[0].strip()
    logger.info("[llm] Raw response: %s", raw)

    try:
        result = json.loads(raw)
        return {
            "accepted": bool(result["accepted"]),
            "reason": str(result["reason"]),
        }
    except (json.JSONDecodeError, KeyError) as e:
        logger.error("[llm] Failed to parse response: %s — raw: %s", e, raw)
        return {
            "accepted": False,
            "reason": "Could not determine validity",
        }
