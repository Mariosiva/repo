const $ = (id) => document.getElementById(id);
const LS_KEY = 'nutritrack_premium_v1';
const todayISO = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-5);
const round = (n, d = 0) => Number.isFinite(+n) ? Number((+n).toFixed(d)) : 0;
const fmt = (n, d = 0) => round(n, d).toLocaleString('es-ES', { maximumFractionDigits: d, minimumFractionDigits: d });
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

// ============ DATOS LOCALES ============
const seedFoods = [
  ['Trutro de pollo cocido sin piel', 170, 27, 0, 7, 0, 90, 'Proteínas'],
  ['Pechuga de pollo cocida', 165, 31, 0, 3.6, 0, 75, 'Proteínas'],
  ['Huevo entero', 143, 12.6, 0.7, 9.5, 0, 142, 'Proteínas'],
  ['Atún en agua drenado', 116, 25.5, 0, 1, 0, 300, 'Proteínas'],
  ['Arroz blanco cocido', 130, 2.7, 28, 0.3, 0.4, 1, 'Carbohidratos'],
  ['Papa cocida', 87, 1.9, 20, 0.1, 1.8, 4, 'Carbohidratos'],
  ['Pan marraqueta', 270, 8.5, 56, 1.5, 2.5, 540, 'Carbohidratos'],
  ['Lentejas cocidas', 116, 9, 20, 0.4, 7.9, 2, 'Legumbres'],
  ['Garbanzos cocidos', 164, 8.9, 27.4, 2.6, 7.6, 7, 'Legumbres'],
  ['Aceite de oliva', 884, 0, 0, 100, 0, 0, 'Grasas'],
  ['Palta', 160, 2, 8.5, 14.7, 6.7, 7, 'Grasas'],
  ['Lechuga', 15, 1.4, 2.9, 0.2, 1.3, 28, 'Verduras'],
  ['Brócoli cocido', 35, 2.4, 7.2, 0.4, 3.3, 41, 'Verduras'],
  ['Manzana', 52, 0.3, 14, 0.2, 2.4, 1, 'Frutas'],
  ['Plátano', 89, 1.1, 23, 0.3, 2.6, 1, 'Frutas'],
];

const substitutes = {
  'azúcar': { items: ['Stevia', 'Eritritol', 'Xilitol', 'Aspartame'], notes: '0 kcal alternativas' },
  'harina': { items: ['Harina almendra', 'Harina coco', 'Psyllium', 'Harina integral'], notes: 'Bajas en carbs' },
  'mantequilla': { items: ['Aceite oliva', 'Ghee', 'Aceite coco', 'Puré frutos secos'], notes: 'Grasas saludables' },
  'pan': { items: ['Lechuga', 'Coliflor', 'Pan integral', 'Tortillas corn'], notes: 'Alternativas bajas carb' },
  'pasta': { items: ['Calabacín espagueti', 'Shirataki', 'Lentejas', 'Chickpea pasta'], notes: 'Alto en proteína' },
  'arroz': { items: ['Arroz integral', 'Quinoa', 'Cebada', 'Coliflor'], notes: 'Más fibra' },
};

function defaultState() {
  return {
    settings: { goalHigh: 2150, goalLow: 2070, activeGoal: 2150, protein: 180, carbs: 210, fat: 62, fiber: 30 },
    foods: seedFoods.map(f => ({
      id: uid(),
      name: f[0],
      kcal: f[1],
      protein: f[2],
      carbs: f[3],
      fat: f[4],
      fiber: f[5],
      sodium: f[6],
      category: f[7],
      system: true
    })),
    logs: [],
    tracks: []
  };
}

let state = load();
let selectedFood = null;

function load() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || defaultState();
  } catch (e) {
    return defaultState();
  }
}

