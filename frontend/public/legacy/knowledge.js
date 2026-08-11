/* source: v5038-knowledge.js */
/* RTM Education v50.3.8 — unified live Knowledge Base. */
(function () {
  "use strict";

  var docs = [], directory = null, loaded = false, loadPromise = null, directoryPromise = null;
  var adminPath = [], adminSelected = null, adminRenderGeneration = 0;
  var api = function (path, options) { return window.RTMV47.request(path, options); };
  var html = function (value) { return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); };
  var norm = function (value) { return String(value || "").trim().toLowerCase(); };
  var root = function () { return window.RTM_KB_DATA && window.RTM_KB_DATA.tree || {id:"root",type:"folder",title:"База знаний",children:[]}; };
  var byRow = function (row) { return docs.find(function (doc) { return Number(doc.sourceRow) === Number(row); }); };
  var linkedMeta = function (item) { var meta=item&&j(item.PROPERTY_VALUES&&item.PROPERTY_VALUES.meta); return meta&&meta.linkedKnowledge?meta:null; };

  async function load(force) {
    if (loaded && !force) return docs;
    if (loadPromise) return loadPromise;
    loadPromise = api("/api/v47/knowledge/documents").then(function (result) {
      docs = result; loaded = true; return docs;
    }).finally(function () { loadPromise = null; });
    return loadPromise;
  }
  async function loadDirectory(force) {
    if (directory && !force) return directory;
    if (directoryPromise) return directoryPromise;
    directoryPromise = api("/api/v47/knowledge/directory").then(function (result) {
      directory = result; return directory;
    }).finally(function () { directoryPromise = null; });
    return directoryPromise;
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
  function testProjection(doc, kind, item, previewAnswers) {
    var test=kind==="light"?doc.lightTest:doc.fullTest, meta=item?j(item.PROPERTY_VALUES.meta):{};
    meta=Object.assign({},meta,test||{},{knowledgeReference:true,knowledgeDocumentId:doc.id,knowledgeKind:kind,knowledgePreviewAnswers:Boolean(previewAnswers)});
    return {
      ID:item?item.ID:"kb_test_"+doc.id+"_"+kind, NAME:test.title,
      PROPERTY_VALUES:Object.assign({},item&&item.PROPERTY_VALUES||{},{
        type:"test",status:"published",projectId:item&&item.PROPERTY_VALUES.projectId||"__knowledge__",
        parentId:item&&item.PROPERTY_VALUES.parentId||"",space:"knowledge",content:"",meta:json(meta)
      })
    };
  }

  var baseOpenUserMaterial=window.openUserMaterial;
  async function openCentralForUser(doc, kind, item, previewAnswers) {
    try {
      if(!doc&&item){
        var itemMeta=linkedMeta(item);
        if(itemMeta)doc=await api("/api/v47/knowledge/documents/"+itemMeta.knowledgeDocumentId);
      }
      if(!doc)throw new Error("Материал Базы знаний не найден. Обновите список и повторите.");
      state.materialBackView=item?"learn":"kb";
      var payload=await api("/api/v47/knowledge/documents/"+doc.id+"/linked/"+kind+(item?"?course_item_id="+encodeURIComponent(item.ID):""));
      var full=Object.assign({},doc, payload);
      if(kind==="article")full.scene=payload.scene;
      var projection=kind==="article"?articleProjection(full,item):testProjection(Object.assign({},doc,{lightTest:kind==="light"?payload.test:doc.lightTest,fullTest:kind==="full"?payload.test:doc.fullTest}),kind,item,previewAnswers);
      if(!item)ephemeral(projection);
      else {
        var index=state.items.findIndex(function(row){return String(row.ID)===String(item.ID);});
        if(index>=0)state.items[index]=projection;
      }
      baseOpenUserMaterial.call(window,projection);
      var back=document.getElementById("uBackToCourse");
      if(back){
        back.textContent=item?"← Назад к курсу":"← Назад в Базу знаний";
        back.dataset.v5041Back=item?"course":"knowledge";
      }
      var viewerRole=typeof actualRole==="function"?String(actualRole()):String(state.currentRole||"");
      /* The reader already exposes the material context.  A second service
         banner was covering the article header on desktop and mobile. */
      return projection;
    } catch(error) { toast(error.message||String(error)); }
  }
  var baseBackFromUserMaterial=window.backFromUserMaterial;
  window.backFromUserMaterial=backFromUserMaterial=function(){
    if(state.materialBackView==="kb"){
      state.materialBackView=null;
      var material=document.getElementById("userMaterialView");if(material)material.classList.add("hidden");
      showUserView("kb");renderKb();return;
    }
    return baseBackFromUserMaterial.apply(this,arguments);
  };
  window.openUserMaterial=openUserMaterial=async function(item) {
    var meta=linkedMeta(item);
    if(!meta)return baseOpenUserMaterial.apply(this,arguments);
    var doc=docs.find(function(row){return Number(row.id)===Number(meta.knowledgeDocumentId);}) || await api("/api/v47/knowledge/documents/"+meta.knowledgeDocumentId);
    return openCentralForUser(doc,meta.knowledgeKind,item);
  };

  function renderUserDetail(doc, node) {
    var box=document.getElementById("kbArticlesList"),crumb=document.getElementById("kbBreadcrumbs");
    if(crumb)crumb.classList.remove("root-hidden");
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
    if(crumb)crumb.classList.toggle("root-hidden",!(state.kbSelected||(state.kbPath&&state.kbPath.length)));
    var immediateTree=usableNode(root()),immediateSelected=state.kbSelected&&findNode(state.kbSelected,immediateTree);
    if(immediateSelected&&immediateSelected.type==="material"){
      var immediateDoc=byRow(immediateSelected.row);
      if(immediateDoc)renderUserDetail(immediateDoc,immediateSelected);
    }else if(crumb)crumb.innerHTML=crumbs(state.kbPath||[],false);
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
    var generation=++adminRenderGeneration;
    await Promise.all([load(),loadDirectory()]);
    if(generation!==adminRenderGeneration||state.v540Workspace)return;
    var view=document.getElementById("adminDatabase"); if(!view)return;
    var tree=usableNode(root()),node=currentNode(adminPath);
    view.innerHTML='<div class="admin-page-head"><div><h1>Управление Базой знаний</h1><p class="muted">Источник истины: PostgreSQL · '+docs.length+' статей</p></div>'+
      '<button id="v538RefreshDirectory">Обновить из Bitrix24</button></div>'+
      '<div class="v538-directory-status">Сотрудников: <b>'+directory.users.length+'</b> · подразделений: <b>'+directory.departments.length+'</b></div>'+
      '<div class="v538-admin-search"><input id="v538AdminSearch" placeholder="Введите название документа"></div>'+
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
    if(view==="database"&&!["developer","admin","editor","moderator"].includes(String(state.currentRole||"")))return toast("Управление Базой знаний доступно редакторам, администраторам и разработчику");
    var result=baseSwitchAdmin.apply(this,arguments);
    if(view==="database"){state.aview="database";renderAdminKnowledge().catch(function(error){toast(error.message||String(error));});}
    return result;
  };
  function installDatabaseRoute() {
    var button=document.querySelector('[data-admin-view="database"]');
    if(button){var allowed=["developer","admin","editor","moderator"].includes(String(state.currentRole||""));button.hidden=!allowed;button.style.display=allowed?"":"none";button.title="Управление Базой знаний";button.onclick=function(){switchAdmin("database");};}
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
  window.openArticleEditor=openArticleEditor=async function(id){var item=findItem(id),meta=linkedMeta(item);if(!meta)return baseArticleEditor.apply(this,arguments);var doc=docs.find(function(d){return Number(d.id)===Number(meta.knowledgeDocumentId);})||await api("/api/v47/knowledge/documents/"+meta.knowledgeDocumentId);await openCentralForUser(doc,"article",item);toast("Связанная статья редактируется только через Управление Базой знаний");};
  async function previewLinkedTest(doc,kind,item){
    var payload=await api("/api/v47/knowledge/documents/"+doc.id+"/linked/"+kind+"?course_item_id="+encodeURIComponent(item.ID));
    var merged=Object.assign({},doc);
    if(kind==="light")merged.lightTest=payload.test;else merged.fullTest=payload.test;
    var projection=testProjection(merged,kind,item,true),index=state.items.findIndex(function(row){return String(row.ID)===String(item.ID);});
    if(index>=0)state.items[index]=projection;else ephemeral(projection);
    modal('<div class="v542-test-preview"><header><div><h2>'+html(projection.NAME)+'</h2><p>Предпросмотр как у ученика · правильные ответы отмечены</p></div><button type="button" data-v542-close-preview>Закрыть</button></header>'+renderTakeTest(projection)+'</div>');
    var close=document.querySelector("[data-v542-close-preview]");if(close)close.onclick=closeModal;
  }
  window.openTestEditor=openTestEditor=async function(id){var item=findItem(id),meta=linkedMeta(item);if(!meta)return baseTestEditor.apply(this,arguments);var doc=docs.find(function(d){return Number(d.id)===Number(meta.knowledgeDocumentId);})||await api("/api/v47/knowledge/documents/"+meta.knowledgeDocumentId);return previewLinkedTest(doc,meta.knowledgeKind,item);};

  var baseInlineTestEditor=window.renderInlineTestEditor;
  window.renderInlineTestEditor=function(item){
    var meta=linkedMeta(item);
    if(!meta)return baseInlineTestEditor.apply(this,arguments);
    return '<div class="inline-full-editor v538-linked-preview"><div class="inline-title">'+html(item.NAME)+'</div><div class="v538-readonly-note">Это общий тест из Базы знаний. В курсе он доступен только для просмотра, чтобы изменения не затронули другие курсы.</div><button type="button" class="primary" data-v51-open-inline-test="'+html(item.ID)+'">Просмотреть тест</button></div>';
  };

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
  window.renderProjectList=function(){
    var box=document.getElementById("projectListArticles"),q=norm(document.getElementById("projectListSearch")&&document.getElementById("projectListSearch").value);if(!box)return;
    if(!state.projectListProjectId){
      if(typeof baseRenderProjectList==="function")return baseRenderProjectList.apply(this,arguments);
      return;
    }
    var project=state.projects.find(function(p){return String(p.ID)===String(state.projectListProjectId);});
    var rows=activeRows(state.items).filter(function(item){return String(item.PROPERTY_VALUES.projectId)===String(state.projectListProjectId)&&String(item.PROPERTY_VALUES.parentId||"root")==="root"&&norm(item.NAME+" "+(item.PROPERTY_VALUES.content||"")).includes(q);});
    box.innerHTML='<div class="kb-project-head"><button id="projectListBack">← Назад</button><b>'+html(project&&project.NAME||"Проект")+'</b></div><div class="kb-doc-grid">'+rows.map(function(item){return '<div class="kb-doc-card" data-project-material="'+item.ID+'"><span class="kb-icon">'+svgIcon(item.PROPERTY_VALUES.type||"article")+'</span><div><h3>'+html(item.NAME)+'</h3><p class="muted">'+html(typeLabel(item.PROPERTY_VALUES.type))+'</p></div></div>';}).join("")+'</div>';
    document.getElementById("projectListBack").onclick=function(){state.projectListProjectId=null;window.renderProjectList();};
    box.querySelectorAll("[data-project-material]").forEach(function(b){b.onclick=function(){var item=findItem(b.dataset.projectMaterial);if(item.PROPERTY_VALUES.type==="course")openUserCourse(item);else openUserMaterial(item);};});
  };

  installDatabaseRoute();
  var baseRenderAll5038=window.renderAll;
  window.renderAll=renderAll=function(){var result=baseRenderAll5038.apply(this,arguments);installDatabaseRoute();if(!state.v540Workspace&&state.aview==="database"&&["developer","admin","editor","moderator"].includes(String(state.currentRole||"")))renderAdminKnowledge().catch(function(error){toast(error.message||String(error));});return result;};
  load().then(function(){renderKb();}).catch(console.error);
  window.addEventListener("load",installDatabaseRoute);
  window.RTMV5038={
    version:"current",
    renderAdmin:renderAdminKnowledge,
    getCurrentDocumentId:function(){return adminSelected;},
    getDocuments:function(){return docs.slice();},
    getTree:function(){return usableNode(root());},
    getDirectory:function(){return loadDirectory(false);},
    load:function(force){return load(Boolean(force)).then(function(){return {tree:usableNode(root()),documents:docs.slice()};});},
    openForUser:function(documentId,kind){var doc=docs.find(function(row){return String(row.id)===String(documentId);});return openCentralForUser(doc,kind||"article");},
    reload:function(){loaded=false;directory=null;return load(true);}
  };
})();


/* source: v5040-workspaces.js */
(function () {
  "use strict";
  var api = function (path, options) { return window.RTMV47.request(path, options); };
  var esc = function (value) { return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); };
  var host = function () { return document.getElementById("adminDatabase"); };
  var title = { article: "Статья", light: "Тест лайт", full: "Тест полный" };

  function back() {
    state.v540Workspace = "";
    var canvas = document.getElementById("v540Canvas");
    if (canvas && window.RTMCanvas) window.RTMCanvas.unmount(canvas);
    return window.RTMV5038.reload().then(function () { return window.RTMV5038.renderAdmin(); });
  }
  function shell(heading, subtitle, body, actions) {
    host().innerHTML = '<section class="v539-page v540-page"><header class="v539-page-head"><div><button id="v540Back">← Назад к Базе знаний</button><h1>'+esc(heading)+'</h1><p class="muted">'+esc(subtitle || "")+'</p></div></header>'+(actions ? '<div class="v539-sticky">'+actions+'</div>' : "")+body+'</section>';
    document.getElementById("v540Back").onclick = back;
  }
  function currentId(button) {
    var detail = button && button.closest && button.closest("[data-v538-document-id]");
    return detail && detail.dataset.v538DocumentId ||
      window.RTMV5038 && window.RTMV5038.getCurrentDocumentId && window.RTMV5038.getCurrentDocumentId();
  }
  function question(q) { return Object.assign({ id: "q_"+Date.now()+"_"+Math.random().toString(36).slice(2), type: "single", text: "", answers: ["", ""], correct: [0], pairs: [{left:"",right:""}] }, q || {}); }
  function departmentTree(items) {
    var rows=[], byParent={};
    (items || []).forEach(function(item){var parent=String(item.parentId || "");(byParent[parent]=byParent[parent]||[]).push(item);});
    function walk(parent,depth,seen){(byParent[String(parent)]||[]).forEach(function(item){if(seen[String(item.id)])return;seen[String(item.id)]=true;rows.push({item:item,depth:depth,children:(byParent[String(item.id)]||[]).length});walk(item.id,depth+1,seen);});}
    var seen={};walk("",0,seen);(items||[]).forEach(function(item){if(!seen[String(item.id)]){rows.push({item:item,depth:0,children:0});walk(item.id,1,seen);}});
    return rows;
  }

  async function article(id) {
    state.v540Workspace = "article";
    var doc = await api("/api/v47/knowledge/documents/"+id), scene = doc.scene;
    shell("Редактирование статьи", doc.title,
      '<div class="v539-form"><label>Название<input id="v540Title" value="'+esc(doc.title)+'"></label><label>Описание<textarea id="v540Description">'+esc(doc.description || "")+'</textarea></label><label>Ссылка на документ<input id="v540Url" value="'+esc(doc.documentUrl || "")+'"></label></div><div id="v540Canvas"></div>',
      '<button class="primary" id="v540Save">Сохранить изменения</button>');
    window.RTMCanvas.mount(document.getElementById("v540Canvas"), { pageKey:"knowledge-admin:"+id, scene:scene, readOnly:false, completionRequired:true, title:doc.title, brandColor:"#12b886", onChange:function(next){scene=next;}, onRequestDisk:window.RTMV46 && window.RTMV46.pickDiskMedia });
    document.getElementById("v540Save").onclick = async function () {
      this.disabled = true;
      await api("/api/v47/knowledge/documents/"+id, { method:"PUT", body:JSON.stringify({ title:document.getElementById("v540Title").value.trim(), description:document.getElementById("v540Description").value, documentUrl:document.getElementById("v540Url").value.trim(), scene:scene }) });
      toast("Статья сохранена и обновлена во всех курсах"); back();
    };
  }
  function collectQuestion(data, index) {
    var q=data.questions[index], by=function(selector){return Array.prototype.slice.call(document.querySelectorAll(selector));};
    q.text=(document.querySelector('[data-v540-text="'+index+'"]').value || "").trim();
    q.type=document.querySelector('[data-v540-type="'+index+'"]').value;
    if(q.type === "match") q.pairs=by('[data-v540-left^="'+index+'_"]').map(function(left){var n=left.dataset.v540Left.split("_")[1], right=document.querySelector('[data-v540-right="'+index+'_'+n+'"]').value;return {left:left.value,right:right};});
    else { q.answers=by('[data-v540-answer^="'+index+'_"]').map(function(input){return input.value;}); q.correct=by('[data-v540-correct^="'+index+'_"]:checked').map(function(input){return Number(input.dataset.v540Correct.split("_")[1]);}); }
  }
  async function legacyTest(id, kind) {
    var doc=await api("/api/v47/knowledge/documents/"+id), key=kind === "light" ? "lightTest" : "fullTest", data=JSON.parse(JSON.stringify(doc[key] || {}));
    data.questions=(data.questions || []).map(question);
    function draw() {
      var cards=data.questions.map(function(q,i){return '<article class="question-card"><div class="panel-head"><h3>Вопрос '+(i+1)+'</h3><select data-v540-type="'+i+'"><option value="single" '+(q.type === "single" ? "selected" : "")+'>Один ответ</option><option value="multiple" '+(q.type === "multiple" ? "selected" : "")+'>Несколько ответов</option><option value="match" '+(q.type === "match" ? "selected" : "")+'>Соответствие</option></select></div><label>Текст вопроса<input data-v540-text="'+i+'" value="'+esc(q.text)+'"></label><div class="q-options">'+window.renderQOptions(q,i).replaceAll("data-qans", "data-v540-answer").replaceAll("data-qcor", "data-v540-correct").replaceAll("data-addans", "data-v540-add-answer").replaceAll("data-delans", "data-v540-del-answer").replaceAll("data-qpair-left", "data-v540-left").replaceAll("data-qpair-right", "data-v540-right").replaceAll("data-addpair", "data-v540-add-pair").replaceAll("data-delpair", "data-v540-del-pair")+'</div><button class="danger" data-v540-delete="'+i+'">Удалить вопрос</button></article>';}).join("") || '<div class="panel">Вопросов пока нет. Добавьте первый вопрос.</div>';
      shell("Редактирование "+title[kind].toLowerCase(), doc.title, '<div class="settings-card test-settings"><label>Название теста<input id="v540TestTitle" value="'+esc(data.title || "")+'"></label></div><div class="v539-questions">'+cards+'</div>', '<button id="v540Add">Добавить вопрос</button><button class="primary" id="v540Save">Сохранить тест</button>');
      document.getElementById("v540Add").onclick=function(){collect();data.questions.push(question());draw();};
      document.querySelectorAll("[data-v540-delete]").forEach(function(button){button.onclick=function(){collect();data.questions.splice(Number(button.dataset.v540Delete),1);draw();};});
      document.querySelectorAll("[data-v540-type]").forEach(function(select){select.onchange=function(){collect();data.questions[Number(select.dataset.v540Type)].type=select.value;draw();};});
      [["[data-v540-add-answer]",function(q){q.answers=(q.answers||["",""]);q.answers.push("");}],["[data-v540-del-answer]",function(q,n){q.answers.splice(n,1);q.correct=(q.correct||[]).filter(function(v){return v!==n;});}],["[data-v540-add-pair]",function(q){q.pairs=(q.pairs||[]);q.pairs.push({left:"",right:""});}],["[data-v540-del-pair]",function(q,n){q.pairs.splice(n,1);}]].forEach(function(rule){document.querySelectorAll(rule[0]).forEach(function(button){button.onclick=function(){collect();var p=(button.dataset.v540DelAnswer || button.dataset.v540DelPair || "").split("_"), index=Number(button.closest("article").querySelector("select").dataset.v540Type);rule[1](data.questions[index], Number(p[1]));draw();};});});
      document.getElementById("v540Save").onclick=save;
    }
    function collect(){data.title=document.getElementById("v540TestTitle").value.trim();data.questions.forEach(function(_,i){collectQuestion(data,i);});}
    async function save(){collect();var payload={};payload[key]=data;await api("/api/v47/knowledge/documents/"+id,{method:"PUT",body:JSON.stringify(payload)});toast("Тест сохранён и обновлён во всех курсах");back();}
    draw();
  }
  async function test(id, kind) {
    state.v540Workspace = "test";
    var doc = await api("/api/v47/knowledge/documents/" + id);
    if (!window.RTMV51 || !window.RTMV51.openKnowledgeTest) throw new Error("Визуальный редактор тестов ещё не загрузился. Обновите страницу.");
    return window.RTMV51.openKnowledgeTest(doc, kind);
  }
  async function assignments(id, kind) {
    state.v540Workspace = "assignments";
    var doc=await api("/api/v47/knowledge/documents/"+id), directory=await api("/api/v47/knowledge/directory"), prefix=kind === "article" ? "article" : kind === "light" ? "lightTest" : "fullTest", active="students", sets={students:new Set((doc[prefix+"Assignments"]||[]).map(function(r){return r.type+":"+r.id;})),reviewers:new Set((doc[prefix+"Reviewers"]||doc.reviewers||[]).map(function(r){return r.type+":"+r.id;})),editors:new Set((doc[prefix+"Editors"]||doc.editors||[]).map(function(r){return r.type+":"+r.id;}))};
    function row(type,item,allowed,depth,children){var id=String(item.id),key=type+":"+id,style=type==="department"?' style="--tree-depth:'+(depth||0)+'"':"";return '<label class="v539-choice '+(type==="department"?"v540-department":"")+'"'+style+'><input type="checkbox" data-v540-rule="'+key+'" '+(sets[active].has(key)?"checked":"")+'><span>'+(type==="department"?'<i class="v540-tree-mark">'+(children?"▾":"└")+'</i>':"")+esc(item.name)+'</span><small>'+esc(allowed || "")+'</small></label>';}
    function draw(){var body="",people=(directory.users||[]).filter(function(user){return active === "students" ? true : active === "editors" ? user.editorAllowed : user.reviewerAllowed;});if(active === "students"){body+='<label class="v539-choice"><input type="checkbox" data-v540-rule="all_active:" '+(sets.students.has("all_active:")?"checked":"")+'><span>Все активные сотрудники</span><small>автоматически</small></label><h3>Подразделения, включая подотделы</h3><p class="v540-tree-help">Отступ показывает вложенность. Выбор отдела автоматически включает все его подотделы.</p>'+departmentTree(directory.departments).map(function(node){return row("department",node.item,node.children?"отдел и "+node.children+" подотд.":"подразделение",node.depth,node.children);}).join("")+"<h3>Сотрудники</h3>";}body+=people.map(function(user){return row("user",user,user.role);}).join("");shell("Назначения",doc.title+" · "+title[kind],'<input class="v539-search" id="v540Search" placeholder="Поиск сотрудника или подразделения"><div class="v539-tabs">'+[["students","Ученики"],["reviewers","Проверяющие"],["editors","Редакторы"]].map(function(tab){return '<button data-v540-tab="'+tab[0]+'" class="'+(active===tab[0]?"active":"")+'">'+tab[1]+' <b>'+sets[tab[0]].size+'</b></button>';}).join("")+'</div><div class="v539-choices">'+body+'</div>'+(kind === "article" ? '<label class="v539-inherit"><input id="v540Inherit" type="checkbox" '+(doc.inheritTestAssignments?"checked":"")+'> После сохранения применить назначения статьи к обоим тестам</label>' : ""),'<button class="primary" id="v540Save">Сохранить назначения</button>');
      document.querySelectorAll("[data-v540-tab]").forEach(function(button){button.onclick=function(){active=button.dataset.v540Tab;draw();};});document.querySelectorAll("[data-v540-rule]").forEach(function(input){input.onchange=function(){input.checked?sets[active].add(input.dataset.v540Rule):sets[active].delete(input.dataset.v540Rule);};});document.getElementById("v540Search").oninput=function(){var query=this.value.toLowerCase();document.querySelectorAll(".v539-choice").forEach(function(choice){choice.hidden=query && !choice.textContent.toLowerCase().includes(query);});};document.getElementById("v540Save").onclick=save;
    }
    async function save(){var payload={}, rules=function(name){return Array.from(sets[name]).map(function(value){var part=value.split(":");return {type:part.shift(),id:part.join(":")};});};payload[prefix+"Assignments"]=rules("students");payload[prefix+"Reviewers"]=rules("reviewers");payload[prefix+"Editors"]=rules("editors");if(kind === "article")payload.inheritTestAssignments=document.getElementById("v540Inherit").checked;await api("/api/v47/knowledge/documents/"+id,{method:"PUT",body:JSON.stringify(payload)});toast("Назначения сохранены");back();}
    draw();
  }
  document.addEventListener("click", function (event) {
    var target=event.target,button=target&&target.closest&&target.closest("[data-v538-edit-article],[data-v538-edit-test],[data-v538-assign],[data-v538-create-test]");if(!button)return;
    var id=currentId(button);if(!id)return;
    event.preventDefault();event.stopImmediatePropagation();
    var kind=button.dataset.v538EditTest || button.dataset.v538Assign || button.dataset.v538CreateTest;
    if(button.dataset.v538CreateTest){api("/api/v47/knowledge/documents/"+id+"/tests/"+kind,{method:"POST",body:"{}"}).then(function(){return test(id,kind);}).catch(function(error){toast(error.message||String(error));});}
    else if(button.dataset.v538EditArticle !== undefined)article(id).catch(function(error){
      state.v540Workspace="";
      toast(error.message||String(error));
    });
    else if(button.dataset.v538EditTest)test(id,kind).catch(function(error){
      state.v540Workspace="";
      toast(error.message||String(error));
    });
    else assignments(id,kind).catch(function(error){state.v540Workspace="";toast(error.message||String(error));});
  }, true);

  var baseRenderAllV540=window.renderAll;
  window.renderAll=renderAll=function(){
    if(state.v540Workspace)return;
    return baseRenderAllV540.apply(this,arguments);
  };

  (function installColorTheme(){
    var key="rtm_color_theme";
    function systemTheme(){return window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}
    function apply(value){
      var theme=value==="dark"?"dark":"light";
      document.documentElement.dataset.rtmTheme=theme;
      document.documentElement.style.colorScheme=theme;
      try{localStorage.setItem(key,theme);}catch(_){}
      var meta=document.querySelector('meta[name="color-scheme"]');if(meta)meta.setAttribute("content",theme);
      document.querySelectorAll(".theme-btn").forEach(function(button){button.textContent=theme==="dark"?"☀":"☾";button.title=theme==="dark"?"Включить светлую тему":"Включить тёмную тему";button.setAttribute("aria-label",button.title);button.setAttribute("aria-pressed",String(theme==="dark"));});
      window.dispatchEvent(new CustomEvent("rtm-theme-change",{detail:{theme:theme}}));
    }
    function bind(){document.querySelectorAll(".theme-btn").forEach(function(button){if(button.dataset.rtmThemeBound)return;button.dataset.rtmThemeBound="1";button.onclick=function(){apply(document.documentElement.dataset.rtmTheme==="dark"?"light":"dark");};});}
    var saved="";try{saved=localStorage.getItem(key)||"";}catch(_){}
    apply(saved||systemTheme());bind();
    new MutationObserver(bind).observe(document.documentElement,{childList:true,subtree:true});
    var academy=document.querySelector('[data-admin-view="materials"]');if(academy)academy.title="Академия";
    window.RTMTheme={apply:apply,current:function(){return document.documentElement.dataset.rtmTheme;}};
  })();
})();


