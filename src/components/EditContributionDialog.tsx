
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

const contributionSchema = z.object({
  amount: z.coerce
    .number()
    .positive({ message: "O valor da contribuição deve ser maior que zero." }),
  contribution_date: z.date({
    required_error: "Por favor, selecione a data da contribuição.",
  }),
});

type ContributionFormValues = z.infer<typeof contributionSchema>;
type Contribution = Tables<'goal_contributions'>;

interface EditContributionDialogProps {
  contribution: Contribution;
  children: React.ReactNode;
}

export function EditContributionDialog({ contribution, children }: EditContributionDialogProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<ContributionFormValues>({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      amount: contribution.amount,
      contribution_date: new Date(contribution.contribution_date + 'T00:00:00'),
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ContributionFormValues) => {
      if (!user) throw new Error("Usuário não autenticado.");

      const { error } = await supabase
        .from("goal_contributions")
        .update({
          amount: data.amount,
          contribution_date: format(data.contribution_date, "yyyy-MM-dd"),
        })
        .eq('id', contribution.id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Contribuição atualizada com sucesso! ✅");
      queryClient.invalidateQueries({ queryKey: ["contributions", contribution.goal_id] });
      queryClient.invalidateQueries({ queryKey: ["goals", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["goalsSummary", user?.id] });
      setOpen(false);
    },
    onError: (error) => {
      toast.error("Houve um erro ao atualizar sua contribuição.", {
        description: error.message,
      });
    },
  });

  const onSubmit = (data: ContributionFormValues) => {
    mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Contribuição</DialogTitle>
          <DialogDescription>
            Ajuste os detalhes desta contribuição para sua meta.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da Contribuição</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="R$ 100,00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contribution_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data da Contribuição</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ptBR })
                          ) : (
                            <span>Escolha uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("2000-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
