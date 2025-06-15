
-- Cria um tipo personalizado para classificar as transações
CREATE TYPE public.transaction_type AS ENUM ('income', 'expense');

-- Cria a tabela para armazenar as transações financeiras
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  type public.transaction_type NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilita a Segurança em Nível de Linha (RLS) para a tabela de transações
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Política: Permite que usuários visualizem apenas suas próprias transações
CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Permite que usuários insiram suas próprias transações
CREATE POLICY "Users can insert their own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Permite que usuários atualizem suas próprias transações
CREATE POLICY "Users can update their own transactions"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = user_id);

-- Política: Permite que usuários deletem suas próprias transações
CREATE POLICY "Users can delete their own transactions"
  ON public.transactions FOR DELETE
  USING (auth.uid() = user_id);
