import os
from pathlib import Path

from dotenv import load_dotenv


PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env")


class Config:
    """Application configuration for the current Flask-based project.

    This keeps local development simple while allowing contributors to override
    sensitive values through environment variables.
    """

    SECRET_KEY = os.getenv("SECRET_KEY", "travelai_dev_secret")

    MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_USER = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
    MYSQL_DB = os.getenv("MYSQL_DB", "travel_ai")

    OPENWEATHER_API_KEY = os.getenv(
        "OPENWEATHER_API_KEY",
        "0a0d90fa7e37ea79903248af2e4e1ef9",
    )
