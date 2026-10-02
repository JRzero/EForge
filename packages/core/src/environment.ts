export interface EForgeEnvironment {
  apiBaseUrl: string;
  appName?: string;
  environment?: 'development' | 'test' | 'staging' | 'production' | string;
}

export function defineEnvironment(environment: EForgeEnvironment): Readonly<EForgeEnvironment> {
  const apiBaseUrl = environment.apiBaseUrl.replace(/\/$/, '');
  if (!apiBaseUrl) throw new Error('EForge environment requires apiBaseUrl.');
  return Object.freeze({...environment, apiBaseUrl});
}
