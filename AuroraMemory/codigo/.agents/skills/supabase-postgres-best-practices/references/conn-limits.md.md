---
origem: .agents/skills/supabase-postgres-best-practices/references/conn-limits.md
origem_hash: 05a7b667eebcd618241100af77d023332c2e776e
gerado_em: 2026-06-25T23:37:30
---

# `.agents/skills/supabase-postgres-best-practices/references/conn-limits.md`

## Connection Limits Guide

**Responsibility:** Provides best practices for configuring PostgreSQL connection limits to prevent memory exhaustion and crashes.

**Key Content:**
- **Connection calculation formula:** `max_connections = (RAM in MB / 5MB per connection) - reserved`
- **Example configs:** 100 connections for 4GB RAM with `work_mem = '8MB'`
- **Monitoring query:** `select count(*), state from pg_stat_activity group by state`

**Critical impact:** Prevents out-of-memory errors under load by limiting connections based on available RAM (each connection uses 1-3MB).

**Links to:** Supabase performance docs, references `work_mem` configuration, and relates to general database stability practices.
