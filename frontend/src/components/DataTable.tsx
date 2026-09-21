import React from 'react';

interface Column<T = unknown> {
  key: string;
  header: string;
  // Presentational boundary: the column author decides how to display the
  // raw cell value, while `row` remains fully typed through the DataTable
  // generic. `any` here avoids forcing every call site into blind casts.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T = unknown> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  emptySubtitle?: string;
}

const DataTable = <T,>({
  data,
  columns,
  emptyMessage = 'No data available',
  emptySubtitle,
}: DataTableProps<T>) => {
  if (data.length === 0) {
    return (
      <div className="empty-state">
        <p>{emptyMessage}</p>
        {emptySubtitle && <p className="empty-subtitle">{emptySubtitle}</p>}
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={(row as { id?: string | number }).id || index}
              style={{
                borderBottom: index < data.length - 1 ? '1px solid #f3f4f6' : 'none',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  style={{
                    padding: '1rem',
                    fontSize: '0.875rem',
                    color: column.key === 'name' ? '#111827' : '#6b7280',
                  }}
                >
                  {column.render
                    ? column.render((row as Record<string, unknown>)[column.key], row)
                    : String((row as Record<string, unknown>)[column.key] ?? '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
