import { useDarkMode } from '../../hooks/useDarkMode.jsx'

export function MacroBar({ label, value, total, color, unit = 'g' }) {
  const pct = Math.min(100, Math.round((value / total) * 100))
  const colorMap = {
    protein:  'bg-terracotta-400',
    carbs:    'bg-amber-400',
    fat:      'bg-sage-400',
    calories: 'bg-terracotta-300',
  }
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs font-body font-bold">
        <span style={{ color: 'var(--text2)' }} className="uppercase tracking-wide">{label}</span>
        <span style={{ color: 'var(--text)' }}>{value}{unit}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface2)' }}>
        <div
          className={`h-full rounded-full transition-all duration-700 ${colorMap[color] || 'bg-terracotta-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function CalorieRing({ consumed, total, size = 80 }) {
  const { dark } = useDarkMode()
  const pct   = Math.min(100, (consumed / total) * 100)
  const r     = (size - 8) / 2
  const circ  = 2 * Math.PI * r
  const dash  = (pct / 100) * circ

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={dark ? '#2a2a2a' : '#F0E0D0'} strokeWidth="8" />
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke="#F4845F" strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-display font-bold leading-none"
          style={{ fontSize: size * 0.18, color: 'var(--text)' }}>
          {Math.round(pct)}%
        </div>
      </div>
    </div>
  )
}
