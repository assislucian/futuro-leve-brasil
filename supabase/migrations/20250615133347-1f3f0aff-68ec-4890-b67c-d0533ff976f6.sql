
-- Cria a tabela para armazenar os perfis dos usuários
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  full_name text,
  avatar_url text,

  primary key (id)
);

-- Habilita a segurança em nível de linha para a tabela de perfis
alter table public.profiles enable row level security;

-- Permite que os usuários visualizem seus próprios perfis
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

-- Permite que os usuários atualizem seus próprios perfis
create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

-- Permite que os usuários insiram seus próprios perfis
create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Insere uma linha na tabela public.profiles para cada novo usuário
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

-- Dispara a função handle_new_user sempre que um novo usuário é criado na tabela auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
