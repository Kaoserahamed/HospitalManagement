import React, { useState } from 'react';
import { useEncounters } from './hooks';
import { Table, Pagination, Button, Badge } from '../../components/ui';

export const EncounterListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useEncounters({ page, per_page: 20 });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Encounters (EHR)</h1>
        <Button onClick={() => (window.location.href = '/ehr/new')}>New Encounter</Button>
      </div>
      <Table
        data={data?.items || []}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'patient_id', header: 'Patient' },
          { key: 'doctor_id', header: 'Doctor' },
          { key: 'encounter_type', header: 'Type' },
          { key: 'chief_complaint', header: 'Complaint' },
          {
            key: 'status',
            header: 'Status',
            render: (row: any) => (
              <Badge variant={row.status === 'finalized' ? 'success' : row.status === 'open' ? 'info' : 'warning'}>
                {row.status}
              </Badge>
            ),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row: any) => (
              <Button size="sm" variant="ghost" onClick={() => (window.location.href = `/ehr/${row.id}`)}>
                View
              </Button>
            ),
          },
        ]}
        rowKey={(row: any) => row.id}
      />
      <Pagination page={page} totalPages={data?.total_pages || 1} onPageChange={setPage} />
    </div>
  );
};

export default EncounterListPage;
