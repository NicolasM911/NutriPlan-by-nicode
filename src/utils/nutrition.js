// Mifflin-St Jeor formula para calcular TDEE
export function calculateTDEE(weight, height, age, sex = 'male', activityLevel = 'moderate') {
  // BMR
  let bmr
  if (sex === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
  }

  // Activity multipliers
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  }

  return Math.round(bmr * (multipliers[activityLevel] || 1.55))
}

// Ajuste de calorías según objetivo
export function adjustCaloriesForGoal(tdee, goal) {
  const adjustments = {
    helicobacter: 0,      // Mantener, pero dieta antiinflamatoria
    gain_weight: 450,     // Superávit +450
    gain_muscle: 250,     // Superávit +250
    lose_weight: -450,    // Déficit -450
    maintain: 0,          // TDEE exacto
  }
  return tdee + (adjustments[goal] || 0)
}

// Calcula litros de agua diarios recomendados
export function calculateWater(weight, activityLevel, goal) {
  let base = weight * 0.033  // 33ml por kg
  if (activityLevel === 'active' || activityLevel === 'very_active') base += 0.5
  if (goal === 'gain_muscle' || goal === 'lose_weight') base += 0.3
  if (goal === 'helicobacter') base += 0.2
  return Math.round(base * 10) / 10  // redondea a 1 decimal
}

export const GOALS = [
  {
    id: 'helicobacter',
    label: 'Eliminar H. Pylori',
    emoji: '🦠',
    description: 'Dieta antiinflamatoria que ayuda a combatir la bacteria',
    color: 'bg-sage-100 border-sage-300 text-sage-500',
    activeColor: 'bg-sage-300 border-sage-500 text-sage-700',
  },
  {
    id: 'gain_weight',
    label: 'Aumentar Peso',
    emoji: '⬆️',
    description: 'Superávit calórico con alta densidad nutricional',
    color: 'bg-amber-100 border-amber-300 text-amber-600',
    activeColor: 'bg-amber-300 border-amber-500 text-amber-800',
  },
  {
    id: 'gain_muscle',
    label: 'Aumentar Masa Muscular',
    emoji: '💪',
    description: 'Alto en proteína para maximizar el crecimiento muscular',
    color: 'bg-terracotta-100 border-terracotta-300 text-terracotta-600',
    activeColor: 'bg-terracotta-300 border-terracotta-500 text-terracotta-700',
  },
  {
    id: 'lose_weight',
    label: 'Bajar Peso',
    emoji: '⬇️',
    description: 'Déficit calórico inteligente sin pasar hambre',
    color: 'bg-cream-200 border-cream-400 text-brown-800',
    activeColor: 'bg-cream-400 border-cream-500 text-brown-900',
  },
  {
    id: 'maintain',
    label: 'Mantener Peso',
    emoji: '⚖️',
    description: 'Dieta equilibrada para sostener tu peso ideal',
    color: 'bg-sage-100 border-sage-200 text-sage-500',
    activeColor: 'bg-sage-200 border-sage-400 text-sage-700',
  },
]

export const PREFERENCES = [
  { id: 'none', label: 'Sin preferencia', emoji: '🍽️' },
  { id: 'vegetarian', label: 'Vegetariano', emoji: '🥦' },
  { id: 'vegan', label: 'Vegano', emoji: '🌱' },
  { id: 'keto', label: 'Keto', emoji: '🥑' },
  { id: 'gluten_free', label: 'Sin Gluten', emoji: '🌾' },
  { id: 'mediterranean', label: 'Mediterráneo', emoji: '🫒' },
]

export const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentario', description: 'Poco o ningún ejercicio' },
  { id: 'light', label: 'Ligero', description: '1-3 días/semana' },
  { id: 'moderate', label: 'Moderado', description: '3-5 días/semana' },
  { id: 'active', label: 'Activo', description: '6-7 días/semana' },
  { id: 'very_active', label: 'Muy Activo', description: 'Ejercicio intenso diario' },
]

export function getMacroTargets(goal, calories) {
  const targets = {
    helicobacter: { protein: 0.20, carbs: 0.50, fat: 0.30 },
    gain_weight: { protein: 0.25, carbs: 0.50, fat: 0.25 },
    gain_muscle: { protein: 0.35, carbs: 0.45, fat: 0.20 },
    lose_weight: { protein: 0.35, carbs: 0.35, fat: 0.30 },
    maintain: { protein: 0.25, carbs: 0.50, fat: 0.25 },
  }
  const t = targets[goal] || targets.maintain
  return {
    protein: Math.round((calories * t.protein) / 4),
    carbs: Math.round((calories * t.carbs) / 4),
    fat: Math.round((calories * t.fat) / 9),
  }
}
