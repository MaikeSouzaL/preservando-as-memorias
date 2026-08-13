import { Suspense } from "react";
import { FunerariasPageClient } from "@/src/components/owner/funerarias-page-client";

export const dynamic = "force-dynamic";

export default function OwnerFunerariasPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-on-surface-variant">Carregando...</p>}>
      <FunerariasPageClient />
    </Suspense>
  );
}
