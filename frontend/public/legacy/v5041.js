/* RTM v50.4.1: analytics controls, navigation and theme finalizer. */
(function () {
  "use strict";
  // Follow the host release. A fixed older value here can compete with the
  // current release observer and lock the browser's main thread.
  var VERSION = String(window.__RTM_VERSION__ || "50.4.1");
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
    document.documentElement.dataset.rtmVersion=VERSION;
    document.documentElement.style.minHeight="100%";
    document.body.style.minHeight="100%";
    document.querySelectorAll(".v39-version-label").forEach(function(node){
      var expected=node.classList.contains("v39-admin-version")?"v"+VERSION:"Версия v"+VERSION;
      if(node.textContent!==expected)node.textContent=expected;
    });
  }
  finishTheme();
  new MutationObserver(finishTheme).observe(document.documentElement,{childList:true,subtree:true});
  window.__RTM_VERSION__=VERSION;
  window.RTMV5041={version:VERSION,enhanceAnalytics:enhance};
})();
