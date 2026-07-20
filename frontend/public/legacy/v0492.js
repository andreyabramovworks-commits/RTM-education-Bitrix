/* RTM Education v49.2: roles, protected workspace and test experience. */
(function () {
  'use strict';

  var TEST_UI_KEY = 'rtm_v492_test_ui';
  var classicTestEditor = window.renderTestEditor;
  var classicTestIntro = window.renderUserTestIntro;
  var classicTakeTest = window.renderTakeTest;
  var workspaceTimer = 0, workspaceScene = null, workspaceRevision = 0, workspaceMounted = false, developerPreviewRole = null, testUiChoice = 'modern';

  try { testUiChoice = localStorage.getItem(TEST_UI_KEY) === 'classic' ? 'classic' : 'modern'; } catch (_) { var savedTestUi = String(document.cookie || '').match(/(?:^|;\s*)rtm_v492_test_ui=(classic|modern)/); if (savedTestUi) testUiChoice = savedTestUi[1]; }
  function testUi() { return testUiChoice; }
  function testSwitch() { return '<div class="v492-test-switch"><button type="button" data-v492-test-ui="modern" class="' + (testUi() === 'modern' ? 'active' : '') + '">Новый вид</button><button type="button" data-v492-test-ui="classic" class="' + (testUi() === 'classic' ? 'active' : '') + '">Классический</button></div>'; }
  function applyTestUiChoice(value) { testUiChoice = value === 'classic' ? 'classic' : 'modern'; try { localStorage.setItem(TEST_UI_KEY, testUiChoice); } catch (_) { try { document.cookie = 'rtm_v492_test_ui=' + testUiChoice + '; Path=/; SameSite=Lax; Max-Age=31536000'; } catch (_) {} } if (state.testId && document.getElementById('testQuestionsEditor') && !document.getElementById('testQuestionsEditor').closest('.hidden')) window.renderTestEditor(); else { var item = findItem(document.getElementById('userMaterialView') && document.getElementById('userMaterialView').dataset.id); if (item) window.openUserMaterial(item); } }
  function bindTestSwitch() { document.querySelectorAll('[data-v492-test-ui]').forEach(function (button) { button.onclick = function () { applyTestUiChoice(button.dataset.v492TestUi); }; }); }
  function currentRole() { return String(state.currentRole || 'employee'); }
  function canAdmin() { return ['developer', 'admin', 'moderator', 'teacher'].includes(currentRole()); }
  function canEditContent() { return ['developer', 'admin', 'moderator'].includes(currentRole()); }
  function actualRole() { return String(getAppRole(state.user) || 'employee'); }
  function isActualDeveloper() { return actualRole() === 'developer' && String(state.user && state.user.ID || '') === '36'; }
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
  window.openUserMaterial = function (material) { if (material && !canOpenCourseMaterial(material)) { alert('Сначала завершите предыдущий обязательный материал.'); return; } var result = baseOpenUserMaterial.apply(this, arguments); setTimeout(bindTestSwitch, 0); return result; };

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
    if (testUi() === 'classic') { classicTestEditor(); var root = document.getElementById('testQuestionsEditor'); if (root) root.insertAdjacentHTML('afterbegin', testSwitch()); bindTestSwitch(); return; }
    var item = findItem(state.testId), meta = testDefaults(j(item.PROPERTY_VALUES.meta)), root = document.getElementById('testQuestionsEditor');
    root.innerHTML = testSwitch() + renderTestSettings(meta) + ((meta.questions || []).map(function (q, i) { return questionEditor(q, i, false); }).join('') || '<div class="panel">Вопросов пока нет</div>');
    renderAssignmentPanel('test'); bindTestEditor(); bindTestTabs(); bindTestSwitch(); bindQuestionMedia();
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
    if (testUi() === 'classic') return testSwitch() + classicTakeTest(test);
    var meta = testDefaults(j(test.PROPERTY_VALUES.meta)), attempts = testAttemptsUsed(test.ID), left = Math.max(0, meta.attemptsLimit - attempts); if (left <= 0) return testSwitch() + '<div class="test-intro-card"><h3>' + esc(test.NAME) + '</h3><p>Попытки закончились</p></div>';
    var questions = meta.shuffleQuestions ? shuffleCopy(meta.questions || []).map(function (x) { return {q: x.v, orig: x.i}; }) : (meta.questions || []).map(function (q, i) { return {q: q, orig: i}; });
    return testSwitch() + '<form class="take-test-card v492-take-test" data-take-test="' + test.ID + '" data-test-start="' + Date.now() + '"><div class="v492-test-head"><h2>' + esc(test.NAME) + '</h2><span>' + questions.length + ' вопросов</span></div>' + questions.map(function (row, i) { return '<section class="test-question"><b>' + (i + 1) + '. ' + esc(row.q.text) + '</b>' + mediaHtml(row.q.media) + answerControl(test, row.q, row.orig, i) + '</section>'; }).join('') + '<button class="primary v492-test-submit">Отправить ответы</button></form>';
  };
  window.renderUserTestIntro = function (test) {
    if (testUi() === 'classic') return testSwitch() + classicTestIntro(test);
    var meta = testDefaults(j(test.PROPERTY_VALUES.meta)), used = testAttemptsUsed(test.ID), left = Math.max(0, meta.attemptsLimit - used);
    return testSwitch() + '<div class="test-intro-card v492-test-intro"><h2>' + esc(test.NAME) + '</h2><div class="test-info-grid"><span><i>◷</i><small>Доступное время на прохождение</small><b>' + (meta.timeLimit ? meta.timeLimit + ' мин' : 'Без ограничения') + '</b></span><span><i>↻</i><small>Доступное количество попыток</small><b>' + left + ' шт</b></span><span><i>✓</i><small>Порог прохождения теста</small><b>' + meta.passScore + '%</b></span><span><i>☆</i><small>Баллов за прохождение</small><b>' + meta.points + ' шт</b></span></div><button class="primary" data-start-user-test="' + test.ID + '" ' + (left <= 0 ? 'disabled' : '') + '>Приступить</button></div>';
  };
  window.takeTestSubmit = async function (event) {
    event.preventDefault(); var form = event.currentTarget, id = form.dataset.takeTest, test = findItem(id); if (!test) return;
    var meta = testDefaults(j(test.PROPERTY_VALUES.meta)), questions = meta.questions || [], good = 0, automatic = 0, pending = false, answers = [];
    questions.forEach(function (q, qi) { if (q.type === 'text') { var text = form.querySelector('[name="t' + id + 'q' + qi + '"]'); answers[qi] = {type: 'text', value: String(text && text.value || '').trim()}; pending = true; return; } if (q.type === 'match') { var selectedPairs = (q.pairs || []).map(function (_, pi) { var el = form.querySelector('[name="t' + id + 'q' + qi + 'p' + pi + '"]'); return Number(el && el.value); }); answers[qi] = {type: 'match', value: selectedPairs}; automatic++; if (selectedPairs.every(function (value, pi) { return value === pi; })) good++; return; } var selected = Array.from(form.querySelectorAll('[name="t' + id + 'q' + qi + '"]:checked')).map(function (x) { return Number(x.value); }).sort(); var correct = (q.correct || []).slice().sort(); answers[qi] = {type: q.type, value: selected}; automatic++; if (selected.join(',') === correct.join(',')) good++; });
    var score = automatic ? Math.round(good / automatic * 100) : 0, passed = !pending && score >= meta.passScore, props = {courseId: String(state.courseId || test.PROPERTY_VALUES.parentId || ''), testId: String(id), userId: String(typeof rtmCanonicalUserId === 'function' ? rtmCanonicalUserId(effectiveUserId()) : effectiveUserId()), score: String(score), passed: pending ? 'PENDING' : passed ? 'Y' : 'N', pendingReview: pending ? 'Y' : 'N', answers: JSON.stringify(answers), createdAt: now()};
    var attemptId = await add(E.attempts, 'Попытка теста', props); state.attempts.unshift({ID: String(attemptId), NAME: 'Попытка теста', PROPERTY_VALUES: props, DATE_CREATE: props.createdAt}); if (passed) await complete(id, 'test');
    if (pending) modal('<div class="test-outcome pending"><h2>Ответ отправлен</h2><p>Свободный ответ сохранён и ожидает проверки преподавателя.</p><button class="primary" id="testOutcomeClose">Продолжить</button></div>'); else if (passed) modal('<div class="test-outcome ok"><h2>Тест пройден</h2><p>Правильных ответов: <b>' + good + ' из ' + automatic + '</b></p><p>Результат: <b>' + score + '%</b></p><button class="primary" id="testOutcomeClose">Продолжить</button></div>'); else modal('<div class="test-outcome bad"><h2>Тест не пройден</h2><p>Правильных ответов: <b>' + good + ' из ' + automatic + '</b></p><p>Результат: <b>' + score + '%</b></p><div class="inline-actions"><button class="primary" id="testOutcomeRetry">Начать заново</button><button id="testOutcomeClose">Закрыть</button></div></div>');
    var close = document.getElementById('testOutcomeClose'); if (close) close.onclick = function () { closeModal(); var list = typeof courseChildren === 'function' ? courseChildren(state.courseId) : [], position = list.findIndex(function (item) { return String(item.ID) === String(test.ID); }), next = position >= 0 ? list[position + 1] : null; if (next) openUserMaterial(next); else if (test.PROPERTY_VALUES.parentId) openUserCourse(findItem(test.PROPERTY_VALUES.parentId)); };
    var retry = document.getElementById('testOutcomeRetry'); if (retry) retry.onclick = function () { closeModal(); document.getElementById('uMaterialBody').innerHTML = renderTakeTest(test); bindTestSwitch(); document.querySelectorAll('[data-take-test]').forEach(function (f) { f.onsubmit = takeTestSubmit; }); };
    renderProfile();
  };

  async function mountWorkspace() {
    var root = document.getElementById('adminInfo'); if (!root || state.aview !== 'info') return; if (!isDeveloper()) { root.innerHTML = '<div class="panel"><b>Доступ закрыт</b></div>'; return; }
    root.classList.remove('placeholder-view'); root.innerHTML = '<div class="v492-workspace-status">Загружаю защищённый лист…</div><div id="v492DeveloperCanvas" class="v492-developer-canvas"></div>'; var host = document.getElementById('v492DeveloperCanvas');
    try { var payload = await window.RTMV47.request('/api/v47/developer-workspace'); workspaceScene = payload.scene; workspaceRevision = Number(payload.revision || 0); workspaceMounted = true; var status = root.querySelector('.v492-workspace-status'); function save() { clearTimeout(workspaceTimer); workspaceTimer = setTimeout(async function () { status.textContent = 'Сохраняю…'; try { var saved = await window.RTMV47.request('/api/v47/developer-workspace', {method: 'PUT', body: JSON.stringify({scene: workspaceScene})}); workspaceRevision = Number(saved.revision || workspaceRevision + 1); status.textContent = 'Сохранено на сервере · ревизия ' + workspaceRevision + ' · резервная копия выгружается в Google Drive автоматически'; } catch (error) { status.textContent = 'Не удалось отправить на сервер. Лист открыт, повторю при следующем изменении.'; } }, 1400); } window.RTMCanvas.mount(host, {pageKey: 'developer-workspace', scene: workspaceScene, readOnly: false, completionRequired: false, title: '', brandColor: '#ef174c', onChange: function (scene) { workspaceScene = scene; save(); }, onManualSave: async function () { clearTimeout(workspaceTimer); var saved = await window.RTMV47.request('/api/v47/developer-workspace', {method: 'PUT', body: JSON.stringify({scene: workspaceScene})}); workspaceRevision = Number(saved.revision || workspaceRevision + 1); status.textContent = 'Сохранено на сервере · ревизия ' + workspaceRevision; }, onRequestDisk: window.RTMV46.pickDiskMedia}); } catch (error) { root.innerHTML = '<div class="v43-canvas-error"><b>Лист пока недоступен</b><span>' + esc(error.message || String(error)) + '</span><button type="button">Повторить</button></div>'; root.querySelector('button').onclick = mountWorkspace; }
  }
  var baseSwitchAdmin = window.switchAdmin;
  window.switchAdmin = function (view) { if (view === 'info' && !isDeveloper()) return; var result = baseSwitchAdmin.apply(this, arguments); if (view === 'info') setTimeout(mountWorkspace, 0); return result; };
  var baseRenderAll = window.renderAll;
  window.renderAll = function () { var result = baseRenderAll.apply(this, arguments); applyAccess(); document.querySelectorAll('[data-v492-test-ui]').forEach(function () {}); if (state.aview === 'info') setTimeout(mountWorkspace, 0); if (currentRole() === 'teacher') document.querySelectorAll('[data-add-project],#addProjectBtn,[data-edit-child],[data-child-menu],#addQuestionBtn,.rtm-canvas-save').forEach(function (node) { node.hidden = true; }); return result; };
  var baseMobileMenu = window.v38RenderMobileMenu;
  if (typeof baseMobileMenu === 'function') window.v38RenderMobileMenu = function () { var result = baseMobileMenu.apply(this, arguments); renderDeveloperMobilePreview(); return result; };

  document.addEventListener('click', function (event) { var testUiButton = event.target.closest('[data-v492-test-ui]'); if (testUiButton) { event.preventDefault(); event.stopPropagation(); applyTestUiChoice(testUiButton.dataset.v492TestUi); return; } var start = event.target.closest('[data-start-user-test]'); if (start) setTimeout(function () { bindTestSwitch(); document.querySelectorAll('[data-take-test]').forEach(function (form) { form.onsubmit = takeTestSubmit; }); }, 0); var mobileMenu = event.target.closest('#v38MobileMenuBtn'); if (mobileMenu) setTimeout(renderDeveloperMobilePreview, 0); setTimeout(bindTestSwitch, 30); }, true);
  document.addEventListener('DOMContentLoaded', function () { applyAccess(); if (state.aview === 'info') mountWorkspace(); });
  window.RTMV492 = {mountWorkspace: mountWorkspace, bindTestSwitch: bindTestSwitch, previewRole: function (role) { if (!isActualDeveloper()) return; applyDeveloperPreview(role); }};
})();
