
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useGoalsSummary() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['goalsSummary', user?.id],
    queryFn: async () => {
      if (!user) return { count: 0, totalSaved: 0 };
      
      const { data, error } = await supabase
        .from('goals')
        .select('current_amount')
        .eq('user_id', user.id);

      if (error) {
        console.error("Erro ao buscar resumo de metas:", error);
        throw new Error("Não foi possível buscar o resumo de metas.");
      }

      const totalSaved = data.reduce((acc, goal) => acc + goal.current_amount, 0);
      return { count: data.length, totalSaved };
    },
    enabled: !!user,
  });
}
