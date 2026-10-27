import React, { useState } from 'react';
import { useQualityMeasures, useAllQualitySummaries } from './hooks';
import { Table, Button, Badge } from '../../components/ui';

export const QualityDashboardPage: React.FC = () => {
  const { data: measures, isLoading } = useQualityMeasures();
  const { data: summaries } = useAllQualitySummaries();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Quality Metrics</h1>
        <Button onClick={() => (window.location.href = '/quality/new')}>New Measure</Button>
      </div>
      <Table
        data={Array.isArray(measures) ? measures : measures?.items || []}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'name', header: 'Measure' },
          { key: 'category', header: 'Category' },
          { key: 'numerator', header: 'Num' },
          { key: 'denominator', header: 'Den' },
          { key: 'target', header: 'Target' },
        ]}
        rowKey={(row: any) => row.id}
      />
      <h2>Summaries</h2>
      <ul>
        {(summaries || []).map((s: any) => (
          <li key={s.measure_id}>{s.name}: {(s.rate * 100).toFixed(1)}% (target {(s.target * 100).toFixed(1)}%) — {s.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default QualityDashboardPage;
