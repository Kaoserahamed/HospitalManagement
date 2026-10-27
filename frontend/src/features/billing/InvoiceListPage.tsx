import React, { useState } from 'react';
import { useInvoices } from './hooks';
import { Table, Pagination, Button, Badge } from '../../components/ui';

export const InvoiceListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useInvoices({ page, per_page: 20 });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Billing</h1>
        <Button onClick={() => (window.location.href = '/billing/new')}>New Invoice</Button>
      </div>
      <Table
        data={data?.items || []}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'invoice_number', header: 'Invoice #' },
          { key: 'patient_id', header: 'Patient' },
          { key: 'total', header: 'Total' },
          { key: 'status', header: 'Status', render: (row: any) => <Badge variant={row.status === 'paid' ? 'success' : row.status === 'overdue' ? 'danger' : 'info'}>{row.status}</Badge> },
          { key: 'actions', header: 'Actions', render: (row: any) => <Button size="sm" variant="ghost" onClick={() => (window.location.href = `/billing/${row.id}`)}>View</Button> },
        ]}
        rowKey={(row: any) => row.id}
      />
      <Pagination page={page} totalPages={data?.total_pages || 1} onPageChange={setPage} />
    </div>
  );
};

export default InvoiceListPage;
