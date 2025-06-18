
import { useState, useEffect, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useAuth } from "./useAuth";

export interface CinemaTourStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: number;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Hook para gerenciar o Tour Guiado Avançado
 * Usa as melhores práticas modernas de onboarding
 */
export function useCinemaTour() {
  const { user, loading } = useAuth();
  const [tourCompleted, setTourCompleted] = useLocalStorage(
    `advanced-tour-completed-${user?.id}`, 
    false
  );
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Só ativa o tour se o usuário estiver autenticado, não estiver carregando e não tiver completado
  const shouldShowTour = !loading && user && !tourCompleted;

  // Inicia o tour com delay para garantir que a autenticação está estável
  useEffect(() => {
    if (shouldShowTour && !isActive) {
      const timer = setTimeout(() => {
        setIsActive(true);
      }, 1000); // Delay de 1 segundo para estabilizar a auth
      
      return () => clearTimeout(timer);
    }
  }, [shouldShowTour, isActive]);

  const nextStep = useCallback(() => {
    if (currentStepIndex < 4) { // Reduzido para 5 steps
      setCurrentStepIndex(prev => prev + 1);
    } else {
      completeTour();
    }
  }, [currentStepIndex]);

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const skipTour = useCallback(() => {
    setTourCompleted(true);
    setIsActive(false);
    setCurrentStepIndex(0);
  }, [setTourCompleted]);

  const completeTour = useCallback(() => {
    setTourCompleted(true);
    setIsActive(false);
    setCurrentStepIndex(0);
    
    // Celebration effect
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tourCompleted'));
    }
  }, [setTourCompleted]);

  const restartTour = useCallback(() => {
    setTourCompleted(false);
    setCurrentStepIndex(0);
    setIsActive(true);
    setIsPaused(false);
  }, [setTourCompleted]);

  const pauseResume = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  return {
    isActive,
    currentStepIndex,
    isPaused,
    totalSteps: 5,
    nextStep,
    previousStep,
    pauseResume,
    skipTour,
    completeTour,
    restartTour,
  };
}
