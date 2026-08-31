(function () {
  'use strict';

  var CURRENT_SCHEMA = 1;

  function clone(value) {
    if (value == null) return value;
    try { return structuredClone(value); } catch (_) { return JSON.parse(JSON.stringify(value)); }
  }

  function migrate(scene) {
    var next = clone(scene) || {};
    var version = Number(next.rtmSchemaVersion || 0);
    if (!Array.isArray(next.elements)) next.elements = [];
    if (!next.appState || typeof next.appState !== 'object') next.appState = {};
    if (!next.files || typeof next.files !== 'object') next.files = {};
    while (version < CURRENT_SCHEMA) {
      if (version === 0) {
        next.elements = next.elements.filter(Boolean).map(function (element) {
          return Object.assign({ isDeleted: false }, element, {
            customData: element.customData && typeof element.customData === 'object' ? element.customData : element.customData || undefined
          });
        });
      }
      version += 1;
    }
    next.rtmSchemaVersion = CURRENT_SCHEMA;
    return next;
  }

  function install() {
    if (!window.RTMCanvas || window.RTMCanvas.__rtmMigrationsInstalled) return false;
    var baseMount = window.RTMCanvas.mount;
    window.RTMCanvas.mount = function (host, options) {
      var next = Object.assign({}, options || {});
      next.scene = migrate(next.scene);
      if (typeof next.onChange === 'function') {
        var onChange = next.onChange;
        next.onChange = function (scene) { return onChange(migrate(scene)); };
      }
      return baseMount.call(this, host, next);
    };
    window.RTMCanvas.__rtmMigrationsInstalled = true;
    return true;
  }

  window.RTMSceneMigrations = { CURRENT_SCHEMA: CURRENT_SCHEMA, migrate: migrate, install: install };
  install();
})();
