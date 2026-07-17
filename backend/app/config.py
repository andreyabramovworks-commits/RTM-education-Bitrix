from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "development"
    app_version: str = "dev"
    database_url: str = "sqlite:///./rtm.db"
    bitrix_portal_host: str = "rtm-group.bitrix24.ru"
    session_cookie_name: str = "rtm_session"
    session_ttl_seconds: int = 43200

    model_config = SettingsConfigDict(case_sensitive=False)


@lru_cache
def get_settings() -> Settings:
    return Settings()
