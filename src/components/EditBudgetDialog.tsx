
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Budget = Database['public']['Tables']['budgets']['Row'];

const budgetSchema = z.object({
  category: z.string().min(1, { message: "O nome da categoria é obrigatório." }),
  amount: z.coerce
    .number()
    .positive({ message: "O valor do orçamento deve ser maior que zero." }),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

interface EditBudgetDialogProps {
  children: React.ReactNode;
  budget: Budget;
}

export function EditBudgetDialog({ children, budget }: EditBudgetDialogProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: budget.category,
      amount: budget.amount,
    },
  });
  
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: BudgetFormValues) => {
      if (!user) throw new Error("Usuário não autenticado.");

      const { error } = await supabase
        .from("budgets")
        .update({
          category: data.category,
          amount: data.amount,
        })
        .eq("id", budget.id);

      if (error) {
        if (error.code === '23505') { // unique_violation
             throw new Error(`Você já tem um orçamento para a categoria "${data.category}" este mês.`);
        }
        throw new Error(error.message);
      }
    },
    onSuccess: (_, variables) => {
      toast.success("Orçamento atualizado com sucesso! 💡", {
        description: `Seu limite para ${variables.category} foi ajustado.`,
      });
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      setOpen(false);
    },
    onError: (error) => {
      toast.error("Erro ao atualizar orçamento.", {
        description: error.message,
      });
    },
  });

  const onSubmit = (data: BudgetFormValues) => {
    mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Orçamento</DialogTitle>
          <DialogDescription>
            Ajuste o limite de gastos para a categoria "{budget.category}".
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Alimentação, Lazer"
                      {...field}
                    />
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
                  <FormLabel>Valor do Orçamento</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="R$ 500,00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
               <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
