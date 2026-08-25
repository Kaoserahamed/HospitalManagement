import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut, Plus, Users, Building2, Calendar } from 'lucide-react'
import CreateUserModal from '../components/CreateUserModal'
import DataTable from '../components/DataTable'
import { User } from '../types'
import { authAPI } from '../api/auth'
import './Dashboard.css'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showModal, setShowModal] = useState(false)
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

  // Define columns for doctors table
  const doctorsColumns = [
    {
      key: 'name',
      header: 'Name',
      render: (_: any, row: User) => <strong>Dr. {row.first_name} {row.last_name}</strong>
    },
    {
      key: 'email',
      header: 'Email'
    },
    {
      key: 'phone',
      header: 'Phone'
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (value: boolean) => (
        <span className={value ? 'status-active' : 'status-inactive'}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ]

  // Define columns for receptionists table
  const receptionistsColumns = [
    {
      key: 'name',
      header: 'Name',
      render: (_: any, row: User) => <strong>{row.first_name} {row.last_name}</strong>
    },
    {
      key: 'email',
      header: 'Email'
    },
    {
      key: 'phone',
      header: 'Phone'
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (value: boolean) => (
        <span className={value ? 'status-active' : 'status-inactive'}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ]

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
              onClick={() => navigate('/schedules')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                backgroundColor: currentPath === '/schedules' ? '#f0f0f0' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: currentPath === '/schedules' ? '600' : '400',
                color: '#333',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (currentPath !== '/schedules') {
                  e.currentTarget.style.backgroundColor = '#f8f8f8'
                }
              }}
              onMouseLeave={(e) => {
                if (currentPath !== '/schedules') {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
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
            <DataTable
              data={doctors}
              columns={doctorsColumns}
              emptyMessage="No doctors added yet"
              emptySubtitle='Click "Create User" to add doctors'
            />
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
            <DataTable
              data={receptionists}
              columns={receptionistsColumns}
              emptyMessage="No receptionists added yet"
              emptySubtitle='Click "Create User" to add receptionists'
            />
          </div>
        </main>
      </div>

      {showModal && (
        <CreateUserModal
          onClose={() => setShowModal(false)}
          onUserCreated={handleUserCreated}
        />
      )}
    </div>
  )
}

export default Dashboard
