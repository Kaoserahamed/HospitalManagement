import React from 'react';
import { useSwaps, useCoverageAlerts } from './hooks';
import { Table, Button, Badge } from '../../components/ui';

export const SchedulingDashboardPage: React.FC = () => {
  const { data: swaps } = useSwaps();
  const { data: alerts } = useCoverageAlerts();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Scheduling</h1>
        <Button onClick={() => (window.location.href = '/scheduling/swaps/new')}>New Swap</Button>
      </div>
      <h2>Shift Swaps</h2>
      <Table
        data={Array.isArray(swaps) ? swaps : swaps?.items || []}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'requester_id', header: 'Requester' },
          { key: 'target_id', header: 'Target' },
          { key: 'status', header: 'Status', render: (row: any) => <Badge variant={row.status === 'approved' ? 'success' : row.status === 'rejected' ? 'danger' : 'warning'}>{row.status}</Badge> },
        ]}
        rowKey={(row: any) => row.id}
      />
      <h2>Coverage Alerts</h2>
      <Table
        data={Array.isArray(alerts) ? alerts : alerts?.items || []}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'department_id', header: 'Department' },
          { key: 'date', header: 'Date' },
          { key: 'shift_type', header: 'Shift' },
          { key: 'status', header: 'Status' },
          { key: 'message', header: 'Message' },
        ]}
        rowKey={(row: any) => row.id}
      />
    </div>
  );
};

export default SchedulingDashboardPage;
