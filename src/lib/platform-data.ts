export type { BillingCycle, PlatformConfig, PlatformPlan, QrDeliveryMode, QrDeliveryOverride } from "@/src/lib/platform-types";
import type { PlatformConfig, QrDeliveryOverride } from "@/src/lib/platform-types";

/** Endereço de entrega do QR Code físico — preenchido pela família quando o admin é responsável pelo envio */
export type DeliveryAddress = {
  recipientName: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
};
import { createAdminClient } from "@/src/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  ownerId: string; // Supabase user UUID
  name: string;
  nickname?: string;
  birthDate?: string;
  deathDate?: string;
  city?: string;
  epitaph: string;
  biography: string;
  imageUrl: string;
  audioUrl?: string;
  videoUrl?: string;
  gallery: ManagedGalleryItem[];
  timelineEvents: ManagedTimelineEvent[];
  status: "ativo" | "rascunho" | "pending_payment";
  paymentStatus?: "paid" | "pending";
  qrUnlocked?: boolean;
  source?: "customer" | "funeral_home_offer" | "funeral_home";
  funeralHomeId?: string;
  offerLinkId?: string;
  visits: number;
  flowers?: number;
  hearts?: number;
  /** Endereço para entrega do QR Code físico — preenchido quando qrDeliveryMode === "admin" */
  deliveryAddress?: DeliveryAddress;
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
  /** ID da sessão Stripe que confirmou o pagamento — previne replay */
  paymentSessionId?: string;
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
  /** Cascade: valor bruto retido pelo Admin Parceiro da funerária */
  funeralHomeCommissionCents?: number;
  /** Cascade: valor líquido repassado à funerária */
  funeralHomeAmountCents?: number;
  /** Cascade: valor líquido repassado ao Admin Parceiro */
  adminParceiroAmountCents?: number;
  status: "paid" | "pending";
  /** "pendente" = dinheiro retido no nosso Stripe, repasse manual ainda não feito
   *  "realizado" = repasse confirmado manualmente pelo dev admin
   *  undefined   = pedido antigo (tratar como pendente) */
  repasseStatus?: "pendente" | "realizado";
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
  /** % que o Admin Parceiro cobra desta funerária (default 20) */
  adminCommissionPercent: number;
  /** Dados bancários da funerária para repasse */
  bankPixKey?: string;
  bankHolderName?: string;
  bankCpfCnpj?: string;
  /**
   * Override do modo de entrega de QR Code para ESTA funerária:
   * "inherit" → segue a configuração global da plataforma (padrão)
   * "admin"   → admin é responsável pelo envio para clientes desta funerária
   * "self"    → clientes desta funerária imprimem o próprio QR
   */
  qrDeliveryMode?: QrDeliveryOverride;
  /** ID do plano de assinatura mensal ativo (referência a PlatformConfig.funeralPlans[].id) */
  activePlanId?: string;
  /** Quando a assinatura foi iniciada */
  planStartedAt?: string;
  /** Quando a assinatura renova (ou expira) */
  planRenewsAt?: string;
  /** Quantos memoriais foram criados no ciclo atual */
  memorialCountMonth?: number;
  /** Quando o contador mensal foi resetado pela última vez */
  memorialCountResetAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type ContractAcceptance = {
  id: string;
  type: "dev_to_admin" | "admin_to_funeral";
  signerEmail: string;
  signerName?: string;
  funeralHomeId?: string;
  acceptedAt: string;
  ipAddress?: string;
  contractVersion: string;
  createdAt: string;
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
  serviceType: "sepultamento" | "cremacao" | "translado" | "preparacao";
  casketType?: string;
  additionalServices: string[];
  totalAmountCents: number;
  paidAmountCents: number;
  paymentMethod?: "pix" | "card" | "boleto" | "cash" | "installment";
  status: "em_andamento" | "concluido" | "cancelado";
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type FuneralSchedule = {
  id: string;
  funeralHomeId: string;
  serviceId?: string;
  deceasedName: string;
  type: "velorio" | "cerimonia" | "sepultamento" | "cremacao" | "translado";
  dateTime: string;
  location: string;
  address?: string;
  status: "agendado" | "em_andamento" | "concluido" | "cancelado";
  assignedStaff?: string[];
  notes?: string;
  createdAt: string;
};

export type InventoryItem = {
  id: string;
  funeralHomeId: string;
  name: string;
  category: "urna" | "flores" | "veu" | "ornamento" | "livro" | "outros";
  description?: string;
  quantity: number;
  minQuantity: number;
  unitPriceCents: number;
  costPriceCents?: number;
  imageUrl?: string;
  status: "disponivel" | "esgotado" | "reservado";
  createdAt: string;
  updatedAt: string;
};

export type StaffMember = {
  id: string;
  funeralHomeId: string;
  name: string;
  role: "tanatopraxista" | "cerimonialista" | "motorista" | "atendente" | "gerente" | "outros";
  phone: string;
  email?: string;
  commissionPercent?: number;
  schedule: "manha" | "tarde" | "noite" | "integral" | "folga";
  isActive: boolean;
  createdAt: string;
};

export type FuneralDocument = {
  id: string;
  funeralHomeId: string;
  serviceId?: string;
  type: "certidao_obito" | "autorizacao_sepultamento" | "autorizacao_cremacao" | "alvara" | "guia_translado" | "outros";
  documentNumber?: string;
  issuer?: string;
  issueDate: string;
  expiryDate?: string;
  status: "pendente" | "emitido" | "valido" | "expirado";
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
  contractAcceptances: ContractAcceptance[];
};

// ─── Row mappers (DB snake_case → TS camelCase) ───────────────────────────────

function mapMemorial(r: any): ManagedMemorial {
  return {
    id: r.id,
    ownerId: r.owner_id,
    name: r.name,
    nickname: r.nickname ?? undefined,
    birthDate: r.birth_date ?? undefined,
    deathDate: r.death_date ?? undefined,
    city: r.city ?? undefined,
    epitaph: r.epitaph ?? "Uma história preservada com carinho.",
    biography: r.biography ?? "",
    imageUrl: r.image_url ?? "/images/hero-bg.png",
    audioUrl: r.audio_url ?? undefined,
    videoUrl: r.video_url ?? undefined,
    gallery: Array.isArray(r.gallery) ? r.gallery : [],
    timelineEvents: Array.isArray(r.timeline) ? r.timeline : [],
    status: r.status ?? "rascunho",
    paymentStatus: r.payment_status ?? "pending",
    qrUnlocked: r.qr_unlocked ?? false,
    source: r.source ?? "customer",
    funeralHomeId: r.funeral_home_id ?? undefined,
    offerLinkId: r.offer_link_id ?? undefined,
    visits: r.visits ?? 0,
    flowers: r.flowers ?? undefined,
    hearts: r.hearts ?? undefined,
    deliveryAddress: r.delivery_address ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function toDbMemorial(m: ManagedMemorial) {
  return {
    id: m.id,
    owner_id: m.ownerId,
    name: m.name,
    nickname: m.nickname ?? null,
    birth_date: m.birthDate ?? null,
    death_date: m.deathDate ?? null,
    city: m.city ?? null,
    epitaph: m.epitaph,
    biography: m.biography,
    image_url: m.imageUrl,
    audio_url: m.audioUrl ?? null,
    video_url: m.videoUrl ?? null,
    gallery: m.gallery,
    timeline: m.timelineEvents,
    status: m.status,
    payment_status: m.paymentStatus ?? "pending",
    qr_unlocked: m.qrUnlocked ?? false,
    source: m.source ?? "customer",
    funeral_home_id: m.funeralHomeId ?? null,
    offer_link_id: m.offerLinkId ?? null,
    visits: m.visits ?? 0,
    flowers: m.flowers ?? null,
    hearts: m.hearts ?? null,
    // delivery_address: m.deliveryAddress ?? null, // TODO: Run DB migration to add delivery_address column
  };
}

function mapQrCode(r: any): ManagedQrCode {
  return {
    id: r.id,
    memorialId: r.memorial_id ?? undefined,
    offerLinkId: r.offer_link_id ?? undefined,
    publicPath: r.public_path,
    scans: r.scans ?? 0,
    status: r.status ?? "ativo",
    kind: r.kind ?? "memorial",
    createdAt: r.created_at,
    lastScanAt: r.last_scan_at ?? undefined,
  };
}

function toDbQrCode(q: ManagedQrCode) {
  return {
    id: q.id,
    memorial_id: q.memorialId ?? null,
    offer_link_id: q.offerLinkId ?? null,
    public_path: q.publicPath,
    scans: q.scans ?? 0,
    status: q.status ?? "ativo",
    kind: q.kind ?? "memorial",
    last_scan_at: q.lastScanAt ?? null,
  };
}

function mapTribute(r: any): ManagedTribute {
  return {
    id: r.id,
    memorialId: r.memorial_id,
    author: r.author,
    message: r.message,
    createdAt: r.created_at,
    status: r.status ?? "pendente",
    tag: r.tag ?? undefined,
    isPinned: r.is_pinned ?? false,
  };
}

function toDbTribute(t: ManagedTribute) {
  return {
    id: t.id,
    memorial_id: t.memorialId,
    author: t.author,
    message: t.message,
    status: t.status ?? "pendente",
    tag: t.tag ?? null,
    is_pinned: t.isPinned ?? false,
  };
}

function mapCandle(r: any): ManagedCandle {
  return {
    id: r.id,
    memorialId: r.memorial_id,
    name: r.name,
    isEternal: r.is_eternal ?? false,
    createdAt: r.created_at,
    paymentSessionId: r.payment_session_id ?? undefined,
  };
}

function toDbCandle(c: ManagedCandle) {
  return {
    id: c.id,
    memorial_id: c.memorialId,
    name: c.name,
    is_eternal: c.isEternal ?? false,
    payment_session_id: c.paymentSessionId ?? null,
  };
}

function mapProfile(r: any): CuratorProfile {
  return {
    name: r.name ?? "",
    email: r.email ?? "",
    bio: r.bio ?? "",
    theme: r.theme ?? "noturno",
    privacy: r.privacy ?? "public",
    notifyVelas: r.notify_velas ?? true,
    notifyTributos: r.notify_tributos ?? true,
    multiFactorEnabled: r.multi_factor_enabled ?? false,
    language: r.language ?? "pt-BR",
    timezone: r.timezone ?? "GMT-3",
    globalAudio: r.global_audio ?? true,
    isAdmin: r.is_admin ?? false,
    avatarUrl: r.avatar_url ?? undefined,
  };
}

function mapOrder(r: any): PlatformOrder {
  return {
    id: r.id,
    userName: r.user_name ?? "",
    userEmail: r.email,
    customerDocument: r.customer_document ?? "",
    customerPhone: r.customer_phone ?? "",
    planId: r.plan_id ?? r.plan ?? "",
    paymentMethod: r.payment_method ?? "pix",
    discountCode: r.discount_code ?? undefined,
    discountCents: r.discount_cents ?? 0,
    grossAmountCents: r.gross_amount_cents ?? r.amount ?? 0,
    platformCommissionCents: r.platform_commission_cents ?? 0,
    operatorAmountCents: r.operator_amount_cents ?? 0,
    funeralHomeCommissionCents: r.funeral_home_commission_cents ?? undefined,
    funeralHomeAmountCents: r.funeral_home_amount_cents ?? undefined,
    adminParceiroAmountCents: r.admin_parceiro_amount_cents ?? undefined,
    status: r.status === "paid" ? "paid" : "pending",
    repasseStatus: r.repasse_status ?? undefined,
    source: r.source ?? undefined,
    offerLinkId: r.offer_link_id ?? undefined,
    funeralHomeId: r.funeral_home_id ?? undefined,
    draftMemorialId: r.draft_memorial_id ?? undefined,
    payerType: r.payer_type ?? undefined,
    createdAt: r.created_at,
  };
}

function toDbOrder(o: PlatformOrder) {
  return {
    id: o.id,
    user_id: null,
    email: o.userEmail,
    user_name: o.userName,
    customer_document: o.customerDocument,
    customer_phone: o.customerPhone,
    plan: o.planId,
    plan_id: o.planId,
    payment_method: o.paymentMethod,
    discount_code: o.discountCode ?? null,
    discount_cents: o.discountCents ?? 0,
    gross_amount_cents: o.grossAmountCents ?? 0,
    amount: o.grossAmountCents ?? 0,
    platform_commission_cents: o.platformCommissionCents ?? 0,
    operator_amount_cents: o.operatorAmountCents ?? 0,
    funeral_home_commission_cents: o.funeralHomeCommissionCents ?? 0,
    funeral_home_amount_cents: o.funeralHomeAmountCents ?? 0,
    admin_parceiro_amount_cents: o.adminParceiroAmountCents ?? 0,
    status: o.status ?? "pending",
    source: o.source ?? null,
    offer_link_id: o.offerLinkId ?? null,
    funeral_home_id: o.funeralHomeId ?? null,
    draft_memorial_id: o.draftMemorialId ?? null,
    payer_type: o.payerType ?? null,
  };
}

function mapFuneralHome(r: any): FuneralHome {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug ?? r.id,
    contactName: r.contact_name ?? "",
    email: r.email,
    phone: r.phone ?? "",
    cnpj: r.cnpj ?? undefined,
    city: r.city ?? undefined,
    state: r.state ?? undefined,
    address: r.address ?? undefined,
    passwordHash: r.password_hash ?? "",
    isActive: r.is_active ?? true,
    approvalStatus: r.approval_status ?? "pending",
    stripeAccountId: r.stripe_account_id ?? undefined,
    adminCommissionPercent: r.admin_commission_percent ?? 20,
    bankPixKey: r.bank_pix_key ?? undefined,
    bankHolderName: r.bank_holder_name ?? undefined,
    bankCpfCnpj: r.bank_cpf_cnpj ?? undefined,
    qrDeliveryMode: (r.qr_delivery_mode as QrDeliveryOverride) ?? "inherit",
    activePlanId: r.active_plan_id ?? undefined,
    planStartedAt: r.plan_started_at ?? undefined,
    planRenewsAt: r.plan_renews_at ?? undefined,
    memorialCountMonth: r.memorial_count_month ?? 0,
    memorialCountResetAt: r.memorial_count_reset_at ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function mapContractAcceptance(r: any): ContractAcceptance {
  return {
    id: r.id,
    type: r.type,
    signerEmail: r.signer_email,
    signerName: r.signer_name ?? undefined,
    funeralHomeId: r.funeral_home_id ?? undefined,
    acceptedAt: r.accepted_at,
    ipAddress: r.ip_address ?? undefined,
    contractVersion: r.contract_version ?? "1.0",
    createdAt: r.created_at,
  };
}

function mapOfferLink(r: any): FuneralHomeOfferLink {
  return {
    id: r.id,
    funeralHomeId: r.funeral_home_id ?? undefined,
    title: r.title,
    slug: r.slug,
    description: r.description ?? "",
    cycle: r.cycle ?? "one_time",
    priceCents: r.price_cents ?? 0,
    status: r.status ?? "active",
    accessCount: r.access_count ?? 0,
    conversionCount: r.conversion_count ?? 0,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function mapFuneralService(r: any): FuneralService {
  return {
    id: r.id,
    funeralHomeId: r.funeral_home_id,
    deceasedName: r.deceased_name,
    deceasedBirthDate: r.deceased_birth_date ?? undefined,
    deceasedDeathDate: r.deceased_death_date,
    deceasedCauseOfDeath: r.deceased_cause_of_death ?? undefined,
    deceasedDocumentNumber: r.deceased_document_number ?? undefined,
    familyContactName: r.family_contact_name,
    familyContactPhone: r.family_contact_phone,
    familyContactEmail: r.family_contact_email ?? undefined,
    familyContactRelation: r.family_contact_relation,
    serviceType: r.service_type,
    casketType: r.casket_type ?? undefined,
    additionalServices: Array.isArray(r.additional_services) ? r.additional_services : [],
    totalAmountCents: r.total_amount_cents ?? 0,
    paidAmountCents: r.paid_amount_cents ?? 0,
    paymentMethod: r.payment_method ?? undefined,
    status: r.status ?? "em_andamento",
    notes: r.notes ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function mapFuneralSchedule(r: any): FuneralSchedule {
  return {
    id: r.id,
    funeralHomeId: r.funeral_home_id,
    serviceId: r.service_id ?? undefined,
    deceasedName: r.deceased_name,
    type: r.type,
    dateTime: r.date_time,
    location: r.location,
    address: r.address ?? undefined,
    status: r.status ?? "agendado",
    assignedStaff: Array.isArray(r.assigned_staff) ? r.assigned_staff : [],
    notes: r.notes ?? undefined,
    createdAt: r.created_at,
  };
}

function mapInventoryItem(r: any): InventoryItem {
  return {
    id: r.id,
    funeralHomeId: r.funeral_home_id,
    name: r.name,
    category: r.category,
    description: r.description ?? undefined,
    quantity: r.quantity ?? 0,
    minQuantity: r.min_quantity ?? 0,
    unitPriceCents: r.unit_price_cents ?? 0,
    costPriceCents: r.cost_price_cents ?? undefined,
    imageUrl: r.image_url ?? undefined,
    status: r.status ?? "disponivel",
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function mapStaffMember(r: any): StaffMember {
  return {
    id: r.id,
    funeralHomeId: r.funeral_home_id,
    name: r.name,
    role: r.role,
    phone: r.phone,
    email: r.email ?? undefined,
    commissionPercent: r.commission_percent ?? undefined,
    schedule: r.schedule ?? "manha",
    isActive: r.is_active ?? true,
    createdAt: r.created_at,
  };
}

function mapFuneralDocument(r: any): FuneralDocument {
  return {
    id: r.id,
    funeralHomeId: r.funeral_home_id,
    serviceId: r.service_id ?? undefined,
    type: r.type,
    documentNumber: r.document_number ?? undefined,
    issuer: r.issuer ?? undefined,
    issueDate: r.issue_date,
    expiryDate: r.expiry_date ?? undefined,
    status: r.status ?? "pendente",
    fileUrl: r.file_url ?? undefined,
    notes: r.notes ?? undefined,
    createdAt: r.created_at,
  };
}

function mapComplaint(r: any): ManagedComplaint {
  return {
    id: r.id,
    target: r.target,
    reason: r.reason,
    reporter: r.reporter,
    status: r.status ?? "Pendente",
    createdAt: r.created_at,
  };
}

// ─── Diff utilities ───────────────────────────────────────────────────────────

function diffItems<T extends { id: string }>(
  original: T[],
  updated: T[]
): { added: T[]; modified: T[]; deleted: string[] } {
  const origMap = new Map(original.map((i) => [i.id, i]));
  const updMap = new Map(updated.map((i) => [i.id, i]));
  return {
    added: updated.filter((i) => !origMap.has(i.id)),
    modified: updated.filter((i) => {
      const o = origMap.get(i.id);
      return o && JSON.stringify(o) !== JSON.stringify(i);
    }),
    deleted: original.filter((i) => !updMap.has(i.id)).map((i) => i.id),
  };
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function readPlatformData(): Promise<PlatformData> {
  const supabase = await createAdminClient();

  const [
    { data: memorialsRows = [] },
    { data: qrCodesRows = [] },
    { data: tributesRows = [] },
    { data: candlesRows = [] },
    { data: ordersRows = [] },
    { data: profilesRows = [] },
    { data: funeralHomesRows = [] },
    { data: offerLinksRows = [] },
    { data: funeralServicesRows = [] },
    { data: funeralSchedulesRows = [] },
    { data: inventoryItemsRows = [] },
    { data: staffMembersRows = [] },
    { data: funeralDocumentsRows = [] },
    { data: complaintsRows = [] },
    { data: configRows = [] },
    { data: settingsRows = [] },
    { data: contractRows = [] },
  ] = await Promise.all([
    supabase.from("memorials").select("*").order("created_at", { ascending: false }),
    supabase.from("qr_codes").select("*"),
    supabase.from("tributes").select("*").order("created_at", { ascending: false }),
    supabase.from("candles").select("*").order("created_at", { ascending: false }),
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
    supabase.from("profiles").select("*"),
    supabase.from("funeral_homes").select("*"),
    supabase.from("funeral_home_offer_links").select("*"),
    supabase.from("funeral_services").select("*"),
    supabase.from("funeral_schedules").select("*"),
    supabase.from("inventory_items").select("*"),
    supabase.from("staff_members").select("*"),
    supabase.from("funeral_documents").select("*"),
    supabase.from("complaints").select("*"),
    supabase.from("platform_config").select("*").eq("id", 1),
    supabase.from("platform_settings").select("*"),
    supabase.from("contract_acceptances").select("*").order("created_at", { ascending: false }),
  ]);

  const cfg = configRows?.[0] ?? {};
  const config: PlatformConfig = {
    ownerCommissionPercent: cfg.owner_commission_percent ?? 15,
    familyMemorialPriceCents: cfg.family_memorial_price_cents ?? 9900,
    funeralHomeMemorialPriceCents: cfg.funeral_home_memorial_price_cents ?? 4900,
    candlePriceCents: cfg.candle_price_cents ?? 100,
    plans: Array.isArray(cfg.plans) ? cfg.plans : [],
    defaultPlanId: cfg.default_plan_id ?? undefined,
    funeralPlans: (Array.isArray(cfg.funeral_plans) ? cfg.funeral_plans : []).filter((p: unknown) => !!p && typeof p === "object"),
    defaultFuneralPlanId: cfg.default_funeral_plan_id ?? undefined,
    funeralHomeQrDeliveryMode: (cfg.funeral_home_qr_delivery_mode as "admin" | "self") ?? "self",
  };

  const settingsMap = Object.fromEntries((settingsRows ?? []).map((r: any) => [r.key, r.value]));

  const profiles = (profilesRows ?? []).map(mapProfile);
  const defaultProfile: CuratorProfile = profiles[0] ?? {
    name: "Novo Curador",
    email: "curador@plataforma.com",
    bio: "Guardião das memórias da família.",
    theme: "noturno",
    privacy: "public",
    notifyVelas: true,
    notifyTributos: true,
    multiFactorEnabled: false,
    language: "pt-BR",
    timezone: "GMT-3",
    globalAudio: true,
  };

  return {
    config,
    adminBankDataEncrypted: settingsMap["adminBankDataEncrypted"],
    platformAdminEmail: settingsMap["platformAdminEmail"],
    memorials: (memorialsRows ?? []).map(mapMemorial),
    qrCodes: (qrCodesRows ?? []).map(mapQrCode),
    tributes: (tributesRows ?? []).map(mapTribute),
    candles: (candlesRows ?? []).map(mapCandle),
    orders: (ordersRows ?? []).map(mapOrder),
    profiles,
    profile: defaultProfile,
    funeralHomes: (funeralHomesRows ?? []).map(mapFuneralHome),
    offerLinks: (offerLinksRows ?? []).map(mapOfferLink),
    funeralServices: (funeralServicesRows ?? []).map(mapFuneralService),
    funeralSchedules: (funeralSchedulesRows ?? []).map(mapFuneralSchedule),
    inventoryItems: (inventoryItemsRows ?? []).map(mapInventoryItem),
    staffMembers: (staffMembersRows ?? []).map(mapStaffMember),
    funeralDocuments: (funeralDocumentsRows ?? []).map(mapFuneralDocument),
    complaints: (complaintsRows ?? []).map(mapComplaint),
    contractAcceptances: (contractRows ?? []).map(mapContractAcceptance),
  };
}

// ─── Persist changes ──────────────────────────────────────────────────────────

async function persistChanges(original: PlatformData, updated: PlatformData): Promise<void> {
  const supabase = await createAdminClient();
  const ops: PromiseLike<any>[] = [];

  // ── Memorials ──
  const mDiff = diffItems(original.memorials, updated.memorials);
  if (mDiff.added.length > 0) ops.push(supabase.from("memorials").insert(mDiff.added.map(toDbMemorial)));
  for (const m of mDiff.modified) ops.push(supabase.from("memorials").update(toDbMemorial(m)).eq("id", m.id));
  if (mDiff.deleted.length > 0) ops.push(supabase.from("memorials").delete().in("id", mDiff.deleted));

  // ── QR Codes ──
  const qDiff = diffItems(original.qrCodes, updated.qrCodes);
  if (qDiff.added.length > 0) ops.push(supabase.from("qr_codes").insert(qDiff.added.map(toDbQrCode)));
  for (const q of qDiff.modified) ops.push(supabase.from("qr_codes").update(toDbQrCode(q)).eq("id", q.id));
  if (qDiff.deleted.length > 0) ops.push(supabase.from("qr_codes").delete().in("id", qDiff.deleted));

  // ── Tributes ──
  const tDiff = diffItems(original.tributes, updated.tributes);
  if (tDiff.added.length > 0) ops.push(supabase.from("tributes").insert(tDiff.added.map(toDbTribute)));
  for (const t of tDiff.modified) ops.push(supabase.from("tributes").update(toDbTribute(t)).eq("id", t.id));
  if (tDiff.deleted.length > 0) ops.push(supabase.from("tributes").delete().in("id", tDiff.deleted));

  // ── Candles ──
  const cDiff = diffItems(original.candles, updated.candles);
  if (cDiff.added.length > 0) ops.push(supabase.from("candles").insert(cDiff.added.map(toDbCandle)));
  if (cDiff.deleted.length > 0) ops.push(supabase.from("candles").delete().in("id", cDiff.deleted));

  // ── Orders ──
  const oDiff = diffItems(original.orders, updated.orders);
  if (oDiff.added.length > 0) ops.push(supabase.from("orders").insert(oDiff.added.map(toDbOrder)));
  for (const o of oDiff.modified) ops.push(supabase.from("orders").update(toDbOrder(o)).eq("id", o.id));

  // ── Profiles ──
  const pDiff = diffItems(
    original.profiles.map((p) => ({ ...p, id: p.email })),
    updated.profiles.map((p) => ({ ...p, id: p.email }))
  );
  for (const p of pDiff.modified) {
    ops.push(
      supabase
        .from("profiles")
        .update({
          name: p.name,
          bio: p.bio,
          theme: p.theme,
          privacy: p.privacy,
          notify_velas: p.notifyVelas,
          notify_tributos: p.notifyTributos,
          multi_factor_enabled: p.multiFactorEnabled,
          language: p.language,
          timezone: p.timezone,
          global_audio: p.globalAudio,
          is_admin: p.isAdmin ?? false,
          avatar_url: p.avatarUrl ?? null,
        })
        .eq("email", p.email)
    );
  }

  // ── Funeral Homes ──
  const fhDiff = diffItems(original.funeralHomes, updated.funeralHomes);
  if (fhDiff.added.length > 0) {
    ops.push(
      supabase.from("funeral_homes").insert(
        fhDiff.added.map((fh) => ({
          id: fh.id,
          name: fh.name,
          slug: fh.slug,
          contact_name: fh.contactName,
          email: fh.email,
          phone: fh.phone,
          cnpj: fh.cnpj ?? null,
          city: fh.city ?? null,
          state: fh.state ?? null,
          address: fh.address ?? null,
          password_hash: fh.passwordHash,
          is_active: fh.isActive,
          approval_status: fh.approvalStatus,
          stripe_account_id: fh.stripeAccountId ?? null,
        }))
      )
    );
  }
  for (const fh of fhDiff.modified) {
    ops.push(
      supabase
        .from("funeral_homes")
        .update({
          name: fh.name,
          slug: fh.slug,
          contact_name: fh.contactName,
          email: fh.email,
          phone: fh.phone,
          cnpj: fh.cnpj ?? null,
          city: fh.city ?? null,
          state: fh.state ?? null,
          address: fh.address ?? null,
          is_active: fh.isActive,
          approval_status: fh.approvalStatus,
          stripe_account_id: fh.stripeAccountId ?? null,
          admin_commission_percent: fh.adminCommissionPercent ?? 20,
          bank_pix_key: fh.bankPixKey ?? null,
          bank_holder_name: fh.bankHolderName ?? null,
          bank_cpf_cnpj: fh.bankCpfCnpj ?? null,
          qr_delivery_mode: fh.qrDeliveryMode ?? "inherit",
          active_plan_id: fh.activePlanId ?? null,
          plan_started_at: fh.planStartedAt ?? null,
          plan_renews_at: fh.planRenewsAt ?? null,
          memorial_count_month: fh.memorialCountMonth ?? 0,
          memorial_count_reset_at: fh.memorialCountResetAt ?? null,
        })
        .eq("id", fh.id)
    );
  }

  // ── Offer Links ──
  const olDiff = diffItems(original.offerLinks, updated.offerLinks);
  if (olDiff.added.length > 0) {
    ops.push(
      supabase.from("funeral_home_offer_links").insert(
        olDiff.added.map((ol) => ({
          id: ol.id,
          funeral_home_id: ol.funeralHomeId ?? null,
          title: ol.title,
          slug: ol.slug,
          description: ol.description,
          cycle: ol.cycle,
          price_cents: ol.priceCents,
          status: ol.status,
          access_count: ol.accessCount,
          conversion_count: ol.conversionCount,
        }))
      )
    );
  }

  // ── Complaints ──
  const cpDiff = diffItems(original.complaints, updated.complaints);
  if (cpDiff.added.length > 0) {
    ops.push(
      supabase.from("complaints").insert(
        cpDiff.added.map((c) => ({
          id: c.id,
          target: c.target,
          reason: c.reason,
          reporter: c.reporter,
          status: c.status,
        }))
      )
    );
  }
  for (const c of cpDiff.modified) {
    ops.push(supabase.from("complaints").update({ status: c.status }).eq("id", c.id));
  }

  // ── Platform config ──
  if (JSON.stringify(original.config) !== JSON.stringify(updated.config)) {
    ops.push(
      supabase.from("platform_config").update({
        owner_commission_percent: updated.config.ownerCommissionPercent,
        family_memorial_price_cents: updated.config.familyMemorialPriceCents,
        funeral_home_memorial_price_cents: updated.config.funeralHomeMemorialPriceCents,
        candle_price_cents: updated.config.candlePriceCents,
        plans: updated.config.plans ?? [],
        default_plan_id: updated.config.defaultPlanId ?? null,
        funeral_plans: updated.config.funeralPlans ?? [],
        default_funeral_plan_id: updated.config.defaultFuneralPlanId ?? null,
        funeral_home_qr_delivery_mode: updated.config.funeralHomeQrDeliveryMode ?? "self",
      }).eq("id", 1)
    );
  }

  // ── Platform settings (admin bank data, etc.) ──
  if (original.adminBankDataEncrypted !== updated.adminBankDataEncrypted && updated.adminBankDataEncrypted) {
    ops.push(
      supabase.from("platform_settings").upsert({ key: "adminBankDataEncrypted", value: updated.adminBankDataEncrypted })
    );
  }

  if (ops.length > 0) {
    await Promise.all(ops);
  }
}

// ─── updatePlatformData ───────────────────────────────────────────────────────

export async function updatePlatformData<T>(callback: (data: PlatformData) => T | Promise<T>): Promise<T> {
  const original = await readPlatformData();
  const copy: PlatformData = JSON.parse(JSON.stringify(original));

  const result = await Promise.resolve(callback(copy));

  await persistChanges(original, copy);

  return result;
}

// ─── Contract acceptances ────────────────────────────────────────────────────

export async function saveContractAcceptance(
  input: Omit<ContractAcceptance, "id" | "createdAt">
): Promise<ContractAcceptance> {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("contract_acceptances")
    .insert({
      type: input.type,
      signer_email: input.signerEmail,
      signer_name: input.signerName ?? null,
      funeral_home_id: input.funeralHomeId ?? null,
      accepted_at: input.acceptedAt,
      ip_address: input.ipAddress ?? null,
      contract_version: input.contractVersion,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapContractAcceptance(data);
}

export async function getContractAcceptances(signerEmail: string): Promise<ContractAcceptance[]> {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("contract_acceptances")
    .select("*")
    .eq("signer_email", signerEmail)
    .order("created_at", { ascending: false });
  return (data ?? []).map(mapContractAcceptance);
}

export async function updateFuneralHomeCommission(
  funeralHomeId: string,
  adminCommissionPercent: number
): Promise<void> {
  const supabase = await createAdminClient();
  await supabase
    .from("funeral_homes")
    .update({ admin_commission_percent: adminCommissionPercent })
    .eq("id", funeralHomeId);
}

export async function updateFuneralHomeBankData(
  funeralHomeId: string,
  bankData: { bankPixKey?: string; bankHolderName?: string; bankCpfCnpj?: string }
): Promise<void> {
  const supabase = await createAdminClient();
  await supabase
    .from("funeral_homes")
    .update({
      bank_pix_key: bankData.bankPixKey ?? null,
      bank_holder_name: bankData.bankHolderName ?? null,
      bank_cpf_cnpj: bankData.bankCpfCnpj ?? null,
    })
    .eq("id", funeralHomeId);
}
