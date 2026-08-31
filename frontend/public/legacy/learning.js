/* source: v049.js */
/* RTM v49 interaction recovery, activity tracking and user analytics. */
(function () {
  'use strict';

  function visibleMaterial() {
    var view = document.getElementById('userMaterialView');
    return view && !view.classList.contains('hidden') ? findItem(view.dataset.id) : null;
  }

  function repairScroll() {
    var article = visibleMaterial();
    document.body.classList.toggle('is-reading-article', Boolean(article && materialKind(article) === 'article'));
    document.body.classList.remove('is-busy');
  }

  var repairQueued = false;
  function scheduleRepair() {
    if (repairQueued) return;
    repairQueued = true;
    requestAnimationFrame(function () {
      repairQueued = false;
      repairScroll();
    });
  }

  document.addEventListener('click', scheduleRepair, true);
  window.addEventListener('popstate', scheduleRepair);
  window.addEventListener('pageshow', scheduleRepair);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) scheduleRepair(); });
  new MutationObserver(scheduleRepair).observe(document.documentElement, {subtree: true, childList: true, attributes: true, attributeFilter: ['class']});

  var activity = null;
  function beginActivity(item) {
    flushActivity();
    if (item) activity = {item: item, started: Date.now()};
  }
  async function flushActivity() {
    if (!activity) return;
    var current = activity, seconds = Math.round((Date.now() - current.started) / 1000);
    activity.started = Date.now();
    if (seconds < 10 || !current.item) return;
    var props = {userId: actorUserId(), userName: actorUserName(), event: 'Активность', targetId: String(current.item.ID || ''), targetName: current.item.NAME || '', duration: String(seconds), createdAt: now()};
    try { var id = await add(E.events, 'Активность ' + (current.item.NAME || ''), props); if (typeof upsertLocalEvent === 'function') upsertLocalEvent(id, 'Активность ' + (current.item.NAME || ''), props); }
    catch (error) { console.warn('RTM v49 activity save failed', error); }
  }
  var openMaterialBase = window.openUserMaterial;
  if (typeof openMaterialBase === 'function') window.openUserMaterial = function (item) { var result = openMaterialBase.apply(this, arguments); beginActivity(item); return result; };
  var finishArticleBase = window.finishCurrentArticle;
  if (typeof finishArticleBase === 'function') window.finishCurrentArticle = async function () { try { await flushActivity(); } catch (error) { console.warn('Activity flush did not block article completion', error); } activity = null; return finishArticleBase.apply(this, arguments); };
  document.addEventListener('visibilitychange', function () { if (document.hidden) flushActivity(); else if (visibleMaterial()) beginActivity(visibleMaterial()); });
  setInterval(function () { if (!document.hidden && activity) flushActivity(); }, 30000);

  function secondsLabel(value) {
    var seconds = Math.max(0, Number(value) || 0), hours = Math.floor(seconds / 3600), minutes = Math.floor((seconds % 3600) / 60);
    return hours ? hours + ' ч ' + minutes + ' мин' : minutes ? minutes + ' мин' : seconds + ' сек';
  }
  function userEvents(userId) { return state.events.filter(function (event) { return String(event.PROPERTY_VALUES && event.PROPERTY_VALUES.userId) === String(userId); }); }
  function userAttempts(userId) { return state.attempts.filter(function (attempt) { return String(attempt.PROPERTY_VALUES && attempt.PROPERTY_VALUES.userId) === String(userId); }); }
  function courseMaterials(courseId) { return activeRows(state.items).filter(function (item) { return String(item.PROPERTY_VALUES && item.PROPERTY_VALUES.parentId) === String(courseId); }); }
  function openUserAnalytics(userId) {
    var user = userById(userId); if (!user) return;
    var events = userEvents(userId).sort(function (a, b) { return new Date(b.PROPERTY_VALUES.createdAt || b.DATE_CREATE || 0) - new Date(a.PROPERTY_VALUES.createdAt || a.DATE_CREATE || 0); });
    var attempts = userAttempts(userId), progress = state.progress.filter(function (row) { return String(row.PROPERTY_VALUES && row.PROPERTY_VALUES.userId) === String(userId) && row.PROPERTY_VALUES.status === 'completed'; });
    var assignedIds = new Set(state.assigns.filter(function (row) { return String(row.PROPERTY_VALUES && row.PROPERTY_VALUES.userId) === String(userId); }).map(function (row) { return String(row.PROPERTY_VALUES.targetId); }));
    var courses = activeRows(state.items).filter(function (item) { return item.PROPERTY_VALUES.type === 'course' && assignedIds.has(String(item.ID)); });
    var activeSeconds = events.filter(function (event) { return event.PROPERTY_VALUES.event === 'Активность'; }).reduce(function (sum, event) { return sum + (Number(event.PROPERTY_VALUES.duration) || 0); }, 0);
    var last = events[0] && events[0].PROPERTY_VALUES.createdAt;
    var courseRows = courses.map(function (course) { var materials = courseMaterials(course.ID), done = materials.filter(function (item) { return progress.some(function (row) { return String(row.PROPERTY_VALUES.targetId) === String(item.ID); }); }).length, pct = materials.length ? Math.round(done / materials.length * 100) : 0; return '<div class="v49-user-course"><div><b>' + esc(course.NAME) + '</b><span>' + done + ' из ' + materials.length + '</span></div><div class="progress"><span style="width:' + pct + '%"></span></div><strong>' + pct + '%</strong></div>'; }).join('');
    var attemptRows = attempts.slice(0, 12).map(function (attempt) { var p = attempt.PROPERTY_VALUES || {}, test = findItem(p.testId), status = String(p.passed) === 'PENDING' ? '<span class="pill yellow">На проверке</span>' : String(p.passed) === 'Y' ? '<span class="pill green">Зачёт</span>' : '<span class="pill red">Не зачтено</span>'; return '<tr><td>' + esc(test && test.NAME || 'Тест') + '</td><td>' + esc(String(p.score || 0)) + '%</td><td>' + status + '</td><td>' + fmt(p.createdAt) + '</td><td><button type="button" data-v492-reset-attempts="' + esc(String(p.testId || '')) + '" data-user="' + esc(String(userId)) + '">Дать новые попытки</button></td></tr>'; }).join('');
    var eventRows = events.filter(function (event) { return event.PROPERTY_VALUES.event !== 'Активность'; }).slice(0, 20).map(function (event) { var p = event.PROPERTY_VALUES || {}; return '<tr><td>' + fmt(p.createdAt) + '</td><td>' + esc(p.event || 'Событие') + '</td><td>' + esc(p.targetName || '—') + '</td></tr>'; }).join('');
    modal('<div class="v49-user-analytics"><div class="v49-user-hero"><span class="avatar-mini">' + esc(initials(user)) + '</span><div><h2>' + esc(fullName(user)) + '</h2><p>' + esc(user.EMAIL || '') + '</p></div></div><div class="v49-user-meta"><span><b>Роль</b>' + esc(roleLabel(getAppRole(user))) + '</span><span><b>Подразделение</b>' + esc(userDepartments(user) || '—') + '</span><span><b>Последняя активность</b>' + (last ? fmt(last) : 'Нет данных') + '</span></div><div class="stats-grid analytics-stats"><div class="dash-stat"><span>Назначено курсов</span><b>' + courses.length + '</b></div><div class="dash-stat"><span>Завершено материалов</span><b>' + progress.length + '</b></div><div class="dash-stat"><span>Попыток тестов</span><b>' + attempts.length + '</b></div><div class="dash-stat"><span>Активное время</span><b>' + secondsLabel(activeSeconds) + '</b></div></div><h3>Прогресс по курсам</h3><div class="v49-user-courses">' + (courseRows || '<p class="muted">Курсы пока не назначены</p>') + '</div><h3>Последние попытки тестов</h3><div class="table-card"><table class="admin-table"><thead><tr><th>Тест</th><th>Результат</th><th>Статус</th><th>Дата</th><th></th></tr></thead><tbody>' + (attemptRows || '<tr><td colspan="5">Попыток пока нет</td></tr>') + '</tbody></table></div><h3>История действий</h3><div class="table-card"><table class="admin-table"><thead><tr><th>Время</th><th>Событие</th><th>Материал</th></tr></thead><tbody>' + (eventRows || '<tr><td colspan="3">Событий пока нет</td></tr>') + '</tbody></table></div></div>');
    document.querySelectorAll('[data-v492-reset-attempts]').forEach(function (button) { button.onclick = async function () { if (!confirm('Сбросить использованные попытки для этого теста?')) return; button.disabled = true; try { await window.RTMV47.request('/api/v47/tests/' + encodeURIComponent(button.dataset.v492ResetAttempts) + '/users/' + encodeURIComponent(button.dataset.user) + '/attempts', {method: 'DELETE'}); await loadAll(); closeModal(); openUserAnalytics(userId); } catch (error) { button.disabled = false; alert(error.message || String(error)); } }; });
  }

  var analyticsUsersBase = window.renderAnalyticsUsers;
  if (typeof analyticsUsersBase === 'function') window.renderAnalyticsUsers = function (root, data) {
    analyticsUsersBase.apply(this, arguments);
    var rows = filteredUsers(data);
    document.querySelectorAll('#analyticsUserRows tr').forEach(function (row, index) {
      var item = rows[index]; if (!item) return;
      row.tabIndex = 0; row.classList.add('v49-analytics-user-row'); row.title = 'Открыть подробную аналитику';
      row.onclick = function () { openUserAnalytics(item.u.ID); };
      row.onkeydown = function (event) { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openUserAnalytics(item.u.ID); } };
    });
  };

  window.RTMV49 = window.RTMV49 || {};
  window.RTMV49.openUserAnalytics = openUserAnalytics;
  setTimeout(repairScroll, 0);
})();


