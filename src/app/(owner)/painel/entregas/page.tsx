import { Suspense } from "react";
import { QrDeliveriesPageClient } from "@/src/components/owner/qr-deliveries-page-client";

export const dynamic = "force-dynamic";

export default function OwnerDeliveriesPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-on-surface-variant">Carregando...</p>}>
      <QrDeliveriesPageClient />
    </Suspense>
  );
}
