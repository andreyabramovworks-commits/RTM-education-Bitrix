(function () {
  'use strict';
  var VERSION = '50.3.3';
  var designerTemplate = null;
  var templatePromise = null;
  var reviewState = {filter: 'pending_review', query: '', selected: ''};
  var analyticsState = {query: '', department: 'all', from: '', to: '', sort: -1, direction: 1};

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function localId(prefix) { return (prefix || 'v52') + '_' + Math.random().toString(36).slice(2, 10) + '_' + Date.now().toString(36); }
  function freeQuestion(question) { return ['freeText', 'mediaFreeText'].includes(String(question && question.type || '')); }
  function templateIndex(type) { return type === 'freeText' ? 1 : type === 'imageChoice' ? 2 : type === 'imageTextChoice' ? 3 : type === 'mediaFreeText' ? 4 : 0; }
  function structureSignature(meta) { return (meta.questions || []).map(function (question) { return [question.id, question.type, (question.options || []).map(function (option) { return option.id; }).join(',')].join(':'); }).join('|'); }
  function loadTemplate() {
    if (designerTemplate) return Promise.resolve(designerTemplate);
    if (!templatePromise) templatePromise = fetch('/legacy/test-template-v52.json?v=050.3.3', {cache: 'no-store'}).then(function (response) {
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
        var textBinding = data.rtmTestText, text = textBinding.kind === 'question' ? ((questionIndex + 1) + '. ' + (question.text || 'Вопрос')) : ((options[textBinding.optionIndex] || {}).text || ('Вариант ответа ' + (Number(textBinding.optionIndex) + 1)));
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
      if (element.customData && element.customData.rtmTestTitle) { element.text = title; element.originalText = title; }
      return element;
    });
    frame.id = frameId; frame.name = null; frame.x = 0; frame.y = 0; frame.customData = Object.assign({}, frame.customData || {}, {rtmTestFrame: true, rtmV52DesignerTemplate: true});
    var defaultTypes = ['single', 'freeText', 'imageChoice', 'imageTextChoice', 'mediaFreeText'];
    var exact = (meta.questions || []).length === 5 && meta.questions.every(function (question, index) { return defaultTypes[index] === question.type; });
    var cursor = 107.46937564480686, blocks = [];
    (meta.questions || []).forEach(function (question, index) {
      var prototype = templateIndex(question.type), prototypeElements = template.elements.filter(function (element) { return elementQuestionIndex(element) === prototype; });
      var originalY = Math.min.apply(null, prototypeElements.map(function (element) { return Number(element.y || 0); }));
      var block = instantiateBlock(template, question, index, prototype, exact ? originalY : cursor, frameId);
      blocks = blocks.concat(block.elements); cursor = (exact ? originalY : cursor) + block.height + 46;
    });
    var lastBottom = blocks.length ? Math.max.apply(null, blocks.map(function (element) { return Number(element.y || 0) + Number(element.height || 0); })) : 150;
    frame.height = exact ? Number(frameSource.height || lastBottom + 50) : Math.max(360, lastBottom + 52);
    return {type: 'excalidraw', version: 2, source: 'rtm-v52-designer', elements: common.concat(blocks, [frame]), appState: {viewBackgroundColor: '#ffffff', scrollX: 0, scrollY: 0, zoom: {value: 1}}, files: clone(template.files || {})};
  }
  async function ensureDesigner(item, force) {
    if (!item || item.PROPERTY_VALUES && item.PROPERTY_VALUES.type !== 'test') return false;
    var meta = window.RTMV51.normalizeMeta(j(item.PROPERTY_VALUES.meta)), signature = structureSignature(meta);
    if (!force && meta.v52DesignerMigrated && meta.v52LayoutSignature === signature && meta.testScene && Array.isArray(meta.testScene.elements)) return false;
    var template = await loadTemplate();
    meta.testScene = designerScene(template, meta, item.NAME || 'Тест'); meta.schemaVersion = 3; meta.v52DesignerMigrated = true; meta.v52LayoutSignature = signature;
    item.PROPERTY_VALUES.meta = json(meta); await saveItemMeta(item.ID, meta); return true;
  }

  var baseRenderTestEditor = window.renderTestEditor;
  window.renderTestEditor = function () {
    var item = findItem(state.testId), root = document.getElementById('testQuestionsEditor');
    if (!item || !root) return baseRenderTestEditor.apply(this, arguments);
    root.innerHTML = '<div class="v52-template-loading">Подготавливаем макет теста…</div>';
    return ensureDesigner(item, false).catch(function (error) { console.error('v50.3.3 designer migration failed', error); }).then(function () { baseRenderTestEditor(); });
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
  function latestAttempts() {
    var groups = {};
    state.attempts.slice().sort(function (a, b) { return String(b.PROPERTY_VALUES.updatedAt || b.PROPERTY_VALUES.createdAt || '').localeCompare(String(a.PROPERTY_VALUES.updatedAt || a.PROPERTY_VALUES.createdAt || '')); }).forEach(function (attempt) {
      var props = attempt.PROPERTY_VALUES || {}, key = String(props.userId) + ':' + String(props.testId); if (!groups[key]) groups[key] = attempt;
    });
    return Object.keys(groups).map(function (key) { return groups[key]; });
  }
  function canReviewV52(attempt) {
    var role = actualRole(), props = attempt.PROPERTY_VALUES || {}, actor = String(state.user && state.user.ID || effectiveUserId());
    return role === 'developer' || role === 'admin' || roleRank(role) >= 1 && String(props.reviewerId || '') === actor;
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
    return '<button type="button" class="v52-review-mobile-back" id="v52ReviewBack">← К списку</button><header class="v52-review-detail-head"><div><h2>' + esc(test && test.NAME || snapshot.title || 'Проверка теста') + '</h2><p>' + esc(fullName(user) || ('ID ' + props.userId)) + ' · автоматическая часть: ' + esc(props.automaticCorrect || '0') + ' из ' + esc(props.automaticTotal || '0') + '</p></div><span class="pill ' + (props.reviewStatus === 'approved' ? 'green' : props.reviewStatus === 'returned' ? 'red' : 'yellow') + '">' + esc(reviewLabel(props.reviewStatus)) + '</span></header><div class="v52-review-answers">' + questions.map(function (question, index) {
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
  function renderReviewsV52() {
    var root = document.getElementById('adminReviews'); if (!root) return;
    var rows = reviewRows(); if (!rows.some(function (row) { return String(row.ID) === String(reviewState.selected); })) reviewState.selected = rows[0] ? String(rows[0].ID) : '';
    var selected = state.attempts.find(function (row) { return String(row.ID) === String(reviewState.selected); });
    root.innerHTML = '<div class="v52-review-page"><header class="admin-page-head"><div><h1>Проверка тестов</h1><p class="muted">Последние свободные ответы назначенных курсов</p></div><button id="v52ReviewRefresh">Обновить</button></header><div class="v52-review-tabs"><button data-v52-review-filter="pending_review" class="' + (reviewState.filter === 'pending_review' ? 'active' : '') + '">Ожидают</button><button data-v52-review-filter="returned" class="' + (reviewState.filter === 'returned' ? 'active' : '') + '">Возвращены</button><button data-v52-review-filter="approved" class="' + (reviewState.filter === 'approved' ? 'active' : '') + '">Приняты</button><button data-v52-review-filter="all" class="' + (reviewState.filter === 'all' ? 'active' : '') + '">Все</button></div><div class="v52-review-workspace ' + (selected ? 'has-detail' : '') + '"><aside class="v52-review-list"><input id="v52ReviewSearch" value="' + esc(reviewState.query) + '" placeholder="Поиск по пользователю или тесту">' + (rows.map(function (attempt) { var p = attempt.PROPERTY_VALUES || {}, user = userById(p.userId), test = findItem(p.testId); return '<button type="button" data-v52-review="' + attempt.ID + '" class="' + (String(attempt.ID) === String(reviewState.selected) ? 'active' : '') + '"><b>' + esc(fullName(user) || ('ID ' + p.userId)) + '</b><span>' + esc(test && test.NAME || 'Тест') + '</span><small>' + esc(p.automaticCorrect || '0') + ' из ' + esc(p.automaticTotal || '0') + ' · ' + fmt(p.updatedAt || p.createdAt) + '</small></button>'; }).join('') || '<p class="empty-cell">Ответов с таким статусом нет</p>') + '</aside><main class="v52-review-detail">' + reviewDetailsMarkup(selected) + '</main></div></div>';
    root.querySelectorAll('[data-v52-review-filter]').forEach(function (button) { button.onclick = function () { reviewState.filter = button.dataset.v52ReviewFilter; reviewState.selected = ''; renderReviewsV52(); }; });
    root.querySelectorAll('[data-v52-review]').forEach(function (button) { button.onclick = function () { reviewState.selected = button.dataset.v52Review; renderReviewsV52(); }; });
    var search = document.getElementById('v52ReviewSearch'); if (search) search.oninput = function () { reviewState.query = search.value; reviewState.selected = ''; renderReviewsV52(); };
    var back = document.getElementById('v52ReviewBack'); if (back) back.onclick = function () { reviewState.selected = ''; root.querySelector('.v52-review-workspace').classList.remove('has-detail'); };
    var cancel = document.getElementById('v52ReviewCancel'); if (cancel) cancel.onclick = function () { reviewState.selected = ''; renderReviewsV52(); };
    var refresh = document.getElementById('v52ReviewRefresh'); if (refresh) refresh.onclick = async function () { await loadAll(true); renderReviewsV52(); };
    var save = document.getElementById('v52SaveReview'); if (save && selected) save.onclick = async function () {
      var props = selected.PROPERTY_VALUES || {}, snapshot = parseJson(props.testSnapshot, {}), questions = (snapshot.questions || []).filter(freeQuestion), rejected = false, details = {};
      questions.forEach(function (question) { var decision = document.querySelector('[name="v52decision_' + question.id + '"]:checked'), status = decision && decision.value || 'accepted', field = document.querySelector('[data-v52-review-comment="' + question.id + '"]'), comment = String(field && field.value || '').trim(); if (status === 'rejected') rejected = true; details[question.id] = {status: status, comment: comment}; });
      if (rejected && !Object.keys(details).some(function (key) { return details[key].status === 'rejected' && details[key].comment; })) return alert('Для непринятого ответа напишите комментарий.');
      props.reviewDetails = JSON.stringify(details); props.reviewedBy = currentUserIdV52(); props.reviewedAt = now(); props.updatedAt = now(); props.pendingReview = 'N'; props.reviewStatus = rejected ? 'returned' : props.automaticPassed === 'Y' ? 'approved' : 'auto_failed_reviewed'; props.passed = !rejected && props.automaticPassed === 'Y' ? 'Y' : 'N'; props.reviewComment = Object.keys(details).map(function (key) { return details[key].comment; }).filter(Boolean).join(' · ');
      save.disabled = true; await upd(E.attempts, selected.ID, selected.NAME || 'Попытка теста', props); selected.PROPERTY_VALUES = props; await notifyV52(props.userId, rejected ? 'Ответ по тесту возвращён на доработку. ' + props.reviewComment : 'Свободный ответ по тесту принят.'); reviewState.selected = ''; renderReviewsV52(); renderUserCourses(); toast(rejected ? 'Ответ возвращён пользователю' : 'Ответ принят');
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
    if (material && materialKind(material) === 'test') { try { var sessions = JSON.parse(localStorage.getItem('rtm_v035_test_sessions') || '{}'), key = String(effectiveUserId()) + ':' + String(material.ID); delete sessions[key]; localStorage.setItem('rtm_v035_test_sessions', JSON.stringify(sessions)); } catch (_) {} }
    var result = baseOpenMaterial.apply(this, arguments); setTimeout(function () { updateMaterialNavigation(material); }, 0); return result;
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

  var baseSwitchAdmin = window.switchAdmin;
  window.switchAdmin = switchAdmin = function (view) { var result = baseSwitchAdmin.apply(this, arguments); if (view === 'reviews') setTimeout(renderReviewsV52, 0); if (view === 'analytics') setTimeout(function () { if ((state.analyticsTab || 'overview') !== 'overview') enhanceAnalytics(); }, 0); return result; };
  var baseRenderAll = window.renderAll;
  window.renderAll = renderAll = function () { var result = baseRenderAll.apply(this, arguments); if (state.aview === 'reviews') setTimeout(renderReviewsV52, 0); return result; };

  document.addEventListener('click', function (event) { var review = event.target.closest && event.target.closest('[data-admin-view="reviews"]'); if (review) setTimeout(renderReviewsV52, 0); }, true);
  function migrateExisting() {
    loadTemplate().then(async function () {
      var tests = (state.items || []).filter(function (item) { return item.PROPERTY_VALUES && item.PROPERTY_VALUES.type === 'test'; });
      for (var index = 0; index < tests.length; index += 1) { try { await ensureDesigner(tests[index], false); } catch (error) { console.warn('Test migration skipped', tests[index].ID, error); } }
    }).catch(function (error) { console.error(error); });
  }
  setTimeout(migrateExisting, 1600);
  window.RTMV52 = {version: VERSION, designerScene: designerScene, createScene: function (meta, title) { return loadTemplate().then(function (template) { return designerScene(template, meta, title); }); }, ensureDesigner: ensureDesigner, renderReviews: renderReviewsV52, enhanceAnalytics: enhanceAnalytics};
})();
