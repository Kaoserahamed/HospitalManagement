import React from 'react';
import { useParams } from 'react-router-dom';
import { useLeaveManagement, useDeleteLeaveManagement } from './hooks';

export const LeaveManagementDetailPage: React.FC = () => {
  const { id } = useParams();
  const recordId = Number(id);
  const { data, isLoading } = useLeaveManagement(recordId);
  const deleteMutation = useDeleteLeaveManagement();

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Not found</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>LeaveManagement #{data.id}</h1>
        <button onClick={() => deleteMutation.mutate(recordId)}>Delete</button>
      </div>
      <div className="detail">
        <p><strong>Title:</strong> {data.title}</p>
        <p><strong>Status:</strong> {data.status}</p>
        <p><strong>Priority:</strong> {data.priority}</p>
        <p><strong>Category:</strong> {data.category}</p>
        <p><strong>Description:</strong> {data.description}</p>
        <p><strong>Notes:</strong> {data.notes}</p>
        <p><strong>Active:</strong> {String(data.is_active)}</p>
        <p><strong>Created:</strong> {data.created_at}</p>
      </div>
    </div>
  );
};

export default LeaveManagementDetailPage;
