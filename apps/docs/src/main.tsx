import {StrictMode, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {
  catalogCategories,
  findCatalogEntries,
  foundationCatalog,
  type CatalogEntry,
  type CatalogCategory,
} from '@eforge/agent';
import {DataTable, SearchBar, type ColumnDef} from '@eforge/data';
import {Button, EForgeProvider, Input} from '@eforge/ui';
import {AppShell, DashboardPage} from '@eforge/patterns';
import '@eforge/ui/styles.css';
import '@eforge/data/styles.css';
import '@eforge/patterns/styles.css';
import './styles.css';

interface DemoUser {
  name: string;
  role: string;
  status: string;
}

const demoUsers: readonly DemoUser[] = [
  {name: 'Alice Chen', role: 'Administrator', status: 'Active'},
  {name: 'Nora Patel', role: 'Reviewer', status: 'Active'},
  {name: 'Mateo Silva', role: 'Analyst', status: 'Invited'},
];

const demoColumns: ColumnDef<DemoUser>[] = [
  {accessorKey: 'name', header: 'Name'},
  {accessorKey: 'role', header: 'Role'},
  {accessorKey: 'status', header: 'Status'},
];

const navItems = [
  ['overview', 'Overview'],
  ['catalog', 'Component catalog'],
  ['live-examples', 'Live examples'],
  ['composition', 'Composition rules'],
  ['agent-contract', 'Agent contract'],
] as const;

function CatalogCard({entry}: {entry: CatalogEntry}) {
  return (
    <article className="catalog-card">
      <div className="catalog-card__topline">
        <span className="catalog-card__package">{entry.package}</span>
        <span className="docs-pill">{entry.kind}</span>
        <span className="docs-pill" data-status={entry.status}>
          {entry.status}
        </span>
      </div>
      <h3>{entry.name}</h3>
      <p>{entry.description}</p>
      <dl>
        <div>
          <dt>Use when</dt>
          <dd>{entry.useWhen}</dd>
        </div>
        {entry.avoidWhen && (
          <div>
            <dt>Avoid when</dt>
            <dd>{entry.avoidWhen}</dd>
          </div>
        )}
      </dl>
      <code>{`import {${entry.name}} from '${entry.importPath}'`}</code>
      <div className="catalog-card__tags">
        {entry.tags.map(tag => (
          <span key={tag}>#{tag}</span>
        ))}
      </div>
    </article>
  );
}

function DocsApp() {
  const [catalogQuery, setCatalogQuery] = useState('');
  const [demoQuery, setDemoQuery] = useState('');
  const [inputValue, setInputValue] = useState('EForge');

  const catalog = useMemo(() => findCatalogEntries(catalogQuery), [catalogQuery]);
  const demoData = useMemo(() => {
    const query = demoQuery.trim().toLowerCase();
    if (!query) return demoUsers;
    return demoUsers.filter(user =>
      [user.name, user.role, user.status].join(' ').toLowerCase().includes(query),
    );
  }, [demoQuery]);

  const groupedCatalog = useMemo(
    () =>
      catalogCategories.map(category => ({
        ...category,
        entries: catalog.filter(entry => entry.category === category.id),
      })),
    [catalog],
  );

  return (
    <AppShell
      brand={
        <div className="docs-brand">
          <strong>EForge</strong>
          <span>v0.2</span>
        </div>
      }
      navigation={
        <>
          {navItems.map(([id, label]) => (
            <a className="docs-nav-link" href={`#${id}`} key={id}>
              {label}
            </a>
          ))}
        </>
      }
      header={<span className="docs-header-note">Code-first · Agent-readable · Astryx-adapted</span>}>
      <div className="docs-root">
        <DashboardPage
          eyebrow="EForge v0.2"
          title="EForge Component Catalog"
          description="Human-readable documentation and machine-readable component guidance share one foundation contract.">
          <section className="docs-hero-card" id="overview">
            <div>
              <span className="docs-kicker">Foundation status</span>
              <h2>{foundationCatalog.length} documented public building blocks</h2>
              <p>
                EForge standardizes the primitives and enterprise composition patterns that product
                teams repeatedly rebuild, while keeping product code React-first and domain
                components local.
              </p>
            </div>
            <div className="docs-stats">
              <div>
                <strong>{catalogCategories.length}</strong>
                <span>catalog categories</span>
              </div>
              <div>
                <strong>1</strong>
                <span>Astryx boundary</span>
              </div>
              <div>
                <strong>0</strong>
                <span>schema runtimes</span>
              </div>
            </div>
          </section>

          <section className="docs-section" id="catalog">
            <div className="docs-section__header">
              <div>
                <span className="docs-kicker">Discover</span>
                <h2>Component catalog</h2>
                <p>
                  Search by component, package, pattern, capability, or usage intent. This catalog is
                  exported from <code>@eforge/agent</code> so coding agents consume the same contract.
                </p>
              </div>
              <SearchBar
                label="Search component catalog"
                placeholder="Search DataTable, workbench, validation…"
                value={catalogQuery}
                onChange={setCatalogQuery}
                width="min(100%, 420px)"
              />
            </div>

            {catalog.length === 0 ? (
              <div className="docs-empty">No catalog entries match “{catalogQuery}”.</div>
            ) : (
              groupedCatalog.map(group =>
                group.entries.length ? (
                  <section className="catalog-group" key={group.id}>
                    <div className="catalog-group__heading">
                      <h2>{group.label}</h2>
                      <p>{group.description}</p>
                    </div>
                    <div className="catalog-grid">
                      {group.entries.map(entry => (
                        <CatalogCard entry={entry} key={`${entry.package}:${entry.name}`} />
                      ))}
                    </div>
                  </section>
                ) : null,
              )
            )}
          </section>

          <section className="docs-section" id="live-examples">
            <div className="docs-section__header">
              <div>
                <span className="docs-kicker">Dogfood</span>
                <h2>Live examples</h2>
                <p>
                  The documentation surface uses EForge itself. These examples are also exercised by
                  Playwright so the docs remain executable, not decorative.
                </p>
              </div>
            </div>

            <div className="docs-demo-grid">
              <article className="docs-demo-card">
                <h3>UI adapter</h3>
                <p>Business applications import primitives from EForge, never Astryx directly.</p>
                <div className="docs-demo-stack">
                  <Input
                    label="Framework name"
                    value={inputValue}
                    onChange={setInputValue}
                    width="100%"
                  />
                  <div className="docs-demo-actions">
                    <Button label="Primary action" variant="primary" />
                    <Button label="Secondary action" variant="secondary" />
                  </div>
                </div>
              </article>

              <article className="docs-demo-card docs-demo-card--wide">
                <h3>List composition</h3>
                <p>
                  <code>SearchBar</code> and <code>DataTable</code> form the default list-page
                  interaction before a product invents custom table behavior.
                </p>
                <div className="docs-demo-stack">
                  <SearchBar
                    label="Search demo users"
                    placeholder="Search users"
                    value={demoQuery}
                    onChange={setDemoQuery}
                    width="min(100%, 360px)"
                  />
                  <DataTable
                    data={demoData}
                    columns={demoColumns}
                    pagination={false}
                    emptyText="No demo users match this search"
                  />
                </div>
              </article>
            </div>
          </section>

          <section className="docs-section" id="composition">
            <div className="docs-section__header">
              <div>
                <span className="docs-kicker">Defaults</span>
                <h2>Composition rules</h2>
                <p>Start from a proven pattern, then keep domain meaning in product code.</p>
              </div>
            </div>
            <div className="rule-grid">
              <article>
                <strong>List</strong>
                <code>ListPage + SearchBar + DataTable</code>
                <p>Use for searchable enterprise collections and administrative tables.</p>
              </article>
              <article>
                <strong>Form</strong>
                <code>FormPage + useZodForm + FormTextField</code>
                <p>Keep validation in one typed Zod schema and form state in React Hook Form.</p>
              </article>
              <article>
                <strong>Workbench</strong>
                <code>WorkbenchPage + product domain components</code>
                <p>Use for dense report, review, evidence, and AI-assisted authoring surfaces.</p>
              </article>
              <article>
                <strong>Permissions</strong>
                <code>PermissionProvider + PermissionGate</code>
                <p>Control UI capability rendering without pretending UI hiding is API authorization.</p>
              </article>
            </div>
          </section>

          <section className="docs-section" id="agent-contract">
            <div className="docs-section__header">
              <div>
                <span className="docs-kicker">Codex / Claude Code</span>
                <h2>Agent contract</h2>
                <p>
                  Agents should query the EForge catalog first, inspect Astryx only through the
                  pinned CLI when adapter behavior is unclear, and update docs whenever a public API
                  changes.
                </p>
              </div>
            </div>
            <pre className="docs-code">{`1. Search @eforge/agent catalog
2. Prefer an existing EForge component or pattern
3. Keep Astryx imports inside packages/ui
4. Keep domain components inside the product
5. Add tests + catalog metadata for new public APIs
6. Run pnpm verify before completion`}</pre>
          </section>
        </DashboardPage>
      </div>
    </AppShell>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EForgeProvider>
      <DocsApp />
    </EForgeProvider>
  </StrictMode>,
);
