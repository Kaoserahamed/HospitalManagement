import React, { useState } from 'react';
import { useCheckIns, useCallPatient, useCompleteCheckIn } from './hooks';
import { Table, Pagination, Button, Badge } from '../../components/ui';

export const CheckInListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useCheckIns({ page, per_page: 20 });
  const callMutation = useCallPatient();
  const completeMutation = useCompleteCheckIn();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Check-in & Queue</h1>
        <Button onClick={() => (window.location.href = '/checkin/new')}>New Check-in</Button>
      </div>
      <Table
        data={data?.items || []}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'patient_id', header: 'Patient' },
          { key: 'department_id', header: 'Department' },
          { key: 'priority', header: 'Priority' },
          { key: 'status', header: 'Status', render: (row: any) => <Badge variant={row.status === 'completed' ? 'success' : row.status === 'called' ? 'warning' : 'info'}>{row.status}</Badge> },
          { key: 'estimated_wait_minutes', header: 'Wait (min)' },
          {
            key: 'actions',
            header: 'Actions',
            render: (row: any) => (
              <div>
                <Button size="sm" onClick={() => callMutation.mutate(row.id)}>Call</Button>
                <Button size="sm" variant="primary" onClick={() => completeMutation.mutate(row.id)}>Complete</Button>
              </div>
            ),
          },
        ]}
        rowKey={(row: any) => row.id}
      />
      <Pagination page={page} totalPages={data?.total_pages || 1} onPageChange={setPage} />
    </div>
  );
};

export default CheckInListPage;
