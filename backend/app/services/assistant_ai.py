import logging
from app.schemas.ai import AssistantRequest, AssistantResponse, AssistantMessage
from app.services.gemini_service import generate_assistant_response

logger = logging.getLogger(__name__)

ASSISTANT_UNSAFE_KEYWORDS = [
    "exploit instructions", "reverse shell", "credential theft",
    "phishing kit", "metasploit", "sqlmap", "hack into", "real credentials"
]

def is_safe_assistant_request(text: str) -> bool:
    text_lower = text.lower()
    for kw in ASSISTANT_UNSAFE_KEYWORDS:
        if kw in text_lower:
            return False
    return True

ASSISTANT_SYSTEM_INSTRUCTION = """You are the CyberShadow AI Security Analyst — the built-in defensive security analyst inside CyberShadow, and also a general-purpose AI assistant.

PURPOSE:
You have two modes:
1. CyberShadow Analysis: When the user asks about their simulations, security posture, or digital twin environment, explain what happened, why, and what to do next — grounded in the actual CyberShadow data provided.
2. General Assistant: When the user asks general educational questions (including cybersecurity, programming, science, writing, brainstorming, or everyday topics), answer them using your broad knowledge. Do not claim data is unavailable if you can answer it generally.

GROUNDING & CONTEXT:
You receive structured CyberShadow context containing some or all of: the Digital Twin configuration, security controls, the latest simulation, recent simulation history, security findings, severity breakdown, remediation status, effectiveness comparisons, and learning progress.
When a question concerns a user's simulation, security findings, or digital twin, use this supplied context and NEVER invent missing user-specific data.

AUTHORITY:
CyberShadow's deterministic simulation analysis is authoritative. If the context says an attack succeeded, it succeeded. If a defense was disabled, it was disabled. You explain the results — you never override, contradict, or reinterpret deterministic outcomes.

SAFETY:
CyberShadow is a simulation-only platform using synthetic, fictional data. Never provide instructions for real-world attacks, actionable exploitation, credential theft, phishing deployment, malware execution, evasion, persistence, destructive actions, or unauthorized access. You may explain the corresponding defensive simulation concepts or answer benign educational questions about cybersecurity within a safe scope.

NO FABRICATION:
Never invent findings, attack paths, vulnerabilities, assets, controls, simulation outcomes, or historical events for the user's specific CyberShadow environment. If they ask about their environment and the data is missing, state that it is unavailable.

FOLLOW-UP:
Use the conversation history to resolve references like "that finding", "this attack", "the previous simulation", "that control", "what changed?", "why?", "what happens if...", or "explain this". Maintain conversational continuity without losing CyberShadow context.

COMMUNICATION:
Be concise, technically accurate, and useful. Adapt explanation depth to the user's question — short direct answers for simple questions, structured analysis when the question calls for it. Avoid generic cybersecurity advice when the actual CyberShadow context provides a more specific answer.
"""


def _build_context_block(request: AssistantRequest) -> str:
    """Serialize the CyberShadow context into a compact text block for the system prompt."""
    try:
        context_json = request.context.model_dump_json(exclude_none=True)
        return f"\n\nCURRENT CYBERSHADOW STATE:\n{context_json}"
    except Exception:
        return "\n\nCURRENT CYBERSHADOW STATE:\n{}"


def _build_conversation_history(messages: list[AssistantMessage]) -> list[dict]:
    """Convert AssistantMessage list to Gemini multi-turn content format.
    
    Maps 'user' role to 'user' and 'assistant' role to 'model' as expected
    by the Gemini API. Only includes messages prior to the current one.
    """
    history = []
    for msg in messages[:-1]:  # Exclude the latest message (handled separately)
        gemini_role = "user" if msg.role == "user" else "model"
        history.append({
            "role": gemini_role,
            "parts": [msg.content],
        })
    return history


def run_assistant(request: AssistantRequest) -> AssistantResponse:
    if not request.messages:
        return AssistantResponse(success=False, error="No messages provided.")

    current_message = request.messages[-1].content

    # Safety guardrail (purpose-appropriate)
    if not is_safe_assistant_request(current_message):
        return AssistantResponse(
            success=False,
            error="I cannot fulfill this request. Please avoid requests for actionable real-world exploitation."
        )

    # Build system instruction with current CyberShadow context appended
    system_with_context = ASSISTANT_SYSTEM_INSTRUCTION + _build_context_block(request)

    # Build multi-turn conversation history
    conversation_history = _build_conversation_history(request.messages)

    try:
        response_text = generate_assistant_response(
            system_instruction=system_with_context,
            conversation_history=conversation_history,
            current_message=current_message,
        )
        clean_response = response_text.strip()

        return AssistantResponse(
            success=True,
            message=AssistantMessage(role="assistant", content=clean_response),
        )
    except ValueError:
        return AssistantResponse(
            success=False,
            error="AI Assistant is not configured. Please set the GEMINI_API_KEY in the backend environment."
        )
    except RuntimeError:
        return AssistantResponse(
            success=False,
            error="AI Assistant is temporarily unavailable. Your CyberShadow simulation data remains available."
        )
    except Exception as e:
        logger.error(f"Assistant error: {str(e)}")
        return AssistantResponse(
            success=False,
            error="AI Assistant is temporarily unavailable. Your CyberShadow simulation data remains available."
        )
