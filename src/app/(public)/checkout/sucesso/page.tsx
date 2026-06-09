"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SucessoContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") ?? "";

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#101414] px-4 py-20 text-[#e0e3e2]">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-[#e9c349]/3 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-[#e9c349]/20 bg-[#1c2020]/80 p-8 text-center shadow-2xl backdrop-blur-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#e9c349]/10 text-[#e9c349]">
          <span className="material-symbols-outlined text-4xl">check_circle</span>
        </div>

        <h1 className="font-h2 text-3xl font-light text-[#e5e2e1]">Pagamento confirmado</h1>
        <p className="mt-4 text-[#c4c7c7]">
          Seu pagamento foi processado com sucesso pelo Stripe.
          {orderId ? (
            <>
              {" "}O pedido <strong className="text-[#e9c349]">{orderId}</strong> já está ativo.
            </>
          ) : null}
        </p>

        <p className="mt-3 text-sm text-[#c4c7c7]/60">
          Você receberá um e-mail de confirmação em breve.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="block w-full rounded-full bg-[#e9c349] py-3 text-center text-xs font-semibold uppercase tracking-widest text-[#1c1b1b] transition hover:bg-[#ffe088]"
          >
            Ir para o dashboard
          </Link>
          <Link
            href="/"
            className="block w-full rounded-full border border-white/10 py-3 text-center text-xs font-semibold uppercase tracking-widest text-[#c4c7c7] transition hover:border-white/20"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSucessoPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#101414] text-[#e9c349]">
        <span className="text-xs uppercase tracking-widest">Carregando...</span>
      </div>
    }>
      <SucessoContent />
    </Suspense>
  );
}
