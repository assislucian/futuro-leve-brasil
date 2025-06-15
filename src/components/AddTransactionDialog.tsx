import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  description: z.string().min(2, { message: "A descrição precisa ter pelo menos 2 caracteres." }),
  amount: z.coerce.number().positive({ message: "O valor deve ser um número positivo." }),
  type: z.enum(["income", "expense"], { required_error: "O tipo é obrigatório." }),
  category: z.string().min(2, { message: "A categoria precisa ter pelo menos 2 caracteres." }),
  transaction_date: z.string().min(1, { message: "A data é obrigatória." }),
});

export function AddTransactionDialog() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: undefined,
      type: "expense",
      category: "",
      transaction_date: new Date().toISOString().split("T")[0],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
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


      // Lógica para notificar sobre o impacto no orçamento
      if (values.type === 'expense') {
        const checkBudgetImpact = async () => {
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
                
                const activeGoal = goals.find(g => g.current_amount < g.target_amount);
                
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
        checkBudgetImpact();
      }

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Nova Transação
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Transação</DialogTitle>
          <DialogDescription>
            Registre uma nova receita ou despesa para manter tudo organizado.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="expense">Despesa</SelectItem>
                      <SelectItem value="income">Receita</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Salário, Aluguel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0,00" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Moradia, Alimentação, Lazer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transaction_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data da Transação</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Salvando..." : "Salvar Transação"}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
