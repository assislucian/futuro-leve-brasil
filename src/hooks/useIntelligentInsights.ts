
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface IntelligentInsight {
  id: string;
  type: 'money_leak' | 'savings_opportunity' | 'behavior_pattern' | 'goal_acceleration' | 'financial_health';
  title: string;
  description: string;
  impact: number; // valor em reais do impacto
  actionable: string;
  urgency: 'low' | 'medium' | 'high';
  category: string;
}

export function useIntelligentInsights(year?: number, month?: number) {
  const { user } = useAuth();
  const currentDate = new Date();
  const targetYear = year || currentDate.getFullYear();
  const targetMonth = month || (currentDate.getMonth() + 1);

  return useQuery({
    queryKey: ['intelligent-insights', user?.id, targetYear, targetMonth],
    queryFn: async (): Promise<IntelligentInsight[]> => {
      if (!user) throw new Error("User not authenticated");
      
      const insights: IntelligentInsight[] = [];
      
      // Buscar dados dos últimos 3 meses para análise de padrões
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .gte('transaction_date', threeMonthsAgo.toISOString().split('T')[0])
        .order('transaction_date', { ascending: false });

      if (error) throw error;

      const { data: goals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id);

      const expenses = transactions?.filter(t => t.type === 'expense') || [];
      const income = transactions?.filter(t => t.type === 'income') || [];
      
      // 1. VAZAMENTOS DE DINHEIRO - Gastos não planejados recorrentes
      const unplannedSpending = expenses.filter(t => t.planning_status === 'unplanned');
      const monthlyUnplanned = unplannedSpending.reduce((sum, t) => sum + t.amount, 0) / 3;
      
      if (monthlyUnplanned > 500) {
        insights.push({
          id: 'money-leak-unplanned',
          type: 'money_leak',
          title: '🚨 Detectamos um vazamento financeiro',
          description: `Você gasta em média R$ ${monthlyUnplanned.toFixed(0)} por mês com despesas não planejadas. Isso representa R$ ${(monthlyUnplanned * 12).toFixed(0)} por ano que "somem" do seu bolso.`,
          impact: monthlyUnplanned * 12,
          actionable: 'Crie um orçamento específico para "gastos de impulso" e monitore semanalmente.',
          urgency: 'high',
          category: 'Controle de Gastos'
        });
      }

      // 2. OPORTUNIDADE DE ECONOMIA - Assinaturas e gastos fixos
      const subscriptions = expenses.filter(t => t.category === 'Assinaturas');
      const totalSubscriptions = subscriptions.reduce((sum, t) => sum + t.amount, 0);
      
      if (totalSubscriptions > 200) {
        insights.push({
          id: 'savings-subscriptions',
          type: 'savings_opportunity',
          title: '💡 Oportunidade: Otimize suas assinaturas',
          description: `Você gasta R$ ${totalSubscriptions.toFixed(0)} com assinaturas. Revisando e cancelando as não utilizadas, pode economizar até 30%.`,
          impact: totalSubscriptions * 0.3 * 12,
          actionable: 'Faça uma auditoria mensal das assinaturas e cancele as não utilizadas.',
          urgency: 'medium',
          category: 'Otimização'
        });
      }

      // 3. PADRÃO COMPORTAMENTAL - Gastos por categoria vs renda
      const totalMonthlyIncome = income.reduce((sum, t) => sum + t.amount, 0) / 3;
      const foodExpenses = expenses.filter(t => t.category === 'Alimentação').reduce((sum, t) => sum + t.amount, 0) / 3;
      const foodPercentage = (foodExpenses / totalMonthlyIncome) * 100;
      
      if (foodPercentage > 25) {
        insights.push({
          id: 'behavior-food-spending',
          type: 'behavior_pattern',
          title: '🍕 Padrão identificado: Gastos com alimentação elevados',
          description: `Seus gastos com alimentação representam ${foodPercentage.toFixed(1)}% da renda (ideal: 15-20%). Isso pode estar impactando suas metas.`,
          impact: (foodExpenses - (totalMonthlyIncome * 0.20)) * 12,
          actionable: 'Planeje refeições semanalmente e reduza delivery em 50%.',
          urgency: 'medium',
          category: 'Lifestyle'
        });
      }

      // 4. ACELERAÇÃO DE METAS - Sobra mensal disponível
      const monthlyExpenses = expenses.reduce((sum, t) => sum + t.amount, 0) / 3;
      const monthlySurplus = totalMonthlyIncome - monthlyExpenses;
      
      if (monthlySurplus > 0 && goals && goals.length > 0) {
        const slowestGoal = goals.reduce((slowest, goal) => {
          const remaining = goal.target_amount - goal.current_amount;
          const monthsToComplete = remaining / (monthlySurplus * 0.3); // 30% da sobra
          return monthsToComplete > (slowest?.monthsToComplete || 0) ? 
            { ...goal, monthsToComplete } : slowest;
        }, null as any);

        if (slowestGoal) {
          insights.push({
            id: 'goal-acceleration',
            type: 'goal_acceleration',
            title: '🚀 Acelere sua meta mais distante',
            description: `Com sua sobra mensal de R$ ${monthlySurplus.toFixed(0)}, você pode concluir "${slowestGoal.name}" ${Math.floor(slowestGoal.monthsToComplete)} meses mais cedo.`,
            impact: 0,
            actionable: `Destine R$ ${(monthlySurplus * 0.3).toFixed(0)} mensais extra para esta meta.`,
            urgency: 'low',
            category: 'Metas'
          });
        }
      }

      // 5. SAÚDE FINANCEIRA - Taxa de poupança
      const savingsRate = (monthlySurplus / totalMonthlyIncome) * 100;
      
      if (savingsRate < 10) {
        insights.push({
          id: 'financial-health-savings',
          type: 'financial_health',
          title: '⚠️ Taxa de poupança abaixo do ideal',
          description: `Sua taxa de poupança é ${savingsRate.toFixed(1)}% (ideal: 20%). Isso pode comprometer sua independência financeira.`,
          impact: (totalMonthlyIncome * 0.20 - monthlySurplus) * 12,
          actionable: 'Implemente a regra 50/30/20: 50% necessidades, 30% desejos, 20% poupança.',
          urgency: 'high',
          category: 'Planejamento'
        });
      }

      // 6. PADRÃO SAZONAL - Gastos por data
      const weekendSpending = expenses.filter(t => {
        const date = new Date(t.transaction_date);
        return date.getDay() === 0 || date.getDay() === 6; // domingo ou sábado
      }).reduce((sum, t) => sum + t.amount, 0);
      
      const weekdaySpending = expenses.filter(t => {
        const date = new Date(t.transaction_date);
        return date.getDay() !== 0 && date.getDay() !== 6;
      }).reduce((sum, t) => sum + t.amount, 0);

      if (weekendSpending > weekdaySpending * 0.4) {
        insights.push({
          id: 'weekend-pattern',
          type: 'behavior_pattern',
          title: '🎉 Padrão: Gastos elevados nos fins de semana',
          description: `Você gasta 40% mais nos fins de semana. Planejando melhor, pode economizar R$ ${(weekendSpending * 0.3).toFixed(0)} por mês.`,
          impact: weekendSpending * 0.3 * 12,
          actionable: 'Defina um "orçamento de diversão" semanal e use apenas dinheiro.',
          urgency: 'low',
          category: 'Comportamento'
        });
      }

      return insights.sort((a, b) => {
        const urgencyOrder = { high: 3, medium: 2, low: 1 };
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      });
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}
