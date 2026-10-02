function matchesPermission(granted: string, required: string): boolean {
  if (granted === '*' || granted === required) return true;
  if (granted.endsWith(':*')) {
    return required.startsWith(`${granted.slice(0, -2)}:`);
  }
  return false;
}

export function hasPermission(granted: readonly string[], required: string): boolean {
  return granted.some(permission => matchesPermission(permission, required));
}

export function hasAnyPermission(granted: readonly string[], required: readonly string[]): boolean {
  return required.length === 0 || required.some(permission => hasPermission(granted, permission));
}

export function hasAllPermissions(granted: readonly string[], required: readonly string[]): boolean {
  return required.every(permission => hasPermission(granted, permission));
}
