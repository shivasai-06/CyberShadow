import logging
from app.core.config import settings
from google import genai
from google.genai import types

logger = logging.getLogger(__name__)

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

def generate_response(prompt: str) -> str:
    if not settings.GEMINI_API_KEY:
        raise ValueError("AI configuration is missing.")
    
    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
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
    except Exception as e:
        logger.error(f"Gemini API error: {str(e)}")
        raise RuntimeError("Failed to generate AI response due to an internal service error.")
