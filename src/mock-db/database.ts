import databaseJson from "./data/database.json";

export type Memorial = {
  id: string;
  name: string;
  years: string;
  epitaph: string;
  imageUrl: string;
  visits: number;
  tributes: number;
  candles: number;
  status: "ativo" | "rascunho";
  createdAt: string;
};

export type Tribute = {
  id: string;
  memorialId: string;
  author: string;
  message: string;
  createdAt: string;
  status: "aprovada" | "pendente";
  tag?: string;
};

export type Candle = {
  id: string;
  memorialId: string;
  name: string;
  isEternal: boolean;
  createdAt: string;
};

export type QrCodeItem = {
  id: string;
  memorialId: string;
  label: string;
  scans: number;
  lastScanAt: string;
  status: "ativo" | "pausado";
};

export type FamilyMember = {
  id: string;
  name: string;
  role: "Administrador" | "Editor" | "Leitor";
  email: string;
  status: "ativo" | "convite-pendente";
};

export type GalleryItem = {
  id: string;
  memorialId: string;
  title: string;
  type: "foto" | "video";
  url: string;
  createdAt: string;
};

export type TimelineEvent = {
  id: string;
  memorialId: string;
  year: string;
  title: string;
  description: string;
  longStory: string;
  imageUrl: string;
};

export type BillingItem = {
  id: string;
  description: string;
  amount: string;
  date: string;
  status: "pago" | "aberto";
};

export type Activity = {
  id: string;
  when: string;
  text: string;
  icon: "dot" | "qr_code_scanner" | "local_fire_department";
};

type User = {
  id: string;
  name: string;
  email: string;
};

type Stats = {
  totalMemorials: number;
  totalTributes: number;
  totalVisits: number;
  activeQRCodes: number;
};

type SubscriptionPlan = {
  name: string;
  price: string;
  renewDate: string;
  features: string[];
};

type Subscriptions = {
  currentPlan: SubscriptionPlan;
  billingHistory: BillingItem[];
};

type Settings = {
  profile: {
    fullName: string;
    email: string;
    phone: string;
    locale: string;
  };
  notifications: {
    emailTributes: boolean;
    emailVisitsReport: boolean;
    smsCriticalAlerts: boolean;
  };
  privacy: {
    publicProfile: boolean;
    allowTributeWithoutLogin: boolean;
  };
};

export type Database = {
  user: User;
  stats: Stats;
  memorials: Memorial[];
  tributes: Tribute[];
  qrCodes: QrCodeItem[];
  familyMembers: FamilyMember[];
  gallery: GalleryItem[];
  subscriptions: Subscriptions;
  settings: Settings;
  activities: Activity[];
  candles: Candle[];
  timelineEvents: TimelineEvent[];
};

export const database: Database = databaseJson as Database;
