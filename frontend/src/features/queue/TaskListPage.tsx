import React, { useState } from 'react';
import { useTasks, useQueueStats } from './hooks';
import { Table, Pagination, Button, Badge } from '../../components/ui';

export const TaskListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useTasks({ page, per_page: 20 });
  const { data: stats } = useQueueStats();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Task Queue</h1>
        <Button onClick={() => (window.location.href = '/queue/new')}>Enqueue Task</Button>
      </div>
      {stats ? (
        <div className="stats-bar">
          <span>Queued: {stats.queued}</span>
          <span>Running: {stats.running}</span>
          <span>Completed: {stats.completed}</span>
          <span>Failed: {stats.failed}</span>
        </div>
      ) : null}
      <Table
        data={data?.items || (Array.isArray(data) ? data : [])}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'name', header: 'Name' },
          { key: 'priority', header: 'Priority' },
          { key: 'status', header: 'Status', render: (row: any) => <Badge variant={row.status === 'completed' ? 'success' : row.status === 'failed' ? 'danger' : 'info'}>{row.status}</Badge> },
          { key: 'attempts', header: 'Attempts' },
        ]}
        rowKey={(row: any) => row.id}
      />
      <Pagination page={page} totalPages={data?.total_pages || 1} onPageChange={setPage} />
    </div>
  );
};

export default TaskListPage;
