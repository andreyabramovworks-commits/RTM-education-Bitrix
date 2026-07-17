# Production deployment

Сервер хранит только production checkout в `/opt/rtm-app`. Сервис `rtm-deploy` раз в минуту проверяет ветку `main`, выполняет fast-forward, сборку образов, запуск контейнеров и readiness-проверку.

Полезные команды на сервере:

```bash
sudo systemctl status rtm-deploy.timer
sudo systemctl start rtm-deploy.service
sudo journalctl -u rtm-deploy.service -n 100 --no-pager
cd /opt/rtm-app && docker compose ps
cd /opt/rtm-app && docker compose logs --tail=100 backend
```

Секреты находятся только в `/opt/rtm-app/.env` с правами `600` и не попадают в Git.

Первичная настройка выполняется `bootstrap-server.sh`. Отключать root/password SSH через `harden-ssh.sh` можно только после успешной проверки входа отдельным пользователем `rtmadmin` по ключу.
