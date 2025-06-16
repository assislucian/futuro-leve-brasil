
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface InstallmentPlan {
  id: string;
  user_id: string;
  description: string;
  total_amount: number;
  installment_amount: number;
  total_installments: number;
  paid_installments: number;
  category: string;
  start_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useInstallmentPlans = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["installment-plans"],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("installment_plans" as any)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as InstallmentPlan[];
    },
    enabled: !!user,
  });
};

export const useCreateInstallmentPlan = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: Omit<InstallmentPlan, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'paid_installments' | 'is_active'>) => {
      if (!user) throw new Error("User not authenticated");

      const { data: result, error } = await supabase
        .from("installment_plans" as any)
        .insert({
          ...data,
          user_id: user.id,
          paid_installments: 0,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["installment-plans"] });
      toast.success("💳 Plano de parcelas criado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar plano de parcelas: ${error.message}`);
    },
  });
};
