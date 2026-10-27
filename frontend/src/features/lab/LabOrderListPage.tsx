import React, { useState } from 'react';
import { useLabOrders } from './hooks';
import { Table, Pagination, Button, Badge } from '../../components/ui';

export const LabOrderListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useLabOrders({ page, per_page: 20 });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Lab Orders</h1>
        <Button onClick={() => (window.location.href = '/lab/new')}>New Order</Button>
      </div>
      <Table
        data={data?.items || (Array.isArray(data) ? data : [])}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'patient_id', header: 'Patient' },
          { key: 'test_name', header: 'Test' },
          { key: 'test_code', header: 'Code' },
          { key: 'priority', header: 'Priority' },
          { key: 'status', header: 'Status', render: (row: any) => <Badge variant={row.status === 'resulted' ? 'success' : row.status === 'cancelled' ? 'danger' : 'info'}>{row.status}</Badge> },
        ]}
        rowKey={(row: any) => row.id}
      />
      <Pagination page={page} totalPages={data?.total_pages || 1} onPageChange={setPage} />
    </div>
  );
};

export default LabOrderListPage;
