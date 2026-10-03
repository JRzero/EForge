export type CatalogCategory =
  | 'foundation'
  | 'ui'
  | 'data'
  | 'application'
  | 'form'
  | 'pattern'
  | 'infrastructure';

export type CatalogStatus = 'stable' | 'preview' | 'contract-only';

export interface CatalogEntry {
  id: string;
  package: string;
  name: string;
  category: CatalogCategory;
  status: CatalogStatus;
  useWhen: string;
  avoidWhen?: string;
  imports: readonly string[];
  docsAnchor: string;
}

export interface PackageCatalogEntry {
  package: string;
  purpose: string;
  dependsOn: readonly string[];
  consumers: string;
}

export const packageCatalog: readonly PackageCatalogEntry[] = [
  {
    package: '@eforge/ui',
    purpose: 'Stable application-facing adapter over Astryx primitives.',
    dependsOn: ['@astryxdesign/core', '@eforge/tokens'],
    consumers: 'All React product applications.',
  },
  {
    package: '@eforge/core',
    purpose: 'React-free HTTP, auth, permissions, storage, environment, flags, and logging primitives.',
    dependsOn: [],
    consumers: 'Browser apps and framework packages.',
  },
  {
    package: '@eforge/app',
    purpose: 'Route metadata, router adapters, generated navigation, breadcrumbs, route permissions, and browser application bootstrap.',
    dependsOn: ['@eforge/core', '@eforge/patterns'],
    consumers: 'Enterprise browser applications.',
  },
  {
    package: '@eforge/forms',
    purpose: 'React Hook Form and Zod integration with EForge field conventions.',
    dependsOn: ['@eforge/ui'],
    consumers: 'Validated product forms.',
  },
  {
    package: '@eforge/data',
    purpose: 'TanStack Query, enterprise list query state, filtering, table controls, pagination, selection, and common data states.',
    dependsOn: ['@eforge/ui'],
    consumers: 'List pages and remote-data experiences.',
  },
  {
    package: '@eforge/patterns',
    purpose: 'Enterprise page composition and permission-aware rendering.',
    dependsOn: ['@eforge/core'],
    consumers: 'Application page shells and layouts.',
  },
  {
    package: '@eforge/schema-contract',
    purpose: 'Type-only metadata contracts without a rendering runtime.',
    dependsOn: [],
    consumers: 'Products that need portable metadata definitions.',
  },
  {
    package: '@eforge/agent',
    purpose: 'Machine-readable package and component catalog for coding agents.',
    dependsOn: [],
    consumers: 'Codex, Claude Code, docs tooling, and human maintainers.',
  },
] as const;

