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
 */
export const getNegotiationsByUser = async (): Promise<Negotiation[]> => {
  const response = await axiosClient.get<Negotiation[]>('/negotiations')
  return response.data
}

/**
 * Get single negotiation detail
 */
export const getNegotiationDetail = async (id: string): Promise<Negotiation> => {
  const response = await axiosClient.get<Negotiation>(`/negotiations/${id}`)
  return response.data
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
