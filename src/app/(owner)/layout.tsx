import { redirect } from "next/navigation";
import { getAuthSession } from "@/src/lib/auth-session";
import { OwnerShell } from "@/src/components/owner/owner-shell";

type OwnerRootLayoutProps = {
  children: React.ReactNode;
};

export default async function OwnerRootLayout({ children }: OwnerRootLayoutProps) {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  if (!session.isDevAdmin) {
    redirect("/dashboard");
  }

  return <OwnerShell>{children}</OwnerShell>;
}
