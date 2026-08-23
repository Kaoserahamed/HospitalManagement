import { useState, FormEvent } from 'react'
import { X } from 'lucide-react'
import { departmentAPI, Department, DoctorWithDepartment } from '../api/department'
import './CreateUserModal.css'

interface AssignDoctorModalProps {
  onClose: () => void
  onAssignmentComplete: () => void
  doctors: DoctorWithDepartment[]
  departments: Department[]
}

const AssignDoctorModal = ({ onClose, onAssignmentComplete, doctors, departments }: AssignDoctorModalProps) => {
  const [formData, setFormData] = useState({
    user_id: '',
    department_id: '',
    specialization: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'assign' | 'remove'>('assign')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'assign') {
        await departmentAPI.assignDoctor({
          user_id: formData.user_id,
          department_id: formData.department_id,
          specialization: formData.specialization || undefined
        })
      } else {
        await departmentAPI.removeAssignment(formData.user_id)
      }
      onAssignmentComplete()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Operation failed')
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

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={stopPropagation}>
        <div className="modal-header">
          <h2>Manage Doctor Assignment</h2>
          <button type="button" onClick={onClose} className="close-button">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" onClick={stopPropagation}>
          <div className="form-group">
            <label>Action *</label>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="radio"
                  checked={mode === 'assign'}
                  onChange={() => setMode('assign')}
                  disabled={loading}
                />
                Assign to Department
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="radio"
                  checked={mode === 'remove'}
                  onChange={() => setMode('remove')}
                  disabled={loading}
                />
                Remove Assignment
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="user_id">Select Doctor *</label>
            <select
              id="user_id"
              value={formData.user_id}
              onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              required
              disabled={loading}
            >
              <option value="">-- Select Doctor --</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  Dr. {doc.first_name} {doc.last_name}
                  {doc.department_name ? ` (${doc.department_name})` : ' (Unassigned)'}
                </option>
              ))}
            </select>
          </div>

          {mode === 'assign' && (
            <>
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
                <label htmlFor="specialization">Specialization</label>
                <input
                  id="specialization"
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="e.g., Cardiologist"
                  disabled={loading}
                />
              </div>
            </>
          )}

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Processing...' : mode === 'assign' ? 'Assign Doctor' : 'Remove Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AssignDoctorModal
