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
  if (typeof finishArticleBase === 'function') window.finishCurrentArticle = async function () { await flushActivity(); activity = null; return finishArticleBase.apply(this, arguments); };
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
