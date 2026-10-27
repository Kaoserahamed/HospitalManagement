import React from 'react';
import { usePerformanceSummary, useSlowestEndpoints } from './hooks';
import { Table, Card } from '../../components/ui';

export const PerformanceDashboardPage: React.FC = () => {
  const { data: summary } = usePerformanceSummary();
  const { data: slowest } = useSlowestEndpoints();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Performance</h1>
      </div>
      <Card title="Endpoint Summary">
        <Table data={Array.isArray(summary) ? summary : summary?.items || []} columns={[{ key: 'endpoint', header: 'Endpoint' }, { key: 'request_count', header: 'Requests' }, { key: 'avg_duration_ms', header: 'Avg (ms)' }, { key: 'p95_duration_ms', header: 'p95 (ms)' }, { key: 'error_rate', header: 'Error Rate' }]} rowKey={(r: any) => r.endpoint} />
      </Card>
      <Card title="Slowest Endpoints">
        <Table data={Array.isArray(slowest) ? slowest : slowest?.items || []} columns={[{ key: 'endpoint', header: 'Endpoint' }, { key: 'p95_duration_ms', header: 'p95 (ms)' }]} rowKey={(r: any) => r.endpoint} />
      </Card>
    </div>
  );
};

export default PerformanceDashboardPage;
