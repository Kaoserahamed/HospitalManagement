import { useState, FormEvent } from 'react'
import { X } from 'lucide-react'
import { departmentAPI, Department } from '../api/department'
import './CreateUserModal.css'

interface CreateDepartmentModalProps {
  onClose: () => void
  onDepartmentCreated: (department: Department) => void
}

const CreateDepartmentModal = ({ onClose, onDepartmentCreated }: CreateDepartmentModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const newDepartment = await departmentAPI.createDepartment({
        name: formData.name,
        description: formData.description || undefined
      })
      onDepartmentCreated(newDepartment)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create department')
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
          <h2>Create New Department</h2>
          <button type="button" onClick={onClose} className="close-button">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" onClick={stopPropagation}>
          <div className="form-group">
            <label htmlFor="name">Department Name *</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Cardiology"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the department"
              disabled={loading}
              rows={4}
              style={{
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Creating...' : 'Create Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateDepartmentModal
