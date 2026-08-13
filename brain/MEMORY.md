# Memory Index — preservando-as-memorias

Pointer-only index. Each line links to the file holding the actual content — do not
put memory content here. See `brain/architecture/README.md` for the architecture
overview and `brain/decisions/_TEMPLATE.md` for the ADR template.

## Architecture / ADRs

- [Three-actor schema redesign](architecture/adr-2026-08-11-three-actor-schema-redesign.md) — Schema redesign for the FAMILIAR/FUNERÁRIA/DONO business model (operador/representante role eliminated): billing plans + invoice ledger, `qr_deliveries` state machine, `orders` commission-column cleanup, `orders` PK switch to uuid, RLS rewrite. 4 migrations proposed, **not yet applied**. (2026-08-11)

## Facts

_(none recorded yet)_

## Conventions

_(none recorded yet — see `brain/conventions/README.md` when established)_
