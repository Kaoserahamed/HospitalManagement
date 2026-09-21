import axios, { AxiosError } from 'axios';
import { toApiError } from './apiError';

const UNAUTHENTICATED_PATHS = ['/auth/login', '/auth/patients/login'];

export const TOKEN_STORAGE_KEY = 'token';
export const AUTH_TYPE_STORAGE_KEY = 'auth_type';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Normalize every failure to ApiError (the backend envelope contract) and
 * drop dead sessions: a 401 on anything other than the login endpoints means
 * the stored token is invalid/expired, so clear it and return to login.
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError = toApiError(error);
    const isAuthAttempt =
      typeof error.config?.url === 'string' &&
      UNAUTHENTICATED_PATHS.some((path) => error.config!.url!.endsWith(path));
    if (apiError.status === 401 && !isAuthAttempt) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(AUTH_TYPE_STORAGE_KEY);
      if (shouldRedirectToLogin(window.location.pathname)) {
        window.location.assign('/login');
      }
    }
    return Promise.reject(apiError);
  }
);

/** True when the current page is not already a login screen. */
export function shouldRedirectToLogin(pathname: string): boolean {
  return !pathname.startsWith('/login');
}

export default api;
