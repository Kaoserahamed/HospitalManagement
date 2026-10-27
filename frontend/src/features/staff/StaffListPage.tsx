import React, { useState } from 'react';
import { useStaffProfiles } from './hooks';
import { Table, Pagination, Button, Badge } from '../../components/ui';

export const StaffListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useStaffProfiles({ page, per_page: 20 });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Staff</h1>
        <Button onClick={() => (window.location.href = '/staff/new')}>New Staff</Button>
      </div>
      <Table
        data={data?.items || []}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'user_id', header: 'User' },
          { key: 'title', header: 'Title' },
          { key: 'specialty', header: 'Specialty' },
          { key: 'department_id', header: 'Department' },
          { key: 'is_active', header: 'Active', render: (row: any) => <Badge variant={row.is_active ? 'success' : 'danger'}>{row.is_active ? 'Active' : 'Inactive'}</Badge> },
        ]}
        rowKey={(row: any) => row.id}
      />
      <Pagination page={page} totalPages={data?.total_pages || 1} onPageChange={setPage} />
    </div>
  );
};

export default StaffListPage;
