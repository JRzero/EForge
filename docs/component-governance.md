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
