/**
 * Shared loading, error, and empty states.
 *
 * Every async view renders one of these instead of hand-rolled markup, so
 * correlation IDs from the backend error envelope surface consistently in
 * the UI (support: "quote the request_id").
 */

import { ApiError } from '../api/apiError';
import './FeedbackStates.css';

interface FeedbackStateProps {
  /** Optional test id hook for component tests. */
  testId?: string;
}

export const LoadingState = ({
  testId = 'loading-state',
  label = 'Loading...',
}: FeedbackStateProps & { label?: string }) => (
  <div className="hms-feedback hms-feedback--loading" data-testid={testId} role="status">
    <span className="hms-feedback__spinner" aria-hidden="true" />
    {label}
  </div>
);

interface ErrorStateProps extends FeedbackStateProps {
  error: unknown;
  /** Offered when the failure may be transient (network, 5xx). */
  onRetry?: () => void;
}

export const ErrorState = ({ error, onRetry, testId = 'error-state' }: ErrorStateProps) => {
  const apiError = error instanceof ApiError ? error : null;
  const message =
    apiError?.message ?? (error instanceof Error ? error.message : 'Something went wrong.');
  return (
    <div className="hms-feedback hms-feedback--error" data-testid={testId} role="alert">
      <p className="hms-feedback__message">{message}</p>
      {apiError?.requestId && (
        <p className="hms-feedback__request-id">Request ID: {apiError.requestId}</p>
      )}
      {onRetry && (
        <button
          type="button"
          className="hms-feedback__retry"
          onClick={onRetry}
          data-testid={`${testId}-retry`}
        >
          Try again
        </button>
      )}
    </div>
  );
};

interface EmptyStateProps extends FeedbackStateProps {
  message: string;
}

export const EmptyState = ({ message, testId = 'empty-state' }: EmptyStateProps) => (
  <div className="hms-feedback hms-feedback--empty" data-testid={testId}>
    {message}
  </div>
);
