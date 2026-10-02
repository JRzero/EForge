export const token = {
  color: {
    textPrimary: 'var(--color-text-primary)',
    textSecondary: 'var(--color-text-secondary)',
    surface: 'var(--color-background-surface)',
    body: 'var(--color-background-body)',
    border: 'var(--color-border)',
    accent: 'var(--color-accent)',
    error: 'var(--color-error)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
  },
  spacing: {
    1: 'var(--spacing-1)',
    2: 'var(--spacing-2)',
    3: 'var(--spacing-3)',
    4: 'var(--spacing-4)',
    6: 'var(--spacing-6)',
    8: 'var(--spacing-8)',
  },
  radius: {
    inner: 'var(--radius-inner)',
    element: 'var(--radius-element)',
    container: 'var(--radius-container)',
  },
  shadow: {
    low: 'var(--shadow-low)',
    medium: 'var(--shadow-med)',
    high: 'var(--shadow-high)',
  },
} as const;

export type EForgeToken = typeof token;