function save() {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

// ============ FUNCIONES UTILITARIAS ============
function foodById(id) {
  return state.foods.find(f => f.id === id);
}

function macroFor(food, grams) {
  const g = (+grams || 0) / 100;
  return {
    kcal: food.kcal * g,
    protein: food.protein * g,
    carbs: food.carbs * g,
    fat: food.fat * g,
    fiber: food.fiber * g,
    sodium: (food.sodium || 0) * g
  };
}

function sumLogs(date) {
  return state.logs.filter(l => l.date === date).reduce((a, l) => {
    a.kcal += +l.kcal || 0;
    a.protein += +l.protein || 0;
    a.carbs += +l.carbs || 0;
    a.fat += +l.fat || 0;
    a.fiber += +l.fiber || 0;
    return a;
  }, { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
}

function pct(v, t) {
  return t > 0 ? clamp((v / t) * 100, 0, 160) : 0;
}

// ============ TABS & NAVIGATION ============
const tabs = [
  ['dashboard', '📊 Dashboard'],
  ['search', '🔍 USDA'],
  ['recipes', '🥗 Recetas'],
  ['substitutes', '⚡ Sustitutos'],
  ['log', '📝 Registro'],
  ['settings', '⚙️ Ajustes']
];

function buildTabs() {
  $('tabs').innerHTML = tabs.map(([id, label]) =>
    `<button class="tabbtn ${id === 'dashboard' ? 'active' : ''}" onclick="go('${id}')">${label}</button>`
  ).join('');
}

window.go = function (id) {
  document.querySelectorAll('.section').forEach(s => s.classList.toggle('active', s.id === id));
  document.querySelectorAll('.tabbtn').forEach((b, i) => b.classList.toggle('active', tabs[i][0] === id));
  renderAll();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ============ INICIALIZACIÓN ============
function init() {
  buildTabs();
  const d = todayISO();
  $('dashDate').value = d;
  $('logDate').value = d;
  $('todayPill').textContent = new Date().toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' });

  addEvents();
  renderAll();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').catch(() => { });
  }
}

function addEvents() {
  // Dashboard
  $('dashDate').onchange = renderDashboard;
  $('goalSelect').onchange = () => {
    const v = $('goalSelect').value;
    state.settings.activeGoal = v === '2070' ? state.settings.goalLow : v === '2150' ? state.settings.goalHigh : +$('customGoal').value;
    save();
    renderDashboard();
  };
  $('customGoal').oninput = () => {
    if ($('goalSelect').value === 'custom') {
      state.settings.activeGoal = +$('customGoal').value || state.settings.activeGoal;
      save();
      renderDashboard();
    }
  };

  // Quick add
  setupSuggest('quickFood', 'quickSuggest', (f) => {
    selectedFood = f;
    $('quickFood').value = f.name;
    renderQuickPreview();
  });
  $('quickGrams').oninput = renderQuickPreview;
  $('quickAdd').onclick = addQuickLog;

  // USDA Search
  setupSuggest('usdaSearch', 'usdaSuggest', (f) => {
    selectedFood = f;
    $('usdaSearch').value = f.name;
    renderUSDADetail(f);
  });
  $('usdaGrams').oninput = renderUSDADetail;

  // Recetas
  $('dietType').onchange = searchRecipes;
  $('searchRecipes').onclick = searchRecipes;

  // Sustitutos
  setupSuggest('substituteSearch', 'substituteSuggest', (item) => {
    $('substituteSearch').value = item;
    renderSubstitutes(item);
  });

  // Log
  $('logDate').onchange = renderLog;
  $('mealFilter').oninput = renderLog;
  $('clearDay').onclick = clearVisibleDay;
  $('copyToday').onclick = copyPreviousDay;

  // Configuración
  $('saveSettings').onclick = saveSettings;
  $('exportJSON').onclick = exportJSON;
  $('exportCSV').onclick = exportCSV;
  $('importJSON').onchange = importJSON;
  $('factoryReset').onclick = factoryReset;
}

// ============ SUGGEST BOX ============
function setupSuggest(inputId, boxId, onPick) {
  const input = $(inputId);
  const box = $(boxId);

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      box.classList.add('hidden');
      return;
    }

    const hits = state.foods.filter(f =>
      f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
    ).slice(0, 12);

    box.innerHTML = hits.map(f =>
      `<div class="food-option" onclick="selectFoodSuggest('${f.id}', '${inputId}', '${boxId}')">
        <b>${f.name}</b><br>
        <span class="tiny muted">${f.category} · ${fmt(f.kcal)} kcal · P ${fmt(f.protein, 1)}g</span>
      </div>`
    ).join('');

    box.classList.remove('hidden');
  });

  document.addEventListener('click', e => {
    if (!box.contains(e.target) && e.target !== input) {
      box.classList.add('hidden');
    }
  });
}

