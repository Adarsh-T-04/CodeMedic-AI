"""
AI Service Layer — Groq integration for code analysis.
Uses Groq's OpenAI-compatible API for fast inference.
Handles prompt construction, API calls, and response parsing.
"""

import json
import logging
import os
from typing import Any

from openai import AsyncOpenAI, OpenAIError

from schemas.request_response import AIAnalysis, BugDetail

logger = logging.getLogger("codemedic.ai_service")

_client: AsyncOpenAI | None = None


def _get_client() -> AsyncOpenAI:
    """Lazy-init the Groq async client (OpenAI-compatible)."""
    global _client
    if _client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise RuntimeError(
                "GROQ_API_KEY environment variable is not set. "
                "Export it before starting the server."
            )
        _client = AsyncOpenAI(
            api_key=api_key,
            base_url="https://api.groq.com/openai/v1",
        )
    return _client


SYSTEM_PROMPT = """\
You are CodeMedic AI — an expert code reviewer and debugger.
You receive source code and return a structured JSON analysis.

RULES:
1. Return ONLY valid JSON — no markdown fences, no commentary.
2. Follow the exact schema below.
3. If the code has no bugs, return an empty "bugs" array and a high quality_score.
4. Be precise about line numbers (1-indexed).
5. The "fixed_code" must be runnable and must fix every bug you found.

JSON schema:
{
  "bugs": [
    {
      "line": <int or null>,
      "issue": "<concise description>",
      "severity": "low" | "medium" | "high"
    }
  ],
  "explanation": "<short paragraph explaining the issues>",
  "fixed_code": "<complete corrected source code>",
  "quality_score": <0-100>
}
"""


def _build_user_prompt(code: str, language: str) -> str:
    return f"Language: {language}\n\nCode:\n```{language}\n{code}\n```"


def _parse_ai_response(raw: str) -> AIAnalysis:
    """
    Parse the raw AI response text into an AIAnalysis model.
    Handles common edge-cases: markdown fences, trailing commas, etc.
    """
    text = raw.strip()

    # Strip markdown code fences if the model wraps them anyway
    if text.startswith("```"):
        first_newline = text.index("\n")
        text = text[first_newline + 1 :]
    if text.endswith("```"):
        text = text[: text.rfind("```")]
    text = text.strip()

    try:
        data: dict[str, Any] = json.loads(text)
    except json.JSONDecodeError as exc:
        logger.warning("AI returned invalid JSON — %s", exc)
        return AIAnalysis(
            bugs=[],
            explanation="AI response could not be parsed as JSON.",
            fixed_code="",
            quality_score=50,
        )

    # Normalise bugs list
    bugs: list[BugDetail] = []
    for b in data.get("bugs", []):
        if isinstance(b, dict):
            bugs.append(
                BugDetail(
                    line=b.get("line"),
                    issue=b.get("issue", "Unknown issue"),
                    severity=b.get("severity", "medium"),
                )
            )

    return AIAnalysis(
        bugs=bugs,
        explanation=data.get("explanation", ""),
        fixed_code=data.get("fixed_code", ""),
        quality_score=max(0, min(100, int(data.get("quality_score", 50)))),
    )


async def analyze_code(code: str, language: str = "python") -> AIAnalysis:
    """
    Send code to Groq for analysis and return structured results.
    """
    client = _get_client()

    logger.info(
        "Requesting AI analysis  |  language=%s  |  code_length=%d",
        language,
        len(code),
    )

    try:
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": _build_user_prompt(code, language)},
            ],
            temperature=0,
            max_tokens=4096,
        )

        raw_content = response.choices[0].message.content or ""
        logger.debug("Raw AI response (first 500 chars): %s", raw_content[:500])

        return _parse_ai_response(raw_content)

    except OpenAIError as exc:
        logger.error("Groq API error: %s", exc)
        return AIAnalysis(
            bugs=[],
            explanation=f"Groq API error: {exc}",
            fixed_code=code,
            quality_score=0,
        )
    except Exception as exc:
        logger.error("Unexpected error during AI analysis: %s", exc, exc_info=True)
        return AIAnalysis(
            bugs=[],
            explanation=f"Internal error: {exc}",
            fixed_code=code,
            quality_score=0,
        )
