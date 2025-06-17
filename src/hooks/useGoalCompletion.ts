
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useGoalCompletion() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: completableGoal, isLoading } = useQuery({
    queryKey: ['completableGoal', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Busca por metas que ainda não foram celebradas e foram criadas há pelo menos 5 segundos
      // Isso evita celebrações imediatas quando dados demo são criados
      const fiveSecondsAgo = new Date(Date.now() - 5000).toISOString();
      
      const { data, error } = await supabase
        .from('goals')
        .select('id, name, current_amount, target_amount, created_at')
        .eq('user_id', user.id)
        .is('celebrated_at', null)
        .lt('created_at', fiveSecondsAgo); // Só considera metas criadas há mais de 5 segundos

      if (error) {
        console.error("Erro ao buscar metas não celebradas:", error);
        throw new Error(error.message);
      }

      // Encontra a primeira meta que foi concluída (valor atual >= valor alvo)
      const completedGoal = data?.find(goal => 
        goal.current_amount >= goal.target_amount && goal.target_amount > 0
      );

      return completedGoal || null;
    },
    enabled: !!user,
    // Refetch periodicamente para detectar novas metas completadas
    refetchInterval: 30000, // 30 segundos
    staleTime: 1000 * 30, // 30 segundos
  });

  const { mutate: markAsCelebrated, isPending: isMarkingAsCelebrated } = useMutation({
    mutationFn: async (goalId: string) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from('goals')
        .update({ celebrated_at: new Date().toISOString() })
        .eq('id', goalId);

      if (error) {
        console.error("Erro ao marcar meta como celebrada:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalida as queries para garantir que a UI seja atualizada
      queryClient.invalidateQueries({ queryKey: ['completableGoal', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['goals', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['goalsSummary', user?.id] });
    },
  });

  return { completableGoal, isLoading, markAsCelebrated, isMarkingAsCelebrated };
}
