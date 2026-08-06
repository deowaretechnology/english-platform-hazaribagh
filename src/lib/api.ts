// src/lib/api.ts
//
// EVERY backend call in this app must go through getApiUrl() / apiFetch().
// Never write fetch('/api/...') directly — in production the frontend
// (Vercel) and backend (Render) are on different domains, so a relative
// path resolves against vercel.app and 404s.

const RAW_API_URL = (import.meta.env.VITE_API_URL || '').toString().trim().replace(/\/$/, '');

// Hard fallback so the app never silently degrades to relative paths in
// production if someone forgets to set the env var on Vercel.
const PRODUCTION_FALLBACK_API_URL = 'https://english-platform-hazaribagh.onrender.com';

export const API_BASE_URL = RAW_API_URL || (import.meta.env.PROD ? PRODUCTION_FALLBACK_API_URL : '');

if (!RAW_API_URL) {
  // eslint-disable-next-line no-console
  console.warn(
    '[api] VITE_API_URL is not set. Falling back to',
    API_BASE_URL || '(relative — dev only)',
    '— set VITE_API_URL in your Vercel project settings.'
  );
}

export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (!API_BASE_URL) {
    return cleanPath; // local dev only, e.g. behind a Vite proxy
  }
  return `${API_BASE_URL}${cleanPath}`;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  json?: unknown;
}

/**
 * Single place every request goes through.
 * - Always hits the absolute backend URL.
 * - Throws ApiError on any failure (non-2xx, network error, or
 *   { success: false } payload) — callers MUST catch and surface a real
 *   error message. Do NOT catch this and fabricate local/fake data.
 */
export async function apiFetch<T = any>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { json, headers, ...rest } = options;

  let res: Response;
  try {
    res = await fetch(getApiUrl(path), {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...(headers || {}),
      },
      body: json !== undefined ? JSON.stringify(json) : undefined,
    });
  } catch (err) {
    // Network failure — server down, CORS blocked, DNS, etc.
    throw new ApiError('Network error: could not reach the server. Please try again.', 0);
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // Non-JSON response (e.g. HTML error page from a misconfigured host)
  }

  if (!res.ok || (data && data.success === false)) {
    const message = (data && (data.error || data.message)) || `Request failed (${res.status})`;
    throw new ApiError(message, res.status);
  }

  return data as T;
}