
import { useDashboardData } from "./useDashboardData";

/**
 * Hook simplificado que utiliza o useDashboardData otimizado
 * Mantém compatibilidade com componentes existentes
 */
export function useFinancialSummaryData() {
  const { data, isLoading, error, refetch } = useDashboardData();

  return {
    data: data ? {
      totalIncome: data.totalIncome,
      totalExpense: data.totalExpense,
      balance: data.balance,
    } : { totalIncome: 0, totalExpense: 0, balance: 0 },
    isLoading,
    error,
    refetch,
  };
}
