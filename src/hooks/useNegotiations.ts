import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import negotiationService, { 
  Negotiation, 
  CreateNegotiationPayload,
  NegotiationStatus
} from '@/services/negotiation.service'

/**
 * Get all negotiations for current user
 */
export function useNegotiations(status?: NegotiationStatus, options?: UseQueryOptions<Negotiation[], Error>) {
  return useQuery<Negotiation[], Error>({
    queryKey: ['negotiations', status],
    queryFn: () => negotiationService.getNegotiationsByUser(status),
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
 * Cancel negotiation (buyer only)
 */
export function useCancelNegotiation(options?: UseMutationOptions<void, Error, string>) {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: negotiationService.cancelNegotiation,
    onSuccess: () => {
      // Invalidate negotiations list
      queryClient.invalidateQueries({ queryKey: ['negotiations'] })
    },
    ...options,
  })
}
