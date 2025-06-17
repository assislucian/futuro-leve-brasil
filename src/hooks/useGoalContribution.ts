
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function useGoalContribution(onSuccess?: () => void) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ goalId, amount }: { goalId: string; amount: number }) => {
      if (!user) throw new Error("Usuário não autenticado");

      console.log("useGoalContribution: Adicionando contribuição:", { goalId, amount });

      const { error } = await supabase
        .from('goal_contributions')
        .insert({
          goal_id: goalId,
          user_id: user.id,
          amount: amount,
          contribution_date: new Date().toISOString().split('T')[0]
        });

      if (error) {
        console.error("useGoalContribution: Erro ao adicionar contribuição:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('🎯 Contribuição adicionada! Você está mais perto do seu sonho!', {
        description: 'Cada passo conta na sua jornada financeira. Continue assim! 🚀',
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['activeGoals'] });
      queryClient.invalidateQueries({ queryKey: ['smartInsights'] });
      queryClient.invalidateQueries({ queryKey: ['goalsSummary'] });
      onSuccess?.();
    },
    onError: (error) => {
      console.error("useGoalContribution: Erro na mutation:", error);
      toast.error(`Erro ao adicionar contribuição: ${error.message}`);
    },
  });
}
