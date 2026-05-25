import { redirect } from "next/navigation";
import { getAuthSession } from "@/src/lib/auth-session";

type ScreenLayoutProps = {
  children: React.ReactNode;
};

export default async function ScreenLayout({ children }: ScreenLayoutProps) {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  if (!session.isAdmin) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
