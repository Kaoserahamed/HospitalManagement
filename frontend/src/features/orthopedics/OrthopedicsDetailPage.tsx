import React from 'react';
import { useParams } from 'react-router-dom';
import { useOrthopedics, useDeleteOrthopedics } from './hooks';

export const OrthopedicsDetailPage: React.FC = () => {
  const { id } = useParams();
  const recordId = Number(id);
  const { data, isLoading } = useOrthopedics(recordId);
  const deleteMutation = useDeleteOrthopedics();

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Not found</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Orthopedics #{data.id}</h1>
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

export default OrthopedicsDetailPage;
