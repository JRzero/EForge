import {describe, expect, it} from 'vitest';
import {hasAllPermissions, hasAnyPermission, hasPermission} from './permission';

describe('permissions', () => {
  it('supports exact, global and namespace wildcards', () => {
    expect(hasPermission(['user:read'], 'user:read')).toBe(true);
    expect(hasPermission(['user:*'], 'user:delete')).toBe(true);
    expect(hasPermission(['*'], 'billing:refund')).toBe(true);
    expect(hasPermission(['user:read'], 'user:delete')).toBe(false);
  });

  it('supports any/all composition', () => {
    const granted = ['user:read', 'project:*'];
    expect(hasAnyPermission(granted, ['billing:read', 'project:update'])).toBe(true);
    expect(hasAllPermissions(granted, ['user:read', 'project:update'])).toBe(true);
    expect(hasAllPermissions(granted, ['user:write', 'project:update'])).toBe(false);
  });
});
