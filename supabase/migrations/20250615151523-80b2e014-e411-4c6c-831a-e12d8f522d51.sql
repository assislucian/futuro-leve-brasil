
-- Tabela para armazenar os orçamentos mensais dos usuários
CREATE TABLE public.budgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  year INT NOT NULL,
  month INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_budget_per_category_month UNIQUE(user_id, category, year, month)
);

-- Habilita a Segurança em Nível de Linha (RLS)
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para a tabela de orçamentos
CREATE POLICY "Usuários podem ver seus próprios orçamentos"
  ON public.budgets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios orçamentos"
  ON public.budgets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios orçamentos"
  ON public.budgets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios orçamentos"
  ON public.budgets FOR DELETE
  USING (auth.uid() = user_id);

-- Comentários para clareza
COMMENT ON TABLE public.budgets IS 'Armazena os orçamentos mensais por categoria para cada usuário.';
COMMENT ON COLUMN public.budgets.category IS 'A categoria de despesa para este orçamento (ex: Alimentação, Transporte).';
COMMENT ON COLUMN public.budgets.amount IS 'O valor máximo planejado para gastar na categoria no mês/ano.';
COMMENT ON COLUMN public.budgets.year IS 'O ano do orçamento (ex: 2025).';
COMMENT ON COLUMN public.budgets.month IS 'O mês do orçamento (1 para Janeiro, 12 para Dezembro).';
