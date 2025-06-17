
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface RecurringTransaction {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  frequency: 'monthly' | 'bimonthly' | 'quarterly' | 'semiannual' | 'annual';
  start_date: string;
  end_date?: string;
  is_active: boolean;
  next_execution_date: string;
  created_at: string;
  updated_at: string;
}

export const useRecurringTransactions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["recurring-transactions"],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("recurring_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as RecurringTransaction[];
    },
    enabled: !!user,
  });
};

export const useCreateRecurringTransaction = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: Omit<RecurringTransaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error("User not authenticated");

      const { data: result, error } = await supabase
        .from("recurring_transactions")
        .insert({
          ...data,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-transactions"] });
      toast.success("🔄 Transação recorrente criada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar transação recorrente: ${error.message}`);
    },
  });
};

export const useProcessRecurringTransactions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.log("🔄 Executando processamento manual de recorrências...");
      
      const { data, error } = await supabase.functions.invoke('process-recurring-transactions', {
        body: { manual: true }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      queryClient.invalidateQueries({ queryKey: ["income-confirmations"] });
      
      if (data?.processed > 0) {
        toast.success(`🎯 ${data.processed} transação(ões) recorrente(s) processada(s)!`);
      } else {
        toast.info("✅ Nenhuma transação recorrente pendente para hoje.");
      }
    },
    onError: (error: any) => {
      console.error("Erro ao processar recorrências:", error);
      toast.error(`Erro ao processar recorrências: ${error.message}`);
    },
  });
};
