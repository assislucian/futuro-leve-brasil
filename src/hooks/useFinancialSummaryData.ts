
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface FinancialSummaryData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

/**
 * Hook otimizado para dados do resumo financeiro
 * Usa cache agressivo e invalidação inteligente
 */
export function useFinancialSummaryData() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['financialSummary', user?.id],
    queryFn: async (): Promise<FinancialSummaryData> => {
      if (!user) {
        return {
          totalIncome: 0,
          totalExpense: 0,
          balance: 0,
        };
      }

      console.log("useFinancialSummaryData: Buscando dados financeiros para:", user.id);

      const { data, error } = await supabase
        .from('transactions')
        .select('amount, type')
        .eq('user_id', user.id);

      if (error) {
        console.error("useFinancialSummaryData: Erro ao buscar transações:", error);
        throw new Error('Erro ao carregar dados financeiros');
      }

      console.log("useFinancialSummaryData: Transações encontradas:", data?.length || 0);

      const transactions = data || [];
      
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const result = {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
      };

      console.log("useFinancialSummaryData: Resultado calculado:", result);

      return result;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutos
    gcTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: true, // Atualiza quando volta para a janela
    refetchOnMount: true, // Sempre busca ao montar
    retry: 2,
  });
}
