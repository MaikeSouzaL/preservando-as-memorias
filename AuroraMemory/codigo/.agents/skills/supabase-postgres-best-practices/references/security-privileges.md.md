---
origem: .agents/skills/supabase-postgres-best-practices/references/security-privileges.md
origem_hash: 704aec911d656588231818b77c4de636a4d23c0d
gerado_em: 2026-06-25T23:37:30
---

# `.agents/skills/supabase-postgres-best-practices/references/security-privileges.md`

# Security Privileges Reference

## Purpose
Documents the **Principle of Least Privilege** for PostgreSQL/Supabase — granting minimal permissions to reduce attack surface.

## Key Content
- **Problem**: Overly broad grants (e.g., `ALL` on all tables) make SQL injection catastrophic
- **Solution**: Create granular roles (`app_readonly`, `app_writer`) with specific table/sequence permissions
- **Best Practice**: Never use superuser for app queries; use role inheritance (`app_writer → app_user`)
- **Security**: Revoke default public schema access

## Connections
- **Used by**: `.agents/skills/supabase-postgres-best-practices/` skill files
- **References**: Supabase blog on roles and privileges
