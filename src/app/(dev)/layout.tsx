import { redirect } from "next/navigation";
import { getAuthSession } from "@/src/lib/auth-session";
import { isDevAdmin } from "@/src/lib/dev-auth";

export default async function DevRootLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession();

  if (!session) redirect("/login");
  if (!isDevAdmin(session.email)) redirect("/dashboard");

  return <>{children}</>;
}
