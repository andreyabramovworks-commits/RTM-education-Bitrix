# RTM Education Bitrix

Основа для переноса локального приложения RTM Education v046 в полноценное веб-приложение с React, FastAPI, SQLModel, Alembic и PostgreSQL.

## Состав

- `frontend` — React/Vite-оболочка; текущая v046 сохранена без изменений в `frontend/public/legacy`.
- `backend` — FastAPI API, модели SQLModel и миграции Alembic.
- `db` — PostgreSQL 17 в отдельном контейнере.
- `caddy` — единая точка входа, HTTPS и маршрутизация `/api/*`.
- `deploy` — сценарии bootstrap и автоматического обновления production-сервера.

## Локальный запуск

```bash
cp .env.example .env
docker compose up --build -d
docker compose ps
curl http://localhost/api/health
```

Приложение: `http://localhost`. API: `http://localhost/api/health`. Интерактивная документация FastAPI отключена в production.

## Миграции

При каждом запуске backend автоматически выполняется `alembic upgrade head`.

Создание новой миграции после изменения моделей:

```bash
docker compose exec backend alembic revision --autogenerate -m "describe change"
docker compose exec backend alembic upgrade head
```

## Production

Production-код находится в `/opt/rtm-app`. Таймер `rtm-deploy.timer` проверяет `origin/main`, пересобирает изменившиеся образы и запускает проверки после развертывания. Подробности — в `deploy/README.md`.
