# Agent Development with EForge

EForge is designed so coding agents can choose framework abstractions before generating new code.

## Default decision flow

1. Read the repository `AGENTS.md`.
2. Search `@eforge/agent` catalog metadata for the required capability.
3. Prefer a documented EForge component or pattern.
4. If adapter behavior is unclear, inspect the repository-pinned Astryx CLI documentation.
5. Keep domain-specific components in the product.
6. Update catalog metadata when introducing a new public EForge API.
7. Add verification at the lowest useful level and run `pnpm verify`.

## Astryx boundary

Application, example, and product code must not import `@astryxdesign/*` directly. Astryx is an implementation dependency of `@eforge/ui`. This keeps product code stable when Astryx changes.

## Recommended composition

```text
List        ListPage + SearchBar + DataTable
Form        FormPage + useZodForm + FormTextField + FormActions
Detail      DetailPage + product-domain content
Workbench   WorkbenchPage + product-domain panels
Permission  PermissionProvider + PermissionGate
Remote data EForgeQueryProvider + TanStack Query
HTTP        createHttpClient
```

## Before creating a new abstraction

An agent should answer three questions:

1. Does an EForge catalog entry already solve the capability?
2. Is this requirement domain-neutral or product-specific?
3. Is there repeated usage proving that a new shared API is stable?

If the answer to the third question is no, prefer a local component.
