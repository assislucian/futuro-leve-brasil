
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
import { CalendarIcon, Loader2, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ptBR } from "date-fns/locale";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const goalSchema = z.object({
  name: z.string().min(3, { message: "O nome da meta precisa ter no mínimo 3 caracteres." }),
  target_amount: z.coerce.number().positive({ message: "O valor alvo deve ser maior que zero." }),
  target_date: z.date().optional(),
});

type GoalFormValues = z.infer<typeof goalSchema>;

export function AddGoalDialog({ disabled = false }: { disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: "",
      target_amount: 0,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: GoalFormValues) => {
      if (!user) throw new Error("Usuário não autenticado.");

      console.log("AddGoalDialog: Tentando criar meta", data);

      const { error } = await supabase.from("goals").insert({
        user_id: user.id,
        name: data.name,
        target_amount: data.target_amount,
        target_date: data.target_date ? format(data.target_date, "yyyy-MM-dd") : null,
      });

      if (error) {
        console.error("AddGoalDialog: Erro ao criar meta", error);
        throw new Error(error.message);
      }

      console.log("AddGoalDialog: Meta criada com sucesso");
    },
    onSuccess: () => {
      toast.success("Meta criada com sucesso! ✨");
      queryClient.invalidateQueries({ queryKey: ["goals", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["goalsSummary", user?.id] });
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      console.error("AddGoalDialog: Erro na mutation", error);
      if (error.message.includes('período de teste Premium terminou') || error.message.includes('Limite de 2 metas atingido')) {
        toast.error("Limite de metas atingido", {
          description: "Você atingiu o limite de 2 metas do plano gratuito. Faça o upgrade para criar metas ilimitadas!",
          action: { label: "Fazer Upgrade", onClick: () => window.open('/#pricing', '_blank') }
        });
      } else {
        toast.error("Houve um erro ao criar sua meta.", {
          description: error.message,
        });
      }
    },
  });

  const onSubmit = (data: GoalFormValues) => {
    console.log("AddGoalDialog: Submetendo formulário", data);
    mutate(data);
  };

  const triggerButton = (
    <Button disabled={disabled}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Criar Nova Meta
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={disabled ? 0 : -1}>
              <DialogTrigger asChild disabled={disabled}>
                {triggerButton}
              </DialogTrigger>
            </span>
          </TooltipTrigger>
          {disabled && (
            <TooltipContent>
              <p>Você atingiu o limite de 2 metas do plano gratuito.</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Qual sonho vamos conquistar?</DialogTitle>
          <DialogDescription>
            Defina sua meta e comece a jornada para realizá-la. Cada centavo economizado é um passo em direção ao seu objetivo.
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
                        selected={field.value}
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
                Criar Meta
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
