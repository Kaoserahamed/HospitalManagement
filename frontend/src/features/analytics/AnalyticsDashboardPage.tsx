import React from 'react';
import { useDashboard, useQualityMeasures } from './hooks';
import { Card, Spinner } from '../../components/ui';

export const AnalyticsDashboardPage: React.FC = () => {
  const { data: dashboard, isLoading } = useDashboard();
  const { data: measures } = useQualityMeasures();

  if (isLoading) return <Spinner />;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Analytics</h1>
      </div>
      <div className="dashboard-grid">
        <Card title="Patients">{dashboard?.total_patients ?? 0}</Card>
        <Card title="Appointments">{dashboard?.total_appointments ?? 0}</Card>
        <Card title="Encounters">{dashboard?.total_encounters ?? 0}</Card>
        <Card title="Occupancy">{((dashboard?.occupancy_rate ?? 0) * 100).toFixed(1)}%</Card>
        <Card title="Revenue">${(dashboard?.revenue ?? 0).toFixed(2)}</Card>
        <Card title="Quality Score">{((dashboard?.quality_score ?? 0) * 100).toFixed(1)}%</Card>
      </div>
      <Card title="Quality Measures">
        <ul>
          {(measures || []).map((m: any) => (
            <li key={m.id}>
              {m.name}: {m.denominator ? ((m.numerator / m.denominator) * 100).toFixed(1) : 0}%
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default AnalyticsDashboardPage;
