import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import DayCard from '../components/Plan/DayCard'
import { MacroBar, CalorieRing } from '../components/UI/MacroBar'
import ProjectionsCard from '../components/Plan/ProjectionsCard'
import { usePlanStorage } from '../hooks/useStorage'
import { exportPlanToPDF } from '../utils/pdfExport'
import { getMacroTargets, GOALS } from '../utils/nutrition'

export default function Plan() {
  const navigate = useNavigate()
  const { userParams, weekPlan, clearPlan } = usePlanStorage()
  const [activeDay, setActiveDay] = useState(0)
  const [exporting, setExporting] = useState(false)

  if (!userParams || !weekPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-6 pt-16">
        <div className="text-6xl">🥗</div>
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>No tienes un plan activo</h2>
          <p className="font-body mb-6" style={{ color: 'var(--text2)' }}>Crea tu plan personalizado para comenzar</p>
          <button onClick={() => navigate('/form')} className="btn-primary">Crear mi plan →</button>
        </div>
      </div>
    )
  }

  const goal = GOALS.find(g => g.id === userParams.goal)
  const macroTargets = getMacroTargets(userParams.goal, userParams.calories)

  const weekAvg = weekPlan.weekPlan.reduce((acc, day) => {
    const all = Object.values(day.meals)
    acc.protein += all.reduce((s, m) => s + (m.protein || 0), 0)
    acc.carbs   += all.reduce((s, m) => s + (m.carbs   || 0), 0)
    acc.fat     += all.reduce((s, m) => s + (m.fat     || 0), 0)
    return acc
  }, { protein: 0, carbs: 0, fat: 0 })

  const days = weekPlan.weekPlan.length
  weekAvg.protein = Math.round(weekAvg.protein / days)
  weekAvg.carbs   = Math.round(weekAvg.carbs   / days)
  weekAvg.fat     = Math.round(weekAvg.fat     / days)

  const handleExport = async () => {
    setExporting(true)
    try { await exportPlanToPDF(userParams, weekPlan) }
    catch { alert('Error al exportar. Por favor intenta de nuevo.') }
    setExporting(false)
  }

  const handleReset = () => {
    if (confirm('¿Seguro que quieres crear un nuevo plan? Se perderá el actual.')) {
      clearPlan(); navigate('/form')
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="py-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl">{goal?.emoji}</span>
                  <span className="tag tag-orange">{goal?.label}</span>
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold" style={{ color: 'var(--text)' }}>
                  Plan de {userParams.name}
                </h1>
                <p className="font-body mt-1" style={{ color: 'var(--text2)' }}>
                  {userParams.calories} kcal/día · {userParams.preference !== 'none' ? userParams.preference : 'Sin restricciones'} · 7 días
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={handleExport} disabled={exporting} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
                  {exporting ? '⏳ Exportando...' : '📄 Exportar PDF'}
                </button>
                <button onClick={handleReset} className="btn-secondary text-sm py-2 px-4">🔄 Nuevo Plan</button>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Day cards */}
          <div className="lg:col-span-2 space-y-4">
            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="font-display text-xl font-bold" style={{ color: 'var(--text)' }}>
              Tu semana completa
            </motion.h2>
            {weekPlan.weekPlan.map((day, i) => (
              <motion.div key={day.day} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <DayCard dayData={day} isActive={activeDay === i} onSelect={() => setActiveDay(activeDay === i ? -1 : i)} targetCalories={userParams.calories} />
              </motion.div>
            ))}
          </div>

          {/* Right: Stats */}
          <div className="space-y-5">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="card">
              <h3 className="font-display font-bold mb-4" style={{ color: 'var(--text)' }}>Resumen nutricional</h3>
              <div className="flex items-center gap-4 mb-5">
                <CalorieRing consumed={userParams.calories} total={userParams.calories} size={72} />
                <div>
                  <div className="font-display text-2xl font-bold text-terracotta-500">{userParams.calories}</div>
                  <div className="text-xs font-body uppercase tracking-wide" style={{ color: 'var(--text3)' }}>kcal diarias</div>
                  <div className="text-xs font-body mt-1" style={{ color: 'var(--text2)' }}>Objetivo personalizado</div>
                </div>
              </div>
              <div className="space-y-3">
                <MacroBar label="Proteína"      value={weekAvg.protein} total={macroTargets.protein} color="protein" unit="g" />
                <MacroBar label="Carbohidratos" value={weekAvg.carbs}   total={macroTargets.carbs}   color="carbs"   unit="g" />
                <MacroBar label="Grasas"        value={weekAvg.fat}     total={macroTargets.fat}     color="fat"     unit="g" />
              </div>
              <div className="mt-3 text-xs font-body text-center" style={{ color: 'var(--text3)' }}>Promedio diario estimado</div>
            </motion.div>

            <ProjectionsCard goal={userParams.goal} weight={userParams.weight} calories={userParams.calories} activityLevel={userParams.activityLevel} delay={0.4} />

            {weekPlan.weekSummary && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="card">
                <div className="text-2xl mb-2">✨</div>
                <h3 className="font-display font-bold mb-2" style={{ color: 'var(--text)' }}>Tu plan en pocas palabras</h3>
                <p className="text-sm font-body leading-relaxed" style={{ color: 'var(--text2)' }}>{weekPlan.weekSummary}</p>
              </motion.div>
            )}

            {userParams.restrictions && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 }} className="card">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">⚠️</span>
                  <h3 className="font-display font-bold" style={{ color: 'var(--text)' }}>Restricciones del plan</h3>
                </div>
                <p className="text-sm font-body leading-relaxed px-3 py-2 rounded-xl"
                  style={{ color: 'var(--text2)', backgroundColor: 'color-mix(in srgb, #f7b267 12%, var(--surface2))', border: '1px solid color-mix(in srgb, #f7b267 25%, var(--border))' }}>
                  {userParams.restrictions}
                </p>
              </motion.div>
            )}

            {weekPlan.generalTips?.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="card">
                <h3 className="font-display font-bold mb-4" style={{ color: 'var(--text)' }}>💡 Consejos clave</h3>
                <div className="space-y-3">
                  {weekPlan.generalTips.map((tip, i) => (
                    <div key={i} className="flex gap-3 text-sm font-body leading-relaxed">
                      <span className="text-sage-400 mt-0.5 shrink-0">✓</span>
                      <span style={{ color: 'var(--text2)' }}>{tip}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
