import { useState } from 'react'
import { prescriptionAPI, MedicationItem, PrescriptionCreate } from '../api/prescription'
import { X, Plus, Trash2 } from 'lucide-react'
import './CreateUserModal.css'

interface PrescriptionModalProps {
  appointmentId: string
  patientId: string
  patientName: string
  onClose: () => void
  onSuccess: () => void
}

const PrescriptionModal = ({
  appointmentId,
  patientId,
  patientName,
  onClose,
  onSuccess,
}: PrescriptionModalProps) => {
  const [diagnosis, setDiagnosis] = useState('')
  const [medications, setMedications] = useState<MedicationItem[]>([
    { name: '', dosage: '', frequency: '', duration: '' },
  ])
  const [instructions, setInstructions] = useState('')
  const [followUpDate, setFollowUpDate] = useState('')
  const [loading, setLoading] = useState(false)

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '' }])
  }

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index))
    }
  }

  const updateMedication = (index: number, field: keyof MedicationItem, value: string) => {
    const updated = [...medications]
    updated[index][field] = value
    setMedications(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!diagnosis.trim()) {
      alert('Please enter diagnosis')
      return
    }

    const validMedications = medications.filter(
      (med) => med.name.trim() && med.dosage.trim() && med.frequency.trim() && med.duration.trim()
    )

    if (validMedications.length === 0) {
      alert('Please add at least one complete medication')
      return
    }

    setLoading(true)
    try {
      const data: PrescriptionCreate = {
        appointment_id: appointmentId,
        patient_id: patientId,
        diagnosis: diagnosis.trim(),
        medications: validMedications,
        instructions: instructions.trim() || undefined,
        follow_up_date: followUpDate || undefined,
      }

      await prescriptionAPI.create(data)
      alert('Prescription created successfully')
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Failed to create prescription:', error)
      alert(error.response?.data?.detail || 'Failed to create prescription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="modal-header">
          <h2>Create Prescription</h2>
          <button className="close-button" onClick={onClose} type="button">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem', fontWeight: '600', color: '#374151' }}>Patient</label>
            <input 
              type="text" 
              value={patientName} 
              disabled 
              style={{ 
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#f3f4f6', 
                color: '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.95rem',
                cursor: 'not-allowed',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem', fontWeight: '600', color: '#374151' }}>
              Diagnosis <span style={{ color: 'red' }}>*</span>
            </label>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Enter diagnosis"
              rows={3}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <label style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600', color: '#374151' }}>
                Medications <span style={{ color: 'red' }}>*</span>
              </label>
              <button
                type="button"
                onClick={addMedication}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.4rem 0.8rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                <Plus size={16} />
                Add Medication
              </button>
            </div>

            {medications.map((med, index) => (
              <div
                key={index}
                style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.75rem',
                  }}
                >
                  <strong style={{ fontSize: '0.9rem', color: '#374151' }}>
                    Medication {index + 1}
                  </strong>
                  {medications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedication(index)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.3rem 0.6rem',
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  )}
                </div>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="Medicine name"
                    value={med.name}
                    onChange={(e) => updateMedication(index, 'name', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Dosage (e.g., 500mg)"
                    value={med.dosage}
                    onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Frequency (e.g., 2 times daily)"
                    value={med.frequency}
                    onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g., 7 days)"
                    value={med.duration}
                    onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem', fontWeight: '600', color: '#374151' }}>Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Additional instructions for patient (optional)"
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem', fontWeight: '600', color: '#374151' }}>Follow-up Date</label>
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.95rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div className="modal-actions" style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'flex-end',
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button 
              type="button" 
              onClick={onClose} 
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Creating...' : 'Create Prescription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PrescriptionModal
