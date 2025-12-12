import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import negotiationService, { 
  Negotiation, 
  CreateNegotiationPayload, 
  UpdateNegotiationPayload 
} from '@/services/negotiation.service'

/**
 * Get all negotiations for current user
 */
export function useNegotiations(options?: UseQueryOptions<Negotiation[], Error>) {
  return useQuery<Negotiation[], Error>({
    queryKey: ['negotiations'],
    queryFn: negotiationService.getNegotiationsByUser,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  })
}

/**
 * Get single negotiation detail
 */
export function useNegotiationDetail(id: string, options?: UseQueryOptions<Negotiation, Error>) {
  return useQuery<Negotiation, Error>({
    queryKey: ['negotiation', id],
    queryFn: () => negotiationService.getNegotiationDetail(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
    ...options,
  })
}

/**
 * Create new negotiation
 */
export function useCreateNegotiation(options?: UseMutationOptions<Negotiation, Error, CreateNegotiationPayload>) {
  const queryClient = useQueryClient()

  return useMutation<Negotiation, Error, CreateNegotiationPayload>({
    mutationFn: negotiationService.createNegotiation,
    onSuccess: () => {
      // Invalidate negotiations list
      queryClient.invalidateQueries({ queryKey: ['negotiations'] })
    },
    ...options,
  })
}

/**
 * Update negotiation (counter offer, accept, reject)
 */
export function useUpdateNegotiation(options?: UseMutationOptions<Negotiation, Error, { id: string; payload: UpdateNegotiationPayload }>) {
  const queryClient = useQueryClient()

  return useMutation<Negotiation, Error, { id: string; payload: UpdateNegotiationPayload }>({
    mutationFn: ({ id, payload }) => negotiationService.updateNegotiation(id, payload),
    onSuccess: (_, variables) => {
      // Invalidate specific negotiation and list
      queryClient.invalidateQueries({ queryKey: ['negotiation', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['negotiations'] })
    },
    ...options,
  })
}

/**
 * Cancel negotiation
 */
export function useCancelNegotiation(options?: UseMutationOptions<Negotiation, Error, string>) {
  const queryClient = useQueryClient()

  return useMutation<Negotiation, Error, string>({
    mutationFn: negotiationService.cancelNegotiation,
    onSuccess: (_, id) => {
      // Invalidate specific negotiation and list
      queryClient.invalidateQueries({ queryKey: ['negotiation', id] })
      queryClient.invalidateQueries({ queryKey: ['negotiations'] })
    },
    ...options,
  })
}
