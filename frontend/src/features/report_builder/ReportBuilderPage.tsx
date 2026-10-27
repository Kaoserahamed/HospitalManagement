import React from 'react';
import { useReportTemplates, useReportExports } from './hooks';
import { Table, Button, Badge } from '../../components/ui';

export const ReportBuilderPage: React.FC = () => {
  const { data: templates } = useReportTemplates();
  const { data: exports } = useReportExports();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Report Builder</h1>
        <Button onClick={() => (window.location.href = '/report-builder/new')}>New Template</Button>
      </div>
      <h2>Templates</h2>
      <Table
        data={Array.isArray(templates) ? templates : templates?.items || []}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'name', header: 'Name' },
          { key: 'report_type', header: 'Type' },
          { key: 'format', header: 'Format' },
          { key: 'is_active', header: 'Active', render: (row: any) => <Badge variant={row.is_active ? 'success' : 'danger'}>{row.is_active ? 'Active' : 'Inactive'}</Badge> },
        ]}
        rowKey={(row: any) => row.id}
      />
      <h2>Recent Exports</h2>
      <Table
        data={Array.isArray(exports) ? exports : exports?.items || []}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'template_id', header: 'Template' },
          { key: 'format', header: 'Format' },
          { key: 'status', header: 'Status' },
          { key: 'row_count', header: 'Rows' },
          { key: 'file_path', header: 'File' },
        ]}
        rowKey={(row: any) => row.id}
      />
    </div>
  );
};

export default ReportBuilderPage;
