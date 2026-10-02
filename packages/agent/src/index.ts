export type CatalogCategory =
  | 'foundation'
  | 'ui'
  | 'data'
  | 'form'
  | 'pattern'
  | 'infrastructure';

export type CatalogKind = 'component' | 'hook' | 'provider' | 'utility' | 'type';
export type CatalogStatus = 'stable' | 'beta';

export interface CatalogCategoryDefinition {
  id: CatalogCategory;
  label: string;
  description: string;
}

export interface CatalogEntry {
  package: string;
  name: string;
  category: CatalogCategory;
  kind: CatalogKind;
  status: CatalogStatus;
  description: string;
  importPath: string;
  useWhen: string;
  avoidWhen?: string;
  tags: readonly string[];
  related?: readonly string[];
}

export const catalogCategories: readonly CatalogCategoryDefinition[] = [
  {
    id: 'ui',
    label: 'UI',
    description: 'Stable application-facing UI primitives adapted from Astryx.',
  },
  {
    id: 'data',
    label: 'Data',
    description: 'Remote-data, search, table, pagination, and data-state primitives.',
  },
  {
    id: 'form',
    label: 'Forms',
    description: 'Typed form composition and validation based on React Hook Form and Zod.',
  },
  {
    id: 'pattern',
    label: 'Patterns',
    description: 'Reusable enterprise page composition with no domain-specific nouns.',
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    description: 'Framework services for HTTP, auth, permissions, storage, flags, and logging.',
  },
  {
    id: 'foundation',
    label: 'Foundation',
    description: 'Cross-cutting contracts and metadata that keep products and agents aligned.',
  },
] as const;

