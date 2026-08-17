(function bootstrapBitrixContext() {
  "use strict";

  var isEmbedded = window.self !== window.top;
  var isBitrixReferrer = /^https:\/\/rtm-group\.bitrix24\.ru(?:\/|$)/i.test(
    document.referrer || "",
  );

  if (!isEmbedded && !isBitrixReferrer) {
    return;
  }

  var bitrixSdk = window.BX24;
  var resolveReady = window.__RTM_BITRIX_READY_RESOLVE__;
  var rejectReady = window.__RTM_BITRIX_READY_REJECT__;

  if (!window.RTM_BITRIX_READY) {
    window.RTM_BITRIX_READY = new Promise(function createReadyPromise(resolve, reject) {
      resolveReady = resolve;
      rejectReady = reject;
    });
  }

  function publishContext() {
    if (!bitrixSdk || window.RTM_BITRIX) {
      return window.RTM_BITRIX || null;
    }

    window.RTM_BITRIX = {
      isAdmin: function isAdmin() {
        return Boolean(bitrixSdk.isAdmin && bitrixSdk.isAdmin());
      },
      getAuth: function getAuth() {
        try {
          if (bitrixSdk.getAuth) return bitrixSdk.getAuth();
        } catch (_) {}
        return bitrixSdk.auth || null;
      },
      call: function call(method, params) {
        return new Promise(function execute(resolve, reject) {
          bitrixSdk.callMethod(method, params || {}, function onResult(result) {
            if (result.error && result.error()) {
              reject(new Error(result.error_description() || result.error()));
              return;
            }

            resolve({
              data: result.data(),
              more: result.more ? result.more() : false,
            });
          });
        });
      },
    };

    window.__RTM_BITRIX_INITIALIZED__ = true;
    window.dispatchEvent(new CustomEvent("rtm-bitrix-ready"));
    return window.RTM_BITRIX;
  }

  if (!bitrixSdk) {
    window.dispatchEvent(
      new CustomEvent("rtm-bitrix-error", {
        detail: "Не удалось загрузить SDK Битрикс24",
      }),
    );
    if (rejectReady) rejectReady(new Error("Не удалось загрузить SDK Битрикс24"));
    return;
  }

  var completed = false;
  var initSignalled = false;
  var startedAt = Date.now();

  function authAvailable() {
    try {
      var auth = bitrixSdk.getAuth ? bitrixSdk.getAuth() : bitrixSdk.auth;
      return Boolean(auth && auth.access_token && auth.domain);
    } catch (_) {
      return Boolean(bitrixSdk.auth && bitrixSdk.auth.access_token && bitrixSdk.auth.domain);
    }
  }

  function complete() {
    if (completed || !authAvailable()) return false;
    completed = true;
    var context = publishContext();
    if (resolveReady) resolveReady(context);
    delete window.__RTM_BITRIX_READY_RESOLVE__;
    delete window.__RTM_BITRIX_READY_REJECT__;
    return true;
  }

  function probe() {
    if (complete()) return;
    if (Date.now() - startedAt >= 10000) {
      completed = true;
      var message = initSignalled
        ? "Битрикс24 не передал данные авторизации"
        : "Битрикс24 не завершил запуск приложения";
      var error = new Error(message);
      window.dispatchEvent(new CustomEvent("rtm-bitrix-error", { detail: message }));
      if (rejectReady) rejectReady(error);
      return;
    }
    window.setTimeout(probe, 100);
  }

  try {
    bitrixSdk.init(function onBitrixReady() {
      initSignalled = true;
      complete();
    });
  } catch (_) {
    initSignalled = true;
  }
  probe();
})();
