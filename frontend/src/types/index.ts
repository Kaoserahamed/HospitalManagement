export type UserRole = 'admin' | 'doctor' | 'patient' | 'receptionist'

export interface User {
  id: string
  email: string
  role: UserRole
  first_name: string
  last_name: string
  phone: string | null
  is_active: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface CreateUserData {
  email: string
  password: string
  role: UserRole
  first_name: string
  last_name: string
  phone?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
}
