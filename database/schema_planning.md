# CyberShadow Database Schema Planning

**Note: This is a planned schema document, not the final implementation. Do NOT create the complete database yet.**

The following entities will form the foundation of the CyberShadow digital twin and simulation environment:

- `users`: Platform users and their roles/permissions.
- `digital_twins`: The simulated fictional environments representing organizations or infrastructures.
- `devices`: Virtual hardware assets within a digital twin.
- `accounts`: Simulated identities and credentials.
- `security_controls`: Defensive measures and configurations applied to the twin.
- `attack_scenarios`: Pre-defined templates of attack sequences to be simulated.
- `scenario_steps`: Individual phases or actions within an attack scenario.
- `simulations`: Instances of an executed attack scenario against a specific digital twin.
- `simulation_steps`: Granular outcomes and events during a simulation run.
- `counterfactual_runs`: Parallel simulation runs to compare "what if" scenarios (e.g., changing a security control).
- `recommendations`: AI-generated actionable advice based on simulation results.
- `reports`: Aggregated summaries and metrics from simulation runs.