/* source: v0492.js */
/* RTM Education v49.2: roles, protected workspace and test experience. */
(function () {
  'use strict';

  var workspaceTimer = 0, workspaceScene = null, workspaceRevision = 0, workspaceMounted = false, workspaceRestoring = false, workspaceGeneration = 0, workspaceMountTimer = 0, workspaceSavePromise = null, workspaceSaveQueued = false, developerPreviewRole = null;
  function visibleWorkspace(scene) {
    var next = JSON.parse(JSON.stringify(scene || {})), app = next.appState || {}, zoom = Number(app.zoom && app.zoom.value || app.zoom || 0.1);
    next.appState = Object.assign({}, app, {isLoading: false, zoom: {value: Math.max(0.1, Math.min(4, isFinite(zoom) ? zoom : 0.1))}});
    return next;
  }
  async function persistWorkspace(generation, status, manual) {
    if (workspaceRestoring || generation !== workspaceGeneration) return null;
    if (workspaceSavePromise) {
      workspaceSaveQueued = true;
      await workspaceSavePromise.catch(function () {});
      if (!workspaceSaveQueued) return null;
    }
    workspaceSaveQueued = false;
    var snapshot = workspaceScene;
    workspaceSavePromise = window.RTMV47.request('/api/v47/developer-workspace', {
      method: 'PUT', body: JSON.stringify({scene: snapshot})
    });
    try {
      var saved = await workspaceSavePromise;
      if (generation !== workspaceGeneration) return saved;
      workspaceRevision = Number(saved.revision || workspaceRevision + 1);
      if (status) status.textContent = 'Сохранено на сервере · ревизия ' + workspaceRevision + (manual ? '' : ' · резервная копия выгружается в Google Drive автоматически');
      return saved;
    } finally {
      workspaceSavePromise = null;
      if (workspaceSaveQueued && generation === workspaceGeneration) {
        workspaceSaveQueued = false;
        return persistWorkspace(generation, status, false);
      }
    }
  }

  function currentRole() { return String(state.currentRole || 'employee'); }
  function canAdmin() { return ['developer', 'admin', 'moderator', 'teacher'].includes(currentRole()); }
  function canEditContent() { return ['developer', 'admin', 'moderator'].includes(currentRole()); }
  function actualRole() { return String(getAppRole(state.user) || 'employee'); }
  function isActualDeveloper() { return actualRole() === 'developer'; }
  function isDeveloper() { return isActualDeveloper() && currentRole() === 'developer'; }
  function applyDeveloperPreview(role) { developerPreviewRole = role && role !== 'developer' ? role : null; state.currentRole = developerPreviewRole || actualRole(); if (!canAdmin() && state.mode === 'admin') { setMode('user'); return; } renderAll(); }
  function renderDeveloperMobilePreview() {
    var bottom = document.querySelector('#v38MobileNav .v38-mobile-menu-bottom'); if (!bottom || !isActualDeveloper()) return;
    var label = document.createElement('label'); label.className = 'v492-mobile-role-preview'; label.innerHTML = '<span>Просмотр от роли</span><select aria-label="Мобильный просмотр приложения от роли"><option value="developer">Разработчик</option><option value="admin">Администратор</option><option value="moderator">Редактор</option><option value="teacher">Преподаватель</option><option value="employee">Пользователь</option></select>';
    var modeButton = bottom.querySelector('[data-v38-mode]'); if (modeButton) modeButton.insertAdjacentElement('afterend', label); else bottom.appendChild(label);
    var select = label.querySelector('select'); select.value = developerPreviewRole || 'developer'; select.onchange = function () { applyDeveloperPreview(this.value); };
  }
  function renderDeveloperPreview() {
    var control = document.getElementById('v492RolePreview');
    if (!isActualDeveloper()) { if (control) control.remove(); developerPreviewRole = null; return; }
    if (!control) {
      control = document.createElement('label'); control.id = 'v492RolePreview'; control.className = 'v492-role-preview';
      control.innerHTML = '<span>Просмотр</span><select aria-label="Просмотр приложения от роли"><option value="developer">Разработчик</option><option value="admin">Администратор</option><option value="moderator">Редактор</option><option value="teacher">Преподаватель</option><option value="employee">Пользователь</option></select>';
      var anchor = document.getElementById('globalSyncBtn'); if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(control, anchor); else document.body.appendChild(control);
      control.querySelector('select').onchange = function () { applyDeveloperPreview(this.value); };
    }
    control.querySelector('select').value = developerPreviewRole || 'developer';
  }

  var baseApplyAccess = window.applyAccess;
  window.applyAccess = function () {
    var requestedMode = state.mode;
    if (typeof baseApplyAccess === 'function') baseApplyAccess.apply(this, arguments);
    var role = actualRole(); if (role !== 'developer') developerPreviewRole = null; role = developerPreviewRole || role; state.currentRole = role;
    if (canAdmin() && requestedMode === 'admin' && state.mode !== 'admin') { state.mode = 'admin'; var userApp = document.getElementById('userApp'), adminApp = document.getElementById('adminApp'), userNav = document.getElementById('userNav'); if (userApp) userApp.classList.remove('active'); if (adminApp) adminApp.classList.add('active'); if (userNav) userNav.style.display = 'none'; }
    if (!canAdmin() && state.mode === 'admin') setMode('user');
    var mode = document.getElementById('modeSwitch'); if (mode) { mode.hidden = !canAdmin(); mode.disabled = !canAdmin(); mode.style.display = canAdmin() ? 'inline-flex' : 'none'; }
    var info = document.querySelector('[data-admin-view="info"]'); if (info) { info.hidden = !isDeveloper(); info.style.display = isDeveloper() ? '' : 'none'; }
    var projects = document.querySelector('.toplink[data-user-view="projects"]'); if (projects) { projects.hidden = !canAdmin(); projects.style.display = canAdmin() ? '' : 'none'; }
    document.documentElement.dataset.rtmRole = role; document.documentElement.dataset.rtmActualRole = actualRole(); renderDeveloperPreview();
  };
  window.canEdit = function () { return state.mode === 'admin' && canEditContent(); };
  window.canOpenCourseMaterial = function (material) { var parent = material && material.PROPERTY_VALUES && material.PROPERTY_VALUES.parentId; if (!parent) return true; var list = courseMaterials(parent), index = list.findIndex(function (item) { return String(item.ID) === String(material.ID); }); if (index <= 0) return true; return list.slice(0, index).filter(function (item) { var meta = j(item.PROPERTY_VALUES.meta); return meta.required === true || meta.required === 'Y'; }).every(function (item) { return isDone(item.ID, materialKind(item)); }); };
  var baseOpenUserMaterial = window.openUserMaterial;
  window.openUserMaterial = function (material) { if (material && !canOpenCourseMaterial(material)) { alert('Сначала завершите предыдущий обязательный материал.'); return; } return baseOpenUserMaterial.apply(this, arguments); };
  var courseScopedOpenUserMaterial = window.openUserMaterial;
  window.openUserMaterial = function (material) { var result = courseScopedOpenUserMaterial.apply(this, arguments); if (material && typeof materialCourseId === 'function' && !materialCourseId(material)) state.courseId = null; return result; };

  window.renderUsers = function () {
    var box = document.getElementById('usersTable'); if (!box) return;
    var q = String(document.getElementById('usersSearch') && document.getElementById('usersSearch').value || '').toLowerCase();
    var dept = String(document.getElementById('usersDeptFilter') && document.getElementById('usersDeptFilter').value || 'all');
    var total = document.getElementById('usersTotal'); if (total) total.textContent = state.users.length;
    var deptSelect = document.getElementById('usersDeptFilter');
    if (deptSelect && !deptSelect.dataset.ready) { deptSelect.innerHTML = '<option value="all">Все департаменты</option>' + state.departments.map(function (d) { return '<option value="' + d.ID + '">' + esc(d.NAME) + '</option>'; }).join(''); deptSelect.dataset.ready = '1'; deptSelect.onchange = renderUsers; var search = document.getElementById('usersSearch'); if (search) search.oninput = renderUsers; var sync = document.getElementById('usersSyncBtn'); if (sync) sync.onclick = loadAll; }
    var rows = state.users.filter(Boolean).filter(function (u) { return (fullName(u) + ' ' + (u.EMAIL || '')).toLowerCase().includes(q); }).filter(function (u) { var ds = Array.isArray(u.UF_DEPARTMENT) ? u.UF_DEPARTMENT : u.UF_DEPARTMENT ? [u.UF_DEPARTMENT] : []; return dept === 'all' || ds.map(String).includes(dept); });
    box.innerHTML = rows.map(function (u) { var role = getAppRole(u), locked = role === 'developer' || Boolean(u.IS_BITRIX_ADMIN), editable = ['developer', 'admin'].includes(currentRole()) && !locked; return '<tr><td><div class="user-cell"><span class="avatar-mini">' + esc(initials(u)) + '</span><div><b>' + esc(fullName(u) || 'ID ' + u.ID) + '</b><div class="row-sub">' + esc(u.EMAIL || '') + '</div></div></div></td><td><span class="pill green">Активен</span></td><td>' + esc(userDepartments(u)) + '</td><td><span class="pill ' + (role === 'developer' ? 'violet' : role === 'admin' ? 'mint' : role === 'moderator' ? 'yellow' : role === 'teacher' ? 'blue' : 'gray') + '">' + esc(roleLabel(role)) + (u.IS_BITRIX_ADMIN ? ' · Bitrix24' : '') + '</span></td><td><button class="icon-action" data-role-user="' + u.ID + '" ' + (editable ? '' : 'disabled') + '>' + gearIcon() + '</button></td></tr>'; }).join('') || '<tr><td colspan="5">Пользователи не найдены</td></tr>';
    document.querySelectorAll('[data-role-user]').forEach(function (b) { b.onclick = function () { roleModal(b.dataset.roleUser); }; });
  };

  window.roleModal = function (userId) {
    if (!['developer', 'admin'].includes(currentRole())) return alert('Назначать роли может только администратор.');
    var user = userById(userId), role = getAppRole(user); if (!user || role === 'developer' || user.IS_BITRIX_ADMIN) return alert('Эта роль управляется автоматически и защищена.');
    modal('<h2>' + esc(fullName(user)) + '</h2><p class="muted">Редактор создаёт материалы. Преподаватель видит админку, назначения и попытки, но не меняет материалы.</p><select id="roleSelect"><option value="employee" ' + (role === 'employee' ? 'selected' : '') + '>Ученик</option><option value="teacher" ' + (role === 'teacher' ? 'selected' : '') + '>Преподаватель</option><option value="moderator" ' + (role === 'moderator' ? 'selected' : '') + '>Редактор</option><option value="admin" ' + (role === 'admin' ? 'selected' : '') + '>Администратор</option></select><div class="inline-actions"><button onclick="window.closeModal()">Отмена</button><button class="primary" id="roleSave">Сохранить</button></div>');
    document.getElementById('roleSave').onclick = async function () { await saveRole(userId, document.getElementById('roleSelect').value); closeModal(); await loadAll(); switchAdmin('users'); };
  };

  function mediaHtml(media) {
    if (!media || !media.url) return '';
    var url = esc(media.url), title = esc(media.title || 'Медиа к вопросу');
    if (media.kind === 'image') return '<figure class="v492-question-media"><img src="' + url + '" alt="' + title + '"></figure>';
    if (media.kind === 'audio') return '<figure class="v492-question-media"><audio controls preload="metadata" src="' + url + '"></audio></figure>';
    var embed = typeof rtmVideoEmbed === 'function' ? rtmVideoEmbed(media.url) : '';
    return '<figure class="v492-question-media">' + (embed ? '<iframe src="' + esc(embed) + '" allow="clipboard-write; autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>' : '<video controls preload="metadata" src="' + url + '"></video>') + '</figure>';
  }
  window.renderQOptions = function (question, index) {
    if (question.type === 'text') return '<div class="v492-free-answer-note">Свободный ответ проверит преподаватель. Правильный ответ не задаётся.</div>';
    if (question.type === 'match') { var pairs = question.pairs || [{left: '', right: ''}]; return pairs.map(function (p, pi) { return '<div class="match-pair"><input data-qpair-left="' + index + '_' + pi + '" placeholder="Левая часть" value="' + esc(p.left || '') + '"><input data-qpair-right="' + index + '_' + pi + '" placeholder="Правая часть" value="' + esc(p.right || '') + '"><button data-delpair="' + index + '_' + pi + '" title="Удалить">×</button></div>'; }).join('') + '<button data-addpair="' + index + '">Добавить пару</button>'; }
    var answers = question.answers && question.answers.length ? question.answers : ['', ''];
    return answers.map(function (a, ai) { return '<div class="answer-row"><input data-qans="' + index + '_' + ai + '" value="' + esc(a) + '" placeholder="Вариант ' + (ai + 1) + '"><label><input type="' + (question.type === 'multiple' ? 'checkbox' : 'radio') + '" name="correct_' + index + '" data-qcor="' + index + '_' + ai + '" ' + ((question.correct || []).includes(ai) ? 'checked' : '') + '> Правильный</label><button data-delans="' + index + '_' + ai + '" title="Удалить">×</button></div>'; }).join('') + '<button data-addans="' + index + '">Добавить вариант</button>';
  };
  function questionEditor(question, index, inline) {
    var p = inline ? 'inline-' : '', attrs = inline ? window.renderQOptions(question, index).replaceAll('data-qans', 'data-inline-qans').replaceAll('data-qcor', 'data-inline-qcor').replaceAll('data-addans', 'data-inline-addans').replaceAll('data-delans', 'data-inline-delans').replaceAll('data-qpair-left', 'data-inline-qpair-left').replaceAll('data-qpair-right', 'data-inline-qpair-right').replaceAll('data-addpair', 'data-inline-addpair').replaceAll('data-delpair', 'data-inline-delpair') : window.renderQOptions(question, index);
    return '<div class="question-card v492-question-card"><div class="panel-head"><h3>Вопрос ' + (index + 1) + '</h3><select data-' + p + 'qtype="' + index + '"><option value="single" ' + (question.type === 'single' ? 'selected' : '') + '>Один ответ</option><option value="multiple" ' + (question.type === 'multiple' ? 'selected' : '') + '>Несколько ответов</option><option value="match" ' + (question.type === 'match' ? 'selected' : '') + '>Соответствие</option><option value="text" ' + (question.type === 'text' ? 'selected' : '') + '>Свободный текст</option></select></div><label>Текст вопроса</label><input data-' + p + 'qtext="' + index + '" value="' + esc(question.text || '') + '">' + mediaHtml(question.media) + '<div class="v492-question-media-actions"><button type="button" data-v492-qmedia="' + index + '" data-inline="' + (inline ? '1' : '0') + '">Добавить фото / видео / аудио</button>' + (question.media ? '<button type="button" class="danger" data-v492-qmedia-remove="' + index + '" data-inline="' + (inline ? '1' : '0') + '">Убрать медиа</button>' : '') + '</div><div class="q-options">' + attrs + '</div><button class="danger" data-' + p + 'delq="' + index + '">Удалить вопрос</button></div>';
  }
  function bindQuestionMedia() {
    document.querySelectorAll('[data-v492-qmedia]').forEach(function (button) { button.onclick = async function () { var media = await window.RTMV46.pickDiskMedia(); if (!media) return; var item = findItem(button.dataset.inline === '1' ? state.expandedChildId : state.testId), meta = j(item.PROPERTY_VALUES.meta); meta.questions[Number(button.dataset.v492Qmedia)].media = media; await saveItemMeta(item.ID, meta); button.dataset.inline === '1' ? renderCourseEditor() : renderTestEditor(); }; });
    document.querySelectorAll('[data-v492-qmedia-remove]').forEach(function (button) { button.onclick = async function () { var item = findItem(button.dataset.inline === '1' ? state.expandedChildId : state.testId), meta = j(item.PROPERTY_VALUES.meta); delete meta.questions[Number(button.dataset.v492QmediaRemove)].media; await saveItemMeta(item.ID, meta); button.dataset.inline === '1' ? renderCourseEditor() : renderTestEditor(); }; });
  }

  window.renderTestEditor = function () {
    var item = findItem(state.testId), meta = testDefaults(j(item.PROPERTY_VALUES.meta)), root = document.getElementById('testQuestionsEditor');
    root.innerHTML = renderTestSettings(meta) + ((meta.questions || []).map(function (q, i) { return questionEditor(q, i, false); }).join('') || '<div class="panel">Вопросов пока нет</div>');
    renderAssignmentPanel('test'); bindTestEditor(); bindTestTabs(); bindQuestionMedia();
  };
  window.renderInlineQuestion = function (q, i) { return questionEditor(q, i, true); };
  var baseBindCourse = window.bindCourseEditorBtns;
  window.bindCourseEditorBtns = function () { baseBindCourse.apply(this, arguments); bindQuestionMedia(); document.querySelectorAll('[data-inline-name]').forEach(function (input) { input.oninput = function () { clearTimeout(input._rtmTimer); input._rtmTimer = setTimeout(async function () { var item = findItem(input.dataset.inlineName); if (!item) return; var props = Object.assign({}, item.PROPERTY_VALUES, {updatedAt: now()}); await upd(E.items, item.ID, input.value || item.NAME, props); updateLocalItem(item.ID, input.value || item.NAME, props); var title = input.closest('.inline-full-editor') && input.closest('.inline-full-editor').querySelector('.inline-title'); if (title) title.remove(); }, 700); }; }); };

  function answerControl(test, question, originalIndex, displayIndex) {
    if (question.type === 'text') return '<textarea class="v492-free-answer" name="t' + test.ID + 'q' + originalIndex + '" rows="5" placeholder="Введите свой ответ" required></textarea>';
    if (question.type === 'match') return (question.pairs || []).map(function (pair, pi) { var right = (question.pairs || []).map(function (p) { return p.right; }); return '<label class="v492-match-answer"><span>' + esc(pair.left) + '</span><select name="t' + test.ID + 'q' + originalIndex + 'p' + pi + '" required><option value="">Выберите соответствие</option>' + right.map(function (value, ri) { return '<option value="' + ri + '">' + esc(value) + '</option>'; }).join('') + '</select></label>'; }).join('');
    var answers = (question.answers || []).map(function (a, ai) { return {a: a, ai: ai}; }); if (testDefaults(j(test.PROPERTY_VALUES.meta)).shuffleAnswers) answers = shuffleCopy(question.answers || []).map(function (x) { return {a: x.v, ai: x.i}; });
    return answers.map(function (x) { return '<label class="answer"><input type="' + (question.type === 'multiple' ? 'checkbox' : 'radio') + '" name="t' + test.ID + 'q' + originalIndex + '" value="' + x.ai + '"><span>' + esc(x.a) + '</span></label>'; }).join('');
  }
  window.renderTakeTest = function (test) {
    var meta = testDefaults(j(test.PROPERTY_VALUES.meta)), attempts = testAttemptsUsed(test.ID), left = Math.max(0, meta.attemptsLimit - attempts); if (left <= 0) return '<div class="test-intro-card"><h3>' + esc(test.NAME) + '</h3><p>Попытки закончились</p></div>';
    var questions = meta.shuffleQuestions ? shuffleCopy(meta.questions || []).map(function (x) { return {q: x.v, orig: x.i}; }) : (meta.questions || []).map(function (q, i) { return {q: q, orig: i}; });
    return '<form class="take-test-card v492-take-test" data-take-test="' + test.ID + '" data-test-start="' + Date.now() + '"><div class="v492-test-head"><h2>' + esc(test.NAME) + '</h2><span>' + questions.length + ' вопросов</span></div>' + questions.map(function (row, i) { return '<section class="test-question"><b>' + (i + 1) + '. ' + esc(row.q.text) + '</b>' + mediaHtml(row.q.media) + answerControl(test, row.q, row.orig, i) + '</section>'; }).join('') + '<button class="primary v492-test-submit">Отправить ответы</button></form>';
  };
  window.renderUserTestIntro = function (test) {
    var meta = testDefaults(j(test.PROPERTY_VALUES.meta)), used = testAttemptsUsed(test.ID), left = Math.max(0, meta.attemptsLimit - used);
    return '<div class="test-intro-card v492-test-intro"><h2>' + esc(test.NAME) + '</h2><div class="test-info-grid"><span><i>◷</i><small>Доступное время на прохождение</small><b>' + (meta.timeLimit ? meta.timeLimit + ' мин' : 'Без ограничения') + '</b></span><span><i>↻</i><small>Доступное количество попыток</small><b>' + left + ' шт</b></span><span><i>✓</i><small>Порог прохождения теста</small><b>' + meta.passScore + '%</b></span><span><i>☆</i><small>Баллов за прохождение</small><b>' + meta.points + ' шт</b></span></div><button class="primary" data-start-user-test="' + test.ID + '" ' + (left <= 0 ? 'disabled' : '') + '>Приступить</button></div>';
  };
  window.takeTestSubmit = async function (event) {
    event.preventDefault(); var form = event.currentTarget, id = form.dataset.takeTest, test = findItem(id); if (!test) return;
    var meta = testDefaults(j(test.PROPERTY_VALUES.meta)), questions = meta.questions || [], good = 0, automatic = 0, pending = false, answers = [];
    questions.forEach(function (q, qi) { if (q.type === 'text') { var text = form.querySelector('[name="t' + id + 'q' + qi + '"]'); answers[qi] = {type: 'text', value: String(text && text.value || '').trim()}; pending = true; return; } if (q.type === 'match') { var selectedPairs = (q.pairs || []).map(function (_, pi) { var el = form.querySelector('[name="t' + id + 'q' + qi + 'p' + pi + '"]'); return Number(el && el.value); }); answers[qi] = {type: 'match', value: selectedPairs}; automatic++; if (selectedPairs.every(function (value, pi) { return value === pi; })) good++; return; } var selected = Array.from(form.querySelectorAll('[name="t' + id + 'q' + qi + '"]:checked')).map(function (x) { return Number(x.value); }).sort(); var correct = (q.correct || []).slice().sort(); answers[qi] = {type: q.type, value: selected}; automatic++; if (selected.join(',') === correct.join(',')) good++; });
    var score = automatic ? Math.round(good / automatic * 100) : 0, passed = !pending && score >= meta.passScore, props = {courseId: String(state.courseId || test.PROPERTY_VALUES.parentId || ''), testId: String(id), userId: String(typeof rtmCanonicalUserId === 'function' ? rtmCanonicalUserId(effectiveUserId()) : effectiveUserId()), score: String(score), passed: pending ? 'PENDING' : passed ? 'Y' : 'N', pendingReview: pending ? 'Y' : 'N', answers: JSON.stringify(answers), createdAt: now()};
    var attemptId = await add(E.attempts, 'Попытка теста', props); state.attempts.unshift({ID: String(attemptId), NAME: 'Попытка теста', PROPERTY_VALUES: props, DATE_CREATE: props.createdAt}); if (passed) await complete(id, 'test');
    if (pending) modal('<div class="test-outcome pending"><h2>Ответ отправлен</h2><p>Свободный ответ сохранён и ожидает проверки преподавателя.</p><button class="primary" id="testOutcomeClose">Продолжить</button></div>'); else if (passed) modal('<div class="test-outcome ok"><h2>Тест пройден</h2><p>Правильных ответов: <b>' + good + ' из ' + automatic + '</b></p><p>Результат: <b>' + score + '%</b></p><button class="primary" id="testOutcomeClose">Продолжить</button></div>'); else modal('<div class="test-outcome bad"><h2>Тест не пройден</h2><p>Правильных ответов: <b>' + good + ' из ' + automatic + '</b></p><p>Результат: <b>' + score + '%</b></p><div class="inline-actions"><button class="primary" id="testOutcomeRetry">Начать заново</button><button id="testOutcomeClose">Закрыть</button></div></div>');
    var close = document.getElementById('testOutcomeClose'); if (close) close.onclick = function () { closeModal(); var list = typeof courseChildren === 'function' ? courseChildren(state.courseId) : [], position = list.findIndex(function (item) { return String(item.ID) === String(test.ID); }), next = position >= 0 ? list[position + 1] : null; if (next) openUserMaterial(next); else if (test.PROPERTY_VALUES.parentId) openUserCourse(findItem(test.PROPERTY_VALUES.parentId)); };
    var retry = document.getElementById('testOutcomeRetry'); if (retry) retry.onclick = function () { closeModal(); document.getElementById('uMaterialBody').innerHTML = renderTakeTest(test); document.querySelectorAll('[data-take-test]').forEach(function (f) { f.onsubmit = takeTestSubmit; }); };
    renderProfile();
  };

  async function mountWorkspace() {
    var root = document.getElementById('adminInfo'); if (!root || state.aview !== 'info') return; if (!isDeveloper()) { root.innerHTML = '<div class="panel"><b>Доступ закрыт</b></div>'; return; }
    if (!window.RTMCanvas || !window.RTMV47) { clearTimeout(workspaceMountTimer); workspaceMountTimer = setTimeout(mountWorkspace, 150); return; }
    var mountedHost = document.getElementById('v492DeveloperCanvas');
    if (workspaceMounted && mountedHost && mountedHost.isConnected && mountedHost.dataset.rtmWorkspaceMounted === '1') return;
    clearTimeout(workspaceTimer); workspaceTimer = 0;
    var previousHost = document.getElementById('v492DeveloperCanvas'); if (previousHost && window.RTMCanvas) try { window.RTMCanvas.unmount(previousHost); } catch (_) {}
    var generation = ++workspaceGeneration;
    root.classList.remove('placeholder-view'); root.innerHTML = '<div class="v492-workspace-status">Загружаю защищённый лист…</div><div id="v492DeveloperCanvas" class="v492-developer-canvas"></div>'; var host = document.getElementById('v492DeveloperCanvas');
    try { var payload = await window.RTMV47.request('/api/v47/developer-workspace'); if (generation !== workspaceGeneration || state.aview !== 'info' || !root.isConnected || !host.isConnected) return; workspaceScene = visibleWorkspace(payload.scene); workspaceRevision = Number(payload.revision || 0); workspaceRestoring = false; var status = root.querySelector('.v492-workspace-status'); function save() { if (workspaceRestoring || generation !== workspaceGeneration) return; clearTimeout(workspaceTimer); workspaceTimer = setTimeout(async function () { if (workspaceRestoring || generation !== workspaceGeneration) return; status.textContent = 'Сохраняю…'; try { await persistWorkspace(generation, status, false); } catch (error) { status.textContent = 'Не удалось отправить на сервер. Лист открыт, повторю при следующем изменении.'; } }, 1400); } window.RTMCanvas.mount(host, {pageKey: 'developer-workspace:'+workspaceRevision, scene: workspaceScene, readOnly: false, fitToContent: false, completionRequired: false, title: '', brandColor: '#ef174c', onChange: function (scene) { if (workspaceRestoring || generation !== workspaceGeneration) return; workspaceScene = scene; save(); }, onManualSave: async function () { if (workspaceRestoring || generation !== workspaceGeneration) return; clearTimeout(workspaceTimer); await persistWorkspace(generation, status, true); }, onRequestDisk: window.RTMV46.pickDiskMedia}); host.dataset.rtmWorkspaceMounted = '1'; workspaceMounted = true; status.textContent = 'Лист загружен · ревизия ' + workspaceRevision + ' · автосохранение включено'; } catch (error) { workspaceMounted = false; workspaceRestoring = false; root.innerHTML = '<div class="v43-canvas-error"><b>Лист пока недоступен</b><span>' + esc(error.message || String(error)) + '</span><button type="button">Повторить</button></div>'; root.querySelector('button').onclick = mountWorkspace; }
  }
  function scheduleWorkspaceMount() {
    clearTimeout(workspaceMountTimer);
    workspaceMountTimer = setTimeout(function () { workspaceMountTimer = 0; mountWorkspace(); }, 30);
  }
  async function restoreWorkspace(revision) {
    workspaceRestoring = true; clearTimeout(workspaceTimer); workspaceTimer = 0; ++workspaceGeneration;
    var host = document.getElementById('v492DeveloperCanvas'); if (host && window.RTMCanvas) try { window.RTMCanvas.unmount(host); } catch (_) {}
    try {
      var result = await window.RTMV47.request('/api/v47/developer-workspace/restore', {method:'POST',body:JSON.stringify({revision:Number(revision)})});
      workspaceMounted = false; await mountWorkspace();
      var active = (workspaceScene && workspaceScene.elements || []).filter(function (el) { return !el.isDeleted; }).length;
      toast('Восстановлена ревизия '+result.source_revision+' · активных элементов: '+active);
      return result;
    } catch (error) { workspaceRestoring = false; throw error; }
  }
  window.RTMUI = window.RTMUI || {afterRender: [], adminView: []};
  window.RTMUI.adminView.push(function (view) { if (view === 'info' && isDeveloper()) scheduleWorkspaceMount(); });
  window.RTMUI.afterRender.push(function () { applyAccess(); if (state.aview === 'info') scheduleWorkspaceMount(); if (currentRole() === 'teacher') document.querySelectorAll('[data-add-project],#addProjectBtn,[data-edit-child],[data-child-menu],#addQuestionBtn,.rtm-canvas-save').forEach(function (node) { node.hidden = true; }); });
  var baseMobileMenu = window.v38RenderMobileMenu;
  if (typeof baseMobileMenu === 'function') window.v38RenderMobileMenu = function () { var result = baseMobileMenu.apply(this, arguments); renderDeveloperMobilePreview(); return result; };

  document.addEventListener('click', function (event) { var start = event.target.closest('[data-start-user-test]'); if (start) setTimeout(function () { document.querySelectorAll('[data-take-test]').forEach(function (form) { form.onsubmit = takeTestSubmit; }); }, 0); var mobileMenu = event.target.closest('#v38MobileMenuBtn'); if (mobileMenu) setTimeout(renderDeveloperMobilePreview, 0); }, true);
  document.addEventListener('DOMContentLoaded', function () { applyAccess(); if (state.aview === 'info') scheduleWorkspaceMount(); });
  window.RTMV492 = {mountWorkspace: mountWorkspace, restoreWorkspace: restoreWorkspace, previewRole: function (role) { if (!isActualDeveloper()) return; applyDeveloperPreview(role); }};
})();


/* source: v050.js */
/* RTM Education v50 test extensions. */
(function(){'use strict';
function qt(q){var t=String(q&&q.type||'single');return t==='text'?'freeText':t}function norm(v){return String(v||'').trim().replace(/\s+/g,' ').toLocaleLowerCase('ru-RU')}
var oldOptions=window.renderQOptions;window.renderQOptions=function(q,i){if(qt(q)!=='fixedText')return oldOptions(q,i);var a=q.acceptedAnswers&&q.acceptedAnswers.length?q.acceptedAnswers:[''];return a.map(function(v,n){return'<div class="answer-row"><input data-qfixed="'+i+'_'+n+'" value="'+esc(v)+'" placeholder="Правильный ответ"><button type="button" data-del-fixed="'+i+'_'+n+'">×</button></div>'}).join('')+'<button type="button" data-add-fixed="'+i+'">Добавить допустимый ответ</button>'};
var oldSave=window.saveTestFromEditor||saveTestFromEditor;window.saveTestFromEditor=saveTestFromEditor=async function(){var item=findItem(state.testId),m=j(item.PROPERTY_VALUES.meta),saved={};(m.questions||[]).forEach(function(q,i){if(qt(q)==='fixedText')saved[i]=Array.from(document.querySelectorAll('[data-qfixed^="'+i+'_"]')).map(function(n){return n.value}).filter(Boolean)});await oldSave();item=findItem(state.testId);m=j(item.PROPERTY_VALUES.meta);Object.keys(saved).forEach(function(i){m.questions[+i].type='fixedText';m.questions[+i].acceptedAnswers=saved[i]});await saveItemMeta(item.ID,m)};
function enhance(){document.querySelectorAll('[data-qtype]').forEach(function(s){if(!s.querySelector('[value="fixedText"]'))s.insertAdjacentHTML('beforeend','<option value="fixedText">Точный текст</option>');var q=j(findItem(state.testId).PROPERTY_VALUES.meta).questions[+s.dataset.qtype];s.value=qt(q)==='freeText'?'text':qt(q)});document.querySelectorAll('[data-qfixed]').forEach(function(n){n.onchange=saveTestFromEditor});document.querySelectorAll('[data-add-fixed]').forEach(function(b){b.onclick=async function(){await saveTestFromEditor();var m=j(findItem(state.testId).PROPERTY_VALUES.meta),q=m.questions[+b.dataset.addFixed];q.acceptedAnswers=q.acceptedAnswers||[];q.acceptedAnswers.push('');await saveItemMeta(state.testId,m);renderTestEditor()}});document.querySelectorAll('[data-del-fixed]').forEach(function(b){b.onclick=async function(){var p=b.dataset.delFixed.split('_').map(Number);await saveTestFromEditor();var m=j(findItem(state.testId).PROPERTY_VALUES.meta);m.questions[p[0]].acceptedAnswers.splice(p[1],1);await saveItemMeta(state.testId,m);renderTestEditor()}});var r=document.getElementById('testQuestionsEditor');if(r&&!r.querySelector('.v50-author-note'))r.insertAdjacentHTML('afterbegin','<div class="v50-author-note"><b>Полотно теста v50</b><span>Логика вопросов отделена от будущего дизайн-макета Excalidraw.</span></div>')}
var oldEditor=window.renderTestEditor;window.renderTestEditor=renderTestEditor=function(){oldEditor();enhance()};
function ctl(test,q,i){var t=qt(q),n='t'+test.ID+'q'+i;if(t==='freeText')return'<textarea class="v50-text-answer" name="'+n+'" required></textarea>';if(t==='fixedText')return'<input class="v50-text-answer fixed" name="'+n+'" placeholder="Введите ответ" required>';if(t==='match'){var p=q.pairs||[];return'<div class="v50-match">'+p.map(function(x,k){return'<div class="v50-match-row"><span>'+esc(x.left)+'</span><button type="button" data-v50-drop="'+i+'_'+k+'">Перетащите ответ</button><input type="hidden" name="'+n+'p'+k+'"></div>'}).join('')+'<div class="v50-match-bank">'+p.slice().sort(function(){return Math.random()-.5}).map(function(x){var k=p.indexOf(x);return'<button type="button" draggable="true" data-v50-choice="'+i+'_'+k+'">'+esc(x.right)+'</button>'}).join('')+'</div></div>'}return(q.answers||[]).map(function(a,k){return'<label class="v50-choice"><input type="'+(t==='multiple'?'checkbox':'radio')+'" name="'+n+'" value="'+k+'"><span>'+esc(a)+'</span></label>'}).join('')}
window.renderTakeTest=renderTakeTest=function(test){var m=testDefaults(j(test.PROPERTY_VALUES.meta)),rows=(m.questions||[]).map(function(q,i){return{q:q,i:i}});if(m.shuffleQuestions)rows.sort(function(){return Math.random()-.5});return'<form class="v50-test-sheet" data-take-test="'+test.ID+'" data-test-start="'+Date.now()+'"><header><small>RTM · ТЕСТ</small><h2>'+esc(test.NAME)+'</h2></header>'+rows.map(function(r,n){return'<section><i>'+(n+1)+'</i><h3>'+esc(r.q.text||'Вопрос')+'</h3>'+ctl(test,r.q,r.i)+'</section>'}).join('')+'<button class="primary">Проверить ответы</button></form>'};
function put(c,d){var f=d.closest('form'),p=d.dataset.v50Drop.split('_'),v=c.dataset.v50Choice.split('_')[1],x=f.querySelector('[name$="q'+p[0]+'p'+p[1]+'"]');if(!x)return;var old=f.querySelector('[data-v50-choice="'+p[0]+'_'+x.value+'"]');if(old)old.disabled=false;x.value=v;d.textContent=c.textContent;d.classList.add('filled');c.disabled=true}document.addEventListener('dragstart',function(e){var c=e.target.closest('[data-v50-choice]');if(c&&e.dataTransfer)e.dataTransfer.setData('text/rtm',c.dataset.v50Choice)});document.addEventListener('dragover',function(e){if(e.target.closest('[data-v50-drop]'))e.preventDefault()});document.addEventListener('drop',function(e){var d=e.target.closest('[data-v50-drop]');if(!d)return;e.preventDefault();var c=document.querySelector('[data-v50-choice="'+e.dataTransfer.getData('text/rtm')+'"]');if(c)put(c,d)});document.addEventListener('click',function(e){var c=e.target.closest('[data-v50-choice]'),d=e.target.closest('[data-v50-drop]');if(c&&!c.disabled){var f=c.closest('form');f.dataset.v50Pick=c.dataset.v50Choice;c.classList.add('selected')}else if(d){var f2=d.closest('form'),pick=f2.querySelector('[data-v50-choice="'+f2.dataset.v50Pick+'"]');if(pick)put(pick,d)}});
window.takeTestSubmit=takeTestSubmit=async function(e){e.preventDefault();var f=e.currentTarget,id=f.dataset.takeTest,t=findItem(id),m=testDefaults(j(t.PROPERTY_VALUES.meta));if(m.timeLimit&&Date.now()-Number(f.dataset.testStart)>m.timeLimit*60000){alert('Время теста истекло. Ответы не сохранены.');return}var good=0,auto=0,pending=false,out=[];(m.questions||[]).forEach(function(q,i){var type=qt(q),name='t'+id+'q'+i,ok=false;if(type==='freeText'){out[i]={type:type,value:f.querySelector('[name="'+name+'"]').value};pending=true;return}if(type==='fixedText'){var v=f.querySelector('[name="'+name+'"]').value;ok=(q.acceptedAnswers||[]).map(norm).includes(norm(v));out[i]={type:type,value:v}}else if(type==='match'){var v=(q.pairs||[]).map(function(_,k){var x=f.querySelector('[name="'+name+'p'+k+'"]');return x.value===''?-1:+x.value});ok=v.every(function(x,k){return x===k});out[i]={type:type,value:v}}else{var v=Array.from(f.querySelectorAll('[name="'+name+'"]:checked')).map(function(x){return+x.value}).sort(),r=(q.correct||[]).slice().sort();ok=v.join(',')===r.join(',');out[i]={type:type,value:v}}auto++;if(ok)good++});var score=auto?Math.round(good/auto*100):0,passed=!pending&&score>=m.passScore,p={courseId:String(materialCourseId(t)),testId:String(id),userId:String(effectiveUserId()),score:String(score),passed:pending?'PENDING':passed?'Y':'N',pendingReview:pending?'Y':'N',answers:JSON.stringify(out),createdAt:now()},aid=await add(E.attempts,'Попытка теста',p);state.attempts.unshift({ID:String(aid),NAME:'Попытка теста',PROPERTY_VALUES:p,DATE_CREATE:p.createdAt});if(passed)await complete(id,'test');modal('<div class="v50-result '+(pending?'pending':passed?'ok':'bad')+'"><h2>'+(pending?'Ответы приняты':passed?'Тест пройден':'Тест не пройден')+'</h2><strong>'+score+'%</strong><p>Верно: '+good+' из '+auto+'</p><button class="primary" id="v50Close">Продолжить</button></div>');document.getElementById('v50Close').onclick=function(){closeModal();var cid=materialCourseId(t),list=cid?courseChildren(cid):[],pos=list.findIndex(function(x){return String(x.ID)===String(t.ID)}),next=pos>=0?list[pos+1]:null;if(next&&canOpenCourseMaterial(next))openUserMaterial(next);else if(cid)openUserCourse(findItem(cid));else backFromUserMaterial()};renderProfile()};window.RTMV50={normalizeAnswer:norm};})();


