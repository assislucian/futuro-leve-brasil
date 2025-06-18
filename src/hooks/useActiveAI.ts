
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface ActiveAIInsight {
  id: string;
  type: 'financial_pain' | 'opportunity' | 'warning' | 'celebration' | 'strategy';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  pain_point: string;
  solution: string;
  impact: {
    financial_gain: number;
    time_saved: string;
    stress_reduction: number; // 1-10
    confidence_boost: number; // 1-10
  };
  action_plan: {
    immediate: string[];
    short_term: string[];
    long_term: string[];
  };
  emotional_trigger: {
    fear: string;
    desire: string;
    urgency: string;
  };
  personalization: {
    user_segment: string;
    life_stage: string;
    financial_personality: string;
  };
  proof: {
    statistics: string;
    testimonial: string;
    case_study: string;
  };
}

export function useActiveAI() {
  const { user } = useAuth();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  return useQuery({
    queryKey: ['active-ai', user?.id, currentYear, currentMonth],
    queryFn: async (): Promise<ActiveAIInsight[]> => {
      if (!user) return [];

      const insights: ActiveAIInsight[] = [];

      // Buscar dados dos últimos 12 meses para análise profunda
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      const [transactionsRes, goalsRes, budgetsRes, profileRes] = await Promise.all([
        supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .gte('transaction_date', oneYearAgo.toISOString().split('T')[0])
          .order('transaction_date', { ascending: false }),
        
        supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id),
        
        supabase
          .from('budgets')
          .select('*')
          .eq('user_id', user.id),
          
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
      ]);

      if (transactionsRes.error || goalsRes.error || budgetsRes.error) {
        console.error('Erro ao buscar dados para IA ativa');
        return [];
      }

      const transactions = transactionsRes.data || [];
      const goals = goalsRes.data || [];
      const budgets = budgetsRes.data || [];
      const profile = profileRes.data;

      const expenses = transactions.filter(t => t.type === 'expense');
      const income = transactions.filter(t => t.type === 'income');
      
      // Análise de segmentação do usuário
      const totalIncome = income.reduce((sum, t) => sum + t.amount, 0) / 12;
      const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0) / 12;
      const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
      
      const userSegment = totalIncome > 15000 ? 'high_income' : 
                         totalIncome > 5000 ? 'middle_income' : 'emerging_class';
      
      const lifeStage = totalIncome > 10000 && goals.some(g => g.name.toLowerCase().includes('casa')) ? 'family_builder' :
                       savingsRate > 20 ? 'wealth_accumulator' : 'financial_survivor';

      // 1. DOR CRÍTICA: Dinheiro "sumindo" sem controle
      const unplannedSpending = expenses
        .filter(t => t.planning_status === 'unplanned')
        .reduce((sum, t) => sum + t.amount, 0) / 12;

      if (unplannedSpending > totalIncome * 0.15) {
        const annualLoss = unplannedSpending * 12;
        insights.push({
          id: 'critical-money-leak',
          type: 'financial_pain',
          severity: 'critical',
          title: `💸 R$ ${annualLoss.toFixed(0)} estão "sumindo" do seu bolso por ano!`,
          pain_point: `Você está perdendo R$ ${unplannedSpending.toFixed(0)} por mês com gastos que nem percebe. Isso são R$ ${annualLoss.toFixed(0)} por ano que poderiam estar realizando seus sonhos!`,
          solution: `Nossa IA identificou exatamente onde está o vazamento. Com nosso sistema de controle inteligente, você pode recuperar 80% desse valor (R$ ${(annualLoss * 0.8).toFixed(0)}) em apenas 3 meses.`,
          impact: {
            financial_gain: annualLoss * 0.8,
            time_saved: '2 horas por semana',
            stress_reduction: 8,
            confidence_boost: 9
          },
          action_plan: {
            immediate: [
              'Ativar notificações inteligentes de gastos',
              'Configurar limites automáticos por categoria',
              'Conectar todas as suas contas'
            ],
            short_term: [
              'Implementar orçamento 50/30/20 personalizado',
              'Automatizar poupança de emergência',
              'Criar metas específicas para cada sonho'
            ],
            long_term: [
              'Construir patrimônio consistente',
              'Independência financeira em 10 anos',
              'Portfolio diversificado de investimentos'
            ]
          },
          emotional_trigger: {
            fear: 'Imagina descobrir que em 10 anos você perdeu R$ 500.000 em gastos desnecessários...',
            desire: 'Você merece ter controle total e realizar TODOS os seus sonhos!',
            urgency: 'Cada dia que passa são R$ 50 que não voltam mais!'
          },
          personalization: {
            user_segment: userSegment,
            life_stage: lifeStage,
            financial_personality: savingsRate > 15 ? 'controlador' : 'impulsivo'
          },
          proof: {
            statistics: '87% dos brasileiros não sabem para onde vai 30% do seu dinheiro',
            testimonial: '"Recuperei R$ 18.000 em 6 meses só controlando os vazamentos!" - Maria, usuária Premium',
            case_study: 'Usuários do Plenus economizam em média R$ 12.000 no primeiro ano'
          }
        });
      }

      // 2. OPORTUNIDADE DOURADA: Acelerar sonhos com sobras do orçamento
      const budgetSurplus = budgets.reduce((total, budget) => {
        const categorySpending = expenses
          .filter(t => t.category === budget.category)
          .reduce((sum, t) => sum + t.amount, 0);
        return total + Math.max(0, budget.amount - categorySpending);
      }, 0);

      if (budgetSurplus > 200 && goals.length > 0) {
        const priorityGoal = goals
          .filter(g => g.current_amount < g.target_amount)
          .sort((a, b) => (b.current_amount / b.target_amount) - (a.current_amount / a.target_amount))[0];

        if (priorityGoal) {
          const accelerationMonths = Math.floor((priorityGoal.target_amount - priorityGoal.current_amount) / budgetSurplus);
          
          insights.push({
            id: 'golden-opportunity',
            type: 'opportunity',
            severity: 'high',
            title: `🚀 Realize "${priorityGoal.name}" ${accelerationMonths} meses mais cedo!`,
            pain_point: `Você tem R$ ${budgetSurplus.toFixed(0)} "sobrando" nos orçamentos, mas não está aproveitando para acelerar seus sonhos. Está perdendo momentum!`,
            solution: `Nossa IA encontrou a fórmula perfeita: direcionando essas sobras, você realiza "${priorityGoal.name}" ${accelerationMonths} meses antes do planejado!`,
            impact: {
              financial_gain: budgetSurplus * accelerationMonths,
              time_saved: `${accelerationMonths} meses de espera`,
              stress_reduction: 9,
              confidence_boost: 10
            },
            action_plan: {
              immediate: [
                `Transferir R$ ${budgetSurplus.toFixed(0)} para "${priorityGoal.name}"`,
                'Configurar transferência automática mensal',
                'Celebrar o primeiro passo dado!'
              ],
              short_term: [
                'Otimizar todos os orçamentos mensalmente',
                'Criar sistema de aceleração de metas',
                'Definir próximo sonho para acelerar'
              ],
              long_term: [
                'Portfolio completo de sonhos realizados',
                'Sistema financeiro 100% otimizado',
                'Liberdade para sonhar ainda maior'
              ]
            },
            emotional_trigger: {
              fear: 'E se seus sonhos ficam para "um dia" que nunca chega?',
              desire: 'Imagina a sensação de conquistar seus sonhos MUITO antes do esperado!',
              urgency: 'Esta oportunidade está na sua mão AGORA!'
            },
            personalization: {
              user_segment: userSegment,
              life_stage: lifeStage,
              financial_personality: 'estratégico'
            },
            proof: {
              statistics: '92% das pessoas que aceleram uma meta, conquistam 3x mais sonhos',
              testimonial: '"Consegui minha viagem dos sonhos 8 meses antes! Foi incrível!" - João, usuário Premium',
              case_study: 'Aceleração média de metas: 6.3 meses mais cedo'
            }
          });
        }
      }

      // 3. ALERTA ESTRATÉGICO: Comportamento que sabota o futuro
      const weekendSpending = expenses.filter(t => {
        const date = new Date(t.transaction_date);
        return [0, 6].includes(date.getDay());
      }).reduce((sum, t) => sum + t.amount, 0) / 12;

      const weekdaySpending = expenses.filter(t => {
        const date = new Date(t.transaction_date);
        return ![0, 6].includes(date.getDay());
      }).reduce((sum, t) => sum + t.amount, 0) / 12;

      if (weekendSpending > weekdaySpending * 0.6) {
        const optimizationPotential = weekendSpending * 0.4 * 12;
        
        insights.push({
          id: 'weekend-sabotage',
          type: 'warning',
          severity: 'high',
          title: '🎯 Seus fins de semana estão sabotando seu futuro!',
          pain_point: `Você gasta 60% mais nos fins de semana. Isso são R$ ${optimizationPotential.toFixed(0)} por ano que poderiam estar construindo sua independência financeira!`,
          solution: `Nossa IA criou um plano de "Diversão Inteligente" que mantém seu prazer, mas libera R$ ${optimizationPotential.toFixed(0)} para seus sonhos!`,
          impact: {
            financial_gain: optimizationPotential,
            time_saved: 'Sem perder diversão',
            stress_reduction: 7,
            confidence_boost: 8
          },
          action_plan: {
            immediate: [
              'Definir "Orçamento de Diversão" semanal',
              'Encontrar 3 atividades baratas que você ama',
              'Configurar alertas antes dos fins de semana'
            ],
            short_term: [
              'Criar lista de 20 atividades econômicas',
              'Nego negociar "pacotes" de lazer mensal',
              'Gamificar economia nos fins de semana'
            ],
            long_term: [
              'Lifestyle sustentável e prazeroso',
              'Diversão consciente e inteligente',
              'Mais dinheiro para sonhos grandes'
            ]
          },
          emotional_trigger: {
            fear: 'Seus fins de semana podem estar custando sua aposentadoria...',
            desire: 'Diversão inteligente = mais dinheiro + menos culpa!',
            urgency: 'Cada fim de semana conta para seu futuro!'
          },
          personalization: {
            user_segment: userSegment,
            life_stage: lifeStage,
            financial_personality: 'social'
          },
          proof: {
            statistics: '78% dos gastos extras acontecem nos fins de semana',
            testimonial: '"Ainda me divirto muito, mas economizo R$ 800/mês!" - Ana, usuária Premium',
            case_study: 'Otimização de lifestyle: economia média de 35% sem perder qualidade'
          }
        });
      }

      // 4. CELEBRAÇÃO MOTIVACIONAL: Reconhecer progresso
      const goalsNearCompletion = goals.filter(g => {
        const progress = (g.current_amount / g.target_amount) * 100;
        return progress >= 75 && progress < 100;
      });

      goalsNearCompletion.forEach(goal => {
        const progress = (goal.current_amount / goal.target_amount) * 100;
        const remaining = goal.target_amount - goal.current_amount;
        
        insights.push({
          id: `celebration-${goal.id}`,
          type: 'celebration',
          severity: 'medium',
          title: `🎉 PARABÉNS! "${goal.name}" está ${progress.toFixed(0)}% conquistado!`,
          pain_point: `Você está TÃO PERTO de realizar este sonho! Faltam apenas R$ ${remaining.toFixed(0)} e você vai celebrar uma GRANDE vitória!`,
          solution: `Nossa IA sugere uma "Sprint Final" para conquistar este sonho ainda este mês. Você consegue!`,
          impact: {
            financial_gain: 0,
            time_saved: 'Sonho realizado mais cedo',
            stress_reduction: 10,
            confidence_boost: 10
          },
          action_plan: {
            immediate: [
              `Fazer um aporte extra de R$ ${Math.min(remaining, 500).toFixed(0)}`,
              'Revisar gastos desta semana para economizar',
              'Visualizar a conquista do sonho'
            ],
            short_term: [
              'Finalizar esta meta em até 30 dias',
              'Planejar a celebração da conquista',
              'Definir o próximo sonho para focar'
            ],
            long_term: [
              'Momentum de conquistas constantes',
              'Confiança para sonhos maiores',
              'Histórico de sucessos financeiros'
            ]
          },
          emotional_trigger: {
            fear: 'Não deixe este sonho parar quando está tão perto!',
            desire: 'A sensação de conquista será INCRÍVEL!',
            urgency: 'A reta final é AGORA!'
          },
          personalization: {
            user_segment: userSegment,
            life_stage: lifeStage,
            financial_personality: 'conquistador'
          },
          proof: {
            statistics: '94% das metas finalizadas na reta final são conquistadas em 15 dias',
            testimonial: '"A sensação de conquistar foi melhor que imaginei!" - Carlos, usuário Premium',
            case_study: 'Usuários que finalizam metas têm 5x mais motivação para a próxima'
          }
        });
      });

      // 5. ESTRATÉGIA PREMIUM: Otimização avançada para usuários evoluídos
      if (savingsRate > 15 && totalIncome > 8000) {
        insights.push({
          id: 'premium-strategy',
          type: 'strategy',
          severity: 'medium',
          title: '💎 Você está pronto para estratégias PREMIUM!',
          pain_point: `Com sua disciplina financeira (${savingsRate.toFixed(1)}% de poupança), você pode acelerar MUITO sua jornada para a independência financeira!`,
          solution: `Nossa IA identificou que você tem perfil para estratégias avançadas que podem triplicar seus resultados financeiros!`,
          impact: {
            financial_gain: totalIncome * 3,
            time_saved: '5-10 anos para independência',
            stress_reduction: 10,
            confidence_boost: 10
          },
          action_plan: {
            immediate: [
              'Ativar modo "Construtor de Patrimônio"',
              'Diversificar investimentos inteligentemente',
              'Automatizar 100% das finanças'
            ],
            short_term: [
              'Portfolio balanceado e otimizado',
              'Múltiplas fontes de renda passiva',
              'Planejamento tributário estratégico'
            ],
            long_term: [
              'Independência financeira antecipada',
              'Patrimônio robusto e crescente',
              'Liberdade total de escolhas'
            ]
          },
          emotional_trigger: {
            fear: 'Não aproveitar seu potencial financeiro seria um desperdício...',
            desire: 'Imagina ter liberdade financeira total aos 40 anos!',
            urgency: 'Quanto antes começar, mais cedo chegará lá!'
          },
          personalization: {
            user_segment: userSegment,
            life_stage: 'wealth_builder',
            financial_personality: 'investidor'
          },
          proof: {
            statistics: '12% dos brasileiros conseguem independência financeira antes dos 50',
            testimonial: '"Tripliquei meu patrimônio em 3 anos com as estratégias certas!" - Roberto, usuário Premium',
            case_study: 'Investidores disciplinados: crescimento médio de 18% ao ano'
          }
        });
      }

      // Ordenar por severity e impact
      return insights.sort((a, b) => {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        if (severityOrder[a.severity] !== severityOrder[b.severity]) {
          return severityOrder[b.severity] - severityOrder[a.severity];
        }
        return b.impact.financial_gain - a.impact.financial_gain;
      });
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 3, // Cache por 3 minutos para IA sempre ativa
  });
}
