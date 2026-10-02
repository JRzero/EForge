# UI rule

Application code imports UI primitives from `@eforge/ui`. Direct `@astryxdesign/*` imports are reserved for `packages/ui` so Astryx upgrades remain isolated.

## Agent selection order

1. Search the `@eforge/agent` catalog for an existing EForge primitive or pattern.
2. Prefer semantic EForge props and documented page composition.
3. Inspect the pinned Astryx CLI only when the adapter contract is unclear.
4. Add an adapter export in `@eforge/ui` only when the primitive is reusable and application-facing.
5. Keep product-domain UI in product code until repeated usage proves a domain-neutral abstraction.

## Public UI API checklist

A new public UI export must include:
- a stable EForge-facing import path
- accessible naming and keyboard behavior
- catalog metadata in `@eforge/agent`
- human documentation or a live docs example when useful
- verification coverage appropriate to the interaction risk

Do not use direct Astryx imports as a shortcut in apps, examples, docs, or product code.
