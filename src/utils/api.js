// ============================================================
// NUTRIPLAN — API Services
// ============================================================

const MEALDB_BASE = 'https://www.themealdb.com/api/json/v1/1'
const FOOD_FACTS_BASE = 'https://world.openfoodfacts.org'

// ── TheMealDB ──────────────────────────────────────────────

export async function searchMealsByName(name) {
  const res = await fetch(`${MEALDB_BASE}/search.php?s=${encodeURIComponent(name)}`)
  const data = await res.json()
  return data.meals || []
}

export async function getMealById(id) {
  const res = await fetch(`${MEALDB_BASE}/lookup.php?i=${id}`)
  const data = await res.json()
  return data.meals?.[0] || null
}

export async function getMealsByCategory(category) {
  const res = await fetch(`${MEALDB_BASE}/filter.php?c=${encodeURIComponent(category)}`)
  const data = await res.json()
  return data.meals || []
}

export async function getCategories() {
  const res = await fetch(`${MEALDB_BASE}/categories.php`)
  const data = await res.json()
  return data.categories || []
}

export async function getMealsByIngredient(ingredient) {
  const res = await fetch(`${MEALDB_BASE}/filter.php?i=${encodeURIComponent(ingredient)}`)
  const data = await res.json()
  return data.meals || []
}

// Random meals from multiple categories for variety
export async function getVariedMeals(count = 20) {
  const categories = ['Chicken', 'Seafood', 'Vegetarian', 'Beef', 'Lamb', 'Pasta', 'Miscellaneous']
  const promises = categories.map(c => getMealsByCategory(c))
  const results = await Promise.all(promises)
  const all = results.flat()
  const shuffled = all.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// ── Open Food Facts ────────────────────────────────────────

export async function getNutritionInfo(foodName) {
  try {
    const res = await fetch(
      `${FOOD_FACTS_BASE}/cgi/search.pl?search_terms=${encodeURIComponent(foodName)}&search_simple=1&action=process&json=1&page_size=1&fields=product_name,nutriments,image_url`
    )
    const data = await res.json()
    const product = data.products?.[0]
    if (!product) return null
    return {
      name: product.product_name,
      calories: product.nutriments?.['energy-kcal_100g'] || 0,
      protein: product.nutriments?.['proteins_100g'] || 0,
      carbs: product.nutriments?.['carbohydrates_100g'] || 0,
      fat: product.nutriments?.['fat_100g'] || 0,
      fiber: product.nutriments?.['fiber_100g'] || 0,
    }
  } catch {
    return null
  }
}

// ── Google Gemini AI ───────────────────────────────────────

export async function generatePlanWithGemini(userParams, availableMeals) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  if (!apiKey || apiKey === 'tu_api_key_aqui') {
    return generateMockPlan(userParams)
  }

  const mealsList = availableMeals.slice(0, 50).map(m => m.strMeal).join(', ')

  const prompt = `
Eres un nutricionista experto. Crea un plan alimenticio de 7 días en JSON.

USUARIO: ${userParams.name}, ${userParams.age} años, ${userParams.weight}kg, ${userParams.height}cm
OBJETIVO: ${userParams.goal} — ${getGoalContext(userParams.goal)}
CALORÍAS: ${userParams.calories} kcal/día (Desayuno 25%, Almuerzo 35%, Cena 30%, Snack 10%)
PREFERENCIA: ${userParams.preference}

REFERENCIA DE RECETAS (puedes usar estos nombres o inventar otros saludables): ${mealsList}

Responde ÚNICAMENTE con este JSON, sin texto adicional, sin markdown, sin bloques de código:
{"weekPlan":[{"day":"Lunes","dayIndex":0,"totalCalories":${userParams.calories},"meals":{"breakfast":{"name":"nombre","description":"desc","calories":0,"protein":0,"carbs":0,"fat":0,"ingredients":[],"prepTime":"10 min","mealdbId":null,"tip":"consejo"},"lunch":{"name":"nombre","description":"desc","calories":0,"protein":0,"carbs":0,"fat":0,"ingredients":[],"prepTime":"20 min","mealdbId":null,"tip":"consejo"},"dinner":{"name":"nombre","description":"desc","calories":0,"protein":0,"carbs":0,"fat":0,"ingredients":[],"prepTime":"20 min","mealdbId":null,"tip":"consejo"},"snack":{"name":"nombre","description":"desc","calories":0,"protein":0,"carbs":0,"fat":0,"ingredients":[],"prepTime":"5 min","mealdbId":null,"tip":"consejo"}}}],"generalTips":["tip1","tip2","tip3","tip4"],"weekSummary":"resumen"}
Completa los 7 días (Lunes a Domingo) con datos nutricionales reales según el objetivo.
`

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
        }),
      }
    )

    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found in Gemini response')
    const plan = JSON.parse(jsonMatch[0])

    return plan

  } catch (err) {
    console.error('Gemini error:', err)
    return generateMockPlan(userParams)
  }
}

