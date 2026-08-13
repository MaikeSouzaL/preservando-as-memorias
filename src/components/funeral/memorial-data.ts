import { randomUUID } from "crypto";
import { createAdminClient } from "@/src/lib/supabase";
import { getOrCreateFuneralHomeOwnerId } from "@/src/components/funeral/funeral-home-data";
import type { FuneralHomeAccount } from "@/src/components/funeral/guard";
import type { DeliveryAddressData } from "@/src/components/memorial-form";

export type MemorialStatus = "ativo" | "rascunho" | "pending_payment";

export type GalleryItem = { title: string; url: string };
export type TimelineEventItem = { year: string; title: string; description: string; imageUrl: string };

export type FuneralMemorial = {
  id: string;
  name: string;
  nickname: string;
  birthDate: string;
  deathDate: string;
  city: string;
  epitaph: string;
  biography: string;
  imageUrl: string;
  audioUrl: string;
  videoUrl: string;
  gallery: GalleryItem[];
  timelineEvents: TimelineEventItem[];
  deliveryAddress?: DeliveryAddressData;
  status: MemorialStatus;
  qrUnlocked: boolean;
  createdAt: string;
  updatedAt: string;
};

function s(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function mapRow(r: Record<string, unknown>): FuneralMemorial {
  const gallery = Array.isArray(r.gallery) ? (r.gallery as { title?: string; url?: string }[]) : [];
  const timeline = Array.isArray(r.timeline)
    ? (r.timeline as { year?: string; title?: string; description?: string; imageUrl?: string }[])
    : [];

  return {
    id: r.id as string,
    name: s(r.name),
    nickname: s(r.nickname),
    birthDate: s(r.birth_date),
    deathDate: s(r.death_date),
    city: s(r.city),
    epitaph: s(r.epitaph),
    biography: s(r.biography),
    imageUrl: s(r.image_url),
    audioUrl: s(r.audio_url),
    videoUrl: s(r.video_url),
    gallery: gallery.map((g) => ({ title: s(g.title), url: s(g.url) })),
    timelineEvents: timeline.map((t) => ({
      year: s(t.year),
      title: s(t.title),
      description: s(t.description),
      imageUrl: s(t.imageUrl),
    })),
    deliveryAddress: (r.delivery_address as DeliveryAddressData) ?? undefined,
    status: (r.status as MemorialStatus) ?? "rascunho",
    qrUnlocked: (r.qr_unlocked as boolean) ?? false,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

function limit(value: string, max: number): string {
  const trimmed = value.trim();
  return trimmed.length > max ? trimmed.slice(0, max).trim() : trimmed;
}

export async function listFuneralHomeMemorials(funeralHomeId: string): Promise<FuneralMemorial[]> {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("memorials")
    .select("*")
    .eq("funeral_home_id", funeralHomeId)
    .order("created_at", { ascending: false });
  return (data ?? []).map(mapRow);
}

export async function getFuneralHomeMemorial(funeralHomeId: string, memorialId: string): Promise<FuneralMemorial | null> {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("memorials")
    .select("*")
    .eq("id", memorialId)
    .eq("funeral_home_id", funeralHomeId)
    .maybeSingle();
  return data ? mapRow(data) : null;
}

export type QuickCreateInput = {
  name: string;
  nickname?: string;
  birthDate?: string;
  deathDate?: string;
  city?: string;
};

/** Cria o rascunho com o mínimo possível — só o nome é obrigatório. */
export async function createDraftMemorial(
  funeralHome: Pick<FuneralHomeAccount, "id" | "name" | "slug">,
  input: QuickCreateInput
): Promise<FuneralMemorial> {
  const name = limit(input.name, 120);
  if (!name) throw new Error("Informe o nome do falecido.");

  const ownerId = await getOrCreateFuneralHomeOwnerId(funeralHome);
  const now = new Date().toISOString();
  const id = randomUUID();

  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("memorials")
    .insert({
      id,
      owner_id: ownerId,
      name,
      nickname: input.nickname ? limit(input.nickname, 80) : null,
      birth_date: input.birthDate || null,
      death_date: input.deathDate || null,
      city: input.city ? limit(input.city, 100) : null,
      epitaph: null,
      biography: null,
      image_url: "/images/hero-bg.png",
      gallery: [],
      timeline: [],
      status: "rascunho",
      payment_status: "pending",
      qr_unlocked: false,
      source: "funeral_home",
      funeral_home_id: funeralHome.id,
      visits: 0,
      created_at: now,
      updated_at: now,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Não foi possível criar o rascunho do memorial.");
  }
  return mapRow(data);
}

export type MemorialPatch = {
  name?: string;
  nickname?: string;
  birthDate?: string;
  deathDate?: string;
  city?: string;
  epitaph?: string;
  biography?: string;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  gallery?: GalleryItem[];
  timelineEvents?: TimelineEventItem[];
  deliveryAddress?: DeliveryAddressData;
};

function buildUpdateRow(patch: MemorialPatch): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (patch.name !== undefined) row.name = limit(patch.name, 120);
  if (patch.nickname !== undefined) row.nickname = patch.nickname ? limit(patch.nickname, 80) : null;
  if (patch.birthDate !== undefined) row.birth_date = patch.birthDate || null;
  if (patch.deathDate !== undefined) row.death_date = patch.deathDate || null;
  if (patch.city !== undefined) row.city = patch.city ? limit(patch.city, 100) : null;
  if (patch.epitaph !== undefined) row.epitaph = patch.epitaph ? limit(patch.epitaph, 500) : null;
  if (patch.biography !== undefined) row.biography = patch.biography ? limit(patch.biography, 3000) : null;
  if (patch.imageUrl !== undefined) row.image_url = patch.imageUrl || "/images/hero-bg.png";
  if (patch.audioUrl !== undefined) row.audio_url = patch.audioUrl || null;
  if (patch.videoUrl !== undefined) row.video_url = patch.videoUrl || null;
  if (patch.gallery !== undefined) {
    row.gallery = patch.gallery.slice(0, 12).map((g, i) => ({
      id: `gal_${i}_${Date.now().toString(36)}`,
      title: limit(g.title || `Foto ${i + 1}`, 80),
      url: g.url,
    }));
  }
  if (patch.timelineEvents !== undefined) {
    row.timeline = patch.timelineEvents
      .filter((t) => t.year || t.title || t.description)
      .map((t, i) => ({
        id: `tle_${i}_${Date.now().toString(36)}`,
        year: limit(t.year || "Memória", 20),
        title: limit(t.title || "Momento marcante", 120),
        description: limit(t.description, 1500),
        longStory: limit(t.description, 1500),
        imageUrl: t.imageUrl || "/images/hero-bg.png",
      }));
  }
  if (patch.deliveryAddress !== undefined) {
    row.delivery_address = patch.deliveryAddress?.recipientName ? patch.deliveryAddress : null;
  }
  return row;
}

/** Salva alterações sem mudar o status (usado enquanto ainda é rascunho, ou para corrigir um memorial já publicado). */
export async function updateMemorial(funeralHomeId: string, memorialId: string, patch: MemorialPatch): Promise<FuneralMemorial> {
  const supabase = await createAdminClient();
  const row = buildUpdateRow(patch);
  row.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("memorials")
    .update(row)
    .eq("id", memorialId)
    .eq("funeral_home_id", funeralHomeId)
    .select("*")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Memorial não encontrado.");
  return mapRow(data);
}

/**
 * Publica: exige nome, epitáfio e biografia (mesma regra do MemorialForm),
 * libera o QR e marca como pago — a família já pagou a funerária por fora;
 * o que a plataforma cobra da funerária é o ciclo de assinatura/uso, não
 * esta venda específica (ver funeral_billing_plans / funeral_invoices).
 */
export async function publishMemorial(funeralHomeId: string, memorialId: string, patch: MemorialPatch): Promise<FuneralMemorial> {
  const supabase = await createAdminClient();
  const row = buildUpdateRow(patch);

  const nextName = (row.name as string | undefined) ?? undefined;
  const nextEpitaph = (row.epitaph as string | null | undefined) ?? undefined;
  const nextBiography = (row.biography as string | null | undefined) ?? undefined;

  // Precisa checar contra o estado final (patch por cima do que já existe),
  // não só o que veio nesta chamada — senão dá pra "publicar" um rascunho
  // que só tinha o nome preenchido.
  const { data: existing } = await supabase
    .from("memorials")
    .select("name,epitaph,biography")
    .eq("id", memorialId)
    .eq("funeral_home_id", funeralHomeId)
    .maybeSingle();

  if (!existing) throw new Error("Memorial não encontrado.");

  const finalName = nextName ?? existing.name ?? "";
  const finalEpitaph = nextEpitaph ?? existing.epitaph ?? "";
  const finalBiography = nextBiography ?? existing.biography ?? "";

  if (!finalName || !finalEpitaph || !finalBiography) {
    throw new Error("Preencha nome, epitáfio e biografia antes de publicar.");
  }

  row.status = "ativo";
  row.payment_status = "paid";
  row.qr_unlocked = true;
  row.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("memorials")
    .update(row)
    .eq("id", memorialId)
    .eq("funeral_home_id", funeralHomeId)
    .select("*")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Não foi possível publicar o memorial.");

  // Registro de QR Code para métricas/scans — idempotente (não duplica se já existir).
  const { data: existingQr } = await supabase.from("qr_codes").select("id").eq("memorial_id", memorialId).maybeSingle();
  if (!existingQr) {
    await supabase.from("qr_codes").insert({
      id: `qr_${randomUUID()}`,
      memorial_id: memorialId,
      public_path: `/memorial-publico?memorial=${memorialId}`,
      scans: 0,
      status: "ativo",
      kind: "memorial",
    });
  }

  return mapRow(data);
}
