import React from 'react';
import { useParams } from 'react-router-dom';
import { useEncounter, useFinalizeEncounter } from './hooks';
import { Card, Button, Spinner, Badge } from '../../components/ui';

export const EncounterDetailPage: React.FC = () => {
  const { id } = useParams();
  const encounterId = Number(id);
  const { data: enc, isLoading } = useEncounter(encounterId);
  const finalizeMutation = useFinalizeEncounter();

  if (isLoading) return <Spinner />;
  if (!enc) return <div>Encounter not found</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Encounter #{enc.id}</h1>
        <Badge variant={enc.status === 'finalized' ? 'success' : 'info'}>{enc.status}</Badge>
      </div>
      <Card title="SOAP Note">
        <p><strong>Chief Complaint:</strong> {enc.chief_complaint || '-'}</p>
        <p><strong>Subjective:</strong> {enc.subjective || '-'}</p>
        <p><strong>Objective:</strong> {enc.objective || '-'}</p>
        <p><strong>Assessment:</strong> {enc.assessment || '-'}</p>
        <p><strong>Plan:</strong> {enc.plan || '-'}</p>
      </Card>
      <div className="page-actions">
        <Button variant="primary" onClick={() => finalizeMutation.mutate(encounterId)}>
          Finalize
        </Button>
      </div>
    </div>
  );
};

export default EncounterDetailPage;
