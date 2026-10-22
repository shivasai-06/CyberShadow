import logging
import re
from typing import List, Optional, Tuple
from app.core.config import settings
from google import genai
from google.genai import types

logger = logging.getLogger(__name__)

# System instruction for the general-purpose CyberShadow AI (agent, dashboard, test)
SYSTEM_INSTRUCTION = """You are operating inside CyberShadow, a cybersecurity learning and simulation platform.
Your responsibilities:
- Explain cybersecurity concepts clearly and simply.
- Explain fictional CyberShadow scenarios.
- Teach defensive security concepts.
- Remain educational at all times.
- Treat all CyberShadow simulations as fictional.
- NEVER claim that a simulated event affected a real system.
- NEVER provide instructions for attacking real systems.
- NEVER request passwords, API keys, tokens, or credentials.
- NEVER execute commands or perform real-world cyber actions.
"""

# Typed exceptions for structured error diagnosis
class GeminiServiceError(RuntimeError):
    """Base error for Gemini service operations."""
    def __init__(self, message: str, code: str = "UPSTREAM_ERROR", status_code: Optional[int] = None):
        super().__init__(message)
        self.message = message
        self.code = code
        self.status_code = status_code

class GeminiConfigError(ValueError):
    """Raised when API key or required configuration is missing."""
    def __init__(self, message: str = "AI Assistant is not configured on the backend. Please set GEMINI_API_KEY in the backend environment."):
        super().__init__(message)
        self.message = message
        self.code = "CONFIG_ERROR"
        self.status_code = 500

class GeminiQuotaError(GeminiServiceError):
    """Raised when rate limit or quota is exhausted."""
    def __init__(self, message: str = "AI Assistant quota or rate limit exceeded. Please try again shortly."):
        super().__init__(message, code="QUOTA_EXCEEDED", status_code=429)

class GeminiModelError(GeminiServiceError):
    """Raised when requested model is invalid, deprecated, or unavailable."""
    def __init__(self, message: str = "The configured AI model is unavailable or unsupported. Please check the backend model configuration."):
        super().__init__(message, code="INVALID_MODEL", status_code=404)

class GeminiTimeoutError(GeminiServiceError):
    """Raised when upstream API request times out."""
    def __init__(self, message: str = "AI Assistant request timed out while contacting upstream AI service."):
        super().__init__(message, code="TIMEOUT", status_code=504)

class GeminiUnavailableError(GeminiServiceError):
    """Raised when upstream API is experiencing high demand (503)."""
    def __init__(self, message: str = "AI service is currently experiencing high demand. Please try again in a few moments."):
        super().__init__(message, code="SERVICE_UNAVAILABLE", status_code=503)

# Fallback models in priority order
FALLBACK_MODELS = [
    "gemini-flash-lite-latest",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
]


def get_candidate_models() -> List[str]:
    """Get prioritized list of models to try, starting with configured model followed by stable fallbacks."""
    configured = (settings.GEMINI_MODEL or "").strip()
    models: List[str] = []
    if configured:
        models.append(configured)
    for fb in FALLBACK_MODELS:
        if fb not in models:
            models.append(fb)
    return models


def _get_client() -> genai.Client:
    """Create and return a Gemini client. Raises GeminiConfigError if API key is missing."""
    api_key = settings.GEMINI_API_KEY or settings.LLM_API_KEY
    if not api_key:
        raise GeminiConfigError("AI Assistant is not configured. Please set GEMINI_API_KEY in the backend environment.")
    http_options = (
        types.HttpOptions(timeout=15000)
        if hasattr(types, "HttpOptions")
        else {"timeout": 15.0}
    )
    return genai.Client(
        api_key=api_key,
        http_options=http_options
    )


def _extract_error_details(e: Exception) -> Tuple[str, Optional[int], str]:
    """Extract (error_type, status_code, safe_reason) without logging secrets or private content."""
    error_type = type(e).__name__
    raw_code = getattr(e, "code", getattr(e, "status_code", None))
    status_code: Optional[int] = None
    if isinstance(raw_code, int):
        status_code = raw_code
    elif isinstance(raw_code, str) and raw_code.isdigit():
        status_code = int(raw_code)

    safe_reason = ""
    response_json = getattr(e, "response_json", None)
    if isinstance(response_json, dict) and "error" in response_json:
        err_info = response_json["error"]
        status_str = err_info.get("status", "")
        msg = err_info.get("message", "")
        short_msg = msg.split("\n")[0][:150]
        safe_reason = f"{status_str}: {short_msg}" if status_str else short_msg
    else:
        raw = str(e).split("\n")[0]
        # Redact any accidental credential fragments
        safe_reason = re.sub(
            r'(?:key|token|auth|bearer|secret)[=:\s]+[A-Za-z0-9_\-]+',
            '[REDACTED]',
            raw,
            flags=re.IGNORECASE
        )[:150]

    return error_type, status_code, safe_reason


