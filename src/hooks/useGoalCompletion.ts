
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

      // Busca por metas que ainda não foram celebradas
      const { data, error } = await supabase
        .from('goals')
        .select('id, name, current_amount, target_amount')
        .eq('user_id', user.id)
        .is('celebrated_at', null);

      if (error) {
        console.error("Erro ao buscar metas não celebradas:", error);
        throw new Error(error.message);
      }

      // Encontra a primeira meta que foi concluída (valor atual >= valor alvo)
      const completedGoal = data.find(goal => goal.current_amount >= goal.target_amount);

      return completedGoal || null;
    },
    enabled: !!user,
    // Garante que não vai buscar em cache para sempre e permite novas celebrações
    staleTime: 1000 * 60, 
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
    },
  });

  return { completableGoal, isLoading, markAsCelebrated, isMarkingAsCelebrated };
}
