/** RTM v50.4.0 — двусторонняя синхронизация назначений Базы знаний. */
const RTM_API = 'https://rtmgroupdocs.fvds.ru/api/v47/knowledge';
const RTM_CATALOG = 'Каталог документов';
const RTM_DIRECTORY = 'Н- Справочник';
const RTM_SNAPSHOT_KEY = 'rtm_knowledge_sheet_snapshot_v2';

function onOpen() {
  SpreadsheetApp.getUi().createMenu('RTM')
    .addItem('Синхронизировать с БД сервера', 'syncKnowledgeBase')
    .addToUi();
}

function onEdit(e) {
  const range = e && e.range;
  if (!range || range.getSheet().getName() !== RTM_CATALOG || range.getA1Notation() !== 'Q2' || range.getValue() !== true) return;
  range.setValue(false);
  syncKnowledgeBase();
}

function secret_() {
  const secret = PropertiesService.getScriptProperties().getProperty('RTM_KNOWLEDGE_SYNC_SECRET');
  if (!secret) throw new Error('В свойствах скрипта не задан RTM_KNOWLEDGE_SYNC_SECRET.');
  return secret;
}

function request_(path, method, payload) {
  const options = { method: method || 'get', headers: { 'X-RTM-Knowledge-Secret': secret_() }, muteHttpExceptions: true };
  if (payload) { options.contentType = 'application/json'; options.payload = JSON.stringify(payload); }
  const response = UrlFetchApp.fetch(RTM_API + path, options);
  if (response.getResponseCode() < 200 || response.getResponseCode() >= 300) throw new Error('Сервер: ' + response.getContentText());
  return JSON.parse(response.getContentText());
}

function split_(value) { return String(value || '').split(/\s*[,;\n]\s*/).map(x => x.trim()).filter(Boolean); }
function title_(doc) { return doc.title || ''; }
function testText_(doc) { return [doc.lightTest && doc.lightTest.created ? doc.lightTest.title : '', doc.fullTest && doc.fullTest.created ? doc.fullTest.title : ''].filter(Boolean).join('; '); }
function directoryMaps_(directory) {
  const users = {}, departments = {};
  (directory.users || []).forEach(x => { users[String(x.id)] = x.name; users[String(x.name).toLowerCase()] = x; });
  (directory.departments || []).forEach(x => { departments[String(x.id)] = x.name; departments[String(x.name).toLowerCase()] = x; });
  return { users: users, departments: departments };
}
function displayRules_(rules, maps) {
  return (rules || []).map(rule => rule.type === 'all_active' ? 'Все активные сотрудники' : rule.type === 'department' ? (maps.departments[String(rule.id)] || rule.id) : rule.type === 'role' ? ('Роль: ' + rule.id) : (maps.users[String(rule.id)] || rule.id)).join('; ');
}
function parseRules_(value, maps, allowedRoles) {
  const result = [], seen = {};
  split_(value).forEach(label => {
    const lower = label.toLowerCase(); let rule = null;
    if (lower === 'все активные сотрудники') rule = { type: 'all_active', id: '' };
    else if (allowedRoles && lower.indexOf('роль:') === 0) rule = { type: 'role', id: lower.slice(5).trim() };
    else if (maps.departments[lower] && !allowedRoles) rule = { type: 'department', id: maps.departments[lower].id };
    else if (maps.users[lower] && (!allowedRoles || maps.users[lower].reviewerAllowed)) rule = { type: 'user', id: maps.users[lower].id };
    if (rule && !seen[rule.type + ':' + rule.id]) { seen[rule.type + ':' + rule.id] = true; result.push(rule); }
  });
  return result;
}
function currentRows_(sheet, directory) {
  const maps = directoryMaps_(directory), last = Math.max(2, sheet.getLastRow());
  return sheet.getRange(2, 1, last - 1, 23).getDisplayValues().map((r, index) => ({
    row: index + 2, title: r[1], description: r[2], articleAssignments: parseRules_(r[13], maps, false),
    reviewers: parseRules_(r[14], maps, true), editors: parseRules_(r[15], maps, true),
    lightTestAssignments: parseRules_(r[17], maps, false), lightTestReviewers: parseRules_(r[18], maps, true), lightTestEditors: parseRules_(r[19], maps, true),
    fullTestAssignments: parseRules_(r[20], maps, false), fullTestReviewers: parseRules_(r[21], maps, true), fullTestEditors: parseRules_(r[22], maps, true)
  }));
}
function serial_(item) { return JSON.stringify(item); }
function fieldState_(doc, maps) {
  return { title: doc.title || '', description: doc.description || '', articleAssignments: doc.articleAssignments || [], reviewers: doc.articleReviewers || doc.reviewers || [], editors: doc.articleEditors || doc.editors || [],
    lightTestAssignments: doc.lightTestAssignments || [], lightTestReviewers: doc.lightTestReviewers || [], lightTestEditors: doc.lightTestEditors || [],
    fullTestAssignments: doc.fullTestAssignments || [], fullTestReviewers: doc.fullTestReviewers || [], fullTestEditors: doc.fullTestEditors || [] };
}
function readSnapshot_() { try { return JSON.parse(PropertiesService.getScriptProperties().getProperty(RTM_SNAPSHOT_KEY) || '{}'); } catch (_) { return {}; } }

