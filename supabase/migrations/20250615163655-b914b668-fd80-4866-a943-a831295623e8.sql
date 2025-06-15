
-- Adiciona uma coluna para rastrear quando a conclusão de uma meta foi celebrada
ALTER TABLE public.goals
ADD COLUMN celebrated_at TIMESTAMP WITH TIME ZONE;

-- Adiciona um comentário para explicar o propósito da nova coluna
COMMENT ON COLUMN public.goals.celebrated_at IS 'Timestamp para quando a conclusão da meta foi celebrada, para evitar notificações repetidas.';
