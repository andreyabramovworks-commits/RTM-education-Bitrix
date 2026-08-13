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

    // Some Bitrix24 hosts only invoke the first BX24.init callback reliably.
    // Mark the shared SDK as ready and make later legacy subscribers async but
    // immediate, so the application cannot stall on a second initialization.
    window.__RTM_BITRIX_INITIALIZED__ = true;
    bitrixSdk.init = function onAlreadyInitialized(callback) {
      if (typeof callback === "function") window.setTimeout(callback, 0);
    };

    window.dispatchEvent(new CustomEvent("rtm-bitrix-ready"));
    return window.RTM_BITRIX;
  }

  if (!bitrixSdk) {
    window.dispatchEvent(
      new CustomEvent("rtm-bitrix-error", {
        detail: "Не удалось загрузить SDK Битрикс24",
      }),
    );
    return;
  }

  window.RTM_BITRIX_READY = new Promise(function waitForBitrix(resolve) {
    var completed = false;
    var timeout = window.setTimeout(function onTimeout() {
      if (completed) return;
      completed = true;
      window.dispatchEvent(
        new CustomEvent("rtm-bitrix-error", {
          detail: "Битрикс24 не ответил вовремя",
        }),
      );
      resolve(null);
    }, 8000);

    bitrixSdk.init(function onBitrixReady() {
      if (completed) return;
      completed = true;
      window.clearTimeout(timeout);
      resolve(publishContext());
    });
  });
})();
