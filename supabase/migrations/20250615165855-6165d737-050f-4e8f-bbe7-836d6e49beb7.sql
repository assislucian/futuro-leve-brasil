
-- Passo 1: Criar o "Bucket" de Armazenamento para Avatares
-- Este comando cria um local de armazenamento público chamado 'avatars' para as fotos de perfil.
-- Define um limite de tamanho de 5MB por arquivo e permite os formatos de imagem mais comuns.
-- ON CONFLICT DO NOTHING evita erros caso o bucket já exista.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Passo 2: Configurar Políticas de Segurança de Nível de Linha (RLS) para o Bucket
-- Estas políticas controlam quem pode acessar e modificar os arquivos no bucket 'avatars'.

-- Remove políticas existentes para evitar conflitos.
DROP POLICY IF EXISTS "Avatar images are publicly viewable" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete their own avatar" ON storage.objects;

-- Política para visualização de avatares:
-- Permite que qualquer pessoa (incluindo usuários não autenticados) veja os arquivos. Necessário para fotos de perfil públicas.
CREATE POLICY "Avatar images are publicly viewable"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- Política para upload de avatares:
-- Permite que usuários autenticados enviem arquivos para uma pasta com o seu próprio ID de usuário.
-- Isso impede que um usuário envie arquivos para a pasta de outro.
CREATE POLICY "Authenticated users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );

-- Política para atualização de avatares:
-- Permite que usuários autenticados atualizem arquivos dentro da sua própria pasta.
CREATE POLICY "Authenticated users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );

-- Política para exclusão de avatares:
-- Permite que usuários autenticados excluam arquivos da sua própria pasta.
CREATE POLICY "Authenticated users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );


-- Passo 3: Adicionar a coluna avatar_path à tabela de perfis
-- Esta coluna armazenará o caminho do arquivo do avatar, essencial para excluir avatares antigos ao enviar um novo.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_path TEXT;

-- Passo 4: Atualizar a função handle_new_user
-- Atualiza a função que é executada na criação de um novo usuário para incluir o novo campo avatar_path, se disponível nos metadados.
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, full_name, avatar_url, avatar_path)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'avatar_path');
  return new;
end;
$function$
