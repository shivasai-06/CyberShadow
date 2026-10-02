import json
import logging
import re
from typing import Dict, Any
from app.schemas.ai import DashboardAIRequest, DashboardAIResponse
from app.services.gemini_service import generate_response
from app.services.ai_agent import is_safe_and_on_topic, normalize_string

logger = logging.getLogger(__name__)

def generate_dashboard_fallback(error_message: str) -> DashboardAIResponse:
    return DashboardAIResponse(
        success=False,
        summary="AI intelligence is temporarily unavailable.",
        attention="Deterministic security data remains available below.",
        defensiveInsight="Review the security status and metrics directly.",
        nextStep="Continue using the deterministic dashboard.",
        error=error_message
    )

def analyze_dashboard(request: DashboardAIRequest) -> DashboardAIResponse:
    try:
        prompt = "You are the CyberShadow Dashboard AI Intelligence agent.\n\n"
        prompt += "CyberShadow is a fictional cybersecurity learning and simulation environment.\n"
        prompt += "You receive a snapshot of the current dashboard state.\n"
        prompt += "Reason ONLY from the supplied context. Do not invent facts, findings, controls, or metrics.\n"
        prompt += "Do not generate arbitrary security scores or risk percentages.\n"
        prompt += "Provide a concise, contextual explanation of the current security state.\n\n"
        
        prompt += f"METRICS:\n{json.dumps(request.metrics, indent=2)}\n\n"
        prompt += f"TREND:\n{request.trend}\n\n"
        prompt += f"RECENT HISTORY:\n{json.dumps(request.recentHistory, indent=2)}\n\n"
        prompt += f"REMEDIATION EFFECTIVENESS:\n{json.dumps(request.remediations, indent=2)}\n\n"
        
        prompt += """
Please respond ONLY with a valid JSON object matching this exact structure, with no markdown formatting or backticks around it.
Do not hallucinate data. If data is insufficient, say so.
JSON Structure:
{
  "summary": "What happened recently?",
  "attention": "What security weakness deserves attention?",
  "defensiveInsight": "Which defensive controls matter or did remediation improve outcomes?",
  "nextStep": "What should the user pay attention to next (e.g., run a scenario, enable a control)?"
}
"""
        
        raw_response = generate_response(prompt)
        
        if not is_safe_and_on_topic(raw_response):
            return generate_dashboard_fallback("AI response was discarded due to safety or off-topic guardrails.")
            
        try:
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
            
            return DashboardAIResponse(
                success=True,
                summary=normalize_string(data.get("summary", "No summary provided."), 500) or "No summary provided.",
                attention=normalize_string(data.get("attention", "No attention items."), 500) or "No attention items.",
                defensiveInsight=normalize_string(data.get("defensiveInsight", "No defensive insight."), 500) or "No defensive insight.",
                nextStep=normalize_string(data.get("nextStep", "Review dashboard."), 200) or "Review dashboard.",
                error=None
            )
        except json.JSONDecodeError:
            logger.warning("Failed to parse Gemini response as JSON.")
            return generate_dashboard_fallback("Failed to parse JSON response.")
            
    except ValueError:
        return generate_dashboard_fallback("AI Agent is not configured properly.")
    except Exception as e:
        logger.error(f"AI Dashboard error: {str(e)}")
        return generate_dashboard_fallback("An internal error occurred while running the AI Analysis.")