function syncKnowledgeBase() {
  const ss = SpreadsheetApp.getActive(), sheet = ss.getSheetByName(RTM_CATALOG);
  if (!sheet) throw new Error('Не найден лист «' + RTM_CATALOG + '».');
  const state = request_('/sheet-state', 'get'), maps = directoryMaps_(state.directory), previous = readSnapshot_();
  const hasSnapshot = Object.keys(previous).length > 0;
  const changes = (hasSnapshot ? currentRows_(sheet, state.directory) : []).map(input => {
    const old = previous[String(input.row)] || {}, changed = { row: input.row };
    ['title', 'description', 'articleAssignments', 'reviewers', 'editors', 'lightTestAssignments', 'lightTestReviewers', 'lightTestEditors', 'fullTestAssignments', 'fullTestReviewers', 'fullTestEditors'].forEach(key => { if (serial_(input[key]) !== serial_(old[key])) changed[key] = input[key]; });
    return Object.keys(changed).length > 1 ? changed : null;
  }).filter(Boolean);
  // The first run is always server -> sheet. Without a snapshot we cannot
  // distinguish intentional sheet edits from stale template values.
  const result = changes.length ? request_('/sheet-sync', 'post', { changes: changes }) : state;
  writeServerState_(ss, sheet, result);
  ss.toast('Серверная БД и таблица синхронизированы. Изменено строк: ' + changes.length + '.', 'RTM', 5);
}

function writeServerState_(ss, sheet, result) {
  const docs = result.documents || [], maps = directoryMaps_(result.directory), byRow = {};
  docs.forEach(doc => { byRow[String(doc.sourceRow)] = doc; });
  const last = Math.max(2, sheet.getLastRow()), articleValues = [], otherValues = [], testRoleValues = [], snapshot = {};
  for (let row = 2; row <= last; row++) {
    const doc = byRow[String(row)];
    if (!doc) { articleValues.push(['']); otherValues.push(['', '', '', '']); testRoleValues.push(['', '', '', '', '', '']); continue; }
    const articleUrl = 'https://rtmgroupdocs.fvds.ru/?view=kb&document=' + doc.id;
    articleValues.push([doc.title]);
    otherValues.push([testText_(doc), displayRules_(doc.articleAssignments, maps), displayRules_(doc.articleReviewers || doc.reviewers, maps), displayRules_(doc.articleEditors || doc.editors, maps)]);
    testRoleValues.push([displayRules_(doc.lightTestAssignments, maps), displayRules_(doc.lightTestReviewers, maps), displayRules_(doc.lightTestEditors, maps), displayRules_(doc.fullTestAssignments, maps), displayRules_(doc.fullTestReviewers, maps), displayRules_(doc.fullTestEditors, maps)]);
    snapshot[String(row)] = fieldState_(doc, maps);
  }
  const rich = articleValues.map((value, index) => SpreadsheetApp.newRichTextValue().setText(value[0]).setLinkUrl(value[0] ? 'https://rtmgroupdocs.fvds.ru/?view=kb&document=' + (byRow[String(index + 2)] || {}).id : null).build());
  sheet.getRange(2, 12, articleValues.length, 1).setRichTextValues(rich.map(x => [x]));
  // M — служебное поле со списком тестов. В старом шаблоне на нём могла
  // остаться проверка данных с фиксированным списком, из-за которой новая
  // синхронизация падала при записи актуального названия теста.
  sheet.getRange(2, 13, otherValues.length, 1).clearDataValidations();
  sheet.getRange(2, 13, otherValues.length, 4).setValues(otherValues);
  sheet.getRange(2, 18, testRoleValues.length, 6).setValues(testRoleValues);
  sheet.getRange(1, 12, 1, 12).setValues([['Статья документа', 'Тесты документа', 'Статья: кому назначена', 'Статья: проверяющие', 'Статья: редакторы', 'СИНХРОНИЗИРОВАТЬ С БД', 'Лайт-тест: кому назначен', 'Лайт-тест: проверяющие', 'Лайт-тест: редакторы', 'Полный тест: кому назначен', 'Полный тест: проверяющие', 'Полный тест: редакторы']]);
  sheet.getRange('Q2').insertCheckboxes().setValue(false).setNote('Поставьте галочку, чтобы применить изменения из таблицы в PostgreSQL и получить актуальные данные с сервера.');
  PropertiesService.getScriptProperties().setProperty(RTM_SNAPSHOT_KEY, JSON.stringify(snapshot));
  refreshDirectory_(ss, result.directory, docs);
}

function refreshDirectory_(ss, directory, docs) {
  const sheet = ss.getSheetByName(RTM_DIRECTORY) || ss.insertSheet(RTM_DIRECTORY);
  sheet.clearContents();
  sheet.getRange(1, 1, 1, 5).setValues([['Все сотрудники', 'Структурная единица', 'Руководитель структурной единицы', 'Сотрудники этой единицы', 'Название статей и тестов']]);
  const users = directory.users || [], deps = directory.departments || [], names = [];
  docs.forEach(d => { names.push(d.title); if (d.lightTest && d.lightTest.created) names.push(d.lightTest.title); if (d.fullTest && d.fullTest.created) names.push(d.fullTest.title); });
  const rows = Math.max(users.length, deps.length, names.length, 1), values = Array.from({ length: rows }, () => ['', '', '', '', '']);
  users.forEach((u, i) => { values[i][0] = u.name; });
  deps.forEach((d, i) => { values[i][1] = d.name; values[i][2] = d.head || ''; values[i][3] = (d.employees || []).join('; '); });
  names.forEach((name, i) => { values[i][4] = name; });
  sheet.getRange(2, 1, rows, 5).setValues(values);
}