/* source: v051.js */
/* RTM Education v50.1: bound Excalidraw tests, review workflow and reader fixes. */
(function () {
  'use strict';

  var VERSION = '50.4.0';
  var saveTimer = 0, saveChain = Promise.resolve(), publishing = false;
  var testScene = null;
  var takeAnswers = {};
  var mountedTestHost = null, testMountGeneration = 0;
  window.RTMDisposeTestMaterial = function () {
    testMountGeneration += 1;
    if (mountedTestHost && window.RTMCanvas) try { window.RTMCanvas.unmount(mountedTestHost); } catch (_) {}
    mountedTestHost = null;
  };

  function id(prefix) { return (prefix || 'rtm') + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9); }
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function roleRank(role) { return { employee: 0, student: 0, teacher: 1, moderator: 2, editor: 2, admin: 3, developer: 4 }[String(role || '')] || 0; }
  function actualRole() { return String(getAppRole(state.user) || 'employee'); }
  function canReview() { return roleRank(state.currentRole || actualRole()) >= 1; }
  function isFree(question) { return ['freeText', 'mediaFreeText', 'text'].includes(String(question && question.type || '')); }
  function isImageChoice(question) { return String(question && question.type || '') === 'imageChoice'; }
  function optionList(question) {
    if (Array.isArray(question.options) && question.options.length) return question.options.map(function (option, index) {
      return typeof option === 'string' ? {id: id('o'), text: option} : Object.assign({id: id('o'), text: 'Вариант ответа ' + (index + 1)}, option);
    });
    return (question.answers || []).map(function (text, index) { return {id: id('o'), text: text || ('Вариант ответа ' + (index + 1)), correct: (question.correct || []).includes(index)}; });
  }
  function normalizeQuestion(question, index) {
    var type = String(question && question.type || 'single');
    if (type === 'text') type = 'freeText';
    if (type === 'fixedText' || type === 'match') type = 'single';
    var next = Object.assign({}, question || {}, {id: String(question && question.id || id('q')), type: type, text: String(question && question.text || ('Вопрос ' + (index + 1)))});
    if (!isFree(next)) {
      next.options = optionList(next);
      if (!next.options.length) next.options = [{id: id('o'), text: 'Вариант ответа 1'}, {id: id('o'), text: 'Вариант ответа 2'}];
      var legacyCorrect = Array.isArray(next.correct) ? next.correct : [];
      next.options = next.options.map(function (option, optionIndex) { return Object.assign({}, option, {id: String(option.id || id('o')), correct: option.correct === true || legacyCorrect.includes(optionIndex)}); });
      if (type === 'imageTextChoice') next.options.forEach(function (option) { delete option.image; });
      next.answers = next.options.map(function (option) { return option.text || ''; });
      next.correct = next.options.map(function (option, optionIndex) { return option.correct ? optionIndex : -1; }).filter(function (value) { return value >= 0; });
    } else {
      delete next.options; delete next.answers; delete next.correct; delete next.acceptedAnswers; delete next.pairs;
    }
    return next;
  }
  function normalizeMeta(raw) {
    var meta = testDefaults(raw || {});
    meta.schemaVersion = 2;
    meta.questions = (meta.questions || []).map(normalizeQuestion);
    var automatic = meta.questions.filter(function (question) { return !isFree(question); }).length;
    meta.passRequired = Math.max(automatic ? 1 : 0, Math.min(automatic, Number(meta.passRequired == null ? Math.ceil(automatic * Number(meta.passScore || 100) / 100) : meta.passRequired)));
    return meta;
  }
  async function hydrateMetaMedia(meta) {
    var next = clone(meta), jobs = [], resolver = window.RTMV46 && window.RTMV46.resolveDiskMedia;
    if (!resolver) return next;
    next.questions.forEach(function (question) {
      if (question.media && question.media.diskId) jobs.push(resolver(question.media.diskId, question.media.title || 'media.' + (question.media.kind === 'audio' ? 'mp3' : question.media.kind === 'video' ? 'mp4' : 'jpg')).then(function (fresh) { question.media = Object.assign({}, question.media, fresh); }).catch(function (error) { console.warn('Test media refresh failed', error); }));
      (question.options || []).forEach(function (option) { if (option.image && option.image.diskId) jobs.push(resolver(option.image.diskId, option.image.title || 'image.jpg').then(function (fresh) { option.image = Object.assign({}, option.image, fresh); }).catch(function (error) { console.warn('Test image refresh failed', error); })); });
    });
    await Promise.all(jobs); return next;
  }
  function defaultQuestion(type, number) {
    var question = {id: id('q'), type: type, text: 'Текст вопроса ' + number};
    if (!isFree(question)) question.options = [1, 2, 3, 4].map(function (value) { return {id: id('o'), text: 'Вариант ответа ' + value, correct: value === 1}; });
    if (type === 'imageChoice') question.text = 'Нажмите на изображение соответствующего элемента';
    if (type === 'imageTextChoice') question.text = 'Выберите правильное название элемента на изображении';
    if (type === 'mediaFreeText') question.text = 'Прослушайте материал и ответьте на вопрос';
    if (type === 'freeText') question.text = 'Напишите ответ в свободной форме';
    return normalizeQuestion(question, number - 1);
  }

  function baseElement(type, x, y, width, height, frameId, customData) {
    return {id: id(type), type: type, x: x, y: y, width: width, height: height, angle: 0, strokeColor: '#1e1e1e', backgroundColor: 'transparent', fillStyle: 'solid', strokeWidth: 1, strokeStyle: 'solid', roughness: 0, opacity: 100, groupIds: [], frameId: frameId || null, roundness: type === 'rectangle' ? {type: 3} : null, seed: Math.floor(Math.random() * 2147483647), version: 1, versionNonce: Math.floor(Math.random() * 2147483647), isDeleted: false, boundElements: null, updated: Date.now(), link: null, locked: false, customData: customData || undefined};
  }
  function rect(x, y, width, height, colors, frameId, data) {
    var element = baseElement('rectangle', x, y, width, height, frameId, data);
    element.strokeColor = colors.stroke || '#20a35a'; element.backgroundColor = colors.fill || '#ffffff'; element.strokeWidth = colors.width || 1; element.roughness = colors.roughness == null ? 0 : colors.roughness;
    return element;
  }
  function text(x, y, width, height, value, size, frameId, data, align) {
    var element = baseElement('text', x, y, width, height, frameId, data);
    element.text = value; element.originalText = value; element.fontSize = size || 18; element.fontFamily = 5; element.textAlign = align || 'left'; element.verticalAlign = 'middle'; element.autoResize = false; element.lineHeight = 1.25; element.strokeColor = '#1e1e1e'; element.containerId = null;
    return element;
  }
  function decorate(element, questionId) { element.customData = Object.assign({}, element.customData || {}, {rtmTestQuestionId: questionId}); return element; }
  function questionBlock(question, x, y, frameId) {
    var output = [], width = 520, headerHeight = 74, bodyHeight = 230;
    var optionCount = (question.options || []).length;
    if (question.type === 'single' || question.type === 'multiple') bodyHeight = Math.max(bodyHeight, 36 + optionCount * 54);
    if (question.type === 'freeText') bodyHeight = 185;
    if (question.type === 'imageChoice') bodyHeight = Math.max(390, 34 + Math.ceil(optionCount / 2) * 170);
    if (question.type === 'imageTextChoice') bodyHeight = Math.max(365, 166 + Math.ceil(optionCount / 2) * 54);
    if (question.type === 'mediaFreeText') bodyHeight = 310;
    output.push(decorate(rect(x, y, width, headerHeight, {fill: '#ffd8a8', stroke: '#ffd8a8'}, frameId), question.id));
    output.push(decorate(text(x + 18, y + 10, width - 36, headerHeight - 20, question.text, 18, frameId, {rtmTestText: {questionId: question.id, kind: 'question'}}), question.id));
    output.push(decorate(rect(x, y + headerHeight, width, bodyHeight, {fill: '#b2f2bb', stroke: '#b2f2bb'}, frameId), question.id));
    if (question.type === 'freeText') {
      output.push(decorate(rect(x + 22, y + headerHeight + 20, width - 44, bodyHeight - 42, {fill: '#ffffff', stroke: '#159c68', width: 2}, frameId, {rtmTestControl: {kind: 'free', questionId: question.id}}), question.id));
    } else if (question.type === 'mediaFreeText') {
      output.push(decorate(rect(x + 20, y + headerHeight + 16, width - 40, 48, {fill: '#ffffff', stroke: '#159c68'}, frameId, {rtmTestControl: {kind: 'media', questionId: question.id}}), question.id));
      output.push(decorate(rect(x + 20, y + headerHeight + 82, width - 40, bodyHeight - 104, {fill: '#ffffff', stroke: '#159c68', width: 2}, frameId, {rtmTestControl: {kind: 'free', questionId: question.id}}), question.id));
    } else if (question.type === 'imageChoice') {
      (question.options || []).forEach(function (option, index) {
        var ox = x + 22 + (index % 2) * 244, oy = y + headerHeight + 22 + Math.floor(index / 2) * 170;
        output.push(decorate(rect(ox, oy, 230, 152, {fill: '#ffffff', stroke: '#20a35a'}, frameId, {rtmTestControl: {kind: 'choice', questionId: question.id, optionId: option.id}}), question.id));
      });
    } else {
      var optionStart = y + headerHeight + 18;
      if (question.type === 'imageTextChoice') {
        output.push(decorate(rect(x + 145, optionStart, 230, 128, {fill: '#ffffff', stroke: '#20a35a'}, frameId, {rtmTestControl: {kind: 'media', questionId: question.id}}), question.id));
        optionStart += 146;
      }
      (question.options || []).forEach(function (option, index) {
        var columns = question.type === 'imageTextChoice' ? 2 : 1;
        var ow = columns === 2 ? 230 : 470, ox = x + 25 + (index % columns) * 240, oy = optionStart + Math.floor(index / columns) * 54;
        var optionGroup = id('group'), control = decorate(rect(ox, oy, ow, 42, {fill: '#ffffff', stroke: '#20a35a'}, frameId, {rtmTestControl: {kind: 'choice', questionId: question.id, optionId: option.id}}), question.id), label = decorate(text(ox + 8, oy + 7, ow - 16, 28, option.text || '', 15, frameId, {rtmTestText: {questionId: question.id, kind: 'option', optionId: option.id}}, 'center'), question.id);
        control.groupIds = [optionGroup]; label.groupIds = [optionGroup]; output.push(control, label);
      });
    }
    var notes = {
      single: 'Выберите один вариант. Повторное нажатие снимает выбор.',
      multiple: 'Можно выбрать от одного до всех вариантов. Повторное нажатие снимает выбор.',
      freeText: 'Свободный ответ проверит назначенный проверяющий.',
      imageChoice: 'Нажмите одну подходящую картинку. Повторное нажатие отменяет выбор.',
      imageTextChoice: 'Выберите название, соответствующее изображению.',
      mediaFreeText: 'Прослушайте материал и напишите свободный ответ.'
    };
    var noteY = y + headerHeight + bodyHeight + 10;
    output.push(decorate(rect(x + 34, noteY, width - 68, 62, {fill: '#38d9a9', stroke: '#1f2937', width: 2}, frameId), question.id));
    output.push(decorate(text(x + 50, noteY + 10, width - 100, 42, notes[question.type] || notes.single, 14, frameId, null, 'center'), question.id));
    return {elements: output, height: headerHeight + bodyHeight + 72};
  }
  function buildScene(meta, titleValue) {
    var frameId = id('frame'), elements = [], y = 110;
    elements.push(text(70, 38, 440, 45, titleValue || 'НАЗВАНИЕ ТЕСТА', 28, frameId, {rtmTestTitle: true}, 'center'));
    (meta.questions || []).forEach(function (question) { var block = questionBlock(question, 30, y, frameId); elements = elements.concat(block.elements); y += block.height + 34; });
    var frame = baseElement('frame', 0, 0, 580, Math.max(760, y + 40), null, {rtmTestFrame: true}); frame.name = titleValue || 'Тест'; frame.strokeColor = '#adb5bd'; frame.strokeWidth = 2; frame.roundness = {type: 3};
    elements.push(frame);
    return {type: 'excalidraw', version: 2, source: 'rtm-v50.1-test', elements: elements, appState: {viewBackgroundColor: '#f8fafc', scrollX: 0, scrollY: 0, zoom: {value: 1}}, files: {}};
  }
  function syncSceneLabels(scene, meta, titleValue) {
    // Excalidraw is the source of truth. Sidebar fields mirror the drawing;
    // publishing must never rewrite manual line breaks or text geometry.
    return scene;
  }
  function pullSceneLabels(scene, meta) {
    if (!scene || !Array.isArray(scene.elements)) return;
    var questions = new Map((meta.questions || []).map(function (question) { return [String(question.id), question]; }));
    var latest = new Map();
    scene.elements.forEach(function (element) {
      if (element.isDeleted || element.type !== 'text') return;
      var binding = element.customData && element.customData.rtmTestText;
      if (!binding) return;
      var key = [binding.kind, binding.questionId, binding.optionId || ''].join(':');
      var previous = latest.get(key);
      if (!previous || Number(element.version || 0) >= Number(previous.version || 0)) latest.set(key, element);
    });
    latest.forEach(function (element) {
      var binding = element.customData && element.customData.rtmTestText, question = binding && questions.get(String(binding.questionId));
      if (!question) return;
      if (binding.kind === 'question') question.text = String(element.text || '').replace(/^\s*\d+\.\s*/, '');
      if (binding.kind === 'option') { var option = (question.options || []).find(function (row) { return String(row.id) === String(binding.optionId); }); if (option) option.text = String(element.text || ''); }
    });
  }

  function settingsMarkup(meta, item) {
    var automatic = meta.questions.filter(function (question) { return !isFree(question); }).length;
    return '<section class="v51-test-settings"><label>Название теста<input id="v51TestName" value="' + esc(item.NAME || '') + '"></label>' +
      '<div class="v51-settings-grid"><label class="v51-metric-card">Порог прохождения<input id="v51PassRequired" type="number" min="' + (automatic ? 1 : 0) + '" max="' + automatic + '" value="' + meta.passRequired + '"><small>из ' + automatic + ' автоматически проверяемых вопросов</small></label>' +
      '<label class="v51-metric-card">Попыток доступно<input id="v51Attempts" type="number" min="1" value="' + meta.attemptsLimit + '"><small>Количество попыток на сотрудника</small></label>' +
      '<label class="v51-metric-card">Ограничение времени<input id="v51Time" type="number" min="0" value="' + meta.timeLimit + '"><small>В минутах, 0 — без ограничения</small></label>' +
      '<label class="v51-metric-card">Очки<input id="v51Points" type="number" min="0" value="' + meta.points + '"><small>За успешное прохождение</small></label></div>' +
      '<div class="v51-checks"><label class="v51-toggle-card"><input id="v51ShuffleQuestions" type="checkbox" ' + (meta.shuffleQuestions ? 'checked' : '') + '><span class="v51-toggle" aria-hidden="true"></span><span><b>Перемешивать вопросы</b><small>Новый порядок при каждой попытке</small></span></label><label class="v51-toggle-card"><input id="v51ShuffleAnswers" type="checkbox" ' + (meta.shuffleAnswers ? 'checked' : '') + '><span class="v51-toggle" aria-hidden="true"></span><span><b>Перемешивать ответы</b><small>Случайный порядок вариантов</small></span></label><label class="v51-toggle-card"><input id="v51ShowCorrect" type="checkbox" ' + (meta.showCorrect ? 'checked' : '') + '><span class="v51-toggle" aria-hidden="true"></span><span><b>Показывать результат</b><small>После завершения попытки</small></span></label><label class="v51-toggle-card"><input id="v51Certificate" type="checkbox" ' + (meta.certificate ? 'checked' : '') + '><span class="v51-toggle" aria-hidden="true"></span><span><b>Сертификат</b><small>Выдать после успешного теста</small></span></label></div></section>';
  }
  function typeOptions(selected) {
    return [['single', 'Один ответ'], ['multiple', 'Несколько ответов'], ['freeText', 'Свободный ответ'], ['imageChoice', 'Выбор изображения'], ['imageTextChoice', 'Изображение и варианты'], ['mediaFreeText', 'Аудио/медиа и свободный ответ']].map(function (row) { return '<option value="' + row[0] + '" ' + (selected === row[0] ? 'selected' : '') + '>' + row[1] + '</option>'; }).join('');
  }
  function questionMarkup(question, index) {
    var choices = isFree(question) ? '<p class="v51-free-note">Правильный ответ не задаётся. Ответ проверяет назначенный проверяющий.</p>' :
      '<div class="v51-option-list">' + (question.options || []).map(function (option, optionIndex) {
        return '<div class="v51-option-row"><input data-v51-option="' + question.id + ':' + option.id + '" value="' + esc(option.text || '') + '" placeholder="Вариант ответа">' +
          (isImageChoice(question) ? '<button type="button" data-v51-option-image="' + question.id + ':' + option.id + '">' + (option.image && option.image.url ? 'Заменить фото' : 'Фото в рамку') + '</button>' : '') +
          '<label><input type="' + (question.type === 'multiple' ? 'checkbox' : 'radio') + '" name="v51correct_' + question.id + '" data-v51-correct="' + question.id + ':' + option.id + '" ' + (option.correct ? 'checked' : '') + '> правильный</label>' +
          '<button type="button" class="danger" data-v51-remove-option="' + question.id + ':' + option.id + '" ' + ((question.options || []).length <= 1 ? 'disabled' : '') + '>×</button></div>';
      }).join('') + '<button type="button" data-v51-add-option="' + question.id + '">Добавить вариант</button></div>';
    var media = ['imageTextChoice', 'mediaFreeText'].includes(question.type) ? '<div class="v51-media-row"><button type="button" data-v51-question-media="' + question.id + '">' + (question.media && question.media.url ? 'Заменить медиа' : 'Добавить фото / аудио / видео') + '</button>' + (question.media && question.media.url ? '<button type="button" class="danger" data-v51-remove-media="' + question.id + '">Убрать</button><small>' + esc(question.media.title || question.media.url) + '</small>' : '') + '</div>' : '';
    return '<article class="v51-question-editor" data-v51-question-card="' + question.id + '"><header><b>Вопрос ' + (index + 1) + '</b><select data-v51-type="' + question.id + '">' + typeOptions(question.type) + '</select><button type="button" class="danger" data-v51-remove-question="' + question.id + '">Удалить</button></header><label>Текст вопроса<textarea data-v51-question-text="' + question.id + '">' + esc(question.text || '') + '</textarea></label>' + media + choices + '</article>';
  }
  function templatesMarkup() {
    return '<div class="v51-template-panel v53-template-panel"><b>Добавить вопрос по шаблону</b><button type="button" class="primary" id="v51FullTemplate" title="Заменить вопросы демонстрационным набором"><b>Все 5 типов</b><small>Готовый пример полного теста</small></button>' +
      '<button type="button" title="Готовые варианты ответа" data-v51-add-type="single"><b>Ответы</b><small>Выбор одного или нескольких вариантов</small></button><button type="button" title="Ответ вводится с клавиатуры" data-v51-add-type="freeText"><b>Свободный текст</b><small>Развёрнутый ответ для проверки</small></button><button type="button" title="Нужно нажать на правильное изображение" data-v51-add-type="imageChoice"><b>Выбор фото</b><small>Выбор правильного изображения</small></button><button type="button" title="Изображение и текстовые варианты" data-v51-add-type="imageTextChoice"><b>Фото и ответы</b><small>Вопрос по фото с вариантами</small></button><button type="button" title="Прослушать запись и написать ответ" data-v51-add-type="mediaFreeText"><b>Аудио и ответ</b><small>Медиа со свободным ответом</small></button></div>';
  }
  function editorMarkup(meta, item) {
    return '<div class="v51-test-editor">' + settingsMarkup(meta, item) + templatesMarkup() + '<div class="v51-builder"><section class="v51-canvas-column"><div class="v51-canvas-help">Интерактивные рамки можно перемещать и изменять как обычные элементы Excalidraw. Логика ответа остаётся привязанной к рамке.</div><div id="v51TestCanvas"></div></section><aside class="v51-question-list">' + (meta.questions.map(questionMarkup).join('') || '<div class="panel">Добавьте первый вопрос или полный шаблон.</div>') + '</aside></div></div>';
  }
  function currentTest() { return findItem(state.testId); }
  function currentMeta() { var item = currentTest(); return normalizeMeta(j(item && item.PROPERTY_VALUES && item.PROPERTY_VALUES.meta)); }
  function knowledgeTarget(meta) {
    return meta && meta.knowledgeCentralDocumentId ? {documentId: meta.knowledgeCentralDocumentId, kind: meta.knowledgeCentralKind === 'full' ? 'full' : 'light'} : null;
  }
  async function saveKnowledgeMeta(item, meta, name) {
    var target = knowledgeTarget(meta), cleanMeta = clone(meta); if (!target) return false;
    delete cleanMeta.knowledgeCentralDocumentId; delete cleanMeta.knowledgeCentralKind;
    cleanMeta.title = name || item.NAME; cleanMeta.kind = target.kind; cleanMeta.created = true;
    var payload = {}; payload[target.kind === 'light' ? 'lightTest' : 'fullTest'] = cleanMeta;
    await window.RTMV47.request('/api/v47/knowledge/documents/' + target.documentId, {method: 'PUT', body: JSON.stringify(payload)});
    item.NAME = cleanMeta.title;
    item.PROPERTY_VALUES.meta = json(Object.assign({}, cleanMeta, {knowledgeCentralDocumentId: target.documentId, knowledgeCentralKind: target.kind}));
    return true;
  }
  var legacySaveItemMeta = window.saveItemMeta;
  window.saveItemMeta = async function (itemId, meta) {
    var item = findItem(itemId);
    if (item && await saveKnowledgeMeta(item, meta, item.NAME)) return;
    return legacySaveItemMeta(itemId, meta);
  };
  function persistEditor(showToast) {
    clearTimeout(saveTimer); saveTimer = 0;
    var snapshotScene = clone(testScene);
    var task = async function () {
    var item = currentTest(); if (!item) return;
    var meta = currentMeta(), name = String(document.getElementById('v51TestName') && document.getElementById('v51TestName').value || item.NAME).trim() || item.NAME;
    meta.passRequired = Number(document.getElementById('v51PassRequired') && document.getElementById('v51PassRequired').value || meta.passRequired);
    meta.attemptsLimit = Number(document.getElementById('v51Attempts') && document.getElementById('v51Attempts').value || meta.attemptsLimit);
    meta.timeLimit = Number(document.getElementById('v51Time') && document.getElementById('v51Time').value || 0);
    meta.points = Number(document.getElementById('v51Points') && document.getElementById('v51Points').value || 0);
    meta.shuffleQuestions = Boolean(document.getElementById('v51ShuffleQuestions') && document.getElementById('v51ShuffleQuestions').checked);
    meta.shuffleAnswers = Boolean(document.getElementById('v51ShuffleAnswers') && document.getElementById('v51ShuffleAnswers').checked);
    meta.showCorrect = Boolean(document.getElementById('v51ShowCorrect') && document.getElementById('v51ShowCorrect').checked);
    meta.certificate = Boolean(document.getElementById('v51Certificate') && document.getElementById('v51Certificate').checked);
    meta.questions.forEach(function (question) {
      var questionInput = document.querySelector('[data-v51-question-text="' + question.id + '"]');
      if (questionInput) question.text = questionInput.value;
      (question.options || []).forEach(function (option) {
        var optionInput = document.querySelector('[data-v51-option="' + question.id + ':' + option.id + '"]');
        if (optionInput) option.text = optionInput.value;
      });
    });
    pullSceneLabels(snapshotScene || testScene || meta.testScene, meta);
    meta.questions.forEach(function (question) {
      (question.options || []).forEach(function (option) { var correct = document.querySelector('[data-v51-correct="' + question.id + ':' + option.id + '"]'); option.correct = Boolean(correct && correct.checked); });
      question.answers = (question.options || []).map(function (option) { return option.text; }); question.correct = (question.options || []).map(function (option, index) { return option.correct ? index : -1; }).filter(function (value) { return value >= 0; });
    });
    meta.testScene = syncSceneLabels(snapshotScene || testScene || meta.testScene || buildScene(meta, name), meta, name);
    testScene = meta.testScene;
    var props = Object.assign({}, item.PROPERTY_VALUES, {meta: json(meta), updatedAt: now()});
    updateLocalItem(item.ID, name, props); if (!await saveKnowledgeMeta(item, meta, name)) await upd(E.items, item.ID, name, props); var titleNode = document.getElementById('testEditorTitle'); if (titleNode) titleNode.textContent = name; if (showToast) toast('Тест сохранён');
    };
    saveChain=saveChain.then(task,task);
    return saveChain;
  }
  function scheduleSave() { clearTimeout(saveTimer); saveTimer = setTimeout(function () { persistEditor(false).catch(function (error) { console.error('v50.1 test autosave failed', error); }); }, 650); }
  function rebuildQuestion(meta, questionId, name) {
    var question = meta.questions.find(function (row) { return String(row.id) === String(questionId); }); if (!question) return;
    var scene = testScene || meta.testScene || buildScene(meta, name), old = scene.elements.filter(function (element) { return element.customData && String(element.customData.rtmTestQuestionId || '') === String(questionId); });
    var minX = old.length ? Math.min.apply(null, old.map(function (element) { return Number(element.x || 0); })) : 30;
    var minY = old.length ? Math.min.apply(null, old.map(function (element) { return Number(element.y || 0); })) : Math.max(110, scene.elements.reduce(function (value, element) { return Math.max(value, Number(element.y || 0) + Number(element.height || 0)); }, 80) + 30);
    var frame = scene.elements.find(function (element) { return element.type === 'frame' && !element.isDeleted; }), generated = questionBlock(question, minX, minY, frame && frame.id);
    scene.elements = scene.elements.filter(function (element) { return !(element.customData && String(element.customData.rtmTestQuestionId || '') === String(questionId)); }).concat(generated.elements);
    if (frame) frame.height = Math.max(Number(frame.height || 0), minY + generated.height + 50 - Number(frame.y || 0));
    testScene = scene; meta.testScene = scene;
  }

  async function mountEditorCanvas(meta, item) {
    var host = document.getElementById('v51TestCanvas'); if (!host || !window.RTMCanvas) return setTimeout(function () { mountEditorCanvas(meta, item); }, 120);
    testScene = clone(meta.testScene || buildScene(meta, item.NAME)); meta.testScene = testScene;
    var displayMeta = await hydrateMetaMedia(meta); if (!host.isConnected) return;
    window.RTMCanvas.mount(host, {pageKey: 'test-author:' + item.ID, scene: testScene, readOnly: false, fitToContent: true, completionRequired: false, testMode: 'author', testDefinition: displayMeta, title: item.NAME, brandColor: '#ef174c', onRequestDisk: window.RTMV46 && window.RTMV46.pickDiskMedia, onChange: function (scene) { testScene = scene; scheduleSave(); }, onManualSave: function () { return persistEditor(true); }});
  }
  function fullTemplate() { return [defaultQuestion('single', 1), defaultQuestion('freeText', 2), defaultQuestion('imageChoice', 3), defaultQuestion('imageTextChoice', 4), defaultQuestion('mediaFreeText', 5)]; }
  function bindEditor(meta, item) {
    document.querySelectorAll('#v51TestName,#v51PassRequired,#v51Attempts,#v51Time,#v51Points,#v51ShuffleQuestions,#v51ShuffleAnswers,#v51ShowCorrect,#v51Certificate,[data-v51-question-text],[data-v51-option],[data-v51-correct]').forEach(function (node) { node.addEventListener(node.matches('input[type=checkbox],input[type=radio],select') ? 'change' : 'input', scheduleSave); });
    document.getElementById('v51FullTemplate').onclick = async function () {
      if (meta.questions.length && !confirm('Заменить текущие вопросы и макет пятью шаблонными вопросами?')) return;
      meta.questions = fullTemplate(); meta.passRequired = Math.max(1, meta.questions.filter(function (question) { return !isFree(question); }).length); testScene = buildScene(meta, item.NAME); meta.testScene = testScene;
      item.PROPERTY_VALUES.meta = json(meta); await saveItemMeta(item.ID, meta); window.renderTestEditor();
    };
    document.querySelectorAll('[data-v51-add-type]').forEach(function (button) { button.onclick = async function () {
      await persistEditor(false); meta = currentMeta(); var question = defaultQuestion(button.dataset.v51AddType, meta.questions.length + 1); meta.questions.push(question); rebuildQuestion(meta, question.id, item.NAME); meta.testScene = testScene; await saveItemMeta(item.ID, meta); window.renderTestEditor();
    }; });
    document.querySelectorAll('[data-v51-type]').forEach(function (select) { select.onchange = async function () {
      await persistEditor(false); meta = currentMeta(); var question = meta.questions.find(function (row) { return String(row.id) === String(select.dataset.v51Type); }); if (!question) return; question.type = select.value; var replacement = defaultQuestion(question.type, meta.questions.indexOf(question) + 1); question.options = replacement.options; if (isFree(question)) { delete question.options; delete question.answers; delete question.correct; } rebuildQuestion(meta, question.id, item.NAME); meta.testScene = testScene; await saveItemMeta(item.ID, meta); window.renderTestEditor();
    }; });
    document.querySelectorAll('[data-v51-add-option]').forEach(function (button) { button.onclick = async function () {
      await persistEditor(false); meta = currentMeta(); var question = meta.questions.find(function (row) { return String(row.id) === String(button.dataset.v51AddOption); }); if (!question) return; question.options = question.options || []; question.options.push({id: id('o'), text: 'Вариант ответа ' + (question.options.length + 1), correct: false}); rebuildQuestion(meta, question.id, item.NAME); meta.testScene = testScene; await saveItemMeta(item.ID, meta); window.renderTestEditor();
    }; });
    document.querySelectorAll('[data-v51-remove-option]').forEach(function (button) { button.onclick = async function () {
      await persistEditor(false); meta = currentMeta(); var parts = button.dataset.v51RemoveOption.split(':'), question = meta.questions.find(function (row) { return String(row.id) === String(parts[0]); }); if (!question || question.options.length <= 1) return; question.options = question.options.filter(function (option) { return String(option.id) !== String(parts[1]); }); rebuildQuestion(meta, question.id, item.NAME); meta.testScene = testScene; await saveItemMeta(item.ID, meta); window.renderTestEditor();
    }; });
    document.querySelectorAll('[data-v51-remove-question]').forEach(function (button) { button.onclick = async function () {
      if (!confirm('Удалить вопрос и его связанные элементы с доски?')) return; await persistEditor(false); meta = currentMeta(); var questionId = button.dataset.v51RemoveQuestion; meta.questions = meta.questions.filter(function (question) { return String(question.id) !== String(questionId); }); testScene = testScene || meta.testScene; if (testScene) testScene.elements = testScene.elements.filter(function (element) { return !(element.customData && String(element.customData.rtmTestQuestionId || '') === String(questionId)); }); meta.testScene = testScene; await saveItemMeta(item.ID, meta); window.renderTestEditor();
    }; });
    document.querySelectorAll('[data-v51-question-media]').forEach(function (button) { button.onclick = async function () {
      await persistEditor(false); var media = await window.RTMV46.pickDiskMedia(); if (!media) return; meta = currentMeta(); var question = meta.questions.find(function (row) { return String(row.id) === String(button.dataset.v51QuestionMedia); }); if (!question) return; question.media = media; await saveItemMeta(item.ID, meta); window.renderTestEditor();
    }; });
    document.querySelectorAll('[data-v51-remove-media]').forEach(function (button) { button.onclick = async function () { await persistEditor(false); meta = currentMeta(); var question = meta.questions.find(function (row) { return String(row.id) === String(button.dataset.v51RemoveMedia); }); if (question) delete question.media; await saveItemMeta(item.ID, meta); window.renderTestEditor(); }; });
    document.querySelectorAll('[data-v51-option-image]').forEach(function (button) { button.onclick = async function () {
      await persistEditor(false); var media = await window.RTMV46.pickDiskMedia(); if (!media) return; meta = currentMeta(); var parts = button.dataset.v51OptionImage.split(':'), question = meta.questions.find(function (row) { return String(row.id) === String(parts[0]); }), option = question && question.options.find(function (row) { return String(row.id) === String(parts[1]); }); if (option) option.image = media; await saveItemMeta(item.ID, meta); window.renderTestEditor();
    }; });
    mountEditorCanvas(meta, item);
  }

  window.renderTestEditor = function () {
    var item = currentTest(), root = document.getElementById('testQuestionsEditor'); if (!item || !root) return;
    var meta = normalizeMeta(j(item.PROPERTY_VALUES.meta)); root.innerHTML = editorMarkup(meta, item); renderAssignmentPanel('test'); bindTestTabs(); bindEditor(meta, item);
  };
  window.saveTestFromEditor = saveTestFromEditor = function () { return persistEditor(false); };
  window.addQuestion = addQuestion = async function () {
    var item = currentTest(); if (!item) return; await persistEditor(false); var meta = currentMeta(), question = defaultQuestion('single', meta.questions.length + 1); meta.questions.push(question); rebuildQuestion(meta, question.id, item.NAME); meta.testScene = testScene; await saveItemMeta(item.ID, meta); window.renderTestEditor(); toast('Вопрос добавлен');
  };
  window.publishTest = publishTest = async function () {
    if(publishing)return;
    publishing=true;
    try{
    clearTimeout(saveTimer);saveTimer=0;
    await persistEditor(false); var item = currentTest(), meta = currentMeta();
    if (!meta.questions.length) return alert('Добавьте хотя бы один вопрос.');
    for (var index = 0; index < meta.questions.length; index += 1) {
      var question = meta.questions[index]; if (!String(question.text || '').trim()) return alert('Заполните текст вопроса ' + (index + 1) + '.');
      if (!isFree(question) && !(question.options || []).some(function (option) { return option.correct; })) return alert('Выберите правильный ответ в вопросе ' + (index + 1) + '.');
      if (!isFree(question) && (question.options || []).some(function (option) { return !String(option.text || '').trim() && !(option.image && option.image.url); })) return alert('Заполните все варианты вопроса ' + (index + 1) + '.');
    }
    var props = Object.assign({}, item.PROPERTY_VALUES, {status: 'published', meta: json(meta), updatedAt: now()}); updateLocalItem(item.ID, item.NAME, props); if (await saveKnowledgeMeta(item, meta, item.NAME)) { window.renderTestEditor(); toast('Тест сохранён и опубликован'); return; } await upd(E.items, item.ID, item.NAME, props); await addEvent('Публикация', item); await loadAll(true); openTestEditor(item.ID); toast('Тест опубликован');
    }finally{publishing=false;}
  };

  function userAttempt(testId, statuses) {
    var uid = String(typeof rtmCanonicalUserId === 'function' ? rtmCanonicalUserId(effectiveUserId()) : effectiveUserId());
    return state.attempts.filter(function (attempt) { var props = attempt.PROPERTY_VALUES || {}; return String(props.testId) === String(testId) && String(props.userId) === uid && (!statuses || statuses.includes(String(props.reviewStatus || props.status || ''))); }).sort(function (a, b) { return String(b.PROPERTY_VALUES.updatedAt || b.PROPERTY_VALUES.createdAt || '').localeCompare(String(a.PROPERTY_VALUES.updatedAt || a.PROPERTY_VALUES.createdAt || '')); })[0] || null;
  }
  function remainingAttempts(test, meta) { var returned = userAttempt(test.ID, ['returned']); return returned ? Math.max(1, Number(meta.attemptsLimit || 1) - testAttemptsUsed(test.ID) + 1) : Math.max(0, Number(meta.attemptsLimit || 1) - testAttemptsUsed(test.ID)); }
  window.renderUserTestIntro = function (test) {
    var meta = normalizeMeta(j(test.PROPERTY_VALUES.meta)), left = remainingAttempts(test, meta), pending = userAttempt(test.ID, ['pending_review']), returned = userAttempt(test.ID, ['returned']);
    return '<div class="test-intro-card v492-test-intro v51-test-intro"><h2>' + esc(test.NAME) + '</h2>' + (pending ? '<div class="v51-status pending">Свободный ответ ожидает проверки. Можно пройти тест ещё раз; проверяющий увидит последнюю отправку.</div>' : '') + (returned ? '<div class="v51-status returned">Ответ возвращён на доработку' + (returned.PROPERTY_VALUES.reviewComment ? ': ' + esc(returned.PROPERTY_VALUES.reviewComment) : '') + '</div>' : '') + '<div class="test-info-grid"><span><small>Доступное время</small><b>' + (meta.timeLimit ? meta.timeLimit + ' мин' : 'Без ограничения') + '</b></span><span><small>Попыток доступно</small><b>' + left + '</b></span><span><small>Порог прохождения</small><b>' + meta.passRequired + ' из ' + meta.questions.filter(function (question) { return !isFree(question); }).length + '</b></span><span><small>Очки</small><b>' + meta.points + '</b></span><span><small>Показывать результат</small><b>' + (meta.showCorrect ? 'Да' : 'Нет') + '</b></span><span><small>Сертификат</small><b>' + (meta.certificate ? 'Да' : 'Нет') + '</b></span></div><button class="primary" data-start-user-test="' + test.ID + '" ' + (left <= 0 ? 'disabled' : '') + '>' + (returned ? 'Исправить ответы' : pending ? 'Пройти ещё раз' : 'Приступить') + '</button></div>';
  };
  window.renderTakeTest = function (test) {
    var meta = normalizeMeta(j(test.PROPERTY_VALUES.meta));
    if (!meta.testScene) meta.testScene = buildScene(meta, test.NAME);
    // Legacy resume/retry paths replace the markup directly and bypass the
    // start-button click handler. Always schedule the visual scene here so a
    // reopened attempt cannot leave a zero-height canvas.
    var mountGeneration=++testMountGeneration, materialToken=window.RTMMaterialSession&&window.RTMMaterialSession.current();
    if(window.RTMMaterialSession)window.RTMMaterialSession.schedule(function(){mountTakeCanvas(findItem(test.ID)||test,mountGeneration,materialToken,0)},0,materialToken);
    else setTimeout(function () { mountTakeCanvas(findItem(test.ID) || test,mountGeneration,null,0); }, 0);
    var preview=Boolean(normalizeMeta(j(test.PROPERTY_VALUES.meta)).knowledgePreviewAnswers);
    return '<form class="v51-take-test'+(preview?' is-knowledge-preview':'')+'" data-take-test="' + test.ID + '" data-test-start="' + Date.now() + '">'+(preview?'<div class="v51-status preview">Предпросмотр как у ученика. Правильные ответы отмечены; прохождение не сохраняется.</div>':'')+'<div class="v51-test-clock" data-v51-test-clock hidden></div><div id="v51TakeCanvas" class="v51-take-canvas"></div>'+(preview?'':'<div class="v51-test-submit-bar"><button class="primary" type="submit">Отправить ответы</button></div>')+'</form>';
  };
  function shuffleRows(rows) { var result = rows.slice(); for (var i = result.length - 1; i > 0; i -= 1) { var j = Math.floor(Math.random() * (i + 1)), value = result[i]; result[i] = result[j]; result[j] = value; } return result; }
  function orderKey(test) { return 'rtm_v5031_order:' + String(test.ID) + ':' + String(typeof rtmCanonicalUserId === 'function' ? rtmCanonicalUserId(effectiveUserId()) : effectiveUserId()); }
  function orderedMeta(test, meta) {
    var key = orderKey(test), saved = {}; try { saved = JSON.parse(localStorage.getItem(key) || '{}'); } catch (_) {}
    var questionIds = (meta.questions || []).map(function (q) { return String(q.id); });
    if (!Array.isArray(saved.questions) || saved.questions.slice().sort().join('|') !== questionIds.slice().sort().join('|')) { saved.questions = meta.shuffleQuestions ? shuffleRows(questionIds) : questionIds.slice(); saved.answers = {}; }
    saved.answers = saved.answers || {};
    var byId = new Map(meta.questions.map(function (q) { return [String(q.id), clone(q)]; }));
    var next = clone(meta); next.questions = saved.questions.map(function (qid) { var q = byId.get(String(qid)); if (!q) return null; var ids = (q.options || []).map(function (o) { return String(o.id); }); if (!Array.isArray(saved.answers[qid]) || saved.answers[qid].slice().sort().join('|') !== ids.slice().sort().join('|')) saved.answers[qid] = meta.shuffleAnswers ? shuffleRows(ids) : ids.slice(); var options = new Map((q.options || []).map(function (o) { return [String(o.id), o]; })); q.options = saved.answers[qid].map(function (id) { return options.get(String(id)); }).filter(Boolean); return q; }).filter(Boolean);
    localStorage.setItem(key, JSON.stringify(saved)); return next;
  }
  async function mountTakeCanvas(test,mountGeneration,materialToken,retryCount) {
    var session=window.RTMMaterialSession;
    if(mountGeneration!==testMountGeneration||(session&&materialToken&&!session.isCurrent(materialToken,test.ID)))return;
    var host = document.getElementById('v51TakeCanvas'), form = host && host.closest('form');
    if (!host || !form || !window.RTMCanvas) {
      if((retryCount||0)>=25)return;
      if(session)return session.schedule(function(){mountTakeCanvas(test,mountGeneration,materialToken,(retryCount||0)+1)},120,materialToken);
      return setTimeout(function () { mountTakeCanvas(test,mountGeneration,null,(retryCount||0)+1); }, 120);
    }
    if(mountGeneration!==testMountGeneration||String(form.dataset.takeTest)!==String(test.ID))return;
    if (mountedTestHost && mountedTestHost !== host && window.RTMCanvas) try { window.RTMCanvas.unmount(mountedTestHost); } catch (_) {}
    if (host.dataset.rtmMountedTest === String(test.ID) && host.childElementCount) { if (window.RTMCanvas) try { window.RTMCanvas.unmount(host); } catch (_) {} }
    host.dataset.rtmMountedTest = String(test.ID);
    var originalMeta = normalizeMeta(j(test.PROPERTY_VALUES.meta)), meta = await hydrateMetaMedia(orderedMeta(test, originalMeta)), latest = userAttempt(test.ID), existing = latest && latest.PROPERTY_VALUES && latest.PROPERTY_VALUES.answers, previous = {};
    try { previous = existing ? JSON.parse(existing) : {}; } catch (_) { previous = {}; }
    var preview=Boolean(originalMeta.knowledgePreviewAnswers);
    takeAnswers = {}; meta.questions.forEach(function (question) {
      if(preview&&!isFree(question))takeAnswers[question.id]=(question.options||[]).filter(function(option){return option.correct;}).map(function(option){return option.id;});
      else if (isFree(question) && previous[question.id] != null) takeAnswers[question.id] = previous[question.id];
    });
    mountedTestHost = host;
    var scene = (meta.shuffleQuestions || meta.shuffleAnswers) && window.RTMV52 && window.RTMV52.createScene ? await window.RTMV52.createScene(meta, test.NAME) : meta.testScene || buildScene(meta, test.NAME);
    function remount() { if (!host.isConnected||(session&&materialToken&&!session.isCurrent(materialToken,test.ID))) return; window.RTMCanvas.mount(host, {pageKey: 'test-take:' + test.ID, scene: scene, readOnly: true, fitToContent: true, completionRequired: false, testMode: 'take', testDefinition: meta, testAnswers: takeAnswers, brandColor: '#ef174c', onTestAnswer: preview?function(){}:function (questionId, value) { takeAnswers[questionId] = value; if(session)session.schedule(remount,0,materialToken);else setTimeout(remount,0); }}); }
    remount(); if(!preview)form.onsubmit = window.takeTestSubmit;else form.onsubmit=function(event){event.preventDefault();};
    clearTimeout(form._v51timer); var clock = form.querySelector('[data-v51-test-clock]');
    if (meta.timeLimit && clock) { clock.hidden = false; (function tick() { var left = Number(form.dataset.testStart) + Number(meta.timeLimit) * 60000 - Date.now(); clock.textContent = 'Осталось ' + Math.max(0, Math.floor(left / 60000)) + ':' + String(Math.max(0, Math.ceil(left / 1000) % 60)).padStart(2, '0'); if (left <= 0) { if (!form.dataset.submitting) { form.dataset.timedOut = '1'; form.requestSubmit(); } return; } form._v51timer = setTimeout(tick, 500); })(); }
  }
  function selectedCorrect(question, value) {
    var selected = Array.isArray(value) ? value.map(String).sort() : [], correct = (question.options || []).filter(function (option) { return option.correct; }).map(function (option) { return String(option.id); }).sort();
    return selected.join(',') === correct.join(',');
  }
  async function notifyUser(userId, message) {
    if (!userId || !window.RTMV47 || !window.RTMV47.bitrixCall) return;
    try { await window.RTMV47.bitrixCall('im.notify.personal.add', {to: Number(userId) || userId, message: message}); } catch (error) { console.warn('RTM notification failed', error); }
  }
  function courseReviewer(test) { var course = findItem(materialCourseId(test) || test.PROPERTY_VALUES.parentId), meta = course && j(course.PROPERTY_VALUES.meta); return String(meta && meta.reviewerId || ''); }
  window.takeTestSubmit = takeTestSubmit = async function (event) {
    event.preventDefault(); var form = event.currentTarget, test = findItem(form.dataset.takeTest); if (!test) return;
    var materialSession=window.RTMMaterialSession,materialToken=materialSession&&materialSession.current();
    if (form.dataset.submitting) return; form.dataset.submitting = '1'; clearTimeout(form._v51timer);
    var submitButton=form.querySelector('button[type="submit"]');if(submitButton){submitButton.disabled=true;submitButton.dataset.label=submitButton.textContent;submitButton.textContent='Отправляем ответы…';}
    var meta = normalizeMeta(j(test.PROPERTY_VALUES.meta)), timedOut = form.dataset.timedOut === '1' || meta.timeLimit && (Date.now() - Number(form.dataset.testStart || Date.now())) > meta.timeLimit * 60000;
    var good = 0, automatic = 0, hasFree = false;
    meta.questions.forEach(function (question) { if (isFree(question)) hasFree = true; else { automatic += 1; if (selectedCorrect(question, takeAnswers[question.id])) good += 1; } });
    if (timedOut) hasFree = false;
    var autoPassed = !timedOut && (automatic === 0 || good >= Number(meta.passRequired || 0)), score = automatic ? Math.round(good / automatic * 100) : timedOut ? 0 : 100, reviewerId = courseReviewer(test), returned = timedOut ? null : userAttempt(test.ID, ['returned']);
    var props = {courseId: String(materialCourseId(test) || test.PROPERTY_VALUES.parentId || ''), testId: String(test.ID), userId: String(typeof rtmCanonicalUserId === 'function' ? rtmCanonicalUserId(effectiveUserId()) : effectiveUserId()), score: String(score), automaticCorrect: String(good), automaticTotal: String(automatic), automaticPassed: autoPassed ? 'Y' : 'N', passed: hasFree ? 'PENDING' : autoPassed ? 'Y' : 'N', pendingReview: hasFree ? 'Y' : 'N', reviewStatus: hasFree ? 'pending_review' : autoPassed ? 'auto_passed' : 'auto_failed', reviewerId: reviewerId, answers: JSON.stringify(takeAnswers), testSnapshot: JSON.stringify({schemaVersion: 2, title: test.NAME, questions: meta.questions}), revision: String(Number(returned && returned.PROPERTY_VALUES.revision || 0) + 1), createdAt: returned && returned.PROPERTY_VALUES.createdAt || now(), updatedAt: now()};
    var attemptId,persisted=false;try{
    if (returned) { attemptId = returned.ID; await upd(E.attempts, returned.ID, returned.NAME || 'Попытка теста', props); returned.PROPERTY_VALUES = props; }
    else { attemptId = await add(E.attempts, 'Попытка теста', props); state.attempts.unshift({ID: String(attemptId), NAME: 'Попытка теста', PROPERTY_VALUES: props, DATE_CREATE: props.createdAt}); }
    localStorage.removeItem(orderKey(test));
    if (autoPassed) await complete(test.ID, 'test');
    persisted=true;
    if (hasFree) { var destination = reviewerId || ((state.users || []).find(function (user) { return ['admin', 'developer'].includes(getAppRole(user)); }) || {}).ID; await notifyUser(destination, 'В RTM Education новый свободный ответ по тесту «' + test.NAME + '» ожидает проверки.'); }
    if(materialSession&&materialToken&&!materialSession.isCurrent(materialToken,test.ID))return;
    var title = timedOut ? 'Время истекло — тест не пройден' : hasFree ? (autoPassed ? 'Автоматическая часть пройдена' : 'Автоматическая часть не пройдена') : autoPassed ? 'Тест пройден' : 'Тест не пройден';
    var message = hasFree ? '<p>Свободный ответ отправлен проверяющему.</p>' + (autoPassed ? '<p>Следующий материал доступен.</p>' : '<p>Для открытия следующего материала сначала пройдите автоматическую часть.</p>') : '';
    var left = remainingAttempts(test, meta);
    modal('<div class="test-outcome ' + (autoPassed ? hasFree ? 'pending' : 'ok' : 'bad') + '"><h2>' + title + '</h2><p>Верно: <b>' + good + ' из ' + automatic + '</b></p>' + (timedOut ? '<p>Попыток осталось: <b>' + left + '</b></p>' : message) + (timedOut && left > 0 ? '<button class="primary" id="v51OutcomeRetry">Пройти заново</button>' : '') + '<button id="v51OutcomeNext">Продолжить</button></div>');
    var retryButton = document.getElementById('v51OutcomeRetry'); if (retryButton) retryButton.onclick = function () { closeModal(); var body = document.getElementById('uMaterialBody'); if (body) { body.innerHTML = renderTakeTest(test); document.querySelectorAll('[data-take-test]').forEach(function (row) { row.onsubmit = takeTestSubmit; }); } };
    var nextButton=document.getElementById('v51OutcomeNext');if(nextButton)nextButton.onclick=function(){closeModal();if(autoPassed||!meta.required)adjacentMat(1);else openUserMaterial(test);};
    toast('Ответы сохранены');try{renderProfile();renderUserCourses();}catch(renderError){console.warn('Post-submit refresh failed',renderError);}
    }catch(error){delete form.dataset.submitting;if(submitButton&&submitButton.isConnected){submitButton.disabled=false;submitButton.textContent=submitButton.dataset.label||'Отправить ответы';}if(persisted){console.error('Post-submit UI failed',error);toast('Ответы сохранены. Обновите экран, чтобы увидеть результат.');}else alert('Не удалось отправить ответы. Ваш выбор сохранён на экране. '+(error&&error.message||error));}
  };

  function reviewVisible(attempt) {
    if (!canReview()) return false;
    var props = attempt.PROPERTY_VALUES || {}, role = actualRole(), currentId = String(state.user && state.user.ID || effectiveUserId());
    if (role === 'developer' || role === 'admin') return true;
    return String(props.reviewerId || '') === currentId;
  }
  function attemptUser(attempt) { return userById(attempt.PROPERTY_VALUES && attempt.PROPERTY_VALUES.userId) || {}; }
  function reviewStatusLabel(status) { return {pending_review: 'Ожидает проверки', returned: 'Возвращено', approved: 'Подтверждено', auto_failed_reviewed: 'Авточасть не пройдена'}[status] || status || '—'; }
  function ensureReviewView() {
    var rail = document.querySelector('.icon-rail'), eventsButton = document.querySelector('[data-admin-view="events"]');
    if (rail && eventsButton && !document.querySelector('[data-admin-view="reviews"]')) {
      var button = document.createElement('button'); button.className = 'rail-btn'; button.dataset.adminView = 'reviews'; button.title = 'Проверка тестов'; button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5z"/><path d="m8 11 2 2 5-5M8 17h8"/></svg>'; eventsButton.parentNode.insertBefore(button, eventsButton); button.onclick = function () { switchAdmin('reviews'); };
    }
    if (!document.getElementById('adminReviews')) {
      var view = document.createElement('div'); view.id = 'adminReviews'; view.className = 'admin-view v51-reviews-view'; var events = document.getElementById('adminEvents'); if (events && events.parentNode) events.parentNode.insertBefore(view, events); else document.querySelector('.admin-main').appendChild(view);
    }
  }
  function renderReviews() {
    ensureReviewView(); var root = document.getElementById('adminReviews'); if (!root) return;
    if (!canReview()) { root.innerHTML = '<div class="panel">Доступ к проверке закрыт.</div>'; return; }
    var filter = root.dataset.filter || 'pending_review', rows = state.attempts.filter(reviewVisible).filter(function (attempt) { var status = String(attempt.PROPERTY_VALUES && (attempt.PROPERTY_VALUES.reviewStatus || attempt.PROPERTY_VALUES.status) || ''); return filter === 'all' || status === filter; });
    root.innerHTML = '<div class="admin-page-head"><div><h1>Проверка тестов</h1><p class="muted">Свободные ответы назначенных курсов</p></div><button id="v51ReviewRefresh">Обновить</button></div><div class="v51-review-tabs"><button data-v51-review-filter="pending_review" class="' + (filter === 'pending_review' ? 'active' : '') + '">Ожидают</button><button data-v51-review-filter="returned" class="' + (filter === 'returned' ? 'active' : '') + '">Возвращены</button><button data-v51-review-filter="approved" class="' + (filter === 'approved' ? 'active' : '') + '">Подтверждены</button><button data-v51-review-filter="all" class="' + (filter === 'all' ? 'active' : '') + '">Все</button></div><div class="table-card"><table class="admin-table"><thead><tr><th>Пользователь</th><th>Тест</th><th>Автоматическая часть</th><th>Статус</th><th>Обновлено</th><th></th></tr></thead><tbody>' + (rows.map(function (attempt) { var props = attempt.PROPERTY_VALUES || {}, test = findItem(props.testId), user = attemptUser(attempt); return '<tr><td>' + esc(fullName(user) || ('ID ' + props.userId)) + '</td><td>' + esc(test && test.NAME || 'Тест') + '</td><td>' + esc(props.automaticCorrect || '0') + ' из ' + esc(props.automaticTotal || '0') + '</td><td><span class="pill ' + (props.reviewStatus === 'approved' ? 'green' : props.reviewStatus === 'returned' ? 'red' : 'yellow') + '">' + esc(reviewStatusLabel(props.reviewStatus)) + '</span></td><td>' + fmt(props.updatedAt || props.createdAt) + '</td><td><button data-v51-review="' + attempt.ID + '">Открыть</button></td></tr>'; }).join('') || '<tr><td colspan="6" class="empty-cell">Ответов с таким статусом нет</td></tr>') + '</tbody></table></div>';
    document.querySelectorAll('[data-v51-review-filter]').forEach(function (button) { button.onclick = function () { root.dataset.filter = button.dataset.v51ReviewFilter; renderReviews(); }; });
    document.querySelectorAll('[data-v51-review]').forEach(function (button) { button.onclick = function () { openReview(button.dataset.v51Review); }; });
    document.getElementById('v51ReviewRefresh').onclick = async function () { await loadAll(true); renderReviews(); };
  }
  function openReview(attemptId) {
    var attempt = state.attempts.find(function (row) { return String(row.ID) === String(attemptId); }); if (!attempt || !reviewVisible(attempt)) return;
    var props = attempt.PROPERTY_VALUES || {}, snapshot = {}, answers = {}; try { snapshot = JSON.parse(props.testSnapshot || '{}'); } catch (_) {} try { answers = JSON.parse(props.answers || '{}'); } catch (_) {}
    var questions = (snapshot.questions || []).filter(isFree), details = {}; try { details = JSON.parse(props.reviewDetails || '{}'); } catch (_) {}
    modal('<div class="v51-review-modal"><button class="modal-close" onclick="window.closeModal()">×</button><h2>' + esc((findItem(props.testId) || {}).NAME || snapshot.title || 'Проверка теста') + '</h2><p class="muted">' + esc(fullName(attemptUser(attempt)) || ('ID ' + props.userId)) + ' · автоматическая часть: ' + esc(props.automaticCorrect || '0') + ' из ' + esc(props.automaticTotal || '0') + '</p>' + questions.map(function (question, index) { var saved = details[question.id] || {}; return '<section class="v51-review-answer"><b>' + (index + 1) + '. ' + esc(question.text || '') + '</b><div class="v51-answer-text">' + esc(answers[question.id] || '') + '</div><label><input type="radio" name="v51decision_' + question.id + '" value="accepted" ' + (saved.status !== 'rejected' ? 'checked' : '') + '> Принято</label><label><input type="radio" name="v51decision_' + question.id + '" value="rejected" ' + (saved.status === 'rejected' ? 'checked' : '') + '> Вернуть</label><textarea data-v51-review-comment="' + question.id + '" placeholder="Комментарий пользователю">' + esc(saved.comment || '') + '</textarea></section>'; }).join('') + '<div class="inline-actions right"><button onclick="window.closeModal()">Отмена</button><button class="primary" id="v51SaveReview">Сохранить решение</button></div></div>');
    document.getElementById('v51SaveReview').onclick = async function () {
      var rejected = false, reviewDetails = {}; questions.forEach(function (question) { var selected = document.querySelector('[name="v51decision_' + question.id + '"]:checked'), status = selected && selected.value || 'accepted', comment = document.querySelector('[data-v51-review-comment="' + question.id + '"]').value.trim(); if (status === 'rejected') rejected = true; reviewDetails[question.id] = {status: status, comment: comment}; });
      if (rejected && !Object.keys(reviewDetails).some(function (key) { return reviewDetails[key].status === 'rejected' && reviewDetails[key].comment; })) return alert('При возврате напишите комментарий хотя бы к одному ответу.');
      props.reviewDetails = JSON.stringify(reviewDetails); props.reviewedBy = String(state.user && state.user.ID || effectiveUserId()); props.reviewedAt = now(); props.updatedAt = now(); props.pendingReview = 'N'; props.reviewStatus = rejected ? 'returned' : props.automaticPassed === 'Y' ? 'approved' : 'auto_failed_reviewed'; props.passed = !rejected && props.automaticPassed === 'Y' ? 'Y' : 'N'; props.reviewComment = Object.keys(reviewDetails).map(function (key) { return reviewDetails[key].comment; }).filter(Boolean).join(' · ');
      await upd(E.attempts, attempt.ID, attempt.NAME || 'Попытка теста', props); attempt.PROPERTY_VALUES = props; await notifyUser(props.userId, rejected ? 'Ответ по тесту возвращён на доработку. ' + props.reviewComment : 'Свободный ответ по тесту подтверждён.'); closeModal(); renderReviews(); renderUserCourses(); toast(rejected ? 'Ответ возвращён пользователю' : 'Ответ подтверждён');
    };
  }

  var baseRenderAssignment = window.renderAssignmentPanel;
  window.renderAssignmentPanel = renderAssignmentPanel = function (kind) {
    baseRenderAssignment(kind); if (kind !== 'course') return; var pane = document.querySelector('#courseTabAssign'), course = findItem(state.courseId); if (!pane || !course || pane.querySelector('.v51-reviewer-setting')) return;
    var meta = j(course.PROPERTY_VALUES.meta), candidates = (state.users || []).filter(function (user) { return roleRank(getAppRole(user)) >= 1; });
    var box = document.createElement('section'); box.className = 'settings-card v51-reviewer-setting'; box.innerHTML = '<h3>Проверяющий свободных ответов</h3><p class="muted">Назначается на весь курс. Если проверяющий не выбран, ответы доступны администраторам.</p><select id="v51CourseReviewer"><option value="">Администратор по умолчанию</option>' + candidates.map(function (user) { return '<option value="' + user.ID + '" ' + (String(meta.reviewerId || '') === String(user.ID) ? 'selected' : '') + '>' + esc(fullName(user) || ('ID ' + user.ID)) + ' · ' + esc(roleLabel(getAppRole(user))) + '</option>'; }).join('') + '</select>'; pane.insertBefore(box, pane.firstChild); document.getElementById('v51CourseReviewer').onchange = async function () { meta.reviewerId = this.value; await saveItemMeta(course.ID, meta); toast('Проверяющий сохранён'); };
  };

  window.roleModal = function (userId) {
    var actorId = String(state.user && state.user.ID || ''), actorRole = actualRole(), user = userById(userId), role = getAppRole(user); if (!user || !['developer', 'admin'].includes(actorRole)) return;
    if (String(user.ID) === '36') return alert('Основная роль разработчика защищена.');
    if (role === 'developer' && actorId !== '36') return alert('Роль разработчика может изменять только основной разработчик.');
    modal('<h2>' + esc(fullName(user)) + '</h2><p class="muted">Права наследуются: разработчик администратор редактор преподаватель пользователь.</p><select id="roleSelect"><option value="employee" ' + (role === 'employee' ? 'selected' : '') + '>Пользователь</option><option value="teacher" ' + (role === 'teacher' ? 'selected' : '') + '>Преподаватель</option><option value="moderator" ' + (role === 'moderator' ? 'selected' : '') + '>Редактор</option><option value="admin" ' + (role === 'admin' ? 'selected' : '') + '>Администратор</option>' + (actorId === '36' ? '<option value="developer" ' + (role === 'developer' ? 'selected' : '') + '>Разработчик</option>' : '') + '</select><div class="inline-actions"><button onclick="window.closeModal()">Отмена</button><button class="primary" id="roleSave">Сохранить</button></div>');
    document.getElementById('roleSave').onclick = async function () { await saveRole(userId, document.getElementById('roleSelect').value); closeModal(); await loadAll(); switchAdmin('users'); };
  };
  window.renderUsers = renderUsers = function () {
    var box = document.getElementById('usersTable'); if (!box) return; var q = String(document.getElementById('usersSearch') && document.getElementById('usersSearch').value || '').toLowerCase(), dept = String(document.getElementById('usersDeptFilter') && document.getElementById('usersDeptFilter').value || 'all'), roleFilter=String(document.getElementById('usersRoleFilter')&&document.getElementById('usersRoleFilter').value||'all'),sort=String(document.getElementById('usersSort')&&document.getElementById('usersSort').value||'name'), actorRole = actualRole(), actorId = String(state.user && state.user.ID || '');
    var total = document.getElementById('usersTotal'); if (total) total.textContent = state.users.length; var deptSelect = document.getElementById('usersDeptFilter'); if (deptSelect && !deptSelect.dataset.ready) { deptSelect.innerHTML = '<option value="all">Все департаменты</option>' + state.departments.map(function (department) { return '<option value="' + department.ID + '">' + esc(department.NAME) + '</option>'; }).join(''); deptSelect.dataset.ready = '1'; deptSelect.onchange = renderUsers; document.getElementById('usersSearch').oninput = renderUsers; document.getElementById('usersSyncBtn').onclick = loadAll; }
    ['usersRoleFilter','usersSort'].forEach(function(id){var node=document.getElementById(id);if(node&&!node.dataset.bound){node.dataset.bound='1';node.onchange=renderUsers;}});
    var rank={developer:5,admin:4,moderator:3,teacher:2,employee:1};
    var rows = state.users.filter(Boolean).filter(function (user) { return (fullName(user) + ' ' + (user.EMAIL || '')).toLowerCase().includes(q); }).filter(function (user) { var departments = Array.isArray(user.UF_DEPARTMENT) ? user.UF_DEPARTMENT : user.UF_DEPARTMENT ? [user.UF_DEPARTMENT] : []; return dept === 'all' || departments.map(String).includes(dept); }).filter(function(user){return roleFilter==='all'||getAppRole(user)===roleFilter;}).sort(function(a,b){return sort==='role'?(rank[getAppRole(b)]-rank[getAppRole(a)]||fullName(a).localeCompare(fullName(b),'ru')):fullName(a).localeCompare(fullName(b),'ru');});
    box.innerHTML = rows.map(function (user) { var role = getAppRole(user), protectedDeveloper = role === 'developer' && actorId !== '36', protectedAdmin = Boolean(user.IS_BITRIX_ADMIN) && actorId !== '36', editable = ['developer', 'admin'].includes(actorRole) && !protectedDeveloper && !protectedAdmin && String(user.ID) !== '36',photo=String(user.PERSONAL_PHOTO||''); return '<tr class="user-role-row '+(editable?'is-editable':'')+'" data-role-user="' + user.ID + '" tabindex="'+(editable?'0':'-1')+'"><td><div class="user-cell"><span class="avatar-mini">' + (photo?'<img src="'+esc(photo)+'" alt="">':esc(initials(user))) + '</span><div><b>' + esc(fullName(user) || ('ID ' + user.ID)) + '</b><div class="row-sub">' + esc(user.EMAIL || '') + '</div></div></div></td><td><span class="pill green">Активен</span></td><td>' + esc(userDepartments(user)) + '</td><td><span class="pill ' + (role === 'developer' ? 'violet' : role === 'admin' ? 'mint' : role === 'moderator' ? 'yellow' : role === 'teacher' ? 'blue' : 'gray') + '">' + esc(roleLabel(role)) + (user.IS_BITRIX_ADMIN ? ' · Bitrix24' : '') + '</span></td></tr>'; }).join('') || '<tr><td colspan="4">Пользователи не найдены</td></tr>';
    document.querySelectorAll('.user-role-row.is-editable[data-role-user]').forEach(function (row) { row.onclick = function () { roleModal(row.dataset.roleUser); };row.onkeydown=function(event){if(event.key==='Enter'||event.key===' '){event.preventDefault();roleModal(row.dataset.roleUser);}}; });
  };

  window.addMaterialModalForCourse = addMaterialModalForCourse = function () {
    modal('<h2>Добавить материал в курс</h2><button class="modal-close" onclick="window.closeModal()">×</button><div class="add-material-grid">' + [['article', 'Статья', 'Пустой лист Excalidraw'], ['test', 'Тест', 'Интерактивный тест Excalidraw'], ['file', 'Файл', 'Карточка файла']].map(function (row) { return '<div class="add-tile" data-v51-course-new="' + row[0] + '">' + svgIcon(row[0] === 'file' ? 'upload' : row[0]) + '<div><h3>' + row[1] + '</h3><p class="muted">' + row[2] + '</p></div></div>'; }).join('') + '</div>');
    document.querySelectorAll('[data-v51-course-new]').forEach(function (button) { button.onclick = async function () {
      var type = button.dataset.v51CourseNew, suggested = type === 'article' ? 'Статья' : type === 'test' ? 'Тест' : 'Файл', name = prompt('Название материала', suggested); if (!name || !name.trim()) return; closeModal();
      var siblings = activeRows(state.items).filter(function (row) { return String(row.PROPERTY_VALUES.parentId) === String(state.courseId); }), order = (siblings.length + 1) * 100;
      var meta = type === 'article' ? {sectionId: 'nosection', required: false, order: order, pages: [{id: id('page'), title: 'Страница 1', html: '', canvasRef: null}]} : type === 'test' ? {schemaVersion: 2, sectionId: 'nosection', required: false, order: order, questions: [], passRequired: 0, attemptsLimit: 10, timeLimit: 0, points: 1, shuffleQuestions: false, shuffleAnswers: false, showCorrect: true, certificate: false} : {sectionId: 'nosection', required: false, order: order};
      var user = safeUser(), props = {type: type, status: 'draft', projectId: String(state.projectId || ''), parentId: String(state.courseId || ''), space: projectCode(state.projectId), content: '', meta: json(meta), author: fullName(user) || 'Пользователь', authorId: currentUserId(), updatedAt: now()};
      var newId = await add(E.items, name.trim(), props); upsertLocalItem(newId, name.trim(), props); await persistNow(); if (type === 'test') openTestEditor(newId); else if (type === 'article') openArticleEditor(newId); else { state.expandedChildId = newId; renderCourseEditor(); }
    }; });
  };
  window.addArticlePage = addArticlePage = async function () {
    var article = findItem(state.articleId); if (!article) return; await saveCurrentArticlePage(); article = findItem(state.articleId); var meta = j(article.PROPERTY_VALUES.meta); meta.pages = meta.pages && meta.pages.length ? meta.pages : []; meta.pages.push({id: id('page'), title: 'Страница ' + (meta.pages.length + 1), html: '', canvasRef: null}); var props = Object.assign({}, article.PROPERTY_VALUES, {meta: json(meta), content: meta.pages.map(function (page) { return page.html || ''; }).join('<hr>'), updatedAt: now()}); updateLocalItem(article.ID, article.NAME, props); await upd(E.items, article.ID, article.NAME, props); state.articlePage = meta.pages.length - 1; renderArticlePages(); toast('Пустая страница добавлена');
  };

  var articleCompletionInFlight = false;
  window.finishCurrentArticle = async function () {
    if (articleCompletionInFlight) return;
    var material = findItem(document.getElementById('userMaterialView') && document.getElementById('userMaterialView').dataset.id); if (!material) return;
    articleCompletionInFlight = true;
    var token = window.RTMMaterialSession && window.RTMMaterialSession.current();
    try {
      if (typeof flushActivity === 'function') await flushActivity();
      await complete(material.ID, materialKind(material));
      if (window.RTMMaterialSession && !window.RTMMaterialSession.isCurrent(token, material.ID)) return;
      document.body.classList.remove('is-reading-article');
    var courseId = materialCourseId(material), list = courseId ? courseChildren(courseId) : [], position = list.findIndex(function (row) { return String(row.ID) === String(material.ID); }), next = position >= 0 ? list[position + 1] : null;
      if (next && canOpenCourseMaterial(next)) await openUserMaterial(next); else if (courseId) openUserCourse(findItem(courseId)); else backFromUserMaterial();
    } finally { articleCompletionInFlight = false; }
  };
  var rawIsDoneV51 = window.isDone;
  window.isDone = isDone = function (targetId, type) {
    var item = findItem(targetId), kind = type || materialKind(item), done = rawIsDoneV51(targetId, kind); if (!done || kind !== 'course' || !item) return done;
    var userId = String(typeof rtmCanonicalUserId === 'function' ? rtmCanonicalUserId(effectiveUserId()) : effectiveUserId()), tests = courseChildren(item.ID).filter(function (row) { return materialKind(row) === 'test'; });
    return !tests.some(function (test) { var attempts = state.attempts.filter(function (attempt) { return String(attempt.PROPERTY_VALUES.userId) === userId && String(attempt.PROPERTY_VALUES.testId) === String(test.ID); }).sort(function (a, b) { return String(b.PROPERTY_VALUES.updatedAt || b.PROPERTY_VALUES.createdAt || '').localeCompare(String(a.PROPERTY_VALUES.updatedAt || a.PROPERTY_VALUES.createdAt || '')); }); var status = attempts[0] && attempts[0].PROPERTY_VALUES.reviewStatus; return status === 'pending_review' || status === 'returned'; });
  };

  function fitMobileReaderHeight() {
    var reader = document.querySelector('.v492-reader'); if (!reader || window.innerWidth > 800) return; var rect = reader.getBoundingClientRect(), available = Math.max(420, window.innerHeight - rect.top - 8); reader.style.height = available + 'px'; reader.style.minHeight = '0';
  }
  window.RTMUI = window.RTMUI || {afterRender: [], adminView: []};
  window.RTMUI.adminView.push(function () { ensureReviewView(); });
  window.RTMUI.afterRender.push(function () { ensureReviewView(); });

  document.addEventListener('click', function (event) {
    var start = event.target.closest && event.target.closest('[data-start-user-test]'); if (start) { event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation(); var test = findItem(start.dataset.startUserTest), body = document.getElementById('uMaterialBody'); if (test && body) { body.innerHTML = renderTakeTest(test); document.querySelectorAll('[data-take-test]').forEach(function (form) { form.onsubmit = takeTestSubmit; }); } return; }
    var nav = event.target.closest && event.target.closest('[data-admin-view="reviews"]'); if (nav) { event.preventDefault(); switchAdmin('reviews'); }
  }, true);
  window.addEventListener('resize', function () { setTimeout(fitMobileReaderHeight, 30); });
  new MutationObserver(function () { fitMobileReaderHeight(); }).observe(document.documentElement, {childList: true, subtree: true});
  document.addEventListener('DOMContentLoaded', function () { ensureReviewView(); fitMobileReaderHeight(); });
  ensureReviewView();
  var knowledgeTestEditorHome = null;
  function restoreKnowledgeTestEditor(){var testView=document.getElementById('testEditorView');if(testView&&knowledgeTestEditorHome&&knowledgeTestEditorHome.parent&&knowledgeTestEditorHome.parent.isConnected){knowledgeTestEditorHome.parent.insertBefore(testView,knowledgeTestEditorHome.next&&knowledgeTestEditorHome.next.parentNode===knowledgeTestEditorHome.parent?knowledgeTestEditorHome.next:null);testView.classList.add('hidden')}knowledgeTestEditorHome=null;state.knowledgeEditorReturn=false;state.v540Workspace='';var projectsPanel=document.getElementById('projectsPanel');if(projectsPanel)projectsPanel.style.display='';}
  async function openKnowledgeTest(doc, kind) {
    state.v540Workspace = 'test';
    var key = kind === 'full' ? 'fullTest' : 'lightTest', source = clone(doc[key] || {}), syntheticId = 'knowledge_' + doc.id + '_' + kind;
    source.title = source.title || ((kind === 'full' ? 'Полный — ' : 'Лайт — ') + doc.title); source.questions = source.questions || [];
    source.knowledgeCentralDocumentId = doc.id; source.knowledgeCentralKind = kind;
    var item = findItem(syntheticId), props = {type: 'test', status: 'draft', meta: json(source), updatedAt: now()};
    if (item) { item.NAME = source.title; item.PROPERTY_VALUES = props; } else state.items.push({ID: syntheticId, NAME: source.title, PROPERTY_VALUES: props});
    state.testId = syntheticId; state.testEditorTab = 'questions'; state.knowledgeEditorReturn = true;
    switchAdmin('materials'); showOnlyEditor('testEditorView');
    var testView=document.getElementById('testEditorView'),databaseView=document.getElementById('adminDatabase');
    if(testView&&databaseView){if(!knowledgeTestEditorHome)knowledgeTestEditorHome={parent:testView.parentNode,next:testView.nextSibling};databaseView.appendChild(testView);testView.classList.remove('hidden');activateAdminView('database');state.aview='database';}
    var adminShell = document.querySelector('.admin-shell'), projectsPanel = document.getElementById('projectsPanel');
    if (adminShell) { adminShell.classList.remove('with-projects'); adminShell.classList.add('no-projects'); }
    if (projectsPanel) projectsPanel.style.display = 'none';
    document.querySelectorAll('.rail-btn').forEach(function (button) { button.classList.toggle('active', button.dataset.adminView === 'database'); });
    var heading = document.getElementById('testEditorTitle'); if (heading) heading.textContent = source.title;
    else window.renderTestEditor();
    bindTestTabs();
    var back = document.getElementById('backFromTestEditor');
    if (back) back.onclick = function () {
      restoreKnowledgeTestEditor();
      switchAdmin('database');
      if (window.RTMV5038) window.RTMV5038.reload().then(function () { window.RTMV5038.renderAdmin(); });
    };
    if (back) back.textContent = 'Назад к Базе знаний';
  }
  window.RTMRestoreKnowledgeTestEditor=restoreKnowledgeTestEditor;
  window.renderInlineTestEditor = function (item) {
    return '<div class="inline-full-editor v51-inline-test-launch"><div class="inline-title">' + esc(item.NAME) + '</div><p>Тест редактируется в едином визуальном редакторе: сцена слева, параметры вопросов справа.</p><button type="button" class="primary" data-v51-open-inline-test="' + item.ID + '">Открыть визуальный редактор</button></div>';
  };
  document.addEventListener('click', function (event) { var button = event.target.closest('[data-v51-open-inline-test]'); if (!button) return; event.preventDefault(); var item=findItem(button.dataset.v51OpenInlineTest), meta=item&&j(item.PROPERTY_VALUES.meta); if(!(meta&&meta.linkedKnowledge))state.editorReturnCourseId=state.courseId; window.openTestEditor(button.dataset.v51OpenInlineTest); });
  window.RTMV51 = {version: VERSION, buildScene: buildScene, normalizeMeta: normalizeMeta, renderReviews: renderReviews, openKnowledgeTest: openKnowledgeTest};
})();


