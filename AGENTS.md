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

## Preferred composition

- Enterprise list page: `ListPage` + `FilterBar` + `useListQueryState` + `DataTable`.
- Server-backed lists: control `paginationState` and `sorting`, set `manualPagination` / `manualSorting`, provide a stable `getRowId`, and keep request execution in product code or TanStack Query.
- Bulk selection: use `DataTable` selection APIs; do not treat UI selection as authorization or as proof that unloaded rows are available client-side.
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

## Verification

Before declaring a task complete run:

```bash
pnpm verify
```

At minimum, changes must pass lint, TypeScript, unit tests, all package/app builds, and Playwright admin-demo smoke tests.
