import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { LogOut, Plus, Calendar } from 'lucide-react'
import { appointmentAPI, AppointmentWithDetails } from '../api/appointment'
import BookAppointmentModal from '../components/BookAppointmentModal'
import './Dashboard.css'

const PatientDashboard = () => {
  const { user, logout } = useAuth()
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [showBookModal, setShowBookModal] = useState(false)

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      const data = await appointmentAPI.getMyAppointments()
      setAppointments(data)
    } catch (error) {
      console.error('Failed to load appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return
    }

    try {
      await appointmentAPI.cancelMyAppointment(appointmentId)
      loadAppointments()
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to cancel appointment')
    }
  }

  const handleAppointmentBooked = () => {
    setShowBookModal(false)
    loadAppointments()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return '#3b82f6'
      case 'confirmed':
        return '#10b981'
      case 'completed':
        return '#6b7280'
      case 'cancelled':
        return '#ef4444'
      case 'no_show':
        return '#f59e0b'
      default:
        return '#6b7280'
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
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
              {user?.first_name} {user?.last_name} (Patient)
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
            <h2>My Appointments</h2>
            <p>View and manage your appointments</p>
          </div>
          <button onClick={() => setShowBookModal(true)} className="create-button">
            <Plus size={20} />
            Book Appointment
          </button>
        </div>

        <div className="users-grid">
          {appointments.length === 0 ? (
            <div className="empty-state">
              <Calendar size={48} style={{ color: '#ccc', marginBottom: '1rem' }} />
              <p>No appointments yet</p>
              <p className="empty-subtitle">Click "Book Appointment" to schedule your first appointment</p>
            </div>
          ) : (
            appointments.map((apt) => (
              <div key={apt.id} className="user-card">
                <div className="user-card-header">
                  <h3>{apt.doctor_name}</h3>
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      backgroundColor: `${getStatusColor(apt.status)}20`,
                      color: getStatusColor(apt.status),
                    }}
                  >
                    {apt.status}
                  </span>
                </div>
                <div className="user-card-body">
                  <p>
                    <strong>Department:</strong> {apt.department_name}
                  </p>
                  <p>
                    <strong>Date:</strong> {formatDate(apt.appointment_date)}
                  </p>
                  <p>
                    <strong>Time:</strong> {formatTime(apt.appointment_time)}
                  </p>
                  {apt.reason && (
                    <p>
                      <strong>Reason:</strong> {apt.reason}
                    </p>
                  )}
                  {apt.notes && (
                    <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                      <strong>Notes:</strong> {apt.notes}
                    </p>
                  )}
                  {(apt.status === 'scheduled' || apt.status === 'confirmed') && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f0f0f0' }}>
                      <button
                        onClick={() => handleCancelAppointment(apt.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#fee',
                          color: '#c33',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        Cancel Appointment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {showBookModal && (
        <BookAppointmentModal
          onClose={() => setShowBookModal(false)}
          onBooked={handleAppointmentBooked}
        />
      )}
    </div>
  )
}

export default PatientDashboard
