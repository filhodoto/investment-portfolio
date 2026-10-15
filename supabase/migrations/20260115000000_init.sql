-- =============================================================================
-- Initial schema: real-estate investment filing system
-- =============================================================================
-- Every table is owned by the authenticated user (`user_id`) and protected by
-- Row Level Security. The frontend holds only the anon key, so the database is
-- the only place authorization can be enforced.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Shared: keep `updated_at` accurate
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- lawyers
-- -----------------------------------------------------------------------------
create table public.lawyers (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null check (length(trim(name)) > 0),
  email       text,
  phone       text,
  office      text,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.lawyers is 'Lawyers that can be associated with investments.';

create index lawyers_user_id_idx on public.lawyers (user_id);
create index lawyers_name_idx on public.lawyers (user_id, name);

create trigger lawyers_set_updated_at
  before update on public.lawyers
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- investments
-- -----------------------------------------------------------------------------
create table public.investments (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title             text not null check (length(trim(title)) > 0),
  address           text,
  city              text,
  country           text not null default 'Portugal',
  typology          text not null default 'T2'
    check (typology in ('T0','T1','T2','T3','T4','T5','T6','T7+','House','Land','Commercial','Other')),
  status            text not null default 'researching'
    check (status in ('researching','visiting','offer_made','due_diligence','purchased','sold','rejected')),
  asking_price      numeric(14,2) check (asking_price >= 0),
  purchase_price    numeric(14,2) check (purchase_price >= 0),
  expected_earnings numeric(14,2) check (expected_earnings >= 0),
  area_sqm          numeric(10,2) check (area_sqm > 0),
  lawyer_id         uuid references public.lawyers (id) on delete set null,
  source_url        text,
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table public.investments is 'Potential and acquired real-estate investments.';
comment on column public.investments.expected_earnings is 'Expected profit / earnings the investor aims to make on this deal.';

create index investments_user_id_idx     on public.investments (user_id);
create index investments_lawyer_id_idx   on public.investments (lawyer_id);
create index investments_status_idx      on public.investments (user_id, status);
create index investments_typology_idx    on public.investments (user_id, typology);
create index investments_city_idx        on public.investments (user_id, city);
create index investments_created_at_idx  on public.investments (user_id, created_at desc);

create trigger investments_set_updated_at
  before update on public.investments
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.lawyers     enable row level security;
alter table public.investments enable row level security;

-- lawyers: full CRUD, restricted to the owning user
create policy "lawyers_select_own" on public.lawyers
  for select to authenticated using (auth.uid() = user_id);

create policy "lawyers_insert_own" on public.lawyers
  for insert to authenticated with check (auth.uid() = user_id);

create policy "lawyers_update_own" on public.lawyers
  for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "lawyers_delete_own" on public.lawyers
  for delete to authenticated using (auth.uid() = user_id);

-- investments: full CRUD, restricted to the owning user.
-- The `with check` also guarantees you can only link a lawyer you own.
create policy "investments_select_own" on public.investments
  for select to authenticated using (auth.uid() = user_id);

create policy "investments_insert_own" on public.investments
  for insert to authenticated
  with check (
    auth.uid() = user_id
    and (
      lawyer_id is null
      or exists (
        select 1 from public.lawyers l
        where l.id = investments.lawyer_id and l.user_id = auth.uid()
      )
    )
  );

create policy "investments_update_own" on public.investments
  for update to authenticated
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and (
      lawyer_id is null
      or exists (
        select 1 from public.lawyers l
        where l.id = investments.lawyer_id and l.user_id = auth.uid()
      )
    )
  );

create policy "investments_delete_own" on public.investments
  for delete to authenticated using (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- Privileges (Supabase grants these by default; explicit here so migrations are
-- portable and `anon` can never touch the tables).
-- -----------------------------------------------------------------------------
revoke all on public.lawyers, public.investments from anon;
grant select, insert, update, delete on public.lawyers, public.investments to authenticated;
grant all on public.lawyers, public.investments to service_role;
