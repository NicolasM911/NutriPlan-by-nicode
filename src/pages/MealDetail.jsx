import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { MacroBar } from '../components/UI/MacroBar'

const TYPE_CONFIG = {
  breakfast: { label: 'Desayuno', emoji: '☀️', gradient: 'from-amber-100 to-cream-100 dark:from-[#1a1200] dark:to-[#0a0a0a]' },
  lunch:     { label: 'Almuerzo', emoji: '🌞', gradient: 'from-terracotta-100 to-cream-100 dark:from-[#1a0800] dark:to-[#0a0a0a]' },
  dinner:    { label: 'Cena',     emoji: '🌙', gradient: 'from-cream-200 to-cream-100 dark:from-[#141414] dark:to-[#0a0a0a]' },
  snack:     { label: 'Snack',    emoji: '🍎', gradient: 'from-sage-100 to-cream-100 dark:from-[#0a1400] dark:to-[#0a0a0a]' },
}

export default function MealDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [mealData, setMealData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('currentMeal')
    if (stored) setMealData(JSON.parse(stored))
    setLoading(false)
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-16 dark:bg-[#0a0a0a]">
      <div className="text-7xl animate-bounce">🍽️</div>
    </div>
  )

  if (!mealData) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-16 dark:bg-[#0a0a0a]">
      <div className="text-6xl">😕</div>
      <p className="font-body text-brown-800/60 dark:text-[#a0a0a0]">No se encontró información de esta comida</p>
      <button onClick={() => navigate(-1)} className="btn-primary">← Volver</button>
    </div>
  )

  const { type, meal } = mealData
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.breakfast

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-16 pb-12 dark:bg-[#0a0a0a]"
    >
      {/* Hero */}
      <div className={`bg-gradient-to-br ${config.gradient} py-12 px-4`}>
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-body font-bold text-brown-800/50 dark:text-[#a0a0a0] hover:text-terracotta-500 transition-colors mb-6"
          >
            ← Volver al plan
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{config.emoji}</span>
            <span className="tag tag-orange">{config.label}</span>
            <span className="tag tag-green">⏱ {meal.prepTime || '15 min'}</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-brown-800 dark:text-[#f5f5f5]">{meal.name}</h1>
          <p className="text-brown-800/60 dark:text-[#a0a0a0] font-body mt-2 leading-relaxed">{meal.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Macros */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
          <h2 className="font-display font-bold text-brown-800 dark:text-[#f5f5f5] mb-4">Información nutricional</h2>
          <div className="flex items-center justify-between bg-terracotta-50 dark:bg-[#1a0800] rounded-2xl p-4 mb-5">
            <div>
              <div className="text-xs font-body uppercase tracking-wider text-brown-800/40 dark:text-[#666] font-bold">Calorías totales</div>
              <div className="font-display text-3xl font-bold text-terracotta-500">{meal.calories}</div>
              <div className="text-xs font-body text-brown-800/40 dark:text-[#666]">kcal en esta comida</div>
            </div>
            <div className="text-5xl">🔥</div>
          </div>
          <div className="space-y-3">
            <MacroBar label="Proteína"      value={meal.protein} total={meal.protein + meal.carbs + meal.fat} color="protein" unit="g" />
            <MacroBar label="Carbohidratos" value={meal.carbs}   total={meal.protein + meal.carbs + meal.fat} color="carbs"   unit="g" />
            <MacroBar label="Grasas"        value={meal.fat}     total={meal.protein + meal.carbs + meal.fat} color="fat"     unit="g" />
          </div>
          <div className="flex gap-3 mt-5 flex-wrap">
            {[
              { label: 'Proteína', val: `${meal.protein}g`, bg: 'bg-terracotta-50 dark:bg-[#1a0800]', color: 'text-terracotta-500' },
              { label: 'Carbos',   val: `${meal.carbs}g`,   bg: 'bg-amber-50 dark:bg-[#141400]',      color: 'text-amber-500' },
              { label: 'Grasas',   val: `${meal.fat}g`,     bg: 'bg-sage-100 dark:bg-[#0a1400]',      color: 'text-sage-500' },
            ].map(m => (
              <div key={m.label} className={`flex-1 min-w-[80px] ${m.bg} rounded-2xl p-3 text-center`}>
                <div className={`font-display text-xl font-bold ${m.color}`}>{m.val}</div>
                <div className="text-xs font-body text-brown-800/40 dark:text-[#666] uppercase">{m.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Ingredientes */}
        {meal.ingredients?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
            <h2 className="font-display font-bold text-brown-800 dark:text-[#f5f5f5] mb-4">🛒 Ingredientes</h2>
            <div className="grid grid-cols-2 gap-2">
              {meal.ingredients.map((ing, i) => (
                <div key={i} className="flex items-center gap-2 bg-cream-100 dark:bg-[#1c1c1c] rounded-xl px-3 py-2 border border-cream-200 dark:border-[#2a2a2a]">
                  <span className="w-2 h-2 bg-terracotta-300 rounded-full shrink-0" />
                  <span className="text-sm font-body text-brown-800 dark:text-[#f5f5f5]">{ing}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Consejo IA */}
        {meal.tip && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="card bg-gradient-to-br from-amber-50 to-cream-100 dark:from-[#141400] dark:to-[#0a0a0a] border-amber-200 dark:border-[#2a2a00]"
          >
            <div className="flex gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="font-display font-bold text-brown-800 dark:text-[#f5f5f5] mb-1">Consejo nutricional</h3>
                <p className="text-sm font-body text-brown-800/60 dark:text-[#a0a0a0] leading-relaxed">{meal.tip}</p>
              </div>
            </div>
          </motion.div>
        )}

        <button onClick={() => navigate('/plan')} className="btn-primary w-full">
          ← Ver plan completo
        </button>
      </div>
    </motion.div>
  )
}
