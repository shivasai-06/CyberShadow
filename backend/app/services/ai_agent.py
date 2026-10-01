import json
import logging
from typing import Dict, Any
from app.schemas.ai import AgentRequest, AgentResponse
from app.services.gemini_service import generate_response

logger = logging.getLogger(__name__)

def run_agent(request: AgentRequest) -> AgentResponse:
    try:
        # Build prompt from context
        prompt = "You are a cybersecurity learning mentor. Analyze the following context and provide guidance.\n\n"
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
Please respond ONLY with a valid JSON object matching this exact structure, with no markdown formatting or backticks around it:
{
  "message": "A brief opening message or observation.",
  "explanation": "Explain why the simulated attack succeeded or failed, or explain the core concept.",
  "recommendation": "Suggest what the learner should practice or focus on.",
  "next_action": "A concrete next action they should take."
}
"""
        
        # Call Gemini service
        raw_response = generate_response(prompt)
        
        # Parse JSON
        try:
            # Clean up potential markdown code blocks returned by Gemini
            cleaned_response = raw_response.strip()
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
                error=None
            )
        except json.JSONDecodeError:
            logger.warning(f"Failed to parse Gemini response as JSON. Raw response: {raw_response}")
            # Graceful fallback when parsing fails
            return AgentResponse(
                success=True,
                message="I analyzed your simulation.",
                explanation="The system generated an explanation but it couldn't be structured properly.",
                recommendation="Review the scenario details and try again.",
                next_action="Continue practicing.",
                error=None
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
