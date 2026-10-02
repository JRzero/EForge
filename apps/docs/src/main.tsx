import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {EForgeProvider} from '@eforge/ui';
import {DashboardPage} from '@eforge/patterns';
import '@eforge/ui/styles.css';
import '@eforge/patterns/styles.css';
import './styles.css';

const packages = [
  ['@eforge/ui', 'Astryx adapter and stable application-facing UI exports.'],
  ['@eforge/core', 'HTTP, auth, permissions, storage, environment, flags, and logging.'],
  ['@eforge/forms', 'React Hook Form + Zod integration.'],
  ['@eforge/data', 'TanStack Query, searchable data table, and common data states.'],
  ['@eforge/patterns', 'Enterprise page shells and permission-aware composition.'],
  ['@eforge/schema-contract', 'Type-only metadata contracts; no renderer runtime.'],
  ['@eforge/agent', 'Machine-readable framework catalog for coding agents.'],
] as const;

function DocsApp() {
  return (
    <DashboardPage
      eyebrow="EForge v0.1"
      title="Enterprise React Foundation"
      description="A code-first, agent-readable foundation for reusable enterprise applications.">
      {packages.map(([name, description]) => (
        <article className="docs-card" key={name}>
          <code>{name}</code>
          <p>{description}</p>
        </article>
      ))}
    </DashboardPage>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EForgeProvider>
      <main className="docs-root"><DocsApp /></main>
    </EForgeProvider>
  </StrictMode>,
);
