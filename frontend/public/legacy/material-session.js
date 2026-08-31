(function () {
  'use strict';

  var generation = 0;
  var materialId = '';
  var disposers = new Set();
  var timers = new Set();

  function clear() {
    timers.forEach(function (timer) { clearTimeout(timer); });
    timers.clear();
    disposers.forEach(function (dispose) {
      try { dispose(); } catch (error) { console.warn('Material cleanup failed', error); }
    });
    disposers.clear();
  }

  function begin(id) {
    clear();
    generation += 1;
    materialId = String(id || '');
    return { generation: generation, materialId: materialId };
  }

  function current() {
    return { generation: generation, materialId: materialId };
  }

  function isCurrent(token, id) {
    return Boolean(token) && token.generation === generation &&
      String(id == null ? token.materialId : id) === materialId;
  }

  function register(dispose) {
    if (typeof dispose !== 'function') return function () {};
    disposers.add(dispose);
    return function () { disposers.delete(dispose); };
  }

  function schedule(callback, delay, token) {
    var timer = setTimeout(function () {
      timers.delete(timer);
      if (!token || isCurrent(token)) callback();
    }, delay);
    timers.add(timer);
    return timer;
  }

  function dispose() {
    clear();
    generation += 1;
    materialId = '';
  }

  var session = { begin: begin, current: current, isCurrent: isCurrent, register: register, schedule: schedule, dispose: dispose };
  window.RTMMaterialSession = session;

  var openBase = window.openUserMaterial;
  if (typeof openBase === 'function') {
    window.openUserMaterial = openUserMaterial = function (material) {
      if (!material) return;
      begin(material.ID);
      return openBase.apply(this, arguments);
    };
  }
})();
