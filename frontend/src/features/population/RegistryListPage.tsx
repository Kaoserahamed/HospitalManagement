import React from 'react';
import { useRegistries } from './hooks';
import { Table, Button, Badge } from '../../components/ui';

export const RegistryListPage: React.FC = () => {
  const { data, isLoading } = useRegistries();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Population Health</h1>
        <Button onClick={() => (window.location.href = '/population/new')}>New Registry</Button>
      </div>
      <Table
        data={Array.isArray(data) ? data : data?.items || []}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'name', header: 'Name' },
          { key: 'registry_type', header: 'Type' },
          { key: 'condition_code', header: 'Condition Code' },
        ]}
        rowKey={(row: any) => row.id}
      />
    </div>
  );
};

export default RegistryListPage;
