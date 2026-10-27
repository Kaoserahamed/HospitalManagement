import React from 'react';
import { useReportDefinitions, useRunReport } from './hooks';
import { Table, Button, Badge } from '../../components/ui';

export const ReportListPage: React.FC = () => {
  const { data, isLoading } = useReportDefinitions();
  const runMutation = useRunReport();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Reporting</h1>
        <Button onClick={() => (window.location.href = '/reporting/new')}>New Report</Button>
      </div>
      <Table
        data={Array.isArray(data) ? data : data?.items || []}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'name', header: 'Name' },
          { key: 'format', header: 'Format' },
          { key: 'schedule', header: 'Schedule' },
          { key: 'is_active', header: 'Active', render: (row: any) => <Badge variant={row.is_active ? 'success' : 'danger'}>{row.is_active ? 'Active' : 'Inactive'}</Badge> },
          { key: 'actions', header: 'Actions', render: (row: any) => <Button size="sm" onClick={() => runMutation.mutate({ definition_id: row.id })}>Run</Button> },
        ]}
        rowKey={(row: any) => row.id}
      />
    </div>
  );
};

export default ReportListPage;
