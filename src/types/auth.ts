export interface User {
  id: string
  user_id?: string
  email: string
  role: string
  created_at: string
  // Extended fields (optional, from metadata or other tables)
  name?: string
  phone?: string
  avatar_url?: string
  address?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoggedIn: boolean
  loading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  phone: string
  password: string
}

export interface UpdateProfilePayload {
  name?: string
  email?: string
  phone?: string
  avatar_url?: string
  address?: string
}
