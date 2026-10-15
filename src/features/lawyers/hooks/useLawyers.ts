import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createLawyer,
  deleteLawyer,
  getLawyer,
  listLawyers,
  updateLawyer,
} from '@/features/lawyers/services/lawyerService'
import { investmentKeys } from '@/features/investments/hooks/useInvestments'
import type { LawyerInput } from '@/types/models'

export const lawyerKeys = {
  all: ['lawyers'] as const,
  lists: () => [...lawyerKeys.all, 'list'] as const,
  list: () => [...lawyerKeys.lists()] as const,
  details: () => [...lawyerKeys.all, 'detail'] as const,
  detail: (id: string) => [...lawyerKeys.details(), id] as const,
}

export function useLawyers() {
  return useQuery({
    queryKey: lawyerKeys.list(),
    queryFn: listLawyers,
  })
}

export function useLawyer(id: string | undefined) {
  return useQuery({
    queryKey: lawyerKeys.detail(id ?? ''),
    queryFn: () => getLawyer(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateLawyer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: LawyerInput) => createLawyer(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: lawyerKeys.all })
    },
  })
}

export function useUpdateLawyer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: LawyerInput }) => updateLawyer(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: lawyerKeys.all })
      // Embedded lawyer names on investments are now stale.
      void queryClient.invalidateQueries({ queryKey: investmentKeys.all })
    },
  })
}

export function useDeleteLawyer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteLawyer(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: lawyerKeys.all })
      void queryClient.invalidateQueries({ queryKey: investmentKeys.all })
    },
  })
}
