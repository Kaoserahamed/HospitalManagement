import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatient, useDeletePatient } from './hooks';
import { Card, Button, Spinner } from '../../components/ui';

export const PatientDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const patientId = Number(id);
  const { data: patient, isLoading } = usePatient(patientId);
  const deleteMutation = useDeletePatient();

  if (isLoading) return <Spinner />;
  if (!patient) return <div>Patient not found</div>;

  const handleDelete = () => {
    if (window.confirm('Delete this patient?')) {
      deleteMutation.mutate(patientId, { onSuccess: () => navigate('/patients') });
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>{patient.full_name || `${patient.first_name} ${patient.last_name}`}</h1>
        <div>
          <Button variant="secondary" onClick={() => navigate(`/patients/${patientId}/edit`)}>
            Edit
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
      <Card title="Demographics">
        <p>DOB: {patient.dob}</p>
        <p>Gender: {patient.gender}</p>
        <p>Phone: {patient.phone || '-'}</p>
        <p>Address: {patient.address || '-'}</p>
        <p>Status: {patient.status}</p>
      </Card>
      <Card title="Insurance">
        <p>Provider: {patient.insurance_provider || '-'}</p>
        <p>Number: {patient.insurance_number || '-'}</p>
      </Card>
    </div>
  );
};

export default PatientDetailPage;
