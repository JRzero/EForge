export interface CatalogEntry {
  package: string;
  name: string;
  category: 'foundation' | 'ui' | 'data' | 'form' | 'pattern' | 'infrastructure';
  useWhen: string;
  avoidWhen?: string;
}

export const foundationCatalog: readonly CatalogEntry[] = [
  {
    package: '@eforge/ui',
    name: 'Button',
    category: 'ui',
    useWhen: 'Rendering standard product actions.',
  },
  {
    package: '@eforge/data',
    name: 'DataTable',
    category: 'data',
    useWhen: 'Rendering enterprise tabular data with client pagination and standard states.',
  },
  {
    package: '@eforge/data',
    name: 'SearchBar',
    category: 'data',
    useWhen: 'Adding a standard accessible search field to list pages.',
  },
  {
    package: '@eforge/forms',
    name: 'useZodForm',
    category: 'form',
    useWhen: 'Building validated product forms backed by Zod.',
  },
  {
    package: '@eforge/patterns',
    name: 'ListPage',
    category: 'pattern',
    useWhen: 'Building search/filter/table list experiences.',
  },
  {
    package: '@eforge/patterns',
    name: 'DetailPage',
    category: 'pattern',
    useWhen: 'Building entity detail pages with optional secondary context.',
  },
  {
    package: '@eforge/patterns',
    name: 'WorkbenchPage',
    category: 'pattern',
    useWhen: 'Building dense three-pane enterprise or AI workspaces.',
  },
  {
    package: '@eforge/core',
    name: 'createHttpClient',
    category: 'infrastructure',
    useWhen: 'Calling JSON or multipart APIs with consistent auth/error handling.',
  },
  {
    package: '@eforge/schema-contract',
    name: 'FieldDefinition',
    category: 'foundation',
    useWhen: 'Describing field metadata without introducing schema rendering.',
    avoidWhen: 'Trying to implement a low-code renderer or visual builder.',
  },
] as const;
