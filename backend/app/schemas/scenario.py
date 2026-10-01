from pydantic import BaseModel
from typing import List

class LearningObjective(BaseModel):
    id: str
    title: str
    description: str

class ScenarioDefensiveControl(BaseModel):
    name: str
    description: str

class ScenarioAsset(BaseModel):
    name: str

class Scenario(BaseModel):
    id: str
    title: str
    category: str
    difficulty: str
    description: str
    attackPath: List[str]
    affectedAssets: List[ScenarioAsset]
    defensiveControls: List[ScenarioDefensiveControl]
    learningObjectives: List[LearningObjective]
    simulationOutcome: str

class ScenarioListResponse(BaseModel):
    success: bool
    scenarios: List[Scenario]
