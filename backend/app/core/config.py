from __future__ import annotations
import os
import logging
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


class Config:
    GEMINI_API_KEY: str | None = os.getenv("GEMINI_API_KEY")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "fallback-dev-secret-change-in-production")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_HOURS: int = int(os.getenv("JWT_EXPIRE_HOURS", 8))
    FIREBASE_PROJECT_ID: str = os.getenv("FIREBASE_PROJECT_ID", "perintis-umkm")

    @property
    def gemini_available(self) -> bool:
        return bool(self.GEMINI_API_KEY)


config = Config()

if not config.gemini_available:
    logger.warning(
        "GEMINI_API_KEY is not set. "
        "AI Validator will fall back to keyword-matching mode. "
        "To enable AI: set GEMINI_API_KEY in your .env file."
    )
