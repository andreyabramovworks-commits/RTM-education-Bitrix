/* RTM v47 server adapter. The v46 DOM and styles remain unchanged. */
(function () {
  'use strict';
  if (new URLSearchParams(location.search).get('v47') !== '1' && window.__RTM_V48__ !== true) return;

  var originalBX24 = window.BX24;
  var context = null;
  var auth = null;
  var readyPromise = null;
  var entities = ['rtm_prj', 'rtm_items', 'rtm_assigns', 'rtm_progress', 'rtm_events', 'rtm_attempts', 'rtm_roles', 'rtm_canvas'];

  window.addEventListener('message', function (event) {
    if (event.origin !== location.origin || !event.data || event.data.rtmV48 !== 'session-request') return;
    var sessionKey = '';
    try { sessionKey = localStorage.getItem('rtm_server_session') || ''; } catch (_) {}
    if (sessionKey && event.source) event.source.postMessage({rtmV48: 'session', sessionKey: sessionKey}, event.origin);
  });

  function receiveOpenerSession() {
    if (!window.opener || new URLSearchParams(location.search).get('rtm_fullscreen') !== '1') return Promise.resolve();
    return new Promise(function (resolve) {
      var done = false;
      function finish(event) {
        if (done || event.origin !== location.origin || event.source !== window.opener || !event.data || event.data.rtmV48 !== 'session') return;
        done = true;
        window.removeEventListener('message', finish);
        try { localStorage.setItem('rtm_server_session', event.data.sessionKey || ''); } catch (_) {}
        resolve();
      }
      window.addEventListener('message', finish);
      window.opener.postMessage({rtmV48: 'session-request'}, location.origin);
      setTimeout(function () { if (!done) { done = true; window.removeEventListener('message', finish); resolve(); } }, 2500);
    });
  }

  function resultFacade(payload) {
    return {
      error: function () { return payload.error || null; },
      error_description: function () { return payload.errorDescription || ''; },
      data: function () { return payload.data; },
      more: function () { return Boolean(payload.more); }
    };
  }

  function findContext() {
    var frames = [window];
    try { frames.push(window.parent); } catch (_) {}
    try { frames.push(window.parent && window.parent.parent); } catch (_) {}
    try { frames.push(window.parent && window.parent.parent && window.parent.parent.parent); } catch (_) {}
    for (var index = 0; index < frames.length; index += 1) {
      try {
        var candidate = frames[index] && frames[index].RTM_BITRIX;
        if (candidate && typeof candidate.call === 'function') return candidate;
      } catch (_) {}
    }
    return null;
  }

  async function waitForContext() {
    for (var attempt = 0; attempt < 80; attempt += 1) {
      context = findContext();
      if (context) return context;
      await new Promise(function (resolve) { setTimeout(resolve, 100); });
    }
    throw new Error('Bitrix24 context is unavailable');
  }

  function refreshAuth() {
    auth = context && context.getAuth && context.getAuth();
    if (!auth || !auth.access_token || !auth.domain) throw new Error('Bitrix24 authorization is unavailable');
    return auth;
  }

  async function request(path, options, retry) {
    options = options || {};
    options.credentials = 'same-origin';
    var headers = {'Content-Type': 'application/json'};
    if (auth && auth.access_token) {
      headers.Authorization = 'Bearer ' + auth.access_token;
      headers['X-Bitrix-Domain'] = auth.domain;
    }
    try {
      var serverSession = localStorage.getItem('rtm_server_session');
      if (serverSession) headers['X-RTM-Session'] = serverSession;
    } catch (_) {}
    options.headers = Object.assign({}, options.headers || {}, headers);
    var response = await fetch(path, options);
    if (response.status === 401 && retry !== false) {
      if (!context) throw new Error('Bitrix24 session expired. Open the application inside Bitrix24 again.');
      await context.call('profile', {});
      refreshAuth();
      return request(path, options, false);
    }
    if (!response.ok) {
      var detail = '';
      try { detail = (await response.json()).detail || ''; } catch (_) {}
      var apiError = new Error(detail || ('API HTTP ' + response.status));
      apiError.status = response.status;
      throw apiError;
    }
    if (response.status === 204) return null;
    return response.json();
  }

  async function bitrixRows(method, params) {
    var rows = [], start = 0;
    for (var guard = 0; guard < 50; guard += 1) {
      var page;
      try {
        page = await Promise.race([
          context.call(method, Object.assign({}, params || {}, {start: start})),
          new Promise(function (_, reject) {
            setTimeout(function () { reject(new Error('Bitrix24 request timeout')); }, 8000);
          })
        ]);
      } catch (_) { return []; }
      var data = page.data;
      if (data && Array.isArray(data.result)) data = data.result;
      if (!Array.isArray(data)) data = data ? [data] : [];
      rows = rows.concat(data);
      if (!page.more || !data.length) break;
      start += 50;
    }
    return rows;
  }

  async function importV46() {
    var status = await request('/api/v47/status');
    // The backend verifies user.admin through the REST API and remains the
    // authority for the import permission. Client-side admin signals are not
    // reliable in every embedded local-app frame.
    if (!status.needs_import) return status;
    var pairs = await Promise.all(entities.map(async function (entity) {
      return [entity, await bitrixRows('entity.item.get', {ENTITY: entity, SORT: {ID: 'DESC'}})];
    }));
    var entityData = {};
    pairs.forEach(function (pair) { entityData[pair[0]] = pair[1]; });
    var users = await bitrixRows('user.get', {FILTER: {ACTIVE: true}});
    return request('/api/v47/import', {method: 'POST', body: JSON.stringify({entities: entityData, users: users})});
  }

  async function ensureReady() {
    if (readyPromise) return readyPromise;
    readyPromise = (async function () {
      context = findContext();
      if (context) refreshAuth();
      if (!context) await receiveOpenerSession();
      var current = await request('/api/v47/session');
      if (current.browser_session) try { localStorage.setItem('rtm_server_session', current.browser_session); } catch (_) {}
      if (context) await importV46();
      window.__RTMV47_USER__ = current;
      return current;
    })();
    return readyPromise;
  }

  window.BX24 = {
    init: function (callback) {
      ensureReady().then(function () { callback(); }).catch(function (error) {
        console.error('RTM v47 initialization failed', error);
        if (originalBX24 && originalBX24.init) originalBX24.init(callback);
      });
    },
    callMethod: function (method, params, callback) {
      var active = findContext();
      if (!active) {
        request('/api/v47/bitrix', {method: 'POST', body: JSON.stringify({method: method, params: params || {}})})
          .then(function (payload) { callback(resultFacade({data: payload.data, more: false})); })
          .catch(function (error) { callback(resultFacade({error: 'BITRIX_CALL_FAILED', errorDescription: String(error.message || error)})); });
        return;
      }
      context = active;
      Promise.resolve(context.call(method, params || {})).then(function (payload) {
        callback(resultFacade(payload));
      }).catch(function (error) {
        callback(resultFacade({error: 'BITRIX_CALL_FAILED', errorDescription: String(error.message || error)}));
      });
    },
    isAdmin: function () { return Boolean(context && context.isAdmin()); },
    getDomain: function () { return auth && auth.domain || ''; },
    getAuth: function () { return auth || false; }
  };

  get = async function (entity) {
    await ensureReady();
    return request('/api/v47/legacy/' + encodeURIComponent(entity));
  };
  add = async function (entity, name, properties) {
    await ensureReady();
    var result = await request('/api/v47/legacy/' + encodeURIComponent(entity), {
      method: 'POST', body: JSON.stringify({name: name, properties: properties || {}})
    });
    return String(result.id);
  };
  upd = async function (entity, id, name, properties) {
    await ensureReady();
    return request('/api/v47/legacy/' + encodeURIComponent(entity) + '/' + encodeURIComponent(id), {
      method: 'PUT', body: JSON.stringify({name: name, properties: properties || {}})
    });
  };
  del = async function (entity, id) {
    await ensureReady();
    return request('/api/v47/legacy/' + encodeURIComponent(entity) + '/' + encodeURIComponent(id), {method: 'DELETE'});
  };
  ensureOnce = async function () { await ensureReady(); schemaChecked = true; };
  readSnapshot = async function () { return {}; };
  saveSnapshot = async function () { return true; };
  readCache = function () { return {}; };
  writeCache = function () { return true; };
  persistNow = async function () { return true; };
  getUsersAll = async function () { await ensureReady(); return request('/api/v47/users'); };
  getAppRole = function (user) {
    var bitrixId = String(user && (user.ID || user.id) || '0');
    var row = (state.users || []).find(function (candidate) { return String(candidate.ID) === bitrixId; });
    var role = row && row.ROLE || (window.__RTMV47_USER__ && String(window.__RTMV47_USER__.bitrix_user_id) === bitrixId ? window.__RTMV47_USER__.role : 'student');
    return role === 'admin' ? 'admin' : role === 'editor' ? 'moderator' : 'employee';
  };
  isBitrixAdmin = function (user) { return getAppRole(user) === 'admin'; };
  roleLabel = function (role) {
    return {admin: 'Администратор', moderator: 'Редактор / преподаватель', employee: 'Ученик'}[role] || 'Ученик';
  };
  saveRole = async function (userId, legacyRole) {
    var role = legacyRole === 'moderator' ? 'editor' : 'student';
    await request('/api/v47/users/' + encodeURIComponent(userId) + '/role', {
      method: 'PUT', body: JSON.stringify({role: role})
    });
    var user = (state.users || []).find(function (candidate) { return String(candidate.ID) === String(userId); });
    if (user) user.ROLE = role;
  };
  roleModal = function (userId) {
    var user = userById(userId), role = getAppRole(user);
    modal('<h2>' + esc(fullName(user)) + '</h2><p class="muted">Роль определяет доступ внутри приложения.</p>' +
      '<select id="roleSelect"><option value="employee" ' + (role === 'employee' ? 'selected' : '') + '>Ученик</option>' +
      '<option value="moderator" ' + (role === 'moderator' ? 'selected' : '') + '>Редактор / преподаватель</option></select>' +
      '<div class="inline-actions"><button onclick="window.closeModal()">Отмена</button><button class="primary" id="roleSave">Сохранить</button></div>');
    $('#roleSave').onclick = async function () { await saveRole(userId, $('#roleSelect').value); closeModal(); await loadAll(); switchAdmin('users'); };
  };

  window.RTMV47 = {ready: ensureReady, request: request, version: window.__RTM_V49__ ? 'v49' : window.__RTM_V48__ ? 'v48' : 'v47'};
  window.RTMV47.bitrixCall = function (method, params) {
    return request('/api/v47/bitrix', {method: 'POST', body: JSON.stringify({method: method, params: params || {}})}).then(function (payload) { return payload.data; });
  };

  // v47 scene storage: PostgreSQL is authoritative. IndexedDB remains only a
  // short-lived unsent-draft safety net; application data is no longer merged
  // from localStorage or written to Bitrix.Disk.
  async function serverScene(articleId, pageId) {
    try {
      var result = await request('/api/v47/scenes/' + encodeURIComponent(articleId) + '/' + encodeURIComponent(pageId));
      return result.scene || null;
    } catch (error) {
      if (error.status === 404) return null;
      throw error;
    }
  }

  async function saveServerScene(articleId, page, index, scene) {
    if (!scene || !Array.isArray(scene.elements)) return null;
    var pageId = String(page && page.id || ('page_' + Number(index || 0)));
    var saved = await request('/api/v47/scenes/' + encodeURIComponent(articleId) + '/' + encodeURIComponent(pageId), {
      method: 'PUT',
      body: JSON.stringify({scene: scene, title: String(page && page.title || '')})
    });
    page.canvasRef = {format: 'server-v47', pageId: pageId, revision: String(saved.revision), updatedAt: saved.updated_at};
    page.canvasBackup = null;
    return {revision: saved.revision, scene: scene, server: true};
  }
  window.RTMV47.readScene = function (articleId, page, index) {
    return serverScene(articleId, String(page && page.id || ('page_' + Number(index || 0))));
  };
  window.RTMV47.saveScene = saveServerScene;
  window.RTMV47.readDraft = async function (articleId, page, index) {
    var pageId = String(page && page.id || ('page_' + Number(index || 0)));
    try {
      var result = await request('/api/v47/drafts/' + encodeURIComponent(articleId) + '/' + encodeURIComponent(pageId));
      return result.scene || null;
    } catch (error) {
      if (error.status === 404) return serverScene(articleId, pageId);
      throw error;
    }
  };
  window.RTMV47.saveDraft = async function (articleId, page, index, scene) {
    if (!scene || !Array.isArray(scene.elements)) return null;
    var pageId = String(page && page.id || ('page_' + Number(index || 0)));
    return request('/api/v47/drafts/' + encodeURIComponent(articleId) + '/' + encodeURIComponent(pageId), {
      method: 'PUT', body: JSON.stringify({scene: scene, title: String(page && page.title || '')})
    });
  };
  window.RTMV47.publishScene = async function (articleId, page, index, scene) {
    if (!scene || !Array.isArray(scene.elements)) return null;
    var pageId = String(page && page.id || ('page_' + Number(index || 0)));
    var saved = await request('/api/v47/drafts/' + encodeURIComponent(articleId) + '/' + encodeURIComponent(pageId) + '/publish', {
      method: 'POST', body: JSON.stringify({scene: scene, title: String(page && page.title || '')})
    });
    page.canvasRef = {format: 'server-v49', pageId: pageId, revision: String(saved.revision), updatedAt: saved.updated_at};
    page.canvasBackup = null;
    return {revision: saved.revision, scene: scene, server: true, published: true};
  };

  function applyV47Labels() {
    var version = window.__RTM_V49__ ? 'v49' : window.__RTM_V48__ ? 'v48' : 'v47';
    document.querySelectorAll('.v39-version-label').forEach(function (node) {
      var expected = node.classList.contains('v39-admin-version') ? version : 'Версия ' + version;
      if (node.textContent !== expected) node.textContent = expected;
      node.title = 'Версия ' + version;
    });
  }
  var renderAllV47Base = renderAll;
  renderAll = function () { renderAllV47Base(); applyV47Labels(); };
  var renderProfileV47Base = renderProfile;
  renderProfile = function () {
    renderProfileV47Base();
    Promise.all([
      fetch('/api/health', {credentials: 'same-origin'}).then(function (r) { return r.ok; }).catch(function () { return false; }),
      fetch('/api/ready', {credentials: 'same-origin'}).then(function (r) { return r.ok; }).catch(function () { return false; })
    ]).then(function (checks) {
      var server = document.querySelector('[data-profile-status="server"]');
      var database = document.querySelector('[data-profile-status="database"]');
      var bitrix = document.querySelector('[data-profile-status="bitrix"]');
      if (server) { server.textContent = 'Сервер: ' + (checks[0] ? 'работает' : 'ошибка'); server.classList.toggle('ok', checks[0]); }
      if (database) { database.textContent = 'PostgreSQL: ' + (checks[1] ? 'работает' : 'ошибка'); database.classList.toggle('ok', checks[1]); }
      if (bitrix) { bitrix.textContent = 'Bitrix24: ' + (window.__RTMV47_USER__ ? 'подключён' : 'нет сессии'); bitrix.classList.toggle('ok', Boolean(window.__RTMV47_USER__)); }
    });
  };
  function enhanceArticleReader() {
    var host = document.getElementById('v46ReaderSvg');
    if (host) document.body.classList.add('is-reading-article');
    document.querySelectorAll('.rtm-reader-complete').forEach(function (button) { button.remove(); });
  }
  new MutationObserver(enhanceArticleReader).observe(document.documentElement, {childList: true, subtree: true});
  window.addEventListener('error', function () { document.body.classList.remove('is-busy'); });
  window.addEventListener('unhandledrejection', function () { document.body.classList.remove('is-busy'); });
  document.addEventListener('visibilitychange', function () { if (!document.hidden && !state.syncing) idle(); });
  document.addEventListener('click', function (event) {
    var link = event.target && event.target.closest && event.target.closest('.toplink[data-user-view]');
    if (!link || link.dataset.userView !== 'learn') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    showUserView('learn');
    showUserCourses();
  }, true);
  new MutationObserver(applyV47Labels).observe(document.documentElement, {childList: true, subtree: true});
  document.addEventListener('click', function (event) {
    var button = event.target && event.target.closest && event.target.closest('button');
    if (!button || button.textContent.indexOf('Bitrix.Диск') === -1) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    alert('Bitrix.Диск больше не используется для хранения приложения. Добавьте HTTPS-ссылку на материал.');
  }, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () {
    setTimeout(applyV47Labels, 0);
  });
  else setTimeout(applyV47Labels, 0);
  if (window.__RTM_V48__ && typeof window.__RTM_V48_INIT__ === 'function') {
    setTimeout(function () { window.__RTM_V48_INIT__(); }, 0);
  }
})();
