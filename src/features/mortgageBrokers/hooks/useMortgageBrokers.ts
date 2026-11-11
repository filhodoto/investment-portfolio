import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createMortgageBroker,
  deleteMortgageBroker,
  getMortgageBroker,
  listMortgageBrokers,
  updateMortgageBroker,
} from '@/features/mortgageBrokers/services/mortgageBrokerService'
import type { MortgageBrokerInput } from '@/types/models'

export const mortgageBrokerKeys = {
  all: ['mortgageBrokers'] as const,
  lists: () => [...mortgageBrokerKeys.all, 'list'] as const,
  list: () => [...mortgageBrokerKeys.lists()] as const,
  details: () => [...mortgageBrokerKeys.all, 'detail'] as const,
  detail: (id: string) => [...mortgageBrokerKeys.details(), id] as const,
}

export function useMortgageBrokers() {
  return useQuery({
    queryKey: mortgageBrokerKeys.list(),
    queryFn: listMortgageBrokers,
  })
}

export function useMortgageBroker(id: string | undefined) {
  return useQuery({
    queryKey: mortgageBrokerKeys.detail(id ?? ''),
    queryFn: () => getMortgageBroker(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateMortgageBroker() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: MortgageBrokerInput) => createMortgageBroker(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: mortgageBrokerKeys.all })
    },
  })
}

export function useUpdateMortgageBroker() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: MortgageBrokerInput }) =>
      updateMortgageBroker(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: mortgageBrokerKeys.all })
    },
  })
}

export function useDeleteMortgageBroker() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteMortgageBroker(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: mortgageBrokerKeys.all })
    },
  })
}
