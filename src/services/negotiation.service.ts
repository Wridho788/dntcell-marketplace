import axiosClient from '@/libs/axios/axiosClient'

export type NegotiationStatus = 'pending' | 'approved' | 'rejected' | 'expired' | 'used'

export interface Negotiation {
  id: string
  product_id: string
  buyer_id: string
  seller_id: string
  offered_price: number
  final_price?: number
  status: NegotiationStatus
  buyer_note?: string
  admin_note?: string
  rejection_reason?: string
  used: boolean
  expires_at?: string
  created_at: string
  updated_at: string
  product?: {
    id: string
    name: string
    selling_price: number
    main_image_url?: string
    status: string
  }
}

export interface CreateNegotiationPayload {
  product_id: string
  offered_price: number
  buyer_note?: string
}

export interface NegotiationEligibility {
  eligible: boolean
  reason?: string
  existing_negotiation_id?: string
}

/**
 * Get all negotiations for current user
 * Supabase PostgREST format: /negotiations?select=*&order=created_at.desc
 * Note: User filtering handled by RLS (Row Level Security)
 */
export const getNegotiationsByUser = async (status?: NegotiationStatus): Promise<Negotiation[]> => {
  const params: Record<string, string> = {
    select: '*,product:products(id,name,selling_price,main_image_url,status)',
    order: 'created_at.desc'
  }
  
  if (status) {
    params.status = `eq.${status}`
  }
  
  const response = await axiosClient.get<Negotiation[]>('/negotiations', { params })
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
      select: '*,product:products(id,name,selling_price,main_image_url,status)',
      limit: 1
    }
  })
  
  if (!response.data || response.data.length === 0) {
    throw new Error('Negotiation not found')
  }
  
  return response.data[0]
}

/**
 * Check if user is eligible to create negotiation for a product
 */
export const checkNegotiationEligibility = async (productId: string): Promise<NegotiationEligibility> => {
  try {
    const response = await axiosClient.get<Negotiation[]>('/negotiations', {
      params: {
        product_id: `eq.${productId}`,
        status: `in.(pending,approved)`,
        select: 'id,status'
      }
    })
    
    if (response.data && response.data.length > 0) {
      return {
        eligible: false,
        reason: 'Anda sudah memiliki negosiasi aktif untuk produk ini',
        existing_negotiation_id: response.data[0].id
      }
    }
    
    return { eligible: true }
  } catch {
    return { eligible: true }
  }
}

/**
 * Create new negotiation
 */
export const createNegotiation = async (payload: CreateNegotiationPayload): Promise<Negotiation> => {
  const response = await axiosClient.post<Negotiation>('/negotiations', payload, {
    headers: {
      'Prefer': 'return=representation'
    }
  })
  return response.data
}

/**
 * Cancel negotiation (buyer only)
 */
export const cancelNegotiation = async (id: string): Promise<void> => {
  await axiosClient.patch(`/negotiations?id=eq.${id}`, {
    status: 'rejected',
    rejection_reason: 'Dibatalkan oleh pembeli'
  })
}

const negotiationService = {
  getNegotiationsByUser,
  getNegotiationDetail,
  checkNegotiationEligibility,
  createNegotiation,
  cancelNegotiation,
}

export default negotiationService
