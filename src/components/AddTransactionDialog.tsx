
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

interface AddTransactionDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddTransactionDialog({ open: controlledOpen, onOpenChange: controlledOnOpenChange }: AddTransactionDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;
  
  const { form, onSubmit } = useTransactionForm({ setOpen });

  const selectedType = form.watch("type");
  const categories = selectedType === "income" ? BRAZILIAN_CATEGORIES.INCOME : BRAZILIAN_CATEGORIES.EXPENSE;

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>✨ Adicionar Nova Transação</DialogTitle>
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
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="expense" className="text-rose-600">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">💸</span>
                          <span>Despesa</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="income" className="text-emerald-600">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">💰</span>
                          <span>Receita</span>
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
                      className="h-11 text-lg"
                    />
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
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Selecione uma categoria" />
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
                  <FormLabel>Data da Transação</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={form.formState.isSubmitting}
                  className="w-full h-11 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                >
                  {form.formState.isSubmitting ? "Salvando..." : "💾 Salvar Transação"}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
