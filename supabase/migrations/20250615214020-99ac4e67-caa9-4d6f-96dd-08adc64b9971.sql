
-- Adiciona a coluna para controlar o fim do período de teste (trial).
ALTER TABLE public.profiles
ADD COLUMN trial_ends_at TIMESTAMP WITH TIME ZONE;

-- Comentário para clareza no schema.
COMMENT ON COLUMN public.profiles.trial_ends_at IS 'Data e hora em que o período de teste (trial) do usuário termina.';

-- Substitui a função que cria um novo perfil de usuário.
-- Agora, todo novo usuário receberá um período de teste de 7 dias.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, avatar_path, plan, trial_ends_at)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'avatar_path',
    'free', -- O plano base do usuário continua sendo 'free'.
    now() + interval '7 days' -- Define o fim do período de teste para 7 dias no futuro.
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentário para clareza.
COMMENT ON FUNCTION public.handle_new_user IS 'Cria um perfil para um novo usuário, definindo um período de teste de 7 dias.';

-- Garante que o gatilho (trigger) que executa a função acima existe e está ativo.
-- Ele é acionado sempre que um novo usuário é criado na tabela 'auth.users'.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Atualiza a regra que verifica o limite de metas.
-- Agora, a regra permite metas ilimitadas se o usuário estiver no período de teste.
CREATE OR REPLACE FUNCTION public.check_goal_limit()
RETURNS TRIGGER AS $$
DECLARE
  goal_count INTEGER;
  user_plan public.app_plan;
  trial_ends_at_time TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Obtém o plano e a data de término do teste do usuário.
  SELECT plan, trial_ends_at INTO user_plan, trial_ends_at_time FROM public.profiles WHERE id = NEW.user_id;

  -- Se o teste ainda estiver ativo, permite a criação da meta sem restrições.
  IF trial_ends_at_time IS NOT NULL AND trial_ends_at_time > now() THEN
    RETURN NEW;
  END IF;

  -- Se o teste acabou e o plano é 'free', aplica a restrição de 2 metas.
  IF user_plan = 'free' THEN
    SELECT count(*) INTO goal_count FROM public.goals WHERE user_id = NEW.user_id;
    IF goal_count >= 2 THEN
      RAISE EXCEPTION 'Seu período de teste Premium terminou. O limite de 2 metas foi atingido. Faça upgrade para criar metas ilimitadas.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atualiza a regra que verifica a permissão para criar orçamentos.
-- Agora, permite a criação se o usuário estiver no período de teste.
CREATE OR REPLACE FUNCTION public.check_budget_permission()
RETURNS TRIGGER AS $$
DECLARE
  user_plan public.app_plan;
  trial_ends_at_time TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Obtém o plano e a data de término do teste do usuário.
  SELECT plan, trial_ends_at INTO user_plan, trial_ends_at_time FROM public.profiles WHERE id = NEW.user_id;

  -- Se o teste ainda estiver ativo, permite a criação do orçamento.
  IF trial_ends_at_time IS NOT NULL AND trial_ends_at_time > now() THEN
    RETURN NEW;
  END IF;

  -- Se o teste acabou e o plano não é 'premium', bloqueia a criação.
  IF user_plan <> 'premium' THEN
    RAISE EXCEPTION 'Seu período de teste Premium terminou. A criação de orçamentos é uma funcionalidade exclusiva do plano Premium.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
