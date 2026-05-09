// APIs Configuration
const CONFIG = {
  // USDA FoodData Central API
  USDA: {
    API_KEY: 'YOUR_USDA_API_KEY', // Obtén en: https://fdc.nal.usda.gov/api-key-signup.html
    BASE_URL: 'https://api.nal.usda.gov/fdc/v1'
  },

  // Spoonacular API (Recetas)
  SPOONACULAR: {
    API_KEY: 'YOUR_SPOONACULAR_API_KEY', // Obtén en: https://spoonacular.com/food-api
    BASE_URL: 'https://api.spoonacular.com/recipes'
  },

  // Alternativas de APIs gratuitas para recetas
  FREE_RECIPE_APIS: {
    // TheMealDB - Completamente gratis, sin API key
    THEMEALDB: {
      BASE_URL: 'https://www.themealdb.com/api/json/v1/1',
      // Endpoints: search.php?s=name, filter.php?c=category, search.php?f=letter
    },
    
    // Edamam (tiene tier gratuito limitado)
    EDAMAM: {
      BASE_URL: 'https://api.edamam.com/api/recipes/v2',
      APP_ID: 'YOUR_EDAMAM_APP_ID',
      APP_KEY: 'YOUR_EDAMAM_APP_KEY'
    }
  },

  // Sustitutos - Base de datos local
  SUBSTITUTES: {
    'azúcar': ['stevia', 'eritritol', 'aspartame', 'sucralosa'],
    'harina': ['harina de almendra', 'harina de coco', 'psyllium', 'harina integral'],
    'mantequilla': ['aceite de coco', 'ghee', 'aceite de oliva', 'puré de frutos secos'],
    'pan': ['pan integral', 'lechuga (wrap)', 'coliflor rallada', 'pan casero bajo carb'],
    'pasta': ['espagueti de calabacín', 'fideos shirataki', 'pasta integral', 'lentejas'],
    'arroz blanco': ['arroz integral', 'quinoa', 'cebada', 'coliflor rallada'],
    'leche entera': ['leche descremada', 'bebida de almendra', 'bebida de coco', 'leche de soya'],
    'carne roja': ['pollo', 'pavo', 'pescado', 'proteína de soya'],
  }
};

// Validar API key USDA
async function validateUSDAKey() {
  if (CONFIG.USDA.API_KEY === 'YOUR_USDA_API_KEY') {
    console.warn('⚠️ API Key USDA no configurada. Para usar búsqueda USDA:');
    console.warn('1. Ve a https://fdc.nal.usda.gov/api-key-signup.html');
    console.warn('2. Reemplaza YOUR_USDA_API_KEY en config.js');
    return false;
  }
  return true;
}

// Obtener recetas gratis de TheMealDB
async function getFreeMeals(search = '') {
  try {
    const url = `${CONFIG.FREE_RECIPE_APIS.THEMEALDB.BASE_URL}/search.php?s=${encodeURIComponent(search)}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.meals || [];
  } catch (e) {
    console.error('Error fetching meals:', e);
    return [];
  }
}

// Obtener categorías de TheMealDB
async function getMealCategories() {
  try {
    const url = `${CONFIG.FREE_RECIPE_APIS.THEMEALDB.BASE_URL}/categories.php`;
    const res = await fetch(url);
    const data = await res.json();
    return data.categories || [];
  } catch (e) {
    console.error('Error fetching categories:', e);
    return [];
  }
}

// Obtener recetas por categoría
async function getMealsByCategory(category) {
  try {
    const url = `${CONFIG.FREE_RECIPE_APIS.THEMEALDB.BASE_URL}/filter.php?c=${encodeURIComponent(category)}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.meals || [];
  } catch (e) {
    console.error('Error fetching meals by category:', e);
    return [];
  }
}

// Obtener detalles de una receta
async function getMealDetail(mealId) {
  try {
    const url = `${CONFIG.FREE_RECIPE_APIS.THEMEALDB.BASE_URL}/lookup.php?i=${mealId}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.meals?.[0] || null;
  } catch (e) {
    console.error('Error fetching meal detail:', e);
    return null;
  }
}

export default CONFIG;
