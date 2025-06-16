
import { useDashboardData } from "./useDashboardData";

/**
 * Hook simplificado que utiliza o useDashboardData otimizado
 * Mantém compatibilidade com componentes existentes
 */
export function useBudgetsSummary() {
  const { data, isLoading, error, refetch } = useDashboardData();

  return {
    data: data ? {
      totalBudgeted: data.budgetedAmount,
      totalSpent: data.spentAmount,
    } : { totalBudgeted: 0, totalSpent: 0 },
    isLoading,
    error,
    refetch,
  };
}
