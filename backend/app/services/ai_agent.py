import json
import logging
import re
from typing import Dict, Any
from app.schemas.ai import AgentRequest, AgentResponse, AIAgentContext, Reasoning
from app.services.gemini_service import generate_response

logger = logging.getLogger(__name__)

UNSAFE_KEYWORDS = [
    "exploit instructions", "malware", "payload", "reverse shell",
    "credential theft", "phishing kit", "metasploit", "sqlmap",
    "hack into", "real credentials", "nmap"
]

OFF_TOPIC_KEYWORDS = [
    "politics", "election", "movie", "recipe",
    "ignore previous instructions", "as an ai language model"
]

def generate_fallback_response(context: AIAgentContext, error_message: str) -> AgentResponse:
    scenario = context.currentScenario.get('id', 'unknown') if context.currentScenario else 'unknown'
    outcome = context.currentSimulation.get('outcome', 'unknown') if context.currentSimulation else 'unknown'
    
    explanation = f"The simulated {scenario} scenario completed with a {outcome} outcome."
    if outcome == "COMPROMISED":
        explanation += " The simulation exposed a vulnerability based on the decisions made."
    elif outcome == "BLOCKED":
        explanation += " The active defenses successfully mitigated the simulated threat."
    elif outcome == "RECOVERED":
        explanation += " The active defenses and response allowed recovery from the simulated threat."
        
    # Scenario specific adaptive practice
    category = context.currentScenario.get('category', '').lower() if context.currentScenario else ''
    title = context.currentScenario.get('title', '').lower() if context.currentScenario else ''
    
    adaptive_practice = "Review the scenario documentation to reinforce core concepts."
    if "phishing" in category or "phishing" in title:
        adaptive_practice = "Identify warning signs in a fictional phishing message and practice verifying the sender independently."
    elif "attachment" in category or "attachment" in title or "malware" in category:
        adaptive_practice = "Identify suspicious attachment indicators in a fictional email."
    elif "password" in category or "password" in title or "credential" in category:
        adaptive_practice = "Compare fictional strong and weak password characteristics."
    elif "cloud" in category or "cloud" in title or "exposure" in title:
        adaptive_practice = "Practice selecting appropriate fictional privacy/access settings."
    elif "social" in category or "social engineering" in title:
        adaptive_practice = "Practice verifying a fictional request before sharing information."
    elif "data loss" in category or "backup" in category or "ransomware" in title:
        adaptive_practice = "Practice identifying which backup control would enable recovery."

    # Analyze history for mistake pattern
    mistake_pattern = "No repeated mistake pattern is established yet."
    if context.recentHistory and len(context.recentHistory) >= 2:
        risky_count = 0
        for record in context.recentHistory[:3]:
            for decision in record.get("decisionsMade", []):
                if not decision.get("isProtective", True):
                    risky_count += 1
        if risky_count >= 2:
            mistake_pattern = "Recent history shows multiple risky decisions during simulations."

    reasoning = Reasoning(
        situation=f"The {scenario} simulation resulted in a {outcome} state.",
        cause="The outcome was determined by the combination of active defenses and user decisions.",
        keyFactor="Simulation mechanics and configuration.",
        securityWeakness="Potential vulnerabilities were tested during this exercise.",
        defenseImpact="Defenses influence the simulation outcome deterministically.",
        learnerInsight="Review the decisions made to understand their impact.",
        nextLearningStep="Continue practicing with different scenarios or configurations.",
        learningConcept="Understanding the impact of security controls.",
        securityConcept="General Cybersecurity Principles",
        decisionImpact="Every decision alters the risk profile.",
        defenseLesson="Active defenses are necessary to block threats.",
        commonMistake="Ignoring the context of a simulated scenario.",
        practicalHabit="Review security configurations and logs regularly.",
        focusedPractice="Try the scenario again with different choices to see the alternate outcomes.",
        learnerLevel=f"Assessed level: {context.learner.get('experienceLevel', 'Unknown')}" if context.learner else "Assessed level: Unknown",
        masteryConnection=f"Current mastery: {context.learning.get('overallMastery', 0)}%" if context.learning else "Current mastery: Unknown",
        mistakePattern=mistake_pattern,
        reinforcementReason=f"Recommended for practice: {context.recommendations.get('recommendedNextPractice', 'General practice')}" if context.recommendations else "General practice recommended.",
        adaptivePractice=adaptive_practice
    )
    
    return AgentResponse(
        success=True,
        message="I analyzed your simulation using a safe deterministic fallback.",
        explanation=explanation,
        recommendation="Review the deterministic results.",
        next_action="Continue practicing.",
        reasoning=reasoning,
        error=error_message,
        source="fallback"
    )

def is_safe_and_on_topic(text: str) -> bool:
    text_lower = text.lower()
    for kw in UNSAFE_KEYWORDS:
        if kw in text_lower:
            return False
    for kw in OFF_TOPIC_KEYWORDS:
        if kw in text_lower:
            return False
    return True

