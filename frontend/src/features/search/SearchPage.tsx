import React, { useState } from 'react';
import { useSearch } from './hooks';
import { Input, Table, Card } from '../../components/ui';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const { data, isLoading } = useSearch(submitted);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Search</h1>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); setSubmitted(query); }}>
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." />
        <button type="submit">Search</button>
      </form>
      <Card title="Results">
        <Table
          data={data?.results || []}
          loading={isLoading}
          columns={[
            { key: 'id', header: 'ID' },
            { key: 'score', header: 'Score' },
          ]}
          rowKey={(row: any) => row.id}
          emptyMessage="No results"
        />
      </Card>
    </div>
  );
};

export default SearchPage;
