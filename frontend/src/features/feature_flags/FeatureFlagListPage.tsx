import React from 'react';
import { useFeatureFlags, useToggleFeatureFlag } from './hooks';
import { Table, Button, Badge } from '../../components/ui';

export const FeatureFlagListPage: React.FC = () => {
  const { data, isLoading } = useFeatureFlags();
  const toggleMutation = useToggleFeatureFlag();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Feature Flags</h1>
        <Button onClick={() => (window.location.href = '/feature-flags/new')}>New Flag</Button>
      </div>
      <Table
        data={Array.isArray(data) ? data : data?.items || []}
        loading={isLoading}
        columns={[
          { key: 'key', header: 'Key' },
          { key: 'name', header: 'Name' },
          { key: 'enabled', header: 'Enabled', render: (row: any) => <Badge variant={row.enabled ? 'success' : 'danger'}>{row.enabled ? 'On' : 'Off'}</Badge> },
          { key: 'rollout_percentage', header: 'Rollout %' },
          { key: 'target_roles', header: 'Roles' },
          { key: 'actions', header: 'Actions', render: (row: any) => <Button size="sm" onClick={() => toggleMutation.mutate({ id: row.id, enabled: !row.enabled })}>Toggle</Button> },
        ]}
        rowKey={(row: any) => row.id}
      />
    </div>
  );
};

export default FeatureFlagListPage;
