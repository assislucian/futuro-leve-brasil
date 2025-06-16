
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
import { PlusCircle, Target, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useTransactionForm } from "@/hooks/useTransactionForm";
import { BRAZILIAN_CATEGORIES } from "@/lib/constants/categories";
import { QuickGoalContribution } from "./QuickGoalContribution";
import { BudgetImpactPreview } from "./BudgetImpactPreview";
import { Badge } from "./ui/badge";

interface AddTransactionDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddTransactionDialog({ open: controlledOpen, onOpenChange: controlledOnOpenChange }: AddTransactionDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;
  
  const { form, onSubmit } = useTransactionForm({ 
    setOpen: (newOpen) => {
      setOpen(newOpen);
      if (!newOpen) {
        setShowQuickActions(false);
      }
    }
  });

  const selectedType = form.watch("type");
  const amount = form.watch("amount");
  const category = form.watch("category");
  const categories = selectedType === "income" ? BRAZILIAN_CATEGORIES.INCOME : BRAZILIAN_CATEGORIES.EXPENSE;

  // Mostrar ações rápidas quando há valor suficiente
  const shouldShowQuickActions = amount && amount > 0 && (
    (selectedType === "income" && amount >= 50) || 
    (selectedType === "expense" && amount >= 20)
  );

  const handleSubmitWithActions = async (values: any, quickAction?: { type: 'goal_contribution', goalId: string, amount: number }) => {
    await onSubmit(values);
    
    if (quickAction && quickAction.type === 'goal_contribution') {
      // Aqui você pode adicionar lógica para contribuir diretamente para a meta
      console.log('Quick contribution:', quickAction);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button size="sm" className="h-8 gap-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Nova Transação
            </span>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            ✨ Adicionar Nova Transação
            {selectedType === "income" && amount && amount >= 50 && (
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 animate-pulse">
                💡 Ação Rápida Disponível
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {selectedType === "income" 
              ? "Registre uma nova receita e acelere seus sonhos automaticamente!"
              : "Registre uma despesa e veja o impacto no seu orçamento em tempo real."
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="income" className="text-emerald-600">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">💰</span>
                            <span>Receita</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="expense" className="text-rose-600">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">💸</span>
                            <span>Despesa</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0,00" 
                        {...field} 
                        value={field.value ?? ""} 
                        className="h-11 text-lg font-semibold"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={selectedType === "income" ? "Ex: Salário, Freelance" : "Ex: Supermercado, Gasolina"} 
                      {...field} 
                      className="h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[200px]">
                        {categories.map((category) => (
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
              <FormField
                control={form.control}
                name="transaction_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Preview de Impacto no Orçamento para Despesas */}
            {selectedType === "expense" && amount && amount > 0 && category && (
              <BudgetImpactPreview 
                category={category}
                amount={amount}
                transactionDate={form.watch("transaction_date")}
              />
            )}

            {/* Ações Rápidas para Receitas */}
            {selectedType === "income" && shouldShowQuickActions && (
              <QuickGoalContribution 
                amount={amount}
                onContribute={(goalId, contributionAmount) => {
                  // Lógica para contribuir rapidamente
                  console.log('Quick contribute:', goalId, contributionAmount);
                }}
              />
            )}

            <DialogFooter className="flex gap-2 pt-4">
              {selectedType === "income" && shouldShowQuickActions ? (
                <div className="flex gap-2 w-full">
                  <Button 
                    type="submit" 
                    variant="outline"
                    disabled={form.formState.isSubmitting}
                    className="flex-1"
                  >
                    Apenas Salvar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={form.formState.isSubmitting}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                  >
                    <Target className="mr-2 h-4 w-4" />
                    Salvar + Acelerar Sonho
                  </Button>
                </div>
              ) : (
                <Button 
                  type="submit" 
                  disabled={form.formState.isSubmitting}
                  className="w-full h-11 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                >
                  {form.formState.isSubmitting ? "Salvando..." : "💾 Salvar Transação"}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
