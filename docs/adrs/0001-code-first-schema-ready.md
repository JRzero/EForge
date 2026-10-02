# ADR 0001: Code-first, schema-ready

Status: Accepted

EForge remains a React/TypeScript code-first foundation. A future configuration-driven layer may consume stable contracts from `@eforge/schema-contract`, but v0.1 will not implement an amis-style renderer runtime.

This preserves direct React debugging and AI-coding compatibility while keeping a migration path for repetitive CRUD metadata if repeated product evidence later justifies it.
