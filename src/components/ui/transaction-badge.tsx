
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TransactionBadgeProps {
  type: 'income' | 'expense';
  category: string;
  className?: string;
}

const categoryColors = {
  // Receitas
  'Salário': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Freelance': 'bg-blue-100 text-blue-800 border-blue-200',
  'Investimentos': 'bg-purple-100 text-purple-800 border-purple-200',
  'Aluguel Recebido': 'bg-green-100 text-green-800 border-green-200',
  
  // Despesas Essenciais
  'Moradia': 'bg-orange-100 text-orange-800 border-orange-200',
  'Alimentação': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Transporte': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Saúde': 'bg-red-100 text-red-800 border-red-200',
  
  // Financiamentos
  'Financiamento Imóvel': 'bg-rose-100 text-rose-800 border-rose-200',
  'Financiamento Veículo': 'bg-pink-100 text-pink-800 border-pink-200',
  'Cartão de Crédito': 'bg-red-100 text-red-800 border-red-200',
  
  // Contas Fixas
  'Condomínio': 'bg-amber-100 text-amber-800 border-amber-200',
  'Energia Elétrica': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Água': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'Gás': 'bg-orange-100 text-orange-800 border-orange-200',
  'Telefone/Internet': 'bg-blue-100 text-blue-800 border-blue-200',
  
  // Lazer e Lifestyle
  'Lazer': 'bg-violet-100 text-violet-800 border-violet-200',
  'Streaming': 'bg-purple-100 text-purple-800 border-purple-200',
  'Academia': 'bg-green-100 text-green-800 border-green-200',
  
  // Default
  'default': 'bg-gray-100 text-gray-800 border-gray-200'
} as const;

export function TransactionBadge({ type, category, className }: TransactionBadgeProps) {
  const baseColor = type === 'income' 
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100'
    : 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-100';
    
  const categoryColor = categoryColors[category as keyof typeof categoryColors] || categoryColors.default;
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium transition-all duration-200 hover:scale-105",
        "border shadow-sm ring-1 ring-opacity-20",
        categoryColor,
        className
      )}
    >
      {category}
    </Badge>
  );
}