/* source: v5041.js */
/* RTM v50.4.1: analytics controls, navigation and theme finalizer. */
(function () {
  "use strict";
  var VERSION = String(window.__RTM_VERSION__ || "50.4.3");
  var filters = {query:"", department:"all", from:""};

  function text(value){return String(value == null ? "" : value);}
  function activeRows(){return Array.from(document.querySelectorAll("#analyticsContent table tbody tr"));}
  function descendants(id){
    var found=new Set([String(id)]), changed=true;
    while(changed){changed=false;(state.departments||[]).forEach(function(row){
      var parent=String(row.UF_PARENT_SECTION || row.PARENT_ID || row.parentId || "");
      if(found.has(parent)&&!found.has(String(row.ID))){found.add(String(row.ID));changed=true;}
    });}
    return found;
  }
  function allowedUsers(){
    if(filters.department==="all")return null;
    var ids=descendants(filters.department), names=new Set();
    (state.users||[]).forEach(function(user){
      var depts=user.UF_DEPARTMENT||[];if(!Array.isArray(depts))depts=[depts];
      if(depts.some(function(id){return ids.has(String(id));}))names.add(text(fullName(user)).toLowerCase());
    });
    return names;
  }
  function rowDate(row,tab){
    if(tab==="events"){
      var value=text(row.cells[0]&&row.cells[0].textContent), match=value.match(/(\d{2})\.(\d{2})\.(\d{4})/);
      return match?match[3]+"-"+match[2]+"-"+match[1]:"";
    }
    var value=text(row.textContent).toLowerCase(), dates=(state.events||[]).filter(function(event){
      var props=event.PROPERTY_VALUES||{};
      return value.includes(text(eventUserName(event)).toLowerCase())||value.includes(text(props.targetName).toLowerCase());
    }).map(function(event){return text((event.PROPERTY_VALUES||{}).createdAt).slice(0,10);}).filter(Boolean).sort();
    return dates[dates.length-1]||"";
  }
  function apply(){
    var query=filters.query.toLowerCase(), tab=state.analyticsTab||"overview", users=allowedUsers();
    activeRows().forEach(function(row){
      var content=text(row.textContent).toLowerCase(), date=rowDate(row,tab), visible=!query||content.includes(query);
      if(visible&&users&&(tab==="users"||tab==="top"||tab==="events")){
        visible=Array.from(users).some(function(name){return name&&content.includes(name);});
      }
      if(visible&&users&&(tab==="materials"||tab==="kb")){
        visible=(state.events||[]).some(function(event){
          var props=event.PROPERTY_VALUES||{}, target=text(props.targetName).toLowerCase();
          return target&&content.includes(target)&&users.has(text(eventUserName(event)).toLowerCase());
        });
      }
      if(visible&&filters.from)visible=Boolean(date&&date>=filters.from);
      row.hidden=!visible;
    });
  }
  function csv(){
    var table=document.querySelector("#analyticsContent table");if(!table)return;
    var rows=[Array.from(table.querySelectorAll("thead th")).map(function(cell){return text(cell.textContent).trim();})]
      .concat(activeRows().filter(function(row){return !row.hidden;}).map(function(row){return Array.from(row.cells).map(function(cell){return text(cell.textContent).trim();});}));
    var value="\ufeff"+rows.map(function(row){return row.map(function(cell){return '"'+cell.replace(/"/g,'""')+'"';}).join(";");}).join("\n");
    var link=document.createElement("a");link.href=URL.createObjectURL(new Blob([value],{type:"text/csv;charset=utf-8"}));
    link.download="rtm_"+(state.analyticsTab||"analytics")+"_"+new Date().toISOString().slice(0,10)+".csv";link.click();
    setTimeout(function(){URL.revokeObjectURL(link.href);},500);
  }
  function enhance(){
    var root=document.getElementById("analyticsContent"), search=document.getElementById("analyticsSearch");
    if(!root||!search)return;
    var dept=document.getElementById("analyticsDept"), from=document.getElementById("analyticsPeriod"), report=document.getElementById("analyticsExportBtn");
    search.value=filters.query;if(dept)dept.value=filters.department;if(from)from.value=filters.from;
    search.oninput=function(){filters.query=search.value;apply();};
    if(dept)dept.onchange=function(){filters.department=dept.value;apply();};
    if(from)from.onchange=function(){filters.from=from.value;apply();};
    if(report)report.onclick=csv;
    apply();
  }
  var baseRender=window.renderAnalytics;
  if(typeof baseRender==="function")window.renderAnalytics=renderAnalytics=function(){
    var result=baseRender.apply(this,arguments);setTimeout(enhance,0);return result;
  };
  var baseBind=window.bindAnalyticsTools;
  if(typeof baseBind==="function")window.bindAnalyticsTools=bindAnalyticsTools=function(){setTimeout(enhance,0);};

  document.addEventListener("click",function(event){
    var back=event.target.closest&&event.target.closest("#uBackToCourse[data-v5041-back='knowledge']");
    if(back){
      event.preventDefault();event.stopImmediatePropagation();
      state.materialBackView=null;
      var material=document.getElementById("userMaterialView");if(material)material.classList.add("hidden");
      showUserView("kb");renderKb();
    }
  },true);

  function finishTheme(){
    VERSION=String(window.__RTM_VERSION__ || VERSION);
    document.documentElement.style.minHeight="100%";
    document.body.style.minHeight="100%";
    document.querySelectorAll(".v39-version-label").forEach(function(node){
      var expected=node.classList.contains("v39-admin-version")?"v"+VERSION:"Версия v"+VERSION;
      if(node.textContent!==expected)node.textContent=expected;
    });
  }
  finishTheme();
  window.RTMV5041={version:VERSION,enhanceAnalytics:enhance};
})();


/* source: v5042.js */
/* RTM current release marker and theme authority. */
(function(){
  "use strict";
  var VERSION=String(window.__RTM_VERSION__ || "50.4.3");
  function finalize(){
    document.documentElement.style.colorScheme=document.documentElement.dataset.rtmTheme==="dark"?"dark":"light";
    document.querySelectorAll(".v39-version-label").forEach(function(node){
      var expected=node.classList.contains("v39-admin-version")?"v"+VERSION:"Версия v"+VERSION;
      if(node.textContent!==expected)node.textContent=expected;
    });
  }
  finalize();
  window.addEventListener("rtm-theme-change",finalize);
  window.RTMV5042={version:VERSION};
})();
