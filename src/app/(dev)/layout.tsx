import { redirect } from "next/navigation";
import { getAuthSession } from "@/src/lib/auth-session";

export default async function DevRootLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession();

  if (!session) redirect("/login");
  if (!session.isDevAdmin) redirect("/dashboard");

  return <>{children}</>;
}
