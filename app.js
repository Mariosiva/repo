const $ = (id)=>document.getElementById(id);
const LS_KEY = 'plan2150_v4_state';
const todayISO = () => new Date().toISOString().slice(0,10);
const uid = () => Math.random().toString(36).slice(2,10) + Date.now().toString(36).slice(-5);
const round = (n,d=0)=> Number.isFinite(+n)? Number((+n).toFixed(d)) : 0;
const fmt = (n,d=0)=> round(n,d).toLocaleString('es-CL',{maximumFractionDigits:d,minimumFractionDigits:d});
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

const seedFoods = [
  ['Trutro de pollo cocido sin piel',170,27,0,7,0,90,'Proteínas','Usar si se quitó piel y hueso antes de pesar carne cocida.'],
  ['Trutro de pollo cocido con piel',215,25,0,13,0,95,'Proteínas','Estimado; varía según piel/grasa.'],
  ['Pechuga de pollo cocida',165,31,0,3.6,0,75,'Proteínas','Cocida sin piel.'],
  ['Pollo asado desmenuzado sin piel',175,28,0,7,0,100,'Proteínas','Estimado.'],
  ['Huevo entero',143,12.6,0.7,9.5,0,142,'Proteínas','100 g equivale aprox. 2 huevos medianos.'],
  ['Clara de huevo',52,10.9,0.7,0.2,0,166,'Proteínas',''],
  ['Atún en agua drenado',116,25.5,0,1,0,300,'Proteínas','Revisar sodio de marca.'],
  ['Jurel al natural drenado',180,23,0,9,0,280,'Proteínas','Estimado.'],
  ['Salmón cocido',206,22,0,12,0,60,'Proteínas',''],
  ['Carne molida 5% cocida',170,26,0,6,0,70,'Proteínas',''],
  ['Carne molida 10% cocida',217,26,0,12,0,75,'Proteínas',''],
  ['Posta negra cocida',190,29,0,7,0,65,'Proteínas','Estimado.'],
  ['Cerdo pulpa cocida',220,27,0,12,0,70,'Proteínas',''],
  ['Quesillo',110,13,3,5,0,360,'Lácteos','Varía por marca.'],
  ['Yogur griego natural 0%',59,10,3.6,0.4,0,36,'Lácteos','Revisar marca.'],
  ['Yogur natural descremado',63,5.3,7,1.5,0,70,'Lácteos',''],
  ['Leche descremada',34,3.4,5,0.1,0,42,'Lácteos',''],
  ['Leche semidescremada',46,3.3,4.8,1.5,0,45,'Lácteos',''],
  ['Arroz blanco cocido',130,2.7,28,0.3,0.4,1,'Carbohidratos','Peso cocido.'],
  ['Arroz integral cocido',112,2.6,23,0.9,1.8,5,'Carbohidratos','Peso cocido.'],
  ['Papa cocida',87,1.9,20,0.1,1.8,4,'Carbohidratos','Buena saciedad.'],
  ['Camote cocido',90,2,21,0.2,3.3,36,'Carbohidratos',''],
  ['Fideos cocidos',158,5.8,31,0.9,1.8,1,'Carbohidratos','Peso cocido.'],
  ['Avena cruda',389,16.9,66,6.9,10.6,2,'Carbohidratos','Pesar en seco.'],
  ['Pan marraqueta',270,8.5,56,1.5,2.5,540,'Carbohidratos','Estimado; pesa unidad.'],
  ['Pan hallulla',300,8,52,7,2,550,'Carbohidratos','Estimado.'],
  ['Tortilla/wrap trigo',300,8,50,7,3,600,'Carbohidratos','Revisar etiqueta.'],
  ['Quinoa cocida',120,4.4,21,1.9,2.8,7,'Carbohidratos',''],
  ['Lentejas cocidas',116,9,20,0.4,7.9,2,'Legumbres',''],
  ['Porotos cocidos',127,8.7,23,0.5,6.4,2,'Legumbres',''],
  ['Garbanzos cocidos',164,8.9,27.4,2.6,7.6,7,'Legumbres',''],
  ['Arvejas cocidas',84,5.4,15,0.2,5.5,3,'Legumbres',''],
  ['Aceite de oliva',884,0,0,100,0,0,'Grasas','Medir con gramera/cucharita.'],
  ['Aceite vegetal',884,0,0,100,0,0,'Grasas',''],
  ['Palta',160,2,8.5,14.7,6.7,7,'Grasas',''],
  ['Maní',567,25.8,16.1,49.2,8.5,18,'Grasas',''],
  ['Almendras',579,21,22,50,12.5,1,'Grasas',''],
  ['Nueces',654,15,14,65,6.7,2,'Grasas',''],
  ['Mantequilla',717,0.9,0.1,81,0,11,'Grasas',''],
  ['Mayonesa',680,1,1,75,0,635,'Grasas',''],
  ['Lechuga',15,1.4,2.9,0.2,1.3,28,'Verduras',''],
  ['Tomate',18,0.9,3.9,0.2,1.2,5,'Verduras',''],
  ['Pepino',15,0.7,3.6,0.1,0.5,2,'Verduras',''],
  ['Zanahoria',41,0.9,10,0.2,2.8,69,'Verduras',''],
  ['Repollo',25,1.3,5.8,0.1,2.5,18,'Verduras',''],
  ['Brócoli cocido',35,2.4,7.2,0.4,3.3,41,'Verduras',''],
  ['Coliflor cocida',23,1.8,4.1,0.5,2.3,15,'Verduras',''],
  ['Zapallo italiano',17,1.2,3.1,0.3,1,8,'Verduras',''],
  ['Espinaca',23,2.9,3.6,0.4,2.2,79,'Verduras',''],
  ['Cebolla',40,1.1,9.3,0.1,1.7,4,'Verduras',''],
  ['Champiñones',22,3.1,3.3,0.3,1,5,'Verduras',''],
  ['Ensalada mixta sin aceite',25,1.2,5,0.2,2,15,'Verduras','Promedio; mejor agregar verduras separadas.'],
  ['Manzana',52,0.3,14,0.2,2.4,1,'Frutas',''],
  ['Plátano',89,1.1,23,0.3,2.6,1,'Frutas',''],
  ['Naranja',47,0.9,12,0.1,2.4,0,'Frutas',''],
  ['Pera',57,0.4,15,0.1,3.1,1,'Frutas',''],
  ['Frutilla',32,0.7,7.7,0.3,2,1,'Frutas',''],
  ['Arándanos',57,0.7,14.5,0.3,2.4,1,'Frutas',''],
  ['Uva',69,0.7,18,0.2,0.9,2,'Frutas',''],
  ['Sandía',30,0.6,7.6,0.2,0.4,1,'Frutas',''],
  ['Sopa de verduras casera',35,1.5,7,0.5,2,250,'Preparaciones','Depende de receta.'],
  ['Caldo de pollo desgrasado',15,2,1,0.5,0,300,'Preparaciones',''],
  ['Legumbres guisadas promedio',145,8,24,2,7,300,'Preparaciones','Registrar receta propia si puedes.'],
  ['Ensalada con 10g aceite',110,1,5,10,2,70,'Preparaciones','Estimado.'],
  ['Bebida zero',0,0,0,0,0,20,'Bebidas',''],
  ['Café sin azúcar',2,0.1,0,0,0,2,'Bebidas',''],
];

