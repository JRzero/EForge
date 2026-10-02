import {getDefaultStorage, type StorageAdapter} from './storage';

export interface AuthSession<TUser = unknown> {
  accessToken: string;
  refreshToken?: string;
  user?: TUser;
}

export interface AuthState<TUser = unknown> {
  session: AuthSession<TUser> | null;
  isAuthenticated: boolean;
}

export interface AuthStore<TUser = unknown> {
  getState(): AuthState<TUser>;
  setSession(session: AuthSession<TUser> | null): void;
  subscribe(listener: (state: AuthState<TUser>) => void): () => void;
}

export interface CreateAuthStoreOptions {
  storage?: StorageAdapter;
  storageKey?: string;
}

export function createAuthStore<TUser = unknown>({
  storage = getDefaultStorage(),
  storageKey = 'eforge.auth',
}: CreateAuthStoreOptions = {}): AuthStore<TUser> {
  const listeners = new Set<(state: AuthState<TUser>) => void>();
  let session: AuthSession<TUser> | null = null;
  const raw = storage.getItem(storageKey);
  if (raw) {
    try {
      session = JSON.parse(raw) as AuthSession<TUser>;
    } catch {
      storage.removeItem(storageKey);
    }
  }

  const snapshot = (): AuthState<TUser> => ({session, isAuthenticated: Boolean(session?.accessToken)});

  return {
    getState: snapshot,
    setSession(nextSession) {
      session = nextSession;
      if (nextSession) storage.setItem(storageKey, JSON.stringify(nextSession));
      else storage.removeItem(storageKey);
      const state = snapshot();
      listeners.forEach(listener => listener(state));
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
