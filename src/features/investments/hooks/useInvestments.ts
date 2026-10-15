import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createInvestment,
  deleteInvestment,
  getInvestment,
  listInvestments,
  updateInvestment,
} from '@/features/investments/services/investmentService'
import type { InvestmentFilters, InvestmentInput } from '@/types/models'

export const investmentKeys = {
  all: ['investments'] as const,
  lists: () => [...investmentKeys.all, 'list'] as const,
  list: (filters: InvestmentFilters) => [...investmentKeys.lists(), filters] as const,
  details: () => [...investmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...investmentKeys.details(), id] as const,
}

export function useInvestments(filters: InvestmentFilters) {
  return useQuery({
    queryKey: investmentKeys.list(filters),
    queryFn: () => listInvestments(filters),
    // Keeps the previous rows on screen while a filter change refetches.
    placeholderData: (previous) => previous,
  })
}

export function useInvestment(id: string | undefined) {
  return useQuery({
    queryKey: investmentKeys.detail(id ?? ''),
    queryFn: () => getInvestment(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateInvestment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: InvestmentInput) => createInvestment(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: investmentKeys.all })
    },
  })
}

export function useUpdateInvestment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: InvestmentInput }) =>
      updateInvestment(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: investmentKeys.all })
    },
  })
}

export function useDeleteInvestment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteInvestment(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: investmentKeys.all })
    },
  })
}
