/* eslint-disable @typescript-eslint/no-explicit-any */
import supabase from '@/lib/supabase/client'
import { LoginCredentials, RegisterPayload, User } from '@/types/auth'

interface AuthResponse {
  user: User
  token: string
}

interface SessionData {
  user: User
  token: string
}

/**
 * Authentication Service
 * Handles all authentication operations with proper error handling
 */
class AuthService {
  /**
   * Get current session from Supabase
   */
  async getSession(): Promise<SessionData | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        return null
      }

      const user = await this.getMe(session.access_token)
      
      return {
        user,
        token: session.access_token
      }
    } catch (error) {
      console.error('[AuthService] getSession failed:', error)
      return null
    }
  }

  /**
   * Refresh current session
   */
  async refreshSession(): Promise<SessionData | null> {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession()
      
      if (error || !session) {
        return null
      }

      const user = await this.getMe(session.access_token)
      
      return {
        user,
        token: session.access_token
      }
    } catch (error) {
      console.error('[AuthService] refreshSession failed:', error)
      return null
    }
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (signInError) throw signInError
      if (!authData.user) throw new Error('Email atau password salah')

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (profileError || !profile) {
        throw new Error('Profil user tidak ditemukan')
      }

      const user: User = {
        ...this.transformProfile(profile),
        name: authData.user.user_metadata?.name,
        phone: authData.user.user_metadata?.phone,
        avatar_url: authData.user.user_metadata?.avatar_url
      }

      const token = authData.session?.access_token || ''

      return { user, token }
    } catch (error) {
      const err = error as Error
      throw new Error(err.message || 'Gagal login. Silakan coba lagi.')
    }
  }

  /**
   * Register new user
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
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

      await new Promise(resolve => setTimeout(resolve, 500))
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (profileError || !profile) {
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

      const token = authData.session?.access_token || ''
      const user: User = {
        ...this.transformProfile(profile),
        name: authData.user.user_metadata?.name || payload.name,
        phone: authData.user.user_metadata?.phone || payload.phone
      }

      return { user, token }
    } catch (error) {
      const err = error as Error
      throw new Error(err.message || 'Gagal mendaftar. Silakan coba lagi.')
    }
  }

  /**
   * Get current user profile
   */
  async getMe(token: string): Promise<User> {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token)
      
      if (authError || !authUser) {
        throw new Error('Session tidak valid')
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (profileError || !profile) {
        throw new Error('Profil tidak ditemukan')
      }

      const user: User = {
        ...this.transformProfile(profile),
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
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('[AuthService] logout failed:', error)
      // Don't throw error on logout
    }
  }

  /**
   * Transform profile data
   */
  private transformProfile(profile: any): User {
    return {
      id: profile.id,
      user_id: profile.user_id || profile.id,
      email: profile.email,
      name: profile.name,
      phone: profile.phone,
      role: profile.role || 'buyer',
      avatar_url: profile.avatar_url,
      created_at: profile.created_at
    }
  }
}

export const authService = new AuthService()
