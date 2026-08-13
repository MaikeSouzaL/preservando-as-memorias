export { centsToBRL } from "@/src/lib/platform-types";

/**
 * Formatação de data sem depender do fuso horário do processo Node.
 *
 * Dois tipos de entrada convivem aqui: datas puras ("YYYY-MM-DD", ex.
 * `birth_date`, os limites do ciclo de cobrança) e timestamps completos
 * ("...T...Z", ex. `created_at`). Se cada um usar um fuso diferente na hora
 * de formatar, uma data UTC-meia-noite pode "voltar" um dia quando o
 * servidor roda num fuso negativo (ex.: 01/08 vira 31/07 em UTC-3) — foi
 * exatamente esse bug que apareceu no ciclo de cobrança. A regra fixa:
 * datas puras são ancoradas em UTC; timestamps são exibidos no fuso de
 * Brasília, sempre — nunca no fuso "ambiente" de onde o processo roda.
 */
const BR_TZ = "America/Sao_Paulo";

function isDateOnly(iso: string): boolean {
  return iso.length <= 10;
}

function parseDate(iso: string): Date {
  return isDateOnly(iso) ? new Date(`${iso}T00:00:00Z`) : new Date(iso);
}

function formatOpts(iso: string) {
  return isDateOnly(iso) ? "UTC" : BR_TZ;
}

export function fmtDateBR(iso?: string | null): string {
  if (!iso) return "—";
  const d = parseDate(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: formatOpts(iso) });
}

export function fmtDateLongBR(iso?: string | null): string {
  if (!iso) return "—";
  const d = parseDate(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: formatOpts(iso) });
}

/** Início (inclusive) e fim (exclusivo) do mês corrente, em ISO date (YYYY-MM-DD) — sempre em UTC. */
export function currentBillingPeriod(reference = new Date()): { start: string; end: string; label: string } {
  const start = new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth(), 1));
  const end = new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth() + 1, 1));
  const label = start.toLocaleDateString("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" });
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
    label: label.charAt(0).toUpperCase() + label.slice(1),
  };
}
