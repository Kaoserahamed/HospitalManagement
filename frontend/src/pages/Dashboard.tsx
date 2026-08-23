import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { LogOut, Plus } from 'lucide-react'
import CreateUserModal from '../components/CreateUserModal'
import { User } from '../types'
import { authAPI } from '../api/auth'
import './Dashboard.css'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

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
              {user?.first_name} {user?.last_name} ({user?.role})
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
            <h2>User Management</h2>
            <p>Create and manage hospital staff accounts</p>
          </div>
          <button onClick={() => setShowModal(true)} className="create-button">
            <Plus size={20} />
            Create User
          </button>
        </div>

        <div className="users-grid">
          {users.length === 0 ? (
            <div className="empty-state">
              <p>No users created yet</p>
              <p className="empty-subtitle">Click "Create User" to add doctors and receptionists</p>
            </div>
          ) : (
            users.map((u) => (
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
      </main>

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
