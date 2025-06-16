
-- Criar enum para frequência de recorrência
CREATE TYPE public.recurrence_frequency AS ENUM ('monthly', 'bimonthly', 'quarterly', 'semiannual', 'annual');

-- Criar tabela para transações recorrentes
CREATE TABLE public.recurring_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  type public.transaction_type NOT NULL,
  category TEXT NOT NULL,
  frequency public.recurrence_frequency NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  next_execution_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela para parcelas de financiamentos
CREATE TABLE public.installment_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  installment_amount NUMERIC(10, 2) NOT NULL,
  total_installments INTEGER NOT NULL,
  paid_installments INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'Financiamento',
  start_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela para histórico de parcelas pagas
CREATE TABLE public.installment_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  installment_plan_id UUID NOT NULL REFERENCES public.installment_plans(id) ON DELETE CASCADE,
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  installment_number INTEGER NOT NULL,
  payment_date DATE NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS para todas as tabelas
ALTER TABLE public.recurring_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installment_payments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para recurring_transactions
CREATE POLICY "Users can view their own recurring transactions"
  ON public.recurring_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recurring transactions"
  ON public.recurring_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recurring transactions"
  ON public.recurring_transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recurring transactions"
  ON public.recurring_transactions FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas RLS para installment_plans
CREATE POLICY "Users can view their own installment plans"
  ON public.installment_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own installment plans"
  ON public.installment_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own installment plans"
  ON public.installment_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own installment plans"
  ON public.installment_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas RLS para installment_payments
CREATE POLICY "Users can view their own installment payments"
  ON public.installment_payments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.installment_plans ip 
    WHERE ip.id = installment_plan_id AND ip.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own installment payments"
  ON public.installment_payments FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.installment_plans ip 
    WHERE ip.id = installment_plan_id AND ip.user_id = auth.uid()
  ));

-- Função para calcular próxima data de execução
CREATE OR REPLACE FUNCTION public.calculate_next_execution_date(
  current_date DATE,
  frequency public.recurrence_frequency
) RETURNS DATE AS $$
BEGIN
  CASE frequency
    WHEN 'monthly' THEN
      RETURN current_date + INTERVAL '1 month';
    WHEN 'bimonthly' THEN
      RETURN current_date + INTERVAL '2 months';
    WHEN 'quarterly' THEN
      RETURN current_date + INTERVAL '3 months';
    WHEN 'semiannual' THEN
      RETURN current_date + INTERVAL '6 months';
    WHEN 'annual' THEN
      RETURN current_date + INTERVAL '1 year';
    ELSE
      RETURN current_date + INTERVAL '1 month';
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar contador de parcelas pagas
CREATE OR REPLACE FUNCTION public.update_installment_plan_counter()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.installment_plans
    SET paid_installments = paid_installments + 1,
        updated_at = now()
    WHERE id = NEW.installment_plan_id;
    
    -- Desativar plano se todas as parcelas foram pagas
    UPDATE public.installment_plans
    SET is_active = false,
        updated_at = now()
    WHERE id = NEW.installment_plan_id AND paid_installments >= total_installments;
    
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar contador de parcelas
CREATE TRIGGER trigger_update_installment_counter
  AFTER INSERT ON public.installment_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_installment_plan_counter();
