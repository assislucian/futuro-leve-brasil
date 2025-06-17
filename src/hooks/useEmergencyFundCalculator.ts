
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface EmergencyFundData {
  recommendedAmount: number;
  currentAmount: number;
  monthlyEssentialExpenses: number;
  monthlyTotalExpenses: number;
  hasEmergencyFund: boolean;
  missingAmount: number;
  monthsOfSecurity: number;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
}

/**
 * Hook inteligente para calcular reserva de emergência
 * Baseado em princípios de Dave Ramsey e Suze Orman
 */
export function useEmergencyFundCalculator() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['emergencyFundCalculator', user?.id],
    queryFn: async (): Promise<EmergencyFundData> => {
      if (!user) {
        return {
          recommendedAmount: 0,
          currentAmount: 0,
          monthlyEssentialExpenses: 0,
          monthlyTotalExpenses: 0,
          hasEmergencyFund: false,
          missingAmount: 0,
          monthsOfSecurity: 0,
          riskProfile: 'moderate'
        };
      }

      console.log("useEmergencyFundCalculator: Analisando dados para:", user.id);

      // 1. Buscar transações dos últimos 3 meses para calcular média mensal
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      
      const { data: recentTransactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('amount, type, category, classification')
        .eq('user_id', user.id)
        .eq('type', 'expense')
        .gte('transaction_date', threeMonthsAgo.toISOString().split('T')[0]);

      if (transactionsError) {
        console.error("Erro ao buscar transações:", transactionsError);
        throw transactionsError;
      }

      // 2. Buscar TODAS as metas para detectar reserva de emergência
      const { data: allGoals, error: goalsError } = await supabase
        .from('goals')
        .select('current_amount, target_amount, name')
        .eq('user_id', user.id);

      if (goalsError) {
        console.error("Erro ao buscar metas:", goalsError);
      }

      const transactions = recentTransactions || [];
      
      // 3. Detectar metas de emergência de forma mais inteligente
      const emergencyGoals = allGoals?.filter(goal => {
        const name = goal.name.toLowerCase();
        return name.includes('emergência') || 
               name.includes('emergencia') || 
               name.includes('reserva') ||
               name.includes('segurança') ||
               name.includes('seguranca') ||
               name.includes('🛡️') ||
               name.includes('colchão') ||
               name.includes('colchao');
      }) || [];

      const currentEmergencyAmount = emergencyGoals.reduce((sum, goal) => sum + goal.current_amount, 0);

      console.log("Metas de emergência encontradas:", emergencyGoals);
      console.log("Valor atual da reserva:", currentEmergencyAmount);

      // 4. Categorizar gastos em essenciais vs não-essenciais de forma mais precisa
      const essentialCategories = [
        'Moradia', 'Alimentação', 'Transporte', 'Saúde', 
        'Seguros', 'Financiamento', 'Educação'
      ];

      // Calcular média mensal baseada nos últimos 3 meses (ou período disponível)
      const monthsOfData = Math.max(1, Math.min(3, transactions.length > 0 ? 3 : 1));
      
      const monthlyEssentialExpenses = transactions
        .filter(t => essentialCategories.includes(t.category) || t.classification === 'fixed')
        .reduce((sum, t) => sum + t.amount, 0) / monthsOfData;

      const monthlyTotalExpenses = transactions
        .reduce((sum, t) => sum + t.amount, 0) / monthsOfData;

      console.log("Gastos essenciais mensais:", monthlyEssentialExpenses);
      console.log("Gastos totais mensais:", monthlyTotalExpenses);

      // 5. Determinar perfil de risco baseado nos gastos
      const essentialRatio = monthlyTotalExpenses > 0 ? monthlyEssentialExpenses / monthlyTotalExpenses : 0;
      let riskProfile: 'conservative' | 'moderate' | 'aggressive' = 'moderate';
      
      if (essentialRatio > 0.8) {
        riskProfile = 'conservative'; // Gastos muito focados no essencial
      } else if (essentialRatio < 0.5) {
        riskProfile = 'aggressive'; // Muitos gastos variáveis
      }

      // 6. Calcular recomendação baseada no perfil de risco
      let monthsRecommended = 3; // Padrão Dave Ramsey para iniciantes
      
      if (riskProfile === 'conservative') {
        monthsRecommended = 6; // Maior segurança para quem já tem controle
      } else if (riskProfile === 'aggressive') {
        monthsRecommended = 3; // Começar com meta menor para quem está começando
      }

      // Usar gastos essenciais como base (mais realista que gastos totais)
      const baseExpense = monthlyEssentialExpenses > 0 ? monthlyEssentialExpenses : monthlyTotalExpenses;
      const recommendedAmount = baseExpense * monthsRecommended;
      const missingAmount = Math.max(0, recommendedAmount - currentEmergencyAmount);
      const hasEmergencyFund = currentEmergencyAmount >= recommendedAmount;
      const monthsOfSecurity = baseExpense > 0 ? currentEmergencyAmount / baseExpense : 0;

      console.log("useEmergencyFundCalculator: Resultado calculado:", {
        monthlyEssentialExpenses,
        monthlyTotalExpenses,
        recommendedAmount,
        currentEmergencyAmount,
        riskProfile,
        monthsRecommended,
        monthsOfSecurity,
        hasEmergencyFund
      });

      return {
        recommendedAmount,
        currentAmount: currentEmergencyAmount,
        monthlyEssentialExpenses,
        monthlyTotalExpenses,
        hasEmergencyFund,
        missingAmount,
        monthsOfSecurity,
        riskProfile
      };
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutos
    gcTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}
