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

The goal of v0.2 is not to expand the framework surface aggressively. It is to make the existing public surface explicit, searchable, testable, and usable by both humans and coding agents.

- human-readable component catalog
- machine-readable package/component catalog in `@eforge/agent`
- documented package boundaries
- use-when / avoid-when guidance
- live examples for core UI, data, forms, and permissions
- documentation search
- independent documentation browser verification
- keep Astryx behind `@eforge/ui`
- keep `@eforge/schema-contract` contract-only

## Candidate later capabilities

Only after real product usage validates need:

- route integration adapters
- file upload UI patterns
- richer filtering/query state
- notification provider
- i18n message layer
- chart package

## Deferred intentionally

- low-code renderer runtime
- expression language
- visual builder
- workflow engine
- rich-text editor package
- CRM/ESG/project-specific components
