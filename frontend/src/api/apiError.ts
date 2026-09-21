/**
 * Standardized client-side API error handling.
 *
 * The backend returns every error in a stable envelope:
 *
 *     { "detail": "...", "code": "NOT_FOUND", "request_id": "a1b2c3..." }
 *
 * `ApiError` preserves that contract on the client so UI code never inspects
 * raw axios errors, and validation errors arrive as structured field errors
 * instead of free-form strings.
 */

export interface FieldError {
  field: string;
  message: string;
  type: string;
}

/** Subset of the backend error envelope the client understands. */
export interface ErrorEnvelope {
  detail?: string | FieldError[];
  code?: string;
  request_id?: string;
}

/** Stable codes mirror backend/core/errors.py::ERROR_CODE_BY_STATUS. */
const CODE_BY_STATUS: Record<number, string> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'VALIDATION_ERROR',
  429: 'RATE_LIMITED',
  500: 'INTERNAL_ERROR',
  503: 'SERVICE_UNAVAILABLE',
};

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly requestId?: string;
  readonly fieldErrors?: FieldError[];

  constructor(options: {
    message: string;
    status: number;
    code?: string;
    requestId?: string;
    fieldErrors?: FieldError[];
  }) {
    super(options.message);
    this.name = 'ApiError';
    this.status = options.status;
    this.code = options.code ?? CODE_BY_STATUS[options.status] ?? 'HTTP_ERROR';
    this.requestId = options.requestId;
    this.fieldErrors = options.fieldErrors;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Convert any thrown value (axios error, envelope, plain Error) to ApiError. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (isRecord(error) && isRecord(error.response)) {
    const status = typeof error.response.status === 'number' ? error.response.status : 500;
    const data: ErrorEnvelope = isRecord(error.response.data) ? error.response.data : {};
    const detail = data.detail;
    if (Array.isArray(detail)) {
      return new ApiError({
        message: 'Request validation failed',
        status,
        code: data.code,
        requestId: typeof data.request_id === 'string' ? data.request_id : undefined,
        fieldErrors: detail.filter(isRecord).map((d) => ({
          field: String(d.field ?? ''),
          message: String(d.message ?? 'invalid value'),
          type: String(d.type ?? 'value_error'),
        })),
      });
    }
    return new ApiError({
      message: typeof detail === 'string' && detail ? detail : 'Request failed',
      status,
      code: typeof data.code === 'string' ? data.code : undefined,
      requestId: typeof data.request_id === 'string' ? data.request_id : undefined,
    });
  }

  if (isRecord(error) && error.isAxiosError === true && !error.response) {
    return new ApiError({
      message: 'Unable to reach the server. Check your connection and try again.',
      status: 0,
      code: 'NETWORK_ERROR',
    });
  }

  if (error instanceof Error) {
    return new ApiError({ message: error.message, status: 0, code: 'CLIENT_ERROR' });
  }

  return new ApiError({ message: 'An unexpected error occurred', status: 0, code: 'CLIENT_ERROR' });
}
