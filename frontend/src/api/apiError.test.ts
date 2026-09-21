/**
 * API error contract tests.
 *
 * The frontend must understand the backend's error envelope
 * {detail, code, request_id} and normalize every failure (including network
 * failures and unexpected shapes) into a single ApiError type.
 */

import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';

import { ApiError, toApiError, type FieldError } from './apiError';
import api, { shouldRedirectToLogin } from './axios';

function axiosResponseError(status: number, data: unknown, url = '/appointments'): AxiosError {
  return new AxiosError(
    'Request failed with status code ' + status,
    undefined,
    {
      url,
      headers: new AxiosHeaders(),
    },
    undefined,
    {
      data,
      status,
      statusText: '',
      headers: new AxiosHeaders(),
      config: { url, headers: new AxiosHeaders() },
    }
  );
}

describe('toApiError', () => {
  it('parses the standard backend envelope', () => {
    const err = toApiError(
      axiosResponseError(404, {
        detail: 'Appointment not found',
        code: 'NOT_FOUND',
        request_id: 'abc-123',
      })
    );
    expect(err).toBeInstanceOf(ApiError);
    expect(err.message).toBe('Appointment not found');
    expect(err.status).toBe(404);
    expect(err.code).toBe('NOT_FOUND');
    expect(err.requestId).toBe('abc-123');
  });

  it('derives the code from the status when the envelope omits it', () => {
    const err = toApiError(axiosResponseError(429, { detail: 'Too many login attempts.' }));
    expect(err.code).toBe('RATE_LIMITED');
  });

  it('maps validation details into field errors', () => {
    const details: FieldError[] = [
      { field: 'body.email', message: 'value is not a valid email address', type: 'value_error' },
    ];
    const err = toApiError(axiosResponseError(422, { detail: details, code: 'VALIDATION_ERROR' }));
    expect(err.message).toBe('Request validation failed');
    expect(err.fieldErrors).toEqual(details);
  });

  it('normalizes network failures (no response)', () => {
    const err = toApiError(new AxiosError('Network Error'));
    expect(err.status).toBe(0);
    expect(err.code).toBe('NETWORK_ERROR');
    expect(err.message).toContain('Unable to reach the server');
  });

  it('normalizes plain errors and unknown values', () => {
    expect(toApiError(new Error('boom')).message).toBe('boom');
    expect(toApiError(undefined).code).toBe('CLIENT_ERROR');
  });

  it('returns ApiError instances untouched', () => {
    const original = new ApiError({ message: 'x', status: 403, code: 'FORBIDDEN' });
    expect(toApiError(original)).toBe(original);
  });
});

describe('response interceptor contract', () => {
  it('rejects with ApiError through the real axios pipeline', async () => {
    api.defaults.adapter = (config) =>
      Promise.reject(
        axiosResponseError(
          403,
          { detail: 'Not authorized to view this patient record' },
          config.url
        )
      );
    await expect(api.get('/patients/pat-1')).rejects.toMatchObject({
      name: 'ApiError',
      status: 403,
      code: 'FORBIDDEN',
    });
  });

  it('clears dead sessions on 401 outside login endpoints', async () => {
    // Park on a protected route so the interceptor's redirect guard is
    // exercised without a real jsdom navigation.
    window.history.pushState({}, '', '/login');
    localStorage.setItem('token', 'stale-token');
    localStorage.setItem('auth_type', 'staff');
    api.defaults.adapter = (config) =>
      Promise.reject(axiosResponseError(401, { detail: 'expired' }, config.url));
    await expect(api.get('/auth/me')).rejects.toBeInstanceOf(ApiError);
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('auth_type')).toBeNull();
  });

  it('keeps credentials when a login attempt itself is unauthorized', async () => {
    localStorage.setItem('token', 'previous-session');
    api.defaults.adapter = (config) =>
      Promise.reject(axiosResponseError(401, { detail: 'Invalid credentials' }, config.url));
    await expect(api.post('/auth/login', {})).rejects.toBeInstanceOf(ApiError);
    expect(localStorage.getItem('token')).toBe('previous-session');
  });
});

describe('shouldRedirectToLogin', () => {
  it('redirects everywhere except login screens', () => {
    expect(shouldRedirectToLogin('/dashboard')).toBe(true);
    expect(shouldRedirectToLogin('/')).toBe(true);
    expect(shouldRedirectToLogin('/login')).toBe(false);
  });
});
