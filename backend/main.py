"""
CodeMedic AI — Backend Entry Point
Production-ready FastAPI application for AI-powered code debugging.
"""

import os
import sys

# Load .env before anything else touches env vars
from dotenv import load_dotenv

load_dotenv()

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.analyze import router as analyze_router

# ── Logging ──────────────────────────────────────────────────────────────────
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()

logging.basicConfig(
    level=LOG_LEVEL,
    format="%(asctime)s  %(levelname)-8s  [%(name)s]  %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    stream=sys.stdout,
)

logger = logging.getLogger("codemedic")

# ── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="CodeMedic AI",
    description=(
        "AI-powered code debugging platform. "
        "Submit your code, get instant bug reports, explanations, "
        "fixes, and execution results."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ─────────────────────────────────────────────────────────────────────
ALLOWED_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://localhost:5173,http://localhost:8080",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ───────────────────────────────────────────────────────────────────
app.include_router(analyze_router, tags=["Analysis"])


# ── Health Check ─────────────────────────────────────────────────────────────
@app.get("/health", tags=["System"])
async def health_check():
    """Quick liveness probe."""
    return {"status": "healthy", "service": "CodeMedic AI"}


# ── Startup / Shutdown Events ────────────────────────────────────────────────
@app.on_event("startup")
async def on_startup():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        logger.warning(
            "⚠  GROQ_API_KEY is not set — AI analysis will fail. "
            "Export the variable and restart."
        )
    else:
        logger.info("✔  GROQ_API_KEY detected")
    logger.info("🚀  CodeMedic AI backend started")


@app.on_event("shutdown")
async def on_shutdown():
    logger.info("🛑  CodeMedic AI backend shutting down")
