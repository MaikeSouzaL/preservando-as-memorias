import { Suspense } from "react";
import { BillingPlansPageClient } from "@/src/components/owner/billing-plans-page-client";

export const dynamic = "force-dynamic";

export default function OwnerBillingPlansPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-on-surface-variant">Carregando...</p>}>
      <BillingPlansPageClient />
    </Suspense>
  );
}
