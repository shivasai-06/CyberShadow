from pydantic import BaseModel
from typing import Optional, Dict, Any, List

class AIRequest(BaseModel):
    message: str

class AIResponse(BaseModel):
    success: bool
    response: str
    error: Optional[str] = None
    source: Optional[str] = 'gemini'

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

class Reasoning(BaseModel):
    situation: Optional[str] = None
    cause: Optional[str] = None
    keyFactor: Optional[str] = None
    securityWeakness: Optional[str] = None
    defenseImpact: Optional[str] = None
    learnerInsight: Optional[str] = None
    nextLearningStep: Optional[str] = None
    learningConcept: Optional[str] = None
    securityConcept: Optional[str] = None
    decisionImpact: Optional[str] = None
    defenseLesson: Optional[str] = None
    commonMistake: Optional[str] = None
    practicalHabit: Optional[str] = None
    focusedPractice: Optional[str] = None
    learnerLevel: Optional[str] = None
    masteryConnection: Optional[str] = None
    mistakePattern: Optional[str] = None
    reinforcementReason: Optional[str] = None
    adaptivePractice: Optional[str] = None

class AgentResponse(BaseModel):
    success: bool
    message: str
    explanation: str
    recommendation: str
    next_action: str
    reasoning: Optional[Reasoning] = None
    error: Optional[str] = None
    source: Optional[str] = 'gemini'

class DashboardAIRequest(BaseModel):
    metrics: Dict[str, Any]
    trend: str
    recentHistory: List[Dict[str, Any]]
    remediations: List[Dict[str, Any]]

class DashboardAIResponse(BaseModel):
    success: bool
    summary: str
    attention: str
    defensiveInsight: str
    nextStep: str
    error: Optional[str] = None

class AssistantMessage(BaseModel):
    role: str
    content: str

class AssistantContext(BaseModel):
    digitalTwin: Optional[Dict[str, Any]] = None
    latestSimulation: Optional[Dict[str, Any]] = None
    recentHistory: Optional[List[Dict[str, Any]]] = None
    securityPosture: Optional[Dict[str, Any]] = None
    remediations: Optional[Dict[str, Any]] = None
    learning: Optional[Dict[str, Any]] = None

class AssistantRequest(BaseModel):
    messages: List[AssistantMessage]
    context: AssistantContext

class AssistantResponse(BaseModel):
    success: bool
    message: Optional[AssistantMessage] = None
    error: Optional[str] = None
