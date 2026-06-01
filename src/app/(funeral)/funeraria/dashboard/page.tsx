"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { 
  ManagedMemorial, 
  PlatformOrder,
  FuneralService,
  FuneralSchedule,
  InventoryItem,
  StaffMember,
  FuneralDocument
} from "@/src/lib/platform-data";
import { centsToBRL } from "@/src/lib/platform-types";

type DashboardData = {
  funeralHome: {
    id: string;
    name: string;
    email: string;
    contactName: string;
    phone: string;
    cnpj?: string;
    city?: string;
    state?: string;
    createdAt: string;
  };
  stats: {
    totalMemorials: number;
    activeMemorials: number;
    pendingMemorials: number;
    totalPaid: number;
    totalPending: number;
    totalRevenue: number;
  };
  memorials: ManagedMemorial[];
  orders: PlatformOrder[];
};

type Tab = "overview" | "memorials" | "services" | "schedules" | "inventory" | "staff" | "documents" | "financial";

export default function FunerariaDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // ERP State lists
  const [services, setServices] = useState<FuneralService[]>([]);
  const [schedules, setSchedules] = useState<FuneralSchedule[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [documents, setDocuments] = useState<FuneralDocument[]>([]);

  // Loading states for ERP modules
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  // Modals & Forms State
  const [activeModal, setActiveModal] = useState<"service" | "schedule" | "inventory" | "staff" | "document" | null>(null);
  const [editingItem, setEditingItem] = useState<FuneralService | FuneralSchedule | InventoryItem | StaffMember | FuneralDocument | null>(null);
  const [submittingForm, setSubmittingForm] = useState(false);
  const [formError, setFormError] = useState("");

  // Form Field States
  // 1. Service Form
  const [serviceForm, setServiceForm] = useState({
    deceasedName: "",
    deceasedBirthDate: "",
    deceasedDeathDate: "",
    deceasedCauseOfDeath: "",
    deceasedDocumentNumber: "",
    familyContactName: "",
    familyContactPhone: "",
    familyContactEmail: "",
    familyContactRelation: "familiar",
    serviceType: "sepultamento" as 'sepultamento' | 'cremacao' | 'translado' | 'preparacao',
    casketType: "",
    additionalServices: [] as string[],
    notes: "",
    totalAmountBRL: 0,
    paidAmountBRL: 0,
    paymentMethod: "pix" as 'pix' | 'card' | 'boleto' | 'cash' | 'installment',
    status: "em_andamento" as 'em_andamento' | 'concluido' | 'cancelado'
  });

  // 2. Schedule Form
  const [scheduleForm, setScheduleForm] = useState({
    deceasedName: "",
    type: "velorio" as 'velorio' | 'cerimonia' | 'sepultamento' | 'cremacao' | 'translado',
    dateTime: "",
    location: "",
    address: "",
    notes: "",
    assignedStaff: [] as string[],
    status: "agendado" as 'agendado' | 'em_andamento' | 'concluido' | 'cancelado'
  });

  // 3. Inventory Form
  const [inventoryForm, setInventoryForm] = useState({
    name: "",
    category: "urna" as 'urna' | 'flores' | 'veu' | 'ornamento' | 'livro' | 'outros',
    description: "",
    quantity: 0,
    minQuantity: 1,
    unitPriceBRL: 0,
    costPriceBRL: 0,
    status: "disponivel" as 'disponivel' | 'esgotado' | 'reservado'
  });

  // 4. Staff Form
  const [staffForm, setStaffForm] = useState({
    name: "",
    role: "tanatopraxista" as 'tanatopraxista' | 'cerimonialista' | 'motorista' | 'atendente' | 'gerente' | 'outros',
    phone: "",
    email: "",
    commissionPercent: 0,
    schedule: "integral" as 'manha' | 'tarde' | 'noite' | 'integral' | 'folga',
    isActive: true
  });

  // 5. Document Form
  const [documentForm, setDocumentForm] = useState({
    serviceId: "",
    type: "certidao_obito" as 'certidao_obito' | 'autorizacao_sepultamento' | 'autorizacao_cremacao' | 'alvara' | 'guia_translado' | 'outros',
    documentNumber: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    status: "pendente" as 'pendente' | 'emitido' | 'valido' | 'expirado',
    notes: ""
  });

  // Load Main Data
  const loadData = useCallback(async () => {
    try {
      const response = await fetch("/api/funeral-auth/me");
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/funeraria/login");
          return;
        }
        throw new Error("Erro ao carregar dados.");
      }
      const payload = await response.json();
      setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar.");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // ERP Loaders
  const loadServices = async () => {
    setLoadingServices(true);
    try {
      const response = await fetch("/api/funeral-auth/services");
      if (response.ok) {
        const payload = await response.json();
        setServices(payload.services || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingServices(false);
    }
  };

  const loadSchedules = async () => {
    setLoadingSchedules(true);
    try {
      const response = await fetch("/api/funeral-auth/schedules");
      if (response.ok) {
        const payload = await response.json();
        setSchedules(payload.schedules || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSchedules(false);
    }
  };

  const loadInventory = async () => {
    setLoadingInventory(true);
    try {
      const response = await fetch("/api/funeral-auth/inventory");
      if (response.ok) {
        const payload = await response.json();
        setInventory(payload.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInventory(false);
    }
  };

  const loadStaff = async () => {
    setLoadingStaff(true);
    try {
      const response = await fetch("/api/funeral-auth/staff");
      if (response.ok) {
        const payload = await response.json();
        setStaff(payload.members || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStaff(false);
    }
  };

  const loadDocuments = async () => {
    setLoadingDocuments(true);
    try {
      const response = await fetch("/api/funeral-auth/documents");
      if (response.ok) {
        const payload = await response.json();
        setDocuments(payload.documents || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDocuments(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadData();
    };
    init();
  }, [loadData]);

  // Load specific tab data on active tab change
  useEffect(() => {
    const loadTab = async () => {
      if (activeTab === "services") {
        await loadServices();
      } else if (activeTab === "schedules") {
        await loadSchedules();
        await loadStaff(); // needed for staff assignment
      } else if (activeTab === "inventory") {
        await loadInventory();
      } else if (activeTab === "staff") {
        await loadStaff();
      } else if (activeTab === "documents") {
        await loadDocuments();
        await loadServices(); // needed for service linking
      }
    };
    loadTab();
  }, [activeTab]);

  const handleLogout = async () => {
    await fetch("/api/funeral-auth/logout", { method: "POST" });
    router.push("/funeraria/login");
  };

  // ERP Submit Handlers
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingForm(true);
    setFormError("");

    const payload = {
      ...serviceForm,
      totalAmountCents: Math.round(serviceForm.totalAmountBRL * 100),
      paidAmountCents: Math.round(serviceForm.paidAmountBRL * 100),
      id: editingItem?.id
    };

    try {
      const response = await fetch("/api/funeral-auth/services", {
        method: editingItem ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setActiveModal(null);
        setEditingItem(null);
        loadServices();
      } else {
        const errPayload = await response.json();
        setFormError(errPayload.error || "Erro ao salvar atendimento.");
      }
    } catch {
      setFormError("Erro de conexão.");
    } finally {
      setSubmittingForm(false);
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingForm(true);
    setFormError("");

    const payload = {
      ...scheduleForm,
      id: editingItem?.id
    };

    try {
      const response = await fetch("/api/funeral-auth/schedules", {
        method: editingItem ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setActiveModal(null);
        setEditingItem(null);
        loadSchedules();
      } else {
        const errPayload = await response.json();
        setFormError(errPayload.error || "Erro ao salvar agendamento.");
      }
    } catch {
      setFormError("Erro de conexão.");
    } finally {
      setSubmittingForm(false);
    }
  };

  const handleInventorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingForm(true);
    setFormError("");

    const payload = {
      ...inventoryForm,
      unitPriceCents: Math.round(inventoryForm.unitPriceBRL * 100),
      costPriceCents: Math.round(inventoryForm.costPriceBRL * 100),
      id: editingItem?.id
    };

    try {
      const response = await fetch("/api/funeral-auth/inventory", {
        method: editingItem ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setActiveModal(null);
        setEditingItem(null);
        loadInventory();
      } else {
        const errPayload = await response.json();
        setFormError(errPayload.error || "Erro ao salvar estoque.");
      }
    } catch {
      setFormError("Erro de conexão.");
    } finally {
      setSubmittingForm(false);
    }
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingForm(true);
    setFormError("");

    const payload = {
      ...staffForm,
      id: editingItem?.id
    };

    try {
      const response = await fetch("/api/funeral-auth/staff", {
        method: editingItem ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setActiveModal(null);
        setEditingItem(null);
        loadStaff();
      } else {
        const errPayload = await response.json();
        setFormError(errPayload.error || "Erro ao salvar funcionário.");
      }
    } catch {
      setFormError("Erro de conexão.");
    } finally {
      setSubmittingForm(false);
    }
  };

  const handleDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingForm(true);
    setFormError("");

    const payload = {
      ...documentForm,
      id: editingItem?.id
    };

    try {
      const response = await fetch("/api/funeral-auth/documents", {
        method: editingItem ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setActiveModal(null);
        setEditingItem(null);
        loadDocuments();
      } else {
        const errPayload = await response.json();
        setFormError(errPayload.error || "Erro ao salvar documento.");
      }
    } catch {
      setFormError("Erro de conexão.");
    } finally {
      setSubmittingForm(false);
    }
  };

  // Quick Action: Change Inventory Quantity
  const handleInventoryQuantityChange = async (item: InventoryItem, delta: number) => {
    const newQty = Math.max(0, item.quantity + delta);
    try {
      await fetch("/api/funeral-auth/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, quantity: newQty }),
      });
      loadInventory();
    } catch (err) {
      console.error(err);
    }
  };

  // Quick Action: Toggle Staff Active
  const handleToggleStaff = async (member: StaffMember) => {
    try {
      await fetch("/api/funeral-auth/staff", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: member.id, isActive: !member.isActive }),
      });
      loadStaff();
    } catch (err) {
      console.error(err);
    }
  };

  // Open Edit Modals
  const openEditService = (svc: FuneralService) => {
    setEditingItem(svc);
    setServiceForm({
      deceasedName: svc.deceasedName,
      deceasedBirthDate: svc.deceasedBirthDate || "",
      deceasedDeathDate: svc.deceasedDeathDate,
      deceasedCauseOfDeath: svc.deceasedCauseOfDeath || "",
      deceasedDocumentNumber: svc.deceasedDocumentNumber || "",
      familyContactName: svc.familyContactName,
      familyContactPhone: svc.familyContactPhone,
      familyContactEmail: svc.familyContactEmail || "",
      familyContactRelation: svc.familyContactRelation,
      serviceType: svc.serviceType,
      casketType: svc.casketType || "",
      additionalServices: svc.additionalServices || [],
      notes: svc.notes || "",
      totalAmountBRL: svc.totalAmountCents / 100,
      paidAmountBRL: svc.paidAmountCents / 100,
      paymentMethod: svc.paymentMethod || "pix",
      status: svc.status
    });
    setActiveModal("service");
  };

  const openEditSchedule = (sch: FuneralSchedule) => {
    setEditingItem(sch);
    setScheduleForm({
      deceasedName: sch.deceasedName,
      type: sch.type,
      dateTime: sch.dateTime.slice(0, 16), // Format to datetime-local compatibility (YYYY-MM-DDThh:mm)
      location: sch.location,
      address: sch.address || "",
      notes: sch.notes || "",
      assignedStaff: sch.assignedStaff || [],
      status: sch.status
    });
    setActiveModal("schedule");
  };

  const openEditInventory = (inv: InventoryItem) => {
    setEditingItem(inv);
    setInventoryForm({
      name: inv.name,
      category: inv.category,
      description: inv.description || "",
      quantity: inv.quantity,
      minQuantity: inv.minQuantity,
      unitPriceBRL: inv.unitPriceCents / 100,
      costPriceBRL: (inv.costPriceCents || 0) / 100,
      status: inv.status
    });
    setActiveModal("inventory");
  };

  const openEditStaff = (st: StaffMember) => {
    setEditingItem(st);
    setStaffForm({
      name: st.name,
      role: st.role,
      phone: st.phone,
      email: st.email || "",
      commissionPercent: st.commissionPercent || 0,
      schedule: st.schedule,
      isActive: st.isActive
    });
    setActiveModal("staff");
  };

  const openEditDocument = (doc: FuneralDocument) => {
    setEditingItem(doc);
    setDocumentForm({
      serviceId: doc.serviceId || "",
      type: doc.type,
      documentNumber: doc.documentNumber || "",
      issuer: doc.issuer || "",
      issueDate: doc.issueDate.slice(0, 10), // YYYY-MM-DD
      expiryDate: doc.expiryDate ? doc.expiryDate.slice(0, 10) : "",
      status: doc.status,
      notes: doc.notes || ""
    });
    setActiveModal("document");
  };

  // Reset & Open Create Modals
  const openCreateService = () => {
    setEditingItem(null);
    setServiceForm({
      deceasedName: "",
      deceasedBirthDate: "",
      deceasedDeathDate: new Date().toISOString().slice(0, 10),
      deceasedCauseOfDeath: "",
      deceasedDocumentNumber: "",
      familyContactName: "",
      familyContactPhone: "",
      familyContactEmail: "",
      familyContactRelation: "familiar",
      serviceType: "sepultamento",
      casketType: "",
      additionalServices: [],
      notes: "",
      totalAmountBRL: 2500,
      paidAmountBRL: 0,
      paymentMethod: "pix",
      status: "em_andamento"
    });
    setActiveModal("service");
  };

  const openCreateSchedule = () => {
    setEditingItem(null);
    setScheduleForm({
      deceasedName: "",
      type: "velorio",
      dateTime: "",
      location: "",
      address: "",
      notes: "",
      assignedStaff: [],
      status: "agendado"
    });
    setActiveModal("schedule");
  };

  const openCreateInventory = () => {
    setEditingItem(null);
    setInventoryForm({
      name: "",
      category: "urna",
      description: "",
      quantity: 5,
      minQuantity: 2,
      unitPriceBRL: 1200,
      costPriceBRL: 400,
      status: "disponivel"
    });
    setActiveModal("inventory");
  };

  const openCreateStaff = () => {
    setEditingItem(null);
    setStaffForm({
      name: "",
      role: "cerimonialista",
      phone: "",
      email: "",
      commissionPercent: 5,
      schedule: "integral",
      isActive: true
    });
    setActiveModal("staff");
  };

  const openCreateDocument = () => {
    setEditingItem(null);
    setDocumentForm({
      serviceId: "",
      type: "certidao_obito",
      documentNumber: "",
      issuer: "Cartório de Registro Civil",
      issueDate: new Date().toISOString().slice(0, 10),
      expiryDate: "",
      status: "pendente",
      notes: ""
    });
    setActiveModal("document");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0f0f] flex items-center justify-center">
        <div className="text-center text-on-surface">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tertiary mx-auto mb-4"></div>
          <p className="text-on-surface-variant font-medium">Carregando painel de gestão...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0b0f0f] flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-xl border border-red-500/20 bg-[#101414] p-8 text-center shadow-xl">
          <span className="material-symbols-outlined text-red-400 text-5xl mb-4">error</span>
          <p className="text-red-400 mb-6 font-medium">{error || "Erro ao carregar dados."}</p>
          <Link
            href="/funeraria/login"
            className="w-full rounded-lg bg-tertiary px-6 py-3 text-sm font-semibold text-on-tertiary hover:bg-tertiary/90 transition inline-block shadow-md"
          >
            Fazer login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#101414] to-[#0b0f0f] flex flex-col md:flex-row text-on-surface">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#101414] border-b md:border-b-0 md:border-r border-outline-variant/20 flex flex-col shrink-0">
        <div className="p-6 border-b border-outline-variant/10">
          <p className="text-[0.6rem] uppercase tracking-[0.2em] text-tertiary font-bold">Sistema de Gestão Funerária</p>
          <h2 className="font-h3 text-lg text-on-surface mt-1 font-semibold truncate" title={data.funeralHome.name}>
            {data.funeralHome.name}
          </h2>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-on-surface-variant">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            Painel ERP Conectado
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {(
            [
              { id: "overview", label: "Visão Geral", icon: "dashboard" },
              { id: "memorials", label: "QR Memoriais", icon: "qr_code_2" },
              { id: "services", label: "Atendimentos/Contratos", icon: "receipt_long" },
              { id: "schedules", label: "Agenda & Capelas", icon: "calendar_month" },
              { id: "inventory", label: "Estoque & Urnas", icon: "inventory_2" },
              { id: "staff", label: "Equipe & Escalas", icon: "groups" },
              { id: "documents", label: "Certidões & Alvarás", icon: "description" },
              { id: "financial", label: "Financeiro & Pedidos", icon: "payments" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-tertiary/10 text-tertiary border-l-4 border-tertiary"
                  : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-outline-variant/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-outline-variant/30 px-4 py-2.5 text-xs font-semibold text-on-surface-variant hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* Dynamic header details based on Active Tab */}
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/10 pb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-tertiary font-medium">Módulo Operacional</p>
            <h1 className="font-h2 text-3xl font-bold mt-1 text-on-surface capitalize">
              {activeTab === "overview" && "Visão Geral"}
              {activeTab === "memorials" && "Gerenciamento de Memoriais QR"}
              {activeTab === "services" && "Atendimentos e Contratos Funerários"}
              {activeTab === "schedules" && "Agenda de Velórios e Cerimônias"}
              {activeTab === "inventory" && "Controle de Estoque e Artigos"}
              {activeTab === "staff" && "Gestão de Equipe e Escalas"}
              {activeTab === "documents" && "Central de Documentação"}
              {activeTab === "financial" && "Controle Financeiro"}
            </h1>
          </div>
          
          {/* Quick Action Button in Header */}
          <div className="flex gap-2 shrink-0">
            {activeTab === "memorials" && (
              <Link
                href="/funeraria/dashboard/novo-memorial"
                className="rounded-lg bg-tertiary px-5 py-2.5 text-sm font-semibold text-on-tertiary hover:bg-tertiary/90 transition flex items-center gap-2 shadow-md"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Novo Memorial
              </Link>
            )}
            {activeTab === "services" && (
              <button
                onClick={openCreateService}
                className="rounded-lg bg-tertiary px-5 py-2.5 text-sm font-semibold text-on-tertiary hover:bg-tertiary/90 transition flex items-center gap-2 shadow-md"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Registrar Atendimento
              </button>
            )}
            {activeTab === "schedules" && (
              <button
                onClick={openCreateSchedule}
                className="rounded-lg bg-tertiary px-5 py-2.5 text-sm font-semibold text-on-tertiary hover:bg-tertiary/90 transition flex items-center gap-2 shadow-md"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Agendar Cerimônia
              </button>
            )}
            {activeTab === "inventory" && (
              <button
                onClick={openCreateInventory}
                className="rounded-lg bg-tertiary px-5 py-2.5 text-sm font-semibold text-on-tertiary hover:bg-tertiary/90 transition flex items-center gap-2 shadow-md"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Novo Artigo
              </button>
            )}
            {activeTab === "staff" && (
              <button
                onClick={openCreateStaff}
                className="rounded-lg bg-tertiary px-5 py-2.5 text-sm font-semibold text-on-tertiary hover:bg-tertiary/90 transition flex items-center gap-2 shadow-md"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Novo Funcionário
              </button>
            )}
            {activeTab === "documents" && (
              <button
                onClick={openCreateDocument}
                className="rounded-lg bg-tertiary px-5 py-2.5 text-sm font-semibold text-on-tertiary hover:bg-tertiary/90 transition flex items-center gap-2 shadow-md"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Emitir Documento
              </button>
            )}
          </div>
        </header>

        {/* 1. Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8 fade-rise">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon="favorite"
                label="Total de Memoriais"
                value={data.stats.totalMemorials.toString()}
              />
              <StatCard
                icon="check_circle"
                label="Memoriais Ativos"
                value={data.stats.activeMemorials.toString()}
                color="green"
              />
              <StatCard
                icon="hourglass_empty"
                label="Pagamentos Pendentes"
                value={data.stats.pendingMemorials.toString()}
                color="yellow"
              />
              <StatCard
                icon="payments"
                label="Receita de Memoriais"
                value={centsToBRL(data.stats.totalRevenue)}
                color="tertiary"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-outline-variant/20 bg-[#101414] p-6 shadow-lg">
                <h2 className="font-h3 text-lg text-on-surface mb-4 font-semibold flex items-center gap-2 border-b border-outline-variant/10 pb-2">
                  <span className="material-symbols-outlined text-tertiary">info</span>
                  Dados da Funerária
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 text-sm">
                  <InfoRow label="Responsável" value={data.funeralHome.contactName} />
                  <InfoRow label="E-mail Corporativo" value={data.funeralHome.email} />
                  <InfoRow label="Telefone de Plantão" value={data.funeralHome.phone} />
                  {data.funeralHome.cnpj && <InfoRow label="CNPJ" value={data.funeralHome.cnpj} />}
                  <InfoRow
                    label="Município / Estado"
                    value={[data.funeralHome.city, data.funeralHome.state].filter(Boolean).join(" - ") || "Não informado"}
                  />
                  <InfoRow
                    label="Parceria Homologada em"
                    value={new Date(data.funeralHome.createdAt).toLocaleDateString("pt-BR")}
                  />
                </div>
              </div>

              {/* ERP Quick Insights */}
              <div className="rounded-xl border border-outline-variant/20 bg-[#101414] p-6 shadow-lg">
                <h2 className="font-h3 text-lg text-on-surface mb-4 font-semibold flex items-center gap-2 border-b border-outline-variant/10 pb-2">
                  <span className="material-symbols-outlined text-tertiary">analytics</span>
                  Atividades Recentes e Alertas
                </h2>
                <div className="space-y-4 text-sm text-on-surface-variant">
                  <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/5">
                    <span className="material-symbols-outlined text-green-400">volunteer_activism</span>
                    <div>
                      <p className="text-xs text-outline">Operacional</p>
                      <p className="text-on-surface font-medium">Use as abas laterais para gerir Atendimentos, Cerimônias e Estoques em tempo real.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/5">
                    <span className="material-symbols-outlined text-yellow-400">warning</span>
                    <div>
                      <p className="text-xs text-outline">Estoque</p>
                      <p className="text-on-surface font-medium">Monitore artigos abaixo do estoque mínimo de segurança no painel &quot;Estoque&quot;.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/5">
                    <span className="material-symbols-outlined text-tertiary">description</span>
                    <div>
                      <p className="text-xs text-outline">Documental</p>
                      <p className="text-on-surface font-medium">Emita certidões de óbito vinculadas aos contratos funerários na aba &quot;Documentos&quot;.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {data.memorials.length > 0 && (
              <div className="rounded-xl border border-outline-variant/20 bg-[#101414] p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4 border-b border-outline-variant/10 pb-2">
                  <h2 className="font-h3 text-lg text-on-surface font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary">history</span>
                    Últimos Memoriais Criados
                  </h2>
                  <button
                    onClick={() => setActiveTab("memorials")}
                    className="text-xs text-tertiary hover:underline font-semibold"
                  >
                    Ver todos
                  </button>
                </div>
                <div className="space-y-3">
                  {data.memorials.slice(0, 3).map((memorial) => (
                    <MemorialRow key={memorial.id} memorial={memorial} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Memorials Tab */}
        {activeTab === "memorials" && (
          <div className="space-y-6 fade-rise">
            {data.memorials.length === 0 ? (
              <div className="rounded-xl border border-dashed border-outline-variant/30 p-12 text-center bg-white/5">
                <span className="material-symbols-outlined text-5xl text-outline mb-3 block">favorite</span>
                <p className="text-on-surface-variant mb-6 font-medium">Nenhum memorial QR cadastrado ainda para esta funerária.</p>
                <Link
                  href="/funeraria/dashboard/novo-memorial"
                  className="rounded-lg bg-tertiary px-6 py-3 text-sm font-semibold text-on-tertiary hover:bg-tertiary/90 transition inline-block shadow-md"
                >
                  Cadastrar Primeiro Memorial
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {data.memorials.map((memorial) => (
                  <MemorialRow key={memorial.id} memorial={memorial} detailed />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. Services Tab */}
        {activeTab === "services" && (
          <div className="space-y-6 fade-rise">
            {loadingServices ? (
              <div className="py-12 text-center text-on-surface-variant">Carregando atendimentos...</div>
            ) : services.length === 0 ? (
              <div className="rounded-xl border border-dashed border-outline-variant/30 p-12 text-center bg-white/5">
                <span className="material-symbols-outlined text-5xl text-outline mb-3 block">receipt_long</span>
                <p className="text-on-surface-variant mb-6">Nenhum atendimento ou contrato funerário registrado ainda.</p>
                <button
                  onClick={openCreateService}
                  className="rounded-lg bg-tertiary px-6 py-3 text-sm font-semibold text-on-tertiary hover:bg-tertiary/90 transition inline-block shadow-md"
                >
                  Registrar Novo Atendimento
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {services.map((svc) => {
                  const balance = (svc.totalAmountCents - svc.paidAmountCents) / 100;
                  const isPaid = balance <= 0;
                  return (
                    <div key={svc.id} className="rounded-xl border border-outline-variant/20 bg-[#101414] p-6 shadow-md hover:border-tertiary/30 transition">
                      <div className="flex flex-col lg:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-tertiary">sentiment_very_dissatisfied</span>
                            <h3 className="font-semibold text-lg text-on-surface">{svc.deceasedName}</h3>
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              svc.status === 'em_andamento' ? 'bg-yellow-500/20 text-yellow-400' :
                              svc.status === 'concluido' ? 'bg-green-500/20 text-green-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {svc.status === 'em_andamento' ? 'Em Andamento' :
                               svc.status === 'concluido' ? 'Concluído' : 'Cancelado'}
                            </span>
                            <span className="rounded bg-white/5 px-2 py-0.5 text-xs text-outline uppercase">{svc.serviceType}</span>
                          </div>
                          
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs text-on-surface-variant mt-3 border-t border-white/5 pt-3">
                            <div>
                              <p className="text-outline uppercase tracking-wider">Óbito</p>
                              <p className="font-medium text-on-surface">{new Date(svc.deceasedDeathDate).toLocaleDateString("pt-BR")}</p>
                            </div>
                            {svc.deceasedCauseOfDeath && (
                              <div>
                                <p className="text-outline uppercase tracking-wider">Causa Mortis</p>
                                <p className="font-medium text-on-surface truncate" title={svc.deceasedCauseOfDeath}>{svc.deceasedCauseOfDeath}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-outline uppercase tracking-wider">Família / Contato</p>
                              <p className="font-medium text-on-surface">{svc.familyContactName} ({svc.familyContactRelation})</p>
                              <p className="text-outline">{svc.familyContactPhone}</p>
                            </div>
                          </div>

                          {svc.notes && (
                            <p className="text-xs text-on-surface-variant mt-2 italic bg-white/5 p-2 rounded">
                              Nota: {svc.notes}
                            </p>
                          )}
                        </div>

                        <div className="w-full lg:w-64 border-t lg:border-t-0 lg:border-l border-outline-variant/10 pt-4 lg:pt-0 lg:pl-6 flex flex-col justify-between items-end">
                          <div className="text-right w-full">
                            <p className="text-xs text-outline uppercase tracking-wider">Contrato Funerário</p>
                            <p className="text-xl font-bold text-on-surface mt-1">{centsToBRL(svc.totalAmountCents)}</p>
                            <div className="mt-1 flex items-center justify-end gap-1.5 text-xs">
                              <span className={`inline-block h-2 w-2 rounded-full ${isPaid ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                              <span className={isPaid ? 'text-green-400' : 'text-yellow-400'}>
                                {isPaid ? 'Totalmente Pago' : `Falta pagar ${centsToBRL(balance * 100)}`}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4 w-full justify-end">
                            <button
                              onClick={() => openEditService(svc)}
                              className="rounded-lg border border-outline-variant/30 px-3 py-1.5 text-xs text-on-surface hover:bg-white/5 hover:border-tertiary/50 transition flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-xs">edit</span>
                              Editar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 4. Schedules Tab */}
        {activeTab === "schedules" && (
          <div className="space-y-6 fade-rise">
            {loadingSchedules ? (
              <div className="py-12 text-center text-on-surface-variant">Carregando cronograma...</div>
            ) : schedules.length === 0 ? (
              <div className="rounded-xl border border-dashed border-outline-variant/30 p-12 text-center bg-white/5">
                <span className="material-symbols-outlined text-5xl text-outline mb-3 block">calendar_month</span>
                <p className="text-on-surface-variant mb-6">Nenhum velório, cerimônia ou sepultamento agendado.</p>
                <button
                  onClick={openCreateSchedule}
                  className="rounded-lg bg-tertiary px-6 py-3 text-sm font-semibold text-on-tertiary hover:bg-tertiary/90 transition inline-block shadow-md"
                >
                  Agendar Primeira Cerimônia
                </button>
              </div>
            ) : (
              <div className="relative border-l border-tertiary/20 pl-6 ml-4 space-y-6">
                {schedules.map((sch) => {
                  const eventDate = new Date(sch.dateTime);
                  return (
                    <div key={sch.id} className="relative bg-[#101414] border border-outline-variant/20 rounded-xl p-5 hover:border-tertiary/30 transition shadow-sm">
                      {/* Timeline dot */}
                      <span className="absolute -left-[33px] top-6 h-4.5 w-4.5 rounded-full border-4 border-[#0b0f0f] bg-tertiary"></span>
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                            <span className="material-symbols-outlined text-tertiary text-lg">schedule</span>
                            <span className="font-semibold text-tertiary text-sm">
                              {eventDate.toLocaleDateString("pt-BR")} às {eventDate.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="uppercase text-[0.65rem] tracking-wider rounded bg-white/10 px-2 py-0.5 text-on-surface-variant">
                              {sch.type}
                            </span>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                              sch.status === 'agendado' ? 'bg-blue-500/20 text-blue-400' :
                              sch.status === 'em_andamento' ? 'bg-yellow-500/20 text-yellow-400' :
                              sch.status === 'concluido' ? 'bg-green-500/20 text-green-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {sch.status === 'agendado' ? 'Agendado' :
                               sch.status === 'em_andamento' ? 'Em Andamento' :
                               sch.status === 'concluido' ? 'Concluído' : 'Cancelado'}
                            </span>
                          </div>

                          <h3 className="font-semibold text-lg text-on-surface mt-1">Homenageado: {sch.deceasedName}</h3>
                          
                          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mt-2">
                            <span className="material-symbols-outlined text-xs">location_on</span>
                            <span>Local: <strong>{sch.location}</strong></span>
                            {sch.address && <span className="text-outline">({sch.address})</span>}
                          </div>

                          {sch.assignedStaff && sch.assignedStaff.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1 mt-3">
                              <span className="text-xs text-outline uppercase tracking-wider mr-1">Equipe Designada:</span>
                              {sch.assignedStaff.map((staffName, idx) => (
                                <span key={idx} className="text-xs bg-white/5 rounded-full px-2.5 py-0.5 text-on-surface-variant border border-outline-variant/10">
                                  {staffName}
                                </span>
                              ))}
                            </div>
                          )}

                          {sch.notes && (
                            <p className="text-xs text-on-surface-variant italic mt-2 bg-white/5 p-2 rounded max-w-xl">
                              Orientações: {sch.notes}
                            </p>
                          )}
                        </div>

                        <div className="sm:text-right shrink-0">
                          <button
                            onClick={() => openEditSchedule(sch)}
                            className="rounded-lg border border-outline-variant/30 px-3 py-1.5 text-xs text-on-surface hover:bg-white/5 hover:border-tertiary/50 transition flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-xs">edit</span>
                            Editar Agendamento
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 5. Inventory Tab */}
        {activeTab === "inventory" && (
          <div className="space-y-6 fade-rise">
            {loadingInventory ? (
              <div className="py-12 text-center text-on-surface-variant">Carregando estoque...</div>
            ) : inventory.length === 0 ? (
              <div className="rounded-xl border border-dashed border-outline-variant/30 p-12 text-center bg-white/5">
                <span className="material-symbols-outlined text-5xl text-outline mb-3 block">inventory_2</span>
                <p className="text-on-surface-variant mb-6">Nenhum artigo funerário no estoque ainda.</p>
                <button
                  onClick={openCreateInventory}
                  className="rounded-lg bg-tertiary px-6 py-3 text-sm font-semibold text-on-tertiary hover:bg-tertiary/90 transition inline-block shadow-md"
                >
                  Adicionar Item de Estoque
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {inventory.map((item) => {
                  const isLowStock = item.quantity <= item.minQuantity;
                  const isOut = item.quantity === 0;
                  return (
                    <div key={item.id} className="rounded-xl border border-outline-variant/20 bg-[#101414] overflow-hidden flex flex-col justify-between shadow-md">
                      <div className="p-5">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <span className="uppercase text-[0.6rem] tracking-wider font-bold rounded bg-tertiary/10 text-tertiary px-2 py-0.5">
                            {item.category}
                          </span>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            isOut ? 'bg-red-500/20 text-red-400' :
                            isLowStock ? 'bg-yellow-500/20 text-yellow-400 animate-pulse' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {isOut ? 'Esgotado' : isLowStock ? 'Estoque Baixo' : 'Disponível'}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg text-on-surface line-clamp-1">{item.name}</h3>
                        {item.description && (
                          <p className="text-xs text-on-surface-variant mt-1.5 line-clamp-2">{item.description}</p>
                        )}

                        <div className="grid grid-cols-2 gap-3 mt-4 border-t border-white/5 pt-3 text-xs">
                          <div>
                            <p className="text-outline uppercase">Preço Venda</p>
                            <p className="font-bold text-on-surface text-sm">{centsToBRL(item.unitPriceCents)}</p>
                          </div>
                          {item.costPriceCents && (
                            <div>
                              <p className="text-outline uppercase">Custo Unitário</p>
                              <p className="font-medium text-on-surface-variant">{centsToBRL(item.costPriceCents)}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Stock Quantity Controls */}
                      <div className="bg-white/3 p-4 border-t border-outline-variant/10 flex items-center justify-between gap-3 text-sm">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-outline mr-1">Qtd:</span>
                          <strong className={`text-base ${isLowStock ? 'text-yellow-400' : 'text-on-surface'}`}>
                            {item.quantity}
                          </strong>
                          <span className="text-[0.65rem] text-outline">/ mín: {item.minQuantity}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleInventoryQuantityChange(item, -1)}
                            className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-on-surface active:scale-95 transition"
                            title="Remover 1 unidade"
                          >
                            <span className="material-symbols-outlined text-sm">remove</span>
                          </button>
                          <button
                            onClick={() => handleInventoryQuantityChange(item, 1)}
                            className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-on-surface active:scale-95 transition"
                            title="Adicionar 1 unidade"
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                          </button>
                          <button
                            onClick={() => openEditInventory(item)}
                            className="h-8 w-8 rounded-lg border border-outline-variant/30 hover:border-tertiary/50 hover:bg-white/5 flex items-center justify-center text-on-surface transition ml-1"
                            title="Editar artigo"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 6. Staff Tab */}
        {activeTab === "staff" && (
          <div className="space-y-6 fade-rise">
            {loadingStaff ? (
              <div className="py-12 text-center text-on-surface-variant">Carregando equipe...</div>
            ) : staff.length === 0 ? (
              <div className="rounded-xl border border-dashed border-outline-variant/30 p-12 text-center bg-white/5">
                <span className="material-symbols-outlined text-5xl text-outline mb-3 block">groups</span>
                <p className="text-on-surface-variant mb-6">Nenhum colaborador ou funcionário cadastrado.</p>
                <button
                  onClick={openCreateStaff}
                  className="rounded-lg bg-tertiary px-6 py-3 text-sm font-semibold text-on-tertiary hover:bg-tertiary/90 transition inline-block shadow-md"
                >
                  Cadastrar Colaborador
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {staff.map((member) => (
                  <div key={member.id} className="rounded-xl border border-outline-variant/20 bg-[#101414] p-5 flex flex-col justify-between shadow-md">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <span className="material-symbols-outlined text-tertiary text-2xl">support_agent</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          member.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {member.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>

                      <h3 className="font-semibold text-lg text-on-surface">{member.name}</h3>
                      <p className="text-xs uppercase tracking-wider text-tertiary font-medium mt-0.5">{member.role}</p>

                      <div className="mt-4 space-y-2 text-xs text-on-surface-variant border-t border-white/5 pt-3">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-xs">phone</span>
                          <span>{member.phone}</span>
                        </div>
                        {member.email && (
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="material-symbols-outlined text-xs">mail</span>
                            <span className="truncate" title={member.email}>{member.email}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-xs">schedule</span>
                          <span>Escala: <strong className="text-on-surface capitalize">{member.schedule}</strong></span>
                        </div>
                        {typeof member.commissionPercent === "number" && (
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-xs">percent</span>
                            <span>Comissão de Atendimento: <strong>{member.commissionPercent}%</strong></span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/5 flex gap-2 justify-end">
                      <button
                        onClick={() => handleToggleStaff(member)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                          member.isActive
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                            : 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'
                        }`}
                      >
                        {member.isActive ? 'Desativar' : 'Reativar'}
                      </button>
                      <button
                        onClick={() => openEditStaff(member)}
                        className="rounded-lg border border-outline-variant/30 px-3 py-1.5 text-xs text-on-surface hover:bg-white/5 hover:border-tertiary/50 transition flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-xs">edit</span>
                        Editar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 7. Documents Tab */}
        {activeTab === "documents" && (
          <div className="space-y-6 fade-rise">
            {loadingDocuments ? (
              <div className="py-12 text-center text-on-surface-variant">Carregando documentos...</div>
            ) : documents.length === 0 ? (
              <div className="rounded-xl border border-dashed border-outline-variant/30 p-12 text-center bg-white/5">
                <span className="material-symbols-outlined text-5xl text-outline mb-3 block">description</span>
                <p className="text-on-surface-variant mb-6">Nenhuma certidão, autorização ou alvará registrado.</p>
                <button
                  onClick={openCreateDocument}
                  className="rounded-lg bg-tertiary px-6 py-3 text-sm font-semibold text-on-tertiary hover:bg-tertiary/90 transition inline-block shadow-md"
                >
                  Emitir Primeiro Documento
                </button>
              </div>
            ) : (
              <div className="bg-[#101414] border border-outline-variant/20 rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-outline-variant/30 text-outline bg-white/3">
                        <th className="p-4 font-normal">Tipo</th>
                        <th className="p-4 font-normal">Nº do Registro</th>
                        <th className="p-4 font-normal">Órgão Emissor</th>
                        <th className="p-4 font-normal">Emissão</th>
                        <th className="p-4 font-normal">Vencimento</th>
                        <th className="p-4 font-normal text-center">Status</th>
                        <th className="p-4 font-normal text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc) => (
                        <tr key={doc.id} className="border-b border-outline-variant/10 hover:bg-white/1 text-xs">
                          <td className="p-4 font-semibold text-on-surface flex items-center gap-2">
                            <span className="material-symbols-outlined text-tertiary text-base">article</span>
                            <span className="capitalize">{doc.type.replace('_', ' ')}</span>
                          </td>
                          <td className="p-4 text-on-surface-variant font-mono">
                            {doc.documentNumber || "Não Informado"}
                          </td>
                          <td className="p-4 text-on-surface-variant">
                            {doc.issuer || "—"}
                          </td>
                          <td className="p-4 text-on-surface-variant">
                            {new Date(doc.issueDate).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="p-4 text-on-surface-variant">
                            {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString("pt-BR") : "Indeterminado"}
                          </td>
                          <td className="p-4 text-center">
                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              doc.status === 'valido' || doc.status === 'emitido' ? 'bg-green-500/20 text-green-400' :
                              doc.status === 'pendente' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {doc.status === 'valido' ? 'Válido' :
                               doc.status === 'emitido' ? 'Emitido' :
                               doc.status === 'pendente' ? 'Pendente' : 'Expirado'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => openEditDocument(doc)}
                              className="rounded bg-white/5 border border-outline-variant/20 hover:border-tertiary/50 hover:bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-on-surface transition"
                            >
                              Editar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 8. Financial Tab */}
        {activeTab === "financial" && (
          <div className="space-y-6 fade-rise">
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                icon="check_circle"
                label="Pagamentos Confirmados"
                value={data.stats.totalPaid.toString()}
                color="green"
              />
              <StatCard
                icon="hourglass_empty"
                label="Pagamentos Pendentes"
                value={data.stats.totalPending.toString()}
                color="yellow"
              />
              <StatCard
                icon="payments"
                label="Receita de Memoriais"
                value={centsToBRL(data.stats.totalRevenue)}
                color="tertiary"
              />
            </div>

            <div className="rounded-xl border border-outline-variant/20 bg-[#101414] p-6 shadow-lg">
              <h2 className="font-h3 text-lg text-on-surface mb-4 font-semibold flex items-center gap-2 border-b border-outline-variant/10 pb-2">
                <span className="material-symbols-outlined text-tertiary">history_edu</span>
                Histórico de Pedidos e Comissionamentos QR
              </h2>
              {data.orders.length === 0 ? (
                <div className="rounded-lg border border-dashed border-outline-variant/30 p-8 text-center text-on-surface-variant">
                  Nenhum pedido de memorial faturado ou registrado ainda.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-outline-variant/30 text-outline">
                        <th className="pb-3 font-normal">Data</th>
                        <th className="pb-3 font-normal">Comprador</th>
                        <th className="pb-3 font-normal">Canal / Payer</th>
                        <th className="pb-3 font-normal">Método</th>
                        <th className="pb-3 text-right font-normal">Valor</th>
                        <th className="pb-3 text-center font-normal">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.orders.map((order) => {
                        return (
                          <tr key={order.id} className="border-b border-outline-variant/10">
                            <td className="py-3 text-on-surface-variant text-xs">
                              {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                            </td>
                            <td className="py-3 text-on-surface">
                              <p className="font-medium text-xs sm:text-sm">{order.userName}</p>
                              <p className="text-[0.65rem] text-outline font-mono truncate max-w-[180px] sm:max-w-none">{order.userEmail}</p>
                            </td>
                            <td className="py-3 text-on-surface-variant text-xs">
                              <span className="uppercase text-[0.6rem] font-bold bg-white/5 border border-white/10 px-1.5 py-0.5 rounded mr-1.5">
                                {order.source || "Geral"}
                              </span>
                              {order.payerType === "family" ? "Família" : "Funerária"}
                            </td>
                            <td className="py-3 text-on-surface-variant text-xs uppercase font-mono">
                              {order.paymentMethod}
                            </td>
                            <td className="py-3 text-right text-on-surface font-semibold font-mono">
                              {centsToBRL(order.grossAmountCents)}
                            </td>
                            <td className="py-3 text-center">
                              <span
                                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                  order.status === "paid"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                                }`}
                              >
                                {order.status === "paid" ? "Pago" : "Pendente"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ──────────────────────────────────────────────────────────────────────────────── */}
      {/* ERP DIALOG MODALS SECTION */}
      {/* ──────────────────────────────────────────────────────────────────────────────── */}
      
      {/* Modal 1: ATENDIMENTO / SERVIÇO */}
      {activeModal === "service" && (
        <div className="fixed inset-0 z-50 bg-[#000000aa] backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101414] border border-outline-variant/30 rounded-xl max-w-2xl w-full max-h-[90dvh] overflow-y-auto shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-white/2">
              <h2 className="font-h3 text-xl text-on-surface font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">receipt_long</span>
                {editingItem ? "Editar Contrato Funerário" : "Registrar Contrato Funerário"}
              </h2>
              <button
                onClick={() => { setActiveModal(null); setEditingItem(null); }}
                className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleServiceSubmit} className="p-6 space-y-6">
              {formError && <p className="text-red-400 text-sm font-medium bg-red-500/10 p-3 rounded">{formError}</p>}
              
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider text-tertiary font-bold border-b border-white/5 pb-1">1. Informações do Falecido</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-outline mb-1 font-semibold uppercase">Nome Completo</label>
                    <input
                      type="text"
                      required
                      value={serviceForm.deceasedName}
                      onChange={(e) => setServiceForm({ ...serviceForm, deceasedName: e.target.value })}
                      placeholder="Ex: João da Silva Santos"
                      className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-outline mb-1 font-semibold uppercase">Data Nascimento</label>
                    <input
                      type="date"
                      value={serviceForm.deceasedBirthDate}
                      onChange={(e) => setServiceForm({ ...serviceForm, deceasedBirthDate: e.target.value })}
                      className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-outline mb-1 font-semibold uppercase">Data do Óbito</label>
                    <input
                      type="date"
                      required
                      value={serviceForm.deceasedDeathDate}
                      onChange={(e) => setServiceForm({ ...serviceForm, deceasedDeathDate: e.target.value })}
                      className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-outline mb-1 font-semibold uppercase">Causa da Morte</label>
                    <input
                      type="text"
                      value={serviceForm.deceasedCauseOfDeath}
                      onChange={(e) => setServiceForm({ ...serviceForm, deceasedCauseOfDeath: e.target.value })}
                      placeholder="Ex: Insuficiência Cardíaca"
                      className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-outline mb-1 font-semibold uppercase">CPF / RG ou Declaração Óbito</label>
                    <input
                      type="text"
                      value={serviceForm.deceasedDocumentNumber}
                      onChange={(e) => setServiceForm({ ...serviceForm, deceasedDocumentNumber: e.target.value })}
                      placeholder="Nº Registro"
                      className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider text-tertiary font-bold border-b border-white/5 pb-1">2. Informações de Contrato e Família</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs text-outline mb-1 font-semibold uppercase">Representante Familiar</label>
                    <input
                      type="text"
                      required
                      value={serviceForm.familyContactName}
                      onChange={(e) => setServiceForm({ ...serviceForm, familyContactName: e.target.value })}
                      placeholder="Nome do familiar declarante"
                      className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-outline mb-1 font-semibold uppercase">Telefone de Contato</label>
                    <input
                      type="text"
                      required
                      value={serviceForm.familyContactPhone}
                      onChange={(e) => setServiceForm({ ...serviceForm, familyContactPhone: e.target.value })}
                      placeholder="(99) 99999-9999"
                      className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-outline mb-1 font-semibold uppercase">E-mail (Opcional)</label>
                    <input
                      type="email"
                      value={serviceForm.familyContactEmail}
                      onChange={(e) => setServiceForm({ ...serviceForm, familyContactEmail: e.target.value })}
                      placeholder="familiar@email.com"
                      className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-outline mb-1 font-semibold uppercase">Parentesco</label>
                    <input
                      type="text"
                      value={serviceForm.familyContactRelation}
                      onChange={(e) => setServiceForm({ ...serviceForm, familyContactRelation: e.target.value })}
                      placeholder="Ex: Filho, Cônjuge, Irmão"
                      className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider text-tertiary font-bold border-b border-white/5 pb-1">3. Serviços e Faturamento</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs text-outline mb-1 font-semibold uppercase">Modalidade do Serviço</label>
                    <select
                      value={serviceForm.serviceType}
                      onChange={(e) => setServiceForm({ ...serviceForm, serviceType: e.target.value as 'sepultamento' | 'cremacao' | 'translado' | 'preparacao' })}
                      className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                    >
                      <option value="sepultamento">Sepultamento</option>
                      <option value="cremacao">Cremação</option>
                      <option value="translado">Translado</option>
                      <option value="preparacao">Preparação (Tanatopraxia)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-outline mb-1 font-semibold uppercase">Modelo da Urna (Casket)</label>
                    <input
                      type="text"
                      value={serviceForm.casketType}
                      onChange={(e) => setServiceForm({ ...serviceForm, casketType: e.target.value })}
                      placeholder="Ex: Urna Real Imperial"
                      className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-outline mb-1 font-semibold uppercase">Valor Total do Contrato (R$)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      step="0.01"
                      value={serviceForm.totalAmountBRL}
                      onChange={(e) => setServiceForm({ ...serviceForm, totalAmountBRL: Number(e.target.value) })}
                      className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-outline mb-1 font-semibold uppercase">Valor Pago na Entrada (R$)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      step="0.01"
                      value={serviceForm.paidAmountBRL}
                      onChange={(e) => setServiceForm({ ...serviceForm, paidAmountBRL: Number(e.target.value) })}
                      className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-outline mb-1 font-semibold uppercase">Método Pagamento</label>
                    <select
                      value={serviceForm.paymentMethod}
                      onChange={(e) => setServiceForm({ ...serviceForm, paymentMethod: e.target.value as 'pix' | 'card' | 'boleto' | 'cash' | 'installment' })}
                      className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                    >
                      <option value="pix">Pix</option>
                      <option value="card">Cartão Crédito / Débito</option>
                      <option value="boleto">Boleto Bancário</option>
                      <option value="cash">Dinheiro em Espécie</option>
                      <option value="installment">Carnê / Parcelado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-outline mb-1 font-semibold uppercase">Status de Andamento</label>
                    <select
                      value={serviceForm.status}
                      onChange={(e) => setServiceForm({ ...serviceForm, status: e.target.value as 'em_andamento' | 'concluido' | 'cancelado' })}
                      className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                    >
                      <option value="em_andamento">Em Andamento</option>
                      <option value="concluido">Concluído</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-outline mb-1 font-semibold uppercase">Observações Operacionais</label>
                    <textarea
                      value={serviceForm.notes}
                      onChange={(e) => setServiceForm({ ...serviceForm, notes: e.target.value })}
                      placeholder="Detalhes adicionais do velório, ornamentação, flores etc."
                      rows={2}
                      className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setActiveModal(null); setEditingItem(null); }}
                  className="rounded-lg border border-outline-variant/30 px-5 py-2.5 text-sm text-on-surface-variant hover:bg-white/5 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submittingForm}
                  className="rounded-lg bg-tertiary px-6 py-2.5 text-sm font-semibold text-on-tertiary hover:bg-tertiary/90 transition shadow-md disabled:opacity-50"
                >
                  {submittingForm ? "Gravando..." : "Salvar Contrato"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: AGENDA / CERIMÔNIA */}
      {activeModal === "schedule" && (
        <div className="fixed inset-0 z-50 bg-[#000000aa] backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101414] border border-outline-variant/30 rounded-xl max-w-lg w-full max-h-[90dvh] overflow-y-auto shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-white/2">
              <h2 className="font-h3 text-xl text-on-surface font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">calendar_month</span>
                {editingItem ? "Editar Agendamento" : "Novo Agendamento"}
              </h2>
              <button
                onClick={() => { setActiveModal(null); setEditingItem(null); }}
                className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4">
              {formError && <p className="text-red-400 text-sm font-medium bg-red-500/10 p-3 rounded">{formError}</p>}
              
              <div>
                <label className="block text-xs text-outline mb-1 font-semibold uppercase">De cujus (Falecido)</label>
                <input
                  type="text"
                  required
                  value={scheduleForm.deceasedName}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, deceasedName: e.target.value })}
                  placeholder="Nome do falecido"
                  className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs text-outline mb-1 font-semibold uppercase">Tipo do Evento</label>
                  <select
                    value={scheduleForm.type}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, type: e.target.value as 'velorio' | 'cerimonia' | 'sepultamento' | 'cremacao' | 'translado' })}
                    className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                  >
                    <option value="velorio">Velório</option>
                    <option value="cerimonia">Cerimônia de Despedida</option>
                    <option value="sepultamento">Sepultamento</option>
                    <option value="cremacao">Cremação</option>
                    <option value="translado">Translado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-outline mb-1 font-semibold uppercase">Data e Hora</label>
                  <input
                    type="datetime-local"
                    required
                    value={scheduleForm.dateTime}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, dateTime: e.target.value })}
                    className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-outline mb-1 font-semibold uppercase">Capela / Localização Interna</label>
                <input
                  type="text"
                  required
                  value={scheduleForm.location}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
                  placeholder="Ex: Capela A, Sala Safira, Crematório Central"
                  className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-outline mb-1 font-semibold uppercase">Endereço (opcional se for interno)</label>
                <input
                  type="text"
                  value={scheduleForm.address}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, address: e.target.value })}
                  placeholder="Endereço caso seja externo"
                  className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-outline mb-1 font-semibold uppercase">Status</label>
                <select
                  value={scheduleForm.status}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, status: e.target.value as 'agendado' | 'em_andamento' | 'concluido' | 'cancelado' })}
                  className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                >
                  <option value="agendado">Agendado</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="concluido">Concluído</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              {/* Staff Assignments Selector */}
              {staff.length > 0 && (
                <div>
                  <label className="block text-xs text-outline mb-1.5 font-semibold uppercase">Designar Equipe de Plantão</label>
                  <div className="bg-white/3 border border-outline-variant/50 rounded-lg p-3 max-h-32 overflow-y-auto space-y-2">
                    {staff.filter(s => s.isActive).map((member) => {
                      const isChecked = scheduleForm.assignedStaff.includes(member.name);
                      return (
                        <label key={member.id} className="flex items-center gap-2 text-xs text-on-surface-variant cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              const updated = isChecked
                                ? scheduleForm.assignedStaff.filter(name => name !== member.name)
                                : [...scheduleForm.assignedStaff, member.name];
                              setScheduleForm({ ...scheduleForm, assignedStaff: updated });
                            }}
                            className="rounded border-outline-variant focus:ring-tertiary text-tertiary h-4 w-4 bg-white/3"
                          />
                          <span>{member.name} ({member.role})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs text-outline mb-1 font-semibold uppercase">Instruções / Notas</label>
                <textarea
                  value={scheduleForm.notes}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                  placeholder="Ex: Família solicitou arranjo extra de flores brancas"
                  rows={2}
                  className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                />
              </div>

              <div className="pt-4 border-t border-outline-variant/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setActiveModal(null); setEditingItem(null); }}
                  className="rounded-lg border border-outline-variant/30 px-5 py-2.5 text-sm text-on-surface-variant hover:bg-white/5 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submittingForm}
                  className="rounded-lg bg-tertiary px-6 py-2.5 text-sm font-semibold text-on-tertiary hover:bg-tertiary/90 transition shadow-md"
                >
                  {submittingForm ? "Salvando..." : "Salvar Compromisso"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: INVENTÁRIO / ESTOQUE */}
      {activeModal === "inventory" && (
        <div className="fixed inset-0 z-50 bg-[#000000aa] backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101414] border border-outline-variant/30 rounded-xl max-w-md w-full max-h-[90dvh] overflow-y-auto shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-white/2">
              <h2 className="font-h3 text-xl text-on-surface font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">inventory_2</span>
                {editingItem ? "Editar Artigo" : "Adicionar ao Estoque"}
              </h2>
              <button
                onClick={() => { setActiveModal(null); setEditingItem(null); }}
                className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleInventorySubmit} className="p-6 space-y-4">
              {formError && <p className="text-red-400 text-sm font-medium bg-red-500/10 p-3 rounded">{formError}</p>}
              
              <div>
                <label className="block text-xs text-outline mb-1 font-semibold uppercase">Descrição / Nome do Produto</label>
                <input
                  type="text"
                  required
                  value={inventoryForm.name}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, name: e.target.value })}
                  placeholder="Ex: Urna Imperial de Cedro Luxo"
                  className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                />
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-xs text-outline mb-1 font-semibold uppercase">Categoria</label>
                  <select
                    value={inventoryForm.category}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, category: e.target.value as 'urna' | 'flores' | 'veu' | 'ornamento' | 'livro' | 'outros' })}
                    className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                  >
                    <option value="urna">Urnas / Caixões</option>
                    <option value="flores">Coroas e Flores</option>
                    <option value="veu">Véus e Mortalhas</option>
                    <option value="ornamento">Ornamentação</option>
                    <option value="livro">Livro de Presença</option>
                    <option value="outros">Outros Artigos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-outline mb-1 font-semibold uppercase">Status de Entrada</label>
                  <select
                    value={inventoryForm.status}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, status: e.target.value as 'disponivel' | 'esgotado' | 'reservado' })}
                    className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                  >
                    <option value="disponivel">Disponível</option>
                    <option value="esgotado">Esgotado</option>
                    <option value="reservado">Reservado / Bloqueado</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-xs text-outline mb-1 font-semibold uppercase">Quantidade Inicial</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={inventoryForm.quantity}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, quantity: Number(e.target.value) })}
                    className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-outline mb-1 font-semibold uppercase">Mínimo (Alerta de Reposição)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={inventoryForm.minQuantity}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, minQuantity: Number(e.target.value) })}
                    className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-xs text-outline mb-1 font-semibold uppercase">Preço Venda (R$)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step="0.01"
                    value={inventoryForm.unitPriceBRL}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, unitPriceBRL: Number(e.target.value) })}
                    className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-outline mb-1 font-semibold uppercase">Custo Unitário (R$)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step="0.01"
                    value={inventoryForm.costPriceBRL}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, costPriceBRL: Number(e.target.value) })}
                    className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-outline mb-1 font-semibold uppercase">Ficha / Detalhamento (Opcional)</label>
                <textarea
                  value={inventoryForm.description}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, description: e.target.value })}
                  placeholder="Especificações do fabricante, madeira, forro de cetim, etc."
                  rows={2}
                  className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                />
              </div>

              <div className="pt-4 border-t border-outline-variant/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setActiveModal(null); setEditingItem(null); }}
                  className="rounded-lg border border-outline-variant/30 px-5 py-2.5 text-sm text-on-surface-variant hover:bg-white/5 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submittingForm}
                  className="rounded-lg bg-tertiary px-6 py-2.5 text-sm font-semibold text-on-tertiary hover:bg-tertiary/90 transition shadow-md"
                >
                  {submittingForm ? "Salvando..." : "Salvar Artigo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: STAFF / COLABORADOR */}
      {activeModal === "staff" && (
        <div className="fixed inset-0 z-50 bg-[#000000aa] backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101414] border border-outline-variant/30 rounded-xl max-w-md w-full max-h-[90dvh] overflow-y-auto shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-white/2">
              <h2 className="font-h3 text-xl text-on-surface font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">groups</span>
                {editingItem ? "Editar Cadastro" : "Cadastrar Colaborador"}
              </h2>
              <button
                onClick={() => { setActiveModal(null); setEditingItem(null); }}
                className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleStaffSubmit} className="p-6 space-y-4">
              {formError && <p className="text-red-400 text-sm font-medium bg-red-500/10 p-3 rounded">{formError}</p>}
              
              <div>
                <label className="block text-xs text-outline mb-1 font-semibold uppercase">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  placeholder="Nome do colaborador"
                  className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                />
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-xs text-outline mb-1 font-semibold uppercase">Cargo / Função</label>
                  <select
                    value={staffForm.role}
                    onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value as 'tanatopraxista' | 'cerimonialista' | 'motorista' | 'atendente' | 'gerente' | 'outros' })}
                    className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                  >
                    <option value="tanatopraxista">Tanatopraxista</option>
                    <option value="cerimonialista">Cerimonialista</option>
                    <option value="motorista">Motorista / Translador</option>
                    <option value="atendente">Atendente de Plantão</option>
                    <option value="gerente">Gerente Operacional</option>
                    <option value="outros">Outras Funções</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-outline mb-1 font-semibold uppercase">Comissão Atendimento (%)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={100}
                    value={staffForm.commissionPercent}
                    onChange={(e) => setStaffForm({ ...staffForm, commissionPercent: Number(e.target.value) })}
                    className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-xs text-outline mb-1 font-semibold uppercase">Telefone</label>
                  <input
                    type="text"
                    required
                    value={staffForm.phone}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    placeholder="(99) 99999-9999"
                    className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-outline mb-1 font-semibold uppercase font-medium">Turno de Trabalho</label>
                  <select
                    value={staffForm.schedule}
                    onChange={(e) => setStaffForm({ ...staffForm, schedule: e.target.value as 'manha' | 'tarde' | 'noite' | 'integral' | 'folga' })}
                    className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                  >
                    <option value="manha">Manhã (6h - 12h)</option>
                    <option value="tarde">Tarde (12h - 18h)</option>
                    <option value="noite">Noite / Plantonista (18h - 6h)</option>
                    <option value="integral">Integral / Comercial</option>
                    <option value="folga">Folga Operacional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-outline mb-1 font-semibold uppercase">E-mail</label>
                <input
                  type="email"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  placeholder="colaborador@funeraria.com"
                  className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                />
              </div>

              <div className="pt-4 border-t border-outline-variant/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setActiveModal(null); setEditingItem(null); }}
                  className="rounded-lg border border-outline-variant/30 px-5 py-2.5 text-sm text-on-surface-variant hover:bg-white/5 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submittingForm}
                  className="rounded-lg bg-tertiary px-6 py-2.5 text-sm font-semibold text-on-tertiary hover:bg-tertiary/90 transition shadow-md"
                >
                  {submittingForm ? "Cadastrando..." : "Salvar Colaborador"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: DOCUMENTOS */}
      {activeModal === "document" && (
        <div className="fixed inset-0 z-50 bg-[#000000aa] backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101414] border border-outline-variant/30 rounded-xl max-w-md w-full max-h-[90dvh] overflow-y-auto shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-white/2">
              <h2 className="font-h3 text-xl text-on-surface font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">description</span>
                {editingItem ? "Editar Documento" : "Emitir Registro / Guia"}
              </h2>
              <button
                onClick={() => { setActiveModal(null); setEditingItem(null); }}
                className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleDocumentSubmit} className="p-6 space-y-4">
              {formError && <p className="text-red-400 text-sm font-medium bg-red-500/10 p-3 rounded">{formError}</p>}
              
              {/* Linked Service Selector */}
              {services.length > 0 && (
                <div>
                  <label className="block text-xs text-outline mb-1 font-semibold uppercase">Vincular a um Atendimento de Óbito</label>
                  <select
                    value={documentForm.serviceId}
                    onChange={(e) => setDocumentForm({ ...documentForm, serviceId: e.target.value })}
                    className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                  >
                    <option value="">Nenhum - Registro Geral da Funerária</option>
                    {services.map((svc) => (
                      <option key={svc.id} value={svc.id}>
                        Falecido: {svc.deceasedName} (ob.: {new Date(svc.deceasedDeathDate).toLocaleDateString("pt-BR")})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-xs text-outline mb-1 font-semibold uppercase">Tipo do Documento</label>
                  <select
                    value={documentForm.type}
                    onChange={(e) => setDocumentForm({ ...documentForm, type: e.target.value as 'certidao_obito' | 'autorizacao_sepultamento' | 'autorizacao_cremacao' | 'alvara' | 'guia_translado' | 'outros' })}
                    className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                  >
                    <option value="certidao_obito">Certidão de Óbito</option>
                    <option value="autorizacao_sepultamento">Autorizacao de Sepultamento</option>
                    <option value="autorizacao_cremacao">Autorização de Cremação</option>
                    <option value="alvara">Alvará Judicial</option>
                    <option value="guia_translado">Guia de Translado</option>
                    <option value="outros">Outros Alvarás / Guias</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-outline mb-1 font-semibold uppercase">Status do Documento</label>
                  <select
                    value={documentForm.status}
                    onChange={(e) => setDocumentForm({ ...documentForm, status: e.target.value as 'pendente' | 'emitido' | 'valido' | 'expirado' })}
                    className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                  >
                    <option value="pendente">Pendente / Em Emissão</option>
                    <option value="emitido">Emitido</option>
                    <option value="valido">Válido / Homologado</option>
                    <option value="expirado">Expirado / Inválido</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div className="col-span-2">
                  <label className="block text-xs text-outline mb-1 font-semibold uppercase">Nº de Registro do Cartório / Documento</label>
                  <input
                    type="text"
                    required
                    value={documentForm.documentNumber}
                    onChange={(e) => setDocumentForm({ ...documentForm, documentNumber: e.target.value })}
                    placeholder="Ex: Livro C-045, Folha 123, Termo 546"
                    className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-outline mb-1 font-semibold uppercase">Órgão / Cartório Emissor</label>
                  <input
                    type="text"
                    required
                    value={documentForm.issuer}
                    onChange={(e) => setDocumentForm({ ...documentForm, issuer: e.target.value })}
                    className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-xs text-outline mb-1 font-semibold uppercase">Data de Emissão</label>
                  <input
                    type="date"
                    required
                    value={documentForm.issueDate}
                    onChange={(e) => setDocumentForm({ ...documentForm, issueDate: e.target.value })}
                    className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-outline mb-1 font-semibold uppercase">Data de Vencimento</label>
                  <input
                    type="date"
                    value={documentForm.expiryDate}
                    onChange={(e) => setDocumentForm({ ...documentForm, expiryDate: e.target.value })}
                    className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-outline mb-1 font-semibold uppercase">Anotações do Documento</label>
                <textarea
                  value={documentForm.notes}
                  onChange={(e) => setDocumentForm({ ...documentForm, notes: e.target.value })}
                  placeholder="Observações complementares, averbações etc."
                  rows={2}
                  className="w-full rounded-lg border border-outline-variant/50 bg-white/3 px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none text-sm"
                />
              </div>

              <div className="pt-4 border-t border-outline-variant/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setActiveModal(null); setEditingItem(null); }}
                  className="rounded-lg border border-outline-variant/30 px-5 py-2.5 text-sm text-on-surface-variant hover:bg-white/5 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submittingForm}
                  className="rounded-lg bg-tertiary px-6 py-2.5 text-sm font-semibold text-on-tertiary hover:bg-tertiary/90 transition shadow-md"
                >
                  {submittingForm ? "Emitindo..." : "Salvar Registro"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color?: "green" | "yellow" | "tertiary";
}) {
  const colorMap = {
    green: "text-green-400 border-green-500/20 bg-green-500/5",
    yellow: "text-yellow-400 border-yellow-500/20 bg-yellow-500/5",
    tertiary: "text-tertiary border-tertiary/20 bg-tertiary/5",
  };
  const themeStyles = color ? colorMap[color] : "text-on-surface border-outline-variant/20 bg-white/3";

  return (
    <article className={`rounded-xl border p-5 shadow-sm transition hover:border-tertiary/25 ${themeStyles}`}>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="material-symbols-outlined text-lg">{icon}</span>
        <p className="text-xs uppercase tracking-[0.14em] text-outline font-semibold">{label}</p>
      </div>
      <p className="font-h3 text-2xl font-bold">{value}</p>
    </article>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/2 border border-white/3 p-3 rounded-lg">
      <p className="text-[0.65rem] uppercase tracking-wider text-outline mb-0.5 font-bold">{label}</p>
      <p className="text-on-surface font-medium truncate" title={value}>{value}</p>
    </div>
  );
}

function MemorialRow({ memorial, detailed }: { memorial: ManagedMemorial; detailed?: boolean }) {
  const statusLabel =
    memorial.status === "ativo"
      ? "Ativo"
      : memorial.status === "pending_payment"
      ? "Pagamento Pendente"
      : "Rascunho";

  const statusColor =
    memorial.status === "ativo"
      ? "bg-green-500/20 text-green-400"
      : memorial.status === "pending_payment"
      ? "bg-yellow-500/20 text-yellow-400"
      : "bg-gray-500/20 text-gray-400";

  return (
    <div className="rounded-xl border border-outline-variant/20 bg-[#101414] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-tertiary/30 transition">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
          <span className="material-symbols-outlined text-tertiary">person</span>
          <h3 className="font-semibold text-on-surface truncate">{memorial.name}</h3>
          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor}`}>
            {statusLabel}
          </span>
        </div>
        <p className="text-xs text-on-surface-variant truncate italic">{memorial.epitaph}</p>
        
        {detailed && (
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-outline border-t border-white/5 pt-2.5">
            <span>Visitas: <strong className="text-on-surface">{memorial.visits}</strong></span>
            {memorial.deathDate && (
              <span>Falecimento: <strong className="text-on-surface">{new Date(memorial.deathDate).toLocaleDateString("pt-BR")}</strong></span>
            )}
            <span>Criado: <strong className="text-on-surface">{new Date(memorial.createdAt).toLocaleDateString("pt-BR")}</strong></span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5 justify-between">
        <div className="flex items-center gap-1.5 text-xs">
          {memorial.qrUnlocked ? (
            <span className="inline-flex items-center gap-1.5 text-green-400 font-semibold bg-green-500/10 px-2.5 py-1 rounded-full">
              <span className="material-symbols-outlined text-base">qr_code_2</span>
              Liberado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-yellow-400 font-semibold bg-yellow-500/10 px-2.5 py-1 rounded-full">
              <span className="material-symbols-outlined text-base">lock</span>
              Pendente
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