export const foundationCatalog: readonly CatalogEntry[] = [
  {
    package: '@eforge/ui',
    name: 'Button',
    category: 'ui',
    kind: 'component',
    status: 'stable',
    description: 'Standard product action control exposed through the EForge UI boundary.',
    importPath: '@eforge/ui',
    useWhen: 'Rendering primary, secondary, or lightweight product actions.',
    avoidWhen: 'Creating a one-off clickable div or importing Astryx Button directly.',
    tags: ['action', 'interaction', 'astryx-adapter'],
  },
  {
    package: '@eforge/ui',
    name: 'Input',
    category: 'ui',
    kind: 'component',
    status: 'stable',
    description: 'Accessible controlled text input mapped to the current Astryx TextInput contract.',
    importPath: '@eforge/ui',
    useWhen: 'Collecting short text, email, password, or search-like values.',
    avoidWhen: 'A field is owned by React Hook Form; prefer FormTextField for standard forms.',
    tags: ['input', 'field', 'controlled'],
    related: ['FormTextField', 'SearchBar'],
  },
  {
    package: '@eforge/ui',
    name: 'Dialog',
    category: 'ui',
    kind: 'component',
    status: 'beta',
    description: 'Application-facing dialog primitive kept behind the EForge adapter boundary.',
    importPath: '@eforge/ui',
    useWhen: 'A focused modal interaction is genuinely shorter than navigating to a page.',
    avoidWhen: 'Building a large workflow or dense editor that deserves a full page or drawer pattern.',
    tags: ['overlay', 'modal'],
  },
  {
    package: '@eforge/ui',
    name: 'EForgeProvider',
    category: 'ui',
    kind: 'provider',
    status: 'stable',
    description: 'Top-level UI provider that owns EForge theme and Astryx integration.',
    importPath: '@eforge/ui',
    useWhen: 'Bootstrapping every EForge application or isolated integration surface.',
    tags: ['provider', 'theme', 'bootstrap'],
  },
  {
    package: '@eforge/data',
    name: 'EForgeQueryProvider',
    category: 'data',
    kind: 'provider',
    status: 'stable',
    description: 'TanStack Query provider with EForge server-state defaults.',
    importPath: '@eforge/data',
    useWhen: 'The application fetches remote/server state through TanStack Query.',
    avoidWhen: 'Using it for local view state or form state.',
    tags: ['query', 'server-state', 'provider'],
  },
  {
    package: '@eforge/data',
    name: 'SearchBar',
    category: 'data',
    kind: 'component',
    status: 'stable',
    description: 'Standard accessible search field for enterprise list surfaces.',
    importPath: '@eforge/data',
    useWhen: 'Filtering a list or table by a free-text query.',
    avoidWhen: 'Building a complex multi-field filter form.',
    tags: ['search', 'filter', 'list'],
    related: ['DataTable', 'ListPage'],
  },
  {
    package: '@eforge/data',
    name: 'DataTable',
    category: 'data',
    kind: 'component',
    status: 'stable',
    description: 'TanStack Table-backed enterprise table with pagination and standard states.',
    importPath: '@eforge/data',
    useWhen: 'Rendering tabular business data with predictable loading, empty, and pagination behavior.',
    avoidWhen: 'The information is not naturally tabular or requires spreadsheet-grade editing.',
    tags: ['table', 'pagination', 'keyboard'],
    related: ['SearchBar', 'LoadingState', 'EmptyDataState'],
  },
  {
    package: '@eforge/data',
    name: 'LoadingState',
    category: 'data',
    kind: 'component',
    status: 'stable',
    description: 'Consistent loading feedback for data surfaces.',
    importPath: '@eforge/data',
    useWhen: 'A region is waiting for remote or expensive data.',
    tags: ['loading', 'state'],
  },
  {
    package: '@eforge/data',
    name: 'ErrorState',
    category: 'data',
    kind: 'component',
    status: 'stable',
    description: 'Consistent recoverable error feedback with optional retry action.',
    importPath: '@eforge/data',
    useWhen: 'A data region failed and the user can retry or needs a clear failure explanation.',
    tags: ['error', 'retry', 'state'],
  },
  {
    package: '@eforge/data',
    name: 'EmptyDataState',
    category: 'data',
    kind: 'component',
    status: 'stable',
    description: 'Consistent empty-result or no-data presentation.',
    importPath: '@eforge/data',
    useWhen: 'A table or data region has no records to present.',
    tags: ['empty', 'state'],
  },
  {
    package: '@eforge/forms',
    name: 'useZodForm',
    category: 'form',
    kind: 'hook',
    status: 'stable',
    description: 'Typed React Hook Form setup with a Zod resolver.',
    importPath: '@eforge/forms',
    useWhen: 'Building validated forms with a single typed schema as the validation contract.',
    avoidWhen: 'Adding a second validation/state system beside React Hook Form.',
    tags: ['form', 'validation', 'zod'],
    related: ['FormTextField', 'FormActions'],
  },
  {
    package: '@eforge/forms',
    name: 'FormTextField',
    category: 'form',
    kind: 'component',
    status: 'stable',
    description: 'Form-controlled text field with validation feedback wired to EForge Input.',
    importPath: '@eforge/forms',
    useWhen: 'A text field belongs to a React Hook Form controlled form.',
    tags: ['form', 'field', 'validation'],
    related: ['useZodForm', 'Input'],
  },
  {
    package: '@eforge/forms',
    name: 'FormSection',
    category: 'form',
    kind: 'component',
    status: 'stable',
    description: 'Semantic grouping for related form fields with title and description.',
    importPath: '@eforge/forms',
    useWhen: 'A form has multiple conceptual groups that need readable structure.',
    tags: ['form', 'section'],
  },
  {
    package: '@eforge/forms',
    name: 'FormActions',
    category: 'form',
    kind: 'component',
    status: 'stable',
    description: 'Consistent action row for submit, cancel, and secondary form actions.',
    importPath: '@eforge/forms',
    useWhen: 'A form needs aligned submit/cancel actions.',
    tags: ['form', 'actions'],
  },
  {
    package: '@eforge/patterns',
    name: 'AppShell',
    category: 'pattern',
    kind: 'component',
    status: 'stable',
    description: 'Enterprise application shell with brand, primary navigation, header, and content region.',
    importPath: '@eforge/patterns',
    useWhen: 'Building the top-level shell of an authenticated enterprise application.',
    avoidWhen: 'Embedding a small standalone widget inside another product.',
    tags: ['shell', 'navigation', 'layout'],
  },
  {
    package: '@eforge/patterns',
    name: 'PageHeader',
    category: 'pattern',
    kind: 'component',
    status: 'stable',
    description: 'Standard title, description, metadata, eyebrow, and page-action composition.',
    importPath: '@eforge/patterns',
    useWhen: 'A product page needs a predictable enterprise heading hierarchy.',
    tags: ['header', 'page', 'actions'],
  },
  {
    package: '@eforge/patterns',
    name: 'ListPage',
    category: 'pattern',
    kind: 'component',
    status: 'stable',
    description: 'Page composition for search, filters, actions, and list/table content.',
    importPath: '@eforge/patterns',
    useWhen: 'Building search/filter/table list experiences.',
    avoidWhen: 'The page is primarily a detail editor or multi-pane workbench.',
    tags: ['list', 'table', 'filters'],
    related: ['SearchBar', 'DataTable'],
  },
  {
    package: '@eforge/patterns',
    name: 'DetailPage',
    category: 'pattern',
    kind: 'component',
    status: 'stable',
    description: 'Entity detail layout with optional secondary sidebar context.',
    importPath: '@eforge/patterns',
    useWhen: 'Building a record or entity detail experience.',
    tags: ['detail', 'sidebar'],
  },
  {
    package: '@eforge/patterns',
    name: 'FormPage',
    category: 'pattern',
    kind: 'component',
    status: 'stable',
    description: 'Constrained-width page layout for create/edit forms.',
    importPath: '@eforge/patterns',
    useWhen: 'A page is primarily a structured form.',
    tags: ['form', 'page'],
  },
  {
    package: '@eforge/patterns',
    name: 'DashboardPage',
    category: 'pattern',
    kind: 'component',
    status: 'stable',
    description: 'Twelve-column dashboard composition for cards and summary regions.',
    importPath: '@eforge/patterns',
    useWhen: 'A page summarizes multiple metrics or operational regions.',
    tags: ['dashboard', 'grid'],
  },
  {
    package: '@eforge/patterns',
    name: 'WorkbenchPage',
    category: 'pattern',
    kind: 'component',
    status: 'stable',
    description: 'Dense one-, two-, or three-pane workspace for enterprise and AI-assisted work.',
    importPath: '@eforge/patterns',
    useWhen: 'Building report editors, review workspaces, evidence panels, or other dense tools.',
    avoidWhen: 'A conventional list or form page is sufficient.',
    tags: ['workbench', 'three-pane', 'ai'],
  },
  {
    package: '@eforge/patterns',
    name: 'PermissionGate',
    category: 'pattern',
    kind: 'component',
    status: 'stable',
    description: 'Declarative permission-aware rendering for UI capabilities.',
    importPath: '@eforge/patterns',
    useWhen: 'A UI region is conditional on one or more application permissions.',
    avoidWhen: 'Treating hidden UI as the only authorization boundary; APIs still enforce authorization.',
    tags: ['permission', 'rbac'],
  },
  {
    package: '@eforge/core',
    name: 'createHttpClient',
    category: 'infrastructure',
    kind: 'utility',
    status: 'stable',
    description: 'Consistent JSON/multipart HTTP client with normalized auth and error behavior.',
    importPath: '@eforge/core',
    useWhen: 'Calling application APIs through the shared infrastructure layer.',
    avoidWhen: 'Creating feature-local fetch wrappers that duplicate auth/error handling.',
    tags: ['http', 'api', 'error'],
  },
  {
    package: '@eforge/schema-contract',
    name: 'FieldDefinition',
    category: 'foundation',
    kind: 'type',
    status: 'beta',
    description: 'Metadata contract for describing fields without implying a renderer runtime.',
    importPath: '@eforge/schema-contract',
    useWhen: 'Sharing typed field metadata between tools, generators, or application layers.',
    avoidWhen: 'Trying to implement a low-code renderer, expression engine, or visual builder.',
    tags: ['schema', 'metadata', 'type-only'],
  },
] as const;

export function findCatalogEntries(query: string): readonly CatalogEntry[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return foundationCatalog;

  return foundationCatalog.filter(entry =>
    [
      entry.package,
      entry.name,
      entry.category,
      entry.kind,
      entry.description,
      entry.useWhen,
      entry.avoidWhen ?? '',
      ...entry.tags,
      ...(entry.related ?? []),
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalized),
  );
}
