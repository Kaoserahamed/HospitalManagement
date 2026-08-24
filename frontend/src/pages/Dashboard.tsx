import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut, Plus, Users, Building2, Calendar } from 'lucide-react'
import CreateUserModal from '../components/CreateUserModal'
import ScheduleManagement from './ScheduleManagement'
import { User } from '../types'
import { authAPI } from '../api/auth'
import './Dashboard.css'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showModal, setShowModal] = useState(false)
  const [showScheduleManagement, setShowScheduleManagement] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const currentPath = location.pathname

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const allUsers = await authAPI.getAllUsers()
      // Filter out the current admin from the list
      setUsers(allUsers.filter((u) => u.id !== user?.id))
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserCreated = (newUser: User) => {
    setUsers([...users, newUser])
    setShowModal(false)
  }

  const doctors = users.filter(u => u.role === 'doctor')
  const receptionists = users.filter(u => u.role === 'receptionist')

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Hospital Management System</h1>
          <div className="navbar-right">
            <span className="user-info">
              {user?.first_name} {user?.last_name} (Admin)
            </span>
            <button onClick={logout} className="logout-button">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div style={{ display: 'flex', height: 'calc(100vh - 65px)' }}>
        {/* Sidebar */}
        <aside style={{
          width: '250px',
          backgroundColor: 'white',
          borderRight: '1px solid #e0e0e0',
          padding: '1.5rem 0',
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 1rem' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                backgroundColor: currentPath === '/dashboard' ? '#f0f0f0' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: currentPath === '/dashboard' ? '600' : '400',
                color: '#333',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (currentPath !== '/dashboard') {
                  e.currentTarget.style.backgroundColor = '#f8f8f8'
                }
              }}
              onMouseLeave={(e) => {
                if (currentPath !== '/dashboard') {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <Users size={20} />
              Users & Staff
            </button>
            <button
              onClick={() => navigate('/departments')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                backgroundColor: currentPath === '/departments' ? '#f0f0f0' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: currentPath === '/departments' ? '600' : '400',
                color: '#333',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (currentPath !== '/departments') {
                  e.currentTarget.style.backgroundColor = '#f8f8f8'
                }
              }}
              onMouseLeave={(e) => {
                if (currentPath !== '/departments') {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <Building2 size={20} />
              Departments
            </button>
            <button
              onClick={() => setShowScheduleManagement(true)}
              className="sidebar-button"
              style={{ backgroundColor: '#8b5cf6' }}
            >
              <Calendar size={20} />
              Schedules
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content" style={{ flex: 1, overflowY: 'auto' }}>
          <div className="content-header">
            <div>
              <h2>Users & Staff Management</h2>
              <p>Manage doctors and receptionists</p>
            </div>
            <button onClick={() => setShowModal(true)} className="create-button">
              <Plus size={20} />
              Create User
            </button>
          </div>

          {/* Doctors Section */}
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', color: '#333' }}>
                Doctors ({doctors.length})
              </h3>
            </div>
            <div className="users-grid">
              {doctors.length === 0 ? (
                <div className="empty-state">
                  <p>No doctors added yet</p>
                  <p className="empty-subtitle">Click "Create User" to add doctors</p>
                </div>
              ) : (
                doctors.map((u) => (
                  <div key={u.id} className="user-card">
                    <div className="user-card-header">
                      <h3>
                        Dr. {u.first_name} {u.last_name}
                      </h3>
                      <span className={`role-badge role-${u.role}`}>{u.role}</span>
                    </div>
                    <div className="user-card-body">
                      <p>
                        <strong>Email:</strong> {u.email}
                      </p>
                      {u.phone && (
                        <p>
                          <strong>Phone:</strong> {u.phone}
                        </p>
                      )}
                      <p>
                        <strong>Status:</strong>{' '}
                        <span className={u.is_active ? 'status-active' : 'status-inactive'}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Receptionists Section */}
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', color: '#333' }}>
                Receptionists ({receptionists.length})
              </h3>
            </div>
            <div className="users-grid">
              {receptionists.length === 0 ? (
                <div className="empty-state">
                  <p>No receptionists added yet</p>
                  <p className="empty-subtitle">Click "Create User" to add receptionists</p>
                </div>
              ) : (
                receptionists.map((u) => (
                  <div key={u.id} className="user-card">
                    <div className="user-card-header">
                      <h3>
                        {u.first_name} {u.last_name}
                      </h3>
                      <span className={`role-badge role-${u.role}`}>{u.role}</span>
                    </div>
                    <div className="user-card-body">
                      <p>
                        <strong>Email:</strong> {u.email}
                      </p>
                      {u.phone && (
                        <p>
                          <strong>Phone:</strong> {u.phone}
                        </p>
                      )}
                      <p>
                        <strong>Status:</strong>{' '}
                        <span className={u.is_active ? 'status-active' : 'status-inactive'}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <CreateUserModal
          onClose={() => setShowModal(false)}
          onUserCreated={handleUserCreated}
        />
      )}

      {showScheduleManagement && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'white', zIndex: 1000, overflowY: 'auto' }}>
          <ScheduleManagement doctors={doctors} onClose={() => setShowScheduleManagement(false)} />
        </div>
      )}
    </div>
  )
}

export default Dashboard
