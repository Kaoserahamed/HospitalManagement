import React, { useState } from 'react';
import { useVisits } from './hooks';
import { Table, Pagination, Button, Badge } from '../../components/ui';

export const VisitListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useVisits({ page, per_page: 20 });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Telemedicine</h1>
        <Button onClick={() => (window.location.href = '/telemedicine/new')}>New Visit</Button>
      </div>
      <Table
        data={data?.items || []}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'patient_id', header: 'Patient' },
          { key: 'doctor_id', header: 'Doctor' },
          { key: 'scheduled_start', header: 'Scheduled' },
          { key: 'status', header: 'Status', render: (row: any) => <Badge variant={row.status === 'completed' ? 'success' : row.status === 'cancelled' ? 'danger' : 'info'}>{row.status}</Badge> },
          { key: 'session_quality', header: 'Quality' },
        ]}
        rowKey={(row: any) => row.id}
      />
      <Pagination page={page} totalPages={data?.total_pages || 1} onPageChange={setPage} />
    </div>
  );
};

export default VisitListPage;
