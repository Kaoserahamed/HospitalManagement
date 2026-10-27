import React from 'react';
import { useSecurityEvents, useSecuritySummary } from './hooks';
import { Table, Card, Badge } from '../../components/ui';

export const SecurityDashboardPage: React.FC = () => {
  const { data: events } = useSecurityEvents();
  const { data: summary } = useSecuritySummary();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Security</h1>
      </div>
      <Card title="Summary">
        <p>MFA Enabled Users: {summary?.mfa_enabled_users ?? 0}</p>
        <p>SSO Links: {summary?.sso_links ?? 0}</p>
        <p>Active Keys: {summary?.active_keys ?? 0}</p>
        <p>Recent Events: {summary?.recent_events ?? 0}</p>
      </Card>
      <Card title="Security Events">
        <Table
          data={events?.items || (Array.isArray(events) ? events : [])}
          columns={[
            { key: 'id', header: 'ID' },
            { key: 'user_id', header: 'User' },
            { key: 'event_type', header: 'Event' },
            { key: 'severity', header: 'Severity', render: (row: any) => <Badge variant={row.severity === 'critical' ? 'danger' : row.severity === 'warning' ? 'warning' : 'info'}>{row.severity}</Badge> },
            { key: 'ip_address', header: 'IP' },
            { key: 'occurred_at', header: 'When' },
          ]}
          rowKey={(row: any) => row.id}
        />
      </Card>
    </div>
  );
};

export default SecurityDashboardPage;
