import { Suspense } from "react";
import { ConvitesPageClient } from "@/src/components/admin/convites-page-client";

export const dynamic = "force-dynamic";

export default function AdminConvitesPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-on-surface-variant">Carregando...</p>}>
      <ConvitesPageClient />
    </Suspense>
  );
}
