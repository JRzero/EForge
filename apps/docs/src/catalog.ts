import {foundationCatalog, packageCatalog} from '@eforge/agent';

export const docsSections = [
  {
    id: 'principles',
    label: 'Principles',
    description: 'How EForge decides what belongs in the foundation.',
  },
  {
    id: 'packages',
    label: 'Packages',
    description: 'Public package boundaries and responsibilities.',
  },
  {
    id: 'components',
    label: 'Components',
    description: 'Stable component and pattern contracts available to product code.',
  },
] as const;

export {foundationCatalog, packageCatalog};
