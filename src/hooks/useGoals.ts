
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useGoals() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['activeGoals', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log("useGoals: Buscando metas ativas para usuário:", user.id);
      
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("useGoals: Erro ao buscar metas:", error);
        throw error;
      }

      console.log("useGoals: Metas encontradas:", data);

      // Filtrar apenas metas não concluídas (current_amount < target_amount)
      const activeBucketGoals = data?.filter(goal => goal.current_amount < goal.target_amount) || [];
      console.log("useGoals: Metas ativas filtradas:", activeBucketGoals);

      return activeBucketGoals;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
