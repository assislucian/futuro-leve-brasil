
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useBudgets } from "@/hooks/useBudgets";
import { supabase } from "@/integrations/supabase/client";

export type NextAction = {
  title: string;
  description: string;
  link: string;
  cta: string;
  icon: string;
};

export function useNextAction() {
  const { user } = useAuth();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const { budgetsWithSpending, isLoading: isLoadingBudgets, hasBudgets } = useBudgets(currentYear, currentMonth);

  const { data: goals, isLoading: isLoadingGoals } = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('goals')
        .select('name, target_amount, current_amount')
        .eq('user_id', user.id);

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user,
  });

  const isLoading = isLoadingBudgets || isLoadingGoals;

  const nextAction: NextAction | null = useMemo(() => {
    if (isLoading) return null;

    if (!hasBudgets) {
      return {
        title: "Crie seu primeiro orçamento",
        description: "Organize seus gastos para ter clareza e controle financeiro.",
        link: "/budgets",
        cta: "Criar Orçamento",
        icon: "CircleDollarSign",
      };
    }

    if (!goals || goals.length === 0) {
      return {
        title: "Defina seu primeiro sonho",
        description: "Transforme seus sonhos em metas e comece a jornada para realizá-los.",
        link: "/goals",
        cta: "Criar Meta",
        icon: "Star",
      };
    }

    const budgetNearLimit = budgetsWithSpending.find(b => b.progress > 80 && b.progress < 100);
    if (budgetNearLimit) {
      return {
        title: `Atenção ao orçamento de ${budgetNearLimit.category}`,
        description: `Você já utilizou mais de 80% do seu limite. Fique de olho!`,
        link: "/budgets",
        cta: "Ver Orçamentos",
        icon: "AlertTriangle",
      };
    }

    const goalToContribute = goals.find(g => g.current_amount < g.target_amount);
    if (goalToContribute) {
      return {
        title: `Rumo ao sonho: ${goalToContribute.name}`,
        description: `Continue progredindo! Que tal adicionar uma contribuição hoje?`,
        link: "/goals",
        cta: "Ver Metas",
        icon: "Target",
      };
    }

    return {
      title: "Continue no controle",
      description: "Você está no caminho certo! Continue acompanhando suas finanças.",
      link: "/dashboard",
      cta: "Ver Resumo",
      icon: "Sparkles",
    };
  }, [isLoading, hasBudgets, budgetsWithSpending, goals]);

  return { nextAction, isLoading };
}
