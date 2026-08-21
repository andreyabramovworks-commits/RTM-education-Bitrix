# Вклад в RTM Education Bitrix

Репозиторий содержит production-приложение с проприетарной лицензией. Перед началом работы согласуйте изменение с владельцем проекта и ознакомьтесь с [`AGENTS.md`](AGENTS.md), [`README.md`](README.md) и [`LICENSE`](LICENSE).

## Рабочий процесс

1. Создайте ветку от актуального `main`.
2. Не добавляйте секреты, `.env`, дампы, резервные копии и production-данные.
3. Изменения PostgreSQL оформляйте Alembic-миграцией.
4. Сохраняйте совместимость современного React-host и legacy-runtime.
5. Обновляйте `VERSIONS.md`, если меняется пользовательское поведение или версия релиза.
6. Выполните проверки и приложите их результат к pull request.

```bash
cd frontend
pnpm install --frozen-lockfile
pnpm test
pnpm build

cd ../backend
python -m pip install -r requirements.txt
pytest
```

Production развёртывается только из `main`. Не редактируйте исходный код непосредственно на сервере.
