import React from 'react';
import { useRiskFactors, useFeatureImportance, useHighRiskPatients } from './hooks';
import { Table, Card } from '../../components/ui';

export const RiskDashboardPage: React.FC = () => {
  const { data: factors } = useRiskFactors();
  const { data: importance } = useFeatureImportance();
  const { data: highRisk } = useHighRiskPatients();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Risk Prediction</h1>
      </div>
      <Card title="Risk Factors">
        <Table data={Array.isArray(factors) ? factors : factors?.items || []} columns={[{ key: 'name', header: 'Factor' }, { key: 'weight', header: 'Weight' }, { key: 'category', header: 'Category' }]} rowKey={(r: any) => r.id} />
      </Card>
      <Card title="Feature Importance">
        <ul>
          {(importance || []).map((f: any) => (
            <li key={f.id || f.name}>{f.name}: {f.weight}</li>
          ))}
        </ul>
      </Card>
      <Card title="High-Risk Patients">
        <Table data={Array.isArray(highRisk) ? highRisk : highRisk?.items || []} columns={[{ key: 'patient_id', header: 'Patient' }, { key: 'score', header: 'Score' }, { key: 'risk_level', header: 'Level' }]} rowKey={(r: any) => r.id} />
      </Card>
    </div>
  );
};

export default RiskDashboardPage;
