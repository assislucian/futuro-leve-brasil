
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { useGoals } from "@/hooks/useGoals";
import { useFinancialSummaryData } from "@/hooks/useFinancialSummaryData";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const GoalsSummary = () => {
  const { data: goals, isLoading: goalsLoading } = useGoals();
  const { data: financialData, isLoading: financialLoading } = useFinancialSummaryData();

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Calcular métricas inteligentes baseadas em princípios financeiros
  const calculateFinancialHealth = () => {
    if (!financialData || !goals) return null;

    const { totalIncome, totalExpense, balance } = financialData;
    const totalSaved = goals.reduce((sum, goal) => sum + goal.current_amount, 0);
    
    // Conceito Dave Ramsey: Reserva de emergência (3-6 meses de gastos)
    const monthlyExpenses = totalExpense;
    const emergencyFundTarget = monthlyExpenses * 3; // 3 meses mínimo
    const hasEmergencyFund = totalSaved >= emergencyFundTarget;
    
    // Taxa de poupança ideal: 20% da renda (Warren Buffett)
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;
    const idealSavingsRate = 20;
    
    return {
      hasEmergencyFund,
      emergencyFundTarget,
      savingsRate,
      idealSavingsRate,
      totalSaved,
      monthlyExpenses
    };
  };

  const financialHealth = calculateFinancialHealth();
  
  // Priorização inteligente de ações
  const getSmartRecommendation = () => {
    if (!financialHealth || !goals) return null;

    const { hasEmergencyFund, savingsRate, idealSavingsRate, totalSaved, emergencyFundTarget } = financialHealth;

    // 1ª Prioridade: Reserva de emergência
    if (!hasEmergencyFund && totalSaved < emergencyFundTarget) {
      return {
        type: "emergency",
        title: "🚨 Prioridade: Reserva de Emergência",
        description: `Você precisa de ${formatCurrency(emergencyFundTarget - totalSaved)} para ter 3 meses de segurança.`,
        action: "Criar Meta de Emergência",
        priority: "high"
      };
    }

    // 2ª Prioridade: Taxa de poupança baixa
    if (savingsRate < idealSavingsRate) {
      return {
        type: "savings",
        title: "💡 Melhore sua Taxa de Poupança",
        description: `Sua taxa atual é ${savingsRate.toFixed(1)}%. Meta ideal: ${idealSavingsRate}%.`,
        action: "Otimizar Orçamento",
        priority: "medium"
      };
    }

    // 3ª Prioridade: Acelerar metas existentes
    if (goals.length > 0) {
      const nearestGoal = goals.sort((a, b) => {
        const progressA = (a.current_amount / a.target_amount) * 100;
        const progressB = (b.current_amount / b.target_amount) * 100;
        return progressB - progressA; // Maior progresso primeiro
      })[0];

      return {
        type: "accelerate",
        title: "🚀 Acelere seu Sonho",
        description: `"${nearestGoal.name}" está ${((nearestGoal.current_amount / nearestGoal.target_amount) * 100).toFixed(0)}% completa!`,
        action: "Contribuir Agora",
        priority: "low"
      };
    }

    return null;
  };

  const smartRecommendation = getSmartRecommendation();

  if (goalsLoading || financialLoading) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!goals || goals.length === 0) {
    return (
      <Card className="h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-emerald-600" />
            Seus Sonhos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <Target className="h-6 w-6 text-emerald-600" />
            </div>
            
            {smartRecommendation?.type === "emergency" ? (
              <div className="space-y-2">
                <Badge variant="destructive" className="mb-2">
                  Ação Urgente
                </Badge>
                <h4 className="font-medium text-sm text-slate-900">
                  {smartRecommendation.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {smartRecommendation.description}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-slate-900">
                  Comece Definindo um Sonho
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Conecte seu dinheiro a um objetivo. Sonhos claros geram economia automática.
                </p>
              </div>
            )}
          </div>

          <Button asChild size="sm" className="w-full bg-emerald-500 hover:bg-emerald-600">
            <Link to="/goals">
              <Target className="h-4 w-4 mr-2" />
              {smartRecommendation?.type === "emergency" ? "Criar Reserva de Emergência" : "Criar Primeira Meta"}
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const totalSaved = goals.reduce((sum, goal) => sum + goal.current_amount, 0);
  const activeGoals = goals.filter(goal => goal.current_amount < goal.target_amount);

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="h-4 w-4 text-emerald-600" />
          Seus Sonhos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-emerald-600">{goals.length}</p>
            <p className="text-xs text-muted-foreground">
              {goals.length === 1 ? "sonho" : "sonhos"} criados
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-emerald-600">{activeGoals.length}</p>
            <p className="text-xs text-muted-foreground">em andamento</p>
          </div>
        </div>

        {/* Total Guardado */}
        <div className="bg-emerald-50 rounded-lg p-3 text-center border border-emerald-200">
          <p className="text-xs text-emerald-700 font-medium mb-1">
            Total já guardado para seus sonhos
          </p>
          <p className="text-lg font-bold text-emerald-800">
            {formatCurrency(totalSaved)}
          </p>
        </div>

        {/* Recomendação Inteligente */}
        {smartRecommendation && (
          <div className={cn(
            "p-3 rounded-lg border text-center space-y-2",
            smartRecommendation.priority === "high" && "bg-red-50 border-red-200",
            smartRecommendation.priority === "medium" && "bg-yellow-50 border-yellow-200",
            smartRecommendation.priority === "low" && "bg-blue-50 border-blue-200"
          )}>
            <div className="flex items-center justify-center gap-2">
              {smartRecommendation.priority === "high" && <AlertCircle className="h-4 w-4 text-red-600" />}
              {smartRecommendation.priority === "medium" && <TrendingUp className="h-4 w-4 text-yellow-600" />}
              {smartRecommendation.priority === "low" && <CheckCircle className="h-4 w-4 text-blue-600" />}
              <p className="text-xs font-medium text-slate-700">
                {smartRecommendation.title}
              </p>
            </div>
            <p className="text-xs text-slate-600">
              {smartRecommendation.description}
            </p>
          </div>
        )}

        {/* Motivação */}
        <div className="text-center space-y-2">
          <p className="text-xs font-medium text-slate-700">Parabéns!</p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Você está construindo seu futuro financeiro! Cada real economizado é um passo mais perto dos seus sonhos. 🚀
          </p>
        </div>

        <Button asChild variant="outline" size="sm" className="w-full">
          <Link to="/goals">
            <Target className="h-4 w-4 mr-2" />
            Ver Minhas Metas
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default GoalsSummary;
