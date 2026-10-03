export interface AppRouterAdapter {
  getCurrentHref(): string;
  subscribe(listener: () => void): () => void;
  navigate(to: string, options?: {replace?: boolean}): void;
}

export function createMemoryRouterAdapter(initialHref = '/'): AppRouterAdapter {
  let href = initialHref;
  const listeners = new Set<() => void>();

  return {
    getCurrentHref: () => href,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    navigate(to, options) {
      void options;
      href = to;
      for (const listener of listeners) listener();
    },
  };
}

export function createBrowserRouterAdapter(
  target: Window = window,
): AppRouterAdapter {
  const listeners = new Set<() => void>();
  const emit = () => {
    for (const listener of listeners) listener();
  };
  const onPopState = () => emit();

  return {
    getCurrentHref() {
      return `${target.location.pathname}${target.location.search}${target.location.hash}`;
    },
    subscribe(listener) {
      const shouldAttach = listeners.size === 0;
      listeners.add(listener);
      if (shouldAttach) target.addEventListener('popstate', onPopState);

      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          target.removeEventListener('popstate', onPopState);
        }
      };
    },
    navigate(to, options) {
      if (options?.replace) target.history.replaceState(null, '', to);
      else target.history.pushState(null, '', to);
      emit();
    },
  };
}
