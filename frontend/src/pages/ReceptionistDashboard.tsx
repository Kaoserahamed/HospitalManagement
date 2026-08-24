import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { LogOut, Calendar, Filter, Plus, UserPlus } from 'lucide-react'
import { appointmentAPI, AppointmentWithDetails, AppointmentStatus } from '../api/appointment'
import { authAPI, PatientRegisterData } from '../api/auth'
import { departmentAPI, Department, DoctorWithDepartment } from '../api/department'
import { scheduleAPI, AvailableSlot } from '../api/schedule'
import './Dashboard.css'

interface PatientUser {
  id: string
  nid: string
  first_name: string
  last_name: string
  phone: string
  is_active: boolean
}

const ReceptionistDashboard = () => {
  const { user, logout } = useAuth()
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([])
  const [patients, setPatients] = useState<PatientUser[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all')
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)

  useEffect(() => {
    loadData()
  }, [statusFilter])

  const loadData = async () => {
    try {
      const [appts, patientsList] = await Promise.all([
        appointmentAPI.getAllAppointments(statusFilter === 'all' ? undefined : statusFilter),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/patients`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }).then(res => res.json())
      ])
      setAppointments(appts)
      setPatients(patientsList)
    } catch (error) {
      console.error('Failed to load data:', error)
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
      loadData()
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to cancel appointment')
    }
  }

  const handleRegisterPatient = () => {
    setShowRegisterModal(false)
    loadData()
  }

  const handleBookAppointment = () => {
    setShowBookingModal(false)
    loadData()
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

  // Sort appointments by date and time
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`)
    const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`)
    return dateB.getTime() - dateA.getTime()
  })

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
            <h2>Appointments</h2>
            <p>Manage all hospital appointments</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={() => setShowRegisterModal(true)}
              className="create-button"
              style={{ backgroundColor: '#10b981' }}
            >
              <UserPlus size={20} />
              Register Patient
            </button>
            <button onClick={() => setShowBookingModal(true)} className="create-button">
              <Plus size={20} />
              Book Appointment
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as AppointmentStatus | 'all')}
                style={{
                  padding: '0.5rem 1rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                <option value="all">All Appointments</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No Show</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            Loading appointments...
          </div>
        ) : sortedAppointments.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} style={{ color: '#ccc', marginBottom: '1rem' }} />
            <p>No appointments found</p>
            <p className="empty-subtitle">
              {statusFilter === 'all'
                ? 'No appointments in the system yet'
                : `No ${statusFilter} appointments`}
            </p>
          </div>
        ) : (
          <div className="users-grid">
            {sortedAppointments.map((apt) => (
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
                    <strong>Doctor:</strong> {apt.doctor_name}
                  </p>
                  <p>
                    <strong>Department:</strong> {apt.department_name}
                  </p>
                  <p>
                    <strong>Date:</strong> {formatDate(apt.appointment_date)}
                  </p>
                  <p>
                    <strong>Time:</strong> {formatTime(apt.appointment_time)}
                  </p>
                  <p>
                    <strong>Patient Email:</strong> {apt.patient_email}
                  </p>
                  {apt.patient_phone && (
                    <p>
                      <strong>Patient Phone:</strong> {apt.patient_phone}
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
                  {(apt.status === 'scheduled' || apt.status === 'confirmed') && (
                    <div
                      style={{
                        marginTop: '1rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid #f0f0f0',
                      }}
                    >
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
            ))}
          </div>
        )}
      </main>

      {showRegisterModal && (
        <RegisterPatientModal onClose={() => setShowRegisterModal(false)} onRegistered={handleRegisterPatient} />
      )}

      {showBookingModal && (
        <BookAppointmentForPatientModal
          patients={patients}
          onClose={() => setShowBookingModal(false)}
          onBooked={handleBookAppointment}
        />
      )}
    </div>
  )
}

// Register Patient Modal Component
interface RegisterPatientModalProps {
  onClose: () => void
  onRegistered: () => void
}

const RegisterPatientModal = ({ onClose, onRegistered }: RegisterPatientModalProps) => {
  const [formData, setFormData] = useState<PatientRegisterData>({
    nid: '',
    phone: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: 'male',
    blood_group: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_history: '',
    allergies: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = {
        ...formData,
        blood_group: formData.blood_group || undefined,
        address: formData.address || undefined,
        emergency_contact_name: formData.emergency_contact_name || undefined,
        emergency_contact_phone: formData.emergency_contact_phone || undefined,
        medical_history: formData.medical_history || undefined,
        allergies: formData.allergies || undefined,
      }
      await authAPI.registerPatient(data)
      alert('Patient registered successfully!')
      onRegistered()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '700px', maxHeight: '90vh', overflow: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Register New Patient</h2>
          <button type="button" onClick={onClose} className="close-button">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>National ID (NID) *</label>
              <input
                type="text"
                value={formData.nid}
                onChange={(e) => setFormData({ ...formData, nid: e.target.value })}
                placeholder="Enter National ID"
                required
                disabled={loading}
                minLength={5}
              />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g., 01712345678"
                required
                disabled={loading}
                minLength={10}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Date of Birth *</label>
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                max={new Date().toISOString().split('T')[0]}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                required
                disabled={loading}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Blood Group</label>
              <select
                value={formData.blood_group}
                onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                disabled={loading}
              >
                <option value="">Select...</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Registering...' : 'Register Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Book Appointment for Patient Modal Component
interface BookAppointmentForPatientModalProps {
  patients: PatientUser[]
  onClose: () => void
  onBooked: () => void
}

const BookAppointmentForPatientModal = ({ patients, onClose, onBooked }: BookAppointmentForPatientModalProps) => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [doctors, setDoctors] = useState<DoctorWithDepartment[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<DoctorWithDepartment[]>([])
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [formData, setFormData] = useState({
    patient_id: '',
    department_id: '',
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    reason: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (formData.department_id) {
      const filtered = doctors.filter((d) => d.department_id === formData.department_id && d.is_active)
      setFilteredDoctors(filtered)
      setFormData({ ...formData, doctor_id: '', appointment_time: '' })
      setAvailableSlots([])
    } else {
      setFilteredDoctors([])
    }
  }, [formData.department_id])

  useEffect(() => {
    if (formData.doctor_id && formData.appointment_date) {
      loadAvailableSlots()
    } else {
      setAvailableSlots([])
      setFormData({ ...formData, appointment_time: '' })
    }
  }, [formData.doctor_id, formData.appointment_date])

  const loadData = async () => {
    try {
      const [depts, docs] = await Promise.all([
        departmentAPI.getAllDepartments(true),
        departmentAPI.getAllDoctorsWithDepartments(),
      ])
      setDepartments(depts)
      setDoctors(docs)
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const loadAvailableSlots = async () => {
    if (!formData.doctor_id || !formData.appointment_date) return

    setLoadingSlots(true)
    try {
      const slots = await scheduleAPI.getAvailability(formData.doctor_id, formData.appointment_date)
      setAvailableSlots(slots)
      if (slots.filter((s) => s.available).length === 0) {
        setError('No available slots for this date. Please select another date.')
      } else {
        setError('')
      }
    } catch (error: any) {
      console.error('Failed to load available slots:', error)
      setError(error.response?.data?.detail || 'Failed to load available time slots')
      setAvailableSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await appointmentAPI.createAppointmentForPatient(formData.patient_id, {
        doctor_id: formData.doctor_id,
        department_id: formData.department_id,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        reason: formData.reason || undefined,
      })
      alert('Appointment booked successfully!')
      onBooked()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to book appointment')
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Book Appointment for Patient</h2>
          <button type="button" onClick={onClose} className="close-button">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="patient_id">Patient *</label>
            <select
              id="patient_id"
              value={formData.patient_id}
              onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
              required
              disabled={loading}
            >
              <option value="">-- Select Patient --</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.first_name} {patient.last_name} ({patient.nid})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="department_id">Department *</label>
            <select
              id="department_id"
              value={formData.department_id}
              onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
              required
              disabled={loading}
            >
              <option value="">-- Select Department --</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="doctor_id">Doctor *</label>
            <select
              id="doctor_id"
              value={formData.doctor_id}
              onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
              required
              disabled={loading || !formData.department_id}
            >
              <option value="">-- Select Doctor --</option>
              {filteredDoctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  Dr. {doc.first_name} {doc.last_name}
                  {doc.specialization ? ` (${doc.specialization})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="appointment_date">Date *</label>
              <input
                id="appointment_date"
                type="date"
                value={formData.appointment_date}
                onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value, appointment_time: '' })}
                min={today}
                required
                disabled={loading || !formData.doctor_id}
              />
            </div>

            <div className="form-group">
              <label htmlFor="appointment_time">Time *</label>
              <select
                id="appointment_time"
                value={formData.appointment_time}
                onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                required
                disabled={loading || !formData.appointment_date || loadingSlots}
              >
                <option value="">
                  {loadingSlots
                    ? 'Loading slots...'
                    : !formData.appointment_date
                    ? '-- Select Date First --'
                    : '-- Select Time --'}
                </option>
                {availableSlots
                  .filter((slot) => slot.available)
                  .map((slot) => (
                    <option key={slot.time} value={slot.time}>
                      {new Date(`2000-01-01T${slot.time}`).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </option>
                  ))}
              </select>
              {formData.appointment_date && !loadingSlots && availableSlots.length === 0 && (
                <p style={{ fontSize: '0.85rem', color: '#e53e3e', marginTop: '0.25rem' }}>
                  Doctor has no schedule for this day
                </p>
              )}
              {formData.appointment_date &&
                !loadingSlots &&
                availableSlots.length > 0 &&
                availableSlots.filter((s) => s.available).length === 0 && (
                  <p style={{ fontSize: '0.85rem', color: '#e53e3e', marginTop: '0.25rem' }}>
                    All slots are booked for this date
                  </p>
                )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reason">Reason for Visit</label>
            <textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Brief description of symptoms or reason for visit"
              disabled={loading}
              rows={3}
              style={{
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReceptionistDashboard
