
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type SmartInsight = {
  id: string;
  type: 'goal_opportunity' | 'budget_alert' | 'smart_suggestion' | 'celebration';
  title: string;
  description: string;
  amount?: number;
  actionLabel: string;
  actionPath: string;
  priority: 'high' | 'medium' | 'low';
  category?: string;
  goalName?: string;
};

export function useSmartInsights() {
  const { user } = useAuth();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  return useQuery({
    queryKey: ['smartInsights', user?.id, currentYear, currentMonth],
    queryFn: async (): Promise<SmartInsight[]> => {
      if (!user) return [];

      const insights: SmartInsight[] = [];

      // 1. Buscar dados necessários
      const [transactionsRes, goalsRes, budgetsRes] = await Promise.all([
        supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .gte('transaction_date', `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`)
          .order('transaction_date', { ascending: false }),
        
        supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id),
        
        supabase
          .from('budgets')
          .select('*')
          .eq('user_id', user.id)
          .eq('year', currentYear)
          .eq('month', currentMonth)
      ]);

      if (transactionsRes.error || goalsRes.error || budgetsRes.error) {
        console.error('Erro ao buscar dados para insights');
        return [];
      }

      const transactions = transactionsRes.data || [];
      const goals = goalsRes.data || [];
      const budgets = budgetsRes.data || [];

      // 2. Calcular gastos por categoria
      const spendingByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>);

      // 3. Oportunidades de Metas (economia em orçamentos)
      budgets.forEach(budget => {
        const spent = spendingByCategory[budget.category] || 0;
        const saved = budget.amount - spent;
        
        if (saved > 50) { // Economia significativa
          const activeGoal = goals.find(g => g.current_amount < g.target_amount);
          if (activeGoal) {
            insights.push({
              id: `goal-opportunity-${budget.category}`,
              type: 'goal_opportunity',
              title: `💰 Economia em ${budget.category}!`,
              description: `Você economizou ${saved.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} este mês. Que tal acelerar seu sonho "${activeGoal.name}"?`,
              amount: saved,
              actionLabel: 'Contribuir para Meta',
              actionPath: '/goals',
              priority: 'high',
              category: budget.category,
              goalName: activeGoal.name
            });
          }
        }
      });

      // 4. Alertas de Orçamento Inteligentes
      budgets.forEach(budget => {
        const spent = spendingByCategory[budget.category] || 0;
        const progress = (spent / budget.amount) * 100;
        
        if (progress > 85 && progress < 100) {
          const remaining = budget.amount - spent;
          insights.push({
            id: `budget-alert-${budget.category}`,
            type: 'budget_alert',
            title: `⚠️ Cuidado com ${budget.category}`,
            description: `Você já gastou ${progress.toFixed(0)}% do orçamento. Restam apenas ${remaining.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}.`,
            amount: remaining,
            actionLabel: 'Ver Orçamentos',
            actionPath: '/budgets',
            priority: 'high',
            category: budget.category
          });
        } else if (progress > 100) {
          const overspent = spent - budget.amount;
          insights.push({
            id: `budget-overspent-${budget.category}`,
            type: 'budget_alert',
            title: `🚨 Orçamento ultrapassado!`,
            description: `Você gastou ${overspent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} além do planejado em ${budget.category}.`,
            amount: overspent,
            actionLabel: 'Ajustar Orçamento',
            actionPath: '/budgets',
            priority: 'high',
            category: budget.category
          });
        }
      });

      // 5. Sugestões Inteligentes baseadas em padrões
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const monthlyBalance = totalIncome - totalExpenses;

      if (monthlyBalance > 100 && goals.length > 0) {
        const nextGoal = goals
          .filter(g => g.current_amount < g.target_amount)
          .sort((a, b) => {
            const progressA = (a.current_amount / a.target_amount) * 100;
            const progressB = (b.current_amount / b.target_amount) * 100;
            return progressB - progressA; // Priorizar meta com maior progresso
          })[0];

        if (nextGoal) {
          const suggestedAmount = Math.min(monthlyBalance * 0.3, nextGoal.target_amount - nextGoal.current_amount);
          insights.push({
            id: 'monthly-surplus-suggestion',
            type: 'smart_suggestion',
            title: `🚀 Sobrou dinheiro? Acelere seus sonhos!`,
            description: `Você teve um saldo positivo de ${monthlyBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} este mês. Que tal investir ${suggestedAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} na meta "${nextGoal.name}"?`,
            amount: suggestedAmount,
            actionLabel: 'Contribuir Agora',
            actionPath: '/goals',
            priority: 'medium',
            goalName: nextGoal.name
          });
        }
      }

      // 6. Celebração de Metas Próximas
      goals.forEach(goal => {
        const progress = (goal.current_amount / goal.target_amount) * 100;
        if (progress >= 90 && progress < 100) {
          const remaining = goal.target_amount - goal.current_amount;
          insights.push({
            id: `goal-almost-complete-${goal.id}`,
            type: 'celebration',
            title: `🎯 Quase lá! Meta "${goal.name}"`,
            description: `Você está a apenas ${remaining.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} de realizar seu sonho! Continue firme!`,
            amount: remaining,
            actionLabel: 'Finalizar Meta',
            actionPath: '/goals',
            priority: 'high',
            goalName: goal.name
          });
        }
      });

      // 7. Ordenar insights por prioridade
      return insights.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });
}
