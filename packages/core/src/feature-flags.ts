export type FeatureFlags = Readonly<Record<string, boolean>>;

export function isFeatureEnabled(flags: FeatureFlags, name: string, fallback = false): boolean {
  return flags[name] ?? fallback;
}
