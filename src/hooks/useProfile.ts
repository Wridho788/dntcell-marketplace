import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import profileService, { Profile, UpdateProfilePayload } from '@/services/profile.service'

/**
 * Get current user profile
 */
export function useProfile(options?: UseQueryOptions<Profile, Error>) {
  return useQuery<Profile, Error>({
    queryKey: ['profile'],
    queryFn: profileService.getProfile,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  })
}

/**
 * Get profile by user ID
 */
export function useProfileByUserId(userId: string, options?: UseQueryOptions<Profile, Error>) {
  return useQuery<Profile, Error>({
    queryKey: ['profile', userId],
    queryFn: () => profileService.getProfileByUserId(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
    ...options,
  })
}

/**
 * Update current user profile
 */
export function useUpdateProfile(options?: UseMutationOptions<Profile, Error, UpdateProfilePayload>) {
  const queryClient = useQueryClient()

  return useMutation<Profile, Error, UpdateProfilePayload>({
    mutationFn: profileService.updateProfile,
    onSuccess: () => {
      // Invalidate profile query
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    ...options,
  })
}

/**
 * Upload avatar
 */
export function useUploadAvatar(options?: UseMutationOptions<{ url: string }, Error, File>) {
  const queryClient = useQueryClient()

  return useMutation<{ url: string }, Error, File>({
    mutationFn: profileService.uploadAvatar,
    onSuccess: () => {
      // Invalidate profile query to refresh with new avatar
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    ...options,
  })
}
