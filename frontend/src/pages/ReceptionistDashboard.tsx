import { useAuth } from '../context/AuthContext'
import { LogOut } from 'lucide-react'
import './Dashboard.css'

const ReceptionistDashboard = () => {
  const { user, logout } = useAuth()

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Hospital Management System</h1>
          <div className="navbar-right">
            <span className="user-info">
              {user?.first_name} {user?.last_name} (Receptionist)
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
            <h2>Receptionist Dashboard</h2>
            <p>Manage appointments and patient check-ins</p>
          </div>
        </div>

        <div className="empty-state">
          <h3>Welcome, {user?.first_name}!</h3>
          <p className="empty-subtitle">Receptionist features will be implemented in the next phase</p>
        </div>
      </main>
    </div>
  )
}

export default ReceptionistDashboard
