import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
export type { BillingCycle, PlatformConfig, PlatformPlan } from "@/src/lib/platform-types";
import type { PlatformConfig } from "@/src/lib/platform-types";

export type ManagedGalleryItem = {
  id: string;
  title: string;
  url: string;
};

export type ManagedTimelineEvent = {
  id: string;
  year: string;
  title: string;
  description: string;
  longStory: string;
  imageUrl: string;
};

export type ManagedMemorial = {
  id: string;
  ownerId: string;
  name: string;
  nickname?: string;
  birthDate?: string;
  deathDate?: string;
  city?: string;
  epitaph: string;
  biography: string;
  imageUrl: string;
  audioUrl?: string;
  gallery: ManagedGalleryItem[];
  timelineEvents: ManagedTimelineEvent[];
  status: "ativo" | "rascunho";
  visits: number;
  createdAt: string;
  updatedAt: string;
};

export type ManagedQrCode = {
  id: string;
  memorialId: string;
  publicPath: string;
  scans: number;
  status: "ativo" | "pausado";
  createdAt: string;
  lastScanAt?: string;
};

export type ManagedTribute = {
  id: string;
  memorialId: string;
  author: string;
  message: string;
  createdAt: string;
  status: "aprovada" | "pendente";
  tag?: string;
  isPinned?: boolean;
};

export type ManagedCandle = {
  id: string;
  memorialId: string;
  name: string;
  isEternal: boolean;
  createdAt: string;
};

export type ManagedComplaint = {
  id: string;
  target: string;
  reason: string;
  reporter: string;
  status: "Pendente" | "Resolvido";
  createdAt: string;
};

export type PlatformOrder = {
  id: string;
  userName: string;
  userEmail: string;
  customerDocument: string;
  customerPhone: string;
  planId: string;
  paymentMethod: "pix" | "card" | "boleto";
  discountCode?: string;
  discountCents: number;
  grossAmountCents: number;
  platformCommissionCents: number;
  operatorAmountCents: number;
  status: "paid" | "pending";
  createdAt: string;
};

export type CuratorProfile = {
  name: string;
  email: string;
  bio: string;
  theme: string;
  privacy: "public" | "protected" | "private";
  notifyVelas: boolean;
  notifyTributos: boolean;
  multiFactorEnabled: boolean;
  language: string;
  timezone: string;
  globalAudio: boolean;
  isAdmin?: boolean;
  avatarUrl?: string;
  password?: string;
  passwordHash?: string;
};

export type PlatformData = {
  config: PlatformConfig;
  memorials: ManagedMemorial[];
  qrCodes: ManagedQrCode[];
  tributes: ManagedTribute[];
  candles: ManagedCandle[];
  orders: PlatformOrder[];
  profile: CuratorProfile;
  profiles: CuratorProfile[];
  complaints: ManagedComplaint[];
};

const isServerless = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
const dataDir = isServerless 
  ? os.tmpdir() 
  : path.join(process.cwd(), "src", "data");
const dataFile = path.join(dataDir, "platform-store.json");
let writeQueue: Promise<unknown> = Promise.resolve();

const defaultConfig: PlatformConfig = {
  ownerCommissionPercent: 15,
  defaultPlanId: "essencial",
  candlePriceCents: 100,
  plans: [
    {
      id: "essencial",
      name: "Memória Essencial",
      description: "Um memorial público com QR Code para a lápide.",
      cycle: "monthly",
      priceCents: 2990,
      active: true,
      memorialLimit: 1,
      features: ["1 memorial", "QR Code público", "Galeria de fotos"],
    },
    {
      id: "familia",
      name: "Família Eterna",
      description: "Mais memoriais e recursos para preservar histórias familiares.",
      cycle: "annual",
      priceCents: 49900,
      active: true,
      memorialLimit: null,
      features: ["Memoriais ilimitados", "Áudios e histórias", "Homenagens públicas"],
    },
    {
      id: "unico",
      name: "Memorial Vitalício",
      description: "Pagamento único para manter um memorial ativo.",
      cycle: "one_time",
      priceCents: 99700,
      active: true,
      memorialLimit: 1,
      features: ["Pagamento único", "QR Code permanente", "Suporte de ativação"],
    },
  ],
};

