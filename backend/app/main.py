from fastapi import FastAPI, HTTPException, Request
from sqlalchemy import text

from app.bitrix import bitrix_page
from app.config import get_settings
from app.database import engine
from app.v47 import router as v47_router
from app.knowledge import router as knowledge_router
from app.v51 import router as v51_router

settings = get_settings()

app = FastAPI(
    title="RTM Education API",
    version=settings.app_version,
    docs_url="/docs" if settings.app_env != "production" else None,
    redoc_url=None,
)
app.include_router(v47_router)
app.include_router(knowledge_router)
app.include_router(v51_router)


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
def bitrix_application(request: Request):
    return bitrix_page(launch_params={
        key: value for key in ("rtm_assignment", "rtm_view")
        if (value := request.query_params.get(key))
    })


@app.api_route("/bitrix/install", methods=["GET", "POST"], include_in_schema=False)
def bitrix_installation():
    return bitrix_page(install=True)
