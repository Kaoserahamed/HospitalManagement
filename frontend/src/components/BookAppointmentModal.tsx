import { useState, useEffect, FormEvent } from 'react'
import { X } from 'lucide-react'
import { appointmentAPI } from '../api/appointment'
import { departmentAPI, Department, DoctorWithDepartment } from '../api/department'
import { scheduleAPI, AvailableSlot } from '../api/schedule'
import './CreateUserModal.css'

interface BookAppointmentModalProps {
  onClose: () => void
  onBooked: () => void
}

const BookAppointmentModal = ({ onClose, onBooked }: BookAppointmentModalProps) => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [doctors, setDoctors] = useState<DoctorWithDepartment[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<DoctorWithDepartment[]>([])
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await appointmentAPI.bookAppointment({
        doctor_id: formData.doctor_id,
        department_id: formData.department_id,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        reason: formData.reason || undefined,
      })
      onBooked()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to book appointment')
    } finally {
      setLoading(false)
    }
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={stopPropagation}>
        <div className="modal-header">
          <h2>Book Appointment</h2>
          <button type="button" onClick={onClose} className="close-button">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" onClick={stopPropagation}>
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
            {formData.department_id && filteredDoctors.length === 0 && (
              <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.25rem' }}>
                No doctors available in this department
              </p>
            )}
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
              placeholder="Brief description of your symptoms or reason for visit"
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

export default BookAppointmentModal
