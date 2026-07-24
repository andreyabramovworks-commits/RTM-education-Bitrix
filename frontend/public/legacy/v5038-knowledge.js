/* RTM Education v50.3.8 — unified live Knowledge Base. */
(function () {
  "use strict";

  var docs = [], directory = null, loaded = false, adminPath = [], adminSelected = null;
  var api = function (path, options) { return window.RTMV47.request(path, options); };
  var html = function (value) { return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); };
  var norm = function (value) { return String(value || "").trim().toLowerCase(); };
  var root = function () { return window.RTM_KB_DATA && window.RTM_KB_DATA.tree || {id:"root",type:"folder",title:"База знаний",children:[]}; };
  var byRow = function (row) { return docs.find(function (doc) { return Number(doc.sourceRow) === Number(row); }); };
  var linkedMeta = function (item) { var meta=item&&j(item.PROPERTY_VALUES&&item.PROPERTY_VALUES.meta); return meta&&meta.linkedKnowledge?meta:null; };

  async function load(force) {
    if (loaded && !force) return docs;
    docs = await api("/api/v47/knowledge/documents");
    loaded = true;
    return docs;
  }
  async function loadDirectory(force) {
    if (directory && !force) return directory;
    directory = await api("/api/v47/knowledge/directory");
    return directory;
  }
  function usableNode(node) {
    if (!node) return null;
    if (node.type === "material") return byRow(node.row) ? node : null;
    var copy = Object.assign({}, node), children = (node.children || []).map(usableNode).filter(Boolean);
    copy.children = children;
    return children.length || node.id === "root" ? copy : null;
  }
  function findNode(id, node) {
    node = node || usableNode(root());
    if (!node) return null;
    if (String(node.id) === String(id)) return node;
    for (var child of node.children || []) { var found=findNode(id,child); if(found)return found; }
    return null;
  }
  function count(node) {
    return (node.children || []).reduce(function (sum, child) { return sum+(child.type==="material"?1:count(child)); },0);
  }
  function currentNode(path) {
    var node=usableNode(root());
    (path||[]).forEach(function(id){var next=(node.children||[]).find(function(x){return String(x.id)===String(id)});if(next)node=next;});
    return node;
  }
  function docCard(node, admin) {
    if (node.type === "folder") return '<button class="kb-tree-card folder" data-v538-folder="'+html(node.id)+'"><span class="kb-tree-icon">'+svgIcon("folder")+'</span><span><b>'+html(node.title)+'</b><small>'+count(node)+' материалов</small></span><i>›</i></button>';
    var doc=byRow(node.row), light=doc&&doc.lightTest&&doc.lightTest.created, full=doc&&doc.fullTest&&doc.fullTest.created;
    return '<button class="kb-tree-card material" data-v538-document="'+html(doc&&doc.id)+'"><span class="kb-tree-icon">'+svgIcon("article")+'</span><span><b>'+html(node.title)+'</b><small>'+(admin?'Статья'+(light?' · тест лайт':'')+(full?' · тест полный':''):'Документ')+'</small></span><i>›</i></button>';
  }
  function crumbs(path, admin) {
    var node=usableNode(root()), parts=[{title:"База знаний",depth:0}];
    (path||[]).forEach(function(id,index){var next=(node.children||[]).find(function(x){return String(x.id)===String(id)});if(next){parts.push({title:next.title,depth:index+1});node=next;}});
    return parts.map(function(x,i){return '<button data-v538-crumb="'+x.depth+'">'+html(x.title)+'</button>'+(i<parts.length-1?'<span>›</span>':'');}).join("");
  }

  function ephemeral(item) {
    state.items = (state.items || []).filter(function (row) { return String(row.ID) !== String(item.ID); });
    state.items.push(item);
    return item;
  }
  function articleProjection(doc, item) {
    var meta=item?j(item.PROPERTY_VALUES.meta):{};
    meta=Object.assign({},meta,{knowledgeReference:true,pages:[{id:"knowledge_"+doc.id,title:doc.title,html:"",canvasBackup:doc.scene}]});
    return {
      ID:item?item.ID:"kb_article_"+doc.id, NAME:doc.title,
      PROPERTY_VALUES:Object.assign({},item&&item.PROPERTY_VALUES||{},{
        type:"article",status:"published",projectId:item&&item.PROPERTY_VALUES.projectId||"__knowledge__",
        parentId:item&&item.PROPERTY_VALUES.parentId||"",space:"knowledge",content:"",meta:json(meta)
      })
    };
  }
  function testProjection(doc, kind, item) {
    var test=kind==="light"?doc.lightTest:doc.fullTest, meta=item?j(item.PROPERTY_VALUES.meta):{};
    meta=Object.assign({},meta,test||{},{knowledgeReference:true,knowledgeDocumentId:doc.id,knowledgeKind:kind});
    return {
      ID:item?item.ID:"kb_test_"+doc.id+"_"+kind, NAME:test.title,
      PROPERTY_VALUES:Object.assign({},item&&item.PROPERTY_VALUES||{},{
        type:"test",status:"published",projectId:item&&item.PROPERTY_VALUES.projectId||"__knowledge__",
        parentId:item&&item.PROPERTY_VALUES.parentId||"",space:"knowledge",content:"",meta:json(meta)
      })
    };
  }

  var baseOpenUserMaterial=window.openUserMaterial;
  async function openCentralForUser(doc, kind, item) {
    try {
      var payload=await api("/api/v47/knowledge/documents/"+doc.id+"/linked/"+kind+(item?"?course_item_id="+encodeURIComponent(item.ID):""));
      var full=Object.assign({},doc, payload);
      if(kind==="article")full.scene=payload.scene;
      var projection=kind==="article"?articleProjection(full,item):testProjection(Object.assign({},doc,{lightTest:kind==="light"?payload.test:doc.lightTest,fullTest:kind==="full"?payload.test:doc.fullTest}),kind,item);
      if(!item)ephemeral(projection);
      else {
        var index=state.items.findIndex(function(row){return String(row.ID)===String(item.ID);});
        if(index>=0)state.items[index]=projection;
      }
      baseOpenUserMaterial.call(window,projection);
    } catch(error) { toast(error.message||String(error)); }
  }
  window.openUserMaterial=openUserMaterial=async function(item) {
    var meta=linkedMeta(item);
    if(!meta)return baseOpenUserMaterial.apply(this,arguments);
    var doc=docs.find(function(row){return Number(row.id)===Number(meta.knowledgeDocumentId);}) || await api("/api/v47/knowledge/documents/"+meta.knowledgeDocumentId);
    return openCentralForUser(doc,meta.knowledgeKind,item);
  };

  function renderUserDetail(doc, node) {
    var box=document.getElementById("kbArticlesList"),crumb=document.getElementById("kbBreadcrumbs");
    if(crumb)crumb.innerHTML='<button data-v538-user-back>← Назад</button>';
    box.innerHTML='<div class="kb-detail v538-user-detail"><h1>'+html(doc.title)+'</h1>'+(doc.description?'<p>'+html(doc.description)+'</p>':'')+
      '<div class="kb-open-actions"><a class="primary kb-open-link" href="'+html(doc.documentUrl)+'" target="_blank" rel="noopener noreferrer">Открыть документ</a>'+
      '<button class="primary" data-v538-user-kind="article">Открыть статью</button>'+
      (doc.lightTest&&doc.lightTest.created?'<button data-v538-user-kind="light">Открыть тест лайт</button>':'')+
      (doc.fullTest&&doc.fullTest.created?'<button data-v538-user-kind="full">Открыть тест полный</button>':'')+'</div></div>';
    crumb.querySelector("[data-v538-user-back]").onclick=function(){state.kbSelected=null;renderKb();};
    box.querySelectorAll("[data-v538-user-kind]").forEach(function(button){button.onclick=function(){openCentralForUser(doc,button.dataset.v538UserKind);};});
  }
  window.renderKb=renderKb=function () {
    var box=document.getElementById("kbArticlesList"),crumb=document.getElementById("kbBreadcrumbs");
    if(!box)return;
    load().then(function(){
      var tree=usableNode(root()), selected=state.kbSelected&&findNode(state.kbSelected,tree);
      if(selected&&selected.type==="material"){var doc=byRow(selected.row);if(doc)return renderUserDetail(doc,selected);}
      var query=norm(document.getElementById("kbSearch")&&document.getElementById("kbSearch").value),node=currentNode(state.kbPath||[]);
      var rows=query?(function all(n,out){out=out||[];(n.children||[]).forEach(function(x){if(x.type==="material")out.push(x);else all(x,out);});return out;})(tree).filter(function(x){var d=byRow(x.row);return norm(x.title+" "+(d&&d.description||"")).includes(query);}):(node.children||[]);
      if(crumb)crumb.innerHTML=crumbs(query?[]:(state.kbPath||[]),false);
      box.innerHTML=rows.map(function(x){return docCard(x,false);}).join("")||'<div class="panel">Ничего не найдено</div>';
      box.querySelectorAll("[data-v538-folder]").forEach(function(b){b.onclick=function(){state.kbPath=state.kbPath||[];state.kbPath.push(b.dataset.v538Folder);renderKb();};});
      box.querySelectorAll("[data-v538-document]").forEach(function(b){var d=docs.find(function(x){return String(x.id)===String(b.dataset.v538Document);});b.onclick=function(){var n=(function seek(node){if(node.type==="material"&&Number(node.row)===Number(d.sourceRow))return node;for(var c of node.children||[]){var f=seek(c);if(f)return f;}return null;})(tree);state.kbSelected=n&&n.id;renderKb();};});
      crumb&&crumb.querySelectorAll("[data-v538-crumb]").forEach(function(b){b.onclick=function(){state.kbPath=(state.kbPath||[]).slice(0,Number(b.dataset.v538Crumb));state.kbSelected=null;var search=document.getElementById("kbSearch");if(search)search.value="";renderKb();};});
    }).catch(function(error){box.innerHTML='<div class="panel test-result bad">'+html(error.message||error)+'</div>';});
  };

  function adminDocument(doc) {
    var light=doc.lightTest||{},full=doc.fullTest||{};
    return '<div class="v538-admin-detail" data-v538-document-id="'+html(doc.id)+'"><button data-v538-admin-back>← Назад</button><h1>'+html(doc.title)+'</h1><p>'+html(doc.description||"Описание пока не заполнено")+'</p>'+
      '<div class="v538-action-grid">'+
      '<section><h3>Статья</h3><button class="primary" data-v538-edit-article>Открыть и редактировать статью</button><button data-v538-assign="article">Настроить назначения</button></section>'+
      '<section><h3>Тест лайт</h3>'+(light.created?'<button data-v538-edit-test="light">Открыть тест лайт</button>':'<button data-v538-create-test="light">Создать тест лайт</button>')+'<button data-v538-assign="light">Настроить назначения</button></section>'+
      '<section><h3>Тест полный</h3>'+(full.created?'<button data-v538-edit-test="full">Открыть тест полный</button>':'<button data-v538-create-test="full">Создать тест полный</button>')+'<button data-v538-assign="full">Настроить назначения</button></section>'+
      '</div><p class="muted">Центральные материалы нельзя удалить: изменения автоматически применяются во всех курсах.</p></div>';
  }
  async function renderAdminKnowledge() {
    await load(true); await loadDirectory();
    var view=document.getElementById("adminDatabase"); if(!view)return;
    var tree=usableNode(root()),node=currentNode(adminPath);
    view.innerHTML='<div class="admin-page-head"><div><h1>Управление Базой знаний</h1><p class="muted">Источник истины: PostgreSQL · '+docs.length+' статей</p></div>'+
      '<button id="v538RefreshDirectory">Обновить из Bitrix24</button></div>'+
      '<div class="v538-directory-status">Сотрудников: <b>'+directory.users.length+'</b> · подразделений: <b>'+directory.departments.length+'</b></div>'+
      '<div class="hero pink v538-admin-search"><input id="v538AdminSearch" placeholder="Введите название документа"></div>'+
      '<div id="v538AdminCrumbs" class="kb-breadcrumbs">'+crumbs(adminPath,true)+'</div><div id="v538AdminBody" class="kb-tree-grid"></div>';
    var body=document.getElementById("v538AdminBody"),query="";
    function draw() {
      if(adminSelected){var doc=docs.find(function(x){return String(x.id)===String(adminSelected);});body.innerHTML=adminDocument(doc);bindDetail(doc);return;}
      var rows=query?(function all(n,out){out=out||[];(n.children||[]).forEach(function(x){if(x.type==="material")out.push(x);else all(x,out);});return out;})(tree).filter(function(x){var d=byRow(x.row);return norm(x.title+" "+(d&&d.description||"")).includes(norm(query));}):(currentNode(adminPath).children||[]);
      body.innerHTML=rows.map(function(x){return docCard(x,true);}).join("")||'<div class="panel">Ничего не найдено</div>';
      body.querySelectorAll("[data-v538-folder]").forEach(function(b){b.onclick=function(){adminPath.push(b.dataset.v538Folder);renderAdminKnowledge();};});
      body.querySelectorAll("[data-v538-document]").forEach(function(b){b.onclick=function(){adminSelected=b.dataset.v538Document;draw();};});
    }
    document.getElementById("v538AdminSearch").oninput=function(){query=this.value;adminSelected=null;draw();};
    document.querySelectorAll("#v538AdminCrumbs [data-v538-crumb]").forEach(function(b){b.onclick=function(){adminPath=adminPath.slice(0,Number(b.dataset.v538Crumb));adminSelected=null;renderAdminKnowledge();};});
    document.getElementById("v538RefreshDirectory").onclick=async function(){var result=await api("/api/v47/knowledge/directory/refresh",{method:"POST",body:"{}"});directory=null;toast("Получено: "+result.users+" сотрудников, "+result.departments+" подразделений");renderAdminKnowledge();};
    draw();
  }
  function bindDetail(doc) {
    document.querySelector("[data-v538-admin-back]").onclick=function(){adminSelected=null;renderAdminKnowledge();};
    document.querySelector("[data-v538-edit-article]").onclick=function(){editArticle(doc);};
    document.querySelectorAll("[data-v538-edit-test]").forEach(function(b){b.onclick=function(){editTest(doc,b.dataset.v538EditTest);};});
    document.querySelectorAll("[data-v538-create-test]").forEach(function(b){b.onclick=async function(){await api("/api/v47/knowledge/documents/"+doc.id+"/tests/"+b.dataset.v538CreateTest,{method:"POST",body:"{}"});toast("Пустой тест создан");renderAdminKnowledge();};});
    document.querySelectorAll("[data-v538-assign]").forEach(function(b){b.onclick=function(){assignmentEditor(doc,b.dataset.v538Assign);};});
  }

  async function editArticle(doc) {
    var full=await api("/api/v47/knowledge/documents/"+doc.id),scene=full.scene;
    modal('<div class="v538-editor"><h2>Редактирование центральной статьи</h2><label>Название<input id="v538ArticleTitle" value="'+html(full.title)+'"></label><label>Описание<textarea id="v538ArticleDescription">'+html(full.description)+'</textarea></label><label>Ссылка на документ<input id="v538ArticleUrl" value="'+html(full.documentUrl)+'"></label><div id="v538ArticleCanvas"></div><div class="inline-actions right"><button onclick="closeModal()">Отмена</button><button class="primary" id="v538SaveArticle">Сохранить изменения</button></div></div>');
    window.RTMCanvas.mount(document.getElementById("v538ArticleCanvas"),{pageKey:"knowledge-admin:"+doc.id,scene:scene,readOnly:false,completionRequired:true,fitToContent:true,title:full.title,brandColor:"#12b886",onChange:function(next){scene=next;},onRequestDisk:window.RTMV46&&window.RTMV46.pickDiskMedia,onManualSave:async function(snapshot){if(snapshot)scene=snapshot;}});
    document.getElementById("v538SaveArticle").onclick=async function(){var saved=await api("/api/v47/knowledge/documents/"+doc.id,{method:"PUT",body:JSON.stringify({title:document.getElementById("v538ArticleTitle").value.trim(),description:document.getElementById("v538ArticleDescription").value,documentUrl:document.getElementById("v538ArticleUrl").value.trim(),scene:scene})});docs=docs.map(function(x){return x.id===saved.id?saved:x;});closeModal();toast("Центральная статья сохранена и обновлена во всех курсах");renderAdminKnowledge();};
  }
  function normalizeQuestion(q) { return Object.assign({id:"q_"+Date.now()+"_"+Math.random().toString(36).slice(2),type:"single",text:"",answers:["",""],correct:[0]},q||{}); }
  function editTest(doc,kind) {
    var test=JSON.parse(JSON.stringify(kind==="light"?doc.lightTest:doc.fullTest));test.questions=(test.questions||[]).map(normalizeQuestion);
    modal('<div class="v538-test-editor"><h2>Редактирование теста '+(kind==="light"?"лайт":"полного")+'</h2><label>Название<input id="v538TestTitle" value="'+html(test.title)+'"></label><div id="v538Questions"></div><div class="inline-actions"><button id="v538AddQuestion">Добавить вопрос</button><button onclick="closeModal()">Отмена</button><button class="primary" id="v538SaveTest">Сохранить тест</button></div></div>');
    function drawQuestions(){var box=document.getElementById("v538Questions");box.innerHTML=test.questions.map(function(q,i){return '<div class="question-card"><h3>Вопрос '+(i+1)+'</h3><input data-v538-qtext="'+i+'" value="'+html(q.text)+'" placeholder="Текст вопроса"><textarea data-v538-qanswers="'+i+'" placeholder="Каждый вариант с новой строки">'+html((q.answers||[]).join("\n"))+'</textarea><label>Номер правильного ответа<input type="number" min="1" data-v538-qcorrect="'+i+'" value="'+((q.correct&&q.correct[0]||0)+1)+'"></label><button class="danger" data-v538-qdelete="'+i+'">Удалить вопрос</button></div>';}).join("")||'<div class="panel">Вопросов пока нет</div>';box.querySelectorAll("[data-v538-qdelete]").forEach(function(b){b.onclick=function(){collect();test.questions.splice(Number(b.dataset.v538Qdelete),1);drawQuestions();};});}
    function collect(){test.title=document.getElementById("v538TestTitle").value.trim();test.questions.forEach(function(q,i){q.text=(document.querySelector('[data-v538-qtext="'+i+'"]')||{}).value||"";q.answers=((document.querySelector('[data-v538-qanswers="'+i+'"]')||{}).value||"").split(/\r?\n/).map(function(x){return x.trim();}).filter(Boolean);q.correct=[Math.max(0,Number((document.querySelector('[data-v538-qcorrect="'+i+'"]')||{}).value||1)-1)];});}
    document.getElementById("v538AddQuestion").onclick=function(){collect();test.questions.push(normalizeQuestion());drawQuestions();};
    document.getElementById("v538SaveTest").onclick=async function(){collect();var payload={};payload[kind==="light"?"lightTest":"fullTest"]=test;var saved=await api("/api/v47/knowledge/documents/"+doc.id,{method:"PUT",body:JSON.stringify(payload)});docs=docs.map(function(x){return x.id===saved.id?saved:x;});closeModal();toast("Тест сохранён и обновлён во всех курсах");renderAdminKnowledge();};
    drawQuestions();
  }

  function rulesFor(doc,kind,role) {
    if(role==="students")return doc[kind==="article"?"articleAssignments":kind==="light"?"lightTestAssignments":"fullTestAssignments"]||[];
    if(role==="reviewers")return doc[kind==="article"?"articleReviewers":kind==="light"?"lightTestReviewers":"fullTestReviewers"]||[];
    return doc[kind==="article"?"articleEditors":kind==="light"?"lightTestEditors":"fullTestEditors"]||[];
  }
  function ruleInputs(rules,role) {
    var values=new Set((rules||[]).map(function(r){return r.type+":"+String(r.id||"");})),eligible=(directory.users||[]).filter(function(u){return role==="students"||u.reviewerAllowed;});
    var all=role==="students"?'<label class="v538-choice"><input type="checkbox" data-rule-type="all_active" '+(values.has("all_active:")?"checked":"")+'> Все активные сотрудники</label>':"";
    var deps=role==="students"?'<div class="v538-choice-list"><b>Подразделения (включая подотделы)</b>'+(directory.departments||[]).map(function(d){return '<label class="v538-choice"><input type="checkbox" data-rule-type="department" value="'+html(d.id)+'" '+(values.has("department:"+d.id)?"checked":"")+'> '+html(d.name)+'</label>';}).join("")+'</div>':"";
    var users='<div class="v538-choice-list"><b>Сотрудники</b>'+eligible.map(function(u){return '<label class="v538-choice"><input type="checkbox" data-rule-type="user" value="'+html(u.id)+'" '+(values.has("user:"+u.id)?"checked":"")+'> '+html(u.name)+' <small>'+html(u.role||"")+'</small></label>';}).join("")+'</div>';
    return all+deps+users;
  }
  function assignmentEditor(doc,kind) {
    modal('<div class="v538-assignments"><h2>Назначения: '+html(doc.title)+'</h2><p class="muted">'+(kind==="article"?"Статья":kind==="light"?"Тест лайт":"Тест полный")+'</p><input id="v538RuleSearch" placeholder="Поиск сотрудника или подразделения"><div class="v538-role-grid"><section data-role="students"><h3>Ученики</h3>'+ruleInputs(rulesFor(doc,kind,"students"),"students")+'</section><section data-role="reviewers"><h3>Проверяющие</h3>'+ruleInputs(rulesFor(doc,kind,"reviewers"),"reviewers")+'</section><section data-role="editors"><h3>Редакторы</h3>'+ruleInputs(rulesFor(doc,kind,"editors"),"editors")+'</section></div>'+(kind==="article"?'<label class="v538-inherit"><input id="v538Inherit" type="checkbox" '+(doc.inheritTestAssignments?"checked":"")+'> При обновлении скопировать назначения статьи в оба теста</label>':'')+'<div class="inline-actions right"><button onclick="closeModal()">Отмена</button><button class="primary" id="v538SaveAssignments">Обновить назначения</button></div></div>');
    document.getElementById("v538RuleSearch").oninput=function(){var q=norm(this.value);document.querySelectorAll(".v538-choice").forEach(function(label){label.hidden=q&&!norm(label.textContent).includes(q);});};
    function collect(role){return Array.from(document.querySelector('[data-role="'+role+'"]').querySelectorAll('input[type="checkbox"]:checked')).map(function(input){return {type:input.dataset.ruleType,id:input.value||""};});}
    document.getElementById("v538SaveAssignments").onclick=async function(){var payload={},prefix=kind==="article"?"article":kind==="light"?"lightTest":"fullTest";payload[prefix+"Assignments"]=collect("students");payload[prefix+"Reviewers"]=collect("reviewers");payload[prefix+"Editors"]=collect("editors");if(kind==="article")payload.inheritTestAssignments=document.getElementById("v538Inherit").checked;var saved=await api("/api/v47/knowledge/documents/"+doc.id,{method:"PUT",body:JSON.stringify(payload)});docs=docs.map(function(x){return x.id===saved.id?saved:x;});closeModal();toast("Назначения сохранены");renderAdminKnowledge();};
  }

  var baseSwitchAdmin=window.switchAdmin;
  window.switchAdmin=switchAdmin=function(view){
    if(view==="database"&&!["developer","admin","editor"].includes(String(state.currentRole||"")))return toast("Управление Базой знаний доступно редакторам, администраторам и разработчику");
    var result=baseSwitchAdmin.apply(this,arguments);
    if(view==="database"){state.aview="database";renderAdminKnowledge().catch(function(error){toast(error.message||String(error));});}
    return result;
  };
  function installDatabaseRoute() {
    var button=document.querySelector('[data-admin-view="database"]');
    if(button){var allowed=["developer","admin","editor"].includes(String(state.currentRole||""));button.hidden=!allowed;button.style.display=allowed?"":"none";button.title="Управление Базой знаний";button.onclick=function(){switchAdmin("database");};}
    var old=document.getElementById("v537KnowledgeNav");if(old)old.remove();
  }

  var baseCourseModal=window.addMaterialModalForCourse;
  window.addMaterialModalForCourse=addMaterialModalForCourse=function(){
    baseCourseModal.apply(this,arguments);
    var grid=document.querySelector(".add-material-grid");if(!grid||grid.querySelector("[data-v538-course]"))return;
    var tile=document.createElement("button");tile.className="add-tile";tile.dataset.v538Course="1";tile.innerHTML='<span>📚</span><div><h3>Из Базы знаний</h3><p class="muted">Статья и созданные тесты</p></div>';grid.appendChild(tile);
    tile.onclick=coursePicker;
  };
  async function coursePicker() {
    await load(true);
    modal('<div class="v538-course-picker"><h2>Добавить из Базы знаний</h2><input id="v538CourseSearch" placeholder="Поиск документа"><div id="v538CourseDocuments"></div><div id="v538CourseKinds" class="v538-kind-choices"><p>Сначала выберите документ</p></div><button class="primary" id="v538AddCourse" disabled>Добавить выбранное в курс</button></div>');
    var selected=null;
    function list(){var q=norm(document.getElementById("v538CourseSearch").value);document.getElementById("v538CourseDocuments").innerHTML=docs.filter(function(d){return norm(d.title).includes(q);}).map(function(d){return '<button data-v538-pick-doc="'+d.id+'" class="'+(selected&&selected.id===d.id?"active":"")+'">'+html(d.title)+'</button>';}).join("");document.querySelectorAll("[data-v538-pick-doc]").forEach(function(b){b.onclick=function(){selected=docs.find(function(d){return String(d.id)===String(b.dataset.v538PickDoc);});list();kinds();};});}
    function kinds(){var light=selected.lightTest&&selected.lightTest.created,full=selected.fullTest&&selected.fullTest.created;document.getElementById("v538CourseKinds").innerHTML='<label><input type="checkbox" value="article" checked> Статья</label><label class="'+(!light?"disabled":"")+'"><input type="checkbox" value="light" '+(!light?"disabled":"")+'> Тест лайт'+(!light?" — ещё не создан":"")+'</label><label class="'+(!full?"disabled":"")+'"><input type="checkbox" value="full" '+(!full?"disabled":"")+'> Тест полный'+(!full?" — ещё не создан":"")+'</label>';document.getElementById("v538AddCourse").disabled=false;}
    document.getElementById("v538CourseSearch").oninput=list;
    document.getElementById("v538AddCourse").onclick=async function(){var kinds=Array.from(document.querySelectorAll('#v538CourseKinds input:checked')).map(function(x){return x.value;});if(!selected||!kinds.length)return toast("Выберите хотя бы один материал");var siblings=activeRows(state.items).filter(function(row){return String(row.PROPERTY_VALUES.parentId)===String(state.courseId);}),order=(siblings.length+1)*100;for(var kind of ["article","light","full"]){if(!kinds.includes(kind))continue;var test=kind==="light"?selected.lightTest:selected.fullTest,name=kind==="article"?selected.title:test.title,type=kind==="article"?"article":"test",reviewers=rulesFor(selected,kind,"reviewers"),editors=rulesFor(selected,kind,"editors"),meta={sectionId:"nosection",required:false,order:order,linkedKnowledge:true,knowledgeDocumentId:selected.id,knowledgeKind:kind,knowledgeReviewers:reviewers,knowledgeEditors:editors};order+=100;await add(E.items,name,{type:type,status:"published",projectId:String(state.projectId),parentId:String(state.courseId),space:"projects",content:"",meta:json(meta),updatedAt:now()});}closeModal();await loadAll(true);renderCourseEditor();toast("Связанные материалы добавлены в курс");};
    list();
  }

  var baseArticleEditor=window.openArticleEditor,baseTestEditor=window.openTestEditor;
  window.openArticleEditor=openArticleEditor=function(id){var item=findItem(id),meta=linkedMeta(item);if(!meta)return baseArticleEditor.apply(this,arguments);var doc=docs.find(function(d){return Number(d.id)===Number(meta.knowledgeDocumentId);});openCentralForUser(doc,"article",item);toast("Связанная статья редактируется только через Управление Базой знаний");};
  window.openTestEditor=openTestEditor=function(id){var item=findItem(id),meta=linkedMeta(item);if(!meta)return baseTestEditor.apply(this,arguments);var doc=docs.find(function(d){return Number(d.id)===Number(meta.knowledgeDocumentId);});if(doc&&window.RTMV51&&window.RTMV51.openKnowledgeTest&&['developer','admin','moderator','editor'].includes(String(state.currentRole||getAppRole(state.user))))return window.RTMV51.openKnowledgeTest(doc,meta.knowledgeKind);openCentralForUser(doc,meta.knowledgeKind,item);};

  async function courseRoleEditor(item) {
    await loadDirectory();
    var meta=linkedMeta(item),reviewerBase=(meta.knowledgeReviewers||[]).filter(function(r){return r.type!=="user";}),editorBase=(meta.knowledgeEditors||[]).filter(function(r){return r.type!=="user";}),reviewers=new Set((meta.knowledgeReviewers||[]).filter(function(r){return r.type==="user";}).map(function(r){return String(r.id);})),editors=new Set((meta.knowledgeEditors||[]).filter(function(r){return r.type==="user";}).map(function(r){return String(r.id);})),eligible=directory.users.filter(function(u){return u.reviewerAllowed;});
    function choices(set,prefix){return eligible.map(function(u){return '<label class="v538-choice"><input type="checkbox" data-v538-local-'+prefix+'="'+html(u.id)+'" '+(set.has(String(u.id))?"checked":"")+'> '+html(u.name)+' <small>'+html(u.role)+'</small></label>';}).join("");}
    modal('<div class="v538-assignments"><h2>Проверяющие и редакторы только для этого курса</h2><p>'+html(item.NAME)+'</p><div class="v538-role-grid"><section><h3>Проверяющие</h3><div class="v538-choice-list">'+choices(reviewers,"reviewer")+'</div></section><section><h3>Редакторы</h3><div class="v538-choice-list">'+choices(editors,"editor")+'</div></section></div><div class="inline-actions right"><button onclick="closeModal()">Отмена</button><button class="primary" id="v538SaveLocalRoles">Сохранить для курса</button></div></div>');
    document.getElementById("v538SaveLocalRoles").onclick=async function(){meta.knowledgeReviewers=reviewerBase.concat(Array.from(document.querySelectorAll("[data-v538-local-reviewer]:checked")).map(function(x){return {type:"user",id:x.dataset.v538LocalReviewer};}));meta.knowledgeEditors=editorBase.concat(Array.from(document.querySelectorAll("[data-v538-local-editor]:checked")).map(function(x){return {type:"user",id:x.dataset.v538LocalEditor};}));await saveItemMeta(item.ID,meta);closeModal();toast("Настройки изменены только для этого курса");renderCourseEditor();};
  }
  var baseRenderCourseEditor=window.renderCourseEditor;
  window.renderCourseEditor=renderCourseEditor=function(){
    var result=baseRenderCourseEditor.apply(this,arguments);
    document.querySelectorAll("#courseSectionsEditor [data-open-child]").forEach(function(line){var item=findItem(line.dataset.openChild),meta=linkedMeta(item),actions=line.querySelector(".item-actions");if(!meta||!actions||actions.querySelector("[data-v538-course-roles]"))return;var button=document.createElement("button");button.dataset.v538CourseRoles=item.ID;button.title="Проверяющие и редакторы в этом курсе";button.textContent="Роли";actions.insertBefore(button,actions.firstChild);button.onclick=function(event){event.stopPropagation();courseRoleEditor(item);};});
    return result;
  };

  var baseRenderProjectList=window.renderProjectList;
  window.renderProjectList=renderProjectList=function(){
    var box=document.getElementById("projectListArticles"),q=norm(document.getElementById("projectListSearch")&&document.getElementById("projectListSearch").value);if(!box)return;
    if(!state.projectListProjectId)return baseRenderProjectList.apply(this,arguments);
    var project=state.projects.find(function(p){return String(p.ID)===String(state.projectListProjectId);});
    var rows=activeRows(state.items).filter(function(item){return String(item.PROPERTY_VALUES.projectId)===String(state.projectListProjectId)&&String(item.PROPERTY_VALUES.parentId||"root")==="root"&&norm(item.NAME+" "+(item.PROPERTY_VALUES.content||"")).includes(q);});
    box.innerHTML='<div class="kb-project-head"><button id="projectListBack">← Назад</button><b>'+html(project&&project.NAME||"Проект")+'</b></div><div class="kb-doc-grid">'+rows.map(function(item){return '<div class="kb-doc-card" data-project-material="'+item.ID+'"><span class="kb-icon">'+svgIcon(item.PROPERTY_VALUES.type||"article")+'</span><div><h3>'+html(item.NAME)+'</h3><p class="muted">'+html(typeLabel(item.PROPERTY_VALUES.type))+'</p></div></div>';}).join("")+'</div>';
    document.getElementById("projectListBack").onclick=function(){state.projectListProjectId=null;renderProjectList();};
    box.querySelectorAll("[data-project-material]").forEach(function(b){b.onclick=function(){var item=findItem(b.dataset.projectMaterial);if(item.PROPERTY_VALUES.type==="course")openUserCourse(item);else openUserMaterial(item);};});
  };

  installDatabaseRoute();
  var baseRenderAll5038=window.renderAll;
  window.renderAll=renderAll=function(){var result=baseRenderAll5038.apply(this,arguments);installDatabaseRoute();if(state.aview==="database"&&["developer","admin","editor"].includes(String(state.currentRole||"")))renderAdminKnowledge().catch(function(error){toast(error.message||String(error));});return result;};
  load().then(function(){renderKb();}).catch(console.error);
  window.addEventListener("load",installDatabaseRoute);
  window.RTMV5038={version:"50.3.10",renderAdmin:renderAdminKnowledge,getCurrentDocumentId:function(){return adminSelected;},reload:function(){loaded=false;directory=null;return load(true);}};
})();
