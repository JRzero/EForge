import type {ReactNode} from 'react';
import {Theme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral/built';

export interface EForgeProviderProps {
  children: ReactNode;
}

export function EForgeProvider({children}: EForgeProviderProps) {
  return <Theme theme={neutralTheme}>{children}</Theme>;
}
