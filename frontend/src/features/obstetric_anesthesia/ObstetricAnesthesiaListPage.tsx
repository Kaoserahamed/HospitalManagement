import React, { useState } from 'react';
import { useObstetricAnesthesiaList, useDeleteObstetricAnesthesia } from './hooks';
import { Table, Pagination, Button, Input } from '../../components/ui';

export const ObstetricAnesthesiaListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useObstetricAnesthesiaList({ page, per_page: 20, search });
  const deleteMutation = useDeleteObstetricAnesthesia();

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this record?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>ObstetricAnesthesia</h1>
        <Button onClick={() => (window.location.href = '/obstetric_anesthesia/new')}>New ObstetricAnesthesia</Button>
      </div>
      <div className="page-filters">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Table
        data={data?.items || []}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'title', header: 'Title' },
          { key: 'status', header: 'Status' },
          { key: 'priority', header: 'Priority' },
          {
            key: 'actions',
            header: 'Actions',
            render: (row: any) => (
              <div>
                <Button size="sm" variant="ghost" onClick={() => (window.location.href = `/obstetric_anesthesia/${row.id}`)}>
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

export default ObstetricAnesthesiaListPage;
