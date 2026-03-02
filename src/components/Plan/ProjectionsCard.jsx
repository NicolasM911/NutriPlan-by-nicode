import { motion } from 'framer-motion'
import { calculateWater } from '../../utils/nutrition'

export function getProjections(goal, weight, calories) {
  const p = {
    helicobacter: {
      title: 'Recuperación esperada', icon: '🦠', color: '#5a9e52',
      items: [
        { label: 'Reducción de inflamación',    pct: 85, time: '2-3 sem.' },
        { label: 'Mejora síntomas digestivos',  pct: 78, time: '3-4 sem.' },
        { label: 'Fortalec. flora intestinal',  pct: 90, time: '4-6 sem.' },
        { label: 'Recuperación mucosa gástrica',pct: 72, time: '6-8 sem.' },
      ],
    },
    gain_weight: {
      title: 'Progreso esperado', icon: '⬆️', color: '#f7b267',
      items: [
        { label: 'Aumento de peso (mes 1)',  pct: 60, time: '+1.5-2 kg' },
        { label: 'Aumento de peso (mes 2)',  pct: 75, time: '+3-4 kg' },
        { label: 'Mejora de energía diaria', pct: 88, time: '2-3 sem.' },
        { label: 'Retención muscular',       pct: 80, time: 'Constante' },
      ],
    },
    gain_muscle: {
      title: 'Desarrollo muscular', icon: '💪', color: '#f4845f',
      items: [
        { label: 'Síntesis proteica diaria',  pct: 92, time: 'Día 1' },
        { label: 'Ganancia muscular (mes 1)', pct: 70, time: '+0.5-1 kg' },
        { label: 'Reducción grasa corporal',  pct: 65, time: 'Mes 2-3' },
        { label: 'Rendimiento físico',        pct: 85, time: '3-4 sem.' },
      ],
    },
    lose_weight: {
      title: 'Pérdida de peso esperada', icon: '⬇️', color: '#f4845f',
      items: [
        { label: 'Pérdida de peso (mes 1)',   pct: 80, time: '-1.5-2 kg' },
        { label: 'Pérdida de peso (mes 2)',   pct: 88, time: '-3-4 kg' },
        { label: 'Reducción grasa corporal',  pct: 82, time: 'Progresiva' },
        { label: 'Mejora de saciedad',        pct: 90, time: '1-2 sem.' },
      ],
    },
    maintain: {
      title: 'Bienestar esperado', icon: '⚖️', color: '#5a9e52',
      items: [
        { label: 'Estabilidad de peso', pct: 93, time: 'Constante' },
        { label: 'Niveles de energía',  pct: 88, time: '1-2 sem.' },
        { label: 'Salud digestiva',     pct: 85, time: '2-3 sem.' },
        { label: 'Bienestar general',   pct: 90, time: '3-4 sem.' },
      ],
    },
  }
  return p[goal] || p.maintain
}

export default function ProjectionsCard({ goal, weight, calories, activityLevel, delay = 0 }) {
  const proj = getProjections(goal, weight, calories)
  const water = calculateWater(weight, activityLevel, goal)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="card"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{proj.icon}</span>
        <h3 className="font-display font-bold" style={{ color: 'var(--text)' }}>{proj.title}</h3>
      </div>

      <div className="space-y-4">
        {proj.items.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-body font-bold" style={{ color: 'var(--text2)' }}>{item.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-body px-2 py-0.5 rounded-full"
                  style={{ color: proj.color, background: `color-mix(in srgb, ${proj.color} 15%, var(--surface2))` }}>
                  {item.time}
                </span>
                <span className="text-xs font-mono font-bold" style={{ color: proj.color }}>{item.pct}%</span>
              </div>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: proj.color }}
                initial={{ width: 0 }}
                animate={{ width: `${item.pct}%` }}
                transition={{ delay: delay + i * 0.15 + 0.3, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>
      {/* Agua recomendada */}
      <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💧</span>
            <div>
              <div className="text-xs font-body font-bold uppercase tracking-wide" style={{ color: 'var(--text2)' }}>
                Agua diaria recomendada
              </div>
              <div className="text-xs font-body mt-0.5" style={{ color: 'var(--text3)' }}>
                Distribuida en 8-10 vasos
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="font-display text-2xl font-bold text-terracotta-500">{water}</span>
            <span className="text-sm font-body ml-1" style={{ color: 'var(--text2)' }}>L</span>
          </div>
        </div>
        <div className="flex gap-1 mt-2">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="flex-1 h-2 rounded-full transition-all"
              style={{ backgroundColor: i < Math.round(water * 10 / 3) ? '#60a5fa' : 'var(--surface2)' }} />
          ))}
        </div>
      </div>

      <p className="text-xs font-body text-center mt-4 pt-3" style={{ color: 'var(--text3)', borderTop: '1px solid var(--border)' }}>
        Proyecciones estimadas al seguir el plan consistentemente
      </p>
    </motion.div>
  )
}
