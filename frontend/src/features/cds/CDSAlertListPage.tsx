import React from 'react';
import { useCDSRules, useCDSAlerts } from './hooks';
import { Table, Card, Badge } from '../../components/ui';

export const CDSAlertListPage: React.FC = () => {
  const { data: rules } = useCDSRules();
  const { data: alerts, isLoading } = useCDSAlerts();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Clinical Decision Support</h1>
      </div>
      <Card title="Rules">
        <Table data={Array.isArray(rules) ? rules : rules?.items || []} columns={[{ key: 'name', header: 'Name' }, { key: 'rule_type', header: 'Type' }, { key: 'priority', header: 'Priority' }]} rowKey={(r: any) => r.id} />
      </Card>
      <Card title="Alerts">
        <Table
          data={Array.isArray(alerts) ? alerts : alerts?.items || []}
          loading={isLoading}
          columns={[
            { key: 'id', header: 'ID' },
            { key: 'patient_id', header: 'Patient' },
            { key: 'alert_level', header: 'Level', render: (row: any) => <Badge variant={row.alert_level === 'critical' ? 'danger' : row.alert_level === 'warning' ? 'warning' : 'info'}>{row.alert_level}</Badge> },
            { key: 'message', header: 'Message' },
            { key: 'acknowledged', header: 'Ack' },
          ]}
          rowKey={(row: any) => row.id}
        />
      </Card>
    </div>
  );
};

export default CDSAlertListPage;
