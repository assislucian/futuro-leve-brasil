
-- Cria um tipo enum para os planos de assinatura, para garantir consistência.
CREATE TYPE public.app_plan AS ENUM ('free', 'premium');

-- Adiciona a coluna 'plan' à tabela de perfis de usuário.
-- Por padrão, todo novo usuário começa no plano 'free'.
ALTER TABLE public.profiles
ADD COLUMN plan public.app_plan NOT NULL DEFAULT 'free';

-- Cria uma função para verificar o limite de metas para usuários do plano 'free'.
-- Esta função será acionada antes de uma nova meta ser criada.
CREATE OR REPLACE FUNCTION public.check_goal_limit()
RETURNS TRIGGER AS $$
DECLARE
  goal_count INTEGER;
  user_plan public.app_plan;
BEGIN
  -- Obtém o plano do usuário a partir da tabela de perfis
  SELECT plan INTO user_plan FROM public.profiles WHERE id = NEW.user_id;

  -- Se o usuário estiver no plano 'free', verifica o número de metas existentes
  IF user_plan = 'free' THEN
    SELECT count(*) INTO goal_count FROM public.goals WHERE user_id = NEW.user_id;
    -- Se o limite de 2 metas for atingido, a operação é bloqueada com uma mensagem de erro.
    IF goal_count >= 2 THEN
      RAISE EXCEPTION 'Limite de 2 metas atingido. Faça upgrade para o plano Premium para criar metas ilimitadas.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cria o gatilho (trigger) que executa a função de verificação na tabela 'goals'
CREATE TRIGGER check_goal_limit_before_insert
BEFORE INSERT ON public.goals
FOR EACH ROW EXECUTE FUNCTION public.check_goal_limit();

-- Cria uma função para restringir a criação de orçamentos apenas a usuários 'premium'.
CREATE OR REPLACE FUNCTION public.check_budget_permission()
RETURNS TRIGGER AS $$
DECLARE
  user_plan public.app_plan;
BEGIN
  -- Obtém o plano do usuário
  SELECT plan INTO user_plan FROM public.profiles WHERE id = NEW.user_id;

  -- Se o usuário não for 'premium', bloqueia a criação do orçamento.
  IF user_plan <> 'premium' THEN
    RAISE EXCEPTION 'A criação de orçamentos é uma funcionalidade exclusiva do plano Premium.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cria o gatilho (trigger) que executa a verificação de permissão na tabela 'budgets'
CREATE TRIGGER check_budget_permission_before_insert
BEFORE INSERT ON public.budgets
FOR EACH ROW EXECUTE FUNCTION public.check_budget_permission();

-- Adiciona comentários para clareza no esquema do banco de dados
COMMENT ON COLUMN public.profiles.plan IS 'Plano de assinatura do usuário (free ou premium)';
COMMENT ON FUNCTION public.check_goal_limit IS 'Verifica se um usuário do plano "free" atingiu o limite de 2 metas antes de permitir a inserção de uma nova meta.';
COMMENT ON FUNCTION public.check_budget_permission IS 'Garante que apenas usuários do plano "premium" podem criar orçamentos.';
