import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const FEATURES = [
  { emoji: '🦠', title: 'H. Pylori',       desc: 'Dieta antiinflamatoria para combatir la bacteria' },
  { emoji: '💪', title: 'Masa Muscular',    desc: 'Proteína optimizada para máximo crecimiento' },
  { emoji: '⬇️', title: 'Bajar Peso',       desc: 'Déficit inteligente sin pasar hambre' },
  { emoji: '⬆️', title: 'Aumentar Peso',    desc: 'Superávit calórico con nutrición real' },
  { emoji: '⚖️', title: 'Mantener Peso',    desc: 'Equilibrio perfecto para tu cuerpo' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Cuéntanos sobre ti',  desc: 'Edad, peso, altura y nivel de actividad' },
  { step: '02', title: 'Elige tu objetivo',   desc: 'Uno de nuestros 5 planes especializados' },
  { step: '03', title: 'La IA trabaja',       desc: 'Gemini + recetas reales diseñan tu semana' },
  { step: '04', title: 'Disfruta tu plan',    desc: 'Vista semanal clara y exporta en PDF' },
]

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-terracotta-200/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="text-8xl mb-6 float inline-block"
          >🥗</motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="font-display font-black text-5xl sm:text-6xl md:text-7xl leading-tight"
            style={{ color: 'var(--text)' }}
          >
            Tu alimentación,<br />
            <span className="text-terracotta-400">perfectamente</span> diseñada
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-6 text-lg font-body max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--text2)' }}
          >
            NutriPlan usa inteligencia artificial y recetas reales para crear tu plan
            alimenticio personalizado de 7 días según tus objetivos específicos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/form" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
              🚀 Crear mi plan gratis
            </Link>
            <a href="#how" className="btn-secondary text-lg px-8 py-4 inline-flex items-center gap-2">
              ¿Cómo funciona? ↓
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 flex flex-wrap justify-center gap-4 text-sm font-body"
            style={{ color: 'var(--text3)' }}
          >
            <span>✓ 100% Gratis</span>
            <span>✓ Sin registro</span>
            <span>✓ IA real (Gemini)</span>
            <span>✓ Exportar en PDF</span>
          </motion.div>
        </div>
      </section>

      {/* Goals */}
      <section className="py-16 px-4" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">5 Objetivos especializados</h2>
            <p className="font-body mt-2" style={{ color: 'var(--text2)' }}>
              Cada plan es único y científicamente diseñado
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-hover text-center"
              >
                <div className="text-4xl mb-3">{f.emoji}</div>
                <h3 className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>{f.title}</h3>
                <p className="text-xs font-body mt-1 leading-relaxed" style={{ color: 'var(--text2)' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">¿Cómo funciona?</h2>
            <p className="font-body mt-2" style={{ color: 'var(--text2)' }}>
              En 4 simples pasos tienes tu plan completo
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((h, i) => (
              <motion.div
                key={h.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="font-mono text-5xl font-bold leading-none mb-3 text-terracotta-300 dark:text-terracotta-800">
                  {h.step}
                </div>
                <h3 className="font-display font-bold mb-1" style={{ color: 'var(--text)' }}>{h.title}</h3>
                <p className="text-sm font-body" style={{ color: 'var(--text2)' }}>{h.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center rounded-3xl p-10 shadow-warm-xl"
          style={{ background: 'linear-gradient(135deg, #F4845F, #F7B267)' }}
        >
          <div className="text-6xl mb-4">🌟</div>
          <h2 className="font-display text-3xl font-bold text-white">
            ¿Listo para transformar tu alimentación?
          </h2>
          <p className="text-white/80 font-body mt-3 mb-8">
            Crea tu plan personalizado en menos de 2 minutos. Gratis, sin registro.
          </p>
          <Link to="/form"
            className="inline-flex items-center gap-2 bg-white text-terracotta-500 font-body font-bold text-lg px-10 py-4 rounded-2xl hover:shadow-warm-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          >
            🥗 Comenzar ahora
          </Link>
        </motion.div>
      </section>

      <footer className="py-8 text-center text-sm font-body" style={{ color: 'var(--text3)', borderTop: '1px solid var(--border)' }}>
        <p>NutriPlan · Powered by Gemini AI & TheMealDB · {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}
