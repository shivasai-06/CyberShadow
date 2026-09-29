# CyberShadow

AI-powered Digital Attack Simulation Twin.

## Project Overview
CyberShadow creates a fictional digital twin and safely simulates cybersecurity attack scenarios against that twin. 

**Safety Principle:** CyberShadow uses fictional digital identities and simulated attack scenarios. It does not attack, scan, exploit, or access real systems.

## Core Concept
The simulation always uses fictional/sandboxed data. The core simulation engine determines simulation outcomes using deterministic rules. AI explains simulation results and provides recommendations, but does NOT directly execute attacks or determine real-world attack outcomes.

## Core Simulation Loop
Digital Twin
→ Simulate Attack
→ Identify Weakness
→ Change Security Control
→ Simulate Again
→ Compare Before vs After

## Technology Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Python, FastAPI
- **Database/Auth:** Supabase

## Architecture
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

## Current Development Phase
Phase 1: Project Foundation (Frontend, Backend, Database structure, API setup).

## Planned Features
- Digital Twin definitions
- Scenario Simulation Engine
- AI Reasoning and Recommendations
- Counterfactual runs
- Reporting Dashboard
