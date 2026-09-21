import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { EmptyState, ErrorState, LoadingState } from './FeedbackStates';
import { ApiError } from '../api/apiError';
import { useAsyncData } from '../hooks/useAsyncData';

describe('FeedbackStates', () => {
  it('renders a loading status', () => {
    render(<LoadingState />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading...');
  });

  it('renders the message from a backend ApiError with its request id', () => {
    const error = new ApiError({
      message: 'Not authorized to view this patient record',
      status: 403,
      code: 'FORBIDDEN',
      requestId: 'req-42',
    });
    render(<ErrorState error={error} />);
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Not authorized to view this patient record'
    );
    expect(screen.getByText('Request ID: req-42')).toBeInTheDocument();
  });

  it('falls back to the error message for non-Api errors', () => {
    render(<ErrorState error={new Error('boom')} />);
    expect(screen.getByRole('alert')).toHaveTextContent('boom');
    expect(screen.queryByText(/Request ID:/)).not.toBeInTheDocument();
  });

  it('renders the retry button and invokes the handler', async () => {
    const onRetry = vi.fn();
    render(<ErrorState error={new ApiError({ message: 'x', status: 0 })} onRetry={onRetry} />);
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders an empty state message', () => {
    render(<EmptyState message="No appointments found" />);
    expect(screen.getByText('No appointments found')).toBeInTheDocument();
  });
});

describe('useAsyncData', () => {
  function Probe({ fetcher }: { fetcher: () => Promise<string> }) {
    const { data, error, loading, reload } = useAsyncData(fetcher);
    if (loading) return <LoadingState />;
    if (error) return <ErrorState error={error} onRetry={reload} />;
    return <EmptyState message={data ?? ''} />;
  }

  it('exposes data after a successful fetch', async () => {
    render(<Probe fetcher={() => Promise.resolve('loaded-value')} />);
    await waitFor(() => expect(screen.getByText('loaded-value')).toBeInTheDocument());
  });

  it('normalizes a rejected fetch into the error state with retry', async () => {
    const fetcher = vi
      .fn()
      .mockRejectedValueOnce(
        new ApiError({ message: 'Request failed', status: 0, code: 'NETWORK_ERROR' })
      );
    render(<Probe fetcher={fetcher} />);
    const retry = await screen.findByRole('button', { name: 'Try again' });
    fetcher.mockResolvedValueOnce('recovered');
    await userEvent.click(retry);
    await waitFor(() => expect(screen.getByText('recovered')).toBeInTheDocument());
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});
