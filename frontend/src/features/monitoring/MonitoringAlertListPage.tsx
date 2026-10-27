import React from 'react';
import { useAlerts, useAcknowledgeAlert } from './hooks';
import { Table, Button, Badge } from '../../components/ui';

export const MonitoringAlertListPage: React.FC = () => {
  const { data, isLoading } = useAlerts();
  const ackMutation = useAcknowledgeAlert();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Monitoring Alerts</h1>
      </div>
      <Table
        data={Array.isArray(data) ? data : data?.items || []}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'patient_id', header: 'Patient' },
          { key: 'vital_type', header: 'Vital' },
          { key: 'value', header: 'Value' },
          { key: 'severity', header: 'Severity', render: (row: any) => <Badge variant={row.severity === 'critical' ? 'danger' : row.severity === 'warning' ? 'warning' : 'info'}>{row.severity}</Badge> },
          { key: 'message', header: 'Message' },
          { key: 'acknowledged', header: 'Ack', render: (row: any) => row.acknowledged ? 'Yes' : <Button size="sm" onClick={() => ackMutation.mutate(row.id)}>Ack</Button> },
        ]}
        rowKey={(row: any) => row.id}
      />
    </div>
  );
};

export default MonitoringAlertListPage;
