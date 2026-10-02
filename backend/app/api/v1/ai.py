from fastapi import APIRouter
from app.schemas.ai import AIRequest, AIResponse, AgentRequest, AgentResponse, DashboardAIRequest, DashboardAIResponse, AssistantRequest, AssistantResponse
from app.services.gemini_service import generate_response
from app.services.ai_agent import run_agent
from app.services.dashboard_ai import analyze_dashboard
from app.services.assistant_ai import run_assistant

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

@router.post("/dashboard", response_model=DashboardAIResponse)
def run_dashboard_ai(request: DashboardAIRequest):
    return analyze_dashboard(request)

@router.post("/assistant", response_model=AssistantResponse)
def run_ai_assistant(request: AssistantRequest):
    return run_assistant(request)
