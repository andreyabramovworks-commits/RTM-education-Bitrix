/** RTM v50.3.8. Developer-only Google Sheet feedback channel for PostgreSQL. */
const RTM_API = 'https://rtmgroupdocs.fvds.ru/api/v47/knowledge';
function onOpen(){ SpreadsheetApp.getUi().createMenu('RTM').addItem('Синхронизировать с БД сервера','syncKnowledgeBase').addToUi(); }
function onEdit(e){var range=e&&e.range;if(!range||range.getSheet().getName()!=='Каталог документов'||range.getA1Notation()!=='Q2'||range.getValue()!==true)return;range.setValue(false);syncKnowledgeBase();}
function parseList_(value){ if(!value)return[]; return String(value).split(/\s*[,;\n]\s*/).filter(Boolean).map(function(x){var p=x.split(':');return p.length>1?{type:p.shift(),id:p.join(':')}:{type:'user',id:x};}); }
function formatList_(items){return(items||[]).map(function(x){return x.type+':'+(x.id||'')}).join(', ');}
function syncKnowledgeBase(){
  const secret=PropertiesService.getScriptProperties().getProperty('RTM_KNOWLEDGE_SYNC_SECRET');
  if(!secret)throw new Error('Задайте RTM_KNOWLEDGE_SYNC_SECRET в свойствах скрипта');
  const ss=SpreadsheetApp.getActive(),sheet=ss.getSheetByName('Каталог документов'),last=sheet.getLastRow();
  sheet.getRange(1,12,1,6).setValues([['Статья документа','Тесты документа','Кому назначен','Проверяющие','Редакторы','СИНХРОНИЗИРОВАТЬ С БД']]);
  sheet.getRange('Q2').insertCheckboxes().setValue(false).setNote('Поставьте галочку, чтобы отправить изменения в PostgreSQL и получить актуальные данные обратно.');
  const values=sheet.getRange(2,1,last-1,17).getDisplayValues(),rows=[];
  values.forEach(function(r,i){var link=(r[6].match(/https:\/\/docs\.google\.com\/document\/d\/[^\s,;]+/)||[])[0],assigned=parseList_(r[13]);if(!link)return;rows.push({row:i+2,title:r[1],description:r[2],documentUrl:link,articleAssignments:assigned,lightTestAssignments:assigned,fullTestAssignments:assigned,reviewers:parseList_(r[14]),editors:parseList_(r[15])});});
  const response=UrlFetchApp.fetch(RTM_API+'/sheet-sync',{method:'post',contentType:'application/json',headers:{'X-RTM-Knowledge-Secret':secret},payload:JSON.stringify({rows:rows}),muteHttpExceptions:true});
  if(response.getResponseCode()!==200)throw new Error('Сервер: '+response.getContentText());
  const result=JSON.parse(response.getContentText()),docs=result.documents,byRow={};docs.forEach(function(d){byRow[d.sourceRow]=d;});
  docs.forEach(function(d){sheet.getRange(d.sourceRow,12,1,5).setValues([[RTM_API+'/documents/'+d.id,(d.lightTest.created?d.lightTest.title:'')+'; '+(d.fullTest.created?d.fullTest.title:''),formatList_(d.articleAssignments),formatList_(d.reviewers),formatList_(d.editors)]]);});
  refreshDirectory_(ss,result.directory,docs);SpreadsheetApp.getUi().alert('Готово: синхронизировано '+docs.length+' статей');
}
function refreshDirectory_(ss,directory,docs){var sheet=ss.getSheetByName('Н- Справочник')||ss.insertSheet('Н- Справочник');sheet.clearContents();sheet.getRange(1,1,1,5).setValues([['Все сотрудники','Структурная единица','Руководитель структурной единицы','Сотрудники этой единицы','Название статей и тестов']]);var rows=Math.max((directory.users||[]).length,(directory.departments||[]).length,docs.length*3),values=Array.from({length:rows},function(){return['','','','','']});(directory.users||[]).forEach(function(x,i){values[i][0]=x});(directory.departments||[]).forEach(function(x,i){values[i][1]=x.name;values[i][2]=x.head;values[i][3]=x.employees.join(', ')});var names=[];docs.forEach(function(d){names.push(d.title,d.lightTest.title,d.fullTest.title)});names.forEach(function(x,i){values[i][4]=x});if(values.length)sheet.getRange(2,1,values.length,5).setValues(values);}
