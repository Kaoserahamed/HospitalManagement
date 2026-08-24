import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { LogOut, Calendar } from 'lucide-react'
import { departmentAPI, Department } from '../api/department'
import { appointmentAPI, AppointmentWithDetails, AppointmentStatus } from '../api/appointment'
import './Dashboard.css'

const DoctorDashboard = () => {
  const { user, logout } = useAuth()
  const [department, setDepartment] = useState<Department | null>(null)
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [dept, appts] = await Promise.all([
        departmentAPI.getMyDepartment(),
        appointmentAPI.getMySchedule(),
      ])
      setDepartment(dept)
      setAppointments(appts)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (appointmentId: string, newStatus: AppointmentStatus) => {
    try {
      await appointmentAPI.updateStatus(appointmentId, { status: newStatus })
      loadData()
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to update appointment status')
    }
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

  const upcomingAppointments = appointments.filter(
    (apt) =>
      (apt.status === 'scheduled' || apt.status === 'confirmed') &&
      new Date(apt.appointment_date) >= new Date(new Date().setHours(0, 0, 0, 0))
  )

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
            <h2>My Schedule</h2>
            <p>
              {department
                ? `${department.name} Department`
                : 'Welcome, Dr. ' + user?.first_name}
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            Loading your schedule...
          </div>
        ) : (
          <div className="users-grid">
            {upcomingAppointments.length === 0 ? (
              <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                <Calendar size={48} style={{ color: '#ccc', marginBottom: '1rem' }} />
                <p>No upcoming appointments</p>
                <p className="empty-subtitle">Your schedule is clear</p>
              </div>
            ) : (
              upcomingAppointments.map((apt) => (
                <div key={apt.id} className="user-card">
                  <div className="user-card-header">
                    <h3>{apt.patient_name}</h3>
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
                      <strong>Date:</strong> {formatDate(apt.appointment_date)}
                    </p>
                    <p>
                      <strong>Time:</strong> {formatTime(apt.appointment_time)}
                    </p>
                    <p>
                      <strong>Email:</strong> {apt.patient_email}
                    </p>
                    {apt.patient_phone && (
                      <p>
                        <strong>Phone:</strong> {apt.patient_phone}
                      </p>
                    )}
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
                    <div
                      style={{
                        marginTop: '1rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid #f0f0f0',
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      {apt.status === 'scheduled' && (
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#e0f2fe',
                            color: '#0369a1',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          Confirm
                        </button>
                      )}
                      {(apt.status === 'scheduled' || apt.status === 'confirmed') && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'completed')}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#d1fae5',
                              color: '#065f46',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'no_show')}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#fef3c7',
                              color: '#92400e',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                          >
                            No Show
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default DoctorDashboard
