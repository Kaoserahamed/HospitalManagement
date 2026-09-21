/**
 * Reusable appointment card list.
 *
 * Extracts the appointment rendering previously inlined in
 * ReceptionistDashboard so that DoctorDashboard, PatientDashboard,
 * and any future view can share a single, tested component.
 */

import { Calendar, LogOut } from 'lucide-react'
import { useState } from 'react'

import type { AppointmentStatus, AppointmentWithDetails } from '../api/appointment'
import { formatDate, formatTime, getStatusColor } from '../utils/appointmentFormatting'

export interface AppointmentTableProps {
  appointments: AppointmentWithDetails[]
  onCancel?: (appointmentId: string) => Promise<void>
  /** When true, shows a cancel button for active appointments. */
  showCancel?: boolean
  /** Optional empty-state text override. */
  emptyMessage?: string
}

const AppointmentTable = ({
  appointments,
  onCancel,
  showCancel = false,
  emptyMessage = 'No appointments found',
}: AppointmentTableProps) => {
  const [cancelling, setCancelling] = useState<string | null>(null)

  const handleCancel = async (id: string) => {
    if (!onCancel) return
    setCancelling(id)
    try {
      await onCancel(id)
    } finally {
      setCancelling(null)
    }
  }

  const showCancelButton = (status: AppointmentStatus | string) =>
    showCancel && (status === 'scheduled' || status === 'confirmed')

  if (appointments.length === 0) {
    return (
      <div className="empty-state">
        <Calendar size={48} style={{ color: '#ccc', marginBottom: '1rem' }} />
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="users-grid">
      {appointments.map((apt) => (
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
            {showCancelButton(apt.status) && onCancel && (
              <div
                style={{
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #f0f0f0',
                }}
              >
                <button
                  onClick={() => handleCancel(apt.id)}
                  disabled={cancelling === apt.id}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#fee',
                    color: '#c33',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: cancelling === apt.id ? 'wait' : 'pointer',
                  }}
                >
                  {cancelling === apt.id ? 'Cancelling...' : 'Cancel Appointment'}
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AppointmentTable
