from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.scenario import Scenario
from app.data.scenarios import MOCK_SCENARIOS_DATA

router = APIRouter()

@router.get("/", response_model=List[Scenario])
def get_scenarios():
    return MOCK_SCENARIOS_DATA

@router.get("/{scenario_id}", response_model=Scenario)
def get_scenario(scenario_id: str):
    for s in MOCK_SCENARIOS_DATA:
        if s["id"] == scenario_id:
            return s
    raise HTTPException(status_code=404, detail="Scenario not found")
