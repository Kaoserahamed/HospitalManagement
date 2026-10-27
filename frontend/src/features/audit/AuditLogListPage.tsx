import React, { useState } from 'react';
import { useAuditLogs } from './hooks';
import { Table, Pagination, Badge } from '../../components/ui';

export const AuditLogListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAuditLogs({ page, per_page: 50 });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Audit Logs</h1>
      </div>
      <Table
        data={data?.items || (Array.isArray(data) ? data : [])}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'actor_id', header: 'Actor' },
          { key: 'action', header: 'Action' },
          { key: 'resource_type', header: 'Resource' },
          { key: 'resource_id', header: 'Resource ID' },
          { key: 'severity', header: 'Severity', render: (row: any) => <Badge variant={row.severity === 'critical' ? 'danger' : row.severity === 'warning' ? 'warning' : 'info'}>{row.severity}</Badge> },
          { key: 'occurred_at', header: 'When' },
        ]}
        rowKey={(row: any) => row.id}
      />
      <Pagination page={page} totalPages={data?.total_pages || 1} onPageChange={setPage} />
    </div>
  );
};

export default AuditLogListPage;
