import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (err) {
      console.error(err)
    }
  }

  return [storedValue, setValue]
}

export function usePlanStorage() {
  const [userParams, setUserParams] = useLocalStorage('nutriplan_user', null)
  const [weekPlan, setWeekPlan] = useLocalStorage('nutriplan_week', null)

  const clearPlan = () => {
    setUserParams(null)
    setWeekPlan(null)
  }

  return { userParams, setUserParams, weekPlan, setWeekPlan, clearPlan }
}
