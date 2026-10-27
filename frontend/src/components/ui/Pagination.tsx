import React from 'react';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange, disabled }) => {
  if (totalPages <= 1) return null;
  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav className="pagination" aria-label="Pagination">
      <button disabled={disabled || page <= 1} onClick={() => onPageChange(page - 1)}>
        Prev
      </button>
      {start > 1 ? <button onClick={() => onPageChange(1)}>1</button> : null}
      {start > 2 ? <span>...</span> : null}
      {pages.map((p) => (
        <button
          key={p}
          className={p === page ? 'active' : ''}
          onClick={() => onPageChange(p)}
          disabled={disabled}
        >
          {p}
        </button>
      ))}
      {end < totalPages - 1 ? <span>...</span> : null}
      {end < totalPages ? <button onClick={() => onPageChange(totalPages)}>{totalPages}</button> : null}
      <button disabled={disabled || page >= totalPages} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
    </nav>
  );
};

export default Pagination;
