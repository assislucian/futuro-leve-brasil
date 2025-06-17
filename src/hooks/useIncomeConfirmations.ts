
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
    queryKey: ["income-confirmations", user?.id],
    queryFn: async (): Promise<IncomeConfirmation[]> => {
      if (!user) return [];
      
      try {
        // Verificar se a tabela existe primeiro
        const { data: tableExists } = await supabase
          .from("information_schema.tables" as any)
          .select("table_name")
          .eq("table_schema", "public")
          .eq("table_name", "income_confirmations")
          .maybeSingle();

        if (!tableExists) {
          console.log("Tabela income_confirmations não existe ainda. Funcionalidade será ativada em breve.");
          return [];
        }

        const { data, error } = await supabase
          .from("income_confirmations" as any)
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "pending")
          .order("created_at", { ascending: false });

        if (error) {
          console.warn("Erro ao buscar confirmações:", error);
          return [];
        }

        return (data || []) as unknown as IncomeConfirmation[];
      } catch (error) {
        console.log("Sistema de confirmações será ativado em breve:", error);
        return [];
      }
    },
    enabled: !!user,
    refetchInterval: 1000 * 60 * 5, // Verificar a cada 5 minutos
    retry: 1, // Reduzir tentativas para evitar spam de logs
    retryDelay: 5000, // 5 segundos entre tentativas
  });
};

export const useConfirmIncome = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ confirmationId, confirmed }: { confirmationId: string; confirmed: boolean }) => {
      if (!user) throw new Error("Usuário não autenticado");

      const status = confirmed ? 'confirmed' : 'cancelled';
      
      try {
        // Verificar se a tabela existe
        const { data: tableExists } = await supabase
          .from("information_schema.tables" as any)
          .select("table_name")
          .eq("table_schema", "public")
          .eq("table_name", "income_confirmations")
          .maybeSingle();

        if (!tableExists) {
          throw new Error("Sistema de confirmações ainda não está disponível");
        }

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
            .eq("user_id", user.id)
            .maybeSingle();

          if (!selectError && confirmation) {
            const transactionId = (confirmation as any)?.transaction_id;
            if (transactionId) {
              await supabase
                .from("transactions")
                .delete()
                .eq("id", transactionId)
                .eq("user_id", user.id);
            }
          }
        }

        return { confirmed, status };
      } catch (error) {
        console.error("Erro ao processar confirmação:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["income-confirmations"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      queryClient.invalidateQueries({ queryKey: ["financialSummary"] });
      
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
      if (error.message.includes("ainda não está disponível")) {
        toast.info("🔧 Funcionalidade em breve", {
          description: "O sistema de confirmações será ativado em breve!"
        });
      } else {
        toast.error(`Erro ao processar confirmação: ${error.message}`);
      }
    },
  });
};
