
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

/**
 * Hook para verificar se o usuário possui dados de demonstração
 * Diferente de `useHasTransactions`, este hook verifica especificamente por dados marcados como demo
 */
export function useHasDemoData() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['hasDemoData', user?.id],
    queryFn: async (): Promise<boolean> => {
      if (!user) return false;

      try {
        // Verificar se há transações marcadas como demo
        const { data: demoTransactions, error } = await supabase
          .from('transactions')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_demo_data', true)
          .limit(1);

        if (error) {
          console.error('Erro ao verificar dados demo:', error);
          return false;
        }

        const hasDemoData = demoTransactions && demoTransactions.length > 0;
        
        console.log('🔍 Verificação de dados demo:', {
          userId: user.id,
          hasDemoData,
          demoCount: demoTransactions?.length || 0
        });

        return hasDemoData;
      } catch (error) {
        console.error('Erro na consulta de dados demo:', error);
        return false;
      }
    },
    enabled: !!user,
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 2 * 60 * 1000, // 2 minutos
    refetchOnWindowFocus: false,
  });
}
