"""AI help with feedback: sorting each note (Haiku), checking Italian claims and drafting
replies (Sonnet). The AI only sorts and suggests; nothing is hidden, deleted or sent on its own."""

import asyncio
import json
import logging

import anthropic

from app.models.feedback import CATEGORIES
from app.services.llm import _get_client, _parse_llm_json, is_configured, response_text

logger = logging.getLogger(__name__)

TRIAGE_MODEL = "claude-haiku-5-5"
# Judging whether a learner's claim about Italian is right, and writing to learners, needs the
# stronger model: the maintainer can't check the Italian, so a wrong verdict would slip through
VERDICT_MODEL = "claude-sonnet-5-5"

# Categories whose notes make a claim about the Italian, so they get a verdict
VERDICT_CATEGORIES = {
    "italian_content",
    "vocabulary",
    "answer_not_accepted",
    "ai_judgement",
    "unclear_explanation",
    "question",
}

TRIAGE_SYSTEM_PROMPT = """\
You sort feedback that learners send from ItaLearn, an app for learning Italian (A1 level).

You get the learner's note, an optional passage they quoted, and where they were in the app \
(lesson, exercise, grammar unit), sometimes with the exercise's data.

Choose every category that fits (usually one, sometimes two or three). They are grouped by what \
the maintainer has to do about them.

Content (fix a lesson or grammar unit):
- "italian_content": the Italian may be wrong (spelling, grammar, article, accent, unnatural phrasing)
- "english_wording": the English may be wrong or odd (a translation, a meaning, an instruction)
- "vocabulary": about a word: its meaning, a missing meaning, a word missing from the word list
- "unclear_explanation": an explanation, instruction or exercise is confusing or missing something
- "taught_too_early": a word or rule is used before the course has taught it
- "difficulty": too hard or too easy, too fast or too slow, too much or too little practice
- "missing_content": the learner wants more of something (more exercises, a topic, more examples)

Answer checking (fix accepted answers or the AI checker):
- "answer_not_accepted": a right answer was marked wrong, or the learner thinks so
- "ai_judgement": the automatic checking or the AI's writing feedback said something wrong or \
unhelpful (accepted a wrong answer, a wrong explanation, harsh or confusing feedback)

App (fix the code):
- "bug": the app misbehaves (crash, button does nothing, page doesn't load, wrong counter)
- "progress_account": progress, streaks, stamps or review cards lost or wrong; signing in, the account
- "review_scheduling": the review of words: too many or too few cards, cards repeating, timing
- "audio": pronunciation, listening, read-aloud or speech recognition
- "design": how it looks or feels to use (hard to read, cramped, awkward on a phone), when \
nothing is actually broken
- "performance": slow, laggy, long loading

Talk to the learner:
- "question": the learner asks something that needs an answer (often about the Italian)
- "idea": a suggestion or feature request
- "praise": the learner says what they like
- "other": anything else that is real feedback
- "noise": empty, gibberish, a test message, or sent by accident. Use it alone, never with others.

Set "pressing" to true only for the most urgent items: a likely bug that blocks or breaks learning, \
lost progress or a sign-in problem, or a likely real error in the Italian content that would teach \
something wrong. Most notes are not pressing.

Write "summary" as a short title for the admin, at most 70 characters, in plain English, no \
em-dashes. Name the specific word or feature when there is one.

Respond with ONLY a JSON object (no markdown, no extra text):
{"categories": ["..."], "pressing": true/false, "summary": "..."}\
"""

VERDICT_SYSTEM_PROMPT = """\
You help the maintainer of ItaLearn, an Italian course for English speakers (A1 level), check \
learner feedback about the Italian. The maintainer does not speak Italian, so be accurate and \
honest about uncertainty.

You get the learner's note, an optional quoted passage, and the content they were looking at \
(often the exercise's prompt, accepted answers and context).

Decide whether the learner has found a real problem. Start your answer with exactly one of:
- "Likely a real mistake:" when the content is wrong or should accept the learner's answer
- "Likely fine as it is:" when the content is correct and the learner misunderstood
- "Unsure:" when it depends on details you can't see, or usage varies

Then explain in one or two short sentences, naming the rule (for example "lo is used before z"). \
If accepting another answer would be reasonable, say so. Write plain, simple English with no \
em-dashes. Answer with the text only.\
"""

REPLY_SYSTEM_PROMPT = """\
You draft a short reply from the ItaLearn team to a learner who sent feedback. The maintainer will \
read and edit it before it is sent.

You get the learner's note, where it was sent from, the status the maintainer chose, and sometimes \
a check of the Italian. Write two or three sentences: thank them briefly, say what happens (fixed, \
being looked into, or why it stays as it is), and if the Italian is correct, explain the rule \
simply. Be friendly and plain. No em-dashes, no "not X, but Y" phrasing, no sign-off. Answer with \
the text only.\
"""


def _describe(text: str, quote: str | None, context: dict) -> str:
    parts = [f"Learner's note: {text}"]
    if quote:
        parts.append(f"Quoted passage: {quote}")
    parts.append(f"Where: {json.dumps(context, ensure_ascii=False)}")
    return "\n".join(parts)


async def _create(model: str, system: str, user_message: str, max_tokens: int, effort: str) -> str | None:
    # max_tokens is generous because these models think before answering
    client = _get_client()
    try:
        response = await asyncio.to_thread(
            client.messages.create,
            model=model,
            max_tokens=max_tokens,
            output_config={"effort": effort},
            system=system,
            messages=[{"role": "user", "content": user_message}],
        )
    except anthropic.APIError as e:
        logger.error("[feedback-ai] API error (%s): %s", model, e)
        return None
    return response_text(response)


async def triage(
    text: str, quote: str | None, context: dict, learner_categories: list[str] | None = None
) -> dict | None:
    """Sort a note: categories, pressing, summary, and a verdict for claims about the Italian.
    Returns None when the AI isn't configured or fails; the note then stays unsorted."""
    if not is_configured():
        return None

    message = _describe(text, quote, context)
    if learner_categories:
        message += f"\nThe learner filed it as: {', '.join(learner_categories)}"
    raw = await _create(TRIAGE_MODEL, TRIAGE_SYSTEM_PROMPT, message, 2000, "low")
    result = _parse_llm_json(raw, "feedback triage") if raw else None
    if not result:
        return None

    raw_categories = result.get("categories")
    if not isinstance(raw_categories, list):
        raw_categories = [raw_categories]
    categories = [c for c in dict.fromkeys(raw_categories) if c in CATEGORIES] or ["other"]
    if "noise" in categories and len(categories) > 1:
        categories.remove("noise")
    out = {
        "categories": categories,
        "pressing": bool(result.get("pressing")) and categories != ["noise"],
        "summary": str(result.get("summary", ""))[:200] or None,
        "verdict": None,
    }
    if VERDICT_CATEGORIES & {*categories, *(learner_categories or [])}:
        out["verdict"] = await _create(VERDICT_MODEL, VERDICT_SYSTEM_PROMPT, message, 8000, "high")
    return out


async def draft_reply(
    text: str, quote: str | None, context: dict, status: str, verdict: str | None
) -> str | None:
    if not is_configured():
        return None
    message = _describe(text, quote, context) + f"\nStatus chosen by the maintainer: {status}"
    if verdict:
        message += f"\nCheck of the Italian: {verdict}"
    return await _create(VERDICT_MODEL, REPLY_SYSTEM_PROMPT, message, 4000, "medium")
