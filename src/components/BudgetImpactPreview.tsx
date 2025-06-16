
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BudgetImpactPreviewProps {
  category: string;
  amount: number;
  transactionDate: string;
}

export function BudgetImpactPreview({ category, amount, transactionDate }: BudgetImpactPreviewProps) {
  const { user } = useAuth();

  const { data: budgetData, isLoading } = useQuery({
    queryKey: ['budgetImpact', user?.id, category, transactionDate],
    queryFn: async () => {
      if (!user) return null;

      const date = new Date(transactionDate + 'T00:00:00');
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      // Buscar orçamento
      const { data: budget, error: budgetError } = await supabase
        .from('budgets')
        .select('amount')
        .eq('user_id', user.id)
        .eq('category', category)
        .eq('year', year)
        .eq('month', month)
        .maybeSingle();

      if (budgetError || !budget) return null;

      // Buscar gastos do mês
      const firstDay = `${year}-${String(month).padStart(2, '0')}-01`;
      const lastDayOfMonth = new Date(year, month, 0).getDate();
      const lastDay = `${year}-${String(month).padStart(2, '0')}-${String(lastDayOfMonth).padStart(2, '0')}`;

      const { data: spending, error: spendingError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('category', category)
        .eq('type', 'expense')
        .gte('transaction_date', firstDay)
        .lte('transaction_date', lastDay);

      if (spendingError) return null;

      const totalSpent = spending.reduce((sum, t) => sum + t.amount, 0);
      const newTotal = totalSpent + amount;
      const budgetAmount = budget.amount;
      const currentProgress = (totalSpent / budgetAmount) * 100;
      const newProgress = (newTotal / budgetAmount) * 100;

      return {
        budgetAmount,
        totalSpent,
        newTotal,
        currentProgress,
        newProgress,
        remaining: budgetAmount - newTotal,
        overspent: newTotal > budgetAmount
      };
    },
    enabled: !!user && !!category && !!transactionDate,
  });

  if (isLoading || !budgetData) return null;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getStatusColor = () => {
    if (budgetData.overspent) return 'text-red-600';
    if (budgetData.newProgress > 85) return 'text-amber-600';
    return 'text-emerald-600';
  };

  const getStatusIcon = () => {
    if (budgetData.overspent) return <AlertTriangle className="h-4 w-4 text-red-600" />;
    if (budgetData.newProgress > 85) return <TrendingDown className="h-4 w-4 text-amber-600" />;
    return <CheckCircle className="h-4 w-4 text-emerald-600" />;
  };

  const getStatusMessage = () => {
    if (budgetData.overspent) {
      const overspentAmount = Math.abs(budgetData.remaining);
      return `⚠️ Ultrapassará o orçamento em ${formatCurrency(overspentAmount)}`;
    }
    if (budgetData.newProgress > 85) {
      return `🔥 Atenção! Chegará a ${budgetData.newProgress.toFixed(0)}% do orçamento`;
    }
    return `✅ Dentro do orçamento! Restará ${formatCurrency(budgetData.remaining)}`;
  };

  return (
    <div className={`rounded-lg p-4 border space-y-3 ${
      budgetData.overspent 
        ? 'bg-red-50 border-red-200' 
        : budgetData.newProgress > 85 
          ? 'bg-amber-50 border-amber-200'
          : 'bg-emerald-50 border-emerald-200'
    }`}>
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <h4 className={`font-semibold ${getStatusColor()}`}>
          Impacto no Orçamento: {category}
        </h4>
        <Badge 
          variant="outline" 
          className={`ml-auto ${
            budgetData.overspent 
              ? 'text-red-700 border-red-200' 
              : budgetData.newProgress > 85
                ? 'text-amber-700 border-amber-200'
                : 'text-emerald-700 border-emerald-200'
          }`}
        >
          {budgetData.newProgress.toFixed(0)}%
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-slate-600">
          <span>Gasto atual:</span>
          <span className="font-medium">{formatCurrency(budgetData.totalSpent)}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-600">
          <span>Após esta despesa:</span>
          <span className="font-medium">{formatCurrency(budgetData.newTotal)}</span>
        </div>
        <Progress 
          value={budgetData.newProgress} 
          className="h-2" 
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>{formatCurrency(0)}</span>
          <span>{formatCurrency(budgetData.budgetAmount)}</span>
        </div>
      </div>

      <p className={`text-sm font-medium ${getStatusColor()}`}>
        {getStatusMessage()}
      </p>
    </div>
  );
}
