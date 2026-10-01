from fastapi import APIRouter
from app.schemas.ai import AIRequest, AIResponse, AgentRequest, AgentResponse
from app.services.gemini_service import generate_response
from app.services.ai_agent import run_agent

router = APIRouter()

@router.post("/test", response_model=AIResponse)
def test_ai(request: AIRequest):
    try:
        response_text = generate_response(request.message)
        return AIResponse(success=True, response=response_text)
    except ValueError as ve:
        # Configuration error
        return AIResponse(success=False, response="", error="AI service is not configured properly on the backend.")
    except RuntimeError as re:
        # Service error safe string
        return AIResponse(success=False, response="", error=str(re))
    except Exception as e:
        return AIResponse(success=False, response="", error="An unexpected error occurred in the AI service.")

@router.post("/agent", response_model=AgentResponse)
def run_ai_agent(request: AgentRequest):
    return run_agent(request)
