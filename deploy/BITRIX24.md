# Bitrix24: phase 0

Configure the existing local Bitrix24 application with:

- application URL: `https://rtmgroupdocs.fvds.ru/bitrix/app`
- installation URL: `https://rtmgroupdocs.fvds.ru/bitrix/install`
- initial permission: users (`user`/`user_brief`)

Phase 0 calls only `app.info` and `user.current` through the Bitrix24 browser
SDK. It does not persist OAuth tokens or application data in Bitrix24. The
embedded diagnostic bar checks FastAPI and PostgreSQL before loading the v046
interface.
