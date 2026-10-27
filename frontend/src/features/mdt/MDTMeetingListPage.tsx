import React, { useState } from 'react';
import { useMeetings } from './hooks';
import { Table, Pagination, Button, Badge } from '../../components/ui';

export const MDTMeetingListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMeetings({ page, per_page: 20 });

  return (
    <div className="page">
      <div className="page-header">
        <h1>MDT Meetings</h1>
        <Button onClick={() => (window.location.href = '/mdt/new')}>New Meeting</Button>
      </div>
      <Table
        data={data?.items || []}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'patient_id', header: 'Patient' },
          { key: 'title', header: 'Title' },
          { key: 'scheduled_at', header: 'Scheduled' },
          { key: 'status', header: 'Status', render: (row: any) => <Badge variant={row.status === 'completed' ? 'success' : row.status === 'cancelled' ? 'danger' : 'info'}>{row.status}</Badge> },
          { key: 'duration_minutes', header: 'Duration (min)' },
        ]}
        rowKey={(row: any) => row.id}
      />
      <Pagination page={page} totalPages={data?.total_pages || 1} onPageChange={setPage} />
    </div>
  );
};

export default MDTMeetingListPage;
