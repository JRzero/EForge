import {describe, expect, it, vi} from 'vitest';
import {createHttpClient, HttpError} from './http';

describe('http client', () => {
  it('adds auth/query and serializes json bodies', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ok: true}), {
        status: 200,
        headers: {'content-type': 'application/json'},
      }),
    );
    const client = createHttpClient({
      baseUrl: 'https://api.example.com/',
      getAccessToken: () => 'abc',
      fetcher,
    });

    await client.post('/users', {name: 'Ada'}, {query: {active: true}});
    const [url, init] = fetcher.mock.calls[0] ?? [];
    expect(String(url)).toBe('https://api.example.com/users?active=true');
    expect(new Headers(init?.headers).get('authorization')).toBe('Bearer abc');
    expect(new Headers(init?.headers).get('content-type')).toBe('application/json');
    expect(init?.body).toBe(JSON.stringify({name: 'Ada'}));
  });

  it('throws HttpError and runs unauthorized hook', async () => {
    const onUnauthorized = vi.fn();
    const client = createHttpClient({
      baseUrl: 'https://api.example.com',
      fetcher: vi.fn<typeof fetch>().mockResolvedValue(
        new Response(JSON.stringify({message: 'expired'}), {
          status: 401,
          headers: {'content-type': 'application/json'},
        }),
      ),
      onUnauthorized,
    });

    await expect(client.get('/me')).rejects.toBeInstanceOf(HttpError);
    expect(onUnauthorized).toHaveBeenCalledOnce();
  });
});
