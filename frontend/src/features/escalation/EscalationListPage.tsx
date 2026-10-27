import React from 'react';
import { useEscalations, useResolveEscalation } from './hooks';
import { Table, Button, Badge } from '../../components/ui';

export const EscalationListPage: React.FC = () => {
  const { data, isLoading } = useEscalations();
  const resolveMutation = useResolveEscalation();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Escalations</h1>
      </div>
      <Table
        data={data?.items || (Array.isArray(data) ? data : [])}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'patient_id', header: 'Patient' },
          { key: 'source_type', header: 'Source' },
          { key: 'level', header: 'Level' },
          { key: 'status', header: 'Status', render: (row: any) => <Badge variant={row.status === 'resolved' ? 'success' : row.status === 'escalated' ? 'danger' : 'warning'}>{row.status}</Badge> },
          { key: 'notes', header: 'Notes' },
          { key: 'actions', header: 'Actions', render: (row: any) => row.status !== 'resolved' ? <Button size="sm" onClick={() => resolveMutation.mutate({ id: row.id })}>Resolve</Button> : null },
        ]}
        rowKey={(row: any) => row.id}
      />
    </div>
  );
};

export default EscalationListPage;
