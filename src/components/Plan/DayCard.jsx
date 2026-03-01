import { motion, AnimatePresence } from 'framer-motion'
import MealCard from './MealCard'

const DAY_EMOJIS = ['🌱', '🔥', '💧', '⚡', '🌟', '🎉', '🌈']
const MEAL_ORDER = ['juice', 'breakfast', 'lunch', 'dinner', 'snack']

export default function DayCard({ dayData, isActive, onSelect, targetCalories }) {
  const { day, dayIndex, totalCalories, meals } = dayData
  const pct     = Math.round((totalCalories / targetCalories) * 100)
  const isToday = new Date().getDay() - 1 === dayIndex
  const totalProtein = Object.values(meals).reduce((s, m) => s + (m?.protein || 0), 0)

  const sortedMeals = MEAL_ORDER.filter(k => meals[k]).map(k => [k, meals[k]])

  return (
    <div
      className="rounded-3xl p-6 transition-all duration-300"
      style={{
        backgroundColor: 'var(--surface)',
        border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
        boxShadow: isActive ? '0 0 0 1px var(--accent)' : 'none',
      }}
    >
      <button onClick={onSelect} className="w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg transition-all"
            style={{
              backgroundColor: isActive ? 'var(--accent)' : 'var(--surface2)',
              color: isActive ? '#fff' : 'var(--text)',
            }}
          >
            {DAY_EMOJIS[dayIndex]}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold" style={{ color: 'var(--text)' }}>{day}</h3>
              {isToday && (
                <span className="text-xs font-bold font-body px-2 py-0.5 rounded-full bg-terracotta-100 text-terracotta-600">
                  HOY
                </span>
              )}
            </div>
            <p className="text-xs font-body" style={{ color: 'var(--text2)' }}>
              {totalCalories} kcal · {pct}% objetivo
            </p>
          </div>
        </div>

        <div className="hidden sm:flex gap-3 items-center">
          <div className="text-right">
            <div className="text-xs font-body" style={{ color: 'var(--text3)' }}>Proteína</div>
            <div className="text-sm font-mono font-bold text-terracotta-500">{totalProtein}g</div>
          </div>
          <motion.div
            animate={{ rotate: isActive ? 90 : 0 }}
            transition={{ duration: 0.25 }}
            className="text-xl"
            style={{ color: 'var(--text3)' }}
          >›</motion.div>
        </div>
      </button>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface2)' }}>
        <div
          className="h-full bg-terracotta-400 rounded-full transition-all duration-700"
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>

      {/* Expanded meals */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-3">
              {sortedMeals.map(([type, meal], i) => (
                <MealCard key={type} type={type} meal={meal} dayIndex={dayIndex} delay={i * 0.05} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
