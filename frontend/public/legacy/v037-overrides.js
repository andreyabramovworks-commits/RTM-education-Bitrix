(function(){
state.kbPath=[];
state.kbSelected=null;
state.projectListProjectId=null;
state.bitrixAdmin=!!state.bitrixAdmin;
state.rtmRouted=false;

function rtmCanonicalUserId(uid){
  var id=String(uid==null?'':uid);
  if(id==='0'){
    var owner=state.users.find(function(u){return String(u.ID||u.id)==='36'});
    if(owner||String(currentUserId())==='36'||String(effectiveUserId())==='36')return '36';
  }
  return id;
}
function rtmCompletedRows(uid){
  var wanted=rtmCanonicalUserId(uid), seen=new Set();
  return state.progress.filter(function(p){
    return rtmCanonicalUserId(p.PROPERTY_VALUES&&p.PROPERTY_VALUES.userId)===wanted&&p.PROPERTY_VALUES&&p.PROPERTY_VALUES.status==='completed';
  }).filter(function(p){
    var key=String(p.PROPERTY_VALUES&&p.PROPERTY_VALUES.targetId);
    if(seen.has(key))return false;
    seen.add(key);
    return true;
  });
}
function rtmAllLeaderboardRows(){
  var ids=new Set();
  state.users.forEach(function(u){ids.add(rtmCanonicalUserId(u.ID||u.id))});
  state.progress.forEach(function(p){ids.add(rtmCanonicalUserId(p.PROPERTY_VALUES&&p.PROPERTY_VALUES.userId))});
  return Array.from(ids).filter(Boolean).map(function(uid){
    var u=userById(uid);
    var rows=rtmCompletedRows(uid);
    return {uid:uid,name:u?fullName(u):userDisplayById(uid),points:rows.reduce(function(sum,p){return sum+targetPoints(p.PROPERTY_VALUES&&p.PROPERTY_VALUES.targetId)},0),done:rows.length};
  }).filter(function(r){return r.name&&r.name!=='ID '}).sort(function(a,b){
    return b.points-a.points||b.done-a.done||a.name.localeCompare(b.name,'ru');
  });
}

userIdAliases=function(uid){return new Set([rtmCanonicalUserId(uid)])};
userCompletedRows=function(uid){return rtmCompletedRows(uid)};
userPoints=function(uid){return rtmCompletedRows(uid==null?effectiveUserId():uid).reduce(function(sum,p){return sum+targetPoints(p.PROPERTY_VALUES&&p.PROPERTY_VALUES.targetId)},0)};
leaderboardRows=function(){return rtmAllLeaderboardRows().slice(0,10)};
currentProgressUserIds=function(){
  var id=rtmCanonicalUserId(effectiveUserId());
  var out=new Set([id]);
  if(id==='36')out.add('0');
  return out;
};
testAttemptsUsed=function(tid){
  var uid=rtmCanonicalUserId(effectiveUserId());
  return state.attempts.filter(function(a){
    return String(a.PROPERTY_VALUES&&a.PROPERTY_VALUES.testId)===String(tid)&&rtmCanonicalUserId(a.PROPERTY_VALUES&&a.PROPERTY_VALUES.userId)===uid;
  }).length;
};

isBitrixAdmin=function(u){
  return !!(state.bitrixAdmin&&u&&String(u.ID||u.id)===String(currentUserId()));
};
getAppRole=function(u){
  if(!u)return 'employee';
  if(isBitrixAdmin(u))return 'admin';
  var userId=String(u.ID||u.id||'0');
  var saved=state.roles.find(function(r){return String(r.PROPERTY_VALUES&&r.PROPERTY_VALUES.userId)===userId});
  return saved&&saved.PROPERTY_VALUES&&saved.PROPERTY_VALUES.role||'employee';
};
applyAccess=function(){
  var role=getAppRole(state.user);
  state.currentRole=role;
  var canAdmin=role==='admin'||role==='moderator';
  var btn=$('#modeSwitch');
  if(btn){
    btn.style.display=canAdmin?'inline-flex':'none';
    btn.hidden=!canAdmin;
    btn.disabled=!canAdmin;
  }
  if(!canAdmin&&state.mode==='admin'){
    state.mode='user';
    $('#userApp')&&$('#userApp').classList.add('active');
    $('#adminApp')&&$('#adminApp').classList.remove('active');
    var nav=$('#userNav'); if(nav)nav.style.display='flex';
  }
};

function rtmSyncNotice(show,text){
  var old=$('#rtmSyncNotice');
  if(!show){if(old)old.remove();return}
  if(!old){old=document.createElement('div');old.id='rtmSyncNotice';old.className='sync-notice';document.body.appendChild(old)}
  old.textContent=text||'Синхронизация...';
}
updateSyncButton=function(){
  var b=$('#globalSyncBtn');
  if(!b)return;
  b.textContent=(state.syncing&&state.rtmManualSync)?'Синхронизация...':(state.lastSyncAt?'Синхронизация '+new Date(state.lastSyncAt).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'}):'Синхронизация');
  b.disabled=!!(state.syncing&&state.rtmManualSync);
};
ensureOnce=async function(){
  if(schemaChecked||localStorage.getItem('rtm_obuchenie_schema_v026')==='ok'){schemaChecked=true;return}
  await ensureAll();
  schemaChecked=true;
  localStorage.setItem('rtm_obuchenie_schema_v026','ok');
};
writeCache=function(){
  try{localStorage.setItem(RTM_CACHE_KEY,JSON.stringify(snapshotData()))}catch(e){console.warn('cache write failed',e)}
};
persistNow=async function(){writeCache()};
loadAll=async function(manual){
  manual=!!manual;
  if(state.syncing)return;
  state.syncing=true;
  state.rtmManualSync=manual;
  updateSyncButton();
  if(manual)rtmSyncNotice(true,'Синхронизация...');
  try{
    await ensureOnce();
    var local=readCache();
    var loaded=await Promise.all([get(E.projects),get(E.items),get(E.assigns),get(E.progress),get(E.events),get(E.attempts),get(E.roles),getUsersAll(),getDepartmentsAll()]);
    state.projects=mergeById(loaded[0],local.projects);
    state.items=mergeById(loaded[1],local.items);
    state.assigns=mergeById(loaded[2],local.assigns);
    state.progress=mergeById(loaded[3],local.progress);
    state.events=mergeById(loaded[4],local.events);
    state.attempts=mergeById(loaded[5],local.attempts);
    state.roles=mergeById(loaded[6],local.roles);
    state.users=loaded[7]||[];
    state.departments=loaded[8]||[];
    if(!state.users.length&&currentUserId()!=='0')state.users=[safeUser()];
    if(!state.projects.length){
      await seed();
      var seeded=await Promise.all([get(E.projects),get(E.items),get(E.assigns),get(E.progress),get(E.events),get(E.attempts)]);
      state.projects=seeded[0];state.items=seeded[1];state.assigns=seeded[2];state.progress=seeded[3];state.events=seeded[4];state.attempts=seeded[5];
    }
    if(!state.projectId||!activeRows(state.projects).some(function(p){return String(p.ID)===String(state.projectId)}))state.projectId=(activeRows(state.projects)[0]||{}).ID||'trash';
    applyAccess();
    writeCache();
    renderAll();
    if(!state.rtmRouted){state.rtmRouted=true;routeDeepLink()}
  }catch(e){
    console.error(e);
    applyAccess();
    try{renderAll()}catch(renderError){console.warn(renderError)}
    if(manual)toast('Синхронизация не выполнена: '+e.message);
  }finally{
    state.lastSyncAt=now();
    state.syncing=false;
    state.rtmManualSync=false;
    applyAccess();
    updateSyncButton();
    if(manual){rtmSyncNotice(true,'Синхронизация завершена');setTimeout(function(){rtmSyncNotice(false)},1300)}
  }
};

renderTakeTest=function(t){
  var meta=testDefaults(j(t.PROPERTY_VALUES.meta)), raw=meta.questions||[], attempts=testAttemptsUsed(t.ID), left=Math.max(0,meta.attemptsLimit-attempts);
  if(left<=0)return '<div class="test-intro-card"><h3>'+esc(t.NAME)+'</h3><p class="muted">Попытки закончились</p><button data-test-close-course>Закрыть</button></div>';
  var questions=meta.shuffleQuestions?shuffleCopy(raw).map(function(x){return {q:x.v,orig:x.i}}):raw.map(function(q,i){return {q:q,orig:i}});
  return '<form class="take-test-card" data-take-test="'+t.ID+'" data-test-start="'+Date.now()+'"><h3>'+esc(t.NAME)+'</h3><div class="test-meta-grid"><span>Порог: '+meta.passScore+'%</span><span>Попыток осталось: '+left+'</span><span>Время: '+(meta.timeLimit?meta.timeLimit+' мин':'без ограничения')+'</span></div>'+questions.map(function(row,qi){
    var q=row.q, answers=(q.answers||[]).map(function(a,ai){return {a:a,ai:ai}});
    if(meta.shuffleAnswers)answers=shuffleCopy(q.answers||[]).map(function(x){return {a:x.v,ai:x.i}});
    return '<div class="test-question"><b>'+(qi+1)+'. '+esc(q.text)+'</b>'+answers.map(function(x){return '<label class="answer"><input type="checkbox" name="t'+t.ID+'q'+row.orig+'" value="'+x.ai+'">'+esc(x.a)+'</label>'}).join('')+'</div>';
  }).join('')+'<button class="primary">Ответить</button></form>';
};
renderUserTestIntro=function(t){
  var meta=testDefaults(j(t.PROPERTY_VALUES.meta)), attempts=testAttemptsUsed(t.ID), left=Math.max(0,meta.attemptsLimit-attempts), uid=rtmCanonicalUserId(effectiveUserId());
  var best=state.attempts.filter(function(a){return String(a.PROPERTY_VALUES&&a.PROPERTY_VALUES.testId)===String(t.ID)&&rtmCanonicalUserId(a.PROPERTY_VALUES&&a.PROPERTY_VALUES.userId)===uid&&String(a.PROPERTY_VALUES&&a.PROPERTY_VALUES.passed)==='Y'}).map(function(a){return +a.PROPERTY_VALUES.score}).filter(function(n){return !isNaN(n)}).sort(function(a,b){return b-a})[0];
  return '<div class="test-intro-card"><h2>'+esc(t.NAME)+'</h2><div class="test-info-grid"><span>⏱ '+(meta.timeLimit?meta.timeLimit+' мин':'Без ограничения')+'</span><span>↻ '+left+' попыток</span><span>Порог: '+meta.passScore+'%</span><span>★ '+(best==null?'—':best+'%')+'</span><span>'+meta.points+' очков</span></div><button class="primary" data-start-user-test="'+t.ID+'" '+(left<=0?'disabled':'')+'>Приступить</button></div>';
};
function rtmReturnFromTest(t){
  var parent=t&&t.PROPERTY_VALUES&&t.PROPERTY_VALUES.parentId;
  closeModal();
  if(parent&&findItem(parent))openUserCourse(findItem(parent));else backFromUserMaterial();
}
function rtmBindTestForm(){
  $$('[data-take-test]').forEach(function(f){f.onsubmit=takeTestSubmit});
  $$('[data-test-close-course]').forEach(function(b){b.onclick=function(){rtmReturnFromTest(findItem(state.testId))}});
}
takeTestSubmit=async function(e){
  e.preventDefault();
  var form=e.currentTarget;
  var tid=form.dataset.takeTest, t=findItem(tid);
  if(!t)return;
  var meta=testDefaults(j(t.PROPERTY_VALUES.meta)), qs=meta.questions||[], good=0;
  qs.forEach(function(q,qi){
    var selected=Array.from(form.querySelectorAll('[name="t'+tid+'q'+qi+'"]:checked')).map(function(x){return +x.value}).sort(function(a,b){return a-b}).join(',');
    var correct=(q.correct||[]).slice().sort(function(a,b){return a-b}).join(',');
    if(selected===correct)good++;
  });
  var score=qs.length?Math.round(good/qs.length*100):0, passed=score>=meta.passScore;
  var props={courseId:String(state.courseId||t.PROPERTY_VALUES.parentId||''),testId:String(tid),userId:rtmCanonicalUserId(effectiveUserId()),score:String(score),passed:passed?'Y':'N',createdAt:now()};
  var aid=await add(E.attempts,'Попытка теста',props);
  state.attempts.unshift({ID:String(aid),NAME:'Попытка теста',PROPERTY_VALUES:props,DATE_CREATE:props.createdAt});
  writeCache();
  if(passed)await complete(tid,'test');
  var left=Math.max(0,meta.attemptsLimit-testAttemptsUsed(tid));
  if(passed){
    modal('<div class="test-outcome ok"><h2>Тест пройден</h2><p>Правильных ответов: <b>'+good+' из '+qs.length+'</b></p><p>Результат: <b>'+score+'%</b></p><button class="primary" id="testOutcomeClose">Закрыть</button></div>');
    $('#testOutcomeClose').onclick=function(){rtmReturnFromTest(t)};
  }else{
    modal('<div class="test-outcome bad"><h2>Тест не пройден</h2><p>Правильных ответов: <b>'+good+' из '+qs.length+'</b></p><p>Попыток осталось: <b>'+left+'</b></p><div class="inline-actions"><button class="primary" id="testOutcomeRetry" '+(left<=0?'disabled':'')+'>Начать заново</button><button id="testOutcomeClose">Закрыть</button></div></div>');
    $('#testOutcomeClose').onclick=function(){rtmReturnFromTest(t)};
    var retry=$('#testOutcomeRetry');
    if(retry)retry.onclick=function(){closeModal();$('#uMaterialBody').innerHTML=renderTakeTest(t);rtmBindTestForm()};
  }
  renderProfile();
};

isUsefulArticleHtml=function(v){var raw=String(v||'');if(/<(iframe|video|audio|source)\b/i.test(raw))return true;var text=strip(raw).replace(/\s+/g,' ').trim();return !!text&&text.toLowerCase()!=='новая страница'};

articleHtmlFromItem=function(m){
  if(!m)return '';
  var props=m.PROPERTY_VALUES||{}, meta=metaObj(props.meta), pages=[];
  if(Array.isArray(meta.pages))pages=meta.pages.map(function(p){return unwrapTextValue(p&&(p.html||p.HTML||p.content||p.text||p.body||p.value))}).filter(isUsefulArticleHtml);
  if(pages.length)return pages.map(plainToHtml).join('<hr>');
  var direct=[props.content,props.html,props.text,props.body,meta.content,meta.html,meta.text,meta.body].map(unwrapTextValue).filter(isUsefulArticleHtml);
  return direct.length?plainToHtml(direct[0]):'';
};
materialReaderHtml=function(m){
  var source=richestArticleItem(m), editorHtml=String(state.articleId||'')===String(m&&m.ID||'')?$('#articleContentEditable')&&$('#articleContentEditable').innerHTML:'';
  if(isUsefulArticleHtml(editorHtml))return plainToHtml(editorHtml);
  var html=articleHtmlFromItem(source);
  if(isUsefulArticleHtml(html))return html;
  return '<div class="article-empty"><b>Содержимое материала пока не заполнено.</b></div>';
};

analyticsRows=function(){
  var materials=activeRows(state.items).filter(function(i){return !['folder','section'].includes(i.PROPERTY_VALUES&&i.PROPERTY_VALUES.type)});
  var userMap=new Map();
  state.users.forEach(function(u){var id=rtmCanonicalUserId(u.ID);if(id&&!userMap.has(id))userMap.set(id,u)});
  var userRows=Array.from(userMap.entries()).map(function(pair){
    var uid=pair[0],u=pair[1];
    var assigned=state.assigns.filter(function(a){return rtmCanonicalUserId(a.PROPERTY_VALUES&&a.PROPERTY_VALUES.userId)===uid}).length;
    var done=rtmCompletedRows(uid).length, inwork=Math.max(0,assigned-done), pct=assigned?Math.round(done/assigned*100):0;
    return {u:u,assigned:assigned,done:done,failed:0,inwork:inwork,notStarted:Math.max(0,assigned-done-inwork),pct:pct,points:userPoints(uid)};
  });
  var materialRows=materials.map(function(m){
    var mid=String(m.ID),assigned=state.assigns.filter(function(a){return String(a.PROPERTY_VALUES&&a.PROPERTY_VALUES.targetId)===mid||String(a.PROPERTY_VALUES&&a.PROPERTY_VALUES.targetId)===String(m.PROPERTY_VALUES&&m.PROPERTY_VALUES.parentId)}).length;
    var done=state.progress.filter(function(p){return String(p.PROPERTY_VALUES&&p.PROPERTY_VALUES.targetId)===mid&&p.PROPERTY_VALUES.status==='completed'}).length,inwork=Math.max(0,assigned-done);
    return {m:m,assigned:assigned,done:done,failed:0,inwork:inwork,notStarted:Math.max(0,assigned-done-inwork),pct:assigned?Math.round(done/assigned*100):0};
  });
  return {materials:materials,userRows:userRows,materialRows:materialRows};
};
renderAnalyticsTop=function(root){
  var rows=rtmAllLeaderboardRows();
  root.innerHTML=analyticsTopbar('Поиск по пользователям (имя или email)')+'<div class="table-card"><table class="admin-table"><thead><tr><th>Место</th><th>Пользователь</th><th>Очки</th><th>Пройдено</th></tr></thead><tbody>'+rows.map(function(r,i){return '<tr><td>'+(i+1)+'</td><td>'+esc(r.name)+'</td><td>'+r.points+'</td><td>'+r.done+'</td></tr>'}).join('')+'</tbody></table></div>';
  bindAnalyticsTools(function(){renderAnalyticsTop(root)});
};

function rtmKbRoot(){return window.RTM_KB_DATA&&window.RTM_KB_DATA.tree||{id:'root',title:'База знаний',children:[]}}
function rtmKbCurrent(){
  var node=rtmKbRoot();
  state.kbPath.forEach(function(id){var next=(node.children||[]).find(function(x){return x.type==='folder'&&x.id===id});if(next)node=next});
  return node;
}
function rtmKbCount(node){
  return (node.children||[]).reduce(function(sum,x){return sum+(x.type==='material'?1:rtmKbCount(x))},0);
}
function rtmKbAllMaterials(node,out){
  out=out||[];
  (node.children||[]).forEach(function(x){if(x.type==='material')out.push(x);else rtmKbAllMaterials(x,out)});
  return out;
}
function rtmKbFind(id,node){
  node=node||rtmKbRoot();
  if(node.id===id)return node;
  for(var i=0;i<(node.children||[]).length;i++){var found=rtmKbFind(id,node.children[i]);if(found)return found}
  return null;
}
function rtmKbBreadcrumbs(){
  var names=[{id:'root',title:'База знаний'}],node=rtmKbRoot();
  state.kbPath.forEach(function(id){var next=(node.children||[]).find(function(x){return x.id===id});if(next){names.push({id:id,title:next.title});node=next}});
  return names;
}
function rtmKbCard(x){
  if(x.type==='folder')return '<button class="kb-tree-card folder" data-kb-folder="'+x.id+'"><span class="kb-tree-icon">'+svgIcon('folder')+'</span><span><b>'+esc(x.title)+'</b><small>'+rtmKbCount(x)+' материалов</small></span><i>›</i></button>';
  return '<button class="kb-tree-card material" data-kb-material="'+x.id+'"><span class="kb-tree-icon">'+svgIcon('article')+'</span><span><b>'+esc(x.title)+'</b><small>Материал</small></span><i>›</i></button>';
}
function rtmRenderKbDetail(item){
  var box=$('#kbArticlesList'),crumb=$('#kbBreadcrumbs');
  if(crumb)crumb.innerHTML='<button data-kb-detail-back>← Назад</button>';
  box.innerHTML='<div class="kb-detail"><span class="pill mint">Материал</span><h1>'+esc(item.title)+'</h1>'+(item.description?'<p>'+esc(item.description)+'</p>':'')+'<div class="kb-open-actions">'+item.urls.map(function(url,i){return '<a class="primary kb-open-link" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">Открыть материал'+(item.urls.length>1?' '+(i+1):'')+'</a>'}).join('')+'</div></div>';
  $('[data-kb-detail-back]').onclick=function(){state.kbSelected=null;renderKb()};
}
renderKb=function(){
  var box=$('#kbArticlesList'),crumb=$('#kbBreadcrumbs');
  if(!box)return;
  if(state.kbSelected){var selected=rtmKbFind(state.kbSelected);if(selected){rtmRenderKbDetail(selected);return}state.kbSelected=null}
  var q=($('#kbSearch')&&$('#kbSearch').value||'').trim().toLowerCase();
  if(q){
    var matches=rtmKbAllMaterials(rtmKbRoot()).filter(function(x){return (x.title+' '+x.description).toLowerCase().includes(q)});
    if(crumb)crumb.innerHTML='<button data-kb-root>База знаний</button><span>Результаты поиска</span>';
    box.innerHTML=matches.map(rtmKbCard).join('')||'<div class="panel">Ничего не найдено</div>';
  }else{
    var node=rtmKbCurrent(),bc=rtmKbBreadcrumbs();
    if(crumb)crumb.innerHTML=bc.map(function(x,i){return '<button data-kb-crumb="'+i+'">'+esc(x.title)+'</button>'+(i<bc.length-1?'<span>›</span>':'')}).join('');
    box.innerHTML=(node.children||[]).map(rtmKbCard).join('')||'<div class="panel">В этой папке пока нет материалов</div>';
  }
  $$('[data-kb-folder]').forEach(function(b){b.onclick=function(){state.kbPath.push(b.dataset.kbFolder);renderKb()}});
  $$('[data-kb-material]').forEach(function(b){b.onclick=function(){state.kbSelected=b.dataset.kbMaterial;renderKb()}});
  $$('[data-kb-crumb]').forEach(function(b){b.onclick=function(){state.kbPath=state.kbPath.slice(0,Number(b.dataset.kbCrumb));state.kbSelected=null;renderKb()}});
  var rootBtn=$('[data-kb-root]');if(rootBtn)rootBtn.onclick=function(){state.kbPath=[];state.kbSelected=null;$('#kbSearch').value='';renderKb()};
};

function renderProjectList(){
  var q=($('#projectListSearch')&&$('#projectListSearch').value||'').toLowerCase(),box=$('#projectListArticles');
  if(!box)return;
  var items=activeRows(state.items).filter(function(i){return !['section'].includes(i.PROPERTY_VALUES&&i.PROPERTY_VALUES.type)});
  if(!state.projectListProjectId){
    var projects=activeRows(state.projects).filter(function(p){return ((p.NAME||'')+' '+items.filter(function(i){return String(i.PROPERTY_VALUES&&i.PROPERTY_VALUES.projectId)===String(p.ID)}).map(function(i){return i.NAME}).join(' ')).toLowerCase().includes(q)});
    box.innerHTML=projects.map(function(p){var count=items.filter(function(i){return String(i.PROPERTY_VALUES&&i.PROPERTY_VALUES.projectId)===String(p.ID)}).length;return '<div class="kb-space-card" data-project-list="'+p.ID+'"><span class="kb-icon">'+svgIcon('folder')+'</span><div><h3>'+esc(p.NAME)+'</h3><p class="muted">Проект · '+count+' материалов</p></div></div>'}).join('')||'<div class="panel">Проектов пока нет</div>';
    $$('[data-project-list]').forEach(function(b){b.onclick=function(){state.projectListProjectId=b.dataset.projectList;renderProjectList()}});
    return;
  }
  var project=state.projects.find(function(p){return String(p.ID)===String(state.projectListProjectId)});
  var rows=items.filter(function(i){return String(i.PROPERTY_VALUES&&i.PROPERTY_VALUES.projectId)===String(state.projectListProjectId)&&(i.NAME+' '+strip(i.PROPERTY_VALUES&&i.PROPERTY_VALUES.content)).toLowerCase().includes(q)});
  box.innerHTML='<div class="kb-project-head"><button id="projectListBack">← Назад</button><b>'+esc(project&&project.NAME||'Проект')+'</b></div><div class="kb-doc-grid">'+(rows.map(function(a){return '<div class="kb-doc-card" data-project-material="'+a.ID+'"><span class="kb-icon">'+svgIcon(a.PROPERTY_VALUES&&a.PROPERTY_VALUES.type||'article')+'</span><div><h3>'+esc(a.NAME)+'</h3><p class="muted">'+typeLabel(a.PROPERTY_VALUES&&a.PROPERTY_VALUES.type)+'</p></div></div>'}).join('')||'<div class="panel">Материалов пока нет</div>')+'</div>';
  $('#projectListBack').onclick=function(){state.projectListProjectId=null;renderProjectList()};
  $$('[data-project-material]').forEach(function(b){b.onclick=function(){openUserMaterial(findItem(b.dataset.projectMaterial))}});
}
backFromUserMaterial=function(){
  if(state.materialBackView==='projects'){showUserView('projects');$('#userMaterialView')&&$('#userMaterialView').classList.add('hidden');renderProjectList();return}
  openUserCourse(findItem(state.courseId));
};
renderAll=function(){
  shellLayout();renderProjects();renderDashboard();renderEvents();renderMaterials();renderUserCourses();renderKb();renderProjectList();renderProfile();renderUsers();renderDatabase();renderAnalytics();enhanceMediaToolbars();
};

function rtmSafeUrl(raw){
  try{var u=new URL(String(raw||'').trim());return u.protocol==='https:'?u.href:''}catch(e){return ''}
}
function rtmVideoEmbed(url){
  var u=rtmSafeUrl(url);if(!u)return '';
  var m=u.match(/(?:youtube\.com\/watch\?[^#]*v=|youtu\.be\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{6,})/i);
  if(m)return 'https://www.youtube-nocookie.com/embed/'+m[1];
  m=u.match(/rutube\.ru\/video\/private\/([a-z0-9]+)/i);
  if(m){var key=(u.match(/[?&]p=([^&]+)/i)||[])[1];return 'https://rutube.ru/play/embed/'+m[1]+(key?'/?p='+encodeURIComponent(key):'')}
  m=u.match(/rutube\.ru\/video\/([a-z0-9]+)/i);
  if(m)return 'https://rutube.ru/play/embed/'+m[1];
  if(u.indexOf('rutube.ru/play/embed/')>=0)return u;
  return '';
}
function rtmMediaHtml(kind,url,title){
  url=rtmSafeUrl(url);title=String(title||'').trim()||(kind==='video'?'Видео':'Аудио');
  if(!url)return '';
  if(kind==='audio')return '<div class="rtm-media-block rtm-audio-block" contenteditable="false"><b>'+esc(title)+'</b><audio controls preload="metadata" src="'+esc(url)+'"></audio><a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">Открыть отдельно</a></div><p><br></p>';
  var embed=rtmVideoEmbed(url),direct=/\.(mp4|webm|mov)(?:[?#]|$)/i.test(url);
  var player=embed?'<iframe src="'+esc(embed)+'" title="'+esc(title)+'" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>':direct?'<video controls preload="metadata" src="'+esc(url)+'"></video>':'<iframe src="'+esc(url)+'" title="'+esc(title)+'" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
  return '<div class="rtm-media-block rtm-video-block" contenteditable="false"><b>'+esc(title)+'</b><div class="rtm-video-frame">'+player+'</div><a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">Открыть отдельно</a></div><p><br></p>';
}
function rtmInsertHtml(editor,html){
  if(!editor||!html)return;
  editor.focus();
  var ok=false;
  try{ok=document.execCommand('insertHTML',false,html)}catch(e){}
  if(!ok)editor.insertAdjacentHTML('beforeend',html);
  editor.dispatchEvent(new Event('input',{bubbles:true}));
}
function rtmMediaLinkModal(kind,editor){
  modal('<h2>Вставить '+(kind==='video'?'видео':'аудио')+'</h2><label>Название<input id="rtmMediaTitle" placeholder="Название"></label><label>HTTPS-ссылка<input id="rtmMediaUrl" placeholder="https://..."></label><div class="inline-actions"><button onclick="window.closeModal()">Отмена</button><button class="primary" id="rtmMediaInsert">Вставить</button></div>');
  $('#rtmMediaInsert').onclick=function(){
    var html=rtmMediaHtml(kind,$('#rtmMediaUrl').value,$('#rtmMediaTitle').value);
    if(!html){alert('Укажите корректную HTTPS-ссылку');return}
    closeModal();rtmInsertHtml(editor,html);
  };
}
function rtmMediaKind(name,mime){
  var s=(String(name||'')+' '+String(mime||'')).toLowerCase();
  return /\.(mp3|m4a|ogg|wav|aac|flac)(?:\s|$)/.test(s)||s.indexOf('audio/')>=0?'audio':'video';
}
function rtmNormalizeList(v){return Array.isArray(v)?v:(Array.isArray(v&&v.items)?v.items:Array.isArray(v&&v.result)?v.result:[])}

var rtmDiskState={editor:null,storageId:null,folderId:null,stack:[]};
async function rtmDiskLoad(){
  var box=$('#rtmDiskItems');if(!box)return;
  box.innerHTML='<p class="muted">Загрузка...</p>';
  try{
    var rows=rtmDiskState.folderId?await call('disk.folder.getchildren',{id:rtmDiskState.folderId}):await call('disk.storage.getchildren',{id:rtmDiskState.storageId});
    rows=rtmNormalizeList(rows);
    var visible=rows.filter(function(x){return String(x.TYPE||x.type).toLowerCase()==='folder'||/\.(mp4|webm|mov|mp3|m4a|ogg|wav|aac|flac)$/i.test(String(x.NAME||x.name||''))});
    box.innerHTML=visible.map(function(x){
      var folder=String(x.TYPE||x.type).toLowerCase()==='folder';
      return '<button class="disk-row" data-disk-'+(folder?'folder':'file')+'="'+(x.ID||x.id)+'" data-disk-name="'+esc(x.NAME||x.name||'')+'"><span>'+svgIcon(folder?'folder':'file')+'</span><b>'+esc(x.NAME||x.name||'')+'</b></button>';
    }).join('')||'<p class="muted">Медиафайлов и папок нет</p>';
    $$('[data-disk-folder]').forEach(function(b){b.onclick=function(){rtmDiskState.stack.push({folderId:rtmDiskState.folderId,title:b.dataset.diskName});rtmDiskState.folderId=b.dataset.diskFolder;rtmDiskLoad()}});
    $$('[data-disk-file]').forEach(function(b){b.onclick=async function(){await rtmUseDiskFile(b.dataset.diskFile,b.dataset.diskName)}});
    var back=$('#rtmDiskBack');if(back)back.disabled=!rtmDiskState.stack.length;
  }catch(e){box.innerHTML='<p class="test-result bad">'+esc(e.message)+'</p>'}
}
async function rtmUseDiskFile(id,name){
  try{
    var link=await call('disk.file.getExternalLink',{id:id});
    var url=typeof link==='string'?link:(link&&link.url||link&&link.URL||'');
    if(!url)throw new Error('Bitrix не вернул ссылку на файл');
    var kind=rtmMediaKind(name,'');
    closeModal();rtmInsertHtml(rtmDiskState.editor,rtmMediaHtml(kind,url,name));
  }catch(e){alert('Не удалось открыть файл: '+e.message)}
}
function rtmFileBase64(file){return new Promise(function(resolve,reject){var reader=new FileReader();reader.onload=function(){resolve(String(reader.result).split(',')[1]||'')};reader.onerror=reject;reader.readAsDataURL(file)})}
async function rtmUploadDiskFile(){
  var input=$('#rtmDiskUpload'),file=input&&input.files&&input.files[0];if(!file)return alert('Выберите файл');
  var btn=$('#rtmDiskUploadBtn');if(btn)btn.disabled=true;
  try{
    var base64=await rtmFileBase64(file);
    var method=rtmDiskState.folderId?'disk.folder.uploadfile':'disk.storage.uploadfile';
    var res=await call(method,{id:rtmDiskState.folderId||rtmDiskState.storageId,data:{NAME:file.name},fileContent:[file.name,base64],generateUniqueName:true});
    var id=res&&((res.ID||res.id)||(res.file&&(res.file.ID||res.file.id)));
    if(!id)throw new Error('Bitrix не вернул ID файла');
    await rtmUseDiskFile(id,file.name);
  }catch(e){alert('Загрузка не выполнена: '+e.message);if(btn)btn.disabled=false}
}
async function rtmBitrixMediaModal(editor){
  rtmDiskState={editor:editor,storageId:null,folderId:null,stack:[]};
  modal('<h2>Медиа из Битрикс24.Диска</h2><button class="modal-close" onclick="window.closeModal()">×</button><p class="muted" id="rtmDiskStatus">Получаю хранилища...</p><select id="rtmDiskStorage"></select><div class="disk-toolbar"><button id="rtmDiskBack">← Назад</button><input id="rtmDiskUpload" type="file" accept="video/*,audio/*"><button class="primary" id="rtmDiskUploadBtn">Загрузить</button></div><div id="rtmDiskItems" class="disk-items"></div>');
  try{
    var storages=rtmNormalizeList(await call('disk.storage.getlist',{}));
    if(!storages.length)throw new Error('Доступных хранилищ нет');
    var select=$('#rtmDiskStorage');
    select.innerHTML=storages.map(function(s){return '<option value="'+(s.ID||s.id)+'">'+esc(s.NAME||s.name||('Хранилище '+(s.ID||s.id)))+'</option>'}).join('');
    rtmDiskState.storageId=select.value;
    $('#rtmDiskStatus').textContent='Выберите существующий файл или загрузите новый';
    select.onchange=function(){rtmDiskState.storageId=select.value;rtmDiskState.folderId=null;rtmDiskState.stack=[];rtmDiskLoad()};
    $('#rtmDiskBack').onclick=function(){var prev=rtmDiskState.stack.pop();rtmDiskState.folderId=prev?prev.folderId:null;rtmDiskLoad()};
    $('#rtmDiskUploadBtn').onclick=rtmUploadDiskFile;
    await rtmDiskLoad();
  }catch(e){$('#rtmDiskStatus').textContent='Нужно разрешение disk: '+e.message}
}
function enhanceMediaToolbars(){
  $$('.format-toolbar').forEach(function(tb){
    if(tb.dataset.rtmMediaReady)return;
    tb.dataset.rtmMediaReady='1';
    var editor=tb.parentElement&&tb.parentElement.querySelector('.rich-editor');
    [['Видео','video'],['Аудио','audio'],['Bitrix.Диск','disk']].forEach(function(cfg){
      if(tb.querySelector('[data-rtm-media="'+cfg[1]+'"]'))return;
      var b=document.createElement('button');b.type='button';b.dataset.rtmMedia=cfg[1];b.textContent=cfg[0];
      b.onclick=function(e){e.preventDefault();if(cfg[1]==='disk')rtmBitrixMediaModal(editor);else rtmMediaLinkModal(cfg[1],editor)};
      tb.appendChild(b);
    });
  });
}
var rtmObserver=new MutationObserver(function(){enhanceMediaToolbars()});
rtmObserver.observe(document.documentElement,{childList:true,subtree:true});

var rtmBaseBind=bind;
bind=function(){
  rtmBaseBind();
  var projectSearch=$('#projectListSearch');if(projectSearch)projectSearch.oninput=renderProjectList;
  var sync=$('#globalSyncBtn');if(sync)sync.onclick=function(){loadAll(true)};
  var reload=$('#userReloadBtn');if(reload)reload.onclick=function(){loadAll(true)};
  setTimeout(function(){enhanceMediaToolbars();rtmBindTestForm()},0);
};
})();
