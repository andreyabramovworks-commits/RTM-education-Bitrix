(function () {
  "use strict";
  var api = function (path, options) { return window.RTMV47.request(path, options); };
  var esc = function (value) { return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); };
  var host = function () { return document.getElementById("adminDatabase"); };
  var title = { article: "Статья", light: "Тест лайт", full: "Тест полный" };

  function back() {
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

  async function article(id) {
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
    var doc = await api("/api/v47/knowledge/documents/" + id);
    if (!window.RTMV51 || !window.RTMV51.openKnowledgeTest) throw new Error("Визуальный редактор тестов ещё не загрузился. Обновите страницу.");
    return window.RTMV51.openKnowledgeTest(doc, kind);
  }
  async function assignments(id, kind) {
    var doc=await api("/api/v47/knowledge/documents/"+id), directory=await api("/api/v47/knowledge/directory"), prefix=kind === "article" ? "article" : kind === "light" ? "lightTest" : "fullTest", active="students", sets={students:new Set((doc[prefix+"Assignments"]||[]).map(function(r){return r.type+":"+r.id;})),reviewers:new Set((doc[prefix+"Reviewers"]||doc.reviewers||[]).map(function(r){return r.type+":"+r.id;})),editors:new Set((doc[prefix+"Editors"]||doc.editors||[]).map(function(r){return r.type+":"+r.id;}))};
    function row(type,item,allowed){var id=String(item.id),key=type+":"+id;return '<label class="v539-choice"><input type="checkbox" data-v540-rule="'+key+'" '+(sets[active].has(key)?"checked":"")+'><span>'+esc(item.name)+'</span><small>'+esc(allowed || "")+'</small></label>';}
    function draw(){var body="",people=(directory.users||[]).filter(function(user){return active === "students" || user.reviewerAllowed;});if(active === "students"){body+='<label class="v539-choice"><input type="checkbox" data-v540-rule="all_active:" '+(sets.students.has("all_active:")?"checked":"")+'><span>Все активные сотрудники</span><small>автоматически</small></label><h3>Подразделения, включая подотделы</h3>'+(directory.departments||[]).map(function(department){return row("department",department,"отдел");}).join("")+"<h3>Сотрудники</h3>";}body+=people.map(function(user){return row("user",user,user.role);}).join("");shell("Назначения",doc.title+" · "+title[kind],'<input class="v539-search" id="v540Search" placeholder="Поиск сотрудника или подразделения"><div class="v539-tabs">'+[["students","Ученики"],["reviewers","Проверяющие"],["editors","Редакторы"]].map(function(tab){return '<button data-v540-tab="'+tab[0]+'" class="'+(active===tab[0]?"active":"")+'">'+tab[1]+' <b>'+sets[tab[0]].size+'</b></button>';}).join("")+'</div><div class="v539-choices">'+body+'</div>'+(kind === "article" ? '<label class="v539-inherit"><input id="v540Inherit" type="checkbox" '+(doc.inheritTestAssignments?"checked":"")+'> После сохранения применить назначения статьи к обоим тестам</label>' : ""),'<button class="primary" id="v540Save">Сохранить назначения</button>');
      document.querySelectorAll("[data-v540-tab]").forEach(function(button){button.onclick=function(){active=button.dataset.v540Tab;draw();};});document.querySelectorAll("[data-v540-rule]").forEach(function(input){input.onchange=function(){input.checked?sets[active].add(input.dataset.v540Rule):sets[active].delete(input.dataset.v540Rule);};});document.getElementById("v540Search").oninput=function(){var query=this.value.toLowerCase();document.querySelectorAll(".v539-choice").forEach(function(choice){choice.hidden=query && !choice.textContent.toLowerCase().includes(query);});};document.getElementById("v540Save").onclick=save;
    }
    async function save(){var payload={}, rules=function(name){return Array.from(sets[name]).map(function(value){var part=value.split(":");return {type:part.shift(),id:part.join(":")};});};payload[prefix+"Assignments"]=rules("students");payload[prefix+"Reviewers"]=rules("reviewers");payload[prefix+"Editors"]=rules("editors");if(kind === "article")payload.inheritTestAssignments=document.getElementById("v540Inherit").checked;await api("/api/v47/knowledge/documents/"+id,{method:"PUT",body:JSON.stringify(payload)});toast("Назначения сохранены");back();}
    draw();
  }
  document.addEventListener("click", function (event) {
    var button=event.target.closest("[data-v538-edit-article],[data-v538-edit-test],[data-v538-assign],[data-v538-create-test]");if(!button)return;
    var id=currentId(button);if(!id)return;
    event.preventDefault();event.stopImmediatePropagation();
    var kind=button.dataset.v538EditTest || button.dataset.v538Assign || button.dataset.v538CreateTest;
    if(button.dataset.v538CreateTest){api("/api/v47/knowledge/documents/"+id+"/tests/"+kind,{method:"POST",body:"{}"}).then(function(){return test(id,kind);}).catch(function(error){toast(error.message||String(error));});}
    else if(button.dataset.v538EditArticle !== undefined)article(id).catch(function(error){toast(error.message||String(error));});
    else if(button.dataset.v538EditTest)test(id,kind).catch(function(error){toast(error.message||String(error));});
    else assignments(id,kind).catch(function(error){toast(error.message||String(error));});
  }, true);
})();
