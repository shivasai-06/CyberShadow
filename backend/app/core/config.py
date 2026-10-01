from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "CyberShadow Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # BACKEND_CORS_ORIGINS is a JSON-formatted list of origins
    # e.g: '["http://localhost", "http://localhost:5173"]'
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173"]

    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-3.8-flash"
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=True, extra="ignore")

settings = Settings()
