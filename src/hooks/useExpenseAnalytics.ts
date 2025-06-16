
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface ExpenseAnalytics {
  fixed: number;
  variable: number;
  planned: number;
  unplanned: number;
  totalExpenses: number;
  fixedPercentage: number;
  variablePercentage: number;
  plannedPercentage: number;
  unplannedPercentage: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  classification: 'fixed' | 'variable';
  planning_status: 'planned' | 'unplanned';
  percentage: number;
  transactionCount: number;
}

export interface MonthlyTrend {
  month: string;
  fixed: number;
  variable: number;
  planned: number;
  unplanned: number;
  total: number;
}

export function useExpenseAnalytics(year?: number, month?: number) {
  const { user } = useAuth();
  const currentDate = new Date();
  const targetYear = year || currentDate.getFullYear();
  const targetMonth = month || (currentDate.getMonth() + 1);

  return useQuery({
    queryKey: ['expense-analytics', user?.id, targetYear, targetMonth],
    queryFn: async (): Promise<ExpenseAnalytics> => {
      if (!user) throw new Error("User not authenticated");
      
      const startDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`;
      const endDate = new Date(targetYear, targetMonth, 0).toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('amount, classification, planning_status')
        .eq('user_id', user.id)
        .eq('type', 'expense')
        .gte('transaction_date', startDate)
        .lte('transaction_date', endDate);

      if (error) throw error;

      const fixed = data.filter(t => t.classification === 'fixed').reduce((sum, t) => sum + t.amount, 0);
      const variable = data.filter(t => t.classification === 'variable').reduce((sum, t) => sum + t.amount, 0);
      const planned = data.filter(t => t.planning_status === 'planned').reduce((sum, t) => sum + t.amount, 0);
      const unplanned = data.filter(t => t.planning_status === 'unplanned').reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = fixed + variable;

      return {
        fixed,
        variable,
        planned,
        unplanned,
        totalExpenses,
        fixedPercentage: totalExpenses > 0 ? (fixed / totalExpenses) * 100 : 0,
        variablePercentage: totalExpenses > 0 ? (variable / totalExpenses) * 100 : 0,
        plannedPercentage: totalExpenses > 0 ? (planned / totalExpenses) * 100 : 0,
        unplannedPercentage: totalExpenses > 0 ? (unplanned / totalExpenses) * 100 : 0,
      };
    },
    enabled: !!user,
  });
}

export function useCategoryBreakdown(year?: number, month?: number) {
  const { user } = useAuth();
  const currentDate = new Date();
  const targetYear = year || currentDate.getFullYear();
  const targetMonth = month || (currentDate.getMonth() + 1);

  return useQuery({
    queryKey: ['category-breakdown', user?.id, targetYear, targetMonth],
    queryFn: async (): Promise<CategoryBreakdown[]> => {
      if (!user) throw new Error("User not authenticated");
      
      const startDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`;
      const endDate = new Date(targetYear, targetMonth, 0).toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('amount, category, classification, planning_status')
        .eq('user_id', user.id)
        .eq('type', 'expense')
        .gte('transaction_date', startDate)
        .lte('transaction_date', endDate);

      if (error) throw error;

      const categoryMap = new Map<string, {
        amount: number;
        classification: 'fixed' | 'variable';
        planning_status: 'planned' | 'unplanned';
        count: number;
      }>();

      const totalAmount = data.reduce((sum, t) => sum + t.amount, 0);

      data.forEach(transaction => {
        const key = transaction.category;
        const existing = categoryMap.get(key);
        
        if (existing) {
          existing.amount += transaction.amount;
          existing.count += 1;
        } else {
          categoryMap.set(key, {
            amount: transaction.amount,
            classification: transaction.classification || 'variable',
            planning_status: transaction.planning_status || 'unplanned',
            count: 1
          });
        }
      });

      return Array.from(categoryMap.entries())
        .map(([category, data]) => ({
          category,
          amount: data.amount,
          classification: data.classification,
          planning_status: data.planning_status,
          percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0,
          transactionCount: data.count
        }))
        .sort((a, b) => b.amount - a.amount);
    },
    enabled: !!user,
  });
}

export function useMonthlyTrends(year?: number) {
  const { user } = useAuth();
  const targetYear = year || new Date().getFullYear();

  return useQuery({
    queryKey: ['monthly-trends', user?.id, targetYear],
    queryFn: async (): Promise<MonthlyTrend[]> => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('transactions')
        .select('amount, classification, planning_status, transaction_date')
        .eq('user_id', user.id)
        .eq('type', 'expense')
        .gte('transaction_date', `${targetYear}-01-01`)
        .lte('transaction_date', `${targetYear}-12-31`)
        .order('transaction_date');

      if (error) throw error;

      const monthlyData: { [key: string]: MonthlyTrend } = {};
      
      // Inicializar todos os meses
      for (let month = 1; month <= 12; month++) {
        const monthKey = `${targetYear}-${String(month).padStart(2, '0')}`;
        monthlyData[monthKey] = {
          month: new Date(targetYear, month - 1).toLocaleString('pt-BR', { month: 'short' }),
          fixed: 0,
          variable: 0,
          planned: 0,
          unplanned: 0,
          total: 0
        };
      }

      data.forEach(transaction => {
        const monthKey = transaction.transaction_date.substring(0, 7);
        const monthData = monthlyData[monthKey];
        
        if (monthData) {
          monthData.total += transaction.amount;
          
          if (transaction.classification === 'fixed') {
            monthData.fixed += transaction.amount;
          } else {
            monthData.variable += transaction.amount;
          }
          
          if (transaction.planning_status === 'planned') {
            monthData.planned += transaction.amount;
          } else {
            monthData.unplanned += transaction.amount;
          }
        }
      });

      return Object.values(monthlyData);
    },
    enabled: !!user,
  });
}
