import { readPlatformData } from "@/src/lib/platform-data";
import { MemoriaisPageClient } from "@/src/components/admin/memoriais-page-client";

export const dynamic = "force-dynamic";

export default async function AdminMemorialsPage() {
  const data = await readPlatformData();

  return <MemoriaisPageClient memorials={data.memorials} />;
}
