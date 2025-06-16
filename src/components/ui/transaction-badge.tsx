
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TransactionBadgeProps {
  type: 'income' | 'expense';
  category: string;
  className?: string;
}

const categoryColors = {
  // Receitas - tons mais suaves
  'Salário': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-700',
  'Freelance': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-700',
  'Investimentos': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-700',
  'Aluguel Recebido': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-700',
  
  // Despesas - tons neutros
  'Moradia': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-700',
  'Alimentação': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-700',
  'Transporte': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-700',
  'Saúde': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-700',
  
  // Financiamentos
  'Financiamento Imóvel': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-700',
  'Financiamento Veículo': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-700',
  'Cartão de Crédito': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-700',
  
  // Contas Fixas
  'Condomínio': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-700',
  'Energia Elétrica': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-700',
  'Água': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-700',
  'Gás': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-700',
  'Telefone/Internet': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-700',
  
  // Lazer e Lifestyle
  'Lazer': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-700',
  'Streaming': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-700',
  'Academia': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-700',
  
  // Default
  'default': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-700'
} as const;

export function TransactionBadge({ type, category, className }: TransactionBadgeProps) {
  const categoryColor = categoryColors[category as keyof typeof categoryColors] || categoryColors.default;
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-normal text-xs",
        "border shadow-none",
        categoryColor,
        className
      )}
    >
      {category}
    </Badge>
  );
}
