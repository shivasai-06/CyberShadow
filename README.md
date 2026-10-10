# CyberShadow — AI-Powered Digital Attack Simulation Twin

*See how an attack could unfold. Then change the outcome.*

CyberShadow is an interactive cybersecurity learning and analysis platform that uses fictional digital identities and a deterministic simulation engine to demonstrate how security weaknesses can affect a digital environment. Its AI assistant explains simulation results and provides defensive recommendations.

## Problem Statement
Traditional cybersecurity learning can make it difficult to understand how multiple security controls influence an attack scenario. CyberShadow addresses this challenge through interactive, repeatable simulations that help users explore weaknesses and compare defensive outcomes safely.

## Core Simulation Loop
Build Digital Twin → Simulate Attack → Identify Weakness → Change Defense → Simulate Again → Compare Before vs After

## Key Features
- **Digital Twin:** Explore a fictional digital environment and its security controls.
- **Scenario Simulation:** Run predefined cybersecurity scenarios in an isolated simulation.
- **Attack Path Visualization:** Understand how a simulated scenario progresses through events.
- **Security Findings:** Review identified weaknesses and their severity.
- **What-If Analysis:** Compare simulation outcomes under different defensive configurations.
- **AI Security Assistant:** Receive contextual explanations and defensive recommendations.
- **Before-and-After Results:** Evaluate how security-control changes affect simulated outcomes.
- **Reports and Dashboard:** Review simulation results, security insights, and recommendations.
- **Learning and History:** Explore previous activities and security learning insights.

## Technology Stack
| Layer | Technologies |
| --- | --- |
| **Frontend** | React, TypeScript, Vite |
| **Styling** | Tailwind CSS, custom CSS |
| **Backend** | Python, FastAPI |
| **AI** | Gemini API integration |
| **Database and Authentication** | Supabase |
| **Deployment** | Vercel and Render |

## Architecture
- **Digital Twin Layer:** Defines fictional assets and security settings.
- **Scenario Layer:** Provides predefined cybersecurity scenarios.
- **Simulation Engine:** Evaluates scenario outcomes using deterministic rules.
- **Results and Analysis:** Aggregates outcomes, findings, and defensive-control impacts.
- **AI Reasoning:** Explains the generated results and suggests defensive improvements.
- **Dashboard and Reports:** Presents findings, comparisons, and recommendations.

## Safety by Design
CyberShadow is designed for defensive education and simulation.
- Uses fictional identities and synthetic data.
- Does not attack, scan, or exploit real systems.
- Does not access real credentials or execute simulated attacks against real targets.
- Uses deterministic simulation logic to determine scenario outcomes.
- Uses AI to explain simulation results and provide defensive recommendations.
- *Simulation only. No real-system access. No real-world attack execution.*

## Project Links
- **Live Application:** [https://cyber-shadow-eight.vercel.app](https://cyber-shadow-eight.vercel.app/)
- **Backend API:** [https://cybershadow-backend.onrender.com/](https://cybershadow-backend.onrender.com/)
- **Source Code:** [https://github.com/shivasai-06/CyberShadow](https://github.com/shivasai-06/CyberShadow)

## Current Status
CyberShadow has progressed beyond its initial project-foundation phase, with frontend application screens, simulation and analysis engines, results visualization, dashboard components, and AI-assistant integration implemented in the codebase.
The project continues to undergo final integration, testing, and deployment verification. Individual features may depend on configuration and service availability.

## Future Improvements
- Expand scenario coverage and simulation validation.
- Improve the interactive attack-path and digital-twin visualizations.
- Strengthen automated testing and deployment reliability.
- Enhance report export and learning analytics.

*Built as a digital safety and cybersecurity learning project.*
