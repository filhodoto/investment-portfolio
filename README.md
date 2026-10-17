# Gonçalo Investments

A lightweight SPA for filing and tracking real-estate investments — properties, their costs
and expected earnings, the lawyers attached to them, and filtering across the whole set.

There is **no custom backend**. The React app talks straight to Supabase (Postgres + Auth), and
all authorization is enforced by Row Level Security policies in the database.

## Stack

| Concern | Choice |
| --- | --- |
| Build tool | Vite + React 19 + TypeScript |
| Styling | Tailwind CSS v4 (CSS-first config, Vite plugin) |
| Routing | React Router |
| Server state | TanStack React Query |
| Backend / DB | Supabase (PostgREST + Postgres RLS + Auth) |
| Schema | Supabase CLI migrations in `supabase/migrations/` |

## Architecture

```
Browser (SPA)
  pages/ ─────▶ features/<domain>/{components,hooks,services} ─────▶ lib/supabaseClient
                                  │
                                  └─▶ React Query cache
                                              │
                                              ▼  HTTPS (anon key, RLS-enforced)
                                    Supabase: Auth · PostgREST · Postgres
```

- **`lib/`** — infrastructure only: the single Supabase client, env validation, query client, utils.
- **`features/<domain>/services/`** — thin typed wrappers around Supabase queries. No React.
- **`features/<domain>/hooks/`** — React Query hooks that own the data lifecycle (`useInvestments`,
  `useLawyers`, and their mutations).
- **`features/<domain>/components/`** — domain UI (forms, tables, filter bar, badges).
- **`components/ui/`** — presentational primitives (Button, Input, Select, Modal, Card, …).
- **`pages/`** — thin route-level composition.
- **Auth state** lives in a React context (`features/auth/AuthProvider.tsx`), never in React Query.
- **Theme state** lives in `features/theme/` (context + `localStorage`), never in React Query.
- Query keys are namespaced (`['investments', 'list', filters]`); mutations invalidate the domain
  they touch, and the cache is cleared on sign-out.

Authorization is **never** enforced in the frontend. The anon key is public by design; every table
has RLS policies scoping rows to `auth.uid() = user_id`.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

Create a project at [supabase.com](https://supabase.com), then open
**Project Settings → API** and copy the **Project URL** and **anon public key**.

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon public key>
```

> Only `VITE_`-prefixed variables reach the browser. Never put the `service_role` key here.
>
> If these are missing the app renders a setup screen instead of crashing.

### 4. Push the database schema

The schema (tables, indexes, `updated_at` triggers and all RLS policies) lives in
[`supabase/migrations/20260115000000_init.sql`](supabase/migrations/20260115000000_init.sql).

**Option A — link and push (recommended):**

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npm run db:push
```

**Option B — paste into the dashboard:** open the Supabase SQL editor, paste the contents of the
migration file and run it.

### 5. Enable authentication

In the dashboard go to **Authentication → Sign In / Providers** and make sure **Email** is enabled.
For quick local testing you can turn off "Confirm email" under **Authentication → Settings**;
otherwise each new account must confirm its address before signing in.

### 6. Run it

```bash
npm run dev
```

Open the printed URL, create an account, and you are in.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Typecheck (`tsc -b`) and build for production |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | Typecheck only |
| `npm run lint` | Lint with oxlint |
| `npm run db:push` | Push migrations to the linked Supabase project |
| `npm run db:start` / `db:reset` | Run the local Supabase stack (requires Docker) |
| `npm run db:types` | Regenerate `src/types/database.types.ts` from the **linked** project |

> The project uses **pnpm** (`pnpm-lock.yaml`, `pnpm-workspace.yaml`). `pnpm run <script>` or
> `pnpm <script>` works for every entry above.

## Features

- **Dark mode** — Light/Dark switcher pinned to the bottom of the navigation. The choice is stored
  in `localStorage` under `goncalo-investments:theme`; when that key is absent the app follows the
  operating system preference, live. An inline script in `index.html` applies the theme before first
  paint so there is no flash. Tailwind's class strategy is enabled with
  `@custom-variant dark (&:where(.dark, .dark *));` in `src/styles/globals.css`.
- **Investments** — filter by free text, status, typology, lawyer and **asking-price range**; sort by
  clicking the *Asking*, *Expected* or *Added* column headers. Filtering and sorting are pushed to
  Postgres (they are part of the React Query key).
- **Lawyers** — directory with name/email/phone/office search and a **country** filter, plus a
  per-lawyer count of linked deals.

## Data model

**`lawyers`** — `name` (required), `email`, `phone`, `office`, `country` (nullable), `notes`.

**`investments`** — `title` (required), `address`, `city`, `country`, `typology`
(`T0`–`T7+`, `House`, `Land`, `Commercial`, `Other`), `status`
(`researching` → `visiting` → `offer_made` → `due_diligence` → `purchased` / `sold` / `rejected`),
`asking_price`, `purchase_price`, `expected_earnings`, `area_sqm`, `lawyer_id`, `source_url`, `notes`.

Deleting a lawyer sets the investment's `lawyer_id` to `NULL` — the deal keeps its details.

### Migrations

| File | Contents |
| --- | --- |
| `20260115000000_init.sql` | Tables, indexes, `updated_at` triggers, RLS policies |
| `20261017000000_lawyers_country.sql` | Adds nullable `lawyers.country` + index (additive) |

### Adding a migration later

```bash
npx supabase migration new <name>   # creates supabase/migrations/<timestamp>_<name>.sql
npm run db:push
```

## Notes & next steps

- The generated `Database` type is wired into `createClient<Database>(...)` in
  `src/lib/supabaseClient.ts`, so table names and column shapes are checked at compile time.
  Regenerate it after every migration with `npm run db:types` (the project must be linked:
  `npx supabase link --project-ref <ref>`).
- The production bundle is a single ~570 kB chunk (~163 kB gzipped), dominated by
  `@supabase/supabase-js`. If it matters later, lazy-load the feature routes with
  `React.lazy`/`import()`.
- Realtime is not wired up. If you want live updates across devices, subscribe to table changes in
  `features/investments/hooks/` and call `queryClient.invalidateQueries`.
- ⚠️ The `.history/` folder (VS Code Local History) contains stale copies of `.env.local`, including
  your Supabase credentials. It is now gitignored — consider clearing it if the repo is ever shared.
