import axiosClient from '@/libs/axios/axiosClient'

export interface Profile {
  id: string
  user_id: string
  full_name?: string
  phone?: string
  address?: string
  city?: string
  province?: string
  postal_code?: string
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
}

export interface UpdateProfilePayload {
  full_name?: string
  phone?: string
  address?: string
  city?: string
  province?: string
  postal_code?: string
  avatar_url?: string
  bio?: string
}

/**
 * Get current user profile
 * Supabase PostgREST format: /profiles?select=*&limit=1
 * Note: User filtering handled by RLS
 */
export const getProfile = async (): Promise<Profile> => {
  const response = await axiosClient.get<Profile[]>('/profiles', {
    params: {
      select: '*',
      limit: 1
    }
  })
  return response.data[0]
}

/**
 * Get profile by user ID
 * Supabase PostgREST format: /profiles?user_id=eq.123&select=*
 */
export const getProfileByUserId = async (userId: string): Promise<Profile> => {
  const response = await axiosClient.get<Profile[]>('/profiles', {
    params: {
      user_id: `eq.${userId}`,
      select: '*',
      limit: 1
    }
  })
  return response.data[0]
}

/**
 * Update current user profile
 * Supabase PostgREST format: PATCH /profiles with RLS filtering
 */
export const updateProfile = async (payload: UpdateProfilePayload): Promise<Profile> => {
  const response = await axiosClient.patch<Profile[]>('/profiles', payload)
  return response.data[0]
}

/**
 * Upload avatar
 */
export const uploadAvatar = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData()
  formData.append('avatar', file)

  const response = await axiosClient.post<{ url: string }>('/profile/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  
  return response.data
}

const profileService = {
  getProfile,
  getProfileByUserId,
  updateProfile,
  uploadAvatar,
}

export default profileService
