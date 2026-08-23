import { useAuth } from '../context/AuthContext'
import { LogOut } from 'lucide-react'
import './Dashboard.css'

const DoctorDashboard = () => {
  const { user, logout } = useAuth()

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
            <p>Manage your appointments and patient records</p>
          </div>
        </div>

        <div className="empty-state">
          <h3>Welcome, Dr. {user?.first_name}!</h3>
          <p className="empty-subtitle">Doctor features will be implemented in the next phase</p>
        </div>
      </main>
    </div>
  )
}

export default DoctorDashboard
