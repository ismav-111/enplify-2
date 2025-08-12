
import { useState, useEffect } from "react"

export const useOnboarding = () => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    // Check if user has completed onboarding from localStorage
    const completed = localStorage.getItem("onboarding_completed")
    setHasCompletedOnboarding(completed === "true")
  }, [])

  const startOnboarding = () => {
    setShowOnboarding(true)
  }

  const completeOnboarding = () => {
    localStorage.setItem("onboarding_completed", "true")
    setHasCompletedOnboarding(true)
    setShowOnboarding(false)
  }

  const resetOnboarding = () => {
    localStorage.removeItem("onboarding_completed")
    setHasCompletedOnboarding(false)
  }

  return {
    hasCompletedOnboarding,
    showOnboarding,
    setShowOnboarding,
    startOnboarding,
    completeOnboarding,
    resetOnboarding,
  }
}
