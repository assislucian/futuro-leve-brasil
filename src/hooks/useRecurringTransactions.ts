
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
        .from("recurring_transactions" as any)
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
        .from("recurring_transactions" as any)
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
