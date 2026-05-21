"""
/analyze route — orchestrates the full code analysis pipeline.
Steps: AI analysis → run original code → run fixed code → build response.
"""

import logging

from fastapi import APIRouter, HTTPException

from schemas.request_response import (
    AnalyzeRequest,
    AnalyzeResponse,
    ExecutionOutput,
)
from services.ai_service import analyze_code
from services.code_runner import run_python_code

logger = logging.getLogger("codemedic.routes.analyze")

router = APIRouter()


@router.post(
    "/analyze",
    response_model=AnalyzeResponse,
    summary="Analyze code for bugs and quality",
    description="Submit source code for AI-powered bug detection, "
    "explanation, and automatic fixing.",
)
async def analyze(request: AnalyzeRequest) -> AnalyzeResponse:
    """
    Full analysis pipeline:
    1. Send code to AI for bug detection and fixing.
    2. Execute the original code to capture its output.
    3. Execute the AI-fixed code to capture its output.
    4. Return a unified response.
    """

    # ── Step 1: AI Analysis ──────────────────────────────────────────────
    logger.info("Starting analysis  |  language=%s", request.language)

    ai_result = await analyze_code(request.code, request.language)

    # ── Step 2: Execute original code ────────────────────────────────────
    original_output = ExecutionOutput()
    if request.language.lower() == "python":
        orig_run = await run_python_code(request.code)
        original_output = ExecutionOutput(
            output=orig_run.stdout,
            error=orig_run.stderr,
        )
    else:
        original_output = ExecutionOutput(
            output="(execution only supported for Python)"
        )

    # ── Step 3: Execute fixed code ───────────────────────────────────────
    fixed_output = ExecutionOutput()
    fixed_code = ai_result.fixed_code or request.code

    if request.language.lower() == "python" and fixed_code.strip():
        fix_run = await run_python_code(fixed_code)
        fixed_output = ExecutionOutput(
            output=fix_run.stdout,
            error=fix_run.stderr,
        )
    elif request.language.lower() != "python":
        fixed_output = ExecutionOutput(
            output="(execution only supported for Python)"
        )

    # ── Step 4: Build response ───────────────────────────────────────────
    logger.info(
        "Analysis complete  |  bugs=%d  |  quality=%d",
        len(ai_result.bugs),
        ai_result.quality_score,
    )

    return AnalyzeResponse(
        bugs=ai_result.bugs,
        explanation=ai_result.explanation,
        fixed_code=fixed_code,
        quality_score=ai_result.quality_score,
        original_output=original_output,
        fixed_output=fixed_output,
    )
