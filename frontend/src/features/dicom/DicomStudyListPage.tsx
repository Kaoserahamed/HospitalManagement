import React from 'react';
import { useStudies } from './hooks';
import { Table, Button } from '../../components/ui';

export const DicomStudyListPage: React.FC = () => {
  const { data, isLoading } = useStudies();

  return (
    <div className="page">
      <div className="page-header">
        <h1>DICOM Studies</h1>
        <Button onClick={() => (window.location.href = '/dicom/new')}>New Study</Button>
      </div>
      <Table
        data={Array.isArray(data) ? data : data?.items || []}
        loading={isLoading}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'study_instance_uid', header: 'Study UID' },
          { key: 'patient_id', header: 'Patient' },
          { key: 'modality', header: 'Modality' },
          { key: 'description', header: 'Description' },
        ]}
        rowKey={(row: any) => row.id}
      />
    </div>
  );
};

export default DicomStudyListPage;
