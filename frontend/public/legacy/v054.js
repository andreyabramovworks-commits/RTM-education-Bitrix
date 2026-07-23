(function(){
'use strict';
var V='50.3.4';
function mobile(){
 var nav=document.getElementById('v38MobileNav');
 if(!nav||state.mode!=='admin'||nav.querySelector('[data-v54-review]'))return;
 var b=document.createElement('button');b.dataset.v54Review='1';b.textContent='Центр проверок';
 b.onclick=function(){switchAdmin('reviews');if(window.v38CloseMobileMenu)window.v38CloseMobileMenu()};
 var before=nav.querySelector('[data-v38-admin="events"]');nav.insertBefore(b,before||nav.querySelector('.v38-mobile-projects'));
}
function workspace(){
 var root=document.getElementById('adminInfo'),canvas=document.getElementById('v492DeveloperCanvas');
 if(!root||!canvas||root.querySelector('.v54-workspace-tools'))return;
 var bar=document.createElement('div');bar.className='v54-workspace-tools';bar.innerHTML='<button type="button">Резервные версии доски</button>';root.insertBefore(bar,canvas);
 bar.firstChild.onclick=async function(){
  try{
   var data=await RTMV47.request('/api/v47/developer-workspace/revisions'),rows=Array.isArray(data)?data:(data.revisions||[]);
   modal('<div><h2>Резервные версии доски</h2><p>Перед восстановлением текущая доска тоже сохранится в истории.</p><div class="v54-revisions">'+rows.map(function(r){return'<article><span><b>Ревизия '+esc(r.revision)+'</b><br><small>'+esc(new Date(r.created_at).toLocaleString('ru-RU'))+'</small></span><button data-v54-restore="'+esc(r.revision)+'">Восстановить</button></article>'}).join('')+'</div><div class="inline-actions right"><button onclick="closeModal()">Закрыть</button></div></div>');
   document.querySelectorAll('[data-v54-restore]').forEach(function(x){x.onclick=async function(){if(!confirm('Восстановить эту версию доски?'))return;x.disabled=true;try{closeModal();if(window.RTMV492&&window.RTMV492.restoreWorkspace)await window.RTMV492.restoreWorkspace(Number(x.dataset.v54Restore));else{await RTMV47.request('/api/v47/developer-workspace/restore',{method:'POST',body:JSON.stringify({revision:Number(x.dataset.v54Restore)})});window.RTMV492&&window.RTMV492.mountWorkspace()}}catch(error){alert('Не удалось восстановить версию: '+(error.message||error))}}})
  }catch(e){alert('Не удалось открыть историю: '+(e.message||e))}
 };
}
new MutationObserver(function(){mobile();workspace()}).observe(document.documentElement,{childList:true,subtree:true});
setTimeout(function(){mobile();workspace()},0);
window.RTMV54={version:V,mobile:mobile,workspace:workspace};
})();
