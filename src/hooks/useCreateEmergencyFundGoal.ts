
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface CreateEmergencyFundParams {
  targetAmount: number;
  monthsOfSecurity: number;
  monthlyExpenses: number;
}

/**
 * Hook para criar automaticamente uma meta de reserva de emergência inteligente
 */
export function useCreateEmergencyFundGoal() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ targetAmount, monthsOfSecurity, monthlyExpenses }: CreateEmergencyFundParams) => {
      if (!user) throw new Error('Usuário não autenticado');

      console.log("Criando meta de emergência:", { targetAmount, monthsOfSecurity });

      const goalName = `🛡️ Reserva de Emergência (${monthsOfSecurity} meses)`;
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() + 12); // Meta para 1 ano

      const { data, error } = await supabase
        .from('goals')
        .insert({
          user_id: user.id,
          name: goalName,
          target_amount: targetAmount,
          target_date: targetDate.toISOString().split('T')[0],
        })
        .select()
        .single();

      if (error) {
        console.error("Erro ao criar meta de emergência:", error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      // Invalidar cache relevante
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['emergencyFundCalculator'] });
      queryClient.invalidateQueries({ queryKey: ['financialSummary'] });

      toast({
        title: "🎯 Meta de Emergência Criada!",
        description: `Sua reserva de segurança foi configurada. Vamos começar a construir sua tranquilidade financeira!`,
      });

      console.log("Meta de emergência criada com sucesso:", data);
    },
    onError: (error) => {
      console.error("Erro ao criar meta de emergência:", error);
      toast({
        title: "Erro ao Criar Meta",
        description: "Não foi possível criar sua meta de emergência. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}
