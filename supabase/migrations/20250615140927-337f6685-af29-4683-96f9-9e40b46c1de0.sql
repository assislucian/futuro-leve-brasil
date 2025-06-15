
-- 1. Criar a tabela para armazenar as metas dos usuários
CREATE TABLE public.goals (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    target_amount numeric NOT NULL CHECK (target_amount > 0),
    current_amount numeric NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
    target_date date NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar segurança em nível de linha
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- 2. Políticas de Segurança para a tabela de metas
CREATE POLICY "Usuários podem ver suas próprias metas" ON public.goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem criar suas próprias metas" ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar suas próprias metas" ON public.goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem deletar suas próprias metas" ON public.goals FOR DELETE USING (auth.uid() = user_id);

-- 3. Criar a tabela para armazenar as contribuições para cada meta
CREATE TABLE public.goal_contributions (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    goal_id uuid NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount numeric NOT NULL CHECK (amount > 0),
    contribution_date date NOT NULL DEFAULT CURRENT_DATE,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar segurança em nível de linha
ALTER TABLE public.goal_contributions ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Segurança para a tabela de contribuições
CREATE POLICY "Usuários podem ver suas contribuições" ON public.goal_contributions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem criar contribuições para suas metas" ON public.goal_contributions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar suas contribuições" ON public.goal_contributions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem deletar suas contribuições" ON public.goal_contributions FOR DELETE USING (auth.uid() = user_id);

-- 5. Função para atualizar o valor atual da meta automaticamente
CREATE OR REPLACE FUNCTION public.update_goal_current_amount()
RETURNS TRIGGER AS $$
DECLARE
  v_goal_id UUID;
BEGIN
  -- Determina o goal_id da linha antiga ou nova
  IF (TG_OP = 'DELETE') THEN
    v_goal_id := OLD.goal_id;
  ELSE
    v_goal_id := NEW.goal_id;
  END IF;

  -- Recalcula e atualiza o current_amount para a meta afetada
  UPDATE public.goals
  SET current_amount = (
    SELECT COALESCE(SUM(amount), 0)
    FROM public.goal_contributions
    WHERE goal_id = v_goal_id
  )
  WHERE id = v_goal_id;

  -- Retorna a linha apropriada
  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Gatilho (Trigger) para executar a função quando uma contribuição for adicionada, alterada ou removida
CREATE TRIGGER on_goal_contribution_change
AFTER INSERT OR UPDATE OR DELETE ON public.goal_contributions
FOR EACH ROW EXECUTE FUNCTION public.update_goal_current_amount();
