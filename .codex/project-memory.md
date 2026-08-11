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
- Learner UI owner: `frontend/src/LearnerApp.jsx`; its isolated light-theme design system is `frontend/src/learner.css`.
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
- Learner React code uses `window.__RTM_LEARNER__`; storage, progress and rich material renderers stay behind that bridge.
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

- Date: 2026-08-11
- Scope: v52 learner-shell redesign; desktop 1440×900 and mobile 390×844 visual QA passed, production frontend build passed.
