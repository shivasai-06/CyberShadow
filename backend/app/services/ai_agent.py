import json
import logging
from typing import Dict, Any
from app.schemas.ai import AgentRequest, AgentResponse
from app.services.gemini_service import generate_response

logger = logging.getLogger(__name__)

def run_agent(request: AgentRequest) -> AgentResponse:
    try:
        # Build prompt from context
        prompt = "You are the CyberShadow educational reasoning agent.\n\n"
        prompt += "CyberShadow is a fictional cybersecurity learning and simulation environment.\n"
        prompt += "You receive structured simulation and learner context.\n"
        prompt += "Reason only from the supplied context. Do not perform real-world cybersecurity actions.\n"
        prompt += "Do not invent facts. Do not change simulation outcomes. Do not change security controls.\n"
        prompt += "Do not calculate or modify mastery.\n"
        prompt += "Explain relationships between: simulation outcome, learner decisions, security controls, learning skills, and recommended practice.\n"
        prompt += "Return structured educational reasoning.\n\n"
        prompt += f"Task/Message: {request.message}\n\n"
        
        if request.context.currentSimulation:
            prompt += f"SIMULATION CONTEXT:\n{json.dumps(request.context.currentSimulation, indent=2)}\n\n"
        if request.context.learning:
            prompt += f"LEARNING CONTEXT:\n{json.dumps(request.context.learning, indent=2)}\n\n"
        if request.context.recentHistory:
            prompt += f"RECENT HISTORY:\n{json.dumps(request.context.recentHistory, indent=2)}\n\n"
        if request.context.recommendations:
            prompt += f"RECOMMENDATION CONTEXT:\n{json.dumps(request.context.recommendations, indent=2)}\n\n"
        if request.context.learner:
            prompt += f"LEARNER CONTEXT:\n{json.dumps(request.context.learner, indent=2)}\n\n"
        if request.context.currentScenario:
            prompt += f"SCENARIO CONTEXT:\n{json.dumps(request.context.currentScenario, indent=2)}\n\n"
            
        prompt += """
Please respond ONLY with a valid JSON object matching this exact structure, with no markdown formatting or backticks around it.
The AI should answer: "What should this learner understand and practice because of this exact simulation?"
The reasoning process should now follow:
OBSERVE -> what happened?
CONNECT -> which learner decision/control influenced the result?
EXPLAIN -> why did that happen?
IDENTIFY -> what weakness or strength was demonstrated?
LEARN -> what cybersecurity concept should the learner understand?
DEFEND -> what defensive principle matters?
REFLECT -> what common mistake should the learner avoid?
PRACTICE -> what single focused activity should the learner do next?

Adapt explanations to the specific scenario. Focus on educational principles.
Distinguish between COMPROMISED (explain what weakness allowed it) and BLOCKED (explain why defenses worked).
Never provide real exploit instructions.

JSON Structure:
{
  "message": "A brief opening message or observation.",
  "explanation": "Explain why the simulated attack succeeded or failed, or explain the core concept.",
  "recommendation": "Suggest what the learner should practice or focus on.",
  "next_action": "A concrete next action they should take.",
  "reasoning": {
    "situation": "OBSERVE: What happened?",
    "cause": "CONNECT: Which decision/control influenced it?",
    "keyFactor": "EXPLAIN: Why did that happen?",
    "securityWeakness": "IDENTIFY: What security weakness or strength does it demonstrate?",
    "defenseImpact": "What is the effect of existing defenses?",
    "learnerInsight": "What should the learner understand?",
    "nextLearningStep": "What should the learner do next?",
    "learningConcept": "LEARN: What cybersecurity concept should the learner understand?",
    "securityConcept": "LEARN: What specific security concept was demonstrated?",
    "decisionImpact": "CONNECT: How did the learner's decision impact the outcome?",
    "defenseLesson": "DEFEND: What defensive principle matters?",
    "commonMistake": "REFLECT: What common mistake should the learner avoid?",
    "practicalHabit": "PRACTICE: What safe defensive habit should be built?",
    "focusedPractice": "PRACTICE: What ONE small safe learning activity should they do?"
  }
}
"""
        
        # Call Gemini service
        raw_response = generate_response(prompt)
        
        # Parse JSON
        try:
            import re
            cleaned_response = raw_response.strip()
            match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', cleaned_response, re.DOTALL)
            if match:
                cleaned_response = match.group(1).strip()
            else:
                if cleaned_response.startswith("```json"):
                    cleaned_response = cleaned_response[7:]
                if cleaned_response.startswith("```"):
                    cleaned_response = cleaned_response[3:]
                if cleaned_response.endswith("```"):
                    cleaned_response = cleaned_response[:-3]
                cleaned_response = cleaned_response.strip()
            
            data = json.loads(cleaned_response)
            
            return AgentResponse(
                success=True,
                message=data.get("message", "Analysis complete."),
                explanation=data.get("explanation", "No detailed explanation provided."),
                recommendation=data.get("recommendation", "Continue practicing."),
                next_action=data.get("next_action", "Review your learning path."),
                reasoning=data.get("reasoning"),
                error=None
            )
        except json.JSONDecodeError:
            logger.warning(f"Failed to parse Gemini response as JSON. Raw response: {raw_response}")
            # Graceful fallback when parsing fails
            return AgentResponse(
                success=False,
                message="I analyzed your simulation.",
                explanation="The system generated an explanation but it couldn't be structured properly.",
                recommendation="Review the scenario details and try again.",
                next_action="Continue practicing.",
                reasoning=None,
                error="Failed to parse JSON response."
            )
            
    except ValueError as ve:
        # Missing config
        return AgentResponse(
            success=False,
            message="",
            explanation="",
            recommendation="",
            next_action="",
            error="AI Agent is not configured properly."
        )
    except Exception as e:
        logger.error(f"AI Agent error: {str(e)}")
        return AgentResponse(
            success=False,
            message="",
            explanation="",
            recommendation="",
            next_action="",
            error="An internal error occurred while running the AI Agent."
        )
