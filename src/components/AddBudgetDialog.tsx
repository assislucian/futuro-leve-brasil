
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const budgetSchema = z.object({
  category: z.string().min(1, { message: "O nome da categoria é obrigatório." }),
  amount: z.coerce
    .number()
    .positive({ message: "O valor do orçamento deve ser maior que zero." }),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

interface AddBudgetDialogProps {
  children: React.ReactNode;
}

export function AddBudgetDialog({ children }: AddBudgetDialogProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: "",
      amount: undefined,
    },
  });
  
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: BudgetFormValues) => {
      if (!user) throw new Error("Usuário não autenticado.");
      
      const now = new Date();

      const { error } = await supabase.from("budgets").insert({
        user_id: user.id,
        category: data.category,
        amount: data.amount,
        year: now.getFullYear(),
        month: now.getMonth() + 1, // getMonth() is 0-indexed
      });

      if (error) {
        if (error.code === '23505') { // unique_violation
             throw new Error(`Você já tem um orçamento para a categoria "${data.category}" este mês.`);
        }
        throw new Error(error.message);
      }
    },
    onSuccess: (_, variables) => {
      toast.success("Orçamento criado com sucesso! 👏", {
        description: `Agora você pode acompanhar seus gastos na categoria ${variables.category}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["budgets", user?.id] });
      form.reset({ category: "", amount: undefined });
      setOpen(false);
    },
    onError: (error) => {
      if (error.message.includes('recurso exclusivo do plano Premium')) {
        toast.error("Funcionalidade Premium", {
          description: "A criação de orçamentos está disponível apenas no plano Premium. Faça o upgrade para ter acesso!",
          action: { label: "Fazer Upgrade", onClick: () => console.log('Navigate to pricing') }
        });
      } else if (error.message.includes('Você já tem um orçamento')) {
        toast.error("Erro ao criar orçamento", {
          description: error.message,
        });
      }
      else {
        toast.error("Erro ao criar orçamento.", {
          description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        });
      }
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
          <DialogTitle>Criar Novo Orçamento</DialogTitle>
          <DialogDescription>
            Defina um limite de gastos para uma categoria neste mês. Isso te ajudará a manter o controle.
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
                Criar Orçamento
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
