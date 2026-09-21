import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { AppointmentWithDetails } from '../api/appointment'
import AppointmentTable from './AppointmentTable'

const makeAppointment = (
  overrides: Partial<AppointmentWithDetails> = {},
): AppointmentWithDetails => ({
  id: 'apt-1',
  patient_id: 'pat-1',
  patient_name: 'Jane Doe',
  patient_email: 'jane@example.com',
  patient_phone: '+1234567890',
  doctor_id: 'doc-1',
  doctor_name: 'Dr. Smith',
  doctor_email: 'drsmith@hospital.com',
  department_id: 'dept-1',
  department_name: 'Cardiology',
  appointment_date: '2024-03-15',
  appointment_time: '09:00:00',
  status: 'scheduled',
  reason: 'Routine checkup',
  notes: 'Patient has a family history of heart disease.',
  created_at: '2024-03-01T10:00:00Z',
  ...overrides,
})

describe('AppointmentTable', () => {
  it('renders an empty state when no appointments exist', () => {
    render(<AppointmentTable appointments={[]} />)
    expect(screen.getByText('No appointments found')).toBeInTheDocument()
  })

  it('renders a scheduled appointment with patient and doctor details', () => {
    const apt = makeAppointment({ status: 'scheduled' })
    render(<AppointmentTable appointments={[apt]} />)

    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('Dr. Smith')).toBeInTheDocument()
    expect(screen.getByText('Cardiology')).toBeInTheDocument()
    expect(screen.getByText(/March 15, 2024/)).toBeInTheDocument()
    expect(screen.getByText(/9:00 AM/)).toBeInTheDocument()
    expect(screen.getByText('scheduled')).toBeInTheDocument()
    expect(screen.getByText('Routine checkup')).toBeInTheDocument()
  })

  it('renders a confirmed appointment with status styling', () => {
    const apt = makeAppointment({ id: 'apt-2', status: 'confirmed' })
    render(<AppointmentTable appointments={[apt]} />)

    const statusBadge = screen.getByText('confirmed')
    expect(statusBadge).toBeInTheDocument()
    expect(statusBadge).toHaveStyle({ color: '#10b981' })
  })

  it('renders a completed appointment without a cancel button', () => {
    const apt = makeAppointment({ id: 'apt-3', status: 'completed' })
    render(
      <AppointmentTable
        appointments={[apt]}
        showCancel
        onCancel={vi.fn()}
      />,
    )

    expect(screen.getByText('completed')).toBeInTheDocument()
    expect(screen.queryByText('Cancel Appointment')).not.toBeInTheDocument()
  })

  it('renders a cancelled appointment without a cancel button', () => {
    const apt = makeAppointment({ id: 'apt-4', status: 'cancelled' })
    render(
      <AppointmentTable
        appointments={[apt]}
        showCancel
        onCancel={vi.fn()}
      />,
    )

    expect(screen.getByText('cancelled')).toBeInTheDocument()
    expect(screen.queryByText('Cancel Appointment')).not.toBeInTheDocument()
  })

  it('renders a no_show appointment with amber styling', () => {
    const apt = makeAppointment({ id: 'apt-5', status: 'no_show' })
    render(<AppointmentTable appointments={[apt]} />)

    const statusBadge = screen.getByText('no_show')
    expect(statusBadge).toHaveStyle({ color: '#f59e0b' })
  })

  it('shows cancel button for scheduled appointments and calls onCancel', async () => {
    const onCancel = vi.fn().mockResolvedValue(undefined)
    const apt = makeAppointment({ id: 'apt-6', status: 'scheduled' })
    render(
      <AppointmentTable appointments={[apt]} showCancel onCancel={onCancel} />,
    )

    const cancelBtn = screen.getByText('Cancel Appointment')
    await userEvent.click(cancelBtn)

    await waitFor(() => {
      expect(onCancel).toHaveBeenCalledWith('apt-6')
    })
  })

  it('omits optional patient phone and reason when not provided', () => {
    const apt = makeAppointment({
      id: 'apt-7',
      patient_phone: null,
      reason: null,
      notes: null,
    })
    render(<AppointmentTable appointments={[apt]} />)

    expect(screen.queryByText(/Patient Phone:/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Reason:/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Notes:/)).not.toBeInTheDocument()
  })
})