def validate_context_consistency(data: dict, context: AIAgentContext) -> bool:
    outcome = context.currentSimulation.get('outcome') if context.currentSimulation else None
    
    raw_str = json.dumps(data).lower()
    
    if outcome == "BLOCKED":
        if "attack succeeded" in raw_str or "was compromised" in raw_str or "were compromised" in raw_str or "is compromised" in raw_str:
            return False
    elif outcome == "COMPROMISED":
        if "was blocked" in raw_str or "were blocked" in raw_str or "successfully blocked" in raw_str or "avoided compromise" in raw_str:
            return False
    elif outcome in ["RECOVERED", "DATA RECOVERED"]:
        if "permanently lost" in raw_str or "data remained lost" in raw_str:
            return False

    defenses = context.currentSimulation.get('defensesActive', []) if context.currentSimulation else []
    defenses_lower = [d.lower() for d in defenses]
    
    if any("mfa" in d and "enabled" in d for d in defenses_lower):
        if "mfa was disabled" in raw_str or "mfa absent" in raw_str:
            return False

    history = context.recentHistory
    if history and len(history) > 0:
        latest = history[0]
        decisions_made = latest.get("decisionsMade", [])
        for d in decisions_made:
            option_id = str(d.get("optionId", "")).lower()
            is_protective = d.get("isProtective", False)
            if option_id:
                if is_protective:
                    if f"{option_id} was a risky decision" in raw_str or f"{option_id} is a risky decision" in raw_str or "risky decision" in raw_str and option_id in raw_str:
                        # Simple check might be too broad if we just do "risky decision in raw_str and option_id in raw_str"
                        pass
                    if f"risky decision" in raw_str and option_id in raw_str and not is_protective:
                        pass
                
                # A lightweight deterministic string match
                if is_protective and (f"{option_id} was risky" in raw_str or f"risky decision: {option_id}" in raw_str):
                    return False
                elif not is_protective and (f"{option_id} was protective" in raw_str or f"protective decision: {option_id}" in raw_str):
                    return False
    
    return True

def normalize_string(val: Any, max_len: int = 300) -> Any:
    if not isinstance(val, str):
        return None
    val = val.strip()
    val = val.strip('"').strip("'")
    if not val:
        return None
    if len(val) > max_len:
        val = val[:max_len-3] + "..."
    return val

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
ADAPT -> how does this relate to their learning pattern?
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
    "focusedPractice": "PRACTICE: What ONE small safe learning activity should they do?",
    "learnerLevel": "ADAPT: Brief description of current level.",
    "masteryConnection": "ADAPT: How this relates to existing mastery.",
    "mistakePattern": "ADAPT: Repeated risky pattern (or state none established).",
    "reinforcementReason": "ADAPT: Why reinforce this concept.",
    "adaptivePractice": "PRACTICE: Short practical learning exercise."
  }
}
"""
        
        # Call Gemini service
        raw_response = generate_response(prompt)
        
        # Guardrail 1: Check safety and off-topic
        if not is_safe_and_on_topic(raw_response):
            return generate_fallback_response(request.context, "AI response was discarded due to safety or off-topic guardrails.")
            
        # Parse JSON
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
            
            # Guardrail 2: Context Consistency
            if not validate_context_consistency(data, request.context):
                return generate_fallback_response(request.context, "AI response contradicted deterministic simulation facts.")
                
            # Guardrail 3: Incomplete Check
            reasoning_data = data.get("reasoning", {})
            if not isinstance(reasoning_data, dict):
                return generate_fallback_response(request.context, "AI reasoning was missing or malformed.")
            
            filled_fields = sum(1 for v in reasoning_data.values() if isinstance(v, str) and len(v.strip()) > 0)
            if filled_fields < 4:
                return generate_fallback_response(request.context, "AI reasoning was too incomplete.")
                
            # Normalize strings and limit length
            normalized_reasoning = {}
            for k, v in reasoning_data.items():
                if v is not None:
                    normalized_reasoning[k] = normalize_string(v)
            
            return AgentResponse(
                success=True,
                message=normalize_string(data.get("message", "Analysis complete."), 500) or "Analysis complete.",
                explanation=normalize_string(data.get("explanation", "No detailed explanation provided."), 1000) or "No detailed explanation provided.",
                recommendation=normalize_string(data.get("recommendation", "Continue practicing."), 500) or "Continue practicing.",
                next_action=normalize_string(data.get("next_action", "Review your learning path."), 200) or "Review your learning path.",
                reasoning=normalized_reasoning,
                error=None,
                source="gemini"
            )
        except json.JSONDecodeError:
            logger.warning("Failed to parse Gemini response as JSON.")
            return generate_fallback_response(request.context, "Failed to parse JSON response.")
            
    except ValueError:
        return generate_fallback_response(request.context, "AI Agent is not configured properly.")
    except RuntimeError as re:
        logger.error(f"Gemini API error: {str(re)}")
        return generate_fallback_response(request.context, "Gemini API error occurred.")
    except Exception as e:
        logger.error(f"AI Agent error: {str(e)}")
        return generate_fallback_response(request.context, "An internal error occurred while running the AI Agent.")
