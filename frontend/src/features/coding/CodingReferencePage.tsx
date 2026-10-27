import React from 'react';
import { useCommonIcd10, useCommonCpt } from './hooks';
import { Table, Card } from '../../components/ui';

export const CodingReferencePage: React.FC = () => {
  const { data: icd } = useCommonIcd10();
  const { data: cpt } = useCommonCpt();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Medical Coding</h1>
      </div>
      <Card title="Common ICD-10">
        <Table data={Array.isArray(icd) ? icd : []} columns={[{ key: 'code', header: 'Code' }, { key: 'description', header: 'Description' }]} rowKey={(r: any) => r.code} />
      </Card>
      <Card title="Common CPT">
        <Table data={Array.isArray(cpt) ? cpt : []} columns={[{ key: 'code', header: 'Code' }, { key: 'description', header: 'Description' }]} rowKey={(r: any) => r.code} />
      </Card>
    </div>
  );
};

export default CodingReferencePage;