def _map_exception(e: Exception, error_type: str, status_code: Optional[int], safe_reason: str) -> GeminiServiceError:
    """Map an upstream exception to a typed GeminiServiceError."""
    reason_upper = safe_reason.upper()
    if status_code == 429 or "RESOURCE_EXHAUSTED" in reason_upper or "QUOTA" in reason_upper:
        return GeminiQuotaError()
    if status_code == 503 or "UNAVAILABLE" in reason_upper:
        return GeminiUnavailableError()
    if status_code == 404 or "NOT_FOUND" in reason_upper or "NOT FOUND" in reason_upper:
        return GeminiModelError()
    if status_code == 504 or "DEADLINE_EXCEEDED" in reason_upper or isinstance(e, TimeoutError):
        return GeminiTimeoutError()

    return GeminiServiceError(
        "AI Assistant is temporarily unavailable. Your CyberShadow simulation data remains available.",
        code="UPSTREAM_ERROR",
        status_code=status_code
    )


def generate_response(prompt: str) -> str:
    """Generate a single-turn response with model fallback."""
    client = _get_client()
    candidate_models = get_candidate_models()
    last_mapped_error: Optional[GeminiServiceError] = None

    for idx, model in enumerate(candidate_models):
        try:
            response = client.models.generate_content(
                model=model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_INSTRUCTION,
                ),
            )
            if response.text is None:
                raise GeminiServiceError("Received empty response from Gemini.", code="EMPTY_RESPONSE")
            if idx > 0:
                logger.info("Successfully generated AI response using fallback model: %s", model)
            return response.text
        except (GeminiConfigError, ValueError):
            raise
        except Exception as e:
            error_type, status_code, safe_reason = _extract_error_details(e)
            mapped_err = _map_exception(e, error_type, status_code, safe_reason)
            last_mapped_error = mapped_err

            has_next = idx < len(candidate_models) - 1
            can_fallback = (
                status_code in (404, 429, 503, 504) or
                isinstance(mapped_err, (GeminiUnavailableError, GeminiQuotaError, GeminiModelError, GeminiTimeoutError))
            )
            if has_next and can_fallback:
                next_model = candidate_models[idx + 1]
                logger.warning(
                    "Gemini model '%s' failed (type=%s, status=%s, reason=%s). Trying fallback model '%s'...",
                    model, error_type, status_code, safe_reason, next_model
                )
                continue
            else:
                logger.error(
                    "Gemini request failed: model=%s | type=%s | status=%s | reason=%s",
                    model, error_type, status_code, safe_reason
                )
                break

    if last_mapped_error:
        raise last_mapped_error
    raise GeminiServiceError("Failed to generate AI response due to an internal service error.")


def generate_assistant_response(
    system_instruction: str,
    conversation_history: List[dict],
    current_message: str,
) -> str:
    """Generate a multi-turn assistant response using proper conversation structure with model fallback.

    Args:
        system_instruction: The system-level instruction for the assistant persona.
        conversation_history: Prior messages as {"role": "user"|"model", "parts": [str]}.
        current_message: The latest user message to respond to.
    """
    client = _get_client()
    candidate_models = get_candidate_models()
    last_mapped_error: Optional[GeminiServiceError] = None

    # Build multi-turn contents list
    contents = []
    for msg in conversation_history:
        contents.append(
            types.Content(
                role=msg["role"],
                parts=[types.Part.from_text(text=msg["parts"][0])],
            )
        )

    # Add the current user message
    contents.append(
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=current_message)],
        )
    )

    for idx, model in enumerate(candidate_models):
        try:
            response = client.models.generate_content(
                model=model,
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.7,
                    top_p=0.9,
                ),
            )
            if response.text is None:
                raise GeminiServiceError("Received empty response from Gemini.", code="EMPTY_RESPONSE")
            if idx > 0:
                logger.info("Successfully generated assistant response using fallback model: %s", model)
            return response.text
        except (GeminiConfigError, ValueError):
            raise
        except Exception as e:
            error_type, status_code, safe_reason = _extract_error_details(e)
            mapped_err = _map_exception(e, error_type, status_code, safe_reason)
            last_mapped_error = mapped_err

            has_next = idx < len(candidate_models) - 1
            can_fallback = (
                status_code in (404, 429, 503, 504) or
                isinstance(mapped_err, (GeminiUnavailableError, GeminiQuotaError, GeminiModelError, GeminiTimeoutError))
            )
            if has_next and can_fallback:
                next_model = candidate_models[idx + 1]
                logger.warning(
                    "Gemini Assistant model '%s' failed (type=%s, status=%s, reason=%s). Trying fallback model '%s'...",
                    model, error_type, status_code, safe_reason, next_model
                )
                continue
            else:
                logger.error(
                    "Gemini Assistant API request failed: model=%s | type=%s | status=%s | reason=%s",
                    model, error_type, status_code, safe_reason
                )
                break

    if last_mapped_error:
        raise last_mapped_error
    raise GeminiServiceError("Failed to generate AI assistant response due to an internal service error.")
