import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { LogOut, Plus, Calendar, Pill, FileText } from 'lucide-react'
import { appointmentAPI, AppointmentWithDetails } from '../api/appointment'
import { prescriptionAPI, Prescription, MedicationItem } from '../api/prescription'
import BookAppointmentModal from '../components/BookAppointmentModal'
import './Dashboard.css'

const PatientDashboard = () => {
  const { user, logout } = useAuth()
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([])
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const [showBookModal, setShowBookModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'appointments' | 'medicines'>('appointments')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [appointmentsData, prescriptionsData] = await Promise.all([
        appointmentAPI.getMyAppointments(),
        prescriptionAPI.getPatientMyPrescriptions()
      ])
      setAppointments(appointmentsData)
      setPrescriptions(prescriptionsData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAppointments = async () => {
    try {
      const data = await appointmentAPI.getMyAppointments()
      setAppointments(data)
    } catch (error) {
      console.error('Failed to load appointments:', error)
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
    loadData()
  }

  const parseMedications = (medicationsJson: string): MedicationItem[] => {
    try {
      return JSON.parse(medicationsJson)
    } catch {
      return []
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
            <h2>Patient Dashboard</h2>
            <p>View your appointments and medicine history</p>
          </div>
          {activeTab === 'appointments' && (
            <button onClick={() => setShowBookModal(true)} className="create-button">
              <Plus size={20} />
              Book Appointment
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '2rem',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <button
            onClick={() => setActiveTab('appointments')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: activeTab === 'appointments' ? '#3b82f6' : 'transparent',
              color: activeTab === 'appointments' ? 'white' : '#666',
              border: 'none',
              borderRadius: '6px 6px 0 0',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              borderBottom: activeTab === 'appointments' ? '2px solid #3b82f6' : '2px solid transparent'
            }}
          >
            <Calendar size={18} />
            My Appointments
          </button>
          <button
            onClick={() => setActiveTab('medicines')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: activeTab === 'medicines' ? '#3b82f6' : 'transparent',
              color: activeTab === 'medicines' ? 'white' : '#666',
              border: 'none',
              borderRadius: '6px 6px 0 0',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              borderBottom: activeTab === 'medicines' ? '2px solid #3b82f6' : '2px solid transparent'
            }}
          >
            <Pill size={18} />
            Medicine History
          </button>
        </div>

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
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
        )}

        {/* Medicine History Tab */}
        {activeTab === 'medicines' && (
          <div>
            {prescriptions.length === 0 ? (
              <div className="empty-state">
                <FileText size={48} style={{ color: '#ccc', marginBottom: '1rem' }} />
                <p>No prescription history found</p>
                <p className="empty-subtitle">Your medicine prescriptions will appear here after doctor visits</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {prescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    style={{
                      padding: '1.5rem',
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '1rem',
                      }}
                    >
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#111827' }}>
                          Diagnosis
                        </h3>
                        <p style={{ margin: '0.5rem 0 0 0', color: '#374151' }}>
                          {prescription.diagnosis}
                        </p>
                      </div>
                      <span
                        style={{
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <Calendar size={14} />
                        {formatDate(prescription.created_at)}
                      </span>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                      <h4
                        style={{
                          margin: '0 0 0.75rem 0',
                          fontSize: '0.95rem',
                          color: '#111827',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <Pill size={16} />
                        Prescribed Medicines
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {parseMedications(prescription.medications).map((med: MedicationItem, idx: number) => (
                          <div
                            key={idx}
                            style={{
                              padding: '0.75rem',
                              backgroundColor: '#f9fafb',
                              borderRadius: '6px',
                              border: '1px solid #e5e7eb',
                            }}
                          >
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                gap: '0.5rem',
                              }}
                            >
                              <div>
                                <strong style={{ fontSize: '0.875rem', color: '#111827' }}>
                                  {med.name}
                                </strong>
                              </div>
                              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                <strong>Dosage:</strong> {med.dosage}
                              </div>
                              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                <strong>Frequency:</strong> {med.frequency}
                              </div>
                              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                <strong>Duration:</strong> {med.duration}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {prescription.instructions && (
                      <div style={{ marginTop: '1rem' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', color: '#111827' }}>
                          Instructions
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                          {prescription.instructions}
                        </p>
                      </div>
                    )}

                    {prescription.follow_up_date && (
                      <div style={{ marginTop: '1rem' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', color: '#111827' }}>
                          Follow-up Date
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                          {formatDate(prescription.follow_up_date)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
