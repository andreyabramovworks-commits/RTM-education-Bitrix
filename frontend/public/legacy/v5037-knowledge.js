/* RTM v50.3.7 — live PostgreSQL knowledge base UI. */
(function () {
  "use strict";
  var documents = [], loaded = false, adminTab = "articles";
  function api(path, options) { return window.RTMV47.request(path, options); }
  function escapeHtml(value) { return String(value || "").replace(/[&<>"']/g, function (char) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]; }); }
  async function load(force) { if (loaded && !force) return documents; documents = await api("/api/v47/knowledge/documents"); loaded = true; return documents; }
  function findNode(id, node) { if (!node) return null; if (String(node.id) === String(id)) return node; for (var child of node.children || []) { var found = findNode(id, child); if (found) return found; } return null; }
  function findDocument() { var node = findNode(state.kbSelected, window.RTM_KB_DATA && window.RTM_KB_DATA.tree); return node && documents.find(function (doc) { return doc.title.trim().toLowerCase() === String(node.title || "").trim().toLowerCase(); }); }
  async function enhanceMaterial() {
    if (!state.kbSelected) return;
    await load();
    var doc = findDocument(), box = document.querySelector(".kb-detail");
    if (!doc || !box || box.querySelector(".v537-actions")) return;
    var actions = document.createElement("div"), light = doc.lightTest || {}, full = doc.fullTest || {};
    actions.className = "v537-actions";
    actions.innerHTML = '<button class="primary" data-v537-article>Открыть статью</button>' +
      (light.created ? '<button data-v537-test="light">Открыть тест лайт</button>' : "") +
      (full.created ? '<button data-v537-test="full">Открыть тест полный</button>' : "");
    box.appendChild(actions);
    actions.querySelector("[data-v537-article]").onclick = function () { openArticle(doc.id); };
    actions.querySelectorAll("[data-v537-test]").forEach(function (button) { button.onclick = function () { toast("Тест доступен через назначение или курс"); }; });
  }
  async function openArticle(id) {
    var doc = await api("/api/v47/knowledge/documents/" + id), box = document.querySelector(".kb-detail");
    box.innerHTML = '<button data-v537-back>← Назад</button><div id="v537Reader" class="v537-reader"></div>';
    box.querySelector("[data-v537-back]").onclick = function () { state.kbSelected = null; renderKb(); };
    window.RTMCanvas.mount(document.getElementById("v537Reader"), {pageKey:"knowledge:"+id,scene:doc.scene,readOnly:true,fitToContent:true,title:doc.title,brandColor:"#12b886",onComplete:function(){toast("Материал завершён");}});
  }
  var originalRenderKb = window.renderKb;
  window.renderKb = function () { originalRenderKb.apply(this, arguments); enhanceMaterial().catch(console.error); };

  function installAdmin() {
    if (document.getElementById("v537KnowledgeNav")) return;
    var rail = document.querySelector(".icon-rail"), main = document.querySelector(".admin-main");
    if (!rail || !main) return;
    var button = document.createElement("button"), view = document.createElement("div");
    button.id = "v537KnowledgeNav"; button.className = "rail-btn"; button.title = "Управление Базой знаний"; button.innerHTML = "📚";
    view.id = "adminKnowledge537"; view.className = "admin-view";
    rail.appendChild(button); main.appendChild(view);
    button.onclick = async function () {
      document.querySelectorAll(".admin-view").forEach(function (node) { node.classList.remove("active"); });
      document.querySelectorAll(".rail-btn").forEach(function (node) { node.classList.remove("active"); });
      button.classList.add("active"); view.classList.add("active"); await renderAdmin();
    };
  }
  function tabs() {
    return [["articles","Статьи"],["tests","Тесты"],["assignments","Назначения"],["reviewers","Проверяющие и редакторы"],["directory","Справочник Bitrix"],["sync","Синхронизация"]]
      .map(function (tab) { return '<button data-v537-tab="'+tab[0]+'" class="'+(adminTab===tab[0]?"active":"")+'">'+tab[1]+"</button>"; }).join("");
  }
  async function renderAdmin() {
    await load(true);
    var view = document.getElementById("adminKnowledge537");
    view.innerHTML = '<div class="admin-page-head"><div><h1>Управление Базой знаний</h1><p class="muted">Источник истины: PostgreSQL · '+documents.length+' статей</p></div></div><div class="v537-tabs">'+tabs()+'</div><div id="v537AdminBody"></div>';
    view.querySelectorAll("[data-v537-tab]").forEach(function (button) { button.onclick = function () { adminTab=button.dataset.v537Tab; renderAdmin(); }; });
    var body = document.getElementById("v537AdminBody");
    if (adminTab === "articles") body.innerHTML = table(documents.map(function(d){return [d.sourceRow,"<b>"+escapeHtml(d.title)+"</b><small>"+escapeHtml(d.description)+"</small>",'<button data-v537-open="'+d.id+'">Просмотр</button>'];}),["Строка","Статья","Действия"]);
    if (adminTab === "tests") body.innerHTML = table(documents.map(function(d){return ["<b>"+escapeHtml(d.title)+"</b>",testCell(d,"light"),testCell(d,"full")];}),["Документ","Тест лайт","Тест полный"]);
    if (adminTab === "assignments") body.innerHTML = table(documents.map(function(d){return ["<b>"+escapeHtml(d.title)+"</b>",ruleCell(d,"articleAssignments"),ruleCell(d,"lightTestAssignments"),ruleCell(d,"fullTestAssignments")];}),["Документ","Статья","Лайт","Полный"]);
    if (adminTab === "reviewers") body.innerHTML = table(documents.map(function(d){return ["<b>"+escapeHtml(d.title)+"</b>",ruleCell(d,"reviewers"),ruleCell(d,"editors")];}),["Документ","Проверяющие","Редакторы"]);
    if (adminTab === "directory") { body.innerHTML='<button id="v537RefreshDirectory">Обновить из Bitrix24</button><div id="v537Directory"></div>'; document.getElementById("v537RefreshDirectory").onclick=refreshDirectory; await showDirectory(); }
    if (adminTab === "sync") body.innerHTML='<div class="settings-card"><h3>Google Sheets ↔ PostgreSQL</h3><p>Основные данные хранятся на сервере. Кнопка в таблице отправляет изменения в БД и получает актуальные статьи, тесты, назначения и справочник.</p><span class="v537-status ready">Серверный API готов</span></div>';
    bindAdminActions();
  }
  function table(rows, headers) { return '<div class="table-card"><table class="admin-table"><thead><tr>'+headers.map(function(x){return"<th>"+x+"</th>";}).join("")+'</tr></thead><tbody>'+rows.map(function(row){return"<tr>"+row.map(function(x){return"<td>"+x+"</td>";}).join("")+"</tr>";}).join("")+"</tbody></table></div>"; }
  function formatRules(rules) { return (rules || []).map(function(rule){return rule.type+(rule.id?":"+rule.id:"");}).join(", ") || "—"; }
  function ruleCell(doc, field) { return '<button class="v537-rule" data-v537-rules="'+doc.id+'" data-field="'+field+'">'+escapeHtml(formatRules(doc[field]))+'</button>'; }
  function parseRules(value) {
    return String(value || "").split(/[;,]/).map(function(item){var parts=item.trim().split(":");return parts[0]?{type:parts[0],id:parts.slice(1).join(":")}:null;}).filter(Boolean);
  }
  function testCell(doc, kind) { var test=kind==="light"?doc.lightTest:doc.fullTest; return test&&test.created?'<span class="v537-status ready">Создан</span> '+escapeHtml(test.title):'<button data-v537-create-test="'+doc.id+'" data-kind="'+kind+'">Создать пустой тест</button>'; }
  function bindAdminActions() {
    document.querySelectorAll("[data-v537-open]").forEach(function(b){b.onclick=function(){openKnowledgePreview(b.dataset.v537Open);};});
    document.querySelectorAll("[data-v537-create-test]").forEach(function(b){b.onclick=async function(){await api("/api/v47/knowledge/documents/"+b.dataset.v537CreateTest+"/tests/"+b.dataset.kind,{method:"POST",body:"{}"});toast("Пустой тест создан");renderAdmin();};});
    document.querySelectorAll("[data-v537-rules]").forEach(function(b){b.onclick=async function(){
      var doc=documents.find(function(item){return String(item.id)===String(b.dataset.v537Rules);});
      var value=prompt("Правила через точку с запятой: all_active; user:36; department:12; role:admin",formatRules(doc[b.dataset.field]).replace("—",""));
      if(value===null)return;
      var payload={};payload[b.dataset.field]=parseRules(value);
      await api("/api/v47/knowledge/documents/"+doc.id,{method:"PUT",body:JSON.stringify(payload)});
      toast("Правила сохранены в PostgreSQL");renderAdmin();
    };});
  }
  async function openKnowledgePreview(id){var doc=await api("/api/v47/knowledge/documents/"+id);modal('<h2>'+escapeHtml(doc.title)+'</h2><div id="v537AdminPreview" style="height:70vh"></div>');window.RTMCanvas.mount(document.getElementById("v537AdminPreview"),{pageKey:"admin-knowledge:"+id,scene:doc.scene,readOnly:true,fitToContent:true});}
  async function refreshDirectory(){var result=await api("/api/v47/knowledge/directory/refresh",{method:"POST",body:"{}"});toast("Получено: "+result.users+" сотрудников, "+result.departments+" подразделений");showDirectory();}
  async function showDirectory(){var data=await api("/api/v47/knowledge/directory"),box=document.getElementById("v537Directory");if(box)box.innerHTML="<p>Сотрудников: <b>"+data.users.length+"</b> · подразделений: <b>"+data.departments.length+"</b></p>";}

  function offerCoursePicker() {
    var grid=document.querySelector(".add-material-grid"); if(!grid||!grid.querySelector("[data-course-new],[data-v51-course-new]")||grid.querySelector("[data-v537-course]")||!state.courseId)return;
    var tile=document.createElement("button"); tile.className="add-tile"; tile.dataset.v537Course="1"; tile.innerHTML="<span>📚</span><div><h3>Из Базы знаний</h3><p class=\"muted\">Статья или созданный тест</p></div>"; grid.appendChild(tile);
    tile.onclick=async function(){await load();modal('<h2>Добавить из Базы знаний</h2><div class="v537-picker"><input id="v537Find" placeholder="Поиск"><select id="v537Select" size="14"></select><select id="v537Kind"><option value="article">Статья</option><option value="light">Тест лайт</option><option value="full">Тест полный</option></select><button class="primary" id="v537AddCourse">Добавить в курс</button></div>');fillPicker("");document.getElementById("v537Find").oninput=function(){fillPicker(this.value)};document.getElementById("v537AddCourse").onclick=addSelectedToCourse;};
  }
  function fillPicker(query){var select=document.getElementById("v537Select");if(!select)return;select.innerHTML=documents.filter(function(d){return d.title.toLowerCase().includes(String(query).toLowerCase());}).map(function(d){return'<option value="'+d.id+'">'+escapeHtml(d.title)+'</option>';}).join("");}
  async function addSelectedToCourse(){var id=Number(document.getElementById("v537Select").value),kind=document.getElementById("v537Kind").value,doc=documents.find(function(d){return d.id===id}),test=kind==="light"?doc.lightTest:doc.fullTest;if(kind!=="article"&&!(test&&test.created))return toast("Сначала создайте тест в Управлении Базой знаний");var name=kind==="article"?doc.title:test.title,type=kind==="article"?"article":"test",siblings=activeRows(state.items).filter(function(row){return String(row.PROPERTY_VALUES.parentId)===String(state.courseId)}),meta={sectionId:"nosection",required:false,order:(siblings.length+1)*100,linkedKnowledge:true,knowledgeDocumentId:id,knowledgeKind:kind},props={type:type,status:"published",projectId:String(state.projectId),parentId:String(state.courseId),space:"projects",content:"",meta:json(meta),updatedAt:now()};await add(E.items,name,props);closeModal();await loadAll(true);renderCourseEditor();toast("Связанный материал добавлен. Он изменяется только в Управлении Базой знаний");}

  function linkedMeta(item){var meta=item&&j(item.PROPERTY_VALUES.meta);return meta&&meta.linkedKnowledge?meta:null;}
  async function linkedPayload(item){var meta=linkedMeta(item);return api("/api/v47/knowledge/documents/"+meta.knowledgeDocumentId+"/linked/"+meta.knowledgeKind);}
  var originalOpenArticleEditor=window.openArticleEditor,originalOpenTestEditor=window.openTestEditor,originalOpenUserMaterial=window.openUserMaterial;
  window.openArticleEditor=openArticleEditor=function(id){var item=findItem(id),meta=linkedMeta(item);if(!meta)return originalOpenArticleEditor.apply(this,arguments);linkedPayload(item).then(function(payload){modal('<button class="modal-close" onclick="window.closeModal()">×</button><h2>'+escapeHtml(payload.title)+'</h2><p class="v537-locked">Связанный материал нельзя изменять внутри курса. Редактирование выполняется в «Управлении Базой знаний» и обновляет все курсы.</p><div id="v537LinkedPreview" style="height:68vh"></div>');window.RTMCanvas.mount(document.getElementById("v537LinkedPreview"),{pageKey:"linked-preview:"+item.ID,scene:payload.scene,readOnly:true,fitToContent:true});}).catch(function(error){toast(error.message||String(error));});};
  window.openTestEditor=openTestEditor=function(id){var item=findItem(id),meta=linkedMeta(item);if(!meta)return originalOpenTestEditor.apply(this,arguments);toast("Связанный тест редактируется только в Управлении Базой знаний");adminTab="tests";var nav=document.getElementById("v537KnowledgeNav");if(nav)nav.click();};
  window.openUserMaterial=openUserMaterial=async function(item){var meta=linkedMeta(item);if(!meta)return originalOpenUserMaterial.apply(this,arguments);try{var payload=await linkedPayload(item),copy=Object.assign({},item,{NAME:payload.title,PROPERTY_VALUES:Object.assign({},item.PROPERTY_VALUES)}),next=Object.assign({},meta);if(meta.knowledgeKind==="article")next.pages=[{id:"knowledge_"+meta.knowledgeDocumentId,title:payload.title,html:"",canvasBackup:payload.scene}];else{Object.assign(next,payload.test||{});item.PROPERTY_VALUES.meta=json(next);}copy.PROPERTY_VALUES.meta=json(next);return originalOpenUserMaterial.call(this,copy);}catch(error){toast(error.message||String(error));}};
  new MutationObserver(function(){installAdmin();offerCoursePicker();}).observe(document.documentElement,{childList:true,subtree:true});
  installAdmin(); load().then(function(){if(typeof renderKb==="function")renderKb();}).catch(console.error);
})();
