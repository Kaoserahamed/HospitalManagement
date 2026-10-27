import React, { useState } from 'react';
import { useMessages, useMarkMessageRead } from './hooks';
import { Table, Pagination, Button, Badge } from '../../components/ui';

export const MessageListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMessages({ page, per_page: 20 });
  const markReadMutation = useMarkMessageRead();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Patient Portal</h1>
        <Button onClick={() => (window.location.href = '/portal/messages/new')}>New Message</Button>
      </div>
      <Table
        data={data?.items || (Array.isArray(data) ? data : [])}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'sender_id', header: 'From' },
          { key: 'recipient_id', header: 'To' },
          { key: 'subject', header: 'Subject' },
          { key: 'status', header: 'Status' },
          { key: 'is_read', header: 'Read', render: (row: any) => <Badge variant={row.is_read ? 'success' : 'warning'}>{row.is_read ? 'Read' : 'Unread'}</Badge> },
          { key: 'actions', header: 'Actions', render: (row: any) => !row.is_read ? <Button size="sm" onClick={() => markReadMutation.mutate(row.id)}>Mark Read</Button> : null },
        ]}
        rowKey={(row: any) => row.id}
      />
      <Pagination page={page} totalPages={data?.total_pages || 1} onPageChange={setPage} />
    </div>
  );
};

export default MessageListPage;
