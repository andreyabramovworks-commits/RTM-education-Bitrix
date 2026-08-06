# Project Memory

## Project

- Name: RTM Education for Bitrix24
- Purpose: обучение, база знаний, тестирование и обязательное ознакомление сотрудников.
- Repository: `RTM-education-Bitrix`, production deploys only from `main`.

## Stack

- Frontend: React 19, Vite, functional legacy runtime.
- Backend: FastAPI, SQLModel.
- Database: PostgreSQL with Alembic migrations.
- Infrastructure: Docker Compose, GitHub-driven production deployment.
- External integrations: Bitrix24 and Google Drive through backend APIs.

## Architecture

- Entry points: `frontend/src/main.jsx`, `frontend/src/LegacyReactHost.jsx`.
- Runtime manifest: `frontend/src/legacyRuntime.js` is the only ordered asset manifest.
- Main modules: `runtime-core`, `api`, `learning`, `knowledge`, `acknowledgements`, `canvas`.
- Data flow: browser UI → backend API → PostgreSQL / protected external integration.
- UI/CSS architecture: functional stylesheets only; release-number patch layers are forbidden.

## Commands

- Development: `pnpm --dir frontend dev`
- Frontend tests: `node --test frontend/tests/*.test.mjs`
- Backend tests: `backend/.venv/Scripts/python.exe -m pytest backend/tests`
- Build: `pnpm --dir frontend run build`
- Docker build: `docker compose build`
- Migrations: production pipeline applies Alembic migrations from `main`.

## Rules and Constraints

- Never add `vNNN.js` or `vNNN.css` release patch files.
- Add behavior to the responsible functional module and edit its source style directly.
- One initialization path and one in-flight synchronization are allowed; `LegacyReactHost.jsx` is the sole startup owner and calls init only after every functional module is loaded.
- Commit, push, deploy and release tags require verified changes.
- Do not commit secrets, HAR files, local build verification folders or environment files.

## Important Paths

- `frontend/src/legacyRuntime.js`: canonical runtime order and release metadata.
- `frontend/public/legacy/acknowledgements.js`: editions, assignments, review center and help.
- `frontend/public/legacy/api.js`: Bitrix/backend adapter.
- `backend/app/v51.py`: acknowledgement API and business rules.

## Known Risks

- Functional runtime modules still expose legacy global APIs for compatibility; their load order is contractual.
- Bitrix24 SDK capabilities differ between iframe and fullscreen contexts.

## Last Verified

- Date: 2026-08-06
- Scope: v51.3.1 startup-order fix; frontend tests 12/12, backend tests 22/22, production frontend build passed.
