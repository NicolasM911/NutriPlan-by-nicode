import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const MEAL_CONFIG = {
  juice:     { label: 'Jugo Natural', emoji: '🥤' },
  breakfast: { label: 'Desayuno',     emoji: '☀️' },
  lunch:     { label: 'Almuerzo',     emoji: '🌞' },
  dinner:    { label: 'Cena',         emoji: '🌙' },
  snack:     { label: 'Snack',        emoji: '🍎' },
}

// Accent color per meal type (light only, dark uses accent var)
const MEAL_ACCENT = {
  juice:     '#22c55e',
  breakfast: '#f7b267',
  lunch:     '#f4845f',
  dinner:    '#94a3b8',
  snack:     '#5a9e52',
}

export default function MealCard({ type, meal, dayIndex, delay = 0 }) {
  const navigate = useNavigate()
  const config = MEAL_CONFIG[type] || MEAL_CONFIG.breakfast
  const accent = MEAL_ACCENT[type] || MEAL_ACCENT.breakfast

  const handleClick = () => {
    sessionStorage.setItem('currentMeal', JSON.stringify({ type, meal, dayIndex }))
    navigate(`/meal/${dayIndex}-${type}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      onClick={handleClick}
      className="rounded-2xl p-4 cursor-pointer transition-all duration-200 group"
      style={{
        backgroundColor: 'var(--surface2)',
        border: '1px solid var(--border)',
      }}
      whileHover={{ y: -2, borderColor: accent }}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl mt-0.5 shrink-0">{config.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold font-body uppercase tracking-wider"
              style={{ color: 'var(--text3)' }}>
              {config.label}
            </span>
            <span className="text-xs font-mono font-bold text-terracotta-500">
              {meal.calories} kcal
            </span>
          </div>
          <h4 className="font-display font-bold text-sm mt-0.5 leading-tight"
            style={{ color: 'var(--text)' }}>
            {meal.name}
          </h4>
          <p className="text-xs mt-1 font-body line-clamp-1"
            style={{ color: 'var(--text2)' }}>
            {meal.description}
          </p>
          <div className="flex gap-2 mt-2">
            {[
              { label: `P: ${meal.protein}g`, color: '#f4845f' },
              { label: `C: ${meal.carbs}g`,   color: '#f7b267' },
              { label: `G: ${meal.fat}g`,      color: '#5a9e52' },
            ].map(m => (
              <span key={m.label}
                className="text-xs font-mono px-2 py-0.5 rounded-full"
                style={{
                  color: m.color,
                  backgroundColor: `color-mix(in srgb, ${m.color} 12%, var(--surface))`,
                }}
              >{m.label}</span>
            ))}
          </div>
        </div>
        <div className="transition-colors text-lg mt-1 shrink-0"
          style={{ color: 'var(--text3)' }}>→</div>
      </div>
    </motion.div>
  )
}
