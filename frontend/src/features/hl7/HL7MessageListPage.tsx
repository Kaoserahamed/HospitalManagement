import React, { useState } from 'react';
import { useHL7Messages } from './hooks';
import { Table, Pagination, Badge } from '../../components/ui';

export const HL7MessageListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useHL7Messages({ page, per_page: 20 });

  return (
    <div className="page">
      <div className="page-header">
        <h1>HL7 v2 Messages</h1>
      </div>
      <Table
        data={data?.items || (Array.isArray(data) ? data : [])}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'message_type', header: 'Type' },
          { key: 'event', header: 'Event' },
          { key: 'patient_id', header: 'Patient' },
          { key: 'status', header: 'Status', render: (row: any) => <Badge variant={row.status === 'processed' ? 'success' : row.status === 'failed' ? 'danger' : 'info'}>{row.status}</Badge> },
          { key: 'received_at', header: 'Received' },
        ]}
        rowKey={(row: any) => row.id}
      />
      <Pagination page={page} totalPages={data?.total_pages || 1} onPageChange={setPage} />
    </div>
  );
};

export default HL7MessageListPage;
