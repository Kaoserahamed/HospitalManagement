/**
 * Shared appointment display utilities.
 *
 * These helpers were previously inlined in ReceptionistDashboard /
 * DoctorDashboard / PatientDashboard and duplicated across each page.
 * Centralising them here removes the copy-paste drift and gives every
 * status badge / date / time rendering a single source of truth.
 */

import type { AppointmentStatus } from '../api/appointment';

/** Hex colour (without alpha) used for status badges and accents. */
const STATUS_COLORS: Record<string, string> = {
  scheduled: '#3b82f6', // blue
  confirmed: '#10b981', // green
  completed: '#6b7280', // gray
  cancelled: '#ef4444', // red
  no_show: '#f59e0b', // amber
};

const DEFAULT_STATUS_COLOR = '#6b7280';

/** Map an appointment status to its display colour. */
export const getStatusColor = (status: string): string => {
  return STATUS_COLORS[status] ?? DEFAULT_STATUS_COLOR;
};

/** Format an ISO date string (YYYY-MM-DD) to a locale date string. */
export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/** Format an ISO time string (HH:MM) to a locale time string. */
export const formatTime = (timeStr: string): string => {
  return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/** Human-readable label for a status value. */
export const getStatusLabel = (status: AppointmentStatus | string): string => {
  const labels: Record<string, string> = {
    scheduled: 'Scheduled',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    no_show: 'No Show',
  };
  return labels[status] ?? status.charAt(0).toUpperCase() + status.slice(1);
};

/** Sort appointments by date+time, most-recent first. */
export const sortAppointmentsByDate = <
  T extends { appointment_date: string; appointment_time: string },
>(
  appointments: T[]
): T[] => {
  return [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`);
    const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`);
    return dateB.getTime() - dateA.getTime();
  });
};

export { AppointmentStatus };
