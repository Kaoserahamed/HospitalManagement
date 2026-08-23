import api from './axios'
import { LoginCredentials, AuthResponse, User, CreateUserData } from '../types'

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
}
