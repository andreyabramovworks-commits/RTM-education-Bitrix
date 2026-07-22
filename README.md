# RTM Education Bitrix

Веб-приложение для обучения и работы с материалами RTM, подготовленное на базе локальной версии RTM Education и интегрируемое с Bitrix24.

Проект объединяет существующий интерфейс обучения с серверным API, PostgreSQL и инфраструктурой для контейнерного запуска и production-развёртывания.

## Назначение

- предоставить единое веб-приложение вместо локального HTML-прототипа;
- сохранить совместимость с накопленными материалами и интерфейсом RTM Education;
- вынести данные, модели и операции синхронизации на сервер;
- подготовить приложение к работе внутри Bitrix24;
- обеспечить воспроизводимый запуск через Docker Compose.

## Текущий статус

Проект находится в активной разработке. Основной пользовательский интерфейс работает через React-оболочку, а legacy-версия сохраняется в `frontend/public/legacy` как совместимый слой и источник существующего функционала.

Интеграция с Bitrix24 реализована поэтапно. Текущий phase 0 проверяет доступность приложения, FastAPI и PostgreSQL, а также получает базовую информацию о пользователе через Bitrix24 Browser SDK. OAuth-токены и данные Bitrix24 на этом этапе не сохраняются.

История версий и изменения по релизам собраны в [`VERSIONS.md`](VERSIONS.md).

## Архитектура

```text
Browser / Bitrix24
        |
      Caddy       HTTPS, статика и /api/*
      /   \\
 React   FastAPI   пользовательский интерфейс и API
          |
      PostgreSQL   данные приложения
```

Основные компоненты:

- `frontend` — React 19 и Vite; оболочка приложения и legacy-интерфейс RTM Education.
- `backend` — FastAPI, SQLModel, бизнес-логика, Bitrix24-интеграция и health-check API.
- `backend/alembic` — версионирование схемы базы данных и миграции.
- `db` — PostgreSQL 17 в отдельном контейнере.
- `caddy` — единая точка входа, HTTPS и маршрутизация запросов к API.
- `deploy` — bootstrap, автоматическое обновление production, резервное копирование и документация Bitrix24.

## Требования

- Docker Engine и Docker Compose;
- Git;
- для frontend-разработки вне контейнеров — Node.js и pnpm 11;
- для production — сервер с Docker и настроенным доменом.

## Локальный запуск

```bash
cp .env.example .env
docker compose up --build -d
docker compose ps
curl http://localhost/api/health
```

После запуска приложение доступно по адресу `http://localhost`, а health-check API — по адресу `http://localhost/api/health`.

Остановить контейнеры:

```bash
docker compose down
```

Данные PostgreSQL хранятся в Docker volume `postgres_data` и сохраняются между перезапусками.

## Переменные окружения

Скопируйте `.env.example` в `.env` и задайте значения для PostgreSQL и production-домена. Файл `.env` не добавляется в Git и должен храниться только на машине или сервере, где запускается приложение.

Ключевые параметры — `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `DOMAIN`, `APP_ENV`, `APP_VERSION` и `BITRIX_PORTAL_HOST`.

## Разработка

Сборка frontend:

```bash
cd frontend
pnpm install
pnpm build
```

Проверка backend:

```bash
cd backend
pytest
```

После изменения SQLModel-моделей создайте и примените миграцию:

```bash
docker compose exec backend alembic revision --autogenerate -m "describe change"
docker compose exec backend alembic upgrade head
```

При запуске backend миграции автоматически доводятся до последней версии через `alembic upgrade head`.

## Production

Подробности находятся в [`deploy/README.md`](deploy/README.md). Production checkout размещается в `/opt/rtm-app`, а таймер `rtm-deploy.timer` регулярно проверяет `origin/main`, обновляет checkout, пересобирает изменившиеся образы и выполняет readiness-проверку.

Резервное копирование PostgreSQL выполняется отдельным таймером. Секреты хранятся в `/opt/rtm-app/.env` с ограниченными правами и не должны попадать в репозиторий.

## Структура репозитория

```text
backend/    FastAPI, модели, миграции и тесты
frontend/   React-приложение и legacy-ресурсы
deploy/     Docker/Caddy, bootstrap, timers и production-документация
compose.yaml локальное и production-описание сервисов
.env.example шаблон конфигурации окружения
VERSIONS.md история версий и изменений
```

## Лицензия и сторонние компоненты

В репозитории присутствуют сторонние frontend-компоненты и legacy-ресурсы. Их уведомления и условия использования находятся в `frontend/public/legacy/THIRD_PARTY_NOTICES.txt`.
