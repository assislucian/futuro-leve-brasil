
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface AdvancedInsight {
  id: string;
  type: 'dream_accelerator' | 'money_leak' | 'behavior_optimization' | 'goal_milestone' | 'smart_automation' | 'lifestyle_upgrade';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: {
    financial: number; // Impacto financeiro em R$
    timeline: string; // "em 6 meses", "por ano"
    confidence: number; // 0-100%
  };
  action: {
    primary: string;
    secondary?: string;
    path: string;
    urgent: boolean;
  };
  emotional: {
    mood: 'celebration' | 'warning' | 'opportunity' | 'motivation';
    message: string;
  };
  category: string;
  goalConnection?: {
    goalId: string;
    goalName: string;
    accelerationMonths: number;
  };
}

export function useAdvancedInsights() {
  const { user } = useAuth();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  return useQuery({
    queryKey: ['advancedInsights', user?.id, currentYear, currentMonth],
    queryFn: async (): Promise<AdvancedInsight[]> => {
      if (!user) return [];

      const insights: AdvancedInsight[] = [];

      // Buscar dados dos últimos 6 meses para análise profunda
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const [transactionsRes, goalsRes, budgetsRes] = await Promise.all([
        supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .gte('transaction_date', sixMonthsAgo.toISOString().split('T')[0])
          .order('transaction_date', { ascending: false }),
        
        supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id),
        
        supabase
          .from('budgets')
          .select('*')
          .eq('user_id', user.id)
      ]);

      if (transactionsRes.error || goalsRes.error || budgetsRes.error) {
        console.error('Erro ao buscar dados para insights avançados');
        return [];
      }

      const transactions = transactionsRes.data || [];
      const goals = goalsRes.data || [];
      const budgets = budgetsRes.data || [];

      const expenses = transactions.filter(t => t.type === 'expense');
      const income = transactions.filter(t => t.type === 'income');
      
      // 1. DREAM ACCELERATOR - Análise de aceleração de sonhos
      const monthlyIncome = income.reduce((sum, t) => sum + t.amount, 0) / 6;
      const monthlyExpenses = expenses.reduce((sum, t) => sum + t.amount, 0) / 6;
      const monthlySurplus = monthlyIncome - monthlyExpenses;

      if (monthlySurplus > 200 && goals.length > 0) {
        const closestGoal = goals
          .filter(g => g.current_amount < g.target_amount)
          .sort((a, b) => {
            const progressA = (a.current_amount / a.target_amount) * 100;
            const progressB = (b.current_amount / b.target_amount) * 100;
            return progressB - progressA;
          })[0];

        if (closestGoal) {
          const remaining = closestGoal.target_amount - closestGoal.current_amount;
          const optimalContribution = Math.min(monthlySurplus * 0.4, remaining);
          const accelerationMonths = Math.floor(remaining / optimalContribution);
          
          insights.push({
            id: 'dream-accelerator-main',
            type: 'dream_accelerator',
            priority: 'high',
            title: `🚀 Acelere "${closestGoal.name}" em ${accelerationMonths} meses!`,
            description: `Com sua sobra mensal de ${monthlySurplus.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}, você pode realizar este sonho ${accelerationMonths} meses mais cedo investindo ${optimalContribution.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} por mês.`,
            impact: {
              financial: optimalContribution * accelerationMonths,
              timeline: `em ${accelerationMonths} meses`,
              confidence: 85
            },
            action: {
              primary: 'Acelerar Sonho',
              secondary: 'Ver Projeção',
              path: '/goals',
              urgent: false
            },
            emotional: {
              mood: 'motivation',
              message: 'Seus sonhos estão mais próximos do que você imagina! 💫'
            },
            category: 'Aceleração de Metas',
            goalConnection: {
              goalId: closestGoal.id,
              goalName: closestGoal.name,
              accelerationMonths
            }
          });
        }
      }

      // 2. VAZAMENTOS CRÍTICOS - Detecção inteligente de vazamentos
      const categorySpending = expenses.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

      const unplannedSpending = expenses
        .filter(t => t.planning_status === 'unplanned')
        .reduce((sum, t) => sum + t.amount, 0) / 6;

      if (unplannedSpending > 300) {
        const annualLeak = unplannedSpending * 12;
        const goalImpact = goals.length > 0 ? 
          Math.floor(annualLeak / (goals[0]?.target_amount || 1000)) : 0;

        insights.push({
          id: 'critical-money-leak',
          type: 'money_leak',
          priority: 'critical',
          title: '🚨 Vazamento Crítico Detectado!',
          description: `Você está perdendo ${unplannedSpending.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} por mês com gastos não planejados. Isso representa ${annualLeak.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} por ano que poderiam realizar ${goalImpact} sonhos!`,
          impact: {
            financial: annualLeak,
            timeline: 'por ano',
            confidence: 95
          },
          action: {
            primary: 'Tampar Vazamento',
            secondary: 'Criar Orçamento',
            path: '/budgets',
            urgent: true
          },
          emotional: {
            mood: 'warning',
            message: 'Cada real conta na jornada dos seus sonhos! 💪'
          },
          category: 'Controle de Gastos'
        });
      }

      // 3. OTIMIZAÇÃO DE COMPORTAMENTO - Análise de padrões
      const weekendSpending = expenses.filter(t => {
        const date = new Date(t.transaction_date);
        return [0, 6].includes(date.getDay());
      }).reduce((sum, t) => sum + t.amount, 0);

      const weekdaySpending = expenses.filter(t => {
        const date = new Date(t.transaction_date);
        return ![0, 6].includes(date.getDay());
      }).reduce((sum, t) => sum + t.amount, 0);

      if (weekendSpending > weekdaySpending * 0.5) {
        const optimizationPotential = weekendSpending * 0.3;
        
        insights.push({
          id: 'weekend-optimization',
          type: 'behavior_optimization',
          priority: 'medium',
          title: '🎯 Oportunidade: Otimize seus fins de semana',
          description: `Você gasta 50% mais nos fins de semana. Planejando melhor seu lazer, pode economizar ${(optimizationPotential / 6).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} por mês.`,
          impact: {
            financial: optimizationPotential * 2, // Anual
            timeline: 'por ano',
            confidence: 75
          },
          action: {
            primary: 'Planejar Lazer',
            secondary: 'Ver Dicas',
            path: '/budgets',
            urgent: false
          },
          emotional: {
            mood: 'opportunity',
            message: 'Diversão inteligente = mais dinheiro para seus sonhos! 🎉'
          },
          category: 'Otimização de Lifestyle'
        });
      }

      // 4. MILESTONE CELEBRATION - Comemorações inteligentes
      goals.forEach(goal => {
        const progress = (goal.current_amount / goal.target_amount) * 100;
        
        if (progress >= 25 && progress < 30 && !goal.celebrated_at) {
          insights.push({
            id: `milestone-25-${goal.id}`,
            type: 'goal_milestone',
            priority: 'medium',
            title: `🎉 Parabéns! 25% de "${goal.name}" conquistados!`,
            description: `Você já percorreu 1/4 do caminho! Continue firme e você realizará este sonho. Que tal uma pequena comemoração (sem comprometer o orçamento)?`,
            impact: {
              financial: 0,
              timeline: 'conquista atual',
              confidence: 100
            },
            action: {
              primary: 'Continuar Sonho',
              secondary: 'Ver Progresso',
              path: '/goals',
              urgent: false
            },
            emotional: {
              mood: 'celebration',
              message: 'Cada passo conta na jornada dos seus sonhos! 🌟'
            },
            category: 'Motivação',
            goalConnection: {
              goalId: goal.id,
              goalName: goal.name,
              accelerationMonths: 0
            }
          });
        }

        if (progress >= 90 && progress < 100) {
          const remaining = goal.target_amount - goal.current_amount;
          insights.push({
            id: `final-sprint-${goal.id}`,
            type: 'goal_milestone',
            priority: 'high',
            title: `🏁 Reta Final! "${goal.name}" quase conquistado!`,
            description: `Faltam apenas ${remaining.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} para realizar este sonho! Você está na reta final!`,
            impact: {
              financial: remaining,
              timeline: 'faltam poucos dias',
              confidence: 100
            },
            action: {
              primary: 'Finalizar Sonho',
              secondary: 'Contribuir Agora',
              path: '/goals',
              urgent: true
            },
            emotional: {
              mood: 'motivation',
              message: 'Você consegue! A vitória está ao seu alcance! 🎯'
            },
            category: 'Finalização de Meta',
            goalConnection: {
              goalId: goal.id,
              goalName: goal.name,
              accelerationMonths: 0
            }
          });
        }
      });

      // 5. AUTOMAÇÃO INTELIGENTE - Sugestões de automação
      const recurringExpenses = expenses.filter(t => t.recurrence_pattern);
      if (recurringExpenses.length < 3 && expenses.length > 20) {
        insights.push({
          id: 'smart-automation',
          type: 'smart_automation',
          priority: 'low',
          title: '🤖 Automatize suas finanças e ganhe tempo',
          description: 'Detectamos gastos recorrentes que podem ser automatizados. Isso economiza tempo e evita esquecimentos que comprometem seu orçamento.',
          impact: {
            financial: 0,
            timeline: 'economia de tempo',
            confidence: 80
          },
          action: {
            primary: 'Configurar Automação',
            secondary: 'Ver Transações',
            path: '/dashboard',
            urgent: false
          },
          emotional: {
            mood: 'opportunity',
            message: 'Mais tempo para focar no que realmente importa! ⏰'
          },
          category: 'Automação'
        });
      }

      // 6. UPGRADE DE LIFESTYLE INTELIGENTE
      const savingsRate = (monthlySurplus / monthlyIncome) * 100;
      if (savingsRate > 20 && monthlySurplus > 1000) {
        insights.push({
          id: 'lifestyle-upgrade',
          type: 'lifestyle_upgrade',
          priority: 'low',
          title: '💎 Você pode se dar um upgrade sustentável!',
          description: `Com uma taxa de poupança de ${savingsRate.toFixed(1)}% (excelente!), você pode investir ${(monthlySurplus * 0.2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} em qualidade de vida sem comprometer seus sonhos.`,
          impact: {
            financial: monthlySurplus * 0.2 * 12,
            timeline: 'por ano',
            confidence: 70
          },
          action: {
            primary: 'Planejar Upgrade',
            secondary: 'Ver Opções',
            path: '/budgets',
            urgent: false
          },
          emotional: {
            mood: 'opportunity',
            message: 'Equilibrio perfeito: realizar sonhos E viver bem hoje! ✨'
          },
          category: 'Qualidade de Vida'
        });
      }

      // Ordenar por prioridade e impacto
      return insights.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return b.impact.financial - a.impact.financial;
      });
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
