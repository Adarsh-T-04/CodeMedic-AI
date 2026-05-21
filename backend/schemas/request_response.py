"""
Pydantic models for request/response validation.
Ensures clean, predictable data contracts across the API.
"""

from pydantic import BaseModel, Field
from typing import Optional


class AnalyzeRequest(BaseModel):
    """Incoming code analysis request."""

    code: str = Field(
        ...,
        min_length=1,
        max_length=50_000,
        description="Source code to analyze",
    )
    language: str = Field(
        default="python",
        description="Programming language of the submitted code",
    )


class BugDetail(BaseModel):
    """Individual bug found during analysis."""

    line: Optional[int] = Field(None, description="Line number of the bug")
    issue: str = Field(..., description="Description of the bug")
    severity: str = Field(
        ..., description="Severity level: low, medium, or high"
    )


class AIAnalysis(BaseModel):
    """Structured response from the AI service."""

    bugs: list[BugDetail] = Field(default_factory=list)
    explanation: str = Field(default="")
    fixed_code: str = Field(default="")
    quality_score: int = Field(default=50, ge=0, le=100)


class ExecutionOutput(BaseModel):
    """Output from running code."""

    output: str = Field(default="")
    error: str = Field(default="")


class AnalyzeResponse(BaseModel):
    """Final API response returned to the client."""

    bugs: list[BugDetail] = Field(
        default_factory=list, description="List of detected bugs"
    )
    explanation: str = Field(default="", description="AI explanation of issues")
    fixed_code: str = Field(default="", description="Corrected source code")
    quality_score: int = Field(
        default=50, ge=0, le=100, description="Code quality score 0-100"
    )
    original_output: ExecutionOutput = Field(
        default_factory=ExecutionOutput,
        description="Output from running the original code",
    )
    fixed_output: ExecutionOutput = Field(
        default_factory=ExecutionOutput,
        description="Output from running the fixed code",
    )


class ErrorResponse(BaseModel):
    """Standard error envelope."""

    detail: str
