# EForge Agent Contract

This repository is an enterprise frontend foundation optimized for human developers and coding agents.

## Non-negotiable rules

1. Never import `@astryxdesign/*` from apps, examples, or business code. Only `packages/ui` may do that.
2. Prefer an existing EForge component or pattern before creating a new abstraction.
3. Do not hard-code visual colors when an Astryx/EForge token exists.
4. Keep `@eforge/core` React-free.
5. Keep `@eforge/schema-contract` type-only. Do not add a renderer runtime, expression language, event engine, or visual builder without an explicit architecture decision.
6. Do not add domain-specific components to the foundation until they are proven reusable across products.
7. New public API must include documentation and verification coverage appropriate to its risk.
8. Maintain keyboard and accessible-name behavior for interactive controls.
9. Search `@eforge/agent` catalog metadata before introducing a new shared abstraction.
10. Any new public EForge API must update machine-readable catalog metadata and human documentation in the same change.

## Preferred composition

- Enterprise list page: `ListPage` + `SearchBar` + `DataTable`.
- Forms: `useZodForm` + `FormTextField` + `FormActions`.
- Permission-aware UI: `PermissionProvider` + `PermissionGate`.
- Remote data: `EForgeQueryProvider` and TanStack Query.
- HTTP: `createHttpClient` from `@eforge/core`.

## Astryx

Astryx is the underlying design system, not the application-facing API. To inspect current component semantics, use the repository-pinned CLI:

```bash
pnpm astryx -- component Button
pnpm astryx -- component TextInput
pnpm astryx -- docs tokens
```

If an Astryx API changes, adapt `@eforge/ui` and keep EForge consumers stable whenever practical.

## Catalog and documentation

The canonical machine-readable catalog is exported by `@eforge/agent`. The docs application renders this same metadata for humans.

When adding a public API:
- add or update its catalog entry
- state when to use it and when not to use it when misuse is likely
- keep package/import metadata accurate
- add a live example when interaction behavior benefits from demonstration
- add browser coverage for critical docs interactions

## Verification

Before declaring a task complete run:

```bash
pnpm verify
```

At minimum, changes must pass lint, TypeScript, unit tests, all package/app builds, and Playwright admin-demo smoke tests.
