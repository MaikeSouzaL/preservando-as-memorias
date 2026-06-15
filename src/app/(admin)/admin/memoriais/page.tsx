import { readPlatformData } from "@/src/lib/platform-data";
import { getAuthSession } from "@/src/lib/auth-session";
import { MemoriaisPageClient } from "@/src/components/admin/memoriais-page-client";

export const dynamic = "force-dynamic";

export default async function AdminMemorialsPage() {
  const [data, session] = await Promise.all([readPlatformData(), getAuthSession()]);

  return (
    <MemoriaisPageClient
      memorials={data.memorials}
      adminUserId={session?.userId ?? ""}
    />
  );
}