function defaultState(){
  return {
    settings:{goalHigh:2150, goalLow:2070, activeGoal:2150, protein:180, carbs:210, fat:62, fiber:30},
    foods: seedFoods.map(f=>({id:uid(), name:f[0], kcal:f[1], protein:f[2], carbs:f[3], fat:f[4], fiber:f[5], sodium:f[6], category:f[7], notes:f[8], system:true})),
    logs:[], tracks:[], recipes:[]
  }
}
let state = load();
let selectedQuickFoodId = null;
let selectedRecipeFoodId = null;
let recipeIngredients = [];

function load(){try{return JSON.parse(localStorage.getItem(LS_KEY))||defaultState()}catch(e){return defaultState()}}
function save(){localStorage.setItem(LS_KEY, JSON.stringify(state));}
function foodById(id){return state.foods.find(f=>f.id===id)}
function macroFor(food, grams){const g=(+grams||0)/100;return {kcal:food.kcal*g, protein:food.protein*g, carbs:food.carbs*g, fat:food.fat*g, fiber:food.fiber*g, sodium:(food.sodium||0)*g}}
function sumLogs(date){return state.logs.filter(l=>l.date===date).reduce((a,l)=>{a.kcal+=+l.kcal||0;a.protein+=+l.protein||0;a.carbs+=+l.carbs||0;a.fat+=+l.fat||0;a.fiber+=+l.fiber||0;return a},{kcal:0,protein:0,carbs:0,fat:0,fiber:0});}
function pct(v,t){return t>0? clamp((v/t)*100,0,160):0}

