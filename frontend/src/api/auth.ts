import api from './axios'
import { LoginCredentials, AuthResponse, User, CreateUserData } from '../types'

export interface PatientRegisterData {
  nid: string
  phone: string
  first_name: string
  last_name: string
  date_of_birth: string
  gender: 'male' | 'female' | 'other'
  blood_group?: string
  address?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  medical_history?: string
  allergies?: string
}

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me')
    return response.data
  },

  createUser: async (userData: CreateUserData): Promise<User> => {
    const response = await api.post<User>('/auth/users', userData)
    return response.data
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/auth/users')
    return response.data
  },

  registerPatient: async (data: PatientRegisterData): Promise<User> => {
    const response = await api.post<User>('/auth/register', data)
    return response.data
  },
}
