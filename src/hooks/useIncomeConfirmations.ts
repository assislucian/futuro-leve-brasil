
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface IncomeConfirmation {
  id: string;
  user_id: string;
  transaction_id: string;
  description: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export const useIncomeConfirmations = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["income-confirmations"],
    queryFn: async (): Promise<IncomeConfirmation[]> => {
      if (!user) return [];
      
      try {
        const { data, error } = await supabase
          .from("income_confirmations" as any)
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "pending")
          .order("created_at", { ascending: false });

        if (error) throw error;
        return (data || []) as unknown as IncomeConfirmation[];
      } catch (error) {
        console.log("Tabela income_confirmations ainda não existe:", error);
        return [];
      }
    },
    enabled: !!user,
    refetchInterval: 1000 * 60 * 5, // Verificar a cada 5 minutos
  });
};

export const useConfirmIncome = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ confirmationId, confirmed }: { confirmationId: string; confirmed: boolean }) => {
      if (!user) throw new Error("User not authenticated");

      const status = confirmed ? 'confirmed' : 'cancelled';
      
      try {
        // Atualizar status da confirmação
        const { error: updateError } = await supabase
          .from("income_confirmations" as any)
          .update({ status })
          .eq("id", confirmationId)
          .eq("user_id", user.id);

        if (updateError) throw updateError;

        // Se foi cancelada, remover a transação automática
        if (!confirmed) {
          const { data: confirmation, error: selectError } = await supabase
            .from("income_confirmations" as any)
            .select("transaction_id")
            .eq("id", confirmationId)
            .single();

          if (!selectError && confirmation !== null && typeof confirmation === 'object' && 'transaction_id' in confirmation) {
            const confirmationData = confirmation as { transaction_id: string };
            await supabase
              .from("transactions")
              .delete()
              .eq("id", confirmationData.transaction_id)
              .eq("user_id", user.id);
          }
        }

        return { confirmed, status };
      } catch (error) {
        console.log("Erro ao processar confirmação:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["income-confirmations"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      
      if (data.confirmed) {
        toast.success("✅ Receita confirmada!", {
          description: "A transação foi mantida em seus registros."
        });
      } else {
        toast.info("❌ Receita cancelada", {
          description: "A transação automática foi removida."
        });
      }
    },
    onError: (error: any) => {
      toast.error(`Erro ao processar confirmação: ${error.message}`);
    },
  });
};
