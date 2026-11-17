# Владение экранами RTM Education

| Раздел | Видимый экран | Источник данных и действий | Состояние переноса |
| --- | --- | --- | --- |
| Дашборд | React `DashboardAdmin` | `GET /api/v47/dashboard`; переход в редактор по ID через мост | Старый экран и рендер удалены; нужна проверка переходов в Bitrix24 |
| События | React `EventsAdmin` | `GET /api/v47/events` | Старый экран и рендер удалены; нужна проверка в Bitrix24 |
| Пользователи | React `UsersAdmin` | `GET /api/v47/users`, `GET /api/v47/departments`, `PUT /api/v47/users/{id}/role` | Старый экран и диалоги удалены; нужна проверка ролей в Bitrix24 |
| Видеотека | React `VideoAdmin` и `VideoLibrary` | `/api/v53/videos/*` | React владеет экраном; контракты описаны отдельно |
| Материалы и курсы | Legacy DOM внутри React оболочки | `runtime-core.js`, `learning.js`, `/api/v47/legacy/*`, сцены и черновики | Действующие редакторы, назначения и тесты требуют отдельного переноса |
| База знаний | Legacy DOM внутри React оболочки | `knowledge.js`, `acknowledgements.js`, `/api/knowledge/*`, `/api/v51/*` | Не перенесена |
| Центр проверок | Legacy DOM внутри React оболочки | `learning.js`, `acknowledgements.js`, `/api/v51/*` | Не перенесён |
| Аналитика | React `AnalyticsAdmin` | `/api/v47/legacy/*`, `/api/v47/users`, `/api/v47/departments`; шесть вкладок, фильтры, сортировка, CSV, карточка пользователя | Старый экран и его рендеры удалены; нужна проверка в Bitrix24 |
| Настройки портала | React `SettingsAdmin` | `GET/PUT /api/v47/appearance`; обновление общего оформления через событие `rtm:appearance-updated` | Старый экран и рендер удалены; нужна проверка сохранения в Bitrix24 |
| Инструменты разработчика | Legacy DOM внутри React оболочки | `learning.js`, Excalidraw, `/api/v47/developer-workspace` | Не перенесены |
| Экран ученика | React `LearnerApp` с legacy мостом | Снимок курсов и назначений, материалы, тесты, База знаний | Внешний экран React; часть действий и данных всё ещё принадлежит legacy runtime |

Следующий перенос: Центр проверок и База знаний, затем редакторы материалов и сценарии ученика. Каждый экран удаляется из legacy только после переноса действующих действий, проверок ролей и данных. Локальная сборка и тесты не заменяют проверку в авторизованном Bitrix24.
