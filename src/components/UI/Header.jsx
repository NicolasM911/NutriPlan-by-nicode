import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDarkMode } from '../../hooks/useDarkMode.jsx'

export default function Header() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { dark, toggle } = useDarkMode()

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        backgroundColor: isHome ? 'transparent' : 'color-mix(in srgb, var(--bg) 92%, transparent)',
        borderBottomColor: 'var(--border)',
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHome ? '' : 'backdrop-blur-md shadow-warm border-b'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🥗</span>
          <span className="font-display font-bold text-xl" style={{ color: 'var(--text)' }}>NutriPlan</span>
        </Link>

        <nav className="flex items-center gap-3">
          {!isHome && (
            <>
              <Link to="/form"
                className="text-sm font-body font-bold hover:text-terracotta-500 transition-colors"
                style={{ color: 'var(--text2)' }}>
                Nuevo Plan
              </Link>
              {location.pathname === '/plan' && (
                <Link to="/" className="btn-secondary text-sm py-2 px-4">Inicio</Link>
              )}
            </>
          )}

          <motion.button
            onClick={toggle}
            whileTap={{ scale: 0.9 }}
            style={{ backgroundColor: 'var(--surface2)', borderColor: 'var(--border)' }}
            className="w-9 h-9 rounded-xl flex items-center justify-center border hover:border-terracotta-400 transition-all"
            aria-label="Cambiar tema"
          >
            <motion.span
              key={dark ? 'sun' : 'moon'}
              initial={{ rotate: -30, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="text-base"
            >
              {dark ? '☀️' : '🌙'}
            </motion.span>
          </motion.button>
        </nav>
      </div>
    </motion.header>
  )
}
