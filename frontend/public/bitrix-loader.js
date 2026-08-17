(function loadBitrixSdkWhenEmbedded() {
  "use strict";

  var embedded = window.self !== window.top;
  var portalReferrer = /^https:\/\/rtm-group\.bitrix24\.ru(?:\/|$)/i.test(document.referrer || "");
  if (!embedded && !portalReferrer) return;

  var sdk = document.createElement("script");
  sdk.src = "https://api.bitrix24.com/api/v1/";
  sdk.onload = function loadContextBridge() {
    var bridge = document.createElement("script");
    bridge.src = "/bitrix-bootstrap.js?v=53.0.12-r1";
    document.head.appendChild(bridge);
  };
  sdk.onerror = function reportSdkFailure() {
    window.dispatchEvent(new CustomEvent("rtm-bitrix-error", { detail: "Не удалось загрузить SDK Битрикс24" }));
  };
  document.head.appendChild(sdk);
})();
