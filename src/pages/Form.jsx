import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import UserForm from '../components/Form/UserForm'
import LoadingScreen from '../components/UI/LoadingScreen'
import { generatePlanWithGemini, getVariedMeals } from '../utils/api'
import { usePlanStorage } from '../hooks/useStorage'

export default function Form() {
  const navigate = useNavigate()
  const { setUserParams, setWeekPlan } = usePlanStorage()
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      setLoadingMsg('Buscando recetas reales...')
      const meals = await getVariedMeals(30)
      setLoadingMsg('Consultando con la IA...')
      const plan = await generatePlanWithGemini(formData, meals)
      setLoadingMsg('Finalizando tu plan...')
      setUserParams(formData)
      setWeekPlan(plan)
      await new Promise(r => setTimeout(r, 800))
      navigate('/plan')
    } catch (err) {
      console.error(err)
      setLoading(false)
      alert('Hubo un error generando el plan. Por favor intenta de nuevo.')
    }
  }

  if (loading) return <LoadingScreen message={loadingMsg} />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-12 px-4"
    >
      <div className="absolute top-32 right-0 w-64 h-64 bg-terracotta-200/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-32 left-0 w-64 h-64 bg-amber-200/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="text-5xl mb-3">📋</div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text)' }}>Crea tu plan</h1>
          <p className="font-body mt-1" style={{ color: 'var(--text2)' }}>Completa los datos y la IA hará el resto</p>
        </motion.div>
        <UserForm onSubmit={handleSubmit} />
      </div>
    </motion.div>
  )
}
