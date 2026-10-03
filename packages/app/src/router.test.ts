import {describe, expect, it, vi} from 'vitest';
import {createMemoryRouterAdapter} from './router';

describe('memory router adapter', () => {
  it('publishes navigation changes without a routing dependency', () => {
    const router = createMemoryRouterAdapter('/');
    const listener = vi.fn();
    const unsubscribe = router.subscribe(listener);

    router.navigate('/users');
    expect(router.getCurrentHref()).toBe('/users');
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    router.navigate('/settings');
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
