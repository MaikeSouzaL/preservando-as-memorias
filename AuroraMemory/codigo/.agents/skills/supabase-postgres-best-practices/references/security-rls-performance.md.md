---
origem: .agents/skills/supabase-postgres-best-practices/references/security-rls-performance.md
origem_hash: e1b9226b1bad4fee5bb72e6b0e9a473ff4164050
gerado_em: 2026-06-26T00:33:20
---

# `.agents/skills/supabase-postgres-best-practices/references/security-rls-performance.md`

# Security RLS Performance Optimization Guide

## Purpose
Documents best practices for optimizing Supabase Row-Level Security (RLS) policies to avoid severe performance degradation.

## Key Patterns

### 1. **Wrap auth functions in SELECT**
- ❌ Bad: `auth.uid() = user_id` (called per row)
- ✅ Good: `(select auth.uid()) = user_id` (called once, cached)

### 2. **Security Definer Functions**
- Run with creator's privileges, bypass RLS on internal tables
- Always include explicit `auth.uid()` check inside function body
- Store in private schema, revoke EXECUTE from public roles

### 3. **Indexing**
- Add indexes on columns used in RLS policies (e.g., `orders.user_id`)

## Impact
- 5-10x faster RLS queries with proper patterns
- 100x+ improvement on large tables (1M+ rows)