/* source: v052.js */
(function () {
  'use strict';
  var VERSION = '50.3.4';
  var designerTemplate = null;
  var templatePromise = null;
  var reviewState = {filter: 'pending_review', query: '', selected: ''};
  var analyticsState = {query: '', department: 'all', from: '', to: '', sort: -1, direction: 1};

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function localId(prefix) { return (prefix || 'v52') + '_' + Math.random().toString(36).slice(2, 10) + '_' + Date.now().toString(36); }
  function freeQuestion(question) { return ['freeText', 'mediaFreeText'].includes(String(question && question.type || '')); }
  function templateIndex(type) { return type === 'freeText' ? 1 : type === 'imageChoice' ? 2 : type === 'imageTextChoice' ? 3 : type === 'mediaFreeText' ? 4 : 0; }
  function structureSignature(meta) { return (meta.questions || []).map(function (question) { return [question.id, question.type, question.text||'', question.media&&question.media.url||'', (question.options || []).map(function (option) { return [option.id,option.text||'',option.image||''].join('~'); }).join(',')].join(':'); }).join('|'); }
  function wrapText(value, limit) {
    return String(value || '').split('\n').map(function(line){
      var words=line.split(/\s+/), rows=[], current='';
      words.forEach(function(word){var next=(current+' '+word).trim();if(current&&next.length>limit){rows.push(current);current=word;}else current=next;});
      if(current)rows.push(current);return rows.join('\n');
    }).join('\n');
  }
  function loadTemplate() {
    if (designerTemplate) return Promise.resolve(designerTemplate);
    if (!templatePromise) templatePromise = fetch('/legacy/test-template-v52.json?v=050.3.4', {cache: 'no-store'}).then(function (response) {
      if (!response.ok) throw new Error('Не удалось загрузить шаблон теста: HTTP ' + response.status);
      return response.json();
    }).then(function (scene) { designerTemplate = scene; return scene; });
    return templatePromise;
  }
  function elementQuestionIndex(element) {
    if (element.customData && element.customData.rtmTemplateQuestionIndex != null) return Number(element.customData.rtmTemplateQuestionIndex);
    if (element.id === 'YKDfj2evSnql-GLGlDpJF') return 1;
    if (element.id === '3jjnQDvG0R4uL1Bvtfd17') return 2;
    return null;
  }
  function optionIndex(element) {
    var data = element.customData || {}, source = data.rtmTestText || data.rtmTestControl || data.rtmTestCheck;
    return source && source.optionIndex != null ? Number(source.optionIndex) : null;
  }
  function remapElementReferences(element, idMap, frameId) {
    element.id = idMap[element.id] || element.id;
    element.frameId = element.type === 'frame' ? null : frameId;
    element.groupIds = (element.groupIds || []).map(function (id) { return idMap[id] || id; });
    element.boundElements = (element.boundElements || []).map(function (row) { return Object.assign({}, row, {id: idMap[row.id] || row.id}); });
    if (element.containerId) element.containerId = idMap[element.containerId] || element.containerId;
    ['startBinding', 'endBinding'].forEach(function (key) { if (element[key] && element[key].elementId) element[key].elementId = idMap[element[key].elementId] || element[key].elementId; });
    element.seed = Math.floor(Math.random() * 2147483647);
    element.versionNonce = Math.floor(Math.random() * 2147483647);
    element.updated = Date.now();
    return element;
  }
  function instantiateBlock(template, question, questionIndex, prototypeIndex, targetY, frameId) {
    var source = template.elements.filter(function (element) { return elementQuestionIndex(element) === prototypeIndex; });
    var seenQuestionText=false;
    source=source.filter(function(element){var binding=element.customData&&element.customData.rtmTestText;if(!binding||binding.kind!=='question')return true;if(seenQuestionText)return false;seenQuestionText=true;return true;});
    var minY = Math.min.apply(null, source.map(function (element) { return Number(element.y || 0); }));
    var maxY = Math.max.apply(null, source.map(function (element) { return Number(element.y || 0) + Number(element.height || 0); }));
    var options = question.options || [];
    source = source.filter(function (element) { var index = optionIndex(element); return index == null || index < options.length; });
    var idMap = {}; source.forEach(function (element) { idMap[element.id] = localId('el'); (element.groupIds || []).forEach(function (group) { if (!idMap[group]) idMap[group] = localId('grp'); }); });
    var dy = targetY - minY;
    var result = source.map(function (sourceElement) {
      var element = remapElementReferences(clone(sourceElement), idMap, frameId), data = element.customData = Object.assign({}, element.customData || {}, {rtmTemplateQuestionIndex: questionIndex, rtmTestQuestionId: String(question.id)});
      element.y = Number(element.y || 0) + dy;
      if (data.rtmTestText) {
        var textBinding = data.rtmTestText, text = textBinding.kind === 'question' ? ((questionIndex + 1) + '. ' + String(question.text || 'Вопрос').replace(/^\s*\d+[.)]\s*/,'')) : ((options[textBinding.optionIndex] || {}).text || ('Вариант ответа ' + (Number(textBinding.optionIndex) + 1)));
        if(textBinding.kind === 'question'){
          var limit=Math.max(26,Math.floor(Number(element.width||480)/(Number(element.fontSize||18)*.56)));
          text=wrapText(text,limit);element.autoResize=false;element.height=Math.max(Number(element.height||0),text.split('\n').length*Number(element.fontSize||18)*Number(element.lineHeight||1.25));
        }
        element.text = text; element.originalText = text;
        data.rtmTestText = Object.assign({}, textBinding, {questionIndex: questionIndex, questionId: String(question.id), optionId: textBinding.optionIndex == null ? null : String((options[textBinding.optionIndex] || {}).id || '')});
      }
      if (data.rtmTestControl) {
        var control = data.rtmTestControl, option = control.optionIndex == null ? null : options[control.optionIndex];
        data.rtmTestControl = Object.assign({}, control, {questionIndex: questionIndex, questionId: String(question.id), optionId: option ? String(option.id) : undefined});
        if (control.kind === 'choice') { element.strokeColor = '#2f9e44'; element.backgroundColor = '#ffffff'; element.strokeWidth = 2; }
      }
      if (data.rtmTestCheck) data.rtmTestCheck = Object.assign({}, data.rtmTestCheck, {questionIndex: questionIndex, questionId: String(question.id), optionId: String((options[data.rtmTestCheck.optionIndex] || {}).id || '')});
      return element;
    });
    result.forEach(function (element) {
      var binding = element.customData && element.customData.rtmTestText;
      if (!binding || binding.kind !== 'option') return;
      var control = result.find(function (candidate) {
        var value = candidate.customData && candidate.customData.rtmTestControl;
        return value && value.kind === 'choice' && Number(value.optionIndex) === Number(binding.optionIndex);
      });
      if (!control) return;
      var fontSize = Number(element.fontSize || 16), lineHeight = Number(element.lineHeight || 1.25);
      element.x = Number(control.x || 0) + 8;
      element.width = Math.max(1, Number(control.width || 1) - 16);
      element.height = Math.max(fontSize * lineHeight, 1);
      element.y = Number(control.y || 0) + (Number(control.height || 1) - element.height) / 2;
      element.textAlign = 'center'; element.verticalAlign = 'middle'; element.autoResize = false;
    });
    return {elements: result, height: maxY - minY};
  }
  function designerScene(template, meta, title) {
    var frameSource = template.elements.find(function (element) { return element.type === 'frame'; }), frameId = localId('frame');
    var frame = clone(frameSource), common = template.elements.filter(function (element) { return element.type !== 'frame' && elementQuestionIndex(element) == null && Number(element.y || 0) < 100; });
    var commonMap = {}; common.forEach(function (element) { commonMap[element.id] = localId('el'); });
    common = common.map(function (source) {
      var element = remapElementReferences(clone(source), commonMap, frameId);
      if (element.customData && element.customData.rtmTestTitle) {
        var titleSize=28,titleLimit=Math.max(16,Math.floor(Number(element.width||500)/(titleSize*.52))),titleText=wrapText(title,titleLimit);
        element.text=titleText;element.originalText=titleText;element.fontFamily=23;element.fontSize=titleSize;element.lineHeight=1.2;
        element.textAlign='center';element.verticalAlign='middle';element.autoResize=false;element.height=Math.max(34,titleText.split('\n').length*titleSize*1.2);
      }
      return element;
    });
    frame.id = frameId; frame.name = null; frame.x = 0; frame.y = 0; frame.customData = Object.assign({}, frame.customData || {}, {rtmTestFrame: true, rtmV52DesignerTemplate: true});
    var defaultTypes = ['single', 'freeText', 'imageChoice', 'imageTextChoice', 'mediaFreeText'];
    var exact = (meta.questions || []).length === 5 && meta.questions.every(function (question, index) { return defaultTypes[index] === question.type; });
    var titleBottom=common.reduce(function(value,element){return element.customData&&element.customData.rtmTestTitle?Math.max(value,Number(element.y||0)+Number(element.height||0)):value;},0);
    var cursor = Math.max(107.46937564480686,titleBottom+28), blocks = [], exactOffset=Math.max(0,cursor-107.46937564480686);
    (meta.questions || []).forEach(function (question, index) {
      var prototype = templateIndex(question.type), prototypeElements = template.elements.filter(function (element) { return elementQuestionIndex(element) === prototype; });
      var originalY = Math.min.apply(null, prototypeElements.map(function (element) { return Number(element.y || 0); }));
      var targetY=exact?originalY+exactOffset:cursor;
      var block = instantiateBlock(template, question, index, prototype, targetY, frameId);
      blocks = blocks.concat(block.elements); cursor = targetY + block.height + 46;
    });
    var lastBottom = blocks.length ? Math.max.apply(null, blocks.map(function (element) { return Number(element.y || 0) + Number(element.height || 0); })) : 150;
    frame.height = exact ? Number(frameSource.height || lastBottom + 50) : Math.max(360, lastBottom + 52);
    return {type: 'excalidraw', version: 2, source: 'rtm-v52-designer', elements: common.concat(blocks, [frame]), appState: {viewBackgroundColor: '#ffffff', scrollX: 0, scrollY: 0, zoom: {value: 1}}, files: clone(template.files || {})};
  }
  async function ensureDesigner(item, force) {
    if (!item || item.PROPERTY_VALUES && item.PROPERTY_VALUES.type !== 'test') return false;
    var rawMeta=j(item.PROPERTY_VALUES.meta), removedTextOptionImages=(rawMeta.questions||[]).some(function(question){return question.type==='imageTextChoice'&&(question.options||[]).some(function(option){return !!option.image;});});
    var meta = window.RTMV51.normalizeMeta(rawMeta), signature = structureSignature(meta);
    if (!force && meta.v52DesignerMigrated && meta.v52LayoutSignature === signature && meta.testScene && Array.isArray(meta.testScene.elements)) {
      var changed=removedTextOptionImages, questions=new Map((meta.questions||[]).map(function(q,i){return [String(q.id),{q:q,i:i}];}));
      meta.testScene.elements.forEach(function(element){
        var data=element.customData||{}, binding=data.rtmTestText;
        if(data.rtmTestTitle){
          var titleValue=item.NAME||meta.title||'Тест',titleSize=28,titleLimit=Math.max(16,Math.floor(Number(element.width||500)/(titleSize*.52))),titleWrapped=wrapText(titleValue,titleLimit),titleHeight=Math.max(34,titleWrapped.split('\n').length*titleSize*1.2);
          if(Number(element.fontFamily)!==23||Number(element.fontSize)!==titleSize||element.text!==titleWrapped||Number(element.height)<titleHeight){element.fontFamily=23;element.fontSize=titleSize;element.text=titleWrapped;element.originalText=titleWrapped;element.height=titleHeight;element.lineHeight=1.2;element.textAlign='center';element.verticalAlign='middle';element.autoResize=false;changed=true;}
        }
        if(!binding || binding.kind!=='question')return;
        var row=questions.get(String(binding.questionId));if(!row)return;
        var value=(row.i+1)+'. '+(row.q.text||'Вопрос'), limit=Math.max(26,Math.floor(Number(element.width||480)/(Number(element.fontSize||18)*.56))), wrapped=wrapText(value,limit);
        if(element.text!==wrapped){element.text=wrapped;element.originalText=wrapped;element.autoResize=false;element.height=Math.max(Number(element.height||0),wrapped.split('\n').length*Number(element.fontSize||18)*Number(element.lineHeight||1.25));changed=true;}
      });
      var sceneTitle=meta.testScene.elements.find(function(element){return element.customData&&element.customData.rtmTestTitle&&!element.isDeleted;}),questionElements=meta.testScene.elements.filter(function(element){return !element.isDeleted&&elementQuestionIndex(element)!=null;});
      if(sceneTitle&&questionElements.length){
        var safeTop=Number(sceneTitle.y||0)+Number(sceneTitle.height||0)+28,firstTop=Math.min.apply(null,questionElements.map(function(element){return Number(element.y||0);}));
        if(firstTop<safeTop){
          var shift=safeTop-firstTop;
          questionElements.forEach(function(element){element.y=Number(element.y||0)+shift;});
          var testFrame=meta.testScene.elements.find(function(element){return element.type==='frame'&&!element.isDeleted;});if(testFrame)testFrame.height=Number(testFrame.height||0)+shift;
          changed=true;
        }
      }
      if(changed){item.PROPERTY_VALUES.meta=json(meta);await saveItemMeta(item.ID,meta);return true;}
      return false;
    }
    var template = await loadTemplate();
    meta.testScene = designerScene(template, meta, item.NAME || 'Тест'); meta.schemaVersion = 3; meta.v52DesignerMigrated = true; meta.v52LayoutSignature = signature;
    item.PROPERTY_VALUES.meta = json(meta); await saveItemMeta(item.ID, meta); return true;
  }

  var baseRenderTestEditor = window.renderTestEditor;
  window.renderTestEditor = function () {
    var item = findItem(state.testId), root = document.getElementById('testQuestionsEditor');
    if (!item || !root) return baseRenderTestEditor.apply(this, arguments);
    root.innerHTML = '<div class="v52-template-loading">Подготавливаем макет теста…</div>';
    return ensureDesigner(item, false).catch(function (error) { console.error('v50.3.4 designer migration failed', error); }).then(function () { baseRenderTestEditor(); });
  };

  var baseRenderUserTestIntro = window.renderUserTestIntro;
  window.renderUserTestIntro = function () {
    var markup = baseRenderUserTestIntro.apply(this, arguments), index = 0;
    var icons = [
      '<path d="M12 7v5l3 2"/><circle cx="12" cy="12" r="9"/>',
      '<path d="M6 8a8 8 0 0 1 13 1"/><path d="M19 5v4h-4M18 16a8 8 0 0 1-13-1"/><path d="M5 19v-4h4"/>',
      '<path d="m5 12 4 4L19 6"/>',
      '<circle cx="12" cy="9" r="5"/><path d="m9 14-1 7 4-2 4 2-1-7"/>',
      '<path d="M5 12.5 9.5 17 19 7"/>',
      '<path d="M12 3 15 8.5 21 9.5 16.5 14 17.5 20 12 17 6.5 20 7.5 14 3 9.5 9 8.5Z"/>'
    ];
    return markup.replace(/<span>/g, function (tag) {
      var icon = icons[index++];
      return icon ? tag + '<svg class="test-info-icon" viewBox="0 0 24 24" aria-hidden="true">' + icon + '</svg>' : tag;
    });
  };

  function currentUserIdV52() { return String(typeof rtmCanonicalUserId === 'function' ? rtmCanonicalUserId(effectiveUserId()) : effectiveUserId()); }
  function currentRoleV52() { return String(state.currentRole || getAppRole(state.user) || 'employee'); }
  function roleRankV52(role) { return {employee: 0, student: 0, teacher: 1, moderator: 2, editor: 2, admin: 3, developer: 4}[String(role || '')] || 0; }
  function latestAttempts() {
    var groups = {};
    state.attempts.slice().sort(function (a, b) { return String(b.PROPERTY_VALUES.updatedAt || b.PROPERTY_VALUES.createdAt || '').localeCompare(String(a.PROPERTY_VALUES.updatedAt || a.PROPERTY_VALUES.createdAt || '')); }).forEach(function (attempt) {
      var props = attempt.PROPERTY_VALUES || {}, key = String(props.userId) + ':' + String(props.testId); if (!groups[key]) groups[key] = attempt;
    });
    return Object.keys(groups).map(function (key) { return groups[key]; });
  }
  function canReviewV52(attempt) {
    var role = currentRoleV52(), props = attempt.PROPERTY_VALUES || {}, actor = String(state.user && state.user.ID || effectiveUserId());
    return role === 'developer' || role === 'admin' || roleRankV52(role) >= 1 && String(props.reviewerId || '') === actor;
  }
  function reviewLabel(status) { return {pending_review: 'Ожидает проверки', returned: 'Возвращено', approved: 'Принято', auto_failed_reviewed: 'Авточасть не пройдена'}[status] || status || '—'; }
  function parseJson(value, fallback) { try { return JSON.parse(value || ''); } catch (_) { return fallback; } }
  function answerValue(answers, question, index) {
    if (answers && !Array.isArray(answers) && answers[question.id] != null) return answers[question.id];
    if (Array.isArray(answers)) { var row = answers[index]; return row && typeof row === 'object' ? (row.answer != null ? row.answer : row.value != null ? row.value : row.text || '') : row || ''; }
    return '';
  }
  function reviewHistory(attempt) {
    var props = attempt.PROPERTY_VALUES || {};
    return state.attempts.filter(function (row) { var p = row.PROPERTY_VALUES || {}; return String(p.userId) === String(props.userId) && String(p.testId) === String(props.testId); }).sort(function (a, b) { return String(b.PROPERTY_VALUES.updatedAt || b.PROPERTY_VALUES.createdAt || '').localeCompare(String(a.PROPERTY_VALUES.updatedAt || a.PROPERTY_VALUES.createdAt || '')); });
  }
  async function notifyV52(userId, message) { if (!userId || !window.RTMV47 || !window.RTMV47.bitrixCall) return; try { await window.RTMV47.bitrixCall('im.notify.personal.add', {to: Number(userId) || userId, message: message}); } catch (error) { console.warn(error); } }
  function reviewDetailsMarkup(attempt) {
    if (!attempt) return '<div class="v52-review-empty">Выберите отправку слева.</div>';
    var props = attempt.PROPERTY_VALUES || {}, snapshot = parseJson(props.testSnapshot, {}), answers = parseJson(props.answers, {}), details = parseJson(props.reviewDetails, {});
    var allQuestions = snapshot.questions || [], questions = allQuestions.filter(freeQuestion), user = userById(props.userId) || {}, test = findItem(props.testId), history = reviewHistory(attempt);
    return '<button type="button" class="v52-review-mobile-back" id="v52ReviewBack">К списку</button><header class="v52-review-detail-head"><div><h2>' + esc(test && test.NAME || snapshot.title || 'Проверка теста') + '</h2><p>' + esc(fullName(user) || ('ID ' + props.userId)) + ' · автоматическая часть: ' + esc(props.automaticCorrect || '0') + ' из ' + esc(props.automaticTotal || '0') + '</p></div><span class="pill ' + (props.reviewStatus === 'approved' ? 'green' : props.reviewStatus === 'returned' ? 'red' : 'yellow') + '">' + esc(reviewLabel(props.reviewStatus)) + '</span></header><div class="v52-review-answers">' + questions.map(function (question, index) {
      var saved = details[question.id] || {}, originalIndex = allQuestions.indexOf(question), value = answerValue(answers, question, originalIndex);
      return '<section class="v52-review-answer"><b>' + (index + 1) + '. ' + esc(question.text || '') + '</b><div class="v52-answer-text">' + esc(value || 'Ответ не заполнен') + '</div><div class="v52-review-decision"><label><input type="radio" name="v52decision_' + question.id + '" value="accepted" ' + (saved.status !== 'rejected' ? 'checked' : '') + '> Принято</label><label><input type="radio" name="v52decision_' + question.id + '" value="rejected" ' + (saved.status === 'rejected' ? 'checked' : '') + '> Не принято</label></div><textarea data-v52-review-comment="' + question.id + '" placeholder="Комментарий пользователю">' + esc(saved.comment || '') + '</textarea></section>';
    }).join('') + '</div><div class="v52-review-actions"><button type="button" id="v52ReviewCancel">Отмена</button><button type="button" class="primary" id="v52SaveReview">Сохранить решение</button></div><details class="v52-review-history"><summary>История попыток (' + history.length + ')</summary>' + history.map(function (row) { var p = row.PROPERTY_VALUES || {}; return '<div><b>' + fmt(p.updatedAt || p.createdAt) + '</b><span>' + esc(reviewLabel(p.reviewStatus)) + '</span><span>' + esc(p.automaticCorrect || '0') + ' из ' + esc(p.automaticTotal || '0') + '</span></div>'; }).join('') + '</details>';
  }
  function reviewRows() {
    var query = reviewState.query.toLowerCase();
    return latestAttempts().filter(canReviewV52).filter(function (attempt) {
      var props = attempt.PROPERTY_VALUES || {}, status = String(props.reviewStatus || props.status || '');
      if (!['pending_review', 'returned', 'approved', 'auto_failed_reviewed'].includes(status)) return false;
      if (reviewState.filter !== 'all' && status !== reviewState.filter) return false;
      var user = userById(props.userId), test = findItem(props.testId); return (fullName(user) + ' ' + (test && test.NAME || '')).toLowerCase().includes(query);
    });
  }
  function renderReviewsV52(rootOverride) {
    var root = rootOverride || document.querySelector('[data-v5100-test-host]') || document.getElementById('adminReviews'); if (!root) return;
    var rows = reviewRows(); if (!rows.some(function (row) { return String(row.ID) === String(reviewState.selected); })) reviewState.selected = rows[0] ? String(rows[0].ID) : '';
    var selected = state.attempts.find(function (row) { return String(row.ID) === String(reviewState.selected); });
    root.innerHTML = '<div class="v52-review-page"><header class="admin-page-head"><div><h1>Проверка тестов</h1><p class="muted">Последние свободные ответы назначенных курсов</p></div><button id="v52ReviewRefresh">Обновить</button></header><div class="v52-review-tabs"><button data-v52-review-filter="pending_review" class="' + (reviewState.filter === 'pending_review' ? 'active' : '') + '">Ожидают</button><button data-v52-review-filter="returned" class="' + (reviewState.filter === 'returned' ? 'active' : '') + '">Возвращены</button><button data-v52-review-filter="approved" class="' + (reviewState.filter === 'approved' ? 'active' : '') + '">Приняты</button><button data-v52-review-filter="all" class="' + (reviewState.filter === 'all' ? 'active' : '') + '">Все</button></div><div class="v52-review-workspace ' + (selected ? 'has-detail' : '') + '"><aside class="v52-review-list"><input id="v52ReviewSearch" value="' + esc(reviewState.query) + '" placeholder="Поиск по пользователю или тесту">' + (rows.map(function (attempt) { var p = attempt.PROPERTY_VALUES || {}, user = userById(p.userId), test = findItem(p.testId); return '<button type="button" data-v52-review="' + attempt.ID + '" class="' + (String(attempt.ID) === String(reviewState.selected) ? 'active' : '') + '"><b>' + esc(fullName(user) || ('ID ' + p.userId)) + '</b><span>' + esc(test && test.NAME || 'Тест') + '</span><small>' + esc(p.automaticCorrect || '0') + ' из ' + esc(p.automaticTotal || '0') + ' · ' + fmt(p.updatedAt || p.createdAt) + '</small></button>'; }).join('') || '<p class="empty-cell">Ответов с таким статусом нет</p>') + '</aside><main class="v52-review-detail">' + reviewDetailsMarkup(selected) + '</main></div></div>';
    root.querySelectorAll('[data-v52-review-filter]').forEach(function (button) { button.onclick = function () { reviewState.filter = button.dataset.v52ReviewFilter; reviewState.selected = ''; renderReviewsV52(root); }; });
    root.querySelectorAll('[data-v52-review]').forEach(function (button) { button.onclick = function () { reviewState.selected = button.dataset.v52Review; renderReviewsV52(root); }; });
    var search = root.querySelector('#v52ReviewSearch'); if (search) search.oninput = function () { reviewState.query = search.value; reviewState.selected = ''; renderReviewsV52(root); };
    var back = document.getElementById('v52ReviewBack'); if (back) back.onclick = function () { reviewState.selected = ''; var workspace=root.querySelector('.v52-review-workspace');if(workspace)workspace.classList.remove('has-detail'); };
    var cancel = root.querySelector('#v52ReviewCancel'); if (cancel) cancel.onclick = function () { reviewState.selected = ''; renderReviewsV52(root); };
    var refresh = root.querySelector('#v52ReviewRefresh'); if (refresh) refresh.onclick = async function () { await loadAll(true); renderReviewsV52(root); };
    var save = document.getElementById('v52SaveReview'); if (save && selected) save.onclick = async function () {
      var props = selected.PROPERTY_VALUES || {}, snapshot = parseJson(props.testSnapshot, {}), questions = (snapshot.questions || []).filter(freeQuestion), rejected = false, details = {};
      questions.forEach(function (question) { var decision = document.querySelector('[name="v52decision_' + question.id + '"]:checked'), status = decision && decision.value || 'accepted', field = document.querySelector('[data-v52-review-comment="' + question.id + '"]'), comment = String(field && field.value || '').trim(); if (status === 'rejected') rejected = true; details[question.id] = {status: status, comment: comment}; });
      if (rejected && !Object.keys(details).some(function (key) { return details[key].status === 'rejected' && details[key].comment; })) return alert('Для непринятого ответа напишите комментарий.');
      props.reviewDetails = JSON.stringify(details); props.reviewedBy = currentUserIdV52(); props.reviewedAt = now(); props.updatedAt = now(); props.pendingReview = 'N'; props.reviewStatus = rejected ? 'returned' : props.automaticPassed === 'Y' ? 'approved' : 'auto_failed_reviewed'; props.passed = !rejected && props.automaticPassed === 'Y' ? 'Y' : 'N'; props.reviewComment = Object.keys(details).map(function (key) { return details[key].comment; }).filter(Boolean).join(' · ');
      save.disabled = true; await upd(E.attempts, selected.ID, selected.NAME || 'Попытка теста', props); selected.PROPERTY_VALUES = props; await notifyV52(props.userId, rejected ? 'Ответ по тесту возвращён на доработку. ' + props.reviewComment : 'Свободный ответ по тесту принят.'); reviewState.selected = ''; renderReviewsV52(root); renderUserCourses(); toast(rejected ? 'Ответ возвращён пользователю' : 'Ответ принят');
    };
  }

  function updateMaterialNavigation(material) {
    var prevButton = document.getElementById('uPrevMaterial'), nextButton = document.getElementById('uNextMaterial'); if (!prevButton || !nextButton) return;
    var courseId = materialCourseId(material); if (!courseId) { prevButton.classList.add('hidden'); nextButton.classList.add('hidden'); return; }
    var list = courseChildren(courseId), index = list.findIndex(function (row) { return String(row.ID) === String(material.ID); }), prev = index > 0 ? list[index - 1] : null, next = index >= 0 ? list[index + 1] : null;
    prevButton.classList.toggle('hidden', !prev); nextButton.classList.toggle('hidden', !next || !canOpenCourseMaterial(next));
  }
  var baseOpenMaterial = window.openUserMaterial;
  window.openUserMaterial = openUserMaterial = function (material) {
    var result = baseOpenMaterial.apply(this, arguments), materialSession=window.RTMMaterialSession, materialToken=materialSession&&materialSession.current();
    if(materialSession)materialSession.schedule(function(){updateMaterialNavigation(material)},0,materialToken);
    else setTimeout(function () { updateMaterialNavigation(material); }, 0);
    return result;
  };

  function activeTableRows() { return Array.from(document.querySelectorAll('#analyticsContent table tbody tr')); }
  function rowDate(row, tab) {
    if (tab === 'events') { var match = String(row.cells[0] && row.cells[0].textContent || '').match(/(\d{2})\.(\d{2})\.(\d{4})/); return match ? match[3] + '-' + match[2] + '-' + match[1] : ''; }
    var name = String(row.cells[tab === 'users' ? 0 : tab === 'top' ? 1 : 0] && row.cells[tab === 'users' ? 0 : tab === 'top' ? 1 : 0].textContent || '').trim();
    var dates = state.events.filter(function (event) { var p = event.PROPERTY_VALUES || {}; return tab === 'users' || tab === 'top' ? name.includes(eventUserName(event)) : name.includes(String(p.targetName || '')); }).map(function (event) { return dateKey(event.PROPERTY_VALUES && event.PROPERTY_VALUES.createdAt); }).sort();
    return dates[dates.length - 1] || '';
  }
  function exportAnalyticsTable() {
    var table = document.querySelector('#analyticsContent table'); if (!table) return;
    var rows = [Array.from(table.querySelectorAll('thead th')).map(function (cell) { return cell.textContent.trim().replace(/[↕↑↓]/g, ''); })].concat(activeTableRows().filter(function (row) { return row.style.display !== 'none'; }).map(function (row) { return Array.from(row.cells).map(function (cell) { return cell.textContent.trim(); }); }));
    var csv = '\ufeff' + rows.map(function (row) { return row.map(function (cell) { return '"' + String(cell || '').replace(/"/g, '""') + '"'; }).join(';'); }).join('\n'), link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], {type: 'text/csv;charset=utf-8'})); link.download = 'rtm_' + String(state.analyticsTab || 'analytics') + '_' + new Date().toISOString().slice(0, 10) + '.csv'; link.click(); setTimeout(function () { URL.revokeObjectURL(link.href); }, 500);
  }
  function enhanceAnalytics() {
    var root = document.getElementById('analyticsContent'), search = document.getElementById('analyticsSearch'), filter = document.getElementById('analyticsFilterPanel'); if (!root || !search) return;
    search.value = analyticsState.query;
    if (filter) filter.innerHTML = '<select id="analyticsDept">' + analyticsDeptOptions() + '</select><label>С</label><input id="v52AnalyticsFrom" type="date" value="' + analyticsState.from + '"><label>По</label><input id="v52AnalyticsTo" type="date" value="' + analyticsState.to + '"><button class="primary" id="analyticsApply">Применить</button>';
    var dept = document.getElementById('analyticsDept'); if (dept) dept.value = analyticsState.department;
    function apply() {
      analyticsState.query = String(search.value || ''); analyticsState.department = String(dept && dept.value || 'all'); analyticsState.from = String(document.getElementById('v52AnalyticsFrom') && document.getElementById('v52AnalyticsFrom').value || ''); analyticsState.to = String(document.getElementById('v52AnalyticsTo') && document.getElementById('v52AnalyticsTo').value || '');
      var tab = state.analyticsTab || 'overview', department = state.departments.find(function (row) { return String(row.ID) === analyticsState.department; }), deptName = department && department.NAME || '';
      activeTableRows().forEach(function (row) { var text = row.textContent.toLowerCase(), date = rowDate(row, tab), matches = text.includes(analyticsState.query.toLowerCase()); if (deptName && !text.includes(deptName.toLowerCase())) matches = false; if (analyticsState.from && (!date || date < analyticsState.from)) matches = false; if (analyticsState.to && (!date || date > analyticsState.to)) matches = false; row.style.display = matches ? '' : 'none'; });
    }
    search.oninput = apply; var applyButton = document.getElementById('analyticsApply'); if (applyButton) applyButton.onclick = apply;
    var filterButton = document.getElementById('analyticsFilterBtn'); if (filterButton) filterButton.onclick = function () { filter.classList.toggle('hidden'); };
    var exportButton = document.getElementById('analyticsExportBtn'); if (exportButton) exportButton.onclick = exportAnalyticsTable;
    var table = root.querySelector('table'); if (table) table.querySelectorAll('thead th').forEach(function (heading, index) { heading.classList.add('v52-sortable'); heading.title = 'Сортировать'; heading.onclick = function () { analyticsState.direction = analyticsState.sort === index ? -analyticsState.direction : 1; analyticsState.sort = index; var body = table.tBodies[0], rows = activeTableRows(); rows.sort(function (a, b) { var av = String(a.cells[index] && a.cells[index].textContent || '').trim(), bv = String(b.cells[index] && b.cells[index].textContent || '').trim(), an = parseFloat(av.replace(/[^0-9,.-]/g, '').replace(',', '.')), bn = parseFloat(bv.replace(/[^0-9,.-]/g, '').replace(',', '.')); return ((!isNaN(an) && !isNaN(bn)) ? an - bn : av.localeCompare(bv, 'ru', {numeric: true})) * analyticsState.direction; }); rows.forEach(function (row) { body.appendChild(row); }); table.querySelectorAll('thead th').forEach(function (cell) { cell.dataset.sort = ''; }); heading.dataset.sort = analyticsState.direction > 0 ? '↑' : '↓'; }; });
    apply();
  }
  var baseRenderAnalytics = window.renderAnalytics;
  window.renderAnalytics = renderAnalytics = function () { var result = baseRenderAnalytics.apply(this, arguments); if ((state.analyticsTab || 'overview') !== 'overview') setTimeout(enhanceAnalytics, 0); return result; };

  window.RTMUI = window.RTMUI || {afterRender: [], adminView: []};
  window.RTMUI.adminView.push(function (view) { if (view === 'analytics' && (state.analyticsTab || 'overview') !== 'overview') enhanceAnalytics(); });

  /* The acknowledgements module owns the Reviews route.  Keep this legacy
     entry point only as a fallback for a standalone v52 host; otherwise its
     deferred render replaces the selected Centre tab after the route opens. */
  document.addEventListener('click', function (event) {
    var review = event.target.closest && event.target.closest('[data-admin-view="reviews"]');
    if (review && !(window.RTMV5100 && window.RTMV5100.renderCenter)) setTimeout(renderReviewsV52, 0);
  }, true);
  function migrateExisting() {
    loadTemplate().then(async function () {
      var tests = (state.items || []).filter(function (item) { return item.PROPERTY_VALUES && item.PROPERTY_VALUES.type === 'test'; });
      for (var index = 0; index < tests.length; index += 1) { try { await ensureDesigner(tests[index], false); } catch (error) { console.warn('Test migration skipped', tests[index].ID, error); } }
    }).catch(function (error) { console.error(error); });
  }
  setTimeout(migrateExisting, 1600);
  window.RTMV52 = {version: VERSION, designerScene: designerScene, createScene: function (meta, title) { return loadTemplate().then(function (template) { return designerScene(template, meta, title); }); }, ensureDesigner: ensureDesigner, renderReviews: renderReviewsV52, enhanceAnalytics: enhanceAnalytics};
})();


/* source: v053.js */
(function(){
'use strict';
var V='50.3.4',ui={tab:'overview',af:'pending_review',mf:'pending',q:''};
function role(){return String(state.currentRole||getAppRole(state.user)||'employee')}
function rank(r){return({employee:0,student:0,teacher:1,moderator:2,editor:2,admin:3,developer:4})[String(r)]||0}
function uid(){return String(state.user&&state.user.ID||effectiveUserId())}
function admin(){return rank(role())>=3}
function ta(a){var p=a&&a.PROPERTY_VALUES||{};return p.assignmentKind==='teacher'&&p.status!=='removed'}
function tas(){return(state.assigns||[]).filter(ta)}
function courseId(i){return!i?'':materialKind(i)==='course'?String(i.ID):String(i.PROPERTY_VALUES&&i.PROPERTY_VALUES.parentId||'')}
function assigned(user,i){if(admin())return true;var c=courseId(i),pr=String(i&&i.PROPERTY_VALUES&&i.PROPERTY_VALUES.projectId||'');return tas().some(function(a){var p=a.PROPERTY_VALUES||{};return String(p.userId)===String(user)&&((p.targetType==='project'&&String(p.targetId)===pr)||(p.targetType==='course'&&String(p.targetId)===c)||String(p.targetId)===String(i&&i.ID))})}
function visible(a){var p=a.PROPERTY_VALUES||{};return admin()||assigned(uid(),findItem(p.testId))||String(p.reviewerId||'')===uid()}
function ap(i){var m=j(i&&i.PROPERTY_VALUES&&i.PROPERTY_VALUES.meta);return m.approval||{status:'draft',history:[]}}
function apl(s){return({draft:'Черновик',pending:'Ожидает проверки',returned:'Возвращён',approved:'Одобрен',published:'Опубликован'})[s]||s}
async function saveAp(i,a){var m=j(i.PROPERTY_VALUES.meta);m.approval=a;i.PROPERTY_VALUES.meta=json(m);await saveItemMeta(i.ID,m)}
function due(){var d=new Date(),n=0;while(n<3){d.setDate(d.getDate()+1);if(d.getDay()!==0&&d.getDay()!==6)n++}return d.toISOString()}
async function notify(user,text){try{await RTMV47.bitrixCall('im.notify.personal.add',{USER_ID:Number(user)||user,MESSAGE:text})}catch(e){console.warn(e)}}
function target(p){var i=findItem(p.targetId);return i&&i.NAME||'Материал'}
async function task(a){var p=a.PROPERTY_VALUES||{},link=location.origin+'/?rtm_review=assignments&target='+encodeURIComponent(p.targetId);try{var r=await RTMV47.bitrixCall('tasks.task.add',{fields:{TITLE:'Проверить: '+target(p),RESPONSIBLE_ID:Number(p.userId)||p.userId,DEADLINE:p.dueAt||due(),DESCRIPTION:'Открыть Центр проверок: '+link}});p.taskId=String(r&&r.task&&(r.task.id||r.task.ID)||r&&r.id||'');await upd(E.assigns,a.ID,a.NAME,p);return p.taskId}catch(e){toast('Задача не создана: '+(e.message||e));return''}}
async function addTeacher(kind,user,date,send,makeTask){var c=assignmentConfig(kind);if(tas().some(function(a){var p=a.PROPERTY_VALUES||{};return String(p.userId)===String(user)&&p.targetType===c.targetType&&String(p.targetId)===String(c.id)}))return toast('Уже назначен');var p={assignmentKind:'teacher',status:'active',targetId:String(c.id),targetType:c.targetType,userId:String(user),dueAt:date||due(),createdAt:now(),createdBy:uid()},id=await add(E.assigns,'Проверяющий: '+c.title,p),a={ID:String(id),NAME:'Проверяющий: '+c.title,PROPERTY_VALUES:p,DATE_CREATE:now()};state.assigns.unshift(a);if(send)await notify(user,'Вам назначена проверка «'+c.title+'». Откройте Центр проверок.');if(makeTask)await task(a);writeCache();renderAssignmentPanel(kind);toast('Преподаватель назначен')}
function teachers(kind,pane){
 pane.querySelectorAll('input[placeholder*="имени"],select').forEach(function(x){if(!x.closest('.v53-teachers')&&(x.tagName==='INPUT'||/департамент/i.test(x.options&&x.options[0]&&x.options[0].text||'')))x.style.display='none'});var old=pane.querySelector('.v53-teachers');if(old)old.remove();var c=assignmentConfig(kind),rows=tas().filter(function(a){var p=a.PROPERTY_VALUES||{};return p.targetType===c.targetType&&String(p.targetId)===String(c.id)}),s=document.createElement('section');s.className='settings-card v53-teachers';s.innerHTML='<div class="v53-head"><div><h3>Преподаватели и проверяющие</h3><p>Назначение курса наследуется всеми его материалами.</p></div><button id="v53Add">Назначить</button></div><div>'+((rows.map(function(a){var p=a.PROPERTY_VALUES||{},u=userById(p.userId)||{};return'<article><div><b>'+esc(fullName(u)||('ID '+p.userId))+'</b><small>'+esc(roleLabel(getAppRole(u)))+' · '+esc(p.dueAt?new Date(p.dueAt).toLocaleDateString('ru-RU'):'без срока')+'</small></div><div><button data-n="'+a.ID+'">Уведомить</button><button data-t="'+a.ID+'">Задача</button><button class="danger" data-r="'+a.ID+'">Снять</button></div></article>'}).join(''))||'<p>Назначений нет.</p>')+'</div>';pane.insertBefore(s,pane.firstChild);
 s.querySelector('#v53Add').onclick=function(){var users=(state.users||[]).filter(function(u){return rank(getAppRole(u))>=1});modal('<h2>Назначить преподавателя</h2><label>Преподаватель<select id="v53U">'+users.map(function(u){return'<option value="'+u.ID+'">'+esc(fullName(u))+' · '+esc(roleLabel(getAppRole(u)))+'</option>'}).join('')+'</select></label><label>Срок<input id="v53D" type="date"></label><label><input id="v53N" type="checkbox" checked> Уведомить</label><label><input id="v53T" type="checkbox"> Создать задачу Bitrix24</label><div class="inline-actions right"><button onclick="closeModal()">Отмена</button><button class="primary" id="v53S">Назначить</button></div>');$('#v53S').onclick=async function(){var d=$('#v53D').value;this.disabled=true;await addTeacher(kind,$('#v53U').value,d?new Date(d+'T18:00:00').toISOString():'',$('#v53N').checked,$('#v53T').checked);closeModal()}};
 s.querySelectorAll('[data-r]').forEach(function(b){b.onclick=async function(){await del(E.assigns,b.dataset.r);state.assigns=state.assigns.filter(function(a){return String(a.ID)!==String(b.dataset.r)});renderAssignmentPanel(kind)}});s.querySelectorAll('[data-n]').forEach(function(b){b.onclick=async function(){var a=state.assigns.find(function(x){return String(x.ID)===String(b.dataset.n)});await notify(a.PROPERTY_VALUES.userId,'Напоминание: ожидается проверка «'+target(a.PROPERTY_VALUES)+'».');toast('Уведомление отправлено')}});s.querySelectorAll('[data-t]').forEach(function(b){b.onclick=async function(){var a=state.assigns.find(function(x){return String(x.ID)===String(b.dataset.t)});if(await task(a))toast('Задача создана')}})
}
var bra=window.renderAssignmentPanel;window.renderAssignmentPanel=renderAssignmentPanel=function(kind){bra.apply(this,arguments);var c=assignmentConfig(kind),p=document.querySelector(c.pane);if(p)teachers(kind,p)};
setTimeout(function(){['course','article','test'].forEach(function(kind){var c=assignmentConfig(kind),p=document.querySelector(c.pane);if(p&&c.id)teachers(kind,p)})},0);
function answers(){var q=ui.q.toLowerCase();return(state.attempts||[]).filter(visible).filter(function(a){var p=a.PROPERTY_VALUES||{},s=String(p.reviewStatus||p.status||'pending_review'),u=userById(p.userId)||{},t=findItem(p.testId);return(ui.af==='all'||s===ui.af)&&(fullName(u)+' '+(t&&t.NAME||'')).toLowerCase().includes(q)})}
function materials(){return activeRows(state.items).filter(function(i){return['course','article','test'].includes(materialKind(i))&&(admin()||assigned(uid(),i))}).filter(function(i){return ui.mf==='all'||ap(i).status===ui.mf})}
function arow(a){var p=a.PROPERTY_VALUES||{},u=userById(p.userId)||{},t=findItem(p.testId);return'<button class="v53-row" data-a="'+a.ID+'"><b>'+esc(fullName(u)||('ID '+p.userId))+'</b><span>'+esc(t&&t.NAME||'Тест')+'</span><small>'+esc(p.automaticCorrect||0)+' из '+esc(p.automaticTotal||0)+(p.reviewerId?' · в работе':'')+'</small></button>'}
function mrow(i){var a=ap(i);return'<article class="v53-row"><b>'+esc(i.NAME)+'</b><span>'+esc(materialKind(i))+' · '+esc(apl(a.status))+'</span><button data-m="'+i.ID+'">Открыть</button></article>'}
function counts(){var as=(state.attempts||[]).filter(visible),ms=activeRows(state.items).filter(function(i){return['course','article','test'].includes(materialKind(i))&&(admin()||assigned(uid(),i))});return{a:as.filter(function(x){return['pending_review','in_review'].includes(String((x.PROPERTY_VALUES||{}).reviewStatus||'pending_review'))}).length,m:ms.filter(function(i){return ap(i).status==='pending'}).length,r:as.filter(function(x){return String((x.PROPERTY_VALUES||{}).reviewStatus)==='returned'}).length,o:tas().filter(function(x){return x.PROPERTY_VALUES.dueAt&&new Date(x.PROPERTY_VALUES.dueAt)<new Date()}).length}}
function help(){modal('<div class="v53-help"><button type="button" class="modal-close" onclick="closeModal()">×</button><h2>Как пользоваться Центром проверок</h2><h3>Ученик</h3><p>Проходит материалы, получает решение и комментарий к возвращённому ответу.</p><h3>Преподаватель</h3><p>Берёт ответ в работу, проверяет снимок теста, принимает или возвращает с комментарием. Видит прямые и унаследованные назначения курса.</p><h3>Редактор</h3><p>Создаёт и сохраняет материал, отправляет фиксированную ревизию на проверку; может отозвать её, исправить и отправить снова.</p><h3>Администратор</h3><p>Видит все очереди, назначает и переназначает проверяющих, принимает ответы и публикует одобренные материалы.</p><h3>Разработчик</h3><p>Полный доступ. История и снимок ревизии: meta.approval; назначения: rtm_assigns/assignmentKind=teacher. Задачи ведут deep-link в Центр. Ошибка уведомления не отменяет назначение.</p></div>')}
function body(){if(ui.tab==='overview'){var c=counts();return'<div class="v53-metrics"><article><b>'+c.a+'</b><span>Ответов ожидают</span></article><article><b>'+c.m+'</b><span>Материалов на проверке</span></article><article><b>'+c.r+'</b><span>Возвращено</span></article><article><b>'+c.o+'</b><span>Просрочено</span></article></div><div class="v53-queues"><section><h3>Срочные ответы</h3>'+answers().slice(0,6).map(arow).join('')+'</section><section><h3>Материалы к публикации</h3>'+materials().slice(0,6).map(mrow).join('')+'</section></div>'}if(ui.tab==='answers')return'<div class="v53-tools"><input id="v53Q" value="'+esc(ui.q)+'" placeholder="Поиск"><select id="v53AF"><option value="pending_review">Ожидают</option><option value="in_review">В работе</option><option value="returned">Возвращены</option><option value="approved">Приняты</option><option value="all">Все</option></select><button id="v53CSV">Экспорт CSV</button></div><div class="v53-list">'+(answers().map(arow).join('')||'Очередь пуста')+'</div>';if(ui.tab==='materials')return'<div class="v53-tools"><select id="v53MF"><option value="pending">Ожидают</option><option value="returned">Возвращены</option><option value="approved">Одобрены</option><option value="published">Опубликованы</option><option value="all">Все</option></select></div><div class="v53-list">'+(materials().map(mrow).join('')||'Материалов нет')+'</div>';return'<div class="v53-list">'+(tas().filter(function(a){return admin()||String(a.PROPERTY_VALUES.userId)===uid()}).map(function(a){var p=a.PROPERTY_VALUES||{},u=userById(p.userId)||{};return'<article class="v53-row"><b>'+esc(target(p))+'</b><span>'+esc(fullName(u))+' · '+esc(p.targetType)+'</span><small>'+esc(p.dueAt?new Date(p.dueAt).toLocaleString('ru-RU'):'Без срока')+'</small></article>'}).join('')||'Назначений нет')+'</div>'}
function render(){var r=$('#adminReviews');if(!r)return;r.innerHTML='<div class="v53-center"><header class="admin-page-head"><div><h1>Центр проверок</h1><p>Ответы, публикация и нагрузка преподавателей</p></div><div><button id="v53Help">Как пользоваться</button><button id="v53Refresh">Обновить</button></div></header><nav class="v53-tabs">'+[['overview','Обзор'],['answers','Ответы учеников'],['materials','Проверка материалов'],['assignments','Назначения']].map(function(x){return'<button data-tab="'+x[0]+'" class="'+(ui.tab===x[0]?'active':'')+'">'+x[1]+'</button>'}).join('')+'</nav>'+body()+'</div>';r.querySelectorAll('[data-tab]').forEach(function(b){b.onclick=function(){ui.tab=b.dataset.tab;render()}});$('#v53Help').onclick=help;$('#v53Refresh').onclick=async function(){await loadAll(true);render()};r.querySelectorAll('[data-a]').forEach(function(b){b.onclick=function(){openAnswer(b.dataset.a)}});r.querySelectorAll('[data-m]').forEach(function(b){b.onclick=function(){openMaterial(b.dataset.m)}});var q=$('#v53Q');if(q)q.oninput=function(){ui.q=q.value;render()};var af=$('#v53AF');if(af){af.value=ui.af;af.onchange=function(){ui.af=af.value;render()}}var mf=$('#v53MF');if(mf){mf.value=ui.mf;mf.onchange=function(){ui.mf=mf.value;render()}}var csv=$('#v53CSV');if(csv)csv.onclick=exportCsv}
function answerData(p){var snap={},ans={},details={};try{snap=JSON.parse(p.testSnapshot||'{}')}catch(e){}try{ans=JSON.parse(p.answers||'{}')}catch(e){}try{details=JSON.parse(p.reviewDetails||'{}')}catch(e){}return{questions:(snap.questions||[]).filter(function(q){return['freeText','mediaFreeText','text'].includes(String(q.type||''))}),answers:ans,details:details}}
function openAnswer(id){var a=state.attempts.find(function(x){return String(x.ID)===String(id)});if(!a)return;var p=a.PROPERTY_VALUES||{},u=userById(p.userId)||{},t=findItem(p.testId),d=answerData(p);modal('<div class="v53-answer-review"><h2>'+esc(t&&t.NAME||'Ответ')+'</h2><p>'+esc(fullName(u))+' · авточасть '+esc(p.automaticCorrect||0)+' из '+esc(p.automaticTotal||0)+'</p>'+d.questions.map(function(q,n){var s=d.details[q.id]||{};return'<section><b>'+(n+1)+'. '+esc(q.text||'')+'</b><div class="v53-answer-text">'+esc(d.answers[q.id]||'')+'</div><label><input type="radio" name="v53d_'+q.id+'" value="accepted" '+(s.status!=='rejected'?'checked':'')+'> Принять</label><label><input type="radio" name="v53d_'+q.id+'" value="rejected" '+(s.status==='rejected'?'checked':'')+'> Вернуть</label><textarea data-v53-comment="'+q.id+'" placeholder="Комментарий к ответу">'+esc(s.comment||'')+'</textarea></section>'}).join('')+'<textarea id="v53C" placeholder="Общий комментарий">'+esc(p.reviewComment||'')+'</textarea><div class="inline-actions right"><button id="v53Claim">Взять в работу</button><button class="primary" id="v53Finish">Сохранить решение</button></div></div>');$('#v53Claim').onclick=async function(){if(p.reviewerId&&String(p.reviewerId)!==uid()&&!admin())return alert('Уже проверяется другим преподавателем.');p.reviewerId=uid();p.reviewStatus='in_review';p.claimedAt=now();await upd(E.attempts,a.ID,a.NAME,p);closeModal();render()};$('#v53Finish').onclick=function(){finishAnswer(a,d.questions)}}
async function finishAnswer(a,questions){var p=a.PROPERTY_VALUES||{},c=$('#v53C').value.trim(),details={},back=false;questions.forEach(function(q){var s=document.querySelector('[name="v53d_'+q.id+'"]:checked'),f=document.querySelector('[data-v53-comment="'+q.id+'"]'),status=s&&s.value||'accepted',comment=String(f&&f.value||'').trim();if(status==='rejected')back=true;details[q.id]={status:status,comment:comment}});if(back&&!Object.keys(details).some(function(k){return details[k].status==='rejected'&&details[k].comment})&&!c)return alert('Укажите, что исправить.');if(p.reviewerId&&String(p.reviewerId)!==uid()&&!admin())return alert('Ответ проверяет другой преподаватель.');Object.assign(p,{reviewStatus:back?'returned':'approved',pendingReview:'N',reviewComment:c,reviewDetails:JSON.stringify(details),reviewedBy:uid(),reviewedAt:now(),updatedAt:now(),passed:back?'N':'Y'});await upd(E.attempts,a.ID,a.NAME,p);await notify(p.userId,back?'Ответ возвращён: '+(c||'смотрите комментарии преподавателя'):'Ответ принят.');closeModal();render()}
function openMaterial(id){var i=findItem(id),a=ap(i);modal('<div class="v53-material"><h2>'+esc(i.NAME)+'</h2><p><b>'+esc(apl(a.status))+'</b> · ревизия '+esc(a.revision||'—')+'</p>'+(a.comment?'<p class="v53-note">'+esc(a.comment)+'</p>':'')+'<textarea id="v53MC" placeholder="Комментарий"></textarea><h3>История</h3><div class="v53-history">'+((a.history||[]).slice().reverse().map(function(h){return'<p><b>'+esc(apl(h.status))+'</b> · '+esc(h.at||'')+'<br>'+esc(h.comment||'')+'</p>'}).join('')||'История пуста')+'</div><div class="inline-actions right">'+(a.status==='pending'&&!admin()?'<button id="v53Revoke">Отозвать и редактировать</button>':'')+(a.status==='pending'&&admin()?'<button class="danger" id="v53MR">Вернуть</button><button class="primary" id="v53MP">Одобрить и опубликовать</button>':'')+'</div></div>');if($('#v53Revoke'))$('#v53Revoke').onclick=function(){decide(i,'draft','Заявка отозвана автором')};if($('#v53MR'))$('#v53MR').onclick=function(){var c=$('#v53MC').value.trim();if(!c)return alert('Напишите, что исправить.');decide(i,'returned',c)};if($('#v53MP'))$('#v53MP').onclick=function(){decide(i,'published',$('#v53MC').value.trim())}}
async function decide(i,status,comment){var a=ap(i);Object.assign(a,{status:status,comment:comment||'',reviewedBy:uid(),reviewedAt:now()});a.history=(a.history||[]).concat({status:status,at:now(),by:uid(),comment:comment||''});if(status==='published'){i.PROPERTY_VALUES.status='published';await upd(E.items,i.ID,i.NAME,i.PROPERTY_VALUES)}await saveAp(i,a);closeModal();render();toast(apl(status))}
async function submit(i){var a=ap(i),m=j(i.PROPERTY_VALUES.meta);a={status:'pending',revision:String(Date.now()),submittedAt:now(),submittedBy:uid(),snapshot:JSON.stringify({id:i.ID,name:i.NAME,type:materialKind(i),content:i.PROPERTY_VALUES.content||'',meta:Object.assign({},m,{approval:undefined})}),history:(a.history||[]).concat({status:'pending',at:now(),by:uid(),comment:'Отправлено на проверку'})};await saveAp(i,a);toast('Материал отправлен на проверку')}
function exportCsv(){var csv='Пользователь;Тест;Статус;Обновлено\n'+answers().map(function(a){var p=a.PROPERTY_VALUES||{};return[fullName(userById(p.userId)||{}),(findItem(p.testId)||{}).NAME,p.reviewStatus,p.updatedAt].map(function(x){return'"'+String(x||'').replace(/"/g,'""')+'"'}).join(';')}).join('\n'),url=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv'})),a=document.createElement('a');a.href=url;a.download='reviews.csv';a.click();URL.revokeObjectURL(url)}
var bpt=window.publishTest;window.publishTest=publishTest=async function(){var i=findItem(state.testId);if(rank(role())<3){await saveTestFromEditor();await submit(i);openTestEditor(i.ID);return}return bpt.apply(this,arguments)};var bpc=window.publishCourse;window.publishCourse=publishCourse=async function(){var i=findItem(state.courseId);if(rank(role())<3){await saveCourseSettings();await submit(i);openCourseEditor(i.ID);return}return bpc.apply(this,arguments)};
/* Центром проверок владеет acknowledgements.js. Этот legacy-режим остаётся
   доступен через RTMV53, но больше не перехватывает routing и renderAll. */
function mobile(){document.querySelectorAll('.mobile-admin-nav,.mobile-drawer,.admin-mobile-menu').forEach(function(n){if(n.querySelector('[data-v53-mobile]'))return;var b=document.createElement('button');b.dataset.v53Mobile='1';b.textContent='Центр проверок';b.onclick=function(){switchAdmin('reviews')};n.appendChild(b)})}new MutationObserver(mobile).observe(document.documentElement,{childList:true,subtree:true});setTimeout(mobile,0);
window.RTMV53={version:V,renderCenter:render,renderTeachers:teachers,assignedTo:assigned,submitMaterial:submit,selfTest:function(){var e=[];if(!Array.isArray(state.assigns))e.push('assigns');if(!Array.isArray(state.attempts))e.push('attempts');if(!Array.isArray(state.items))e.push('items');return{ok:!e.length,errors:e,counts:counts()}}};
})();


/* source: v054.js */
(function(){
'use strict';
var V='50.3.4';
function mobile(){
 var nav=document.getElementById('v38MobileNav');
 if(!nav||state.mode!=='admin'||nav.querySelector('[data-v54-review]'))return;
 var b=document.createElement('button');b.dataset.v54Review='1';b.textContent='Центр проверок';
 b.onclick=function(){switchAdmin('reviews');if(window.v38CloseMobileMenu)window.v38CloseMobileMenu()};
 var before=nav.querySelector('[data-v38-admin="events"]');nav.insertBefore(b,before||nav.querySelector('.v38-mobile-projects'));
}
function workspace(){
 var root=document.getElementById('adminInfo'),canvas=document.getElementById('v492DeveloperCanvas');
 if(!root||!canvas||root.querySelector('.v54-workspace-tools'))return;
 var bar=document.createElement('div');bar.className='v54-workspace-tools';bar.innerHTML='<button type="button">Резервные версии доски</button>';root.insertBefore(bar,canvas);
 bar.firstChild.onclick=async function(){
  try{
   var data=await RTMV47.request('/api/v47/developer-workspace/revisions'),rows=Array.isArray(data)?data:(data.revisions||[]);
   modal('<div><h2>Резервные версии доски</h2><p>Перед восстановлением текущая доска тоже сохранится в истории.</p><div class="v54-revisions">'+rows.map(function(r){return'<article><span><b>Ревизия '+esc(r.revision)+'</b><br><small>'+esc(new Date(r.created_at).toLocaleString('ru-RU'))+'</small></span><button data-v54-restore="'+esc(r.revision)+'">Восстановить</button></article>'}).join('')+'</div><div class="inline-actions right"><button onclick="closeModal()">Закрыть</button></div></div>');
   document.querySelectorAll('[data-v54-restore]').forEach(function(x){x.onclick=async function(){if(!confirm('Восстановить эту версию доски?'))return;x.disabled=true;try{closeModal();if(window.RTMV492&&window.RTMV492.restoreWorkspace)await window.RTMV492.restoreWorkspace(Number(x.dataset.v54Restore));else{await RTMV47.request('/api/v47/developer-workspace/restore',{method:'POST',body:JSON.stringify({revision:Number(x.dataset.v54Restore)})});window.RTMV492&&window.RTMV492.mountWorkspace()}}catch(error){alert('Не удалось восстановить версию: '+(error.message||error))}}})
  }catch(e){alert('Не удалось открыть историю: '+(e.message||e))}
 };
}
new MutationObserver(function(){mobile();workspace()}).observe(document.documentElement,{childList:true,subtree:true});
setTimeout(function(){mobile();workspace()},0);
window.RTMV54={version:V,mobile:mobile,workspace:workspace};
})();
