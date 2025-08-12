
import { useState, useEffect } from 'react';

export interface OnboardingData {
  apiKey: string;
  websiteUrl: string;
  youtubeUrl: string;
  dataSource: string;
}

export const useMinimalOnboarding = () => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if onboarding was completed before
    const completed = localStorage.getItem('onboarding_completed');
    if (completed === 'true') {
      setIsOnboardingComplete(true);
    }
  }, []);

  const startOnboarding = () => {
    setShowOnboarding(true);
  };

  const completeOnboarding = (data: OnboardingData) => {
    // Store the onboarding data
    localStorage.setItem('onboarding_data', JSON.stringify(data));
    localStorage.setItem('onboarding_completed', 'true');
    
    setIsOnboardingComplete(true);
    setShowOnboarding(false);
    
    console.log('Onboarding completed with data:', data);
  };

  const skipOnboarding = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setIsOnboardingComplete(true);
    setShowOnboarding(false);
  };

  const closeOnboarding = () => {
    setShowOnboarding(false);
  };

  return {
    isOnboardingComplete,
    showOnboarding,
    startOnboarding,
    completeOnboarding,
    skipOnboarding,
    closeOnboarding
  };
};
