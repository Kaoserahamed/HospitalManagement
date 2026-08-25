import { useState, useEffect } from 'react'
import { prescriptionAPI, Prescription } from '../api/prescription'
import { X, FileText, Calendar, Pill } from 'lucide-react'
import './CreateUserModal.css'

interface PatientHistoryModalProps {
  patientId: string
  patientName: string
  onClose: () => void
}

const PatientHistoryModal = ({ patientId, patientName, onClose }: PatientHistoryModalProps) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const loadHistory = async () => {
      try {
        const prescs = await prescriptionAPI.getPatientPrescriptions(patientId)
        setPrescriptions(prescs)
      } catch (error) {
        console.error('Failed to load patient history:', error)
      } finally {
        setLoading(false)
      }
    }
    loadHistory()
  }, [patientId])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const parseMedications = (medicationsJson: string) => {
    try {
      return JSON.parse(medicationsJson)
    } catch {
      return []
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '800px', maxHeight: '90vh', overflow: 'auto' }}
      >
        <div className="modal-header">
          <div>
            <h2>Patient Medical History</h2>
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>{patientName}</p>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              Loading history...
            </div>
          ) : prescriptions.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem',
                color: '#999',
              }}
            >
              <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p>No prescription history found</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {prescriptions.map((presc) => (
                <div
                  key={presc.id}
                  style={{
                    padding: '1.5rem',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
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
                        {presc.diagnosis}
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
                      {formatDate(presc.created_at)}
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
                      Medications
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {parseMedications(presc.medications).map((med: any, idx: number) => (
                        <div
                          key={idx}
                          style={{
                            padding: '0.75rem',
                            backgroundColor: 'white',
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
                              {med.dosage}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                              {med.frequency}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                              {med.duration}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {presc.instructions && (
                    <div style={{ marginTop: '1rem' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', color: '#111827' }}>
                        Instructions
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                        {presc.instructions}
                      </p>
                    </div>
                  )}

                  {presc.follow_up_date && (
                    <div style={{ marginTop: '1rem' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', color: '#111827' }}>
                        Follow-up Date
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                        {formatDate(presc.follow_up_date)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PatientHistoryModal
