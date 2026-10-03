# EForge

EForge is an AI-native enterprise React frontend foundation for building scalable business applications.

It is deliberately **not** a low-code runtime. EForge keeps the application code-first while standardizing the capabilities that every enterprise product repeatedly rebuilds: design tokens, UI adapters, HTTP/auth/permission primitives, forms, data tables, page patterns, application routing metadata, and AI-coding rules.

## Principles

1. **Business applications depend on EForge, not Astryx directly.** Astryx is isolated behind `@eforge/ui`.
2. **Code first, schema ready.** `@eforge/schema-contract` defines stable metadata contracts without introducing a renderer runtime.
3. **Patterns before bespoke pages.** Prefer `ListPage`, `DetailPage`, `FormPage`, `DashboardPage`, and `WorkbenchPage`.
4. **Agent readable by default.** `AGENTS.md`, `CLAUDE.md`, catalog metadata, examples, and explicit architecture rules are first-class framework assets.
5. **Promote only proven abstractions.** Business components stay local until a shared abstraction is demonstrated across products.

## Stack

- React 19 + TypeScript
- Astryx 0.6.4 + neutral theme
- TanStack Query + TanStack Table
- React Hook Form + Zod
- pnpm workspaces + Turborepo
- Vitest + Playwright

## Packages

| Package | Responsibility |
| --- | --- |
| `@eforge/tokens` | Stable semantic design-token aliases |
| `@eforge/ui` | Astryx adapter and EForge provider |
| `@eforge/core` | HTTP, auth, permissions, storage, logging, flags, environment |
| `@eforge/app` | Route config, router adapters, generated navigation/breadcrumbs, route guards, 403/404 |
| `@eforge/forms` | React Hook Form + Zod integration and form primitives |
| `@eforge/data` | Query client, searchable/paginated data table, data states |
| `@eforge/patterns` | Enterprise page/layout patterns and permission gate |
| `@eforge/schema-contract` | Type-only future schema contracts; **no runtime** |
| `@eforge/agent` | Machine-readable catalog for Codex / Claude Code |

## Applications

- `apps/docs` — architecture and package documentation surface
- `apps/playground` — component integration sandbox
- `examples/admin-demo` — reference enterprise application used for end-to-end validation

## Quick start

```bash
corepack enable
pnpm install
pnpm verify
pnpm dev
```

Astryx component documentation is available to developers and coding agents through:

```bash
pnpm astryx -- component Button
pnpm astryx -- component --list
pnpm astryx -- docs tokens
```

## Using EForge in an application

```tsx
import '@eforge/ui/styles.css';
import '@eforge/data/styles.css';
import '@eforge/forms/styles.css';
import '@eforge/patterns/styles.css';

import {Button, EForgeProvider} from '@eforge/ui';
import {EForgeQueryProvider} from '@eforge/data';
import {ListPage} from '@eforge/patterns';

export function App() {
  return (
    <EForgeProvider>
      <EForgeQueryProvider>
        <ListPage title="Customers" actions={<Button label="New customer" variant="primary" />}>
          {/* business content */}
        </ListPage>
      </EForgeQueryProvider>
    </EForgeProvider>
  );
}
```

## Governance

See `ARCHITECTURE.md`, `docs/component-governance.md`, and `AGENTS.md` before adding framework capabilities. Business-specific components must not be promoted into EForge solely for convenience.

## Status

`v0.4` adds a lightweight application runtime on top of the component, data, and page-pattern foundation. Rich editors, workflows, charts, low-code rendering, and business-domain packages remain intentionally deferred until real product usage proves the abstraction.
