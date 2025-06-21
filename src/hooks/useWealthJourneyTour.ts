
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
    `wealth-journey-completed-${user?.id || 'anonymous'}`, 
    false
  );
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isManuallyActive, setIsManuallyActive] = useState(false);

  const totalSteps = 8;
  
  // Tour está ativo se: usuário logado E (não completou OU foi iniciado manualmente)
  const isActive = user && (!tourCompleted || isManuallyActive);

  const nextStep = useCallback(() => {
    console.log('🔄 Próximo passo do tour:', currentStepIndex + 1);
    
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      completeTour();
    }
  }, [currentStepIndex, totalSteps]);

  const previousStep = useCallback(() => {
    console.log('⬅️ Passo anterior do tour:', currentStepIndex - 1);
    
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const skipTour = useCallback(() => {
    console.log('⏭️ Pulando tour');
    
    setTourCompleted(true);
    setCurrentStepIndex(0);
    setIsManuallyActive(false);
  }, [setTourCompleted]);

  const completeTour = useCallback(() => {
    console.log('✅ Tour completado!');
    
    setTourCompleted(true);
    setCurrentStepIndex(0);
    setIsManuallyActive(false);
    
    // Trigger celebration
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('wealthJourneyCompleted'));
    }
  }, [setTourCompleted]);

  const restartTour = useCallback(() => {
    console.log('🚀 Reiniciando Jornada Plenus');
    
    // Reseta todos os estados
    setTourCompleted(false);
    setCurrentStepIndex(0);
    setIsManuallyActive(true);
    
    console.log('✨ Jornada Plenus iniciada com sucesso');
  }, [setTourCompleted]);

  const goToStep = useCallback((stepIndex: number) => {
    console.log('🎯 Indo para passo:', stepIndex);
    
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      setCurrentStepIndex(stepIndex);
    }
  }, [totalSteps]);

  return {
    isActive: Boolean(isActive),
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
