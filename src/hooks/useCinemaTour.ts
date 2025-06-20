
import { useState, useEffect, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useAuth } from "./useAuth";

export interface CinemaTourStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: number;
  highlight?: string;
}

/**
 * Hook para gerenciar o Cinema Tour - experiência premium de onboarding
 * Substitui o onboarding básico por uma jornada cinematográfica imersiva
 */
export function useCinemaTour() {
  const { user } = useAuth();
  const [tourCompleted, setTourCompleted] = useLocalStorage(
    `cinema-tour-completed-${user?.id}`, 
    false
  );
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isManuallyActive, setIsManuallyActive] = useState(false);

  const totalSteps = 7;
  const stepDuration = 4000; // 4 segundos por step em média

  // Tour está ativo se: usuário logado E (não completou OU foi iniciado manualmente) E nenhum outro tour ativo
  const isActive = user && (!tourCompleted || isManuallyActive);

  // Auto-progress do tour quando está playing
  useEffect(() => {
    if (!isActive || !isPlaying) return;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          nextStep();
          return 0;
        }
        return prev + (100 / (stepDuration / 100));
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isActive, isPlaying, currentStepIndex]);

  const nextStep = useCallback(() => {
    setProgress(0);
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      completeTour();
    }
  }, [currentStepIndex, totalSteps]);

  const previousStep = useCallback(() => {
    setProgress(0);
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const playPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const skipTour = useCallback(() => {
    setTourCompleted(true);
    setCurrentStepIndex(0);
    setProgress(0);
    setIsManuallyActive(false);
  }, [setTourCompleted]);

  const completeTour = useCallback(() => {
    setTourCompleted(true);
    setCurrentStepIndex(0);
    setProgress(0);
    setIsManuallyActive(false);
    
    // Trigger celebration animation
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tourCompleted'));
    }
  }, [setTourCompleted]);

  const restartTour = useCallback(() => {
    console.log('🎬 Reiniciando Cinema Tour');
    
    // Garante que outros tours sejam desativados
    localStorage.setItem(`wealth-journey-completed-${user?.id || 'anonymous'}`, 'true');
    
    setTourCompleted(false);
    setCurrentStepIndex(0);
    setProgress(0);
    setIsPlaying(true);
    setIsManuallyActive(true);
    
    console.log('🎭 Cinema Tour iniciado com sucesso');
  }, [setTourCompleted, user?.id]);

  return {
    isActive: Boolean(isActive),
    currentStepIndex,
    isPlaying,
    isMuted,
    progress,
    nextStep,
    previousStep,
    playPause,
    toggleMute,
    skipTour,
    completeTour,
    restartTour,
  };
}
