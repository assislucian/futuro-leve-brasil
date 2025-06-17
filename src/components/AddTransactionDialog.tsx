
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
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useTransactionForm } from "@/hooks/useTransactionForm";
import { BRAZILIAN_CATEGORIES } from "@/lib/constants/categories";
import { QuickGoalContribution } from "./QuickGoalContribution";
import { BudgetImpactPreview } from "./BudgetImpactPreview";

interface AddTransactionDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export function AddTransactionDialog({ open: controlledOpen, onOpenChange: controlledOnOpenChange, children }: AddTransactionDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;
  
  const { form, onSubmit } = useTransactionForm({ setOpen });

  const selectedType = form.watch("type");
  const amount = form.watch("amount");
  const category = form.watch("category");
  const categories = selectedType === "income" ? BRAZILIAN_CATEGORIES.INCOME : BRAZILIAN_CATEGORIES.EXPENSE;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <PlusCircle className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Transação</DialogTitle>
          <DialogDescription>
            Registre uma nova {selectedType === "income" ? "receita" : "despesa"} em sua conta.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="income" className="text-emerald-600">
                          Receita
                        </SelectItem>
                        <SelectItem value="expense" className="text-red-600">
                          Despesa
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
                        className="font-medium"
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
                        <SelectTrigger>
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
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Preview de Impacto no Orçamento */}
            {selectedType === "expense" && amount && amount > 0 && category && (
              <BudgetImpactPreview 
                category={category}
                amount={amount}
                transactionDate={form.watch("transaction_date")}
              />
            )}

            {/* Contribuição Rápida para Metas */}
            {selectedType === "income" && amount && amount >= 50 && (
              <QuickGoalContribution 
                amount={amount}
                onContribute={() => {}}
              />
            )}

            <DialogFooter className="pt-4">
              <Button 
                type="button"
                disabled={form.formState.isSubmitting}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={form.handleSubmit(onSubmit)}
              >
                {form.formState.isSubmitting ? "Salvando..." : "Salvar Transação"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
