import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut, Plus, Users, Building2, Calendar } from 'lucide-react'
import { scheduleAPI, DoctorSchedule, DoctorScheduleCreate, DayOfWeek } from '../api/schedule'
import { authAPI } from '../api/auth'
import { User } from '../types'
import DataTable from '../components/DataTable'
import './Dashboard.css'

const SchedulesPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([])
  const [doctors, setDoctors] = useState<User[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const currentPath = location.pathname

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [allUsers, allSchedules] = await Promise.all([
        authAPI.getAllUsers(),
        scheduleAPI.getAllSchedules()
      ])
      setDoctors(allUsers.filter(u => u.role === 'doctor'))
      setSchedules(allSchedules)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSchedule = () => {
    setShowCreateModal(false)
    loadData()
  }

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return

    try {
      await scheduleAPI.deleteSchedule(scheduleId)
      loadData()
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to delete schedule')
    }
  }

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find((d) => d.id === doctorId)
    return doctor ? `Dr. ${doctor.first_name} ${doctor.last_name}` : 'Unknown'
  }

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  // Define columns for schedules table
  const schedulesColumns = [
    {
      key: 'doctor',
      header: 'Doctor',
      render: (_: any, row: DoctorSchedule) => <strong>{getDoctorName(row.doctor_id)}</strong>
    },
    {
      key: 'day_of_week',
      header: 'Day',
      render: (value: string) => (
        <span style={{ textTransform: 'capitalize' }}>{value}</span>
      )
    },
    {
      key: 'time',
      header: 'Time',
      render: (_: any, row: DoctorSchedule) => `${formatTime(row.start_time)} - ${formatTime(row.end_time)}`
    },
    {
      key: 'slot_duration',
      header: 'Duration',
      render: (value: number) => `${value} minutes`
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (value: boolean) => (
        <span className={value ? 'status-active' : 'status-inactive'}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: DoctorSchedule) => (
        <button
          onClick={() => handleDeleteSchedule(row.id)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fee2e2'
            e.currentTarget.style.borderColor = '#fca5a5'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#fef2f2'
            e.currentTarget.style.borderColor = '#fecaca'
          }}
        >
          Delete
        </button>
      )
    }
  ]

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
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
              <h2>Doctor Schedules</h2>
              <p>Manage doctor schedules and availability</p>
            </div>
            <button onClick={() => setShowCreateModal(true)} className="create-button">
              <Plus size={20} />
              Add Schedule
            </button>
          </div>

          <DataTable
            data={schedules}
            columns={schedulesColumns}
            emptyMessage="No schedules created yet"
            emptySubtitle='Click "Add Schedule" to create a doctor schedule'
          />
        </main>
      </div>

      {showCreateModal && (
        <CreateScheduleModal 
          doctors={doctors} 
          onClose={() => setShowCreateModal(false)} 
          onCreate={handleCreateSchedule} 
        />
      )}
    </div>
  )
}

// Create Schedule Modal Component
interface CreateScheduleModalProps {
  doctors: User[]
  onClose: () => void
  onCreate: () => void
}

const CreateScheduleModal = ({ doctors, onClose, onCreate }: CreateScheduleModalProps) => {
  const [formData, setFormData] = useState<DoctorScheduleCreate>({
    doctor_id: '',
    day_of_week: 'monday',
    start_time: '09:00',
    end_time: '17:00',
    slot_duration: 30,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await scheduleAPI.createSchedule(formData)
      alert('Schedule created successfully!')
      onCreate()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create schedule')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Doctor Schedule</h2>
          <button type="button" onClick={onClose} className="close-button">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="doctor_id">Doctor *</label>
            <select
              id="doctor_id"
              value={formData.doctor_id}
              onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
              required
              disabled={loading}
            >
              <option value="">-- Select Doctor --</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.first_name} {doctor.last_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="day_of_week">Day of Week *</label>
            <select
              id="day_of_week"
              value={formData.day_of_week}
              onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value as DayOfWeek })}
              required
              disabled={loading}
            >
              <option value="monday">Monday</option>
              <option value="tuesday">Tuesday</option>
              <option value="wednesday">Wednesday</option>
              <option value="thursday">Thursday</option>
              <option value="friday">Friday</option>
              <option value="saturday">Saturday</option>
              <option value="sunday">Sunday</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_time">Start Time *</label>
              <input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="end_time">End Time *</label>
              <input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="slot_duration">Slot Duration (minutes) *</label>
            <select
              id="slot_duration"
              value={formData.slot_duration}
              onChange={(e) => setFormData({ ...formData, slot_duration: parseInt(e.target.value) })}
              required
              disabled={loading}
            >
              <option value="15">15 minutes</option>
              <option value="20">20 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Creating...' : 'Create Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SchedulesPage