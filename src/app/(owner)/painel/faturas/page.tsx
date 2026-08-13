import { Suspense } from "react";
import { InvoicesPageClient } from "@/src/components/owner/invoices-page-client";

export const dynamic = "force-dynamic";

export default function OwnerInvoicesPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-on-surface-variant">Carregando...</p>}>
      <InvoicesPageClient />
    </Suspense>
  );
}
