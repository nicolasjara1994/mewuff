-- =============================================================================
-- MeWuff Studio · Esquema inicial
--
-- Modelo de seguridad:
--   * El sitio NO usa la clave anon/publishable: todo acceso ocurre desde el
--     servidor de Next.js con la clave service_role (que ignora RLS).
--   * RLS está ACTIVADO en todas las tablas y no existen políticas para los
--     roles `anon` ni `authenticated` → desde el navegador no se puede leer ni
--     escribir nada, aunque alguien obtuviera la clave pública.
--   * Las fotos viven en un bucket PRIVADO; se ven mediante signed URLs temporales.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Tipos
-- ---------------------------------------------------------------------------
create type public.pet_type as enum ('perro', 'gato', 'conejo', 'ave', 'otro');

create type public.request_status as enum (
  'pending_review',
  'in_review',
  'quoted',
  'approved',
  'in_production',
  'shipped',
  'completed',
  'rejected',
  'cancelled'
);

-- ---------------------------------------------------------------------------
-- Solicitudes de figura personalizada
-- ---------------------------------------------------------------------------
create table public.custom_requests (
  id                      uuid primary key default gen_random_uuid(),
  reference               text not null unique check (reference ~ '^MW-[0-9A-Z]{6}$'),
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  customer_name           text not null check (char_length(customer_name) between 2 and 80),
  email                   text not null check (char_length(email) between 3 and 254 and position('@' in email) > 1),
  phone                   text check (phone is null or char_length(phone) between 7 and 30),
  pet_type                public.pet_type not null,
  pet_name                text not null check (char_length(pet_name) between 1 and 60),
  comments                text check (comments is null or char_length(comments) <= 1500),
  status                  public.request_status not null default 'pending_review',
  privacy_consent_at      timestamptz not null,
  privacy_policy_version  text not null check (char_length(privacy_policy_version) <= 40),
  ai_analysis             jsonb,
  ai_analyzed_at          timestamptz
);

comment on table public.custom_requests is 'Solicitudes de figuras personalizadas enviadas desde el sitio web.';
comment on column public.custom_requests.reference is 'Código legible entregado al cliente (no revela el UUID).';
comment on column public.custom_requests.ai_analysis is 'Resultado opcional del análisis de fotos con IA (PetPhotoAnalysis).';

create index custom_requests_created_at_idx on public.custom_requests (created_at desc);
create index custom_requests_status_idx on public.custom_requests (status);
create index custom_requests_email_idx on public.custom_requests (lower(email));

-- ---------------------------------------------------------------------------
-- Fotos asociadas (los binarios viven en Storage, aquí solo metadatos)
-- ---------------------------------------------------------------------------
create table public.request_photos (
  id            uuid primary key,
  request_id    uuid not null references public.custom_requests (id) on delete cascade,
  storage_path  text not null unique,
  mime_type     text not null check (mime_type in ('image/webp', 'image/jpeg', 'image/png')),
  size_bytes    integer not null check (size_bytes > 0 and size_bytes <= 10485760),
  width         integer not null check (width > 0),
  height        integer not null check (height > 0),
  position      smallint not null check (position between 0 and 19),
  created_at    timestamptz not null default now(),
  unique (request_id, position)
);

create index request_photos_request_id_idx on public.request_photos (request_id);

-- ---------------------------------------------------------------------------
-- updated_at automático
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger custom_requests_set_updated_at
before update on public.custom_requests
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Rate limiting (contador atómico de ventana fija, compartido entre instancias)
-- ---------------------------------------------------------------------------
create table public.rate_limits (
  key           text not null,
  window_start  timestamptz not null,
  count         integer not null default 0,
  primary key (key, window_start)
);

create or replace function public.consume_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_window timestamptz := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  v_count integer;
begin
  if p_limit < 1 or p_window_seconds < 1 or char_length(p_key) > 200 then
    raise exception 'invalid rate limit arguments';
  end if;

  insert into public.rate_limits as rl (key, window_start, count)
  values (p_key, v_window, 1)
  on conflict (key, window_start) do update set count = rl.count + 1
  returning rl.count into v_count;

  -- Limpieza ocasional de ventanas antiguas (~2% de las llamadas).
  if random() < 0.02 then
    delete from public.rate_limits where window_start < now() - interval '1 day';
  end if;

  return v_count <= p_limit;
end;
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security + mínimo privilegio
-- ---------------------------------------------------------------------------
alter table public.custom_requests enable row level security;
alter table public.request_photos  enable row level security;
alter table public.rate_limits     enable row level security;

-- Sin políticas para anon/authenticated = acceso denegado. Además se revocan
-- los privilegios por defecto como defensa en profundidad.
revoke all on public.custom_requests from anon, authenticated;
revoke all on public.request_photos  from anon, authenticated;
revoke all on public.rate_limits     from anon, authenticated;

revoke all on function public.consume_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_rate_limit(text, integer, integer) to service_role;

-- ---------------------------------------------------------------------------
-- Storage: bucket PRIVADO para fotos de mascotas
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('pet-photos', 'pet-photos', false, 10485760, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- No se crean políticas sobre storage.objects para este bucket: solo el
-- servidor (service_role) puede subir, leer o eliminar fotos.

-- ---------------------------------------------------------------------------
-- Futuro panel de administración (referencia, NO ejecutar todavía):
-- cuando exista autenticación de administradores, crear una tabla `admins`
-- y políticas del tipo:
--
--   create policy "admins pueden leer solicitudes" on public.custom_requests
--     for select to authenticated
--     using (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));
-- ---------------------------------------------------------------------------
