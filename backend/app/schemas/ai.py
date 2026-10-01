from pydantic import BaseModel
from typing import Optional, Dict, Any, List

class AIRequest(BaseModel):
    message: str

class AIResponse(BaseModel):
    success: bool
    response: str
    error: Optional[str] = None

class AIAgentContext(BaseModel):
    learner: Optional[Dict[str, Any]] = None
    currentScenario: Optional[Dict[str, Any]] = None
    currentSimulation: Optional[Dict[str, Any]] = None
    learning: Optional[Dict[str, Any]] = None
    recommendations: Optional[Dict[str, Any]] = None
    recentHistory: Optional[List[Dict[str, Any]]] = None

class AgentRequest(BaseModel):
    message: str
    context: AIAgentContext

class AgentResponse(BaseModel):
    success: bool
    message: str
    explanation: str
    recommendation: str
    next_action: str
    error: Optional[str] = None
