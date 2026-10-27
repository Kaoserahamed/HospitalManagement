import React from 'react';
import { useFHIRCount, useFHIRSubscriptions } from './hooks';
import { Card, Table, Button } from '../../components/ui';

export const FHIRDashboardPage: React.FC = () => {
  const { data: count } = useFHIRCount();
  const { data: subs } = useFHIRSubscriptions();

  return (
    <div className="page">
      <div className="page-header">
        <h1>FHIR R4</h1>
        <Button onClick={() => (window.location.href = '/fhir/new')}>New Resource</Button>
      </div>
      <Card title="Resources">
        <p>Total resources: {count?.count ?? 0}</p>
      </Card>
      <Card title="Subscriptions">
        <Table data={Array.isArray(subs) ? subs : subs?.items || []} columns={[{ key: 'id', header: 'ID' }, { key: 'resource_type', header: 'Resource Type' }, { key: 'criteria', header: 'Criteria' }, { key: 'endpoint', header: 'Endpoint' }]} rowKey={(r: any) => r.id} />
      </Card>
    </div>
  );
};

export default FHIRDashboardPage;
