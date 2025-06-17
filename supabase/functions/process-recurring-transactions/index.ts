
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface RecurringTransaction {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  frequency: 'monthly' | 'bimonthly' | 'quarterly' | 'semiannual' | 'annual';
  next_execution_date: string;
  end_date?: string;
  is_active: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🔄 Iniciando processamento de transações recorrentes...");
    
    const today = new Date().toISOString().split('T')[0];
    
    // Buscar transações recorrentes que devem ser executadas hoje
    const { data: recurringTransactions, error: fetchError } = await supabase
      .from('recurring_transactions')
      .select('*')
      .eq('is_active', true)
      .lte('next_execution_date', today)
      .or(`end_date.is.null,end_date.gte.${today}`);

    if (fetchError) {
      console.error("Erro ao buscar transações recorrentes:", fetchError);
      throw fetchError;
    }

    console.log(`📊 Encontradas ${recurringTransactions?.length || 0} transações para processar`);

    const processedTransactions = [];
    const incomeNotifications = [];

    for (const recurring of recurringTransactions || []) {
      try {
        // Criar a transação automaticamente
        const { data: newTransaction, error: insertError } = await supabase
          .from('transactions')
          .insert({
            user_id: recurring.user_id,
            description: `${recurring.description} (Automático)`,
            amount: recurring.amount,
            type: recurring.type,
            category: recurring.category,
            transaction_date: today,
            classification: recurring.type === 'expense' ? 'fixed' : null,
            planning_status: 'planned',
            is_auto_classified: true,
            recurrence_pattern: recurring.frequency
          })
          .select()
          .single();

        if (insertError) {
          console.error(`Erro ao criar transação para ${recurring.description}:`, insertError);
          continue;
        }

        // Calcular próxima data de execução
        const nextDate = calculateNextExecutionDate(new Date(recurring.next_execution_date), recurring.frequency);
        
        // Atualizar a próxima data de execução
        const { error: updateError } = await supabase
          .from('recurring_transactions')
          .update({ 
            next_execution_date: nextDate.toISOString().split('T')[0],
            updated_at: new Date().toISOString()
          })
          .eq('id', recurring.id);

        if (updateError) {
          console.error(`Erro ao atualizar recorrência ${recurring.id}:`, updateError);
        }

        processedTransactions.push({
          id: newTransaction.id,
          type: recurring.type,
          description: recurring.description,
          amount: recurring.amount
        });

        // Se for receita, adicionar à lista de notificações
        if (recurring.type === 'income') {
          incomeNotifications.push({
            user_id: recurring.user_id,
            description: recurring.description,
            amount: recurring.amount,
            transaction_id: newTransaction.id
          });
        }

        console.log(`✅ Processada: ${recurring.description} - R$ ${recurring.amount}`);
        
      } catch (error) {
        console.error(`Erro ao processar transação ${recurring.id}:`, error);
      }
    }

    // Criar notificações discretas para receitas
    if (incomeNotifications.length > 0) {
      const { error: notificationError } = await supabase
        .from('income_confirmations')
        .insert(
          incomeNotifications.map(notification => ({
            user_id: notification.user_id,
            transaction_id: notification.transaction_id,
            description: notification.description,
            amount: notification.amount,
            status: 'pending',
            created_at: new Date().toISOString()
          }))
        );

      if (notificationError) {
        console.error("Erro ao criar notificações de receita:", notificationError);
      }
    }

    console.log(`🎯 Processamento concluído: ${processedTransactions.length} transações criadas`);

    return new Response(
      JSON.stringify({
        success: true,
        processed: processedTransactions.length,
        incomeNotifications: incomeNotifications.length,
        transactions: processedTransactions
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error("Erro no processamento de recorrências:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

function calculateNextExecutionDate(currentDate: Date, frequency: string): Date {
  const nextDate = new Date(currentDate);
  
  switch (frequency) {
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'bimonthly':
      nextDate.setMonth(nextDate.getMonth() + 2);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'semiannual':
      nextDate.setMonth(nextDate.getMonth() + 6);
      break;
    case 'annual':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    default:
      nextDate.setMonth(nextDate.getMonth() + 1);
  }
  
  return nextDate;
}

serve(handler);
