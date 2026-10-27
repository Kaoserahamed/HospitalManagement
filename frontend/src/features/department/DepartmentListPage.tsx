import React, { useState } from 'react';
import { useDepartments } from './hooks';
import { Table, Pagination, Button, Badge } from '../../components/ui';

export const DepartmentListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useDepartments({ page, per_page: 20 });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Departments</h1>
        <Button onClick={() => (window.location.href = '/departments/new')}>New Department</Button>
      </div>
      <Table
        data={data?.items || []}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'name', header: 'Name' },
          { key: 'location', header: 'Location' },
          { key: 'head_doctor_id', header: 'Head Doctor' },
          { key: 'is_active', header: 'Status', render: (row: any) => <Badge variant={row.is_active ? 'success' : 'danger'}>{row.is_active ? 'Active' : 'Inactive'}</Badge> },
        ]}
        rowKey={(row: any) => row.id}
      />
      <Pagination page={page} totalPages={data?.total_pages || 1} onPageChange={setPage} />
    </div>
  );
};

export default DepartmentListPage;
