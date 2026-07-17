from fastapi import FastAPI, HTTPException
from sqlalchemy import text

from app.bitrix import bitrix_page
from app.config import get_settings
from app.database import engine

settings = get_settings()

app = FastAPI(
    title="RTM Education API",
    version=settings.app_version,
    docs_url="/docs" if settings.app_env != "production" else None,
    redoc_url=None,
)


@app.get("/api/health", tags=["system"])
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "rtm-education-api",
        "version": settings.app_version,
        "environment": settings.app_env,
    }


@app.get("/api/ready", tags=["system"])
def readiness() -> dict[str, str]:
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
    except Exception as exc:
        raise HTTPException(status_code=503, detail="database is unavailable") from exc
    return {"status": "ready", "database": "ok"}


@app.api_route("/bitrix/app", methods=["GET", "POST"], include_in_schema=False)
def bitrix_application():
    return bitrix_page()


@app.api_route("/bitrix/install", methods=["GET", "POST"], include_in_schema=False)
def bitrix_installation():
    return bitrix_page(install=True)
