
import { useDashboardData } from "./useDashboardData";

/**
 * Hook simplificado que utiliza o useDashboardData otimizado
 * Mantém compatibilidade com componentes existentes
 */
export function useGoalsSummary() {
  const { data, isLoading, error, refetch } = useDashboardData();

  return {
    data: data ? {
      count: data.goalsCount,
      totalSaved: data.totalSaved,
    } : { count: 0, totalSaved: 0 },
    isLoading,
    error,
    refetch,
  };
}
