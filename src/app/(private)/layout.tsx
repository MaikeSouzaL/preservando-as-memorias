import { redirect } from "next/navigation";
import { getAuthSession } from "@/src/lib/auth-session";
import { PrivateShell } from "@/src/components/private/private-shell";

type PrivateRootLayoutProps = {
  children: React.ReactNode;
};

export default async function PrivateRootLayout({ children }: PrivateRootLayoutProps) {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <PrivateShell isDevAdmin={session.isDevAdmin} isAdmin={session.isAdmin}>
      {children}
    </PrivateShell>
  );
}
