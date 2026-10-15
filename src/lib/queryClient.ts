import { QueryClient } from '@tanstack/react-query'

/**
 * All data that comes from Supabase lives in React Query.
 * Tuned for an internal tool: cached a bit, refetched on demand.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})