const tabs = [
  ['dashboard','Dashboard'],['log','Registro'],['foods','Alimentos'],['recipes','Recetas'],['batch','Batch pollo'],['track','Seguimiento'],['settings','Ajustes']
];
function buildTabs(){
  $('tabs').innerHTML=tabs.map(([id,label])=>`<button class="tabbtn ${id==='dashboard'?'active':''}" onclick="go('${id}')">${label}</button>`).join('');
}
function go(id){
  document.querySelectorAll('.section').forEach(s=>s.classList.toggle('active',s.id===id));
  document.querySelectorAll('.tabbtn').forEach((b,i)=>b.classList.toggle('active',tabs[i][0]===id));
  renderAll(); window.scrollTo({top:0,behavior:'smooth'});
}
window.go=go;

function init(){
  buildTabs();
  const d=todayISO();
  ['dashDate','logDate','batchDate','trackDate'].forEach(id=>$(id).value=d);
  $('todayPill').textContent = new Date().toLocaleDateString('es-CL',{weekday:'short',day:'2-digit',month:'short'});
  $('goalSelect').value = state.settings.activeGoal==state.settings.goalLow?'2070':state.settings.activeGoal==state.settings.goalHigh?'2150':'custom';
  $('customGoal').value = state.settings.activeGoal;
  ['setGoalHigh','setGoalLow','setProtein','setCarbs','setFat','setFiber'].forEach(id=>{});
  $('setGoalHigh').value=state.settings.goalHigh; $('setGoalLow').value=state.settings.goalLow; $('setProtein').value=state.settings.protein; $('setCarbs').value=state.settings.carbs; $('setFat').value=state.settings.fat; $('setFiber').value=state.settings.fiber;
  addEvents(); renderAll(); if('serviceWorker' in navigator){navigator.serviceWorker.register('./service-worker.js').catch(()=>{});} 
}
function addEvents(){
  $('dashDate').onchange=renderDashboard; $('logDate').onchange=renderLog; $('goalSelect').onchange=()=>{const v=$('goalSelect').value;state.settings.activeGoal = v==='2070'?state.settings.goalLow:v==='2150'?state.settings.goalHigh:(+$('customGoal').value||state.settings.activeGoal);save();renderDashboard();};
  $('customGoal').oninput=()=>{if($('goalSelect').value==='custom'){state.settings.activeGoal=+$('customGoal').value||state.settings.activeGoal;save();renderDashboard();}}
  setupSuggest('quickFood','quickSuggest',(f)=>{selectedQuickFoodId=f.id;$('quickFood').value=f.name;renderQuickPreview();});
  $('quickGrams').oninput=renderQuickPreview; $('quickAdd').onclick=addQuickLog;
  ['mealFilter','logSearch'].forEach(id=>$(id).oninput=renderLog); $('clearDay').onclick=clearVisibleDay; $('copyToday').onclick=copyPreviousDay;
  ['foodSearch','catFilter'].forEach(id=>$(id).oninput=renderFoods); $('saveFood').onclick=saveFoodForm; $('newFood').onclick=clearFoodForm;
  setupSuggest('recipeFoodSearch','recipeSuggest',(f)=>{selectedRecipeFoodId=f.id;$('recipeFoodSearch').value=f.name;});
  $('addIngredient').onclick=addRecipeIngredient; $('saveRecipe').onclick=saveRecipeAsFood; $('resetRecipe').onclick=resetRecipe;
  $('recipeFinalWeight').oninput=renderRecipeMacros;
  $('calcBatch').onclick=renderBatch; $('batchAdd').onclick=addBatchLog;
  $('saveTrack').onclick=saveTrack; $('saveSettings').onclick=saveSettings;
  $('exportJSON').onclick=exportJSON; $('exportCSV').onclick=exportCSV; $('importJSON').onchange=importJSON; $('factoryReset').onclick=factoryReset;
}
function setupSuggest(inputId, boxId, onPick){
  const input=$(inputId), box=$(boxId);
  input.addEventListener('input',()=>{
    const q=input.value.trim().toLowerCase(); selectedQuickFoodId = inputId==='quickFood'?null:selectedQuickFoodId; selectedRecipeFoodId = inputId==='recipeFoodSearch'?null:selectedRecipeFoodId;
    if(!q){box.classList.add('hidden');return;}
    const hits=state.foods.filter(f=>f.name.toLowerCase().includes(q)||f.category.toLowerCase().includes(q)).slice(0,12);
    box.innerHTML=hits.map(f=>`<div class="food-option" data-id="${f.id}"><b>${f.name}</b><br><span class="tiny muted">${f.category} · ${fmt(f.kcal)} kcal · P ${fmt(f.protein,1)} C ${fmt(f.carbs,1)} G ${fmt(f.fat,1)} /100g</span></div>`).join('')||'<div class="food-option muted">Sin resultados. Agrega este alimento en Base alimentos.</div>';
    box.classList.remove('hidden');
  });
  box.addEventListener('click',e=>{const el=e.target.closest('.food-option'); if(!el||!el.dataset.id)return; const f=foodById(el.dataset.id); onPick(f); box.classList.add('hidden');});
  document.addEventListener('click',e=>{if(!box.contains(e.target)&&e.target!==input) box.classList.add('hidden');});
}
function renderAll(){renderDashboard();renderLog();renderFoods();renderRecipes();renderBatchOptions();renderTrack();}
function renderDashboard(){
  const date=$('dashDate').value||todayISO(); const s=sumLogs(date); const set=state.settings;
  $('goalTag').textContent=`Meta ${fmt(set.activeGoal)} kcal`;
  const metrics=[['Kcal','kcal',set.activeGoal,'mKcal','barKcal','rKcal',''],['Protein','protein',set.protein,'mProtein','barProtein','rProtein',' g'],['Carbs','carbs',set.carbs,'mCarbs','barCarbs','rCarbs',' g'],['Fat','fat',set.fat,'mFat','barFat','rFat',' g']];
  metrics.forEach(([_,key,target,mid,bid,rid,suf])=>{const v=s[key];$(mid).textContent=fmt(v,key==='kcal'?0:1)+suf;const p=pct(v,target);$(bid).style.width=Math.min(p,100)+'%';$(bid).className='fill '+(v>target*1.08?'bad':v>target?'warn':'');$(rid).textContent=(target-v>=0?'Te quedan ':'Exceso ')+fmt(Math.abs(target-v),key==='kcal'?0:1)+suf;});
  renderTodayTable(date); drawKcalChart(); drawMacroChart(s); renderQuickPreview();
}
function renderTodayTable(date){
  const rows=state.logs.filter(l=>l.date===date).sort((a,b)=>a.created-b.created);
  $('todayTable').innerHTML='<tr><th>Comida</th><th>Alimento</th><th class="right">g</th><th class="right">kcal</th><th class="right">P</th><th></th></tr>'+rows.map(l=>`<tr><td>${l.meal}</td><td>${l.foodName}<br><span class="tiny muted">${l.note||''}</span></td><td class="right">${fmt(l.grams)}</td><td class="right">${fmt(l.kcal)}</td><td class="right">${fmt(l.protein,1)}</td><td class="right"><button class="btn ghost" onclick="delLog('${l.id}')">×</button></td></tr>`).join('');
}
function renderQuickPreview(){
  const f=foodById(selectedQuickFoodId); const g=+$('quickGrams').value||0;
  if(!f||!g){$('quickPreview').textContent='Selecciona alimento y gramos.';return;}
  const m=macroFor(f,g); $('quickPreview').innerHTML=`${fmt(g)} g de <b>${f.name}</b>: <span class="ok">${fmt(m.kcal)} kcal</span> · P ${fmt(m.protein,1)} g · C ${fmt(m.carbs,1)} g · G ${fmt(m.fat,1)} g · Fibra ${fmt(m.fiber,1)} g`;
}
function addQuickLog(){
  const f=foodById(selectedQuickFoodId); const grams=+$('quickGrams').value||0; if(!f||grams<=0){alert('Selecciona un alimento y gramos válidos.');return;}
  const m=macroFor(f,grams); state.logs.push({id:uid(),date:$('dashDate').value||todayISO(),meal:$('quickMeal').value,foodId:f.id,foodName:f.name,grams,note:$('quickNote').value.trim(),...m,created:Date.now()}); save(); $('quickGrams').value=''; $('quickNote').value=''; renderAll();
}
function delLog(id){state.logs=state.logs.filter(l=>l.id!==id);save();renderAll();} window.delLog=delLog;
function renderLog(){
  const date=$('logDate').value||todayISO(), meal=$('mealFilter').value, q=($('logSearch').value||'').toLowerCase();
  let rows=state.logs.filter(l=>l.date===date && (!meal||l.meal===meal) && (!q||l.foodName.toLowerCase().includes(q)||(l.note||'').toLowerCase().includes(q)));
  const total=rows.reduce((a,l)=>{a.kcal+=l.kcal;a.protein+=l.protein;a.carbs+=l.carbs;a.fat+=l.fat;a.fiber+=l.fiber;return a},{kcal:0,protein:0,carbs:0,fat:0,fiber:0});
  $('logTable').innerHTML=`<tr><th>Comida</th><th>Alimento</th><th class="right">g</th><th class="right">kcal</th><th class="right">P</th><th class="right">C</th><th class="right">G</th><th></th></tr>`+rows.map(l=>`<tr><td>${l.meal}</td><td>${l.foodName}<br><span class="tiny muted">${l.note||''}</span></td><td class="right">${fmt(l.grams)}</td><td class="right">${fmt(l.kcal)}</td><td class="right">${fmt(l.protein,1)}</td><td class="right">${fmt(l.carbs,1)}</td><td class="right">${fmt(l.fat,1)}</td><td class="right"><button class="btn ghost" onclick="delLog('${l.id}')">×</button></td></tr>`).join('')+`<tr><th colspan="3">Total</th><th class="right">${fmt(total.kcal)}</th><th class="right">${fmt(total.protein,1)}</th><th class="right">${fmt(total.carbs,1)}</th><th class="right">${fmt(total.fat,1)}</th><th></th></tr>`;
}
function clearVisibleDay(){const d=$('logDate').value; if(confirm('¿Borrar todas las comidas de '+d+'?')){state.logs=state.logs.filter(l=>l.date!==d);save();renderAll();}}
function copyPreviousDay(){
  const d=new Date($('logDate').value||todayISO()); const prev=new Date(d); prev.setDate(d.getDate()-1); const p=prev.toISOString().slice(0,10), target=d.toISOString().slice(0,10);
  const rows=state.logs.filter(l=>l.date===p); if(!rows.length){alert('No hay comidas el día anterior.');return;}
  rows.forEach(l=>state.logs.push({...l,id:uid(),date:target,created:Date.now()+Math.random()})); save(); renderAll();
}
function renderFoods(){
  const cats=[...new Set(state.foods.map(f=>f.category))].sort(); const old=$('catFilter').value; $('catFilter').innerHTML='<option value="">Todas</option>'+cats.map(c=>`<option>${c}</option>`).join(''); $('catFilter').value=old;
  const q=($('foodSearch').value||'').toLowerCase(), cat=$('catFilter').value;
  const rows=state.foods.filter(f=>(!cat||f.category===cat)&&(!q||f.name.toLowerCase().includes(q)||f.category.toLowerCase().includes(q))).sort((a,b)=>a.name.localeCompare(b.name));
  $('foodsTable').innerHTML='<tr><th>Alimento</th><th class="right">kcal</th><th class="right">P</th><th class="right">C</th><th class="right">G</th><th></th></tr>'+rows.map(f=>`<tr><td><b>${f.name}</b><br><span class="tiny muted">${f.category} · ${f.notes||''}</span></td><td class="right">${fmt(f.kcal)}</td><td class="right">${fmt(f.protein,1)}</td><td class="right">${fmt(f.carbs,1)}</td><td class="right">${fmt(f.fat,1)}</td><td class="right"><button class="btn ghost" onclick="editFood('${f.id}')">Editar</button></td></tr>`).join('');
}
function editFood(id){const f=foodById(id); ['Id','Name','Cat','Kcal','Protein','Carbs','Fat','Fiber','Sodium','Notes'].forEach(()=>{}); $('foodId').value=f.id;$('foodName').value=f.name;$('foodCat').value=f.category;$('foodKcal').value=f.kcal;$('foodProtein').value=f.protein;$('foodCarbs').value=f.carbs;$('foodFat').value=f.fat;$('foodFiber').value=f.fiber;$('foodSodium').value=f.sodium||0;$('foodNotes').value=f.notes||'';window.scrollTo({top:0,behavior:'smooth'});} window.editFood=editFood;
function clearFoodForm(){['foodId','foodName','foodCat','foodKcal','foodProtein','foodCarbs','foodFat','foodFiber','foodSodium','foodNotes'].forEach(id=>$(id).value='');}
function saveFoodForm(){
  const obj={id:$('foodId').value||uid(),name:$('foodName').value.trim(),category:$('foodCat').value.trim()||'Otros',kcal:+$('foodKcal').value||0,protein:+$('foodProtein').value||0,carbs:+$('foodCarbs').value||0,fat:+$('foodFat').value||0,fiber:+$('foodFiber').value||0,sodium:+$('foodSodium').value||0,notes:$('foodNotes').value.trim(),system:false};
  if(!obj.name){alert('Falta nombre.');return;} const i=state.foods.findIndex(f=>f.id===obj.id); if(i>=0) state.foods[i]={...state.foods[i],...obj}; else state.foods.push(obj); save(); clearFoodForm(); renderAll();
}
function renderRecipes(){
  $('recipesTable').innerHTML='<tr><th>Receta guardada</th><th class="right">kcal</th><th class="right">P</th><th></th></tr>'+state.recipes.map(r=>`<tr><td><b>${r.name}</b><br><span class="tiny muted">${r.finalWeight} g finales · alimento creado en base</span></td><td class="right">${fmt(r.per100.kcal)}</td><td class="right">${fmt(r.per100.protein,1)}</td><td class="right"><button class="btn ghost" onclick="delRecipe('${r.id}')">×</button></td></tr>`).join('');
  renderIngredients(); renderRecipeMacros();
}
function addRecipeIngredient(){const f=foodById(selectedRecipeFoodId); const grams=+$('recipeIngredientGrams').value||0; if(!f||grams<=0){alert('Selecciona alimento y gramos.');return;} recipeIngredients.push({foodId:f.id,foodName:f.name,grams,...macroFor(f,grams)}); $('recipeFoodSearch').value=''; $('recipeIngredientGrams').value=''; selectedRecipeFoodId=null; renderRecipes();}
function renderIngredients(){ $('ingredientsTable').innerHTML='<tr><th>Ingrediente</th><th class="right">g</th><th class="right">kcal</th><th></th></tr>'+recipeIngredients.map((x,i)=>`<tr><td>${x.foodName}</td><td class="right">${fmt(x.grams)}</td><td class="right">${fmt(x.kcal)}</td><td class="right"><button class="btn ghost" onclick="recipeIngredients.splice(${i},1);renderRecipes()">×</button></td></tr>`).join(''); }
function renderRecipeMacros(){const final=+$('recipeFinalWeight').value||0; const totals=recipeIngredients.reduce((a,x)=>{['kcal','protein','carbs','fat','fiber','sodium'].forEach(k=>a[k]+=x[k]||0);return a},{kcal:0,protein:0,carbs:0,fat:0,fiber:0,sodium:0}); if(!final){$('recipeMacros').textContent='Ingresa el peso final cocido.';return;} const factor=100/final; $('recipeMacros').innerHTML=`${fmt(totals.kcal*factor)} kcal · P ${fmt(totals.protein*factor,1)} g · C ${fmt(totals.carbs*factor,1)} g · G ${fmt(totals.fat*factor,1)} g · Fibra ${fmt(totals.fiber*factor,1)} g`;}
function saveRecipeAsFood(){const name=$('recipeName').value.trim(), final=+$('recipeFinalWeight').value||0; if(!name||!final||!recipeIngredients.length){alert('Falta nombre, peso final o ingredientes.');return;} const totals=recipeIngredients.reduce((a,x)=>{['kcal','protein','carbs','fat','fiber','sodium'].forEach(k=>a[k]+=x[k]||0);return a},{kcal:0,protein:0,carbs:0,fat:0,fiber:0,sodium:0}); const factor=100/final; const per100={kcal:totals.kcal*factor,protein:totals.protein*factor,carbs:totals.carbs*factor,fat:totals.fat*factor,fiber:totals.fiber*factor,sodium:totals.sodium*factor}; const food={id:uid(),name,category:'Recetas',...per100,notes:'Receta propia por lote',system:false}; state.foods.push(food); state.recipes.push({id:uid(),name,finalWeight:final,ingredients:recipeIngredients,per100,foodId:food.id}); save(); resetRecipe(); renderAll();}
function resetRecipe(){recipeIngredients=[];$('recipeName').value='';$('recipeFinalWeight').value='';renderRecipes();}
function delRecipe(id){const r=state.recipes.find(x=>x.id===id); if(confirm('¿Borrar receta? El alimento creado queda en la base salvo que lo borres aparte.')){state.recipes=state.recipes.filter(x=>x.id!==id);save();renderRecipes();}} window.delRecipe=delRecipe;
function renderBatchOptions(){const opts=state.foods.filter(f=>f.name.toLowerCase().includes('trutro')||f.name.toLowerCase().includes('pollo')).map(f=>`<option value="${f.id}">${f.name}</option>`).join(''); $('batchFood').innerHTML=opts;}
function renderBatch(){const raw=+$('batchRaw').value||0,cooked=+$('batchCooked').value||0,portion=+$('batchPortion').value||0,f=foodById($('batchFood').value); if(!cooked||!portion||!f){$('batchResult').textContent='Ingresa peso cocido final para calcular porciones.';return;} const n=Math.floor(cooked/portion), merma=raw?100-(cooked/raw*100):0, m=macroFor(f,portion); $('batchResult').innerHTML=`Peso útil: <b>${fmt(cooked)} g</b><br>Merma aprox: <b>${fmt(merma,1)}%</b><br>Porciones de ${fmt(portion)} g: <b>${n}</b> completas<br>Por porción: <span class="ok">${fmt(m.kcal)} kcal</span> · P ${fmt(m.protein,1)} g · C ${fmt(m.carbs,1)} g · G ${fmt(m.fat,1)} g`;}
function addBatchLog(){const f=foodById($('batchFood').value); const grams=+$('batchServe').value||0; if(!f||!grams){alert('Falta pollo o gramos.');return;} const m=macroFor(f,grams); state.logs.push({id:uid(),date:$('batchDate').value||todayISO(),meal:$('batchMeal').value,foodId:f.id,foodName:f.name,grams,note:'Batch pollo',...m,created:Date.now()}); save(); renderAll(); alert('Pollo agregado al registro.');}
function saveTrack(){const d=$('trackDate').value||todayISO(); const existing=state.tracks.findIndex(t=>t.date===d); const t={date:d,weight:+$('trackWeight').value||null,waist:+$('trackWaist').value||null,hunger:+$('trackHunger').value||null,energy:+$('trackEnergy').value||null,sleep:+$('trackSleep').value||null,training:$('trackTraining').value,adherence:+$('trackAdherence').value||null,notes:$('trackNotes').value.trim()}; if(existing>=0)state.tracks[existing]=t;else state.tracks.push(t); save(); renderTrack();}
function renderTrack(){const rows=[...state.tracks].sort((a,b)=>b.date.localeCompare(a.date)); $('trackTable').innerHTML='<tr><th>Fecha</th><th class="right">Peso</th><th class="right">Cintura</th><th class="right">Hambre</th><th class="right">Energía</th><th>Entreno</th><th></th></tr>'+rows.map(t=>`<tr><td>${t.date}<br><span class="tiny muted">${t.notes||''}</span></td><td class="right">${t.weight??''}</td><td class="right">${t.waist??''}</td><td class="right">${t.hunger??''}</td><td class="right">${t.energy??''}</td><td>${t.training||''}</td><td class="right"><button class="btn ghost" onclick="delTrack('${t.date}')">×</button></td></tr>`).join(''); drawBodyChart();}
function delTrack(date){state.tracks=state.tracks.filter(t=>t.date!==date);save();renderTrack();} window.delTrack=delTrack;
function saveSettings(){state.settings.goalHigh=+$('setGoalHigh').value||2150;state.settings.goalLow=+$('setGoalLow').value||2070;state.settings.protein=+$('setProtein').value||180;state.settings.carbs=+$('setCarbs').value||210;state.settings.fat=+$('setFat').value||62;state.settings.fiber=+$('setFiber').value||30;state.settings.activeGoal=state.settings.goalHigh; $('goalSelect').value='2150'; save(); renderAll(); alert('Configuración guardada.');}
function drawAxes(ctx,w,h){ctx.clearRect(0,0,w,h);ctx.strokeStyle='#243047';ctx.lineWidth=1;for(let i=0;i<5;i++){let y=30+i*(h-55)/4;ctx.beginPath();ctx.moveTo(40,y);ctx.lineTo(w-12,y);ctx.stroke();}ctx.fillStyle='#94a3b8';ctx.font='12px system-ui';}
function drawKcalChart(){const c=$('chartKcal'),ctx=c.getContext('2d'),w=c.width,h=c.height;drawAxes(ctx,w,h); const days=[]; for(let i=13;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);days.push(d.toISOString().slice(0,10));} const vals=days.map(d=>sumLogs(d).kcal); const max=Math.max(state.settings.activeGoal, ...vals, 100); ctx.strokeStyle='#38bdf8';ctx.lineWidth=3;ctx.beginPath();vals.forEach((v,i)=>{const x=45+i*(w-70)/13;const y=h-25-(v/max)*(h-60); if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);});ctx.stroke(); ctx.strokeStyle='#22c55e';ctx.setLineDash([6,5]); const gy=h-25-(state.settings.activeGoal/max)*(h-60);ctx.beginPath();ctx.moveTo(40,gy);ctx.lineTo(w-12,gy);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#94a3b8';days.forEach((d,i)=>{if(i%3===0)ctx.fillText(d.slice(5),45+i*(w-70)/13-12,h-7)});ctx.fillText('Meta',w-48,gy-5);}
function drawMacroChart(s){const c=$('chartMacros'),ctx=c.getContext('2d'),w=c.width,h=c.height;drawAxes(ctx,w,h); const items=[['P',s.protein,state.settings.protein],['C',s.carbs,state.settings.carbs],['G',s.fat,state.settings.fat],['Fibra',s.fiber,state.settings.fiber]]; const max=Math.max(...items.map(x=>x[2]),1); items.forEach((it,i)=>{const x=60+i*(w-100)/4,bw=45; const ph=(it[1]/max)*(h-70), th=(it[2]/max)*(h-70);ctx.fillStyle='#1f2937';ctx.fillRect(x,h-25-th,bw,th);ctx.fillStyle=it[1]>it[2]?'#f59e0b':'#22c55e';ctx.fillRect(x,h-25-ph,bw,ph);ctx.fillStyle='#cbd5e1';ctx.fillText(it[0],x+8,h-8);ctx.fillText(fmt(it[1],0)+'g',x-2,h-32-ph);});}
function drawBodyChart(){const c=$('chartBody'),ctx=c.getContext('2d'),w=c.width,h=c.height;drawAxes(ctx,w,h); const rows=[...state.tracks].sort((a,b)=>a.date.localeCompare(b.date)).slice(-20); const vals=rows.map(r=>r.weight).filter(Boolean); if(!rows.length||!vals.length){ctx.fillStyle='#94a3b8';ctx.fillText('Sin datos de peso todavía.',50,60);return;} const min=Math.min(...vals)-1,max=Math.max(...vals)+1; ctx.strokeStyle='#38bdf8';ctx.lineWidth=3;ctx.beginPath();rows.forEach((r,i)=>{if(!r.weight)return;const x=45+i*(w-70)/Math.max(rows.length-1,1);const y=h-25-((r.weight-min)/(max-min))*(h-60); if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);});ctx.stroke(); ctx.fillStyle='#94a3b8';ctx.fillText('Peso kg',50,20);}
function exportJSON(){download('plan_alimenticio_respaldo.json', JSON.stringify(state,null,2), 'application/json');}
function exportCSV(){const head='fecha,comida,alimento,gramos,kcal,proteina,carbohidratos,grasas,fibra,nota\n'; const rows=state.logs.map(l=>[l.date,l.meal,l.foodName,l.grams,round(l.kcal,1),round(l.protein,1),round(l.carbs,1),round(l.fat,1),round(l.fiber,1),l.note||''].map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n'); download('registro_comidas.csv', head+rows, 'text/csv;charset=utf-8');}
function download(name, content, type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;a.click();URL.revokeObjectURL(a.href);}
function importJSON(e){const file=e.target.files[0]; if(!file)return; const r=new FileReader(); r.onload=()=>{try{const obj=JSON.parse(r.result); if(!obj.foods||!obj.logs) throw new Error('formato'); state=obj; save(); renderAll(); alert('Respaldo importado.');}catch(err){alert('JSON inválido.')}}; r.readAsText(file);}
function factoryReset(){if(confirm('Esto borra todos los datos locales. ¿Seguro?')){localStorage.removeItem(LS_KEY);state=defaultState();save();location.reload();}}
init();
