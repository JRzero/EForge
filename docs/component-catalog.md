# EForge Component Catalog

The component catalog has two audiences: product developers and coding agents. The canonical machine-readable source is `@eforge/agent`; the docs application renders the same metadata for humans.

## Catalog contract

Every public EForge building block should identify:

- package and import path
- public name
- category and kind
- stability status
- a short semantic description
- when to use it
- when not to use it, when misuse is likely
- search tags
- related building blocks when composition matters

Do not add visual-only marketing copy to the machine-readable catalog. The catalog exists to help a developer or agent choose the correct abstraction before writing code.

## Categories

- **UI** — stable application-facing primitives adapted from Astryx.
- **Data** — query, search, table, pagination, and common data states.
- **Forms** — React Hook Form + Zod integration.
- **Patterns** — reusable enterprise page composition without domain nouns.
- **Infrastructure** — HTTP, auth, permission, storage, flags, and logging.
- **Foundation** — cross-cutting contracts and metadata.

## Public API rule

A new public API is not complete until its catalog metadata and verification coverage are updated. The docs site should be able to discover the API by name, package, capability, or common usage intent.

## Product-domain rule

Do not add product nouns such as `ESGMetric`, `CustomerOpportunity`, or `AuditEvidencePanel` to the EForge catalog merely because one product needs them. Keep them local until repeated product use demonstrates a stable domain-neutral contract.
