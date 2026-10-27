import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppointment, useCancelAppointment, useCompleteAppointment } from './hooks';
import { Card, Button, Spinner, Badge } from '../../components/ui';

export const AppointmentDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const appointmentId = Number(id);
  const { data: appt, isLoading } = useAppointment(appointmentId);
  const cancelMutation = useCancelAppointment();
  const completeMutation = useCompleteAppointment();

  if (isLoading) return <Spinner />;
  if (!appt) return <div>Appointment not found</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Appointment #{appt.id}</h1>
        <Badge variant={appt.status === 'completed' ? 'success' : appt.status === 'cancelled' ? 'danger' : 'info'}>
          {appt.status}
        </Badge>
      </div>
      <Card title="Details">
        <p>Patient ID: {appt.patient_id}</p>
        <p>Doctor ID: {appt.doctor_id}</p>
        <p>Department ID: {appt.department_id || '-'}</p>
        <p>Start: {appt.start_time}</p>
        <p>End: {appt.end_time}</p>
        <p>Type: {appt.appointment_type}</p>
        <p>Duration: {appt.duration_minutes} min</p>
        <p>Notes: {appt.notes || '-'}</p>
      </Card>
      <div className="page-actions">
        <Button variant="secondary" onClick={() => navigate(`/appointments/${appointmentId}/edit`)}>
          Edit
        </Button>
        <Button variant="primary" onClick={() => completeMutation.mutate({ id: appointmentId })}>
          Complete
        </Button>
        <Button variant="danger" onClick={() => cancelMutation.mutate({ id: appointmentId })}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AppointmentDetailPage;
