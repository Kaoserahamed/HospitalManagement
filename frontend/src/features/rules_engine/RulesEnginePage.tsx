import React from 'react';
import { useRules, useRuleSets } from './hooks';
import { Table, Card } from '../../components/ui';

export const RulesEnginePage: React.FC = () => {
  const { data: rules } = useRules();
  const { data: sets } = useRuleSets();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Rules Engine</h1>
      </div>
      <Card title="Rules">
        <Table data={Array.isArray(rules) ? rules : rules?.items || []} columns={[{ key: 'id', header: 'ID' }, { key: 'name', header: 'Name' }, { key: 'rule_type', header: 'Type' }, { key: 'status', header: 'Status' }, { key: 'priority', header: 'Priority' }]} rowKey={(r: any) => r.id} />
      </Card>
      <Card title="Rule Sets">
        <Table data={Array.isArray(sets) ? sets : sets?.items || []} columns={[{ key: 'id', header: 'ID' }, { key: 'name', header: 'Name' }, { key: 'is_active', header: 'Active' }]} rowKey={(r: any) => r.id} />
      </Card>
    </div>
  );
};

export default RulesEnginePage;
