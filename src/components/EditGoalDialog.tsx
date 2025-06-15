
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ptBR } from "date-fns/locale";
import type { Tables } from "@/integrations/supabase/types";

const goalSchema = z.object({
  name: z.string().min(3, { message: "O nome da meta precisa ter no mínimo 3 caracteres." }),
  target_amount: z.coerce.number().positive({ message: "O valor alvo deve ser maior que zero." }),
  target_date: z.date().optional().nullable(),
});

type GoalFormValues = z.infer<typeof goalSchema>;
type Goal = Tables<'goals'>;

interface EditGoalDialogProps {
  goal: Goal;
  children: React.ReactNode;
}

export function EditGoalDialog({ goal, children }: EditGoalDialogProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: goal.name,
      target_amount: goal.target_amount,
      target_date: goal.target_date ? new Date(goal.target_date + 'T00:00:00') : null,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: GoalFormValues) => {
      if (!user) throw new Error("Usuário não autenticado.");

      const { error } = await supabase.from("goals").update({
        name: data.name,
        target_amount: data.target_amount,
        target_date: data.target_date ? format(data.target_date, "yyyy-MM-dd") : null,
      }).eq('id', goal.id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Meta atualizada com sucesso! 💪");
      queryClient.invalidateQueries({ queryKey: ["goals", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["goalsSummary", user?.id] });
      setOpen(false);
    },
    onError: (error) => {
      toast.error("Houve um erro ao atualizar sua meta.", {
        description: error.message,
      });
    },
  });

  const onSubmit = (data: GoalFormValues) => {
    mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajustando os planos</DialogTitle>
          <DialogDescription>
            Sonhos evoluem. Atualize sua meta para refletir suas novas aspirações.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Meta</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Viagem dos Sonhos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="target_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Alvo</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="R$ 10.000,00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="target_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data Alvo (Opcional)</FormLabel>
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
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
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
