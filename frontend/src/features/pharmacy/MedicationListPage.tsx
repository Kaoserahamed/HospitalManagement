import React, { useState } from 'react';
import { useMedications, useLowStock } from './hooks';
import { Table, Pagination, Button, Badge } from '../../components/ui';

export const MedicationListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMedications({ page, per_page: 20 });
  const { data: lowStock } = useLowStock();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Pharmacy</h1>
        <Button onClick={() => (window.location.href = '/pharmacy/new')}>New Medication</Button>
      </div>
      {lowStock && lowStock.length > 0 ? (
        <div className="alert alert-warning">Low stock: {lowStock.length} items</div>
      ) : null}
      <Table
        data={data?.items || []}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'name', header: 'Name' },
          { key: 'generic_name', header: 'Generic' },
          { key: 'form', header: 'Form' },
          { key: 'strength', header: 'Strength' },
          {
            key: 'requires_prescription',
            header: 'Rx',
            render: (row: any) => <Badge variant={row.requires_prescription ? 'warning' : 'success'}>{row.requires_prescription ? 'Rx' : 'OTC'}</Badge>,
          },
        ]}
        rowKey={(row: any) => row.id}
      />
      <Pagination page={page} totalPages={data?.total_pages || 1} onPageChange={setPage} />
    </div>
  );
};

export default MedicationListPage;
