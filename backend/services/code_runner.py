"""
Code Execution Engine — sandboxed subprocess runner.
Safely executes Python code and captures stdout / stderr.
"""

import asyncio
import logging
import os
import tempfile
from dataclasses import dataclass

logger = logging.getLogger("codemedic.code_runner")

# ── Configuration ────────────────────────────────────────────────────────────
MAX_TIMEOUT_SECONDS: int = int(os.getenv("CODE_RUN_TIMEOUT", "10"))
MAX_OUTPUT_BYTES: int = 50_000  # cap output to ~50 KB


@dataclass(frozen=True)
class ExecutionResult:
    """Holds the result of a code execution attempt."""

    stdout: str
    stderr: str
    timed_out: bool
    return_code: int | None


async def run_python_code(code: str) -> ExecutionResult:
    """
    Execute a Python code snippet in a subprocess with:
      • Timeout protection (prevents infinite loops)
      • Output size cap
      • Temp-file isolation (no eval/exec in this process)
    """
    # Write code to a temp file so the subprocess gets a clean invocation
    tmp_fd, tmp_path = tempfile.mkstemp(suffix=".py", prefix="codemedic_")
    try:
        with os.fdopen(tmp_fd, "w") as f:
            f.write(code)

        logger.info(
            "Executing code  |  timeout=%ds  |  code_length=%d",
            MAX_TIMEOUT_SECONDS,
            len(code),
        )

        proc = await asyncio.create_subprocess_exec(
            "python3",
            tmp_path,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            # Restrict environment to avoid leaking secrets into user code
            env={
                "PATH": os.getenv("PATH", "/usr/bin:/usr/local/bin"),
                "HOME": "/tmp",
                "LANG": "en_US.UTF-8",
            },
        )

        timed_out = False
        try:
            stdout_bytes, stderr_bytes = await asyncio.wait_for(
                proc.communicate(),
                timeout=MAX_TIMEOUT_SECONDS,
            )
        except asyncio.TimeoutError:
            timed_out = True
            proc.kill()
            stdout_bytes, stderr_bytes = b"", b""
            logger.warning("Code execution timed out after %ds", MAX_TIMEOUT_SECONDS)

        stdout = stdout_bytes[:MAX_OUTPUT_BYTES].decode("utf-8", errors="replace")
        stderr = stderr_bytes[:MAX_OUTPUT_BYTES].decode("utf-8", errors="replace")

        if timed_out:
            stderr = (
                f"Execution timed out after {MAX_TIMEOUT_SECONDS} seconds. "
                "Possible infinite loop or long-running operation.\n" + stderr
            )

        return ExecutionResult(
            stdout=stdout.strip(),
            stderr=stderr.strip(),
            timed_out=timed_out,
            return_code=proc.returncode,
        )

    except Exception as exc:
        logger.error("Code execution failed: %s", exc, exc_info=True)
        return ExecutionResult(
            stdout="",
            stderr=f"Execution engine error: {exc}",
            timed_out=False,
            return_code=-1,
        )

    finally:
        # Always clean up the temp file
        try:
            os.unlink(tmp_path)
        except OSError:
            pass
