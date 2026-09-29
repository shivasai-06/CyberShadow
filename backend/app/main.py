from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="CyberShadow Backend",
    description="Backend API for CyberShadow - AI-powered Digital Attack Simulation Twin",
    version="1.0.0",
)

# Configure CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, this should be restricted
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
