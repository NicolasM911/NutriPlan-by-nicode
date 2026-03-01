import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GOALS, PREFERENCES, ACTIVITY_LEVELS, calculateTDEE, adjustCaloriesForGoal } from '../../utils/nutrition'

const STEPS = ['Datos personales', 'Tu objetivo', 'Preferencias', 'Confirmación']

// Estilos de botón seleccionable usando CSS variables inline
const selStyle = (selected) => ({
  backgroundColor: selected
    ? 'color-mix(in srgb, var(--accent) 10%, var(--surface))'
    : 'var(--surface2)',
  borderColor: selected ? 'var(--accent)' : 'var(--border)',
  color: 'var(--text)',
})

export default function UserForm({ onSubmit }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: '', age: '', weight: '', height: '',
    sex: 'male', activityLevel: 'moderate',
    goal: '', preference: 'none', restrictions: '',
    calories: '', useAutoCalories: true,
  })

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  const computed = form.weight && form.height && form.age && form.goal
    ? adjustCaloriesForGoal(calculateTDEE(+form.weight, +form.height, +form.age, form.sex, form.activityLevel), form.goal)
    : null

  const canProceed = [form.name && form.age && form.weight && form.height, !!form.goal, true, true][step]

  const handleSubmit = () => onSubmit({ ...form, calories: form.useAutoCalories ? computed : parseInt(form.calories) })

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Step bar */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className="flex-1">
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{ backgroundColor: i <= step ? 'var(--accent)' : 'var(--border)' }}
            />
            <p className="text-xs font-body mt-1 text-center hidden sm:block transition-colors"
              style={{ color: i === step ? 'var(--accent)' : 'var(--text3)', fontWeight: i === step ? 700 : 400 }}>
              {s}
            </p>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* STEP 0 */}
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-5">
            <div>
              <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>¡Hola! Cuéntanos sobre ti</h2>
              <p className="font-body mt-1" style={{ color: 'var(--text2)' }}>Estos datos nos ayudan a calcular tus necesidades exactas</p>
            </div>
            <div>
              <label className="label">Tu nombre</label>
              <input className="input-field" placeholder="Ej: María García" value={form.name} onChange={e => update('name', e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[['Edad','age','25','15','100'],['Peso (kg)','weight','70','30','200'],['Altura (cm)','height','170','140','220']].map(([lbl,fld,ph,mn,mx]) => (
                <div key={fld}>
                  <label className="label">{lbl}</label>
                  <input className="input-field" type="number" placeholder={ph} min={mn} max={mx}
                    value={form[fld]} onChange={e => update(fld, e.target.value)} />
                </div>
              ))}
            </div>
            <div>
              <label className="label">Sexo biológico</label>
              <div className="grid grid-cols-2 gap-3">
                {[{ id: 'male', label: '♂ Masculino' }, { id: 'female', label: '♀ Femenino' }].map(s => (
                  <button key={s.id} onClick={() => update('sex', s.id)}
                    className="py-3 rounded-xl font-body font-bold border-2 transition-all"
                    style={selStyle(form.sex === s.id)}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Nivel de actividad</label>
              <div className="space-y-2">
                {ACTIVITY_LEVELS.map(a => (
                  <button key={a.id} onClick={() => update('activityLevel', a.id)}
                    className="w-full flex justify-between items-center px-4 py-3 rounded-xl border-2 font-body transition-all"
                    style={selStyle(form.activityLevel === a.id)}>
                    <span className="font-bold">{a.label}</span>
                    <span className="text-xs" style={{ color: 'var(--text3)' }}>{a.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-5">
            <div>
              <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>¿Cuál es tu objetivo?</h2>
              <p className="font-body mt-1" style={{ color: 'var(--text2)' }}>Elige el que mejor describe lo que quieres lograr</p>
            </div>
            <div className="space-y-3">
              {GOALS.map(g => (
                <button key={g.id} onClick={() => update('goal', g.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200"
                  style={selStyle(form.goal === g.id)}>
                  <span className="text-3xl">{g.emoji}</span>
                  <div>
                    <div className="font-display font-bold" style={{ color: 'var(--text)' }}>{g.label}</div>
                    <div className="text-xs font-body mt-0.5" style={{ color: 'var(--text2)' }}>{g.description}</div>
                  </div>
                  {form.goal === g.id && <div className="ml-auto text-terracotta-500 text-xl">✓</div>}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-5">
            <div>
              <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>Tus preferencias</h2>
              <p className="font-body mt-1" style={{ color: 'var(--text2)' }}>Esto ayuda a personalizar las recetas</p>
            </div>
            <div>
              <label className="label">Tipo de alimentación</label>
              <div className="grid grid-cols-2 gap-3">
                {PREFERENCES.map(p => (
                  <button key={p.id} onClick={() => update('preference', p.id)}
                    className="flex items-center gap-2 p-3 rounded-xl border-2 font-body font-bold text-sm transition-all"
                    style={selStyle(form.preference === p.id)}>
                    <span>{p.emoji}</span>{p.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Alergias o restricciones</label>
              <textarea className="input-field resize-none" rows={3}
                placeholder="Ej: Intolerancia a la lactosa, alergia al maní..."
                value={form.restrictions} onChange={e => update('restrictions', e.target.value)} />
            </div>
            <div>
              <label className="label">Calorías diarias</label>
              <div className="space-y-3">
                {[
                  { auto: true,  label: 'Calcular automáticamente ✨', sub: computed ? `${computed} kcal/día recomendadas` : null, accent: '#5a9e52' },
                  { auto: false, label: 'Ingresar manualmente', sub: null, accent: '#f7b267' },
                ].map(({ auto, label, sub, accent }) => (
                  <button key={String(auto)} onClick={() => update('useAutoCalories', auto)}
                    className="w-full flex justify-between items-center p-4 rounded-xl border-2 transition-all"
                    style={{
                      backgroundColor: form.useAutoCalories === auto
                        ? `color-mix(in srgb, ${accent} 10%, var(--surface))`
                        : 'var(--surface2)',
                      borderColor: form.useAutoCalories === auto ? accent : 'var(--border)',
                    }}>
                    <div className="text-left">
                      <div className="font-body font-bold text-sm" style={{ color: 'var(--text)' }}>{label}</div>
                      {sub && <div className="text-xs font-mono mt-0.5" style={{ color: accent }}>{sub}</div>}
                    </div>
                    {form.useAutoCalories === auto && <span style={{ color: accent }} className="text-lg">✓</span>}
                  </button>
                ))}
                {!form.useAutoCalories && (
                  <input className="input-field" type="number" placeholder="Ej: 2000" min="1000" max="5000"
                    value={form.calories} onChange={e => update('calories', e.target.value)} />
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-5">
            <div>
              <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>¡Todo listo, {form.name}! 🎉</h2>
              <p className="font-body mt-1" style={{ color: 'var(--text2)' }}>Revisa tu información antes de generar el plan</p>
            </div>
            <div className="rounded-3xl p-6 space-y-4"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
              {[
                { label: 'Nombre', value: form.name },
                { label: 'Edad / Peso / Altura', value: `${form.age} años · ${form.weight} kg · ${form.height} cm` },
                { label: 'Objetivo', value: GOALS.find(g => g.id === form.goal)?.label || '-' },
                { label: 'Preferencia', value: PREFERENCES.find(p => p.id === form.preference)?.label || '-' },
                { label: 'Calorías objetivo', value: `${form.useAutoCalories ? computed : form.calories} kcal/día` },
                form.restrictions && { label: 'Restricciones', value: form.restrictions },
              ].filter(Boolean).map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4 pb-3 last:pb-0"
                  style={{ borderBottom: '1px solid var(--border)' }}>
                  <span className="text-xs font-body uppercase tracking-wider font-bold" style={{ color: 'var(--text3)' }}>{label}</span>
                  <span className="text-sm font-body font-bold text-right" style={{ color: 'var(--text)' }}>{value}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl p-4 text-sm font-body"
              style={{ backgroundColor: 'color-mix(in srgb, #f7b267 10%, var(--surface))', border: '2px solid color-mix(in srgb, #f7b267 30%, var(--border))', color: 'var(--text2)' }}>
              <strong style={{ color: 'var(--text)' }}>💡 Nota:</strong> Este es un plan generado con Inteligencia Artificial, los resultados varian según el metabolismo y adherencia al plan.
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} className="btn-secondary flex-1">← Anterior</button>
        )}
        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep(s => s + 1)} disabled={!canProceed}
            className={`btn-primary flex-1 ${!canProceed ? 'opacity-40 cursor-not-allowed' : ''}`}>
            Siguiente →
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn-primary flex-1 text-base py-4">
            🥗 Generar mi Plan
          </button>
        )}
      </div>
    </div>
  )
}
