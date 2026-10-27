import React, { useState } from 'react';
import { usePatients, useDeletePatient } from './hooks';
import { Table, Pagination, Button, Input } from '../../components/ui';

export const PatientListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = usePatients({ page, per_page: 20, search });
  const deleteMutation = useDeletePatient();

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this patient?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Patients</h1>
        <Button onClick={() => (window.location.href = '/patients/new')}>New Patient</Button>
      </div>
      <div className="page-filters">
        <Input
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Table
        data={data?.items || []}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'full_name', header: 'Name' },
          { key: 'dob', header: 'DOB' },
          { key: 'gender', header: 'Gender' },
          { key: 'status', header: 'Status' },
          {
            key: 'actions',
            header: 'Actions',
            render: (row: any) => (
              <div>
                <Button size="sm" variant="ghost" onClick={() => (window.location.href = `/patients/${row.id}`)}>
                  View
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)}>
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
        rowKey={(row: any) => row.id}
      />
      <Pagination page={page} totalPages={data?.total_pages || 1} onPageChange={setPage} />
    </div>
  );
};

export default PatientListPage;
