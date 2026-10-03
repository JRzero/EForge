# Roadmap

## v0.1 Foundation

- Astryx adapter
- semantic tokens
- core HTTP/auth/permissions/storage/logger/feature flags
- forms + Zod
- query + table primitives
- enterprise page patterns
- schema contracts only
- agent contract and catalog
- admin reference application
- CI, unit, build and browser validation

## v0.2 Component system and documentation

- human-readable component catalog
- machine-readable package/component catalog in `@eforge/agent`
- documented package boundaries
- use-when / avoid-when guidance
- live examples for core UI, data, forms, and permissions
- documentation search
- independent documentation browser verification
- keep Astryx behind `@eforge/ui`
- keep `@eforge/schema-contract` contract-only

## v0.3 Enterprise list infrastructure

The goal of v0.3 is to make list pages production-capable without introducing domain-specific abstractions.

- route-independent `ListQueryState`
- `useListQueryState` for search/filter/sort/pagination coordination
- query changes reset pagination predictably
- `FilterBar` composition with active-filter and clear behavior
- client or server pagination in `DataTable`
- client or server sorting
- column visibility control
- row selection and select-all-page behavior
- bulk-action rendering contract
- controlled or uncontrolled table state
- admin reference app upgraded to server-style list behavior
- unit and browser verification for the new state and interactions

## Candidate later capabilities

Only after real product usage validates need:

- route integration adapters and URL serialization
- file upload UI patterns
- notification provider
- i18n message layer
- chart package
- saved views and filter presets

## Deferred intentionally

- low-code renderer runtime
- expression language
- visual builder
- workflow engine
- rich-text editor package
- CRM/ESG/project-specific components
