import React, { useState } from 'react';
import { useBackups, useRunBackup } from './hooks';
import { Table, Pagination, Button, Badge } from '../../components/ui';

export const BackupListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useBackups({ page, per_page: 20 });
  const runMutation = useRunBackup();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Backups</h1>
        <Button onClick={() => (window.location.href = '/backup/new')}>New Backup</Button>
      </div>
      <Table
        data={data?.items || (Array.isArray(data) ? data : [])}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'backup_type', header: 'Type' },
          { key: 'status', header: 'Status', render: (row: any) => <Badge variant={row.status === 'completed' ? 'success' : row.status === 'failed' ? 'danger' : 'info'}>{row.status}</Badge> },
          { key: 'size_bytes', header: 'Size (bytes)' },
          { key: 'file_path', header: 'File' },
          { key: 'actions', header: 'Actions', render: (row: any) => row.status === 'pending' ? <Button size="sm" onClick={() => runMutation.mutate(row.id)}>Run</Button> : null },
        ]}
        rowKey={(row: any) => row.id}
      />
      <Pagination page={page} totalPages={data?.total_pages || 1} onPageChange={setPage} />
    </div>
  );
};

export default BackupListPage;
