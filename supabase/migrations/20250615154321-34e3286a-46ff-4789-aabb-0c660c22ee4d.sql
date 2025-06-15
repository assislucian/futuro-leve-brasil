
-- Ativar RLS para a tabela de transações e adicionar política
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários podem gerenciar suas próprias transações"
  ON public.transactions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Ativar RLS para a tabela de metas e adicionar política
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários podem gerenciar suas próprias metas"
  ON public.goals FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Ativar RLS para a tabela de contribuições de metas e adicionar política
ALTER TABLE public.goal_contributions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários podem gerenciar suas contribuições de metas"
  ON public.goal_contributions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Ativar RLS para a tabela de orçamentos e adicionar política
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários podem gerenciar seus próprios orçamentos"
  ON public.budgets FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Ativar RLS para a tabela de perfis e adicionar políticas granulares
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Qualquer usuário autenticado pode ver perfis"
  ON public.profiles FOR SELECT
  USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários podem atualizar seus próprios perfis"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