function getGoalContext(goal) {
  const contexts = {
    helicobacter: 'Dieta antiinflamatoria para combatir H. pylori. Evitar: picantes, alcohol, café, cítricos ácidos, alimentos procesados. Favorecer: brócoli, yogur probiótico, miel de manuka, ajo, cúrcuma, verduras cocidas, carnes magras.',
    gain_weight: 'Superávit calórico de +400-500 kcal. Alta densidad calórica. Incluir: frutos secos, aguacate, huevos, carnes, lácteos, legumbres, carbohidratos complejos. 5-6 comidas al día.',
    gain_muscle: 'Superávit de +200-300 kcal con énfasis en proteína (1.8-2.2g por kg de peso). Incluir: pollo, huevos, atún, quinoa, legumbres, batata. Proteína en cada comida.',
    lose_weight: 'Déficit calórico de -400-500 kcal. Alto en fibra y proteína. Evitar: azúcares refinados, harinas blancas, frituras. Favorecer: verduras, proteínas magras, frutas, granos enteros.',
    maintain: 'Dieta equilibrada que mantenga el TDEE actual. Variedad de nutrientes, porciones controladas, 3 comidas principales y 2 snacks saludables.',
  }
  return contexts[goal] || contexts.maintain
}

// ── Mock Plan (cuando no hay API key) ─────────────────────

