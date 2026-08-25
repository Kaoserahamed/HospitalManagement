import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, LoginCredentials } from '../types'
import { authAPI } from '../api/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<User>
  loginPatient: (credentials: { nid: string; phone: string }) => Promise<User>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const getUser = localStorage.getItem('auth_type') === 'patient'
        ? authAPI.getCurrentPatient
        : authAPI.getCurrentUser
      getUser()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials: LoginCredentials) => {
    const response = await authAPI.login(credentials)
    localStorage.setItem('token', response.access_token)
    localStorage.setItem('auth_type', 'staff')
    const userData = await authAPI.getCurrentUser()
    setUser(userData)
    return userData
  }

  const loginPatient = async (credentials: { nid: string; phone: string }) => {
    const response = await authAPI.patientLogin(credentials)
    localStorage.setItem('token', response.access_token)
    localStorage.setItem('auth_type', 'patient')
    const userData = await authAPI.getCurrentPatient()
    setUser(userData)
    return userData
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('auth_type')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, loginPatient, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
