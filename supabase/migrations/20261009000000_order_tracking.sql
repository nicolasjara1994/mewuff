-- =============================================================================
-- MeWuff Studio · Seguimiento de pedidos
--
-- El cliente consulta el estado con el código legible (`custom_requests.reference`,
-- p. ej. "MW-7KD3QX") que recibió al enviar su solicitud. La consulta ocurre
-- siempre desde el servidor de Next.js (service_role); desde el navegador sigue
-- sin haber acceso directo a las tablas (RLS activado, sin políticas).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Datos de envío (opcionales; se completan cuando el pedido sale del taller)
-- ---------------------------------------------------------------------------
alter table public.custom_requests
  add column estimated_delivery     date,
  add column carrier                text check (carrier is null or char_length(carrier) between 2 and 60),
  add column carrier_tracking_code  text check (carrier_tracking_code is null or char_length(carrier_tracking_code) between 3 and 60);

comment on column public.custom_requests.estimated_delivery is 'Fecha estimada de entrega mostrada en la página de seguimiento.';
comment on column public.custom_requests.carrier is 'Empresa de transporte (visible para el cliente cuando el pedido está en camino).';
comment on column public.custom_requests.carrier_tracking_code is 'Código de seguimiento de la empresa de transporte.';

-- ---------------------------------------------------------------------------
-- Historial de estados: alimenta la línea de tiempo con la fecha de cada etapa
-- ---------------------------------------------------------------------------
create table public.request_status_events (
  id          bigint generated always as identity primary key,
  request_id  uuid not null references public.custom_requests (id) on delete cascade,
  status      public.request_status not null,
  created_at  timestamptz not null default now()
);

create index request_status_events_request_idx on public.request_status_events (request_id, created_at);

-- Registro automático: al crear la solicitud y cada vez que cambia su estado.
create or replace function public.record_request_status()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    insert into public.request_status_events (request_id, status) values (new.id, new.status);
  end if;
  return new;
end;
$$;

create trigger custom_requests_record_status
after insert or update of status on public.custom_requests
for each row execute function public.record_request_status();

-- Solicitudes existentes: un evento inicial con su estado actual.
insert into public.request_status_events (request_id, status, created_at)
select id, status, created_at from public.custom_requests;

-- ---------------------------------------------------------------------------
-- RLS + mínimo privilegio (igual que el resto de tablas)
-- ---------------------------------------------------------------------------
alter table public.request_status_events enable row level security;
revoke all on public.request_status_events from anon, authenticated;
