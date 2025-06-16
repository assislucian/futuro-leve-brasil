
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  goalsCount: number;
  totalSaved: number;
  budgetedAmount: number;
  spentAmount: number;
}

/**
 * Hook centralizado para dados essenciais do Dashboard
 * Otimizado para reduzir chamadas desnecessárias à API
 */
export function useDashboardData() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboardSummary', user?.id],
    queryFn: async (): Promise<DashboardSummary> => {
      if (!user) {
        return {
          totalIncome: 0,
          totalExpense: 0,
          balance: 0,
          goalsCount: 0,
          totalSaved: 0,
          budgetedAmount: 0,
          spentAmount: 0,
        };
      }

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      try {
        // Executar todas as consultas em paralelo para melhor performance
        const [
          transactionsResult,
          goalsResult,
          budgetsResult
        ] = await Promise.allSettled([
          // Buscar transações
          supabase
            .from('transactions')
            .select('amount, type')
            .eq('user_id', user.id),
          
          // Buscar metas
          supabase
            .from('goals')
            .select('current_amount')
            .eq('user_id', user.id),
          
          // Buscar orçamentos do mês atual
          supabase
            .from('budgets')
            .select('amount')
            .eq('user_id', user.id)
            .eq('year', currentYear)
            .eq('month', currentMonth)
        ]);

        // Processar transações
        let totalIncome = 0;
        let totalExpense = 0;
        
        if (transactionsResult.status === 'fulfilled' && !transactionsResult.value.error) {
          const transactions = transactionsResult.value.data || [];
          totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + t.amount, 0);
          totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => acc + t.amount, 0);
        }

        // Processar metas
        let goalsCount = 0;
        let totalSaved = 0;
        
        if (goalsResult.status === 'fulfilled' && !goalsResult.value.error) {
          const goals = goalsResult.value.data || [];
          goalsCount = goals.length;
          totalSaved = goals.reduce((acc, goal) => acc + goal.current_amount, 0);
        }

        // Processar orçamentos
        let budgetedAmount = 0;
        
        if (budgetsResult.status === 'fulfilled' && !budgetsResult.value.error) {
          const budgets = budgetsResult.value.data || [];
          budgetedAmount = budgets.reduce((acc, budget) => acc + budget.amount, 0);
        }

        // Calcular gastos do mês atual para orçamento
        let spentAmount = 0;
        const startDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
        let nextMonth = currentMonth + 1;
        let nextYear = currentYear;
        if (nextMonth > 12) {
          nextMonth = 1;
          nextYear = currentYear + 1;
        }
        const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;

        const expensesResult = await supabase
          .from('transactions')
          .select('amount')
          .eq('user_id', user.id)
          .eq('type', 'expense')
          .gte('transaction_date', startDate)
          .lt('transaction_date', endDate);

        if (!expensesResult.error && expensesResult.data) {
          spentAmount = expensesResult.data.reduce((acc, expense) => acc + expense.amount, 0);
        }

        return {
          totalIncome,
          totalExpense,
          balance: totalIncome - totalExpense,
          goalsCount,
          totalSaved,
          budgetedAmount,
          spentAmount,
        };

      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        throw new Error('Falha ao carregar dados do dashboard');
      }
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    retry: 2,
  });
}
