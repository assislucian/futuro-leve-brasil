
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

      // 2. Buscar metas de reserva de emergência existentes
      const { data: emergencyGoals, error: goalsError } = await supabase
        .from('goals')
        .select('current_amount, target_amount, name')
        .eq('user_id', user.id)
        .ilike('name', '%emergência%');

      if (goalsError) {
        console.error("Erro ao buscar metas de emergência:", goalsError);
      }

      const transactions = recentTransactions || [];
      const currentEmergencyAmount = emergencyGoals?.reduce((sum, goal) => sum + goal.current_amount, 0) || 0;

      // 3. Categorizar gastos em essenciais vs não-essenciais
      const essentialCategories = [
        'Moradia', 'Alimentação', 'Transporte', 'Saúde', 
        'Seguros', 'Financiamento', 'Educação'
      ];

      const monthlyEssentialExpenses = transactions
        .filter(t => essentialCategories.includes(t.category) || t.classification === 'fixed')
        .reduce((sum, t) => sum + t.amount, 0) / 3; // Média dos 3 meses

      const monthlyTotalExpenses = transactions
        .reduce((sum, t) => sum + t.amount, 0) / 3; // Média dos 3 meses

      // 4. Determinar perfil de risco baseado nos gastos
      const essentialRatio = monthlyEssentialExpenses / monthlyTotalExpenses;
      let riskProfile: 'conservative' | 'moderate' | 'aggressive' = 'moderate';
      
      if (essentialRatio > 0.8) {
        riskProfile = 'conservative'; // Gastos muito focados no essencial
      } else if (essentialRatio < 0.5) {
        riskProfile = 'aggressive'; // Muitos gastos variáveis
      }

      // 5. Calcular recomendação baseada no perfil de risco
      let monthsRecommended = 3; // Padrão Dave Ramsey para iniciantes
      
      if (riskProfile === 'conservative') {
        monthsRecommended = 6; // Maior segurança para quem já tem controle
      } else if (riskProfile === 'aggressive') {
        monthsRecommended = 3; // Começar com meta menor para quem está começando
      }

      // Usar gastos essenciais como base (mais realista que gastos totais)
      const recommendedAmount = monthlyEssentialExpenses * monthsRecommended;
      const missingAmount = Math.max(0, recommendedAmount - currentEmergencyAmount);
      const hasEmergencyFund = currentEmergencyAmount >= recommendedAmount;
      const monthsOfSecurity = monthlyEssentialExpenses > 0 ? currentEmergencyAmount / monthlyEssentialExpenses : 0;

      console.log("useEmergencyFundCalculator: Resultado calculado:", {
        monthlyEssentialExpenses,
        monthlyTotalExpenses,
        recommendedAmount,
        currentEmergencyAmount,
        riskProfile,
        monthsRecommended
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
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });
}
