
import { useState, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useAuth } from "./useAuth";

export interface WealthJourneyStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  actionText: string;
  highlight?: string;
  tip?: string;
}

/**
 * Hook para gerenciar o Wealth Journey Tour - experiência educativa de onboarding
 * Focado em transformação financeira prática, sem timer, no ritmo do usuário
 */
export function useWealthJourneyTour() {
  const { user } = useAuth();
  const [tourCompleted, setTourCompleted] = useLocalStorage(
    `wealth-journey-completed-${user?.id}`, 
    false
  );
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isManuallyActive, setIsManuallyActive] = useState(false);

  const totalSteps = 8;
  const isActive = (!tourCompleted && user) || isManuallyActive;

  const nextStep = useCallback(() => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      completeTour();
    }
  }, [currentStepIndex, totalSteps]);

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const skipTour = useCallback(() => {
    setTourCompleted(true);
    setCurrentStepIndex(0);
    setIsManuallyActive(false);
  }, [setTourCompleted]);

  const completeTour = useCallback(() => {
    setTourCompleted(true);
    setCurrentStepIndex(0);
    setIsManuallyActive(false);
    
    // Trigger celebration
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('wealthJourneyCompleted'));
    }
  }, [setTourCompleted]);

  const restartTour = useCallback(() => {
    console.log('🚀 Iniciando Jornada Plenus');
    setTourCompleted(false);
    setCurrentStepIndex(0);
    setIsManuallyActive(true);
  }, [setTourCompleted]);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      setCurrentStepIndex(stepIndex);
    }
  }, [totalSteps]);

  return {
    isActive,
    currentStepIndex,
    totalSteps,
    nextStep,
    previousStep,
    skipTour,
    completeTour,
    restartTour,
    goToStep,
  };
}
