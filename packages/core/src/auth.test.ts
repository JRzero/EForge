import {describe, expect, it, vi} from 'vitest';
import {createAuthStore} from './auth';
import {createMemoryStorage} from './storage';

describe('auth store', () => {
  it('persists and notifies session state', () => {
    const storage = createMemoryStorage();
    const store = createAuthStore({storage});
    const listener = vi.fn();
    store.subscribe(listener);

    store.setSession({accessToken: 'token-1', user: {id: 1}});
    expect(store.getState().isAuthenticated).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);

    const restored = createAuthStore<{id: number}>({storage});
    expect(restored.getState().session?.user?.id).toBe(1);

    store.setSession(null);
    expect(store.getState().isAuthenticated).toBe(false);
  });
});
