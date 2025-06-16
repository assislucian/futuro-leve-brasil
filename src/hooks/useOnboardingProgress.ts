
import { useEffect } from "react";
import { useOnboarding } from "./useOnboarding";
import { useHasTransactions } from "./useHasTransactions";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook que monitora o progresso real do usuário e avança o onboarding automaticamente
 * Torna a experiência mais fluida e natural
 */
export function useOnboardingProgress() {
  const { user } = useAuth();
  const { currentStepIndex, nextStep, isOnboardingActive } = useOnboarding();
  const { data: hasTransactions } = useHasTransactions();

  // Verifica se o usuário tem metas
  const { data: hasGoals } = useQuery({
    queryKey: ['hasGoals', user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase
        .from('goals')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      
      if (error) return false;
      return data && data.length > 0;
    },
    enabled: !!user && !!isOnboardingActive,
  });

  // Verifica se o usuário tem orçamentos
  const { data: hasBudgets } = useQuery({
    queryKey: ['hasBudgets', user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase
        .from('budgets')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      
      if (error) return false;
      return data && data.length > 0;
    },
    enabled: !!user && !!isOnboardingActive,
  });

  // Avança automaticamente baseado no progresso real
  useEffect(() => {
    if (!isOnboardingActive) return;

    // Passo 1: Adicionar transação
    if (currentStepIndex === 1 && hasTransactions) {
      setTimeout(() => nextStep(), 1000); // Pequeno delay para o usuário ver o progresso
    }

    // Passo 2: Criar meta
    if (currentStepIndex === 2 && hasGoals) {
      setTimeout(() => nextStep(), 1000);
    }

    // Passo 3: Criar orçamento
    if (currentStepIndex === 3 && hasBudgets) {
      setTimeout(() => nextStep(), 1000);
    }
  }, [currentStepIndex, hasTransactions, hasGoals, hasBudgets, isOnboardingActive, nextStep]);

  return {
    hasTransactions: !!hasTransactions,
    hasGoals: !!hasGoals,
    hasBudgets: !!hasBudgets,
  };
}
