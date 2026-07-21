/* RTM Education v50.1: bound Excalidraw tests, review workflow and reader fixes. */
(function () {
  'use strict';

  var VERSION = '50.1';
  var saveTimer = 0;
  var testScene = null;
  var takeAnswers = {};
  var mountedTestHost = null;

  function id(prefix) { return (prefix || 'rtm') + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9); }
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function roleRank(role) { return { employee: 0, student: 0, teacher: 1, moderator: 2, editor: 2, admin: 3, developer: 4 }[String(role || '')] || 0; }
  function actualRole() { return String(getAppRole(state.user) || 'employee'); }
  function canReview() { return roleRank(state.currentRole || actualRole()) >= 1; }
  function isFree(question) { return ['freeText', 'mediaFreeText', 'text'].includes(String(question && question.type || '')); }
  function isImageChoice(question) { return ['imageChoice', 'imageTextChoice'].includes(String(question && question.type || '')); }
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
    if (!scene || !Array.isArray(scene.elements)) return scene;
    var questions = new Map((meta.questions || []).map(function (question) { return [String(question.id), question]; }));
    scene.elements = scene.elements.map(function (element) {
      var binding = element.customData && element.customData.rtmTestText;
      var nextText = element.customData && element.customData.rtmTestTitle ? titleValue : null;
      if (binding) {
        var question = questions.get(String(binding.questionId));
        if (question && binding.kind === 'question') nextText = question.text;
        if (question && binding.kind === 'option') { var option = (question.options || []).find(function (item) { return String(item.id) === String(binding.optionId); }); if (option) nextText = option.text; }
      }
      if (nextText == null || element.text === nextText) return element;
      return Object.assign({}, element, {text: nextText, originalText: nextText, version: Number(element.version || 1) + 1, versionNonce: Math.floor(Math.random() * 2147483647), updated: Date.now()});
    });
    return scene;
  }

  function settingsMarkup(meta, item) {
    var automatic = meta.questions.filter(function (question) { return !isFree(question); }).length;
    return '<section class="v51-test-settings"><label>Название теста<input id="v51TestName" value="' + esc(item.NAME || '') + '"></label>' +
      '<div class="v51-settings-grid"><label>Порог прохождения<input id="v51PassRequired" type="number" min="' + (automatic ? 1 : 0) + '" max="' + automatic + '" value="' + meta.passRequired + '"><small>из ' + automatic + ' автоматически проверяемых вопросов</small></label>' +
      '<label>Попыток доступно<input id="v51Attempts" type="number" min="1" value="' + meta.attemptsLimit + '"></label>' +
      '<label>Ограничение времени, минут<input id="v51Time" type="number" min="0" value="' + meta.timeLimit + '"></label>' +
      '<label>Очки<input id="v51Points" type="number" min="0" value="' + meta.points + '"></label></div>' +
      '<div class="v51-checks"><label><input id="v51ShuffleQuestions" type="checkbox" ' + (meta.shuffleQuestions ? 'checked' : '') + '> Перемешивать вопросы</label><label><input id="v51ShuffleAnswers" type="checkbox" ' + (meta.shuffleAnswers ? 'checked' : '') + '> Перемешивать ответы</label><label><input id="v51ShowCorrect" type="checkbox" ' + (meta.showCorrect ? 'checked' : '') + '> Показывать результат</label><label><input id="v51Certificate" type="checkbox" ' + (meta.certificate ? 'checked' : '') + '> Сертификат</label></div></section>';
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
    return '<div class="v51-template-panel"><b>Шаблоны</b><button type="button" class="primary" id="v51FullTemplate">Создать полный макет из 5 вопросов</button>' +
      '<button type="button" data-v51-add-type="single">Ответы</button><button type="button" data-v51-add-type="freeText">Свободный текст</button><button type="button" data-v51-add-type="imageChoice">Выбор фото</button><button type="button" data-v51-add-type="imageTextChoice">Фото и ответы</button><button type="button" data-v51-add-type="mediaFreeText">Аудио и ответ</button></div>';
  }
  function editorMarkup(meta, item) {
    return '<div class="v51-test-editor">' + settingsMarkup(meta, item) + templatesMarkup() + '<div class="v51-builder"><section class="v51-canvas-column"><div class="v51-canvas-help">Интерактивные рамки можно перемещать и изменять как обычные элементы Excalidraw. Логика ответа остаётся привязанной к рамке.</div><div id="v51TestCanvas"></div></section><aside class="v51-question-list">' + (meta.questions.map(questionMarkup).join('') || '<div class="panel">Добавьте первый вопрос или полный шаблон.</div>') + '</aside></div></div>';
  }
  function currentTest() { return findItem(state.testId); }
  function currentMeta() { var item = currentTest(); return normalizeMeta(j(item && item.PROPERTY_VALUES && item.PROPERTY_VALUES.meta)); }
  async function persistEditor(showToast) {
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
      var input = document.querySelector('[data-v51-question-text="' + question.id + '"]'); if (input) question.text = input.value;
      (question.options || []).forEach(function (option) { var field = document.querySelector('[data-v51-option="' + question.id + ':' + option.id + '"]'); if (field) option.text = field.value; var correct = document.querySelector('[data-v51-correct="' + question.id + ':' + option.id + '"]'); option.correct = Boolean(correct && correct.checked); });
      question.answers = (question.options || []).map(function (option) { return option.text; }); question.correct = (question.options || []).map(function (option, index) { return option.correct ? index : -1; }).filter(function (value) { return value >= 0; });
    });
    meta.testScene = syncSceneLabels(testScene || meta.testScene || buildScene(meta, name), meta, name);
    testScene = meta.testScene;
    var props = Object.assign({}, item.PROPERTY_VALUES, {meta: json(meta), updatedAt: now()});
    updateLocalItem(item.ID, name, props); await upd(E.items, item.ID, name, props); var titleNode = document.getElementById('testEditorTitle'); if (titleNode) titleNode.textContent = name; if (showToast) toast('Тест сохранён');
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

  function mountEditorCanvas(meta, item) {
    var host = document.getElementById('v51TestCanvas'); if (!host || !window.RTMCanvas) return setTimeout(function () { mountEditorCanvas(meta, item); }, 120);
    testScene = clone(meta.testScene || buildScene(meta, item.NAME)); meta.testScene = testScene;
    window.RTMCanvas.mount(host, {pageKey: 'test-author:' + item.ID, scene: testScene, readOnly: false, completionRequired: false, title: item.NAME, brandColor: '#ef174c', onRequestDisk: window.RTMV46 && window.RTMV46.pickDiskMedia, onChange: function (scene) { testScene = scene; scheduleSave(); }, onManualSave: function () { return persistEditor(true); }});
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
    await persistEditor(false); var item = currentTest(), meta = currentMeta();
    if (!meta.questions.length) return alert('Добавьте хотя бы один вопрос.');
    for (var index = 0; index < meta.questions.length; index += 1) {
      var question = meta.questions[index]; if (!String(question.text || '').trim()) return alert('Заполните текст вопроса ' + (index + 1) + '.');
      if (!isFree(question) && !(question.options || []).some(function (option) { return option.correct; })) return alert('Выберите правильный ответ в вопросе ' + (index + 1) + '.');
      if (!isFree(question) && (question.options || []).some(function (option) { return !String(option.text || '').trim() && !(option.image && option.image.url); })) return alert('Заполните все варианты вопроса ' + (index + 1) + '.');
    }
    var props = Object.assign({}, item.PROPERTY_VALUES, {status: 'published', meta: json(meta), updatedAt: now()}); updateLocalItem(item.ID, item.NAME, props); await upd(E.items, item.ID, item.NAME, props); await addEvent('Публикация', item); await loadAll(true); openTestEditor(item.ID); toast('Тест опубликован');
  };

  function userAttempt(testId, statuses) {
    var uid = String(typeof rtmCanonicalUserId === 'function' ? rtmCanonicalUserId(effectiveUserId()) : effectiveUserId());
    return state.attempts.filter(function (attempt) { var props = attempt.PROPERTY_VALUES || {}; return String(props.testId) === String(testId) && String(props.userId) === uid && (!statuses || statuses.includes(String(props.reviewStatus || props.status || ''))); }).sort(function (a, b) { return String(b.PROPERTY_VALUES.updatedAt || b.PROPERTY_VALUES.createdAt || '').localeCompare(String(a.PROPERTY_VALUES.updatedAt || a.PROPERTY_VALUES.createdAt || '')); })[0] || null;
  }
  function remainingAttempts(test, meta) { var returned = userAttempt(test.ID, ['returned']); return returned ? Math.max(1, Number(meta.attemptsLimit || 1) - testAttemptsUsed(test.ID) + 1) : Math.max(0, Number(meta.attemptsLimit || 1) - testAttemptsUsed(test.ID)); }
  window.renderUserTestIntro = function (test) {
    var meta = normalizeMeta(j(test.PROPERTY_VALUES.meta)), left = remainingAttempts(test, meta), pending = userAttempt(test.ID, ['pending_review']), returned = userAttempt(test.ID, ['returned']);
    return '<div class="test-intro-card v492-test-intro v51-test-intro"><h2>' + esc(test.NAME) + '</h2>' + (pending ? '<div class="v51-status pending">Свободный ответ ожидает проверки. Можно пройти тест ещё раз; проверяющий увидит последнюю отправку.</div>' : '') + (returned ? '<div class="v51-status returned">Ответ возвращён на доработку' + (returned.PROPERTY_VALUES.reviewComment ? ': ' + esc(returned.PROPERTY_VALUES.reviewComment) : '') + '</div>' : '') + '<div class="test-info-grid"><span><small>Доступное время</small><b>' + (meta.timeLimit ? meta.timeLimit + ' мин' : 'Без ограничения') + '</b></span><span><small>Попыток доступно</small><b>' + left + '</b></span><span><small>Порог прохождения</small><b>' + meta.passRequired + ' из ' + meta.questions.filter(function (question) { return !isFree(question); }).length + '</b></span><span><small>Очки</small><b>' + meta.points + '</b></span><span><small>Перемешивать вопросы</small><b>' + (meta.shuffleQuestions ? 'Да' : 'Нет') + '</b></span><span><small>Перемешивать ответы</small><b>' + (meta.shuffleAnswers ? 'Да' : 'Нет') + '</b></span><span><small>Показывать результат</small><b>' + (meta.showCorrect ? 'Да' : 'Нет') + '</b></span><span><small>Сертификат</small><b>' + (meta.certificate ? 'Да' : 'Нет') + '</b></span></div><button class="primary" data-start-user-test="' + test.ID + '" ' + (left <= 0 ? 'disabled' : '') + '>' + (returned ? 'Исправить ответы' : pending ? 'Пройти ещё раз' : 'Приступить') + '</button></div>';
  };
  window.renderTakeTest = function (test) {
    var meta = normalizeMeta(j(test.PROPERTY_VALUES.meta));
    if (!meta.testScene) meta.testScene = buildScene(meta, test.NAME);
    // Legacy resume/retry paths replace the markup directly and bypass the
    // start-button click handler. Always schedule the visual scene here so a
    // reopened attempt cannot leave a zero-height canvas.
    setTimeout(function () { mountTakeCanvas(findItem(test.ID) || test); }, 0);
    return '<form class="v51-take-test" data-take-test="' + test.ID + '" data-test-start="' + Date.now() + '"><div id="v51TakeCanvas" class="v51-take-canvas"></div><div class="v51-test-submit-bar"><button class="primary" type="submit">Отправить ответы</button></div></form>';
  };
  function mountTakeCanvas(test) {
    var host = document.getElementById('v51TakeCanvas'), form = host && host.closest('form'); if (!host || !form || !window.RTMCanvas) return setTimeout(function () { mountTakeCanvas(test); }, 120);
    if (host.dataset.rtmMountedTest === String(test.ID)) return;
    host.dataset.rtmMountedTest = String(test.ID);
    var meta = normalizeMeta(j(test.PROPERTY_VALUES.meta)), latest = userAttempt(test.ID), existing = latest && latest.PROPERTY_VALUES && latest.PROPERTY_VALUES.answers, previous = {};
    try { previous = existing ? JSON.parse(existing) : {}; } catch (_) { previous = {}; }
    takeAnswers = {}; meta.questions.forEach(function (question) { if (isFree(question) && previous[question.id] != null) takeAnswers[question.id] = previous[question.id]; });
    mountedTestHost = host;
    function remount() { if (!host.isConnected) return; window.RTMCanvas.mount(host, {pageKey: 'test-take:' + test.ID, scene: meta.testScene || buildScene(meta, test.NAME), readOnly: true, fitToContent: true, completionRequired: false, testMode: 'take', testDefinition: meta, testAnswers: takeAnswers, brandColor: '#ef174c', onTestAnswer: function (questionId, value) { takeAnswers[questionId] = value; remount(); }}); }
    remount(); form.onsubmit = window.takeTestSubmit;
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
    var meta = normalizeMeta(j(test.PROPERTY_VALUES.meta)); if (meta.timeLimit && (Date.now() - Number(form.dataset.testStart || Date.now())) > meta.timeLimit * 60000) return alert('Время теста истекло.');
    var good = 0, automatic = 0, hasFree = false, freeMissing = false;
    meta.questions.forEach(function (question) { if (isFree(question)) { hasFree = true; if (!String(takeAnswers[question.id] || '').trim()) freeMissing = true; } else { automatic += 1; if (selectedCorrect(question, takeAnswers[question.id])) good += 1; } });
    if (freeMissing) return alert('Заполните все свободные ответы.');
    var autoPassed = automatic === 0 || good >= Number(meta.passRequired || 0), score = automatic ? Math.round(good / automatic * 100) : 100, reviewerId = courseReviewer(test), returned = userAttempt(test.ID, ['returned']);
    var props = {courseId: String(materialCourseId(test) || test.PROPERTY_VALUES.parentId || ''), testId: String(test.ID), userId: String(typeof rtmCanonicalUserId === 'function' ? rtmCanonicalUserId(effectiveUserId()) : effectiveUserId()), score: String(score), automaticCorrect: String(good), automaticTotal: String(automatic), automaticPassed: autoPassed ? 'Y' : 'N', passed: hasFree ? 'PENDING' : autoPassed ? 'Y' : 'N', pendingReview: hasFree ? 'Y' : 'N', reviewStatus: hasFree ? 'pending_review' : autoPassed ? 'auto_passed' : 'auto_failed', reviewerId: reviewerId, answers: JSON.stringify(takeAnswers), testSnapshot: JSON.stringify({schemaVersion: 2, title: test.NAME, questions: meta.questions}), revision: String(Number(returned && returned.PROPERTY_VALUES.revision || 0) + 1), createdAt: returned && returned.PROPERTY_VALUES.createdAt || now(), updatedAt: now()};
    var attemptId;
    if (returned) { attemptId = returned.ID; await upd(E.attempts, returned.ID, returned.NAME || 'Попытка теста', props); returned.PROPERTY_VALUES = props; }
    else { attemptId = await add(E.attempts, 'Попытка теста', props); state.attempts.unshift({ID: String(attemptId), NAME: 'Попытка теста', PROPERTY_VALUES: props, DATE_CREATE: props.createdAt}); }
    if (autoPassed) await complete(test.ID, 'test');
    if (hasFree) { var destination = reviewerId || ((state.users || []).find(function (user) { return ['admin', 'developer'].includes(getAppRole(user)); }) || {}).ID; await notifyUser(destination, 'В RTM Education новый свободный ответ по тесту «' + test.NAME + '» ожидает проверки.'); }
    var title = hasFree ? (autoPassed ? 'Автоматическая часть пройдена' : 'Автоматическая часть не пройдена') : autoPassed ? 'Тест пройден' : 'Тест не пройден';
    var message = hasFree ? '<p>Свободный ответ отправлен проверяющему.</p>' + (autoPassed ? '<p>Следующий материал доступен.</p>' : '<p>Для открытия следующего материала сначала пройдите автоматическую часть.</p>') : '';
    modal('<div class="test-outcome ' + (autoPassed ? hasFree ? 'pending' : 'ok' : 'bad') + '"><h2>' + title + '</h2><p>Верно: <b>' + good + ' из ' + automatic + '</b></p>' + message + '<button class="primary" id="v51OutcomeNext">Продолжить</button></div>');
    document.getElementById('v51OutcomeNext').onclick = function () { closeModal(); if (autoPassed || !meta.required) adjacentMat(1); else openUserMaterial(test); };
    renderProfile(); renderUserCourses();
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
    modal('<h2>' + esc(fullName(user)) + '</h2><p class="muted">Права наследуются: разработчик → администратор → редактор → преподаватель → пользователь.</p><select id="roleSelect"><option value="employee" ' + (role === 'employee' ? 'selected' : '') + '>Пользователь</option><option value="teacher" ' + (role === 'teacher' ? 'selected' : '') + '>Преподаватель</option><option value="moderator" ' + (role === 'moderator' ? 'selected' : '') + '>Редактор</option><option value="admin" ' + (role === 'admin' ? 'selected' : '') + '>Администратор</option>' + (actorId === '36' ? '<option value="developer" ' + (role === 'developer' ? 'selected' : '') + '>Разработчик</option>' : '') + '</select><div class="inline-actions"><button onclick="window.closeModal()">Отмена</button><button class="primary" id="roleSave">Сохранить</button></div>');
    document.getElementById('roleSave').onclick = async function () { await saveRole(userId, document.getElementById('roleSelect').value); closeModal(); await loadAll(); switchAdmin('users'); };
  };
  window.renderUsers = renderUsers = function () {
    var box = document.getElementById('usersTable'); if (!box) return; var q = String(document.getElementById('usersSearch') && document.getElementById('usersSearch').value || '').toLowerCase(), dept = String(document.getElementById('usersDeptFilter') && document.getElementById('usersDeptFilter').value || 'all'), actorRole = actualRole(), actorId = String(state.user && state.user.ID || '');
    var total = document.getElementById('usersTotal'); if (total) total.textContent = state.users.length; var deptSelect = document.getElementById('usersDeptFilter'); if (deptSelect && !deptSelect.dataset.ready) { deptSelect.innerHTML = '<option value="all">Все департаменты</option>' + state.departments.map(function (department) { return '<option value="' + department.ID + '">' + esc(department.NAME) + '</option>'; }).join(''); deptSelect.dataset.ready = '1'; deptSelect.onchange = renderUsers; document.getElementById('usersSearch').oninput = renderUsers; document.getElementById('usersSyncBtn').onclick = loadAll; }
    var rows = state.users.filter(Boolean).filter(function (user) { return (fullName(user) + ' ' + (user.EMAIL || '')).toLowerCase().includes(q); }).filter(function (user) { var departments = Array.isArray(user.UF_DEPARTMENT) ? user.UF_DEPARTMENT : user.UF_DEPARTMENT ? [user.UF_DEPARTMENT] : []; return dept === 'all' || departments.map(String).includes(dept); });
    box.innerHTML = rows.map(function (user) { var role = getAppRole(user), protectedDeveloper = role === 'developer' && actorId !== '36', protectedAdmin = Boolean(user.IS_BITRIX_ADMIN) && actorId !== '36', editable = ['developer', 'admin'].includes(actorRole) && !protectedDeveloper && !protectedAdmin && String(user.ID) !== '36'; return '<tr><td><div class="user-cell"><span class="avatar-mini">' + esc(initials(user)) + '</span><div><b>' + esc(fullName(user) || ('ID ' + user.ID)) + '</b><div class="row-sub">' + esc(user.EMAIL || '') + '</div></div></div></td><td><span class="pill green">Активен</span></td><td>' + esc(userDepartments(user)) + '</td><td><span class="pill ' + (role === 'developer' ? 'violet' : role === 'admin' ? 'mint' : role === 'moderator' ? 'yellow' : role === 'teacher' ? 'blue' : 'gray') + '">' + esc(roleLabel(role)) + (user.IS_BITRIX_ADMIN ? ' · Bitrix24' : '') + '</span></td><td><button class="icon-action" data-role-user="' + user.ID + '" ' + (editable ? '' : 'disabled') + '>' + gearIcon() + '</button></td></tr>'; }).join('') || '<tr><td colspan="5">Пользователи не найдены</td></tr>';
    document.querySelectorAll('[data-role-user]').forEach(function (button) { button.onclick = function () { roleModal(button.dataset.roleUser); }; });
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

  window.finishCurrentArticle = async function () {
    var material = findItem(document.getElementById('userMaterialView') && document.getElementById('userMaterialView').dataset.id); if (!material) return; await complete(material.ID, materialKind(material)); document.body.classList.remove('is-reading-article');
    var courseId = materialCourseId(material), list = courseId ? courseChildren(courseId) : [], position = list.findIndex(function (row) { return String(row.ID) === String(material.ID); }), next = position >= 0 ? list[position + 1] : null;
    if (next && canOpenCourseMaterial(next)) openUserMaterial(next); else if (courseId) openUserCourse(findItem(courseId)); else backFromUserMaterial();
  };
  var rawIsDoneV51 = window.isDone;
  window.isDone = isDone = function (targetId, type) {
    var item = findItem(targetId), kind = type || materialKind(item), done = rawIsDoneV51(targetId, kind); if (!done || kind !== 'course' || !item) return done;
    var userId = String(typeof rtmCanonicalUserId === 'function' ? rtmCanonicalUserId(effectiveUserId()) : effectiveUserId()), tests = courseChildren(item.ID).filter(function (row) { return materialKind(row) === 'test'; });
    return !tests.some(function (test) { var attempts = state.attempts.filter(function (attempt) { return String(attempt.PROPERTY_VALUES.userId) === userId && String(attempt.PROPERTY_VALUES.testId) === String(test.ID); }).sort(function (a, b) { return String(b.PROPERTY_VALUES.updatedAt || b.PROPERTY_VALUES.createdAt || '').localeCompare(String(a.PROPERTY_VALUES.updatedAt || a.PROPERTY_VALUES.createdAt || '')); }); var status = attempts[0] && attempts[0].PROPERTY_VALUES.reviewStatus; return status === 'pending_review' || status === 'returned'; });
  };

  function fitMobileReaderHeight() {
    var reader = document.querySelector('.v492-reader'); if (!reader || window.innerWidth > 800) return; var rect = reader.getBoundingClientRect(), available = Math.max(420, window.innerHeight - rect.top - 4); reader.style.height = available + 'px'; reader.style.minHeight = available + 'px';
  }
  var baseSwitchAdmin = window.switchAdmin;
  window.switchAdmin = switchAdmin = function (view) { ensureReviewView(); var result = baseSwitchAdmin.apply(this, arguments); if (view === 'reviews') renderReviews(); return result; };
  var baseRenderAll = window.renderAll;
  window.renderAll = renderAll = function () { ensureReviewView(); var result = baseRenderAll.apply(this, arguments); if (state.aview === 'reviews') renderReviews(); return result; };

  document.addEventListener('click', function (event) {
    var start = event.target.closest && event.target.closest('[data-start-user-test]'); if (start) { var test = findItem(start.dataset.startUserTest); setTimeout(function () { mountTakeCanvas(test); }, 40); }
    var nav = event.target.closest && event.target.closest('[data-admin-view="reviews"]'); if (nav) { event.preventDefault(); switchAdmin('reviews'); }
  }, true);
  window.addEventListener('resize', function () { setTimeout(fitMobileReaderHeight, 30); });
  new MutationObserver(function () { fitMobileReaderHeight(); }).observe(document.documentElement, {childList: true, subtree: true});
  document.addEventListener('DOMContentLoaded', function () { ensureReviewView(); fitMobileReaderHeight(); });
  ensureReviewView();
  window.RTMV51 = {version: VERSION, buildScene: buildScene, normalizeMeta: normalizeMeta, renderReviews: renderReviews};
})();
