
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

const contributionSchema = z.object({
  amount: z.coerce
    .number()
    .positive({ message: "O valor da contribuição deve ser maior que zero." }),
  contribution_date: z.date({
    required_error: "Por favor, selecione a data da contribuição.",
  }),
});

type ContributionFormValues = z.infer<typeof contributionSchema>;

interface AddContributionDialogProps {
  goalId: string;
  goalName: string;
  children: React.ReactNode;
}

export function AddContributionDialog({
  goalId,
  goalName,
  children,
}: AddContributionDialogProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<ContributionFormValues>({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      amount: undefined,
      contribution_date: new Date(),
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ContributionFormValues) => {
      if (!user) throw new Error("Usuário não autenticado.");

      const { error } = await supabase.from("goal_contributions").insert({
        user_id: user.id,
        goal_id: goalId,
        amount: data.amount,
        contribution_date: format(data.contribution_date, "yyyy-MM-dd"),
      });

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Progresso adicionado! 🚀", {
        description: `Você está mais perto de conquistar sua meta: ${goalName}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["goals", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["goalsSummary", user?.id] });
      form.reset({ amount: undefined, contribution_date: new Date() });
      setOpen(false);
    },
    onError: (error) => {
      toast.error("Houve um erro ao adicionar seu progresso.", {
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
          <DialogTitle>Adicionar Progresso: {goalName}</DialogTitle>
          <DialogDescription>
            Cada passo conta! Registre aqui o valor e a data da sua dedicação
            para este sonho.
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
                Adicionar Contribuição
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
