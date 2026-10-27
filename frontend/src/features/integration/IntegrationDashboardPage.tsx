import React from 'react';
import { useAdapters, useSyncAdapter } from './hooks';
import { Table, Button, Badge } from '../../components/ui';

export const IntegrationDashboardPage: React.FC = () => {
  const { data, isLoading } = useAdapters();
  const syncMutation = useSyncAdapter();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Integrations</h1>
        <Button onClick={() => (window.location.href = '/integration/new')}>New Adapter</Button>
      </div>
      <Table
        data={Array.isArray(data) ? data : data?.items || []}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'name', header: 'Name' },
          { key: 'adapter_type', header: 'Type' },
          { key: 'endpoint', header: 'Endpoint' },
          { key: 'status', header: 'Status', render: (row: any) => <Badge variant={row.status === 'active' ? 'success' : row.status === 'error' ? 'danger' : 'warning'}>{row.status}</Badge> },
          { key: 'last_sync', header: 'Last Sync' },
          { key: 'actions', header: 'Actions', render: (row: any) => <Button size="sm" onClick={() => syncMutation.mutate(row.id)}>Sync</Button> },
        ]}
        rowKey={(row: any) => row.id}
      />
    </div>
  );
};

export default IntegrationDashboardPage;
