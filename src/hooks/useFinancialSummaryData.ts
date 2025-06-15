
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useFinancialSummaryData() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['summary', user?.id],
    queryFn: async () => {
      if (!user) return { totalIncome: 0, totalExpense: 0, balance: 0 };
      
      const { data, error } = await supabase
        .from('transactions')
        .select('amount, type')
        .eq('user_id', user.id);

      if (error) {
        throw new Error(error.message);
      }

      const totalIncome = data
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

      const totalExpense = data
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

      const balance = totalIncome - totalExpense;

      return { totalIncome, totalExpense, balance };
    },
    enabled: !!user,
  });
}
