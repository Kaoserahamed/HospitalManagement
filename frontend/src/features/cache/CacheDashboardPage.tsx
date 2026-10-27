import React from 'react';
import { useCacheStats, useCacheKeys } from './hooks';
import { Card, Button } from '../../components/ui';

export const CacheDashboardPage: React.FC = () => {
  const { data: stats } = useCacheStats();
  const { data: keys } = useCacheKeys();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Cache</h1>
        <Button onClick={() => (window.location.href = '/cache/clear')}>Clear</Button>
      </div>
      <Card title="Stats">
        <p>Size: {stats?.size ?? 0}</p>
        <p>Keys: {(keys?.keys || []).length}</p>
      </Card>
      <Card title="Keys">
        <ul>
          {(keys?.keys || []).map((k: string) => (
            <li key={k}>{k}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default CacheDashboardPage;
