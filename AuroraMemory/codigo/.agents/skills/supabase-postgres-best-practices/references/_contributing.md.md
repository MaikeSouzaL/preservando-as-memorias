---
origem: .agents/skills/supabase-postgres-best-practices/references/_contributing.md
origem_hash: 09affb014662393c9bdf423a8055e1bbe4766bc7
gerado_em: 2026-06-25T23:37:30
---

# `.agents/skills/supabase-postgres-best-practices/references/_contributing.md`

# Writing Guidelines for Postgres References

This document defines standards for creating Postgres best practice references optimized for AI agents and LLMs.

## Key Requirements

- **Concrete patterns**: Show exact SQL rewrites, not abstract advice
- **Error-first structure**: Always present incorrect pattern before correct solution
- **Quantified impact**: Include specific metrics (e.g., "10x faster", "50% smaller index")
- **Self-contained examples**: Include `CREATE TABLE` when needed for context
- **Semantic naming**: Use meaningful names like `users`, `email`, `created_at`

## Format Standards

- SQL uses lowercase keywords and clear formatting
- Comments explain *why*, not *what*
- Language tags: `sql`, `plpgsql`, `typescript`, `python`
- Application code only for connection pooling, transactions, ORM patterns

## Impact Levels

| Level | Improvement | Example Use |
|-------|-------------|-------------|
| CRITICAL | 10-100x | Missing indexes, connection exhaustion |
| HIGH | 5-20x | Wrong index types, poor partitioning |
| MEDIUM | 1.5-3x | Redundant indexes, query plan instability |

## Review Checklist

- Title is action-oriented
- Impact level matches performance gain
- Has both **Incorrect** and **Correct** SQL examples
- Trade-offs mentioned if applicable
- Reference links to official documentation included
