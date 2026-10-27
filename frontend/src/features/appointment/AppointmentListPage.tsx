import React, { useState } from 'react';
import { useAppointments, useCancelAppointment } from './hooks';
import { Table, Pagination, Button, Input, Badge } from '../../components/ui';

export const AppointmentListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>();
  const { data, isLoading } = useAppointments({ page, per_page: 20, status });
  const cancelMutation = useCancelAppointment();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Appointments</h1>
        <Button onClick={() => (window.location.href = '/appointments/new')}>New Appointment</Button>
      </div>
      <div className="page-filters">
        <select value={status || ''} onChange={(e) => setStatus(e.target.value || undefined)}>
          <option value="">All statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <Table
        data={data?.items || []}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'patient_id', header: 'Patient' },
          { key: 'doctor_id', header: 'Doctor' },
          { key: 'start_time', header: 'Start' },
          { key: 'end_time', header: 'End' },
          {
            key: 'status',
            header: 'Status',
            render: (row: any) => <Badge variant={row.status === 'completed' ? 'success' : row.status === 'cancelled' ? 'danger' : 'info'}>{row.status}</Badge>,
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row: any) => (
              <div>
                <Button size="sm" variant="ghost" onClick={() => (window.location.href = `/appointments/${row.id}`)}>
                  View
                </Button>
                <Button size="sm" variant="danger" onClick={() => cancelMutation.mutate({ id: row.id })}>
                  Cancel
                </Button>
              </div>
            ),
          },
        ]}
        rowKey={(row: any) => row.id}
      />
      <Pagination page={page} totalPages={data?.total_pages || 1} onPageChange={setPage} />
    </div>
  );
};

export default AppointmentListPage;
