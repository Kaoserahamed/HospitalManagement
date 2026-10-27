import React, { useState } from 'react';
import { useVideoSessions } from './hooks';
import { Table, Pagination, Button, Badge } from '../../components/ui';

export const VideoSessionListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useVideoSessions({ page, per_page: 20 });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Video Consultations</h1>
        <Button onClick={() => (window.location.href = '/video/new')}>New Session</Button>
      </div>
      <Table
        data={data?.items || (Array.isArray(data) ? data : [])}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'visit_id', header: 'Visit' },
          { key: 'room_id', header: 'Room' },
          { key: 'quality', header: 'Quality' },
          { key: 'status', header: 'Status', render: (row: any) => <Badge variant={row.status === 'connected' ? 'success' : row.status === 'failed' ? 'danger' : 'info'}>{row.status}</Badge> },
          { key: 'participant_count', header: 'Participants' },
        ]}
        rowKey={(row: any) => row.id}
      />
      <Pagination page={page} totalPages={data?.total_pages || 1} onPageChange={setPage} />
    </div>
  );
};

export default VideoSessionListPage;
