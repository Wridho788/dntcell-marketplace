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
 */
export const getProfile = async (): Promise<Profile> => {
  const response = await axiosClient.get<Profile>('/profile')
  return response.data
}

/**
 * Get profile by user ID
 */
export const getProfileByUserId = async (userId: string): Promise<Profile> => {
  const response = await axiosClient.get<Profile>(`/profile/${userId}`)
  return response.data
}

/**
 * Update current user profile
 */
export const updateProfile = async (payload: UpdateProfilePayload): Promise<Profile> => {
  const response = await axiosClient.patch<Profile>('/profile', payload)
  return response.data
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
