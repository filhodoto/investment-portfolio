-- =============================================================================
-- Mortgage brokers: a reference directory, mirroring `lawyers`
-- =============================================================================
-- Additive migration: `user_id` and RLS follow the same shape as the other
-- tables, so the frontend only ever sees rows it owns.
-- =============================================================================

create table public.mortgage_brokers (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null check (length(trim(name)) > 0),
  website     text,
  country     text,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.mortgage_brokers is 'Mortgage brokers that can be used to finance investments.';

create index mortgage_brokers_user_id_idx  on public.mortgage_brokers (user_id);
create index mortgage_brokers_name_idx     on public.mortgage_brokers (user_id, name);
create index mortgage_brokers_country_idx  on public.mortgage_brokers (user_id, country);

create trigger mortgage_brokers_set_updated_at
  before update on public.mortgage_brokers
  for each row execute function public.set_updated_at();

alter table public.mortgage_brokers enable row level security;

create policy "mortgage_brokers_select_own" on public.mortgage_brokers
  for select to authenticated using (auth.uid() = user_id);

create policy "mortgage_brokers_insert_own" on public.mortgage_brokers
  for insert to authenticated with check (auth.uid() = user_id);

create policy "mortgage_brokers_update_own" on public.mortgage_brokers
  for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "mortgage_brokers_delete_own" on public.mortgage_brokers
  for delete to authenticated using (auth.uid() = user_id);

revoke all on public.mortgage_brokers from anon;
grant select, insert, update, delete on public.mortgage_brokers to authenticated;
grant all on public.mortgage_brokers to service_role;
