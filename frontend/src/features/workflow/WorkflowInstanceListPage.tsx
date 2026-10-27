import React, { useState } from 'react';
import { useWorkflowInstances, useWorkflowProgress } from './hooks';
import { Table, Pagination, Button, Badge } from '../../components/ui';

export const WorkflowInstanceListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useWorkflowInstances({ page, per_page: 20 });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Workflows</h1>
        <Button onClick={() => (window.location.href = '/workflow/new')}>Start Workflow</Button>
      </div>
      <Table
        data={data?.items || (Array.isArray(data) ? data : [])}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'definition_id', header: 'Definition' },
          { key: 'entity_type', header: 'Entity Type' },
          { key: 'entity_id', header: 'Entity ID' },
          { key: 'status', header: 'Status', render: (row: any) => <Badge variant={row.status === 'completed' ? 'success' : row.status === 'cancelled' ? 'danger' : 'info'}>{row.status}</Badge> },
          { key: 'current_step', header: 'Current Step' },
        ]}
        rowKey={(row: any) => row.id}
      />
      <Pagination page={page} totalPages={data?.total_pages || 1} onPageChange={setPage} />
    </div>
  );
};

export default WorkflowInstanceListPage;
