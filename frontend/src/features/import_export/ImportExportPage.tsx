import React, { useState } from 'react';
import { useImports, useExports } from './hooks';
import { Table, Button, Badge } from '../../components/ui';

export const ImportExportPage: React.FC = () => {
  const { data: imports } = useImports();
  const { data: exports } = useExports();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Import / Export</h1>
      </div>
      <h2>Imports</h2>
      <Table
        data={imports?.items || (Array.isArray(imports) ? imports : [])}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'entity_type', header: 'Entity' },
          { key: 'file_name', header: 'File' },
          { key: 'status', header: 'Status', render: (row: any) => <Badge variant={row.status === 'completed' ? 'success' : row.status === 'failed' ? 'danger' : 'info'}>{row.status}</Badge> },
          { key: 'processed_rows', header: 'Processed' },
          { key: 'error_rows', header: 'Errors' },
        ]}
        rowKey={(row: any) => row.id}
      />
      <h2>Exports</h2>
      <Table
        data={exports?.items || (Array.isArray(exports) ? exports : [])}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'entity_type', header: 'Entity' },
          { key: 'format', header: 'Format' },
          { key: 'status', header: 'Status', render: (row: any) => <Badge variant={row.status === 'completed' ? 'success' : row.status === 'failed' ? 'danger' : 'info'}>{row.status}</Badge> },
          { key: 'row_count', header: 'Rows' },
          { key: 'file_path', header: 'File' },
        ]}
        rowKey={(row: any) => row.id}
      />
    </div>
  );
};

export default ImportExportPage;
