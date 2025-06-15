
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useRecentTransactions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['transactions', user?.id, 'recent'],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false })
        .limit(50);

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!user,
  });
}
