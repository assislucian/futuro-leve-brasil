
-- Drop de todas as políticas de RLS existentes para limpar a base
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Usuários podem gerenciar suas próprias transações" ON public.transactions;

DROP POLICY IF EXISTS "Usuários podem ver suas próprias metas" ON public.goals;
DROP POLICY IF EXISTS "Usuários podem criar suas próprias metas" ON public.goals;
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias metas" ON public.goals;
DROP POLICY IF EXISTS "Usuários podem deletar suas próprias metas" ON public.goals;
DROP POLICY IF EXISTS "Usuários podem gerenciar suas próprias metas" ON public.goals;

DROP POLICY IF EXISTS "Usuários podem ver suas contribuições" ON public.goal_contributions;
DROP POLICY IF EXISTS "Usuários podem criar contribuições para suas metas" ON public.goal_contributions;
DROP POLICY IF EXISTS "Usuários podem atualizar suas contribuições" ON public.goal_contributions;
DROP POLICY IF EXISTS "Usuários podem deletar suas contribuições" ON public.goal_contributions;
DROP POLICY IF EXISTS "Usuários podem gerenciar suas contribuições de metas" ON public.goal_contributions;

DROP POLICY IF EXISTS "Usuários podem ver seus próprios orçamentos" ON public.budgets;
DROP POLICY IF EXISTS "Usuários podem criar seus próprios orçamentos" ON public.budgets;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios orçamentos" ON public.budgets;
DROP POLICY IF EXISTS "Usuários podem deletar seus próprios orçamentos" ON public.budgets;
DROP POLICY IF EXISTS "Usuários podem gerenciar seus próprios orçamentos" ON public.budgets;

DROP POLICY IF EXISTS "Qualquer usuário autenticado pode ver perfis" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON public.profiles;

-- Recriação das políticas de forma unificada e correta
CREATE POLICY "Usuários podem gerenciar suas próprias transações"
  ON public.transactions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem gerenciar suas próprias metas"
  ON public.goals FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Usuários podem gerenciar suas contribuições de metas"
  ON public.goal_contributions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem gerenciar seus próprios orçamentos"
  ON public.budgets FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem ver perfis"
  ON public.profiles FOR SELECT
  USING (auth.role() = 'authenticated');
  
CREATE POLICY "Usuários podem atualizar seus próprios perfis"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
