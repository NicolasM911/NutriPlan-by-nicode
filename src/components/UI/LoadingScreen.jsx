import { motion } from 'framer-motion'

export default function LoadingScreen({ message = '' }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <motion.div
        animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-8xl"
      >🥗</motion.div>

      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-terracotta-400"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>

      <div className="text-center space-y-2">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>
          Creando tu plan
        </h2>
        <p className="font-body" style={{ color: 'var(--text2)' }}>
          {message || 'Personalizando tu alimentación...'}
        </p>
      </div>

      <div
        className="w-64 h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--surface2)' }}
      >
        <motion.div
          className="h-full bg-terracotta-400 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 4, ease: 'easeInOut' }}
        />
      </div>
    </div>
  )
}
