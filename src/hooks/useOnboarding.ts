
import { useState, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useAuth } from "./useAuth";

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

/**
 * Hook para gerenciar o estado do onboarding do usuário
 * Garante uma jornada guiada e reduz abandono
 */
export function useOnboarding() {
  const { user } = useAuth();
  const [onboardingCompleted, setOnboardingCompleted] = useLocalStorage(
    `onboarding-completed-${user?.id}`, 
    false
  );
  
  const [currentStep, setCurrentStep] = useLocalStorage(
    `onboarding-step-${user?.id}`, 
    0
  );

  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Bem-vindo ao Plenus! 🎉",
      description: "Vamos começar sua jornada para a plenitude financeira. Este tutorial rápido vai te ajudar a aproveitar ao máximo a plataforma.",
      completed: false
    },
    {
      id: "add-transaction",
      title: "Adicione sua primeira transação 💰",
      description: "Registre uma receita ou despesa para começar a acompanhar suas finanças. Pode ser algo simples como o café da manhã!",
      completed: false
    },
    {
      id: "create-goal",
      title: "Defina seu primeiro sonho 🎯",
      description: "Transforme um sonho em meta! Pode ser uma viagem, uma reserva de emergência ou aquele curso que você quer fazer.",
      completed: false
    },
    {
      id: "create-budget",
      title: "Organize seus gastos 📊",
      description: "Crie um orçamento para ter controle total sobre onde seu dinheiro está indo. Comece com categorias básicas.",
      completed: false
    }
  ];

  const isOnboardingActive = !onboardingCompleted && user;
  const currentStepData = steps[currentStep] || null;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const skipOnboarding = () => {
    setOnboardingCompleted(true);
    setCurrentStep(0);
  };

  const completeOnboarding = () => {
    setOnboardingCompleted(true);
    setCurrentStep(0);
  };

  const resetOnboarding = () => {
    setOnboardingCompleted(false);
    setCurrentStep(0);
  };

  return {
    isOnboardingActive,
    currentStep: currentStepData,
    currentStepIndex: currentStep,
    steps,
    progress,
    nextStep,
    skipOnboarding,
    completeOnboarding,
    resetOnboarding,
  };
}
