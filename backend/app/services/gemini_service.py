import logging
from typing import List
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


def _get_client() -> genai.Client:
    """Create and return a Gemini client. Raises ValueError if API key is missing."""
    if not settings.GEMINI_API_KEY:
        raise ValueError("AI configuration is missing.")
    return genai.Client(api_key=settings.GEMINI_API_KEY)


def generate_response(prompt: str) -> str:
    """Generate a single-turn response. Used by the agent, dashboard, and test endpoints."""
    try:
        client = _get_client()
        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
            ),
        )
        if response.text is None:
            raise RuntimeError("Received empty response from Gemini.")
        return response.text
    except ValueError:
        raise
    except Exception as e:
        error_type = type(e).__name__
        status_code = getattr(e, "code", getattr(e, "status_code", "N/A"))
        logger.error(
            f"Gemini API request failed. "
            f"Type: {error_type} | Status: {status_code} | Message: {str(e)}"
        )
        raise RuntimeError("Failed to generate AI response due to an internal service error.")


def generate_assistant_response(
    system_instruction: str,
    conversation_history: List[dict],
    current_message: str,
) -> str:
    """Generate a multi-turn assistant response using proper conversation structure.

    Uses the Gemini multi-turn content format so the model sees the full
    conversation history with correct role attribution, rather than inlining
    everything into a single flat prompt string.

    Args:
        system_instruction: The system-level instruction for the assistant persona.
        conversation_history: Prior messages as {"role": "user"|"model", "parts": [str]}.
        current_message: The latest user message to respond to.
    """
    try:
        client = _get_client()

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

        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.7,
                top_p=0.9,
            ),
        )
        if response.text is None:
            raise RuntimeError("Received empty response from Gemini.")
        return response.text
    except ValueError:
        raise
    except Exception as e:
        error_type = type(e).__name__
        status_code = getattr(e, "code", getattr(e, "status_code", "N/A"))
        logger.error(
            f"Gemini Assistant API request failed. "
            f"Type: {error_type} | Status: {status_code} | Message: {str(e)}"
        )
        raise RuntimeError("Failed to generate AI assistant response due to an internal service error.")