window.selectFoodSuggest = function (foodId, inputId, boxId) {
  const f = foodById(foodId);
  selectedFood = f;
  $(inputId).value = f.name;
  $(boxId).classList.add('hidden');

  if (inputId === 'usdaSearch') {
    renderUSDADetail(f);
  } else if (inputId === 'quickFood') {
    renderQuickPreview();
  }
};

// ============ DASHBOARD ============
function renderDashboard() {
  const date = $('dashDate').value || todayISO();
  const s = sumLogs(date);
  const set = state.settings;

  $('goalTag').textContent = `Meta ${fmt(set.activeGoal)} kcal`;

  const metrics = [
    ['Calorías', 'kcal', set.activeGoal, 'mKcal', 'barKcal', ''],
    ['Proteína', 'protein', set.protein, 'mProtein', 'barProtein', ' g'],
    ['Carbohidratos', 'carbs', set.carbs, 'mCarbs', 'barCarbs', ' g'],
    ['Grasas', 'fat', set.fat, 'mFat', 'barFat', ' g']
  ];

  metrics.forEach(([label, key, target, mid, bid, suf]) => {
    const v = s[key];
    $(mid).textContent = fmt(v, key === 'kcal' ? 0 : 1) + suf;
    const p = pct(v, target);
    $(bid).style.width = Math.min(p, 100) + '%';
  });

  renderTodayTable(date);
  renderQuickPreview();
}

function renderTodayTable(date) {
  const rows = state.logs.filter(l => l.date === date).sort((a, b) => a.created - b.created);
  $('todayTable').innerHTML = '<tr><th>Comida</th><th>Alimento</th><th class="right">g</th><th class="right">kcal</th><th class="right">P</th><th></th></tr>' +
    rows.map(l => `<tr><td>${l.meal}</td><td>${l.foodName}</td><td class="right">${fmt(l.grams)}</td><td class="right">${fmt(l.kcal, 1)}</td><td class="right">${fmt(l.protein, 1)}</td><td><button class="btn warn" style="padding:4px 8px;font-size:11px" onclick="delLog('${l.id}')">✕</button></td></tr>`).join('');
}

function renderQuickPreview() {
  if (!selectedFood) {
    $('quickPreview').textContent = 'Selecciona alimento y gramos.';
    return;
  }

  const g = +$('quickGrams').value || 0;
  if (!g) {
    $('quickPreview').textContent = 'Ingresa los gramos.';
    return;
  }

  const m = macroFor(selectedFood, g);
  $('quickPreview').innerHTML = `${fmt(g)} g de <b>${selectedFood.name}</b>: <span class="ok">${fmt(m.kcal)} kcal</span> · P ${fmt(m.protein, 1)}g · C ${fmt(m.carbs, 1)}g · G ${fmt(m.fat, 1)}g`;
}

function addQuickLog() {
  if (!selectedFood || !$('quickGrams').value) {
    alert('Selecciona alimento y gramos');
    return;
  }

  const grams = +$('quickGrams').value;
  const m = macroFor(selectedFood, grams);
  const date = $('dashDate').value || todayISO();

  state.logs.push({
    id: uid(),
    date,
    meal: $('quickMeal').value,
    foodId: selectedFood.id,
    foodName: selectedFood.name,
    grams,
    kcal: m.kcal,
    protein: m.protein,
    carbs: m.carbs,
    fat: m.fat,
    fiber: m.fiber,
    created: Date.now()
  });

  save();
  $('quickGrams').value = '';
  $('quickFood').value = '';
  selectedFood = null;
  renderDashboard();
}

window.delLog = function (id) {
  state.logs = state.logs.filter(l => l.id !== id);
  save();
  renderAll();
};

