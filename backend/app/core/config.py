from typing import Any, List, Optional
import json

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "CyberShadow Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Explicitly allow local development and the production frontend.
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://cyber-shadow-eight.vercel.app",
    ]

    # Supports GEMINI_API_KEY and the legacy LLM_API_KEY alias.
    GEMINI_API_KEY: Optional[str] = None
    LLM_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-flash-lite-latest"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, value: Any) -> Any:
        if isinstance(value, str):
            value = value.strip()

            if value.startswith("[") and value.endswith("]"):
                try:
                    return json.loads(value)
                except json.JSONDecodeError:
                    pass

            return [origin.strip() for origin in value.split(",") if origin.strip()]

        return value

    def model_post_init(self, __context: Any) -> None:
        if not self.GEMINI_API_KEY and self.LLM_API_KEY:
            self.GEMINI_API_KEY = self.LLM_API_KEY


settings = Settings()
