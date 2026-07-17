# Production deployment

Сервер хранит только production checkout в `/opt/rtm-app`. Сервис `rtm-deploy` раз в минуту проверяет ветку `main`, выполняет fast-forward, сборку образов, запуск контейнеров и readiness-проверку.

Полезные команды на сервере:

```bash
sudo systemctl status rtm-deploy.timer
sudo systemctl status rtm-backup.timer
sudo systemctl start rtm-deploy.service
sudo systemctl start rtm-backup.service
sudo journalctl -u rtm-deploy.service -n 100 --no-pager
cd /opt/rtm-app && docker compose ps
cd /opt/rtm-app && docker compose logs --tail=100 backend
```

Секреты находятся только в `/opt/rtm-app/.env` с правами `600` и не попадают в Git.

PostgreSQL ежедневно сохраняется в `/var/backups/rtm-postgres`; локальные копии хранятся 14 дней. Для защиты от полной потери VDS позже нужно добавить выгрузку копий во внешнее хранилище.

Первичная настройка выполняется `bootstrap-server.sh`. Отключать root/password SSH через `harden-ssh.sh` можно только после успешной проверки входа отдельным пользователем `rtmadmin` по ключу.
