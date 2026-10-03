import {StrictMode, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {EForgeProvider, Input} from '@eforge/ui';
import {PageHeader} from '@eforge/patterns';
import {foundationCatalog, packageCatalog} from './catalog';
import {DataExamples, FormExamples, PermissionExamples, UiExamples} from './examples';
import '@eforge/ui/styles.css';
import '@eforge/data/styles.css';
import '@eforge/forms/styles.css';
import '@eforge/patterns/styles.css';
import './styles.css';

function StatusPill({status}: {status: string}) {
  return <span className={`status-pill status-pill--${status}`}>{status}</span>;
}

function GuidanceCard({
  title,
  children,
  tone = 'default',
}: {
  title: string;
  children: React.ReactNode;
  tone?: 'default' | 'positive' | 'negative';
}) {
  return (
    <article className={`guidance-card guidance-card--${tone}`}>
      <strong>{title}</strong>
      <div>{children}</div>
    </article>
  );
}

function ComponentExample({id}: {id: string}) {
  if (id === 'ui-button') return <UiExamples />;
  if (id === 'data-table') return <DataExamples />;
  if (id === 'form-layout') return <FormExamples />;
  if (id === 'pattern-permissions') return <PermissionExamples />;
  return null;
}

function DocsApp() {
  const [query, setQuery] = useState('');

  const filteredCatalog = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return foundationCatalog;
    return foundationCatalog.filter(entry =>
      [
        entry.name,
        entry.package,
        entry.category,
        entry.status,
        entry.useWhen,
        entry.avoidWhen ?? '',
        ...entry.imports,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalized),
    );
  }, [query]);

  return (
    <div className="docs-shell">
      <aside className="docs-sidebar">
        <a className="docs-brand" href="#top">
          <strong>EForge</strong>
          <span>v0.2 catalog</span>
        </a>
        <nav aria-label="Documentation sections">
          <a href="#principles">Principles</a>
          <a href="#packages">Packages</a>
          <a href="#components">Components</a>
          <a href="#agent-contract">Agent contract</a>
        </nav>
        <div className="sidebar-note">
          Product code imports EForge packages, never <code>@astryxdesign/*</code> directly.
        </div>
      </aside>

      <main className="docs-main" id="top">
        <PageHeader
          eyebrow="EForge v0.2"
          title="Enterprise component catalog"
          description="Human-readable and agent-readable contracts for building consistent enterprise React products."
          meta={<span>{foundationCatalog.length} public catalog entries · {packageCatalog.length} packages</span>}
        />

        <section className="docs-section" id="principles">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Governance</span>
              <h2>Promote patterns only after reuse proves the contract</h2>
            </div>
          </div>
          <div className="guidance-grid">
            <GuidanceCard title="Do" tone="positive">
              Reuse EForge public APIs, keep domain components local, and promote only repeated domain-neutral contracts.
            </GuidanceCard>
            <GuidanceCard title="Do not" tone="negative">
              Add CRM, ESG, project-specific components, renderer runtimes, or styling forks just because one product needs them.
            </GuidanceCard>
            <GuidanceCard title="Boundary">
              Astryx is the underlying design system. EForge is the application-facing API and compatibility layer.
            </GuidanceCard>
          </div>
        </section>

        <section className="docs-section" id="packages">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Architecture</span>
              <h2>Package boundaries</h2>
            </div>
          </div>
          <div className="package-grid">
            {packageCatalog.map(entry => (
              <article className="package-card" key={entry.package}>
                <code>{entry.package}</code>
                <p>{entry.purpose}</p>
                <dl>
                  <div>
                    <dt>Consumers</dt>
                    <dd>{entry.consumers}</dd>
                  </div>
                  <div>
                    <dt>Depends on</dt>
                    <dd>{entry.dependsOn.length ? entry.dependsOn.join(', ') : 'No EForge package dependency'}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="docs-section" id="components">
          <div className="section-heading section-heading--search">
            <div>
              <span className="section-kicker">Public API</span>
              <h2>Components and patterns</h2>
              <p>Search by component, package, category, use case, or import name.</p>
            </div>
            <Input
              label="Search component catalog"
              isLabelHidden
              value={query}
              onChange={setQuery}
              placeholder="Search components…"
              width={320}
              hasClear
            />
          </div>

          <div className="catalog-list" aria-live="polite">
            {filteredCatalog.map(entry => {
              const example = <ComponentExample id={entry.id} />;
              return (
                <article className="catalog-card" id={entry.docsAnchor} key={entry.id}>
                  <header className="catalog-card__header">
                    <div>
                      <div className="catalog-card__meta">
                        <code>{entry.package}</code>
                        <span>{entry.category}</span>
                        <StatusPill status={entry.status} />
                      </div>
                      <h3>{entry.name}</h3>
                    </div>
                    <code className="import-list">{entry.imports.join(', ')}</code>
                  </header>
                  <div className="catalog-card__guidance">
                    <p><strong>Use when:</strong> {entry.useWhen}</p>
                    {entry.avoidWhen && <p><strong>Avoid when:</strong> {entry.avoidWhen}</p>}
                  </div>
                  {example && <div className="live-example">{example}</div>}
                </article>
              );
            })}
            {filteredCatalog.length === 0 && (
              <div className="catalog-empty">No catalog entries match “{query}”.</div>
            )}
          </div>
        </section>

        <section className="docs-section" id="agent-contract">
          <div className="section-heading">
            <div>
              <span className="section-kicker">AI-native</span>
              <h2>Agent contract</h2>
            </div>
          </div>
          <div className="agent-contract">
            <code>AGENTS.md</code>
            <p>
              Coding agents should inspect the catalog before inventing abstractions, import Astryx only through
              <code> @eforge/ui</code>, keep schema-contract type-only, and run <code>pnpm verify</code> before completion.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EForgeProvider>
      <DocsApp />
    </EForgeProvider>
  </StrictMode>,
);
