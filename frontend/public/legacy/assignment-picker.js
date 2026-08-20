(function () {
  'use strict';

  function text(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char];
    });
  }

  function idOf(item) { return String(item && (item.id || item.ID) || ''); }
  function nameOf(item) { return String(item && (item.name || item.NAME) || ''); }
  function parentOf(item) { return String(item && (item.parentId || item.PARENT || item.parent) || ''); }
  function userDepartments(user) {
    var value = user && (user.departmentIds || user.UF_DEPARTMENT || user.departments) || [];
    return (Array.isArray(value) ? value : [value]).map(String);
  }

  function descendants(departments, rootId) {
    var result = new Set([String(rootId)]), changed = true;
    while (changed) {
      changed = false;
      departments.forEach(function (department) {
        if (result.has(parentOf(department)) && !result.has(idOf(department))) {
          result.add(idOf(department)); changed = true;
        }
      });
    }
    return result;
  }

  function mount(host, options) {
    if (!host) return null;
    options = options || {};
    var users = (options.users || []).filter(Boolean);
    var departments = (options.departments || []).filter(Boolean);
    var responsibles = (options.responsibles || []).filter(Boolean);
    var selectedUsers = new Set((options.selectedUsers || []).map(String));
    var selectedDepartments = new Set((options.selectedDepartments || []).map(String));
    var selectedResponsibles = new Set((options.selectedResponsibles || []).map(String));
    var includeChildren = new Set((options.includeChildren || options.selectedDepartments || []).map(String));
    var allActive = Boolean(options.allActive);
    var query = '';

    function departmentDepth(department) {
      var depth = 0, current = department, guard = 0;
      while (parentOf(current) && guard++ < 20) {
        current = departments.find(function (item) { return idOf(item) === parentOf(current); });
        if (!current) break;
        depth += 1;
      }
      return depth;
    }

    function matches(value) { return !query || String(value || '').toLocaleLowerCase('ru').includes(query); }
    function render() {
      host.className = 'rtm-assignment-picker';
      host.innerHTML =
        '<label class="rtm-picker-search"><span class="sr-only">Поиск</span><input type="search" placeholder="Найти сотрудника или подразделение" value="'+text(query)+'"></label>'+
        '<section class="rtm-picker-group rtm-picker-all"><h3>Общий выбор</h3><label class="rtm-picker-choice"><input type="checkbox" data-picker-all '+(allActive?'checked':'')+'><span>Все активные сотрудники</span></label></section>'+
        '<div class="rtm-picker-specific '+(allActive?'is-hidden':'')+'">'+
          '<section class="rtm-picker-group"><h3>Отделы и подотделы</h3><div class="rtm-picker-list">'+departments.filter(function(d){return matches(nameOf(d));}).map(function (department) {
            var id=idOf(department), depth=departmentDepth(department);
            return '<div class="rtm-picker-department" style="--picker-depth:'+depth+'"><label class="rtm-picker-choice"><input type="checkbox" data-picker-department="'+text(id)+'" '+(selectedDepartments.has(id)?'checked':'')+'><span>'+text(nameOf(department))+'</span></label><label class="rtm-picker-children"><input type="checkbox" data-picker-children="'+text(id)+'" '+(includeChildren.has(id)?'checked':'')+' '+(selectedDepartments.has(id)?'':'disabled')+'><span class="rtm-picker-switch" aria-hidden="true"></span><span>Включая подотделы</span></label></div>';
          }).join('')+'</div></section>'+
          '<section class="rtm-picker-group"><h3>Отдельные сотрудники</h3><div class="rtm-picker-list rtm-picker-people">'+users.filter(function(u){return matches(nameOf(u)+' '+(u.email||u.EMAIL||''));}).map(function (user) {
            var id=idOf(user); return '<label class="rtm-picker-choice"><input type="checkbox" data-picker-user="'+text(id)+'" '+(selectedUsers.has(id)?'checked':'')+'><span>'+text(nameOf(user))+'</span></label>';
          }).join('')+'</div></section>'+
        '</div>'+
        (responsibles.length?'<section class="rtm-picker-group"><h3>Ответственные <small>(можно выбрать нескольких)</small></h3><div class="rtm-picker-list rtm-picker-people">'+responsibles.filter(function(u){return matches(nameOf(u)+' '+(u.role||''));}).map(function(user){var id=idOf(user);return '<label class="rtm-picker-choice"><input type="checkbox" data-picker-responsible="'+text(id)+'" '+(selectedResponsibles.has(id)?'checked':'')+'><span>'+text(nameOf(user))+(user.role?' <small>('+text(user.role)+')</small>':'')+'</span></label>';}).join('')+'</div></section>':'');

      var search=host.querySelector('input[type="search"]');
      if(search) search.oninput=function(){query=search.value.toLocaleLowerCase('ru').trim();render();var next=host.querySelector('input[type="search"]');if(next){next.focus();next.setSelectionRange(next.value.length,next.value.length);}};
      var all=host.querySelector('[data-picker-all]');
      if(all) all.onchange=function(){allActive=all.checked;render();};
      host.querySelectorAll('[data-picker-department]').forEach(function(input){input.onchange=function(){var id=input.dataset.pickerDepartment;if(input.checked){selectedDepartments.add(id);includeChildren.add(id);}else{selectedDepartments.delete(id);includeChildren.delete(id);}render();};});
      host.querySelectorAll('[data-picker-children]').forEach(function(input){input.onchange=function(){if(input.checked)includeChildren.add(input.dataset.pickerChildren);else includeChildren.delete(input.dataset.pickerChildren);};});
      host.querySelectorAll('[data-picker-user]').forEach(function(input){input.onchange=function(){if(input.checked)selectedUsers.add(input.dataset.pickerUser);else selectedUsers.delete(input.dataset.pickerUser);};});
      host.querySelectorAll('[data-picker-responsible]').forEach(function(input){input.onchange=function(){if(input.checked)selectedResponsibles.add(input.dataset.pickerResponsible);else selectedResponsibles.delete(input.dataset.pickerResponsible);};});
    }

    function value() {
      var departmentIds = Array.from(selectedDepartments);
      var effectiveDepartments = new Set();
      departmentIds.forEach(function(id){(includeChildren.has(id)?descendants(departments,id):new Set([id])).forEach(function(x){effectiveDepartments.add(x);});});
      var effectiveUsers = new Set(selectedUsers);
      if (allActive) users.forEach(function(user){effectiveUsers.add(idOf(user));});
      else users.forEach(function(user){if(userDepartments(user).some(function(id){return effectiveDepartments.has(id);}))effectiveUsers.add(idOf(user));});
      return {allActive:allActive,userIds:Array.from(effectiveUsers),selectedUserIds:Array.from(selectedUsers),departmentIds:departmentIds,includeChildren:Array.from(includeChildren),responsibleIds:Array.from(selectedResponsibles)};
    }

    render();
    return {getValue:value, render:render};
  }

  window.RTMAssignmentPicker = {mount:mount};
})();
