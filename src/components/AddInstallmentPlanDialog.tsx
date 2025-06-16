
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { CreditCard, Calculator } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const installmentPlanSchema = z.object({
  description: z.string().min(2, { message: "A descrição precisa ter pelo menos 2 caracteres." }),
  total_amount: z.coerce.number().positive({ message: "O valor total deve ser positivo." }),
  total_installments: z.coerce.number().min(1, { message: "Deve ter pelo menos 1 parcela." }),
  category: z.string().min(2, { message: "A categoria é obrigatória." }),
  start_date: z.string().min(1, { message: "A data de início é obrigatória." }),
});

type InstallmentPlanFormValues = z.infer<typeof installmentPlanSchema>;

const INSTALLMENT_CATEGORIES = [
  'Financiamento Imóvel',
  'Financiamento Veículo',
  'Cartão de Crédito',
  'Empréstimo Pessoal',
  'Consórcio',
  'Eletrodomésticos',
  'Móveis',
  'Eletrônicos',
  'Curso/Educação',
  'Outros'
];

interface AddInstallmentPlanDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddInstallmentPlanDialog({ 
  open: controlledOpen, 
  onOpenChange: controlledOnOpenChange 
}: AddInstallmentPlanDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const form = useForm<InstallmentPlanFormValues>({
    resolver: zodResolver(installmentPlanSchema),
    defaultValues: {
      description: "",
      total_amount: undefined,
      total_installments: undefined,
      category: "",
      start_date: new Date().toISOString().split("T")[0],
    },
  });

  const totalAmount = form.watch("total_amount");
  const totalInstallments = form.watch("total_installments");
  const installmentAmount = totalAmount && totalInstallments ? totalAmount / totalInstallments : 0;

  async function onSubmit(values: InstallmentPlanFormValues) {
    if (!user) {
      toast.error("Você precisa estar logado para criar um plano de parcelas.");
      return;
    }

    const calculatedInstallmentAmount = values.total_amount / values.total_installments;

    const { error } = await supabase.from("installment_plans").insert({
      description: values.description,
      total_amount: values.total_amount,
      installment_amount: calculatedInstallmentAmount,
      total_installments: values.total_installments,
      category: values.category,
      start_date: values.start_date,
      user_id: user.id
    });

    if (error) {
      toast.error(`Erro ao criar plano de parcelas: ${error.message}`);
    } else {
      toast.success("💳 Plano de parcelas criado! Você pode registrar os pagamentos conforme vai pagando.");
      queryClient.invalidateQueries({ queryKey: ["installment-plans"] });
      setOpen(false);
      form.reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1 border-dashed">
            <CreditCard className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Parcelas
            </span>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Criar Plano de Parcelas
          </DialogTitle>
          <DialogDescription>
            Gerencie financiamentos, empréstimos e compras parceladas. Acompanhe quantas parcelas já foram pagas.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Financiamento Casa Própria, Carro Honda Civic" {...field} />
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {INSTALLMENT_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="total_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Total (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0,00" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="total_installments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Parcelas</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 24, 36, 60" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {installmentAmount > 0 && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center gap-2 text-primary">
                  <Calculator className="h-4 w-4" />
                  <span className="font-medium">Valor da Parcela</span>
                </div>
                <p className="text-2xl font-bold text-primary mt-1">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(installmentAmount)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {totalInstallments}x de {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(installmentAmount)}
                </p>
              </div>
            )}

            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data da Primeira Parcela</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                {form.formState.isSubmitting ? "Criando..." : "💳 Criar Plano de Parcelas"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
