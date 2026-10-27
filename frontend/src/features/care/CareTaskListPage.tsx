import React, { useState } from 'react';
import { useCareTasks, useCompleteCareTask } from './hooks';
import { Table, Pagination, Button, Badge } from '../../components/ui';

export const CareTaskListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useCareTasks({ page, per_page: 20 });
  const completeMutation = useCompleteCareTask();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Care Coordination</h1>
        <Button onClick={() => (window.location.href = '/care/tasks/new')}>New Task</Button>
      </div>
      <Table
        data={data?.items || []}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'patient_id', header: 'Patient' },
          { key: 'title', header: 'Title' },
          { key: 'priority', header: 'Priority' },
          { key: 'status', header: 'Status', render: (row: any) => <Badge variant={row.status === 'done' ? 'success' : row.status === 'in_progress' ? 'warning' : 'info'}>{row.status}</Badge> },
          { key: 'due_date', header: 'Due' },
          { key: 'actions', header: 'Actions', render: (row: any) => <Button size="sm" onClick={() => completeMutation.mutate(row.id)}>Complete</Button> },
        ]}
        rowKey={(row: any) => row.id}
      />
      <Pagination page={page} totalPages={data?.total_pages || 1} onPageChange={setPage} />
    </div>
  );
};

export default CareTaskListPage;
