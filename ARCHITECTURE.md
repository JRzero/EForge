# EForge Architecture

## Layer model

```text
Business Application
        │
        ▼
@eforge/app        application runtime + route metadata
        │
        ▼
@eforge/patterns   enterprise page patterns
@eforge/data       query + tabular data behavior
@eforge/forms      forms + validation behavior
        │
        ▼
@eforge/ui         stable UI adapter
        │
        ▼
Astryx             underlying design system
```

Cross-cutting packages:

```text
@eforge/core            application infrastructure
@eforge/tokens          semantic design aliases
@eforge/schema-contract future-facing metadata types only
@eforge/agent           AI coding contract and catalog
```

## Dependency rules

- Product code MUST import Astryx components through `@eforge/ui`.
- `@eforge/ui` MAY depend on Astryx. Other EForge packages SHOULD depend on `@eforge/ui`, not Astryx.
- `@eforge/core` stays React-free.
- `@eforge/app` owns route metadata, browser navigation adapters, generated navigation/breadcrumbs, and route-level permission UX. It must not own product loaders, backend authorization, or domain workflow state.
- `@eforge/schema-contract` contains no renderer, expression engine, event bus, or data-scope runtime.
- `@eforge/patterns` contains reusable page composition, never domain nouns such as Customer, ESGMetric, or ProjectApproval.
- Business components are promoted only after repeated use demonstrates a stable abstraction.

## Stability boundary

The public EForge package APIs are the compatibility boundary. Astryx is currently a 0.x dependency, so EForge intentionally prevents business applications from coupling to its APIs. An Astryx upgrade should primarily affect `@eforge/ui` and visual validation, not product feature code.

## State boundaries

- Remote/server state: TanStack Query.
- Form state: React Hook Form.
- Authentication state: `@eforge/core` observable auth store.
- Route/location state: `@eforge/app` through an `AppRouterAdapter`.
- Local view state: React state first; introduce a dedicated state library only when a concrete cross-tree use case requires it.

## Schema position

EForge v0.1 defines reusable metadata shapes such as `FieldDefinition` and `ColumnDefinition`. It does **not** render arbitrary JSON schemas. If repeated product evidence later justifies a schema runtime, it must be an optional layer above existing components rather than a replacement for React code.
