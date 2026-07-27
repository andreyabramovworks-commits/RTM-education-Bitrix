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
