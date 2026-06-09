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
  status: "ativo" | "rascunho" | "pending_payment";
  paymentStatus?: "paid" | "pending";
  qrUnlocked?: boolean;
  source?: "customer" | "funeral_home_offer" | "funeral_home";
  funeralHomeId?: string;
  offerLinkId?: string;
  visits: number;
  createdAt: string;
  updatedAt: string;
};

export type ManagedQrCode = {
  id: string;
  memorialId?: string;
  offerLinkId?: string;
  publicPath: string;
  scans: number;
  status: "ativo" | "pausado" | "bloqueado";
  kind?: "memorial" | "offer";
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
  source?: "plan" | "funeral_home_offer" | "funeral_home" | "family";
  offerLinkId?: string;
  funeralHomeId?: string;
  draftMemorialId?: string;
  payerType?: "funeral_home" | "family";
  createdAt: string;
};

export type FuneralHome = {
  id: string;
  name: string;
  slug: string;
  contactName: string;
  email: string;
  phone: string;
  cnpj?: string;
  city?: string;
  state?: string;
  address?: string;
  passwordHash: string;
  isActive: boolean;
  approvalStatus: "pending" | "approved" | "rejected";
  stripeAccountId?: string;
  createdAt: string;
  updatedAt: string;
};

export type FuneralHomeOfferLink = {
  id: string;
  funeralHomeId?: string;
  title: string;
  slug: string;
  description: string;
  cycle: "monthly" | "annual" | "one_time";
  priceCents: number;
  status: "active" | "paused";
  accessCount: number;
  conversionCount: number;
  createdAt: string;
  updatedAt: string;
};

