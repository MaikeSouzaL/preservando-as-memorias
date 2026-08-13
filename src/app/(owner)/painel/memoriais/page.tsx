import { readPlatformData } from "@/src/lib/platform-data";
import { MemoriaisPageClient } from "@/src/components/owner/memoriais-page-client";

export const dynamic = "force-dynamic";

export default async function OwnerMemoriaisPage() {
  const data = await readPlatformData();

  return <MemoriaisPageClient memorials={data.memorials} />;
}
