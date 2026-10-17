/** Shown instead of the app when the Supabase environment variables are missing. */
export function SetupNotice() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
        <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Connect your Supabase project
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          The app is running but has no credentials yet. Create a Supabase project, then copy{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">
            .env.example
          </code>{' '}
          to{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">
            .env.local
          </code>{' '}
          and fill in the two values.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-slate-100 ring-1 ring-slate-800">
          {`VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon public key>`}
        </pre>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          Then push the schema with{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">
            npm run db:push
          </code>{' '}
          and restart the dev server.
        </p>
      </div>
    </div>
  )
}
