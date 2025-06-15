
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { transactionFormSchema, TransactionFormValues } from "@/lib/validators/transaction";

export function useTransactionForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      description: "",
      amount: undefined,
      type: "expense",
      category: "",
      transaction_date: new Date().toISOString().split("T")[0],
    },
  });

  const checkBudgetImpact = async (values: TransactionFormValues) => {
    if (!user || values.type !== 'expense') return;

    try {
      const transactionDate = new Date(values.transaction_date + 'T00:00:00');
      const year = transactionDate.getFullYear();
      const month = transactionDate.getMonth() + 1;

      const { data: budgetData, error: budgetError } = await supabase
        .from('budgets')
        .select('amount')
        .eq('user_id', user.id)
        .eq('category', values.category)
        .eq('year', year)
        .eq('month', month)
        .maybeSingle();

      if (budgetError) throw budgetError;

      if (budgetData) {
        const budgetAmount = budgetData.amount;
        const firstDay = `${year}-${String(month).padStart(2, '0')}-01`;
        const lastDayOfMonth = new Date(year, month, 0).getDate();
        const lastDay = `${year}-${String(month).padStart(2, '0')}-${String(lastDayOfMonth).padStart(2, '0')}`;

        const { data: spendingData, error: spendingError } = await supabase
          .from('transactions')
          .select('amount')
          .eq('user_id', user.id)
          .eq('category', values.category)
          .eq('type', 'expense')
          .gte('transaction_date', firstDay)
          .lte('transaction_date', lastDay);

        if (spendingError) throw spendingError;

        const totalSpent = spendingData.reduce((sum, t) => sum + t.amount, 0);
        const remaining = budgetAmount - totalSpent;
        
        const formatCurrency = (amount: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount);
        
        let description = "";
        if (remaining >= 0) {
           description = `Você gastou ${formatCurrency(totalSpent)} de ${formatCurrency(budgetAmount)}. Restam ${formatCurrency(remaining)}.`;
        } else {
          const { data: goals, error: goalsError } = await supabase
            .from('goals')
            .select('name, current_amount, target_amount')
            .eq('user_id', user.id);

          if (goalsError) throw goalsError;
          
          const activeGoal = goals?.find(g => g.current_amount < g.target_amount);
          
          const overspentAmount = Math.abs(remaining);
          const baseMessage = `Você ultrapassou o orçamento em ${formatCurrency(overspentAmount)}. Total gasto: ${formatCurrency(totalSpent)}.`;

          if (activeGoal) {
            description = `${baseMessage} Lembre-se, cada real conta para alcançar seu sonho: '${activeGoal.name}'.`;
          } else {
            description = `${baseMessage} Fique atento aos seus gastos para manter a saúde financeira.`;
          }
        }

        toast.info(`Impacto no orçamento de "${values.category}"`, {
          description: description,
          duration: 8000,
        });
      }
    } catch (e) {
      console.error("Erro ao verificar impacto no orçamento:", e);
    }
  };

  async function onSubmit(values: TransactionFormValues) {
    if (!user) {
      toast.error("Você precisa estar logado para adicionar uma transação.");
      return;
    }

    const { error } = await supabase.from("transactions").insert({
      description: values.description,
      amount: values.amount,
      type: values.type,
      category: values.category,
      transaction_date: values.transaction_date,
      user_id: user.id
    });

    if (error) {
      toast.error("Ocorreu um erro ao salvar a transação: " + error.message);
    } else {
      toast.success("Transação adicionada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["budgetsSummary"] });
      queryClient.invalidateQueries({ queryKey: ["nextAction"] });
      queryClient.invalidateQueries({ queryKey: ["goals"] });

      await checkBudgetImpact(values);

      setOpen(false);
      form.reset({
        description: "",
        amount: undefined,
        type: "expense",
        category: "",
        transaction_date: new Date().toISOString().split("T")[0],
      });
    }
  }

  return { form, onSubmit };
}