const defaultData: PlatformData = {
  config: defaultConfig,
  memorials: [],
  qrCodes: [],
  tributes: [],
  candles: [],
  orders: [],
  profile: {
    name: "Novo Curador",
    email: "curador@plataforma.com",
    bio: "Guardião das memórias da família. Curadoria de lembranças.",
    theme: "noturno",
    privacy: "public",
    notifyVelas: true,
    notifyTributos: true,
    multiFactorEnabled: false,
    language: "pt-BR",
    timezone: "GMT-3",
    globalAudio: true,
  },
  profiles: [],
  complaints: [],
};

function normalizePlatformData(data: Partial<PlatformData>): PlatformData {
  const normalized: PlatformData = {
    config: {
      ...defaultConfig,
      ...(data.config ?? {}),
      plans: data.config?.plans?.length ? data.config.plans : defaultConfig.plans,
    },
    memorials: Array.isArray(data.memorials) ? data.memorials : [],
    qrCodes: Array.isArray(data.qrCodes) ? data.qrCodes : [],
    tributes: Array.isArray(data.tributes) ? data.tributes : [],
    candles: Array.isArray(data.candles) ? data.candles : [],
    orders: data.orders ?? [],
    profile: data.profile ?? {
      name: data.orders?.[0]?.userName || "Novo Curador",
      email: data.orders?.[0]?.userEmail || "curador@plataforma.com",
      bio: "Guardião das memórias da família. Curadoria de lembranças.",
      theme: "noturno",
      privacy: "public",
      notifyVelas: true,
      notifyTributos: true,
      multiFactorEnabled: false,
      language: "pt-BR",
      timezone: "GMT-3",
      globalAudio: true,
    },
    profiles: Array.isArray(data.profiles) ? data.profiles : [],
    complaints: Array.isArray(data.complaints) ? data.complaints : [],
  };

  // Se data.profile existir e data.profiles estiver vazio, inicializa com o profile global
  if (normalized.profile && normalized.profiles.length === 0) {
    normalized.profiles.push(normalized.profile);
  }

  normalized.memorials = normalized.memorials.map((memorial) => ({
    ...memorial,
    gallery: memorial.gallery ?? [],
    timelineEvents: memorial.timelineEvents ?? [],
  }));

  return normalized;
}

import { connectToDatabase } from "@/src/lib/mongodb";
import mongoose from "mongoose";

// Schema e Model Mongoose do PlatformStore
const PlatformStoreSchema = new mongoose.Schema({
  key: { type: String, default: "global_store", unique: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

const PlatformStore = mongoose.models.PlatformStore || mongoose.model("PlatformStore", PlatformStoreSchema);

export async function readPlatformData(): Promise<PlatformData> {
  await connectToDatabase();
  const doc = await PlatformStore.findOne({ key: "global_store" });
  if (!doc) {
    const newDoc = await PlatformStore.create({ key: "global_store", data: defaultData });
    return normalizePlatformData(newDoc.data as Partial<PlatformData>);
  }
  return normalizePlatformData(doc.data as Partial<PlatformData>);
}

export async function writePlatformData(data: PlatformData) {
  await connectToDatabase();
  await PlatformStore.findOneAndUpdate(
    { key: "global_store" },
    { data },
    { upsert: true, new: true }
  );
}

export async function updatePlatformData<T>(updater: (data: PlatformData) => T | Promise<T>) {
  const operation = writeQueue.then(async () => {
    const data = await readPlatformData();
    const result = await updater(data);
    await writePlatformData(data);
    return result;
  });

  writeQueue = operation.catch(() => undefined);
  return operation;
}
