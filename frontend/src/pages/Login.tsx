import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Lock, Mail } from 'lucide-react'
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [nid, setNid] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [isPatientLogin, setIsPatientLogin] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, loginPatient, user } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
  if (user) {
    if (user.role === 'admin') {
      navigate('/dashboard', { replace: true })
    } else if (user.role === 'doctor') {
      navigate('/doctor-dashboard', { replace: true })
    } else if (user.role === 'receptionist') {
      navigate('/receptionist-dashboard', { replace: true })
    } else if (user.role === 'patient') {
      navigate('/patient-dashboard', { replace: true })
    }
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const userData = isPatientLogin
        ? await loginPatient({ nid, phone })
        : await login({ email, password })
      // Redirect based on role
      if (userData.role === 'admin') {
        navigate('/dashboard')
      } else if (userData.role === 'doctor') {
        navigate('/doctor-dashboard')
      } else if (userData.role === 'receptionist') {
        navigate('/receptionist-dashboard')
      } else if (userData.role === 'patient') {
        navigate('/patient-dashboard')
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Hospital Management System</h1>
          <p>Login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">
              <Mail size={18} />
              {isPatientLogin ? 'National ID (NID)' : 'Email'}
            </label>
            <input
              id="email"
              type={isPatientLogin ? 'text' : 'email'}
              value={isPatientLogin ? nid : email}
              onChange={(e) => isPatientLogin ? setNid(e.target.value) : setEmail(e.target.value)}
              placeholder={isPatientLogin ? 'Enter your National ID' : 'your.email@hospital.com'}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <Lock size={18} />
              {isPatientLogin ? 'Phone Number' : 'Password'}
            </label>
            <input
              id="password"
              type={isPatientLogin ? 'tel' : 'password'}
              value={isPatientLogin ? phone : password}
              onChange={(e) => isPatientLogin ? setPhone(e.target.value) : setPassword(e.target.value)}
              placeholder={isPatientLogin ? 'Enter your phone number' : 'Enter your password'}
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : isPatientLogin ? 'Patient Login' : 'Login'}
          </button>

          <button
            type="button"
            className="login-button"
            onClick={() => setIsPatientLogin(!isPatientLogin)}
            disabled={loading}
          >
            {isPatientLogin ? 'Staff Login' : 'Patient Login'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Don't have an account?{' '}
              <Link
                to="/register"
                style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: '600',
                }}
              >
                Register as Patient
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
