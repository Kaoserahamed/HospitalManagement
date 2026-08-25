import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import PatientRegistration from './pages/PatientRegistration'
import Dashboard from './pages/Dashboard'
import DepartmentManagement from './pages/DepartmentManagement'
import SchedulesPage from './pages/SchedulesPage'
import DoctorDashboard from './pages/DoctorDashboard'
import ReceptionistDashboard from './pages/ReceptionistDashboard'
import PatientDashboard from './pages/PatientDashboard'
import ProtectedRoute from './components/ProtectedRoute'

const RootRedirect = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Redirect based on role
  if (user.role === 'admin') {
    return <Navigate to="/dashboard" replace />
  } else if (user.role === 'doctor') {
    return <Navigate to="/doctor-dashboard" replace />
  } else if (user.role === 'receptionist') {
    return <Navigate to="/receptionist-dashboard" replace />
  } else if (user.role === 'patient') {
    return <Navigate to="/patient-dashboard" replace />
  }

  return <Navigate to="/login" replace />
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<PatientRegistration />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/departments"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DepartmentManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedules"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SchedulesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist-dashboard"
            element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <ReceptionistDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-dashboard"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<RootRedirect />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
