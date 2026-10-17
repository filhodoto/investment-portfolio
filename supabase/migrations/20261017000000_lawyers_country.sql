-- =============================================================================
-- Lawyers: add a country
-- =============================================================================
-- Additive migration: `user_id` and the RLS policies from the initial migration
-- are untouched, so this is safe to apply on top of an existing database.
-- =============================================================================

alter table public.lawyers
  add column country text;

comment on column public.lawyers.country is 'Country where the lawyer practises.';

-- Supports the "filter lawyers by country" dropdown.
create index lawyers_country_idx on public.lawyers (user_id, country);
