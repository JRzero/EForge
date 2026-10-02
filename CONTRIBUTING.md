# Contributing to EForge

1. Read `AGENTS.md` and `ARCHITECTURE.md`.
2. Keep changes inside the correct layer.
3. Add or update tests for behavior changes.
4. Run `pnpm verify` before opening a pull request.
5. Avoid promoting business-specific abstractions into foundation packages until reuse is demonstrated.

Public API changes should be backwards-compatible within a minor line whenever practical. Astryx upgrades must be isolated behind `@eforge/ui` and validated through the example applications.
