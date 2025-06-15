
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useHasTransactions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['hasTransactions', user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { count, error } = await supabase
        .from('transactions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error checking for transactions:', error);
        return false;
      }

      return (count ?? 0) > 0;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