export const foundationCatalog: readonly CatalogEntry[] = [
  {
    id: 'ui-button',
    package: '@eforge/ui',
    name: 'Button',
    category: 'ui',
    status: 'stable',
    useWhen: 'Rendering standard product actions.',
    avoidWhen: 'The interaction is navigation; use the application router link primitive instead.',
    imports: ['Button'],
    docsAnchor: 'ui-button',
  },
  {
    id: 'ui-input',
    package: '@eforge/ui',
    name: 'Input',
    category: 'ui',
    status: 'stable',
    useWhen: 'Collecting short text values with accessible labels and validation state.',
    imports: ['Input'],
    docsAnchor: 'ui-input',
  },
  {
    id: 'data-search-bar',
    package: '@eforge/data',
    name: 'SearchBar',
    category: 'data',
    status: 'stable',
    useWhen: 'Adding an accessible search field to a list page.',
    imports: ['SearchBar'],
    docsAnchor: 'data-search-bar',
  },
  {
    id: 'data-filter-bar',
    package: '@eforge/data',
    name: 'FilterBar',
    category: 'data',
    status: 'stable',
    useWhen: 'Composing search, domain-neutral filter controls, active-filter count, clear behavior, and list actions into one toolbar.',
    avoidWhen: 'A page has only one search input and no filter or list-level action composition.',
    imports: ['FilterBar', 'SearchBar'],
    docsAnchor: 'data-filter-bar',
  },
  {
    id: 'data-query-state',
    package: '@eforge/data',
    name: 'useListQueryState',
    category: 'data',
    status: 'stable',
    useWhen: 'Keeping search, filters, sorting, and pagination in one route-independent state model, especially for server-backed lists.',
    avoidWhen: 'A component owns only local visual state unrelated to list querying.',
    imports: ['useListQueryState', 'createListQueryState', 'updateListQueryState'],
    docsAnchor: 'data-query-state',
  },
  {
    id: 'data-table',
    package: '@eforge/data',
    name: 'DataTable',
    category: 'data',
    status: 'stable',
    useWhen: 'Rendering enterprise tabular data with client or server pagination, sorting, column visibility, bulk row selection, and standard states.',
    avoidWhen: 'The primary interaction is free-form editing or spreadsheet-style cell manipulation.',
    imports: ['DataTable', 'ColumnDef', 'PaginationState', 'SortingState'],
    docsAnchor: 'data-table',
  },
  {
    id: 'data-states',
    package: '@eforge/data',
    name: 'Data states',
    category: 'data',
    status: 'stable',
    useWhen: 'Representing loading, empty, and recoverable error states consistently.',
    imports: ['LoadingState', 'EmptyDataState', 'ErrorState'],
    docsAnchor: 'data-states',
  },
  {
    id: 'app-runtime',
    package: '@eforge/app',
    name: 'EForgeApplication',
    category: 'application',
    status: 'stable',
    useWhen: 'Bootstrapping an enterprise browser application from one route configuration that drives navigation, breadcrumbs, route guards, and 403/404 handling.',
    avoidWhen: 'Embedding one isolated widget that does not own application navigation.',
    imports: ['EForgeApplication', 'defineAppRoutes'],
    docsAnchor: 'app-runtime',
  },
  {
    id: 'app-router-adapter',
    package: '@eforge/app',
    name: 'AppRouterAdapter',
    category: 'application',
    status: 'stable',
    useWhen: 'Integrating EForge application runtime with browser history, tests, or a future external routing adapter.',
    avoidWhen: 'Adding product-specific routing semantics directly to the foundation.',
    imports: ['AppRouterAdapter', 'createBrowserRouterAdapter', 'createMemoryRouterAdapter'],
    docsAnchor: 'app-router-adapter',
  },
  {
    id: 'app-runtime-hooks',
    package: '@eforge/app',
    name: 'useAppRuntime / AppLink',
    category: 'application',
    status: 'stable',
    useWhen: 'Navigating from page code or reading current route metadata and dynamic route params.',
    imports: ['useAppRuntime', 'AppLink'],
    docsAnchor: 'app-runtime-hooks',
  },
  {
    id: 'form-zod',
    package: '@eforge/forms',
    name: 'useZodForm',
    category: 'form',
    status: 'stable',
    useWhen: 'Building validated product forms backed by a Zod schema.',
    imports: ['useZodForm', 'FormTextField'],
    docsAnchor: 'form-zod',
  },
  {
    id: 'form-layout',
    package: '@eforge/forms',
    name: 'FormSection / FormActions',
    category: 'form',
    status: 'stable',
    useWhen: 'Structuring enterprise forms into readable sections with a consistent action area.',
    imports: ['FormSection', 'FormActions'],
    docsAnchor: 'form-layout',
  },
  {
    id: 'pattern-list-page',
    package: '@eforge/patterns',
    name: 'ListPage',
    category: 'pattern',
    status: 'stable',
    useWhen: 'Building search/filter/table list experiences.',
    imports: ['ListPage'],
    docsAnchor: 'pattern-list-page',
  },
  {
    id: 'pattern-detail-page',
    package: '@eforge/patterns',
    name: 'DetailPage',
    category: 'pattern',
    status: 'stable',
    useWhen: 'Building entity detail pages with optional secondary context.',
    imports: ['DetailPage'],
    docsAnchor: 'pattern-detail-page',
  },
  {
    id: 'pattern-workbench-page',
    package: '@eforge/patterns',
    name: 'WorkbenchPage',
    category: 'pattern',
    status: 'stable',
    useWhen: 'Building dense three-pane enterprise or AI workspaces.',
    avoidWhen: 'A simpler list, detail, dashboard, or form page communicates the task clearly.',
    imports: ['WorkbenchPage'],
    docsAnchor: 'pattern-workbench-page',
  },
  {
    id: 'pattern-permissions',
    package: '@eforge/patterns',
    name: 'PermissionGate',
    category: 'pattern',
    status: 'stable',
    useWhen: 'Conditionally rendering UI based on product permissions.',
    avoidWhen: 'Enforcing server-side authorization; UI permission checks are never a security boundary.',
    imports: ['PermissionProvider', 'PermissionGate'],
    docsAnchor: 'pattern-permissions',
  },
  {
    id: 'core-http',
    package: '@eforge/core',
    name: 'createHttpClient',
    category: 'infrastructure',
    status: 'stable',
    useWhen: 'Calling JSON or multipart APIs with consistent auth and error handling.',
    imports: ['createHttpClient'],
    docsAnchor: 'core-http',
  },
  {
    id: 'schema-field-definition',
    package: '@eforge/schema-contract',
    name: 'FieldDefinition',
    category: 'foundation',
    status: 'contract-only',
    useWhen: 'Describing field metadata that products may store or exchange.',
    avoidWhen: 'Trying to implement a low-code renderer, expression engine, or visual builder.',
    imports: ['FieldDefinition'],
    docsAnchor: 'schema-field-definition',
  },
] as const;

export function findCatalogEntry(id: string) {
  return foundationCatalog.find(entry => entry.id === id);
}
