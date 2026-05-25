"use client";

type SuccessModalProps = {
  isOpen: boolean;
  type: "tribute" | "candle" | "flower" | null;
  memorialName: string;
  onClose: () => void;
};

export default function SuccessModal({ isOpen, type, memorialName, onClose }: SuccessModalProps) {
  if (!isOpen || !type) return null;

  const content = {
    tribute: {
      icon: "favorite",
      title: "Homenagem registrada",
      message: (
        <>
          Sua homenagem para <strong>{memorialName}</strong> foi enviada para moderação e aparecerá no memorial após aprovação.
        </>
      ),
    },
    candle: {
      icon: "local_fire_department",
      title: "Vela virtual acesa",
      message: (
        <>
          A vela para <strong>{memorialName}</strong> foi acesa no altar virtual e permanece registrada neste memorial.
        </>
      ),
    },
    flower: {
      icon: "local_florist",
      title: "Flores enviadas",
      message: (
        <>
          Suas flores virtuais foram enviadas em memória de <strong>{memorialName}</strong>.
        </>
      ),
    },
  }[type];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" onClick={onClose} />

      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-[#e9c349]/20 bg-[#1c2020] p-8 text-center shadow-2xl animate-fade-in">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#e9c349]/30 bg-[#e9c349]/10 shadow-[0_0_20px_rgba(233,195,73,0.2)]">
            <span className="material-symbols-outlined text-3xl text-[#e9c349]">{content.icon}</span>
          </div>
        </div>

        <h3 className="mb-4 font-h3 text-xl uppercase tracking-wider text-[#e9c349]">{content.title}</h3>

        <p className="mb-8 text-sm leading-relaxed text-[#c4c7c7] font-body-md">{content.message}</p>

        <button
          onClick={onClose}
          className="w-full rounded-full bg-[#e9c349] py-3 font-label-caps text-xs font-semibold uppercase tracking-widest text-[#101414] transition hover:bg-[#ffe088]"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
