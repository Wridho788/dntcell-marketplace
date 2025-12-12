import supabase from '../supabase/client'
import { LoginCredentials, RegisterPayload, UpdateProfilePayload, User } from '@/types/auth'

interface AuthResponse {
  user: User
  token: string
}

/**
 * Register new user using Supabase Auth
 */
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    // Step 1: Create auth user with metadata using Supabase Auth
    // Trigger handle_new_user() will automatically create profile record
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          name: payload.name,
          phone: payload.phone
        }
      }
    })

    if (signUpError) throw signUpError
    if (!authData.user) throw new Error('Gagal membuat akun')

    // Step 2: Wait a moment for trigger to complete, then get the auto-created profile
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (profileError || !profile) {
      // If profile doesn't exist yet, create a minimal user object
      console.warn('Profile not found after signup, using auth data')
      const user: User = {
        id: authData.user.id,
        user_id: authData.user.id,
        email: payload.email,
        role: 'buyer',
        created_at: new Date().toISOString(),
        name: payload.name,
        phone: payload.phone
      }
      
      const token = authData.session?.access_token || ''
      return { user, token }
    }

    // Step 3: Get session token
    const token = authData.session?.access_token || ''

    // Combine profile with metadata from auth user
    const user: User = {
      ...transformProfile(profile),
      name: authData.user.user_metadata?.name || payload.name,
      phone: authData.user.user_metadata?.phone || payload.phone
    }

    return {
      user,
      token
    }
  } catch (error) {
    const err = error as Error
    throw new Error(err.message || 'Gagal mendaftar. Silakan coba lagi.')
  }
}

/**
 * Login user using Supabase Auth
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    // Step 1: Sign in with Supabase Auth
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (signInError) throw signInError
    if (!authData.user) throw new Error('Email atau password salah')

    // Step 2: Get profile from public.profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (profileError || !profile) {
      throw new Error('Profil user tidak ditemukan')
    }

    // Step 3: Get session token
    const token = authData.session?.access_token || ''

    // Combine profile with metadata from auth user
    const user: User = {
      ...transformProfile(profile),
      name: authData.user.user_metadata?.name,
      phone: authData.user.user_metadata?.phone,
      avatar_url: authData.user.user_metadata?.avatar_url
    }

    return {
      user,
      token
    }
  } catch (error) {
    const err = error as Error
    throw new Error(err.message || 'Gagal login. Silakan coba lagi.')
  }
}

/**
 * Get current user profile using Supabase Auth session
 */
export async function getMe(token: string): Promise<User> {
  try {
    // Get current session from token
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !authUser) {
      throw new Error('Session tidak valid')
    }

    // Get profile from public.profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (profileError || !profile) {
      throw new Error('Profil tidak ditemukan')
    }

    // Combine profile with metadata from auth user
    const user: User = {
      ...transformProfile(profile),
      name: authUser.user_metadata?.name,
      phone: authUser.user_metadata?.phone,
      avatar_url: authUser.user_metadata?.avatar_url
    }

    return user
  } catch (error) {
    const err = error as Error
    throw new Error(err.message || 'Gagal memuat profil')
  }
}

/**
 * Update user profile - stores in auth.users metadata
 */
export async function updateProfile(
  userId: string,
  payload: UpdateProfilePayload
): Promise<User> {
  try {
    // Update user metadata in auth.users
    const { data: authData, error: authError } = await supabase.auth.updateUser({
      data: payload
    })

    if (authError) throw authError

    // Get profile from public.profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      throw new Error('Profil tidak ditemukan')
    }

    // Combine profile with updated metadata
    const user: User = {
      ...transformProfile(profile),
      name: authData.user?.user_metadata?.name,
      phone: authData.user?.user_metadata?.phone,
      avatar_url: authData.user?.user_metadata?.avatar_url
    }

    return user
  } catch (error) {
    const err = error as Error
    throw new Error(err.message || 'Gagal memperbarui profil')
  }
}

/**
 * Upload user avatar
 */
export async function uploadAvatar(file: File): Promise<string> {
  try {
    // Compress image before upload (using canvas)
    const compressedFile = await compressImage(file)

    const fileName = `${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage
      .from('user-avatars')
      .upload(fileName, compressedFile, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('user-avatars')
      .getPublicUrl(data.path)

    return urlData.publicUrl
  } catch (error) {
    const err = error as Error
    throw new Error(err.message || 'Gagal mengupload avatar')
  }
}

/**
 * Compress image before upload (max 2MB)
 */
function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        
        // Calculate new dimensions (max 800px width)
        let width = img.width
        let height = img.height
        const maxWidth = 800
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              })
              resolve(compressedFile)
            } else {
              reject(new Error('Gagal mengkompress gambar'))
            }
          },
          'image/jpeg',
          0.85
        )
      }
    }
    reader.onerror = () => reject(new Error('Gagal membaca file'))
  })
}

/**
 * Transform profiles table record to User type
 */
function transformProfile(profile: Record<string, unknown>): User {
  return {
    id: profile.id as string,
    user_id: profile.user_id as string | undefined,
    email: profile.email as string,
    role: profile.role as string,
    created_at: profile.created_at as string,
    // Optional fields
    name: profile.name as string | undefined,
    phone: profile.phone as string | undefined,
    avatar_url: profile.avatar_url as string | undefined
  }
}
