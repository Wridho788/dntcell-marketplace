import axiosClient from '@/libs/axios/axiosClient'

export interface Negotiation {
  id: string
  product_id: string
  buyer_id: string
  seller_id: string
  initial_price: number
  offered_price: number
  current_price: number
  status: 'pending' | 'counter' | 'accepted' | 'rejected' | 'cancelled'
  buyer_message?: string
  seller_message?: string
  created_at: string
  updated_at: string
  product?: {
    id: string
    name: string
    image: string
  }
}

export interface CreateNegotiationPayload {
  product_id: string
  offered_price: number
  message?: string
}

export interface UpdateNegotiationPayload {
  offered_price?: number
  status?: 'counter' | 'accepted' | 'rejected' | 'cancelled'
  message?: string
}

/**
 * Get all negotiations for current user
 * Supabase PostgREST format: /negotiations?select=*&order=created_at.desc
 * Note: User filtering handled by RLS (Row Level Security)
 */
export const getNegotiationsByUser = async (): Promise<Negotiation[]> => {
  const response = await axiosClient.get<Negotiation[]>('/negotiations', {
    params: {
      select: '*,product:products(*)',
      order: 'created_at.desc'
    }
  })
  return response.data
}

/**
 * Get single negotiation detail
 * Supabase PostgREST format: /negotiations?id=eq.123&select=*
 */
export const getNegotiationDetail = async (id: string): Promise<Negotiation> => {
  const response = await axiosClient.get<Negotiation[]>('/negotiations', {
    params: {
      id: `eq.${id}`,
      select: '*,product:products(*)',
      limit: 1
    }
  })
  return response.data[0]
}

/**
 * Create new negotiation
 */
export const createNegotiation = async (payload: CreateNegotiationPayload): Promise<Negotiation> => {
  const response = await axiosClient.post<Negotiation>('/negotiations', payload)
  return response.data
}

/**
 * Update negotiation (counter offer, accept, reject, cancel)
 */
export const updateNegotiation = async (id: string, payload: UpdateNegotiationPayload): Promise<Negotiation> => {
  const response = await axiosClient.patch<Negotiation>(`/negotiations/${id}`, payload)
  return response.data
}

/**
 * Cancel negotiation
 */
export const cancelNegotiation = async (id: string): Promise<Negotiation> => {
  const response = await axiosClient.patch<Negotiation>(`/negotiations/${id}/cancel`)
  return response.data
}

const negotiationService = {
  getNegotiationsByUser,
  getNegotiationDetail,
  createNegotiation,
  updateNegotiation,
  cancelNegotiation,
}

export default negotiationService
