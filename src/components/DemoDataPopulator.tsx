import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Database, Sparkles, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

/**
 * Componente para popular dados de demonstração para o usuário atual
 */
export function DemoDataPopulator() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

  const clearAllDemoData = async () => {
    if (!user) return;

    setIsClearing(true);
    try {
      console.log("Limpando todos os dados de demonstração...");
      
      // Deletar em ordem para respeitar foreign keys
      await supabase.from('goal_contributions').delete().eq('user_id', user.id);
      await supabase.from('goals').delete().eq('user_id', user.id);
      
      // Buscar IDs dos planos de parcelamento para deletar pagamentos
      const { data: existingInstallmentPlans } = await supabase
        .from('installment_plans')
        .select('id')
        .eq('user_id', user.id);
      
      if (existingInstallmentPlans && existingInstallmentPlans.length > 0) {
        const planIds = existingInstallmentPlans.map(p => p.id);
        for (const planId of planIds) {
          await supabase.from('installment_payments').delete().eq('installment_plan_id', planId);
        }
      }
      
      await supabase.from('installment_plans').delete().eq('user_id', user.id);
      await supabase.from('recurring_transactions').delete().eq('user_id', user.id);
      await supabase.from('budgets').delete().eq('user_id', user.id);
      await supabase.from('classification_patterns').delete().eq('user_id', user.id);
      await supabase.from('transactions').delete().eq('user_id', user.id);

      toast.success("✨ Dados limpos com sucesso!", {
        description: "Agora você pode começar fresh com seus próprios dados."
      });

      setIsClearDialogOpen(false);
      
      // Recarregar a página para mostrar o estado limpo
      window.location.reload();

    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      toast.error("Erro ao limpar dados", {
        description: "Tente novamente ou entre em contato com o suporte."
      });
    } finally {
      setIsClearing(false);
    }
  };

  const populateDemoData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Limpar todos os dados existentes primeiro para evitar duplicações
      console.log("Limpando dados existentes...");
      
      // Deletar em ordem para respeitar foreign keys
      await supabase.from('goal_contributions').delete().eq('user_id', user.id);
      await supabase.from('goals').delete().eq('user_id', user.id);
      
      // Buscar IDs dos planos de parcelamento para deletar pagamentos
      const { data: existingInstallmentPlans } = await supabase
        .from('installment_plans')
        .select('id')
        .eq('user_id', user.id);
      
      if (existingInstallmentPlans && existingInstallmentPlans.length > 0) {
        const planIds = existingInstallmentPlans.map(p => p.id);
        for (const planId of planIds) {
          await supabase.from('installment_payments').delete().eq('installment_plan_id', planId);
        }
      }
      
      await supabase.from('installment_plans').delete().eq('user_id', user.id);
      await supabase.from('recurring_transactions').delete().eq('user_id', user.id);
      await supabase.from('budgets').delete().eq('user_id', user.id);
      await supabase.from('classification_patterns').delete().eq('user_id', user.id);
      await supabase.from('transactions').delete().eq('user_id', user.id);

      console.log("Dados existentes limpos. Criando novos dados...");

      // 1. Criar transações de exemplo
      const transactions = [
        // Receitas
        { amount: 5500.00, type: 'income' as const, category: 'Salário', description: 'Salário mensal', date: '2025-06-01', classification: null, planning_status: null },
        { amount: 800.00, type: 'income' as const, category: 'Freelance', description: 'Projeto extra', date: '2025-06-05', classification: null, planning_status: null },
        { amount: 150.00, type: 'income' as const, category: 'Investimentos', description: 'Dividendos', date: '2025-06-10', classification: null, planning_status: null },

        // Despesas fixas
        { amount: 1200.00, type: 'expense' as const, category: 'Moradia', description: 'Aluguel apartamento', date: '2025-06-01', classification: 'fixed' as const, planning_status: 'planned' as const },
        { amount: 150.00, type: 'expense' as const, category: 'Moradia', description: 'Condomínio', date: '2025-06-01', classification: 'fixed' as const, planning_status: 'planned' as const },
        { amount: 89.90, type: 'expense' as const, category: 'Assinaturas', description: 'Netflix', date: '2025-06-02', classification: 'fixed' as const, planning_status: 'planned' as const },
        { amount: 39.90, type: 'expense' as const, category: 'Assinaturas', description: 'Spotify', date: '2025-06-03', classification: 'fixed' as const, planning_status: 'planned' as const },

        // Despesas variáveis
        { amount: 450.00, type: 'expense' as const, category: 'Alimentação', description: 'Supermercado', date: '2025-06-02', classification: 'variable' as const, planning_status: 'planned' as const },
        { amount: 120.00, type: 'expense' as const, category: 'Transporte', description: 'Combustível', date: '2025-06-03', classification: 'variable' as const, planning_status: 'planned' as const },
        { amount: 85.50, type: 'expense' as const, category: 'Lazer', description: 'Cinema com amigos', date: '2025-06-04', classification: 'variable' as const, planning_status: 'planned' as const },
        { amount: 200.00, type: 'expense' as const, category: 'Alimentação', description: 'Delivery e restaurantes', date: '2025-06-05', classification: 'variable' as const, planning_status: 'unplanned' as const },
        { amount: 75.00, type: 'expense' as const, category: 'Saúde', description: 'Farmácia', date: '2025-06-14', classification: 'variable' as const, planning_status: 'unplanned' as const },
        { amount: 300.00, type: 'expense' as const, category: 'Compras', description: 'Roupas', date: '2025-06-15', classification: 'variable' as const, planning_status: 'unplanned' as const },
        { amount: 180.00, type: 'expense' as const, category: 'Alimentação', description: 'Supermercado semanal', date: '2025-06-16', classification: 'variable' as const, planning_status: 'planned' as const }
      ];

      const { error: transactionsError } = await supabase
        .from('transactions')
        .insert(
          transactions.map(t => ({
            user_id: user.id,
            amount: t.amount,
            type: t.type,
            category: t.category,
            description: t.description,
            transaction_date: t.date,
            classification: t.classification,
            planning_status: t.planning_status,
            is_auto_classified: true
          }))
        );

      if (transactionsError) throw transactionsError;

      // 2. Criar metas financeiras (apenas uma vez cada)
      const goals = [
        { name: 'Reserva de Emergência', target_amount: 20000.00, target_date: '2025-12-31' },
        { name: 'Viagem para Europa', target_amount: 15000.00, target_date: '2025-11-30' },
        { name: 'Entrada do Apartamento', target_amount: 50000.00, target_date: '2026-06-30' }
      ];

      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .insert(
          goals.map(g => ({
            user_id: user.id,
            name: g.name,
            target_amount: g.target_amount,
            current_amount: 0,
            target_date: g.target_date
          }))
        )
        .select();

      if (goalsError) throw goalsError;

      // 3. Criar contribuições para as metas (valores que não completam imediatamente)
      if (goalsData && goalsData.length > 0) {
        const contributions = [];
        
        // Reserva de Emergência - 42.5% do valor alvo
        const reservaGoal = goalsData.find(g => g.name === 'Reserva de Emergência');
        if (reservaGoal) {
          contributions.push(
            { goal_id: reservaGoal.id, amount: 2000.00, date: '2025-05-01' },
            { goal_id: reservaGoal.id, amount: 1500.00, date: '2025-05-15' },
            { goal_id: reservaGoal.id, amount: 2000.00, date: '2025-06-01' },
            { goal_id: reservaGoal.id, amount: 3000.00, date: '2025-06-10' }
          );
        }

        // Viagem para Europa - 28% do valor alvo
        const viagemGoal = goalsData.find(g => g.name === 'Viagem para Europa');
        if (viagemGoal) {
          contributions.push(
            { goal_id: viagemGoal.id, amount: 1000.00, date: '2025-05-05' },
            { goal_id: viagemGoal.id, amount: 800.00, date: '2025-05-20' },
            { goal_id: viagemGoal.id, amount: 1200.00, date: '2025-06-05' },
            { goal_id: viagemGoal.id, amount: 1200.00, date: '2025-06-12' }
          );
        }

        // Entrada do Apartamento - 24% do valor alvo
        const apartamentoGoal = goalsData.find(g => g.name === 'Entrada do Apartamento');
        if (apartamentoGoal) {
          contributions.push(
            { goal_id: apartamentoGoal.id, amount: 3000.00, date: '2025-05-01' },
            { goal_id: apartamentoGoal.id, amount: 2500.00, date: '2025-05-15' },
            { goal_id: apartamentoGoal.id, amount: 3000.00, date: '2025-06-01' },
            { goal_id: apartamentoGoal.id, amount: 3500.00, date: '2025-06-10' }
          );
        }

        const { error: contributionsError } = await supabase
          .from('goal_contributions')
          .insert(
            contributions.map(c => ({
              user_id: user.id,
              goal_id: c.goal_id,
              amount: c.amount,
              contribution_date: c.date
            }))
          );

        if (contributionsError) throw contributionsError;
      }

      // 4. Criar orçamentos
      const budgets = [
        // Junho 2025
        { category: 'Alimentação', amount: 800.00, year: 2025, month: 6 },
        { category: 'Transporte', amount: 300.00, year: 2025, month: 6 },
        { category: 'Lazer', amount: 400.00, year: 2025, month: 6 },
        { category: 'Compras', amount: 500.00, year: 2025, month: 6 },
        { category: 'Saúde', amount: 200.00, year: 2025, month: 6 },
        // Maio 2025
        { category: 'Alimentação', amount: 750.00, year: 2025, month: 5 },
        { category: 'Transporte', amount: 280.00, year: 2025, month: 5 },
        { category: 'Lazer', amount: 350.00, year: 2025, month: 5 },
        { category: 'Compras', amount: 400.00, year: 2025, month: 5 }
      ];

      const { error: budgetsError } = await supabase
        .from('budgets')
        .insert(
          budgets.map(b => ({
            user_id: user.id,
            category: b.category,
            amount: b.amount,
            year: b.year,
            month: b.month
          }))
        );

      if (budgetsError) throw budgetsError;

      // 5. Criar transações recorrentes
      const recurringTransactions = [
        { description: 'Salário mensal', amount: 5500.00, type: 'income' as const, category: 'Salário', frequency: 'monthly' as const },
        { description: 'Aluguel', amount: 1200.00, type: 'expense' as const, category: 'Moradia', frequency: 'monthly' as const },
        { description: 'Condomínio', amount: 150.00, type: 'expense' as const, category: 'Moradia', frequency: 'monthly' as const },
        { description: 'Netflix', amount: 89.90, type: 'expense' as const, category: 'Assinaturas', frequency: 'monthly' as const },
        { description: 'Spotify', amount: 39.90, type: 'expense' as const, category: 'Assinaturas', frequency: 'monthly' as const }
      ];

      const { error: recurringError } = await supabase
        .from('recurring_transactions')
        .insert(
          recurringTransactions.map(r => ({
            user_id: user.id,
            description: r.description,
            amount: r.amount,
            type: r.type,
            category: r.category,
            frequency: r.frequency,
            start_date: '2025-01-01',
            is_active: true,
            next_execution_date: '2025-07-01'
          }))
        );

      if (recurringError) throw recurringError;

      // 6. Criar planos de parcelamento
      const installmentPlanData = [
        { description: 'Notebook para trabalho', total_amount: 2400.00, installment_amount: 200.00, total_installments: 12, paid_installments: 6, category: 'Tecnologia' },
        { description: 'Curso online', total_amount: 1200.00, installment_amount: 100.00, total_installments: 12, paid_installments: 8, category: 'Educação' },
        { description: 'Móveis da sala', total_amount: 3600.00, installment_amount: 300.00, total_installments: 12, paid_installments: 12, category: 'Casa', is_active: false }
      ];

      const { error: installmentError } = await supabase
        .from('installment_plans')
        .insert(
          installmentPlanData.map(p => ({
            user_id: user.id,
            description: p.description,
            total_amount: p.total_amount,
            installment_amount: p.installment_amount,
            total_installments: p.total_installments,
            paid_installments: p.paid_installments,
            category: p.category,
            start_date: '2025-01-15',
            is_active: p.is_active !== false
          }))
        );

      if (installmentError) throw installmentError;

      // 7. Criar padrões de classificação
      const classificationPatterns = [
        { pattern_type: 'description', pattern_value: 'supermercado', classification: 'variable' as const, planning_status: 'planned' as const, confidence_score: 0.9 },
        { pattern_type: 'description', pattern_value: 'aluguel', classification: 'fixed' as const, planning_status: 'planned' as const, confidence_score: 0.95 },
        { pattern_type: 'category', pattern_value: 'Assinaturas', classification: 'fixed' as const, planning_status: 'planned' as const, confidence_score: 0.9 },
        { pattern_type: 'description', pattern_value: 'delivery', classification: 'variable' as const, planning_status: 'unplanned' as const, confidence_score: 0.85 }
      ];

      const { error: patternsError } = await supabase
        .from('classification_patterns')
        .insert(
          classificationPatterns.map(p => ({
            user_id: user.id,
            pattern_type: p.pattern_type,
            pattern_value: p.pattern_value,
            classification: p.classification,
            planning_status: p.planning_status,
            confidence_score: p.confidence_score
          }))
        );

      if (patternsError) throw patternsError;

      toast.success("🎉 Dados de demonstração criados com sucesso!", {
        description: "Explore todas as funcionalidades do Plenus com dados realistas."
      });

      setIsOpen(false);
      
      // Recarregar a página para mostrar os novos dados
      window.location.reload();

    } catch (error) {
      console.error('Erro ao popular dados:', error);
      toast.error("Erro ao criar dados de demonstração", {
        description: "Tente novamente ou entre em contato com o suporte."
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex gap-2">
      {/* Botão para criar dados demo */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Database className="h-4 w-4" />
            Dados Demo
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              Popular Dados de Demonstração
            </DialogTitle>
            <DialogDescription>
              Crie dados de exemplo para explorar todas as funcionalidades do Plenus
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert>
              <Database className="h-4 w-4" />
              <AlertDescription>
                Isso criará dados realistas incluindo:
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Transações variadas (receitas e despesas)</li>
                  <li>Metas financeiras com progresso</li>
                  <li>Orçamentos mensais</li>
                  <li>Transações recorrentes</li>
                  <li>Planos de parcelamento</li>
                  <li>Padrões de classificação inteligente</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              
              <Button
                onClick={populateDemoData}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Criar Dados
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Botão para limpar dados demo */}
      <Dialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2 text-amber-700 border-amber-300 hover:bg-amber-50">
            <RefreshCw className="h-4 w-4" />
            Limpar Demo
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-700">
              <Trash2 className="h-5 w-5" />
              Limpar Dados de Demonstração
            </DialogTitle>
            <DialogDescription>
              Remove todos os dados de exemplo para você começar fresh
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert className="border-amber-200 bg-amber-50">
              <RefreshCw className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>⚠️ Atenção:</strong> Esta ação removerá permanentemente:
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Todas as transações</li>
                  <li>Todas as metas e contribuições</li>
                  <li>Todos os orçamentos</li>
                  <li>Transações recorrentes</li>
                  <li>Planos de parcelamento</li>
                  <li>Padrões de classificação</li>
                </ul>
                <p className="mt-2 font-medium">Você poderá começar do zero com seus próprios dados!</p>
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsClearDialogOpen(false)}
                className="flex-1"
                disabled={isClearing}
              >
                Cancelar
              </Button>
              
              <Button
                onClick={clearAllDemoData}
                disabled={isClearing}
                variant="destructive"
                className="flex-1"
              >
                {isClearing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Limpando...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Sim, Limpar Tudo
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
