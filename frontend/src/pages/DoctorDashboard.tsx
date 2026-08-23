import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { LogOut } from 'lucide-react'
import { departmentAPI, Department } from '../api/department'
import './Dashboard.css'

const DoctorDashboard = () => {
  const { user, logout } = useAuth()
  const [department, setDepartment] = useState<Department | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDepartment()
  }, [])

  const loadDepartment = async () => {
    try {
      const dept = await departmentAPI.getMyDepartment()
      setDepartment(dept)
    } catch (error) {
      console.error('Failed to load department:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Hospital Management System</h1>
          <div className="navbar-right">
            <span className="user-info">
              Dr. {user?.first_name} {user?.last_name}
            </span>
            <button onClick={logout} className="logout-button">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="content-header">
          <div>
            <h2>Doctor Dashboard</h2>
            <p>Welcome, Dr. {user?.first_name}</p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            Loading your information...
          </div>
        ) : (
          <div className="users-grid">
            {/* Profile Card */}
            <div className="user-card">
              <div className="user-card-header">
                <h3>My Profile</h3>
                <span className="role-badge role-doctor">Doctor</span>
              </div>
              <div className="user-card-body">
                <p>
                  <strong>Name:</strong> Dr. {user?.first_name} {user?.last_name}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
                {user?.phone && (
                  <p>
                    <strong>Phone:</strong> {user?.phone}
                  </p>
                )}
                <p>
                  <strong>Status:</strong>{' '}
                  <span className="status-active">Active</span>
                </p>
              </div>
            </div>

            {/* Department Card */}
            <div className="user-card">
              <div className="user-card-header">
                <h3>My Department</h3>
              </div>
              <div className="user-card-body">
                {department ? (
                  <>
                    <p>
                      <strong>Department:</strong> {department.name}
                    </p>
                    {department.description && (
                      <p style={{ marginTop: '1rem', color: '#666', lineHeight: '1.6' }}>
                        {department.description}
                      </p>
                    )}
                    <p style={{ marginTop: '1rem' }}>
                      <strong>Status:</strong>{' '}
                      <span className={department.is_active ? 'status-active' : 'status-inactive'}>
                        {department.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                    <p>You are not assigned to any department yet.</p>
                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                      Please contact the administrator.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Info Card */}
            <div className="user-card" style={{ gridColumn: '1 / -1' }}>
              <div className="user-card-header">
                <h3>Information</h3>
              </div>
              <div className="user-card-body">
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  Welcome to your dashboard. More features for managing appointments, 
                  patient records, and schedules will be available soon.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default DoctorDashboard
