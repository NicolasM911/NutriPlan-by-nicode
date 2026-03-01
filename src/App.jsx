import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Header from './components/UI/Header'
import Landing from './pages/Landing'
import Form from './pages/Form'
import Plan from './pages/Plan'
import MealDetail from './pages/MealDetail'

export default function App() {
  const location = useLocation()
  return (
    <div className="noise min-h-screen transition-colors duration-300" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Header />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"         element={<Landing />} />
          <Route path="/form"     element={<Form />} />
          <Route path="/plan"     element={<Plan />} />
          <Route path="/meal/:id" element={<MealDetail />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}
