import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { scheduleAPI, DoctorSchedule, DoctorScheduleCreate, DayOfWeek } from '../api/schedule'
import { authAPI } from '../api/auth'
import { User } from '../types'
import '../components/CreateUserModal.css'

interface ScheduleManagementProps {
  doctors: User[]
  onClose: () => void
}

const ScheduleManagement = ({ doctors, onClose }: ScheduleManagementProps) => {
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSchedules()
  }, [])

  const loadSchedules = async () => {
    try {
      const data = await scheduleAPI.getAllSchedules()
      setSchedules(data)
    } catch (error) {
      console.error('Failed to load schedules:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSchedule = () => {
    setShowCreateModal(false)
    loadSchedules()
  }

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return

    try {
      await scheduleAPI.deleteSchedule(scheduleId)
      loadSchedules()
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

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Doctor Schedules</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setShowCreateModal(true)} className="create-button">
            <Plus size={20} />
            Add Schedule
          </button>
          <button onClick={onClose} className="cancel-button">
            Close
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading schedules...</div>
      ) : schedules.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <p>No schedules created yet</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Click "Add Schedule" to create a doctor schedule
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              style={{
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                padding: '1.5rem',
                backgroundColor: schedule.is_active ? 'white' : '#f9f9f9',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3 style={{ marginBottom: '0.5rem' }}>{getDoctorName(schedule.doctor_id)}</h3>
                  <p style={{ color: '#666', textTransform: 'capitalize' }}>
                    <strong>Day:</strong> {schedule.day_of_week}
                  </p>
                  <p style={{ color: '#666' }}>
                    <strong>Time:</strong> {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                  </p>
                  <p style={{ color: '#666' }}>
                    <strong>Slot Duration:</strong> {schedule.slot_duration} minutes
                  </p>
                  <p style={{ color: '#666' }}>
                    <strong>Status:</strong>{' '}
                    <span style={{ color: schedule.is_active ? '#10b981' : '#ef4444' }}>
                      {schedule.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteSchedule(schedule.id)}
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
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateScheduleModal doctors={doctors} onClose={() => setShowCreateModal(false)} onCreate={handleCreateSchedule} />
      )}
    </div>
  )
}

// Create Schedule Modal
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
            <X size={24} />
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

export default ScheduleManagement
