/* RTM v50.4.2: release marker and theme authority. */
(function(){
  "use strict";
  var VERSION="50.4.2";
  function finalize(){
    document.documentElement.dataset.rtmVersion=VERSION;
    document.documentElement.style.colorScheme=document.documentElement.dataset.rtmTheme==="dark"?"dark":"light";
    document.querySelectorAll(".v39-version-label").forEach(function(node){
      var expected=node.classList.contains("v39-admin-version")?"v"+VERSION:"Версия v"+VERSION;
      if(node.textContent!==expected)node.textContent=expected;
    });
  }
  finalize();
  window.addEventListener("rtm-theme-change",finalize);
  window.__RTM_VERSION__=VERSION;
  window.RTMV5042={version:VERSION};
})();
