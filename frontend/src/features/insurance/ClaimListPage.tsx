import React from 'react';
import { useClaims } from './hooks';
import { Table, Button, Badge } from '../../components/ui';

export const ClaimListPage: React.FC = () => {
  const { data, isLoading } = useClaims();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Insurance Claims</h1>
        <Button onClick={() => (window.location.href = '/insurance/claims/new')}>New Claim</Button>
      </div>
      <Table
        data={data?.items || (Array.isArray(data) ? data : [])}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'invoice_id', header: 'Invoice' },
          { key: 'payer', header: 'Payer' },
          { key: 'amount_claimed', header: 'Claimed' },
          { key: 'amount_approved', header: 'Approved' },
          { key: 'status', header: 'Status', render: (row: any) => <Badge variant={row.status === 'approved' ? 'success' : row.status === 'denied' ? 'danger' : 'info'}>{row.status}</Badge> },
        ]}
        rowKey={(row: any) => row.id}
      />
    </div>
  );
};

export default ClaimListPage;