export type FuneralService = {
  id: string;
  funeralHomeId: string;
  deceasedName: string;
  deceasedBirthDate?: string;
  deceasedDeathDate: string;
  deceasedCauseOfDeath?: string;
  deceasedDocumentNumber?: string;
  familyContactName: string;
  familyContactPhone: string;
  familyContactEmail?: string;
  familyContactRelation: string;
  serviceType: 'sepultamento' | 'cremacao' | 'translado' | 'preparacao';
  casketType?: string;
  additionalServices: string[];
  totalAmountCents: number;
  paidAmountCents: number;
  paymentMethod?: 'pix' | 'card' | 'boleto' | 'cash' | 'installment';
  status: 'em_andamento' | 'concluido' | 'cancelado';
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type FuneralSchedule = {
  id: string;
  funeralHomeId: string;
  serviceId?: string;
  deceasedName: string;
  type: 'velorio' | 'cerimonia' | 'sepultamento' | 'cremacao' | 'translado';
  dateTime: string;
  location: string;
  address?: string;
  status: 'agendado' | 'em_andamento' | 'concluido' | 'cancelado';
  assignedStaff?: string[];
  notes?: string;
  createdAt: string;
};

export type InventoryItem = {
  id: string;
  funeralHomeId: string;
  name: string;
  category: 'urna' | 'flores' | 'veu' | 'ornamento' | 'livro' | 'outros';
  description?: string;
  quantity: number;
  minQuantity: number;
  unitPriceCents: number;
  costPriceCents?: number;
  imageUrl?: string;
  status: 'disponivel' | 'esgotado' | 'reservado';
  createdAt: string;
  updatedAt: string;
};

export type StaffMember = {
  id: string;
  funeralHomeId: string;
  name: string;
  role: 'tanatopraxista' | 'cerimonialista' | 'motorista' | 'atendente' | 'gerente' | 'outros';
  phone: string;
  email?: string;
  commissionPercent?: number;
  schedule: 'manha' | 'tarde' | 'noite' | 'integral' | 'folga';
  isActive: boolean;
  createdAt: string;
};

export type FuneralDocument = {
  id: string;
  funeralHomeId: string;
  serviceId?: string;
  type: 'certidao_obito' | 'autorizacao_sepultamento' | 'autorizacao_cremacao' | 'alvara' | 'guia_translado' | 'outros';
  documentNumber?: string;
  issuer?: string;
  issueDate: string;
  expiryDate?: string;
  status: 'pendente' | 'emitido' | 'valido' | 'expirado';
  fileUrl?: string;
  notes?: string;
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

export type AdminBankData = {
  holderName: string;
  bankName: string;
  agency: string;
  account: string;
  accountType: "corrente" | "poupança";
  cpfCnpj: string;
  pixKey?: string;
};

export type PlatformData = {
  config: PlatformConfig;
  adminBankDataEncrypted?: string;
  platformAdminEmail?: string;
  memorials: ManagedMemorial[];
  qrCodes: ManagedQrCode[];
  tributes: ManagedTribute[];
  candles: ManagedCandle[];
  orders: PlatformOrder[];
  funeralHomes: FuneralHome[];
  offerLinks: FuneralHomeOfferLink[];
  funeralServices: FuneralService[];
  funeralSchedules: FuneralSchedule[];
  inventoryItems: InventoryItem[];
  staffMembers: StaffMember[];
  funeralDocuments: FuneralDocument[];
  profile: CuratorProfile;
  profiles: CuratorProfile[];
  complaints: ManagedComplaint[];
};

let writeQueue: Promise<unknown> = Promise.resolve();

const defaultConfig: PlatformConfig = {
  ownerCommissionPercent: 15,
  familyMemorialPriceCents: 9900,
  funeralHomeMemorialPriceCents: 4900,
  candlePriceCents: 100,
};

const defaultData: PlatformData = {
  config: defaultConfig,
  memorials: [],
  qrCodes: [],
  tributes: [],
  candles: [],
  orders: [],
  funeralHomes: [],
  offerLinks: [],
  funeralServices: [],
  funeralSchedules: [],
  inventoryItems: [],
  staffMembers: [],
  funeralDocuments: [],
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
      ownerCommissionPercent: data.config?.ownerCommissionPercent ?? defaultConfig.ownerCommissionPercent,
      familyMemorialPriceCents: data.config?.familyMemorialPriceCents ?? defaultConfig.familyMemorialPriceCents,
      funeralHomeMemorialPriceCents: data.config?.funeralHomeMemorialPriceCents ?? defaultConfig.funeralHomeMemorialPriceCents,
      candlePriceCents: data.config?.candlePriceCents ?? defaultConfig.candlePriceCents,
      // Preserve legacy plan fields if present in DB
      defaultPlanId: data.config?.defaultPlanId,
      plans: data.config?.plans,
      defaultFuneralPlanId: data.config?.defaultFuneralPlanId,
      funeralPlans: data.config?.funeralPlans,
    },
    adminBankDataEncrypted: data.adminBankDataEncrypted,
    platformAdminEmail: data.platformAdminEmail,
    memorials: Array.isArray(data.memorials) ? data.memorials : [],
    qrCodes: Array.isArray(data.qrCodes) ? data.qrCodes : [],
    tributes: Array.isArray(data.tributes) ? data.tributes : [],
    candles: Array.isArray(data.candles) ? data.candles : [],
    orders: data.orders ?? [],
    funeralHomes: Array.isArray(data.funeralHomes) ? data.funeralHomes : [],
    offerLinks: Array.isArray(data.offerLinks) ? data.offerLinks : [],
    funeralServices: Array.isArray(data.funeralServices) ? data.funeralServices : [],
    funeralSchedules: Array.isArray(data.funeralSchedules) ? data.funeralSchedules : [],
    inventoryItems: Array.isArray(data.inventoryItems) ? data.inventoryItems : [],
    staffMembers: Array.isArray(data.staffMembers) ? data.staffMembers : [],
    funeralDocuments: Array.isArray(data.funeralDocuments) ? data.funeralDocuments : [],
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
  try {
    await connectToDatabase();
    const doc = await PlatformStore.findOne({ key: "global_store" });
    if (!doc) {
      const newDoc = await PlatformStore.create({ key: "global_store", data: defaultData });
      return normalizePlatformData(newDoc.data as Partial<PlatformData>);
    }
    return normalizePlatformData(doc.data as Partial<PlatformData>);
  } catch (err) {
    console.warn("MongoDB indisponível ou em fase de build, usando dados locais temporários:", err);
    return normalizePlatformData(defaultData as Partial<PlatformData>);
  }
}

export async function writePlatformData(data: PlatformData) {
  try {
    await connectToDatabase();
    await PlatformStore.findOneAndUpdate(
      { key: "global_store" },
      { data },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error("Erro ao salvar dados no MongoDB, dados não foram gravados:", err);
  }
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
