export interface HttpClientOptions {
  baseUrl: string;
  getAccessToken?: () => string | null | undefined;
  fetcher?: typeof fetch;
  defaultHeaders?: HeadersInit;
  onUnauthorized?: () => void | Promise<void>;
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  query?: Record<string, string | number | boolean | null | undefined>;
}

export class HttpError<T = unknown> extends Error {
  readonly status: number;
  readonly data: T | null;

  constructor(status: number, message: string, data: T | null = null) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
  }
}

function buildUrl(baseUrl: string, path: string, query?: RequestOptions['query']) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${baseUrl.replace(/\/$/, '')}${normalizedPath}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== null && value !== undefined) url.searchParams.set(key, String(value));
  }
  return url.toString();
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) return response.json();
  const text = await response.text();
  return text || null;
}

export function createHttpClient({
  baseUrl,
  getAccessToken,
  fetcher = fetch,
  defaultHeaders,
  onUnauthorized,
}: HttpClientOptions) {
  async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const {body, query, headers: requestHeaders, ...requestInit} = options;
    const headers = new Headers(defaultHeaders);
    new Headers(requestHeaders).forEach((value, key) => headers.set(key, value));
    const accessToken = getAccessToken?.();
    if (accessToken && !headers.has('authorization')) headers.set('authorization', `Bearer ${accessToken}`);

    let requestBody: BodyInit | undefined;
    if (body instanceof FormData || body instanceof Blob || typeof body === 'string') {
      requestBody = body;
    } else if (body !== undefined) {
      headers.set('content-type', 'application/json');
      requestBody = JSON.stringify(body);
    }

    const response = await fetcher(buildUrl(baseUrl, path, query), {
      ...requestInit,
      headers,
      ...(requestBody !== undefined ? {body: requestBody} : {}),
    });
    const data = await parseResponse(response);

    if (!response.ok) {
      if (response.status === 401) await onUnauthorized?.();
      const message =
        data && typeof data === 'object' && 'message' in data && typeof data.message === 'string'
          ? data.message
          : `HTTP ${response.status}`;
      throw new HttpError(response.status, message, data);
    }

    return data as T;
  }

  return {
    request,
    get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
      request<T>(path, {...options, method: 'GET'}),
    post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
      request<T>(path, {...options, method: 'POST', body}),
    put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
      request<T>(path, {...options, method: 'PUT', body}),
    patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
      request<T>(path, {...options, method: 'PATCH', body}),
    delete: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
      request<T>(path, {...options, method: 'DELETE'}),
  };
}
