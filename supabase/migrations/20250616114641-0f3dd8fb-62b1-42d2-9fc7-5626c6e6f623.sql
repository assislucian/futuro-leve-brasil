
-- Criar enum para tipos de gasto
CREATE TYPE public.expense_classification AS ENUM ('fixed', 'variable');
CREATE TYPE public.expense_planning AS ENUM ('planned', 'unplanned');

-- Adicionar colunas de classificação à tabela de transações
ALTER TABLE public.transactions 
ADD COLUMN classification public.expense_classification,
ADD COLUMN planning_status public.expense_planning,
ADD COLUMN is_auto_classified BOOLEAN DEFAULT true,
ADD COLUMN recurrence_pattern TEXT;

-- Criar tabela para padrões de classificação automática
CREATE TABLE public.classification_patterns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pattern_type TEXT NOT NULL, -- 'description', 'amount', 'category'
  pattern_value TEXT NOT NULL,
  classification public.expense_classification NOT NULL,
  planning_status public.expense_planning NOT NULL,
  confidence_score NUMERIC(3,2) DEFAULT 0.8,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS para classification_patterns
ALTER TABLE public.classification_patterns ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para classification_patterns
CREATE POLICY "Users can view their own classification patterns"
  ON public.classification_patterns FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own classification patterns"
  ON public.classification_patterns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own classification patterns"
  ON public.classification_patterns FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own classification patterns"
  ON public.classification_patterns FOR DELETE
  USING (auth.uid() = user_id);

-- Função para classificação automática de transações
CREATE OR REPLACE FUNCTION public.auto_classify_transaction()
RETURNS TRIGGER AS $$
DECLARE
  pattern_rec RECORD;
  detected_classification public.expense_classification;
  detected_planning public.expense_planning;
  is_recurring BOOLEAN DEFAULT false;
BEGIN
  -- Só classifica despesas automaticamente
  IF NEW.type != 'expense' THEN
    RETURN NEW;
  END IF;

  -- Verificar se existe padrão similar para este usuário
  FOR pattern_rec IN 
    SELECT classification, planning_status, confidence_score
    FROM public.classification_patterns 
    WHERE user_id = NEW.user_id 
    AND (
      (pattern_type = 'description' AND LOWER(NEW.description) LIKE '%' || LOWER(pattern_value) || '%') OR
      (pattern_type = 'category' AND NEW.category = pattern_value) OR
      (pattern_type = 'amount' AND ABS(NEW.amount - pattern_value::NUMERIC) < 50)
    )
    ORDER BY confidence_score DESC
    LIMIT 1
  LOOP
    detected_classification := pattern_rec.classification;
    detected_planning := pattern_rec.planning_status;
    EXIT;
  END LOOP;

  -- Se não encontrou padrão, usar regras básicas
  IF detected_classification IS NULL THEN
    -- Verificar se é gasto recorrente (mesmo valor e categoria nos últimos 3 meses)
    SELECT COUNT(*) > 2 INTO is_recurring
    FROM public.transactions
    WHERE user_id = NEW.user_id
    AND category = NEW.category
    AND ABS(amount - NEW.amount) < 10
    AND transaction_date >= (CURRENT_DATE - INTERVAL '3 months')
    AND transaction_date < NEW.transaction_date;

    -- Classificações básicas por categoria
    IF NEW.category IN ('Moradia', 'Financiamento', 'Seguros', 'Assinaturas') OR is_recurring THEN
      detected_classification := 'fixed';
      detected_planning := 'planned';
    ELSIF NEW.category IN ('Alimentação', 'Transporte', 'Lazer', 'Compras') THEN
      detected_classification := 'variable';
      -- Gastos grandes não planejados (acima de R$ 200)
      IF NEW.amount > 200 THEN
        detected_planning := 'unplanned';
      ELSE
        detected_planning := 'planned';
      END IF;
    ELSE
      detected_classification := 'variable';
      detected_planning := 'unplanned';
    END IF;
  END IF;

  -- Definir padrão de recorrência
  IF is_recurring THEN
    NEW.recurrence_pattern := 'monthly';
  END IF;

  NEW.classification := detected_classification;
  NEW.planning_status := detected_planning;
  NEW.is_auto_classified := true;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para classificação automática
CREATE TRIGGER trigger_auto_classify_transaction
  BEFORE INSERT ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_classify_transaction();

-- Função para criar padrões baseados em ajustes do usuário
CREATE OR REPLACE FUNCTION public.learn_from_user_adjustment()
RETURNS TRIGGER AS $$
BEGIN
  -- Se o usuário mudou a classificação, aprender o padrão
  IF OLD.classification != NEW.classification OR OLD.planning_status != NEW.planning_status THEN
    -- Criar padrão baseado na descrição
    INSERT INTO public.classification_patterns (user_id, pattern_type, pattern_value, classification, planning_status)
    VALUES (NEW.user_id, 'description', NEW.description, NEW.classification, NEW.planning_status)
    ON CONFLICT DO NOTHING;
    
    -- Marcar como não auto-classificado
    NEW.is_auto_classified := false;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para aprendizado
CREATE TRIGGER trigger_learn_from_adjustment
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.learn_from_user_adjustment();
