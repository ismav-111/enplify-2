
import { useState, useEffect } from 'react'

export function useMinimalOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding')
    const isFirstTime = localStorage.getItem('isFirstTimeUser')
    
    if (isFirstTime === 'true' && !hasCompletedOnboarding) {
      setShowOnboarding(true)
      // Clear the first time flag
      localStorage.removeItem('isFirstTimeUser')
    }
  }, [])

  const completeOnboarding = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true')
    setShowOnboarding(false)
  }

  const closeOnboarding = () => {
    setShowOnboarding(false)
  }

  return {
    showOnboarding,
    completeOnboarding,
    closeOnboarding
  }
}
