-- Investments: support filtering by country.
-- `country` already exists on the table; this index keeps the new dropdown's
-- server-side equality filter (and the distinct-country query) cheap.
create index investments_country_idx on public.investments (user_id, country);