// ============ BÚSQUEDA USDA ============
function renderUSDADetail(food) {
  if (!food) return;

  const g = +$('usdaGrams').value || 100;
  const m = macroFor(food, g);

  const html = `
    <div class="card" style="margin-top:16px">
      <h3>${food.name}</h3>
      <div class="grid grid4 mt">
        <div class="nutrient-card">
          <div class="label">Kcal</div>
          <div class="value">${fmt(m.kcal)}</div>
        </div>
        <div class="nutrient-card">
          <div class="label">Proteína</div>
          <div class="value">${fmt(m.protein, 1)}g</div>
        </div>
        <div class="nutrient-card">
          <div class="label">Carbohidratos</div>
          <div class="value">${fmt(m.carbs, 1)}g</div>
        </div>
        <div class="nutrient-card">
          <div class="label">Grasas</div>
          <div class="value">${fmt(m.fat, 1)}g</div>
        </div>
      </div>
      <div class="grid grid3 mt">
        <div>
          <label>Fibra</label>
          <input value="${fmt(m.fiber, 1)}g" readonly>
        </div>
        <div>
          <label>Sodio</label>
          <input value="${fmt(m.sodium)}mg" readonly>
        </div>
        <div style="display:flex;align-items:end">
          <button class="btn" style="width:100%;margin:0" onclick="addUSDAFood()">Agregar a comida</button>
        </div>
      </div>
    </div>
  `;

  $('usdaResults').innerHTML = html;
}

window.addUSDAFood = function () {
  if (!selectedFood || !$('usdaGrams').value) {
    alert('Selecciona un alimento y gramos');
    return;
  }

  const grams = +$('usdaGrams').value;
  const m = macroFor(selectedFood, grams);
  const date = todayISO();

  state.logs.push({
    id: uid(),
    date,
    meal: 'Colación',
    foodId: selectedFood.id,
    foodName: selectedFood.name,
    grams,
    kcal: m.kcal,
    protein: m.protein,
    carbs: m.carbs,
    fat: m.fat,
    fiber: m.fiber,
    created: Date.now()
  });

  save();
  alert('✅ Agregado a ' + date);
  $('usdaSearch').value = '';
  $('usdaGrams').value = '100';
  $('usdaResults').innerHTML = '';
};

// ============ RECETAS SALUDABLES ============
async function searchRecipes() {
  const dietType = $('dietType').value;
  const ingredients = $('recipeIngredients').value;

  $('recipesContainer').innerHTML = '<div class="loading" style="margin:20px"></div>';

  try {
    let url = 'https://www.themealdb.com/api/json/v1/1';

    if (ingredients) {
      url += `/search.php?s=${encodeURIComponent(ingredients)}`;
    } else if (dietType) {
      url += `/filter.php?c=${encodeURIComponent(dietType)}`;
    } else {
      url += '/random.php';
    }

    const res = await fetch(url);
    const data = await res.json();
    const meals = data.meals || [];

    if (meals.length === 0) {
      $('recipesContainer').innerHTML = '<p class="muted" style="text-align:center;padding:40px">No se encontraron recetas</p>';
      return;
    }

    $('recipesContainer').innerHTML = meals.slice(0, 6).map(meal => `
      <div class="card">
        <img src="${meal.strMealThumb}" style="width:100%;border-radius:12px;margin-bottom:12px;height:200px;object-fit:cover">
        <h3>${meal.strMeal}</h3>
        <p class="small muted">${meal.strCategory || 'Receta'}</p>
        <button class="btn secondary mt" onclick="showMealDetail(${meal.idMeal})" style="width:100%">Ver detalles</button>
      </div>
    `).join('');
  } catch (e) {
    console.error('Error:', e);
    $('recipesContainer').innerHTML = '<p class="warn-text">Error al buscar recetas</p>';
  }
}

window.showMealDetail = async function (mealId) {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await res.json();
    const meal = data.meals?.[0];

    if (!meal) return;

    let ingredients = '';
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ing) ingredients += `<li>${measure} ${ing}</li>`;
    }

    alert(`${meal.strMeal}\n\nCategoría: ${meal.strCategory}\nCocina: ${meal.strArea}\n\nIngredientes:\n${ingredients.replace(/<li>/g, '• ').replace(/<\/li>/g, '\n')}`);
  } catch (e) {
    console.error('Error:', e);
  }
};

