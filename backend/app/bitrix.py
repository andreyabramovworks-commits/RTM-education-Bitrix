from html import escape

from fastapi.responses import HTMLResponse


def bitrix_page(*, install: bool = False) -> HTMLResponse:
    """Return the phase-0 Bitrix24 frame without persisting portal tokens."""
    mode = "install" if install else "app"
    title = "Установка RTM Education" if install else "RTM Education"
    safe_title = escape(title)

    html = f"""<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <title>{safe_title}</title>
  <script src="https://api.bitrix24.com/api/v1/"></script>
  <style>
    :root {{ font-family: Inter, Arial, sans-serif; color: #172033; background: #eef2f6; }}
    * {{ box-sizing: border-box; }}
    html, body {{ width: 100%; height: 100%; margin: 0; }}
    body {{ display: flex; flex-direction: column; }}
    .bar {{ display: flex; align-items: center; gap: 12px; min-height: 62px; padding: 10px 16px;
      background: #fff; border-bottom: 1px solid #dfe5ec; box-shadow: 0 1px 4px rgb(23 32 51 / 8%); }}
    .brand {{ font-weight: 750; white-space: nowrap; }}
    .checks {{ display: flex; flex-wrap: wrap; gap: 8px; }}
    .check {{ padding: 6px 10px; border-radius: 999px; background: #edf1f5; color: #586474; font-size: 12px; }}
    .check.ok {{ background: #e3f7eb; color: #167544; }}
    .check.bad {{ background: #ffebea; color: #a8322c; }}
    #details {{ margin-left: auto; color: #586474; font-size: 12px; text-align: right; }}
    .workspace {{ flex: 1; min-height: 0; position: relative; }}
    iframe {{ display: block; width: 100%; height: 100%; border: 0; background: #fff; }}
    .install {{ width: min(640px, calc(100% - 32px)); margin: 48px auto; padding: 28px; border-radius: 18px;
      background: #fff; box-shadow: 0 12px 40px rgb(23 32 51 / 12%); }}
    .install h1 {{ margin: 0 0 12px; font-size: 24px; }}
    .install p {{ line-height: 1.55; color: #586474; }}
    .install .checks {{ margin-top: 20px; }}
    @media (max-width: 720px) {{ #details {{ display: none; }} .bar {{ align-items: flex-start; }} }}
  </style>
</head>
<body data-mode="{mode}">
  {('<section class="install"><h1>Подключаем RTM Education</h1><p>Проверяем связь с порталом и сервером. На этом этапе приложение только читает данные текущего пользователя и ничего не записывает в Битрикс24.</p><div class="checks" id="checks"></div><p id="details"></p></section>' if install else '<div hidden><div id="checks"></div><div id="details"></div></div><main class="workspace"><iframe src="/?bitrix_frame=1&amp;rtm_release=49.2.13" title="RTM Education v49.2"></iframe></main>')}
  <script>
    (() => {{
      const mode = document.body.dataset.mode;
      const checks = document.getElementById('checks');
      const details = document.getElementById('details');

      function mark(id, label, state, message = '') {{
        let node = document.getElementById(id);
        if (!node) {{
          node = document.createElement('span');
          node.id = id;
          node.className = 'check';
          checks.appendChild(node);
        }}
        node.className = `check ${{state}}`;
        node.textContent = `${{state === 'ok' ? '✓' : state === 'bad' ? '!' : '…'}} ${{label}}`;
        if (message) node.title = message;
      }}

      mark('server', 'Сервер', '');
      mark('database', 'PostgreSQL', '');
      mark('portal', 'Bitrix24', '');

      Promise.all([
        fetch('/api/health', {{cache: 'no-store'}}).then(r => {{ if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }}),
        fetch('/api/ready', {{cache: 'no-store'}}).then(r => {{ if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }})
      ]).then(([health, ready]) => {{
        mark('server', 'Сервер', 'ok', health.version || 'online');
        mark('database', 'PostgreSQL', ready.database === 'ok' ? 'ok' : 'bad');
      }}).catch(error => {{
        mark('server', 'Сервер', 'bad', error.message);
        mark('database', 'PostgreSQL', 'bad', error.message);
      }});

      if (!window.BX24) {{
        mark('portal', 'Bitrix24', 'bad', 'BX24 SDK не загрузился');
        details.textContent = 'Откройте приложение из меню Битрикс24.';
        return;
      }}

      BX24.init(() => {{
        window.RTM_BITRIX = {{
          isAdmin: () => typeof BX24.isAdmin === 'function' && BX24.isAdmin(),
          getAuth: () => BX24.getAuth(),
          call: (method, params = {{}}) => new Promise((resolve, reject) => {{
            BX24.callMethod(method, params, result => {{
              if (result.error()) {{
                reject(new Error(`${{result.error()}}: ${{result.error_description() || ''}}`));
                return;
              }}
              resolve({{data: result.data(), more: Boolean(result.more && result.more())}});
            }});
          }})
        }};
        BX24.callMethod('app.info', {{}}, appResult => {{
          if (appResult.error()) {{
            mark('portal', 'Bitrix24', 'bad', appResult.error_description());
            return;
          }}
          BX24.callMethod('user.current', {{}}, userResult => {{
            if (userResult.error()) {{
              mark('portal', 'Bitrix24', 'bad', userResult.error_description());
              details.textContent = 'Нет доступа к текущему пользователю.';
              return;
            }}
            const user = userResult.data();
            mark('portal', 'Bitrix24', 'ok');
            details.textContent = `Подключено: ${{user.NAME || ''}} ${{user.LAST_NAME || ''}}`.trim();
            if (mode === 'install') {{
              BX24.installFinish(() => {{
                details.textContent = 'Установка завершена. Приложение можно открыть в левом меню.';
              }});
            }}
          }});
        }});
      }});
    }})();
  </script>
</body>
</html>"""
    return HTMLResponse(
        html,
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
        },
    )
