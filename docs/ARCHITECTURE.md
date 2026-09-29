# CyberShadow Architecture

## 1. CyberShadow Purpose
CyberShadow is an AI-powered Digital Attack Simulation Twin. It creates a fictional digital environment and safely simulates cybersecurity attack scenarios against it to identify weaknesses and evaluate security controls.

## 2. Frontend Architecture
- Built with React, TypeScript, and Vite.
- Styled using Tailwind CSS.
- Communicates with the FastAPI backend via REST API.

## 3. Backend Architecture
- Built with Python and FastAPI.
- Exposes RESTful endpoints for the frontend.
- Houses the logic for managing twins, scenarios, and simulations.

## 4. Future Digital Twin Engine
- Will manage the creation and state of fictional environments, including devices, accounts, and security controls.

## 5. Future Simulation Engine
- Will determine simulation outcomes using deterministic rules.
- Responsible for executing `attack_scenarios` against the `digital_twins`.

## 6. Future Counterfactual Engine
- Will allow running parallel simulations with modified parameters (e.g., "what if this patch was applied?") to compare outcomes.

## 7. Future AI Reasoning Layer
- Will interpret and explain simulation results.
- Will provide actionable recommendations.
- **Safety Boundary:** AI interprets results; it does NOT execute attacks or determine real-world attack outcomes.

## 8. Supabase Role
- Will handle Database storage and User Authentication.

## 9. Safety Boundaries
- **Strictly Fictional Data:** All simulations are run against fictional/sandboxed data.
- **No Active Exploitation:** The platform does not scan, exploit, or interact with real-world systems.
- **Deterministic Outcomes:** Attack outcomes are determined by the internal rules engine, not by executing real exploits.

### Core Architecture Flow
Digital Twin
↓
Scenario Engine
↓
Simulation Engine
↓
Simulation Result
↓
AI Reasoning
↓
Explanation / Recommendation / Report
