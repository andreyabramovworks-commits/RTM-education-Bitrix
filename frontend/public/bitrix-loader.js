(function loadBitrixSdkWhenEmbedded() {
  "use strict";

  var embedded = window.self !== window.top;
  var portalReferrer = /^https:\/\/rtm-group\.bitrix24\.ru(?:\/|$)/i.test(document.referrer || "");
  if (!embedded && !portalReferrer) return;

  // Publish the readiness promise before the external script starts loading.
  // React can otherwise outrun the SDK and begin the legacy data adapter with
  // no Bitrix context at all (the startup race captured in HAR 40).
  if (!window.RTM_BITRIX_READY) {
    window.RTM_BITRIX_READY = new Promise(function createReadyPromise(resolve, reject) {
      window.__RTM_BITRIX_READY_RESOLVE__ = resolve;
      window.__RTM_BITRIX_READY_REJECT__ = reject;
    });
  }

  var sdk = document.createElement("script");
  sdk.src = "https://api.bitrix24.com/api/v1/";
  sdk.onload = function loadContextBridge() {
    var bridge = document.createElement("script");
    bridge.src = "/bitrix-bootstrap.js?v=53.1.4-r1";
    document.head.appendChild(bridge);
  };
  sdk.onerror = function reportSdkFailure() {
    var error = new Error("Не удалось загрузить SDK Битрикс24");
    if (window.__RTM_BITRIX_READY_REJECT__) window.__RTM_BITRIX_READY_REJECT__(error);
    window.dispatchEvent(new CustomEvent("rtm-bitrix-error", { detail: error.message }));
  };
  document.head.appendChild(sdk);
})();
