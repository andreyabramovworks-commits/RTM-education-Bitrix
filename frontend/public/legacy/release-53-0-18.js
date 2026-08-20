(function () {
  'use strict';

  document.addEventListener('click', function (event) {
    var toggle = event.target.closest && event.target.closest('[data-toggle-required]');
    if (!toggle) return;
    event.preventDefault();
    event.stopPropagation();
    var select = document.querySelector('[data-child-required="' + CSS.escape(String(toggle.dataset.toggleRequired)) + '"]');
    if (!select) return;
    select.value = select.value === 'Y' ? 'N' : 'Y';
    select.dispatchEvent(new Event('change', {bubbles: true}));
  }, true);

  function stabilizeMaterialView() {
    var view = document.getElementById('userMaterialView');
    if (!view) return;
    var body = document.getElementById('uMaterialBody');
    var ready = Boolean(body && body.children.length);
    view.classList.toggle('rtm-material-ready', ready);
    view.classList.toggle('rtm-material-pending', !ready);
    var done = document.getElementById('uMarkMaterialDone');
    if (done && view.classList.contains('is-excalidraw-article')) done.hidden = true;
  }

  var observer = new MutationObserver(stabilizeMaterialView);
  var body = document.getElementById('uMaterialBody');
  if (body) observer.observe(body, {childList: true, subtree: true});
  stabilizeMaterialView();

  window.RTMUI = window.RTMUI || {afterRender: [], adminView: []};
  window.RTMUI.afterRender.push(stabilizeMaterialView);
  window.RTMV53018 = {stabilizeMaterialView: stabilizeMaterialView};
})();