// Fisher-Yates shuffle — asegura variedad en cada generación
function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateMockPlan(userParams) {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

  const breakfasts = [
    { name: 'Avena con frutas y miel', description: 'Avena cremosa con plátano, fresas y miel de abeja', calories: Math.round(userParams.calories * 0.25), protein: 12, carbs: 58, fat: 8, ingredients: ['Avena', 'Plátano', 'Fresas', 'Miel', 'Leche'], prepTime: '10 min', tip: 'La avena es ideal para empezar el día con energía sostenida.' },
    { name: 'Huevos revueltos con tostadas', description: 'Huevos orgánicos con aguacate y pan integral', calories: Math.round(userParams.calories * 0.25), protein: 22, carbs: 30, fat: 18, ingredients: ['Huevos', 'Aguacate', 'Pan integral', 'Tomate'], prepTime: '12 min', tip: 'Los huevos aportan proteína completa esencial para tus objetivos.' },
    { name: 'Yogur griego con granola', description: 'Yogur probiótico con granola casera y frutas del bosque', calories: Math.round(userParams.calories * 0.25), protein: 18, carbs: 42, fat: 6, ingredients: ['Yogur griego', 'Granola', 'Arándanos', 'Miel'], prepTime: '5 min', tip: 'El yogur griego fortalece la flora intestinal.' },
    { name: 'Smoothie proteico', description: 'Batido de plátano, espinacas, proteína y mantequilla de almendras', calories: Math.round(userParams.calories * 0.25), protein: 28, carbs: 35, fat: 10, ingredients: ['Plátano', 'Espinacas', 'Proteína en polvo', 'Leche de almendras'], prepTime: '5 min', tip: 'Perfecto para los días de entrenamiento.' },
    { name: 'Tostadas de aguacate con salmón', description: 'Pan integral con aguacate, salmón ahumado y limón', calories: Math.round(userParams.calories * 0.25), protein: 24, carbs: 28, fat: 22, ingredients: ['Pan integral', 'Aguacate', 'Salmón ahumado', 'Limón', 'Rúcula'], prepTime: '8 min', tip: 'El salmón aporta omega-3 antiinflamatorio.' },
    { name: 'Pancakes de avena y plátano', description: 'Pancakes saludables sin harina refinada', calories: Math.round(userParams.calories * 0.25), protein: 14, carbs: 52, fat: 8, ingredients: ['Avena', 'Plátano', 'Huevo', 'Canela', 'Miel'], prepTime: '15 min', tip: 'Una opción deliciosa y nutritiva para el fin de semana.' },
    { name: 'Bol de frutas con queso fresco', description: 'Mix de frutas de temporada con queso fresco y nueces', calories: Math.round(userParams.calories * 0.25), protein: 16, carbs: 45, fat: 12, ingredients: ['Frutas variadas', 'Queso fresco', 'Nueces', 'Miel'], prepTime: '10 min', tip: 'Las frutas aportan antioxidantes naturales.' },
  ]

  const lunches = [
    { name: 'Pechuga de pollo con quinoa', description: 'Pollo a la plancha con quinoa y verduras asadas', calories: Math.round(userParams.calories * 0.35), protein: 42, carbs: 48, fat: 12, ingredients: ['Pechuga de pollo', 'Quinoa', 'Zucchini', 'Pimiento', 'Ajo', 'Limón'], prepTime: '25 min', tip: 'La quinoa es proteína completa, perfecta para tus objetivos.' },
    { name: 'Salmón con batata y brócoli', description: 'Filete de salmón al horno con batata y brócoli al vapor', calories: Math.round(userParams.calories * 0.35), protein: 38, carbs: 45, fat: 16, ingredients: ['Salmón', 'Batata', 'Brócoli', 'Aceite de oliva', 'Limón'], prepTime: '30 min', tip: 'Alto en omega-3 y nutrientes esenciales.' },
    { name: 'Bowl de legumbres', description: 'Lentejas con arroz integral, vegetales y tahini', calories: Math.round(userParams.calories * 0.35), protein: 22, carbs: 62, fat: 10, ingredients: ['Lentejas', 'Arroz integral', 'Zanahoria', 'Cebolla', 'Tahini'], prepTime: '35 min', tip: 'Las legumbres son fuente excelente de fibra y proteína vegetal.' },
    { name: 'Pasta integral con atún', description: 'Pasta integral con salsa de tomate natural y atún', calories: Math.round(userParams.calories * 0.35), protein: 32, carbs: 55, fat: 8, ingredients: ['Pasta integral', 'Atún', 'Tomate', 'Ajo', 'Albahaca'], prepTime: '20 min', tip: 'El atún es proteína magra y muy económica.' },
    { name: 'Ensalada de pollo César', description: 'Ensalada nutritiva con pollo, lechuga romana y aderezo casero', calories: Math.round(userParams.calories * 0.35), protein: 36, carbs: 20, fat: 18, ingredients: ['Lechuga romana', 'Pollo', 'Crutones', 'Parmesano', 'Aderezo César'], prepTime: '15 min', tip: 'Baja en carbos y alta en proteína.' },
    { name: 'Arroz con frijoles y carne', description: 'Plato completo de arroz, frijoles negros y carne magra', calories: Math.round(userParams.calories * 0.35), protein: 38, carbs: 58, fat: 12, ingredients: ['Arroz', 'Frijoles negros', 'Carne de res magra', 'Cebolla', 'Ajo'], prepTime: '30 min', tip: 'Combinación perfecta de aminoácidos esenciales.' },
    { name: 'Wok de tofu y vegetales', description: 'Tofu salteado con vegetales coloridos y salsa de soya', calories: Math.round(userParams.calories * 0.35), protein: 24, carbs: 38, fat: 14, ingredients: ['Tofu firme', 'Brócoli', 'Zanahoria', 'Pimiento', 'Salsa de soya', 'Jengibre'], prepTime: '20 min', tip: 'El tofu es proteína vegetal completa y muy versátil.' },
  ]

  const dinners = [
    { name: 'Crema de verduras', description: 'Crema suave de calabaza y zanahoria con jengibre', calories: Math.round(userParams.calories * 0.30), protein: 8, carbs: 32, fat: 6, ingredients: ['Calabaza', 'Zanahoria', 'Cebolla', 'Jengibre', 'Caldo vegetal'], prepTime: '25 min', tip: 'Una cena ligera que facilita la digestión nocturna.' },
    { name: 'Trucha al vapor con ensalada', description: 'Trucha al vapor con limón y ensalada de hojas verdes', calories: Math.round(userParams.calories * 0.30), protein: 32, carbs: 12, fat: 10, ingredients: ['Trucha', 'Espinacas', 'Pepino', 'Limón', 'Aceite de oliva'], prepTime: '20 min', tip: 'El vapor preserva todos los nutrientes del pescado.' },
    { name: 'Omelette de claras', description: 'Omelette de claras con espinacas y queso cottage', calories: Math.round(userParams.calories * 0.30), protein: 28, carbs: 8, fat: 8, ingredients: ['Claras de huevo', 'Espinacas', 'Queso cottage', 'Tomate cherry'], prepTime: '10 min', tip: 'Cena rápida y alta en proteína de calidad.' },
    { name: 'Pollo al horno con vegetales', description: 'Muslos de pollo al horno con romero y vegetales mediterráneos', calories: Math.round(userParams.calories * 0.30), protein: 34, carbs: 22, fat: 12, ingredients: ['Pollo', 'Berenjena', 'Zucchini', 'Tomate', 'Romero', 'Ajo'], prepTime: '40 min', tip: 'El horneado evita el uso excesivo de aceites.' },
    { name: 'Sopa de pollo y verduras', description: 'Sopa reconfortante con pollo deshebrado y verduras frescas', calories: Math.round(userParams.calories * 0.30), protein: 30, carbs: 28, fat: 6, ingredients: ['Pollo', 'Zanahoria', 'Apio', 'Papa', 'Caldo natural'], prepTime: '35 min', tip: 'La sopa de pollo tiene propiedades antiinflamatorias naturales.' },
    { name: 'Ensalada mediterránea con garbanzos', description: 'Ensalada fresca con garbanzos, aceitunas y feta', calories: Math.round(userParams.calories * 0.30), protein: 18, carbs: 35, fat: 14, ingredients: ['Garbanzos', 'Pepino', 'Tomate', 'Aceitunas', 'Queso feta', 'Orégano'], prepTime: '10 min', tip: 'Los garbanzos son saciantes y ricos en fibra.' },
    { name: 'Atún con aguacate y pepino', description: 'Bowl fresco de atún, aguacate y pepino con limón', calories: Math.round(userParams.calories * 0.30), protein: 30, carbs: 15, fat: 16, ingredients: ['Atún en agua', 'Aguacate', 'Pepino', 'Limón', 'Cilantro'], prepTime: '8 min', tip: 'Cena ligera rica en proteína y grasas saludables.' },
  ]

  const snacks = [
    { name: 'Puñado de almendras', description: '20-25 almendras crudas', calories: Math.round(userParams.calories * 0.10), protein: 6, carbs: 6, fat: 14, ingredients: ['Almendras crudas'], prepTime: '0 min', tip: 'Las almendras aportan vitamina E y grasas saludables.' },
    { name: 'Manzana con mantequilla de maní', description: 'Manzana en rodajas con 1 cucharada de mantequilla de maní natural', calories: Math.round(userParams.calories * 0.10), protein: 4, carbs: 22, fat: 8, ingredients: ['Manzana', 'Mantequilla de maní'], prepTime: '2 min', tip: 'Combinación perfecta de fibra y proteína.' },
    { name: 'Yogur con chía', description: 'Yogur natural con semillas de chía y canela', calories: Math.round(userParams.calories * 0.10), protein: 10, carbs: 12, fat: 4, ingredients: ['Yogur natural', 'Chía', 'Canela'], prepTime: '2 min', tip: 'La chía es rica en omega-3 y fibra.' },
    { name: 'Hummus con vegetales', description: 'Hummus casero con bastones de zanahoria y apio', calories: Math.round(userParams.calories * 0.10), protein: 6, carbs: 16, fat: 6, ingredients: ['Hummus', 'Zanahoria', 'Apio', 'Pimiento'], prepTime: '0 min', tip: 'El hummus es fuente de proteína vegetal.' },
    { name: 'Frutas del bosque', description: 'Mix de fresas, arándanos y frambuesas', calories: Math.round(userParams.calories * 0.10), protein: 2, carbs: 20, fat: 1, ingredients: ['Fresas', 'Arándanos', 'Frambuesas'], prepTime: '2 min', tip: 'Antioxidantes naturales para recuperación.' },
    { name: 'Huevo duro', description: '1-2 huevos duros con sal y pimienta', calories: Math.round(userParams.calories * 0.10), protein: 12, carbs: 1, fat: 10, ingredients: ['Huevos'], prepTime: '10 min', tip: 'Proteína de alta calidad y muy saciante.' },
    { name: 'Batido de proteínas', description: 'Proteína con leche de almendras y plátano', calories: Math.round(userParams.calories * 0.10), protein: 24, carbs: 18, fat: 3, ingredients: ['Proteína en polvo', 'Leche de almendras', 'Plátano'], prepTime: '3 min', tip: 'Ideal post-entrenamiento para recuperar músculo.' },
  ]


  const juices = [
    { name: 'Jugo Verde Detox', description: 'Espinaca, pepino, manzana verde, jengibre y limón', calories: 80, protein: 2, carbs: 18, fat: 0, ingredients: ['Espinaca', 'Pepino', 'Manzana verde', 'Jengibre', 'Limón'], prepTime: '5 min', tip: 'Ideal en ayunas — activa el metabolismo y alcaliniza el organismo.' },
    { name: 'Jugo de Zanahoria y Naranja', description: 'Zanahoria, naranja, cúrcuma y un toque de pimienta negra', calories: 90, protein: 1, carbs: 21, fat: 0, ingredients: ['Zanahoria', 'Naranja', 'Cúrcuma', 'Pimienta negra'], prepTime: '5 min', tip: 'La cúrcuma con pimienta negra potencia su absorción antiinflamatoria.' },
    { name: 'Jugo de Remolacha y Manzana', description: 'Remolacha, manzana, apio y limón para energía y circulación', calories: 95, protein: 2, carbs: 22, fat: 0, ingredients: ['Remolacha', 'Manzana', 'Apio', 'Limón'], prepTime: '5 min', tip: 'La remolacha mejora la circulación y oxigenación muscular.' },
    { name: 'Jugo de Piña y Jengibre', description: 'Piña fresca, jengibre, menta y agua de coco', calories: 85, protein: 1, carbs: 20, fat: 0, ingredients: ['Piña', 'Jengibre', 'Menta', 'Agua de coco'], prepTime: '5 min', tip: 'La bromelina de la piña tiene propiedades antiinflamatorias y digestivas.' },
    { name: 'Jugo de Tomate y Apio', description: 'Tomate fresco, apio, pepino y limón estilo gazpacho frío', calories: 60, protein: 2, carbs: 13, fat: 0, ingredients: ['Tomate', 'Apio', 'Pepino', 'Limón', 'Sal marina'], prepTime: '5 min', tip: 'Bajo en calorías y rico en licopeno antioxidante.' },
    { name: 'Jugo de Mango y Cúrcuma', description: 'Mango maduro, cúrcuma, limón y un toque de miel', calories: 100, protein: 1, carbs: 24, fat: 0, ingredients: ['Mango', 'Cúrcuma', 'Limón', 'Miel', 'Agua'], prepTime: '5 min', tip: 'El mango aporta vitamina C y la cúrcuma cuida la mucosa gástrica.' },
    { name: 'Agua de Jamaica con Limón', description: 'Flor de jamaica, limón, stevia — refrescante y antioxidante', calories: 20, protein: 0, carbs: 5, fat: 0, ingredients: ['Flor de jamaica', 'Limón', 'Stevia', 'Agua'], prepTime: '10 min', tip: 'Rica en antocianinas — poderosos antioxidantes que cuidan el corazón.' },
  ]

  const goalTips = {
    helicobacter: ['Evita el café, alcohol y alimentos muy ácidos durante el tratamiento', 'El brócoli contiene sulforafano que ayuda a combatir el H. pylori', 'Come porciones pequeñas y frecuentes para no irritar el estómago', 'El yogur con probióticos es tu aliado — consume diariamente'],
    gain_weight: ['Come cada 3 horas para mantener un superávit calórico constante', 'Añade aceite de oliva, aguacate y frutos secos a tus comidas', 'No saltees comidas — cada comida cuenta para tu objetivo', 'Combina el plan con entrenamiento de fuerza para ganar masa saludable'],
    gain_muscle: ['Consume 1.8-2.2g de proteína por kg de tu peso corporal diariamente', 'Asegúrate de comer proteína dentro de 30 min después del entrenamiento', 'Los carbohidratos complejos son combustible para tu músculo', 'El descanso es tan importante como la alimentación para el crecimiento muscular'],
    lose_weight: ['Bebe 2-3 litros de agua al día, especialmente antes de cada comida', 'Las verduras no almidonadas son tus mejores amigas — come sin límite', 'Mastica despacio — el cerebro tarda 20 min en registrar la saciedad', 'Prioriza el sueño: la falta de sueño aumenta el apetito por azúcares'],
    maintain: ['La variedad es clave — rota alimentos para obtener todos los nutrientes', 'Escucha las señales de hambre y saciedad de tu cuerpo', 'Mantén un horario regular de comidas para regular el metabolismo', 'El 80/20 funciona: come saludable el 80% del tiempo y disfruta el 20%'],
  }

  // Shuffle each category independently para variedad en cada generación
  const shuffledJ = shuffleArray(juices)
  const shuffledB = shuffleArray(breakfasts)
  const shuffledL = shuffleArray(lunches)
  const shuffledD = shuffleArray(dinners)
  const shuffledS = shuffleArray(snacks)

  return {
    weekPlan: days.map((day, i) => ({
      day,
      dayIndex: i,
      totalCalories: userParams.calories,
      meals: {
        juice: { ...shuffledJ[i], mealdbId: null },
        breakfast: { ...shuffledB[i], mealdbId: null },
        lunch: { ...shuffledL[i], mealdbId: null },
        dinner: { ...shuffledD[i], mealdbId: null },
        snack: { ...shuffledS[i], mealdbId: null },
      },
    })),
    generalTips: goalTips[userParams.goal] || goalTips.maintain,
    weekSummary: `Tu plan de 7 días ha sido diseñado específicamente para alcanzar tu objetivo de ${userParams.goal === 'helicobacter' ? 'combatir el H. pylori' : userParams.goal}. Sigue el plan con constancia y verás resultados en pocas semanas.`,
  }
}
