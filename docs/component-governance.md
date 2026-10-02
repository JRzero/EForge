# Component Governance

## Promotion ladder

1. **Local component** — first implementation inside a product.
2. **Shared candidate** — second similar use; compare requirements and identify variance.
3. **Foundation candidate** — repeated use has demonstrated a stable, domain-neutral contract.
4. **Foundation component/pattern** — documented public API with tests and reference usage.

A component is not promoted because it is large, visually attractive, or convenient. Promotion is based on repeatability and a stable semantic contract.

## What belongs in EForge

Good candidates:

- page shells and headers
- data/loading/empty/error states
- search/filter/table composition
- forms and validation integration
- permission rendering
- HTTP/auth/storage primitives

Stay in product code until proven otherwise:

- CustomerCard
- ESGMetric
- OpportunityPipeline
- AuditQuestionnaire
- ReportEvidencePanel

## API design

Prefer semantic props over styling escape hatches. Keep escape hatches available at lower layers, but the default application path should encode the enterprise pattern.


## Documentation contract

A foundation abstraction is not complete when only its TypeScript export exists. Public APIs must remain discoverable by both humans and coding agents.

For every new public API:

1. Add or update its `@eforge/agent` catalog entry.
2. Describe the semantic use case, not only the visual appearance.
3. Document common misuse when the boundary is easy to cross.
4. Add a live docs example when interaction or composition is material.
5. Add verification appropriate to the risk; critical interactive docs examples should be browser-tested.

The live docs site should consume catalog metadata rather than maintaining a second manual component inventory.
