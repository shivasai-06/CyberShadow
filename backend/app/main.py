from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import scenarios, ai
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for CyberShadow - AI-powered Digital Attack Simulation Twin",
    version=settings.VERSION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CyberShadow Backend",
        "version": "1.0.0"
    }

app.include_router(scenarios.router, prefix="/api/v1/scenarios", tags=["Scenarios"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI Foundation"])