// ============ SUSTITUTOS INTELIGENTES ============
function renderSubstitutes(ingredient) {
  const key = Object.keys(substitutes).find(k => k.toLowerCase().includes(ingredient.toLowerCase()));

  if (!key) {
    $('substitutesContainer').innerHTML = `<p class="muted">No hay sustitutos para "${ingredient}"</p>`;
    return;
  }

  const subs = substitutes[key];
  $('substitutesContainer').innerHTML = `
    <div class="card">
      <h3>Sustitutos para: <span class="substitute-badge">${key}</span></h3>
      <p class="small muted mt">${subs.notes}</p>
      <div class="grid grid2 mt">
        ${subs.items.map(item => `
          <div class="card" style="background:rgba(255,107,157,0.1);border-color:var(--accent3)">
            <h4 style="margin:0;color:var(--accent3)">${item}</h4>
            <p class="small muted" style="margin:8px 0 0">Alternativa saludable</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ============ REGISTRO ============
function renderLog() {
  const date = $('logDate').value || todayISO();
  const meal = $('mealFilter').value;
  let rows = state.logs.filter(l => l.date === date && (!meal || l.meal === meal));

  const total = rows.reduce((a, l) => {
    a.kcal += l.kcal;
    a.protein += l.protein;
    a.carbs += l.carbs;
    a.fat += l.fat;
    return a;
  }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });

  $('logTable').innerHTML = '<tr><th>Comida</th><th>Alimento</th><th class="right">g</th><th class="right">kcal</th><th class="right">P</th><th class="right">C</th><th></th></tr>' +
    rows.map(l => `<tr><td>${l.meal}</td><td>${l.foodName}</td><td class="right">${fmt(l.grams)}</td><td class="right">${fmt(l.kcal, 1)}</td><td class="right">${fmt(l.protein, 1)}</td><td class="right">${fmt(l.carbs, 1)}</td><td><button class="btn warn" style="padding:4px 8px;font-size:11px" onclick="delLog('${l.id}')">✕</button></td></tr>`).join('') +
    `<tr style="font-weight:bold;background:rgba(0,217,255,0.1)"><td>TOTAL</td><td></td><td class="right">${fmt(rows.length)}</td><td class="right">${fmt(total.kcal, 1)}</td><td class="right">${fmt(total.protein, 1)}</td><td class="right">${fmt(total.carbs, 1)}</td><td></td></tr>`;
}

function clearVisibleDay() {
  const d = $('logDate').value;
  if (confirm('¿Borrar todas las comidas de ' + d + '?')) {
    state.logs = state.logs.filter(l => l.date !== d);
    save();
    renderAll();
  }
}

function copyPreviousDay() {
  const d = new Date($('logDate').value || todayISO());
  const prev = new Date(d);
  prev.setDate(d.getDate() - 1);
  const p = prev.toISOString().slice(0, 10);
  const target = d.toISOString().slice(0, 10);
  const rows = state.logs.filter(l => l.date === p);

  if (!rows.length) {
    alert('No hay comidas el día anterior');
    return;
  }

  rows.forEach(l => state.logs.push({ ...l, id: uid(), date: target, created: Date.now() }));
  save();
  renderAll();
}

// ============ CONFIGURACIÓN ============
function saveSettings() {
  state.settings.goalHigh = +$('setGoalHigh').value || 2150;
  state.settings.goalLow = +$('setGoalLow').value || 2070;
  state.settings.protein = +$('setProtein').value || 180;
  state.settings.carbs = +$('setCarbs').value || 210;
  state.settings.fat = +$('setFat').value || 62;
  state.settings.fiber = +$('setFiber').value || 30;
  save();
  alert('✅ Cambios guardados');
}

function exportJSON() {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }));
  a.download = 'nutritrack_backup.json';
  a.click();
}

function exportCSV() {
  const head = 'fecha,comida,alimento,gramos,kcal,proteina,carbohidratos,grasas\n';
  const rows = state.logs.map(l => [l.date, l.meal, l.foodName, l.grams, round(l.kcal, 1), round(l.protein, 1), round(l.carbs, 1), round(l.fat, 1)].join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([head + rows], { type: 'text/csv' }));
  a.download = 'nutritrack_registro.csv';
  a.click();
}

function importJSON(e) {
  const file = e.target.files[0];
  if (!file) return;

  const r = new FileReader();
  r.onload = () => {
    try {
      const obj = JSON.parse(r.result);
      if (!obj.foods || !obj.logs) throw new Error('Formato inválido');
      state = obj;
      save();
      location.reload();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };
  r.readAsText(file);
}

function factoryReset() {
  if (confirm('¿Borrar todos los datos locales?')) {
    localStorage.removeItem(LS_KEY);
    state = defaultState();
    save();
    location.reload();
  }
}

function renderAll() {
  renderDashboard();
  renderLog();
}

window.addEventListener('DOMContentLoaded', init);
